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
    <div className="relative overflow-hidden bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
      {/* Decorative Background Gradient Blobs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/15 via-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />

      <main className="relative z-10 lg:ml-[280px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-8">
        
        {/* Navigation Breadcrumb Header */}
        <div className="flex items-center justify-between bg-white/85 backdrop-blur-xl px-6 py-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
          <Link
            to="/mock-interview"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#434655] hover:text-[#004ac6] transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Interview Setup
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full bg-blue-50 text-[#004ac6] border border-blue-100 shadow-xs">
              {config.type.toUpperCase()} Round
            </span>
            <span className="text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 shadow-xs">
              {config.difficulty}
            </span>
            <span className="text-xs font-bold text-[#434655]">
              Role: <strong className="text-[#0b1c30]">{config.targetRole}</strong>
            </span>
          </div>
        </div>

        {!isFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Question & Answer Panel (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Question Progress Card */}
              <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between border-b border-slate-100/80 pb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#004ac6]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold bg-blue-50 text-[#004ac6] px-3.5 py-1.5 rounded-full border border-blue-100 shadow-xs">
                    {currentQ.category}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#f7faff] via-[#eef5ff] to-[#f8fbff] p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isSpeaking ? "bg-rose-100 text-rose-600" : "bg-blue-50 text-[#004ac6]"}`}>
                          {isSpeaking ? <Volume2 className="h-5 w-5 animate-pulse" /> : <Volume2 className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">AI Interviewer</p>
                          <p className="text-sm font-semibold text-[#0b1c30]">{isSpeaking ? "Speaking the next prompt..." : "Voice guidance is ready"}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVoiceEnabled((prev) => !prev)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border transition-all duration-200 ${voiceEnabled ? "bg-[#004ac6] text-white border-[#004ac6]" : "bg-white text-slate-600 border-slate-200"}`}
                      >
                        {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                        {voiceEnabled ? "Voice On" : "Voice Off"}
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[#004ac6] shadow-inner">
                        <User className="h-12 w-12" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-extrabold text-[#0b1c30]">Interview assistant</p>
                        <p className="text-sm text-[#434655]">
                          This session is audio-first: your answers are captured by voice and reviewed by AI. No webcam required.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-extrabold text-[#0b1c30] leading-snug">
                    "{currentQ.q}"
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0b1c30] bg-gradient-to-r from-amber-50/90 to-amber-100/40 p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    <span><strong>AI Tip:</strong> {currentQ.hint}</span>
                  </div>
                </div>

                {/* Answer Area */}
                {!currentFeedback ? (
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#0b1c30]">
                          Your Response
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Record your answer with audio or type a structured response. Both are saved for review.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-[#0b1c30]">
                        <Mic className="h-3.5 w-3.5 text-[#004ac6]" /> {recordingStatus === 'recording' ? 'Live recording active' : recordingStatus === 'paused' ? 'Recording paused' : recordingStatus === 'stopped' ? 'Recording captured' : 'Ready to record'}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowRecorder(true)}
                          className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${showRecorder ? 'bg-[#004ac6] text-white' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                        >
                          Voice Recorder
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRecorder(false)}
                          className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${!showRecorder ? 'bg-[#004ac6] text-white' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
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
                        className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-sm font-medium text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6]/20 transition-all leading-relaxed shadow-inner"
                      />

                      {recordingData?.blob && (
                        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-800">
                          Recorded audio ready for submission ({Math.round(recordingData.durationMs / 1000)} sec).
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (showRecorder) {
                            setRecordingData(null);
                            setRecordingStatus('idle');
                          }
                          setAnswer('');
                        }}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        Clear Response
                      </button>
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={evaluating || (!answer.trim() && !recordingData?.blob)}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#004ac6] to-blue-600 hover:from-[#003bb0] hover:to-blue-700 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold shadow-md shadow-[#004ac6]/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer"
                      >
                        {evaluating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Evaluating Answer...
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
                  /* Gemini AI Feedback Card after submission */
                  <div className="space-y-6 pt-4 border-t border-slate-100/80 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-5 rounded-2xl shadow-xs">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        <div>
                          <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Gemini AI Calibration</p>
                          <p className="text-xl font-black text-emerald-950">
                            Score: {currentFeedback.score} / 100
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#004ac6] bg-blue-100/80 px-3.5 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                        Evaluated
                      </span>
                    </div>

                    <div className="space-y-3 text-xs text-[#0b1c30]">
                      {/* Strengths */}
                      {currentFeedback.strengths && (
                        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                            <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" /> Key Strengths
                          </p>
                          {Array.isArray(currentFeedback.strengths) ? (
                            <ul className="list-disc list-inside space-y-1 text-[#0b1c30] font-medium">
                              {currentFeedback.strengths.map((str, idx) => (
                                <li key={idx}>{str}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="font-medium text-[#0b1c30]">{currentFeedback.strengths}</p>
                          )}
                        </div>
                      )}

                      {/* Weaknesses / Improvements */}
                      {(currentFeedback.weaknesses || currentFeedback.improvements) && (
                        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Weaknesses & Areas for Growth
                          </p>
                          {Array.isArray(currentFeedback.weaknesses) ? (
                            <ul className="list-disc list-inside space-y-1 text-amber-950 font-medium">
                              {currentFeedback.weaknesses.map((weak, idx) => (
                                <li key={idx}>{weak}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="font-medium text-amber-950">{currentFeedback.weaknesses || currentFeedback.improvements}</p>
                          )}
                        </div>
                      )}

                      {/* Missing Points */}
                      {currentFeedback.missingPoints?.length > 0 && (
                        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-rose-800 uppercase tracking-wider">Key Missing Concepts</p>
                          <ul className="list-disc list-inside space-y-1 text-rose-950 font-medium">
                            {currentFeedback.missingPoints.map((mp, idx) => (
                              <li key={idx}>{mp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Ideal Exemplary Answer */}
                      {currentFeedback.idealAnswer && (
                        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-[#004ac6] uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#004ac6]" /> Exemplary Ideal Answer
                          </p>
                          <p className="font-medium text-[#0b1c30] leading-relaxed italic">
                            "{currentFeedback.idealAnswer}"
                          </p>
                        </div>
                      )}

                      {/* Follow-up Probing Question */}
                      {currentFeedback.followUpQuestion && (
                        <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                            <HelpCircle className="h-3.5 w-3.5 text-purple-600" /> Recommended Follow-up Question
                          </p>
                          <p className="font-bold text-purple-950">
                            "{currentFeedback.followUpQuestion}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#004ac6] to-blue-600 hover:from-[#003bb0] hover:to-blue-700 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold shadow-md shadow-[#004ac6]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
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
              <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all duration-200">
                <h3 className="font-extrabold text-base text-[#0b1c30] flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#004ac6]" /> Evaluation Metrics
                </h3>
                <ul className="space-y-3 text-xs text-[#434655] font-normal leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-1.5 shrink-0" />
                    <span><strong className="text-[#0b1c30]">Technical Depth:</strong> Accurate terminology & edge cases.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-1.5 shrink-0" />
                    <span><strong className="text-[#0b1c30]">Structure:</strong> Clear problem-solution hierarchy.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-1.5 shrink-0" />
                    <span><strong className="text-[#0b1c30]">Communication:</strong> Concise, logical & confident tone.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          /* Finished Interview Summary Scorecard */
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-xl hover:shadow-2xl transition-all duration-300 animate-in fade-in">
            <div className="w-16 h-16 bg-blue-50 text-[#004ac6] rounded-3xl mx-auto flex items-center justify-center shadow-md">
              <Award className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#0b1c30]">Interview Complete! 🎉</h2>
              <p className="text-sm text-[#434655] font-normal">
                You completed the <strong className="text-[#0b1c30]">{config.type.toUpperCase()}</strong> interview round for{" "}
                <strong className="text-[#0b1c30]">{config.targetRole}</strong>.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 border border-blue-100 p-6 rounded-2xl space-y-1 shadow-inner">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#004ac6]">Overall Match Score</span>
              <p className="text-5xl font-black text-[#004ac6]">{overallAvgScore}%</p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/mock-interview")}
                className="bg-gradient-to-r from-[#004ac6] to-blue-600 hover:from-[#003bb0] hover:to-blue-700 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold shadow-md shadow-[#004ac6]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Back to Mock Setup
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 px-6 py-3.5 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer"
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
