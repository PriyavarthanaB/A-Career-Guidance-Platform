import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic2, Pause, Play, StopCircle, RotateCcw, AlertTriangle, Volume2, User } from 'lucide-react';

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
  label = 'Answer Recording',
}) {
  const [status, setStatus] = useState('idle');
  const [micLevel, setMicLevel] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState('');
  const [error, setError] = useState('');
  const [supportedMime, setSupportedMime] = useState('');

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recorderStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const supported = SUPPORTED_AUDIO_TYPES.find((type) =>
      typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)
    );
    setSupportedMime(supported || '');
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
    setMicLevel(Math.min(1, rms));
    animationFrameRef.current = requestAnimationFrame(computeMicLevel);
  }, []);

  const openStream = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Browser does not support microphone capture.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;
    return stream;
  }, []);

  const startRecording = useCallback(async () => {
    setError('');
    if (status === 'recording') {
      return;
    }

    try {
      const stream = await openStream();
      if (!stream) {
        throw new Error('Unable to access microphone.');
      }

      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        throw new Error('No microphone track found.');
      }

      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (_) {}
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
        setError('Recording error: ' + event.error?.message || 'Unexpected recording failure.');
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
          });
        }
      };

      mediaRecorder.start();
      setStatus('recording');
      if (onStatusChange) onStatusChange('recording');

      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          setDurationMs(new Date() - startTimeRef.current);
        }
      }, 250);
    } catch (err) {
      console.error('InterviewRecorder openStream error', err);
      setError(err.message || 'Unable to open microphone.');
      setStatus('error');
      if (onStatusChange) onStatusChange('error');
    }
  }, [computeMicLevel, onRecordingReady, onStatusChange, openStream, supportedMime, status]);

  const pauseRecording = useCallback(() => {
    if (!mediaRecorderRef.current || status !== 'recording') return;
    try {
      mediaRecorderRef.current.pause();
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
      setStatus('recording');
      if (onStatusChange) onStatusChange('recording');
    } catch (err) {
      console.error('Resume failed', err);
      setError('Unable to resume recording.');
    }
  }, [onStatusChange, status]);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || status === 'idle') return;
    try {
      mediaRecorderRef.current.stop();
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
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl('');
    }
    setError('');
    if (onStatusChange) onStatusChange('idle');
  }, [cleanupMedia, onStatusChange, recordedUrl]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">{label}</p>
          <h3 className="mt-3 text-xl font-black text-[#0b1c30]">Live Audio Capture</h3>
          <p className="mt-2 text-sm text-slate-500">Use your microphone and optional webcam preview to answer questions naturally.</p>
        </div>
        <div className="rounded-3xl bg-slate-50 border border-slate-200 px-4 py-3 text-right">
          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">Status</p>
          <p className="mt-2 text-sm font-black text-[#0b1c30]">{status === 'recording' ? 'Recording' : status === 'paused' ? 'Paused' : status === 'stopped' ? 'Captured' : 'Ready'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-4">
        <div className="space-y-4">
          <div className="min-h-[220px] rounded-3xl border border-slate-200 bg-slate-50 p-4 overflow-hidden">
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-slate-500">
              <User className="h-12 w-12 text-[#004ac6]" />
              <p className="font-semibold text-[#0b1c30]">Audio-only recording</p>
              <p className="text-xs text-slate-400 text-center">Your voice is being captured for AI review. No video camera is required.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-600">
              <span>Microphone level</span>
              <span>{formatDuration(durationMs)}</span>
            </div>
            <div className="mt-4 flex items-end gap-2 h-14">
              {[...Array(5)].map((_, idx) => {
                const threshold = (idx + 1) / 5;
                return (
                  <div
                    key={idx}
                    className={`h-full w-full rounded-full transition-all ${micLevel >= threshold ? 'bg-[#004ac6]' : 'bg-slate-200'}`}
                    style={{ minHeight: `${10 + threshold * 40}px` }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Audio Output</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {status === 'recording' && (
                <div className="rounded-2xl bg-[#ecf5ff] p-3 text-blue-700 text-sm font-bold">Live recording in progress</div>
              )}
              {status === 'paused' && (
                <div className="rounded-2xl bg-[#fff7ed] p-3 text-amber-700 text-sm font-bold">Recording paused</div>
              )}
              {status === 'stopped' && recordedUrl && (
                <div className="rounded-2xl bg-[#eefcf3] p-3 text-emerald-700 text-sm font-bold">Recording ready to submit</div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0b1c30]">
                <Mic2 className="h-4 w-4" /> Controls
              </div>
              <div className="text-xs text-slate-400">{supportedMime ? supportedMime : 'Audio support detected'}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={startRecording}
                className="rounded-2xl bg-[#004ac6] px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-[#003bb0] transition"
                disabled={status === 'recording'}
              >
                <Play className="h-4 w-4" /> Start
              </button>
              <button
                type="button"
                onClick={status === 'paused' ? resumeRecording : pauseRecording}
                className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-extrabold text-[#0b1c30] shadow-sm hover:bg-slate-100 transition"
                disabled={status !== 'recording' && status !== 'paused'}
              >
                {status === 'paused' ? (
                  <span className="inline-flex items-center gap-2"><Play className="h-4 w-4" /> Resume</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><Pause className="h-4 w-4" /> Pause</span>
                )}
              </button>
              <button
                type="button"
                onClick={stopRecording}
                className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-extrabold text-rose-700 shadow-sm hover:bg-rose-100 transition"
                disabled={status !== 'recording' && status !== 'paused'}
              >
                <StopCircle className="h-4 w-4" /> Stop
              </button>
              <button
                type="button"
                onClick={resetRecording}
                className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-extrabold text-[#0b1c30] shadow-sm hover:bg-slate-100 transition"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>

            {error && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {recordedUrl && (
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Playback</p>
                <audio controls className="mt-2 w-full" src={recordedUrl} />
                <p className="mt-2 text-xs text-slate-500">{formatDuration(durationMs)} recorded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
