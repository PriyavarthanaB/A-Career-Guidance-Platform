import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Pause, Play, StopCircle, RotateCcw, AlertTriangle, Volume2, User, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

const SUPPORTED_AUDIO_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

const formatDuration = (durationMs) => {
  const seconds = Math.max(0, Math.floor(durationMs / 1000));
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

export default function InterviewRecorder({
  onRecordingReady,
  onStatusChange,
  onTranscriptUpdate,
  label = 'Voice Answer Capture',
}) {
  const [status, setStatus] = useState('idle'); // idle | requesting | recording | paused | stopped | error
  const [micLevel, setMicLevel] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState('');
  const [error, setError] = useState('');
  const [supportedMime, setSupportedMime] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recorderStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const supported = SUPPORTED_AUDIO_TYPES.find((type) =>
      typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)
    );
    setSupportedMime(supported || '');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSpeechSupported(Boolean(SpeechRecognition));
  }, []);

  const cleanupMedia = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recorderStreamRef.current) {
      recorderStreamRef.current.getTracks().forEach((track) => track.stop());
      recorderStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupMedia();
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
  }, [cleanupMedia, recordedUrl]);

  const computeMicLevel = useCallback(() => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < bufferLength; i += 1) {
      const value = dataArray[i] - 128;
      sum += value * value;
    }
    const rms = Math.sqrt(sum / bufferLength) / 128;
    setMicLevel(Math.min(1, rms * 2.5));
    animationFrameRef.current = requestAnimationFrame(computeMicLevel);
  }, []);

  const openStream = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Browser does not support microphone capture. Please use Text Mode.');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      return stream;
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Microphone permission denied. Please allow microphone access in browser settings or switch to Text Mode.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('No microphone hardware detected on your device. Please use Text Mode.');
      } else {
        throw new Error(err.message || 'Unable to access microphone.');
      }
    }
  }, []);

  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let accumulatedText = '';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        const cleaned = currentTranscript.trim();
        setTranscript(cleaned);
        if (onTranscriptUpdate) {
          onTranscriptUpdate(cleaned);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to start SpeechRecognition:', err.message);
    }
  }, [onTranscriptUpdate]);

  const startRecording = useCallback(async () => {
    setError('');
    if (status === 'recording') return;

    setStatus('requesting');
    try {
      const stream = await openStream();
      if (!stream) throw new Error('Unable to access microphone.');

      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) throw new Error('No microphone track found.');

      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (_) {}
      }
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
      source.connect(analyser);
      computeMicLevel();

      const recorderStream = new MediaStream([audioTrack]);
      recorderStreamRef.current = recorderStream;
      audioChunksRef.current = [];
      startTimeRef.current = new Date();
      setDurationMs(0);
      setTranscript('');

      const mimeType = supportedMime || undefined;
      const mediaRecorder = new MediaRecorder(recorderStream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error', event.error);
        setError('Recording error: ' + (event.error?.message || 'Unexpected failure.'));
        setStatus('error');
        if (onStatusChange) onStatusChange('error');
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          setError('No audio was recorded. Please try again.');
          setStatus('idle');
          if (onStatusChange) onStatusChange('idle');
          return;
        }
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        const endedAt = new Date();
        const duration = endedAt - startTimeRef.current;
        setDurationMs(duration);
        if (onRecordingReady) {
          onRecordingReady(blob, {
            startedAt: startTimeRef.current.toISOString(),
            endedAt: endedAt.toISOString(),
            durationMs: duration,
            mimeType: blob.type,
            audioUrl: url,
            transcript,
          });
        }
      };

      mediaRecorder.start(250);
      startSpeechRecognition();

      setStatus('recording');
      if (onStatusChange) onStatusChange('recording');

      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          setDurationMs(new Date() - startTimeRef.current);
        }
      }, 250);
    } catch (err) {
      console.error('InterviewRecorder error:', err);
      setError(err.message || 'Unable to open microphone.');
      setStatus('error');
      if (onStatusChange) onStatusChange('error');
    }
  }, [computeMicLevel, onRecordingReady, onStatusChange, openStream, startSpeechRecognition, supportedMime, status, transcript]);

  const pauseRecording = useCallback(() => {
    if (!mediaRecorderRef.current || status !== 'recording') return;
    try {
      mediaRecorderRef.current.pause();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setStatus('paused');
      if (onStatusChange) onStatusChange('paused');
    } catch (err) {
      console.error('Pause failed', err);
      setError('Unable to pause recording.');
    }
  }, [onStatusChange, status]);

  const resumeRecording = useCallback(() => {
    if (!mediaRecorderRef.current || status !== 'paused') return;
    try {
      mediaRecorderRef.current.resume();
      startSpeechRecognition();
      setStatus('recording');
      if (onStatusChange) onStatusChange('recording');
    } catch (err) {
      console.error('Resume failed', err);
      setError('Unable to resume recording.');
    }
  }, [onStatusChange, startSpeechRecognition, status]);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || status === 'idle' || status === 'stopped') return;
    try {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    } catch (err) {
      console.error('Stop failed', err);
      setError('Unable to stop recording.');
      return;
    }
    setStatus('stopped');
    if (onStatusChange) onStatusChange('stopped');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [onStatusChange, status]);

  const resetRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    cleanupMedia();
    audioChunksRef.current = [];
    setStatus('idle');
    setMicLevel(0);
    setDurationMs(0);
    setTranscript('');
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl('');
    }
    setError('');
    if (onStatusChange) onStatusChange('idle');
  }, [cleanupMedia, onStatusChange, recordedUrl]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {label}
            </span>
            {isSpeechSupported && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Speech-to-Text Active
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-base font-extrabold text-slate-900">Voice Response Mode</h3>
        </div>
        
        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1 rounded-full border border-slate-200 text-xs font-black flex items-center gap-2 bg-slate-50 shadow-2xs">
            {status === 'recording' ? (
              <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Live Recording
              </span>
            ) : status === 'requesting' ? (
              <span className="text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin text-amber-500" /> Connecting Mic...
              </span>
            ) : status === 'paused' ? (
              <span className="text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200">
                Paused
              </span>
            ) : status === 'stopped' ? (
              <span className="text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Audio Captured
              </span>
            ) : (
              <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                Ready to Record
              </span>
            )}
            <span className="font-mono text-xs text-slate-700 font-black">{formatDuration(durationMs)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Visualizer & Mic Meter (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Mic className={`h-4 w-4 ${status === 'recording' ? 'text-emerald-600 animate-pulse' : 'text-blue-600'}`} />
              <span>Microphone Input Level</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600">{formatDuration(durationMs)}</span>
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="flex items-end justify-center gap-2 h-16 my-2 bg-white rounded-xl p-3 border border-slate-200/60 shadow-inner">
            {[...Array(9)].map((_, idx) => {
              const threshold = (idx + 1) / 9;
              const active = micLevel >= threshold * 0.35;
              const barHeight = status === 'recording'
                ? Math.max(10, Math.min(48, micLevel * 55 * (1 + (idx % 3) * 0.25)))
                : 8;
              return (
                <div
                  key={idx}
                  className={`w-3.5 rounded-full transition-all duration-100 ${
                    status === 'recording'
                      ? active
                        ? 'bg-gradient-to-t from-blue-600 to-indigo-500 shadow-xs'
                        : 'bg-blue-200'
                      : 'bg-slate-200'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
              );
            })}
          </div>

          {/* Speech-to-Text Live Preview */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
              <span className="flex items-center gap-1.5 text-blue-600">
                <Sparkles className="h-3 w-3" /> Live Transcribed Answer
              </span>
              <span>{isSpeechSupported ? 'Web Speech Engine' : 'Syncing'}</span>
            </div>
            <p className="text-xs text-slate-800 font-medium italic min-h-[36px] max-h-[72px] overflow-y-auto leading-relaxed">
              {transcript
                ? `"${transcript}"`
                : status === 'recording'
                  ? 'Listening... Speak your answer now.'
                  : 'Start recording to automatically transcribe your spoken answer into text.'}
            </p>
          </div>
        </div>

        {/* Controls & Playback (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Audio Controls</span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={startRecording}
                disabled={status === 'recording' || status === 'requesting'}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black py-3 px-3 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-40 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" /> Start Recording
              </button>

              <button
                type="button"
                onClick={status === 'paused' ? resumeRecording : pauseRecording}
                disabled={status !== 'recording' && status !== 'paused'}
                className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold py-3 px-3 transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
              >
                {status === 'paused' ? (
                  <> <Play className="h-3.5 w-3.5 text-emerald-600" /> Resume </>
                ) : (
                  <> <Pause className="h-3.5 w-3.5 text-amber-600" /> Pause </>
                )}
              </button>

              <button
                type="button"
                onClick={stopRecording}
                disabled={status !== 'recording' && status !== 'paused'}
                className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-black py-3 px-3 transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
              >
                <StopCircle className="h-3.5 w-3.5" /> Stop &amp; Save
              </button>

              <button
                type="button"
                onClick={resetRecording}
                className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold py-3 px-3 transition-all cursor-pointer shadow-2xs"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Re-record
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-start gap-2 leading-relaxed">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Audio Playback Controls */}
          {recordedUrl && (
            <div className="rounded-xl bg-white border border-slate-200 p-3 space-y-2 shadow-xs">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Audio Playback Ready ({formatDuration(durationMs)})
              </p>
              <audio controls className="w-full h-8" src={recordedUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
