import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Square, Sparkles, Volume2, AlertCircle, Trash2 } from "lucide-react";

/**
 * VoiceRecorder Component using Web Speech API
 * 
 * Props:
 * - onTranscriptChange: (transcript: string) => void  (Live update callback)
 * - onFinalTranscript: (transcript: string) => void   (Triggered when recording stops)
 * - silenceDelay: number (ms to wait after silence before auto-stopping, default: 3500)
 * - autoStopOnSilence: boolean (default: true)
 */
export default function VoiceRecorder({
  onTranscriptChange,
  onFinalTranscript,
  silenceDelay = 3500,
  autoStopOnSilence = true,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isRecordingRef = useRef(false);

  // Check browser Web Speech API support on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Web Speech API is not supported in this browser. Please try Google Chrome or Edge.");
    }
  }, []);

  // Clear silence timer helper
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Stop recording handler
  const stopRecording = useCallback(() => {
    clearSilenceTimer();
    isRecordingRef.current = false;
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    setTranscript((finalText) => {
      const trimmed = finalText.trim();
      if (onFinalTranscript) {
        onFinalTranscript(trimmed);
      }
      return finalText;
    });

    setInterimText("");
  }, [clearSilenceTimer, onFinalTranscript]);

  // Reset silence timer on speech input
  const resetSilenceTimer = useCallback(() => {
    if (!autoStopOnSilence) return;
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      stopRecording();
    }, silenceDelay);
  }, [autoStopOnSilence, silenceDelay, clearSilenceTimer, stopRecording]);

  // Start recording handler
  const startRecording = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Web Speech API is not supported in your browser.");
      return;
    }

    setError(null);
    setTranscript("");
    setInterimText("");

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        isRecordingRef.current = true;
        resetSilenceTimer();
      };

      recognition.onresult = (event) => {
        resetSilenceTimer(); // Activity detected -> reset silence countdown

        let finalAccumulated = "";
        let currentInterim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            finalAccumulated += text + " ";
          } else {
            currentInterim += text;
          }
        }

        if (finalAccumulated) {
          setTranscript((prev) => {
            const updated = prev + finalAccumulated;
            if (onTranscriptChange) {
              onTranscriptChange(updated.trim());
            }
            return updated;
          });
        }

        setInterimText(currentInterim);
      };

      recognition.onerror = (event) => {
        console.warn("Speech Recognition Error:", event.error);
        if (event.error === "no-speech") {
          // Handled by silence detection
          return;
        }
        if (event.error === "not-allowed") {
          setError("Microphone permission denied. Please allow microphone access.");
        } else {
          setError(`Speech error: ${event.error}`);
        }
        stopRecording();
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          // If ended unexpectedly while still supposed to record, restart
          try {
            recognition.start();
          } catch (_) {
            stopRecording();
          }
        } else {
          setIsRecording(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to initialize SpeechRecognition:", err);
      setError("Could not access microphone.");
      stopRecording();
    }
  }, [resetSilenceTimer, stopRecording, onTranscriptChange]);

  // Clean up timers & recognition on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [clearSilenceTimer]);

  const handleClear = () => {
    setTranscript("");
    setInterimText("");
    if (onTranscriptChange) onTranscriptChange("");
  };

  const combinedDisplay = (transcript + " " + interimText).trim();

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-5 shadow-xs">
      
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              isRecording
                ? "bg-rose-100 text-rose-600 animate-pulse"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <Volume2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-[#0b1c30]">
              Voice Input Recorder
            </h4>
            <p className="text-xs text-slate-500">
              {isRecording
                ? "Listening... Auto-stops after silence"
                : "Click Start to record your answer via Speech-to-Text"}
            </p>
          </div>
        </div>

        {/* Start / Stop CTA Buttons */}
        <div className="flex items-center gap-2">
          {transcript && !isRecording && (
            <button
              onClick={handleClear}
              type="button"
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Clear Transcript"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {!isRecording ? (
            <button
              onClick={startRecording}
              type="button"
              disabled={!isSupported}
              className="flex items-center gap-2 bg-[#004ac6] hover:bg-[#1a56d6] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Mic className="h-4 w-4" /> Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              type="button"
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition animate-pulse cursor-pointer"
            >
              <Square className="h-4 w-4 fill-current" /> Stop Recording
            </button>
          )}
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Recording Soundwave Indicator Bar */}
      {isRecording && (
        <div className="flex items-center gap-3 bg-rose-50/70 border border-rose-200/80 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-700">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>Recording Live Speech...</span>
          <div className="flex items-center gap-1 ml-auto">
            <span className="w-1 h-4 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-3 bg-rose-400 rounded-full animate-bounce" />
          </div>
        </div>
      )}

      {/* Live Transcript Stream Box */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-500">
          <span>Live Transcript</span>
          {isRecording && (
            <span className="text-blue-600 font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3 animate-spin" /> Auto-silence timer active
            </span>
          )}
        </div>

        <div className="min-h-[120px] max-h-[220px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-900 leading-relaxed">
          {combinedDisplay ? (
            <p>
              <span>{transcript}</span>
              {interimText && (
                <span className="text-blue-600 italic font-normal">
                  {" "}
                  {interimText}
                </span>
              )}
            </p>
          ) : (
            <p className="text-slate-400 italic">
              {isRecording
                ? "Listening... Speak clearly into your microphone."
                : "No transcript recorded yet. Click 'Start Recording' above."}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
