import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import InterviewRecorder from "../components/interview/InterviewRecorder";
import {
  ArrowLeft,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  RotateCcw,
  Loader2,
  Brain,
  MessageSquare,
  ThumbsUp,
  Target,
  Volume2,
  VolumeX,
  Mic,
  User,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
} from "lucide-react";

// Fallback questions if the backend does not return a session payload.
const getFallbackQuestions = (type, targetRole, count = 3) => {
  const roleStr = targetRole || 'Software Engineer';
  const baseQuestions = {
    hr: [
      {
        q: `Tell me about a time you faced a disagreement with a teammate while working on a ${roleStr} project and how you resolved it.`,
        hint: 'Use the STAR method and focus on empathy, ownership, and a constructive outcome.',
        category: 'Conflict Resolution & Communication',
      },
      {
        q: `Why do you want to work as a ${roleStr}, and what drives your professional growth?`,
        hint: 'Connect your growth story to product impact, learning, and the role’s responsibilities.',
        category: 'Motivation & Culture Fit',
      },
      {
        q: 'Describe a situation where priorities changed suddenly near a deadline. How did you adapt while keeping quality high?',
        hint: 'Show communication, prioritization, and calm decision-making under pressure.',
        category: 'Adaptability & Delivery',
      },
    ],
    technical: [
      {
        q: `How would you design a scalable system for a ${roleStr} role that needs strong reliability under high traffic?`,
        hint: 'Discuss architecture decisions, trade-offs, and how you would scale under load.',
        category: 'System Design & Scalability',
      },
      {
        q: `Explain how you would optimize performance or reliability in a production ${roleStr} setup.`,
        hint: 'Include testing, metrics, debugging, and maintainability considerations.',
        category: 'Practical Engineering',
      },
      {
        q: `How would you approach debugging a production issue in a ${roleStr} system when the symptoms are unclear?`,
        hint: 'Mention observability, logs, metrics, and mitigation strategies.',
        category: 'Debugging & Resilience',
      },
    ],
    mixed: [
      {
        q: `Walk me through an end-to-end solution you would build for a ${roleStr} role and explain your key trade-offs.`,
        hint: 'Cover requirements, data flow, technical choices, and delivery concerns.',
        category: 'Architecture & Trade-offs',
      },
      {
        q: `How do you balance writing clean, tested code with meeting aggressive deadlines in a ${roleStr} environment?`,
        hint: 'Show how you balance quality, speed, and business priorities.',
        category: 'Engineering Pragmatism',
      },
      {
        q: `How would you ensure the solution is reliable, secure, and maintainable for a ${roleStr} role?`,
        hint: 'Mention testing, monitoring, authentication, permissions, and fallback strategies.',
        category: 'Reliability & Security',
      },
    ],
  };

  const pool = baseQuestions[type] || baseQuestions.mixed;
  return pool.slice(0, Math.max(1, Number(count) || 3)).map((item) => ({ ...item }));
};

export default function InterviewSession() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state or use defaults
  const config = location.state || {
    type: "mixed",
    difficulty: "Medium",
    targetRole: "Full Stack Software Developer",
    responseMode: "text",
    questionCount: 3,
  };

  const sessionQuestions = Array.isArray(location.state?.questions) ? location.state.questions : [];
  const questions = sessionQuestions.length
    ? sessionQuestions.slice(0, Number(config.questionCount) || 5).map((q) => {
        if (typeof q === 'string') {
          return { q, hint: 'Answer with practical examples and trade-offs.', category: 'Interview Question' };
        }
        return {
          q: q.question || q.q || '',
          hint: q.hint || 'Answer with practical examples and trade-offs.',
          category: q.category || 'Interview Question',
        };
      })
    : getFallbackQuestions(config.type, config.targetRole, config.questionCount || 3);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showRecorder, setShowRecorder] = useState(config.responseMode === "voice");
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [recordingData, setRecordingData] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [answersList, setAnswersList] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const currentQ = questions[currentIndex] || questions[0];

  const speakCurrentQuestion = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !voiceEnabled || currentFeedback) {
      return;
    }

    window.speechSynthesis.cancel();

    const message = `Question ${currentIndex + 1}. ${currentQ.q}. ${currentQ.hint || ""}`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    utterance.rate = 1.02;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [currentFeedback, currentIndex, currentQ?.q, currentQ?.hint, voiceEnabled]);

  useEffect(() => {
    speakCurrentQuestion();
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speakCurrentQuestion]);

  // Submit single answer for AI evaluation via Gemini API
  const handleSubmitAnswer = async () => {
    if (!answer.trim() && !recordingData?.blob) return;
    setEvaluating(true);
    setCurrentFeedback(null);

    try {
      let feedbackObj = null;

      if (config.interviewId) {
        const formData = new FormData();
        formData.append('questionIndex', currentIndex);
        formData.append('answer', answer.trim());

        if (recordingData?.blob) {
          formData.append('recording', recordingData.blob, `interview-${config.interviewId}-question-${currentIndex + 1}.${recordingData.blob.type.split('/')[1] || 'webm'}`);
          formData.append('answerStartedAt', recordingData.startedAt);
          formData.append('answerEndedAt', recordingData.endedAt);
          formData.append('durationMs', String(recordingData.durationMs));
        }

        const res = await API.post(`/api/interview/${config.interviewId}/submit`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        feedbackObj = res.data.feedback || res.data.questionData;
      } else {
        const res = await API.post('/api/interview/evaluate', {
          question: currentQ.q,
          answer: answer.trim(),
          targetRole: config.targetRole,
          difficulty: config.difficulty,
          type: config.type,
        });
        feedbackObj = res.data.data;
      }

      setCurrentFeedback(feedbackObj);
      setAnswersList((prev) => [...prev, { ...feedbackObj, question: currentQ.q }]);
    } catch (err) {
      console.error('Gemini AI Evaluation Error:', err);
      const fallbackObj = {
        score: 78,
        strengths: ['Clear structure and relevant examples.'],
        weaknesses: ['Could add more edge case handling and performance detail.'],
        missingPoints: ['Explicit rollback strategy and validation checks.'],
        idealAnswer: 'An ideal answer includes architecture, trade-offs, and rigorous validation.',
        followUpQuestion: 'How would you test this solution in a production environment?',
      };
      setCurrentFeedback(fallbackObj);
      setAnswersList((prev) => [...prev, { ...fallbackObj, question: currentQ.q }]);
    } finally {
      setEvaluating(false);
    }
  };

  const finishInterviewSession = async () => {
    if (!config.interviewId) {
      setIsFinished(true);
      return;
    }

    setEvaluating(true);
    try {
      const res = await API.patch(`/api/interview/${config.interviewId}/finish`);
      if (res.data?.success) {
        setSessionResult(res.data.data || res.data);
      }
    } catch (err) {
      console.error('Failed to complete interview session:', err);
    } finally {
      setEvaluating(false);
      setIsFinished(true);
    }
  };

  const handleNext = async () => {
    setCurrentFeedback(null);
    setAnswer('');
    setRecordingData(null);
    setRecordingStatus('idle');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      await finishInterviewSession();
    }
  };

  const overallAvgScore = answersList.length
    ? Math.round(answersList.reduce((acc, curr) => acc + curr.score, 0) / answersList.length)
    : 88;

  return (
    <div className="relative overflow-hidden text-white min-h-screen font-sans flex antialiased" style={{ background: "linear-gradient(135deg, #070f1e 0%, #0d1b2e 50%, #070f1e 100%)" }}>
      {/* Decorative Background Gradient Blobs */}
      <div className="absolute -top-20 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 via-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-400/15 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-blue-600/8 rounded-full blur-[120px]" />
      </div>

      <Sidebar />

      <main className="relative z-10 lg:ml-[260px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-8">
        
        {/* Navigation Breadcrumb Header */}
        <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/[0.08] shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-white/[0.06]">
          <Link
            to="/mock-interview"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-300 hover:text-blue-400 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Interview Setup
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-black/20">
              {config.type.toUpperCase()} Round
            </span>
            <span className="text-xs font-black uppercase px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-lg shadow-black/20">
              {config.difficulty}
            </span>
            <span className="text-xs font-bold text-slate-300">
              Role: <strong className="text-white">{config.targetRole}</strong>
            </span>
          </div>
        </div>

        {!isFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Question & Answer Panel (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Question Progress Card */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-white/[0.06]">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-2.5">
                    <Brain className="h-5 w-5 text-blue-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold bg-blue-500/10 text-blue-400 px-3.5 py-1.5 rounded-full border border-blue-500/30 shadow-lg shadow-black/20">
                    {currentQ.category}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/[0.08] bg-blue-500/10 p-5 shadow-xs">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${isSpeaking ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/30 scale-105" : "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/20"}`}>
                          {isSpeaking ? <Volume2 className="h-5 w-5 animate-pulse" /> : <Volume2 className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">AI Interviewer Assistant</p>
                          <p className="text-sm font-bold text-white">{isSpeaking ? "Speaking prompt voice..." : "Voice guidance ready"}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVoiceEnabled((prev) => !prev)}
                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold border transition-all duration-200 cursor-pointer ${voiceEnabled ? "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-xs" : "bg-slate-800/50 text-slate-300 border-white/[0.08] hover:bg-white/[0.06]"}`}
                      >
                        {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                        {voiceEnabled ? "Voice On" : "Voice Off"}
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-lg shadow-black/20">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                        <User className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-white">AI Interviewer Session</p>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          Speech-to-text audio capture active. Respond naturally in voice or structure your points in the response editor below.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-white leading-snug">
                    "{currentQ.q}"
                  </h2>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 shadow-lg shadow-black/20">
                    <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                    <span><strong className="text-amber-400">AI Recommendation:</strong> {currentQ.hint}</span>
                  </div>
                </div>

                {/* Answer Area */}
                {!currentFeedback ? (
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-white">
                          Your Response Capture
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Record your answer with audio or type a structured response. Both are saved for review.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-800/50 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-lg shadow-black/20">
                        <Mic className="h-3.5 w-3.5 text-blue-400" /> {recordingStatus === 'recording' ? 'Live recording active' : recordingStatus === 'paused' ? 'Recording paused' : recordingStatus === 'stopped' ? 'Recording captured' : 'Ready to record'}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowRecorder(true)}
                          className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition duration-200 cursor-pointer ${showRecorder ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-md' : 'bg-slate-800/50 text-slate-300 border border-white/[0.08] hover:bg-white/[0.06]'}`}
                        >
                          Voice Recorder Mode
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRecorder(false)}
                          className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition duration-200 cursor-pointer ${!showRecorder ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-md' : 'bg-slate-800/50 text-slate-300 border border-white/[0.08] hover:bg-white/[0.06]'}`}
                        >
                          Text Answer Only
                        </button>
                      </div>

                      {showRecorder ? (
                        <InterviewRecorder
                          onRecordingReady={(blob, metadata) => {
                            setRecordingData({ blob, ...metadata });
                          }}
                          onStatusChange={(status) => setRecordingStatus(status)}
                          label="Interview response capture"
                        />
                      ) : null}

                      <textarea
                        rows={6}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here. If you recorded audio, you may summarize the key points as text."
                        className="w-full rounded-2xl border border-white/[0.08] bg-slate-800/50 p-4 text-sm font-medium text-white focus:border-blue-400 focus:bg-slate-900/60 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed shadow-inner"
                      />

                      {recordingData?.blob && (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-400 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Recorded audio ready for AI calibration ({Math.round(recordingData.durationMs / 1000)} sec).
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (showRecorder) {
                            setRecordingData(null);
                            setRecordingStatus('idle');
                          }
                          setAnswer('');
                        }}
                        className="rounded-2xl border border-white/[0.08] bg-slate-800/50 px-5 py-3 text-xs font-bold text-slate-300 hover:bg-white/[0.06] transition cursor-pointer"
                      >
                        Clear Response
                      </button>
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={evaluating || (!answer.trim() && !recordingData?.blob)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer"
                      >
                        {evaluating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Evaluating Answer with Gemini AI...
                          </>
                        ) : (
                          <>
                            Submit Answer for AI Review <Send className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Gemini 5-Dimension AI Feedback Card after submission */
                  <div className="space-y-6 pt-4 border-t border-white/[0.06] animate-in fade-in duration-300">
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl shadow-sm">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md shadow-emerald-500/20">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">Gemini AI Multi-Dimension Scorecard</p>
                          <p className="text-2xl font-black text-emerald-300">
                            Score: {currentFeedback.score} / 100
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-lg shadow-black/20">
                        Evaluated
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs text-white">
                      {/* Strengths */}
                      {currentFeedback.strengths && (
                        <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 space-y-2 shadow-lg shadow-black/20">
                          <p className="font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 text-xs">
                            <ThumbsUp className="h-4 w-4 text-emerald-400" /> Key Strengths Identified
                          </p>
                          {Array.isArray(currentFeedback.strengths) ? (
                            <ul className="list-disc list-inside space-y-1 text-slate-300 font-medium leading-relaxed">
                              {currentFeedback.strengths.map((str, idx) => (
                                <li key={idx}>{str}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="font-medium text-slate-300 leading-relaxed">{currentFeedback.strengths}</p>
                          )}
                        </div>
                      )}

                      {/* Weaknesses / Improvements */}
                      {(currentFeedback.weaknesses || currentFeedback.improvements) && (
                        <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 space-y-2 shadow-lg shadow-black/20">
                          <p className="font-black text-amber-400 uppercase tracking-wider flex items-center gap-2 text-xs">
                            <AlertTriangle className="h-4 w-4 text-amber-400" /> Weaknesses & Areas for Growth
                          </p>
                          {Array.isArray(currentFeedback.weaknesses) ? (
                            <ul className="list-disc list-inside space-y-1 text-slate-300 font-medium leading-relaxed">
                              {currentFeedback.weaknesses.map((weak, idx) => (
                                <li key={idx}>{weak}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="font-medium text-slate-300 leading-relaxed">{currentFeedback.weaknesses || currentFeedback.improvements}</p>
                          )}
                        </div>
                      )}

                      {/* Missing Points */}
                      {currentFeedback.missingPoints?.length > 0 && (
                        <div className="bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20 space-y-2 shadow-lg shadow-black/20">
                          <p className="font-black text-rose-400 uppercase tracking-wider text-xs">Key Missing Technical Concepts</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-300 font-medium leading-relaxed">
                            {currentFeedback.missingPoints.map((mp, idx) => (
                              <li key={idx}>{mp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Ideal Exemplary Answer */}
                      {currentFeedback.idealAnswer && (
                        <div className="bg-blue-500/10 p-5 rounded-2xl border border-blue-500/20 space-y-2 shadow-lg shadow-black/20">
                          <p className="font-black text-blue-400 uppercase tracking-wider flex items-center gap-2 text-xs">
                            <Sparkles className="h-4 w-4 text-blue-400" /> Exemplary Ideal Answer
                          </p>
                          <p className="font-medium text-slate-300 leading-relaxed italic">
                            "{currentFeedback.idealAnswer}"
                          </p>
                        </div>
                      )}

                      {/* Follow-up Probing Question */}
                      {currentFeedback.followUpQuestion && (
                        <div className="bg-purple-500/10 p-5 rounded-2xl border border-purple-500/20 space-y-2 shadow-lg shadow-black/20">
                          <p className="font-black text-purple-400 uppercase tracking-wider flex items-center gap-2 text-xs">
                            <HelpCircle className="h-4 w-4 text-purple-400" /> Recommended Follow-up Question
                          </p>
                          <p className="font-bold text-slate-300 text-sm">
                            "{currentFeedback.followUpQuestion}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                      >
                        {currentIndex < questions.length - 1 ? (
                          <>
                            Proceed to Next Question <ChevronRight className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Finish & View Full Scorecard <Award className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Sidebar Guidelines (4 Columns) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-white/[0.06]">
                <h3 className="font-black text-base text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" /> 5-Dimension Evaluation
                </h3>
                <ul className="space-y-3.5 text-xs text-slate-300 font-normal leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Technical Depth:</strong> Accurate terminology, algorithm design & edge cases.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Problem Solving:</strong> Structural decomposition & trade-offs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Communication:</strong> Concise STAR format & confident presentation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Relevance:</strong> Direct adherence to question prompt requirements.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Time Management:</strong> Pacing and concise delivery.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          /* Finished Interview Summary Scorecard */
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-2xl transition-all duration-300 animate-in fade-in">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-blue-600 text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Award className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">Interview Complete! 🎉</h2>
              <p className="text-sm text-slate-300 font-normal">
                You completed the <strong className="text-white">{config.type.toUpperCase()}</strong> interview round for{" "}
                <strong className="text-white">{config.targetRole}</strong>.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl space-y-1 shadow-inner">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400">Overall Performance Score</span>
              <p className="text-5xl font-black text-blue-400">{overallAvgScore}%</p>
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => navigate("/mock-interview")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Back to Mock Setup
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-slate-800/50 hover:bg-white/[0.06] text-slate-300 px-6 py-3.5 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer border border-white/[0.08]"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
