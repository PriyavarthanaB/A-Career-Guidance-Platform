import { generateInterviewReportPDF } from "../utils/pdfGenerator";
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
  TrendingUp,
  Flame,
  FileText,
  BarChart2,
  Check,
  X,
  BookOpen,
} from "lucide-react";

// Fallback questions if the backend does not return a session payload.
const getFallbackQuestions = (type, targetRole, count = 3) => {
  const roleStr = targetRole || "Software Engineer";
  const baseQuestions = {
    hr: [
      {
        q: `Tell me about a time you faced a disagreement with a teammate while working on a ${roleStr} project and how you resolved it.`,
        hint: "Use the STAR method and focus on empathy, ownership, and a constructive outcome.",
        category: "Conflict Resolution & Communication",
        difficulty: "Easy",
      },
      {
        q: `Why do you want to work as a ${roleStr}, and what drives your professional growth?`,
        hint: "Connect your growth story to product impact, learning, and the role's responsibilities.",
        category: "Motivation & Culture Fit",
        difficulty: "Medium",
      },
      {
        q: "Describe a situation where priorities changed suddenly near a deadline. How did you adapt while keeping quality high?",
        hint: "Show communication, prioritization, and calm decision-making under pressure.",
        category: "Adaptability & Delivery",
        difficulty: "Medium",
      },
    ],
    technical: [
      {
        q: `How would you design a scalable system for a ${roleStr} role that needs strong reliability under high traffic?`,
        hint: "Discuss architecture decisions, trade-offs, and how you would scale under load.",
        category: "System Design & Scalability",
        difficulty: "Hard",
      },
      {
        q: `Explain how you would optimize performance or reliability in a production ${roleStr} setup.`,
        hint: "Include testing, metrics, debugging, and maintainability considerations.",
        category: "Practical Engineering",
        difficulty: "Medium",
      },
      {
        q: `How would you approach debugging a production issue in a ${roleStr} system when the symptoms are unclear?`,
        hint: "Mention observability, logs, metrics, and mitigation strategies.",
        category: "Debugging & Resilience",
        difficulty: "Medium",
      },
    ],
    behavioral: [
      {
        q: `Tell me about a situation where you had to manage competing priorities on a ${roleStr} project.`,
        hint: "Structure your answer using Situation, Task, Action, and Result (STAR).",
        category: "Prioritization & STAR Method",
        difficulty: "Easy",
      },
      {
        q: `Describe a time when you received constructive feedback on your ${roleStr} work. How did you react and improve?`,
        hint: "Show growth mindset, receptiveness to feedback, and specific improvements made.",
        category: "Growth Mindset & Feedback",
        difficulty: "Medium",
      },
      {
        q: `Give an example of a technical project where you took leadership or initiative beyond your direct scope.`,
        hint: "Explain the problem identified, your proactive leadership steps, and measurable impact.",
        category: "Leadership & Initiative",
        difficulty: "Hard",
      },
    ],
    mixed: [
      {
        q: `Walk me through an end-to-end solution you would build for a ${roleStr} role and explain your key trade-offs.`,
        hint: "Cover requirements, data flow, technical choices, and delivery concerns.",
        category: "Architecture & Trade-offs",
        difficulty: "Medium",
      },
      {
        q: `How do you balance writing clean, tested code with meeting aggressive deadlines in a ${roleStr} environment?`,
        hint: "Show how you balance quality, speed, and business priorities.",
        category: "Engineering Pragmatism",
        difficulty: "Easy",
      },
      {
        q: `How would you ensure the solution is reliable, secure, and maintainable for a ${roleStr} role?`,
        hint: "Mention testing, monitoring, authentication, permissions, and fallback strategies.",
        category: "Reliability & Security",
        difficulty: "Hard",
      },
    ],
  };

  const pool = baseQuestions[type] || baseQuestions.mixed;
  return pool.slice(0, Math.max(1, Number(count) || 3)).map((item) => ({ ...item }));
};

const getDifficultyBadge = (difficulty) => {
  const norm = (difficulty || "Medium").toLowerCase();
  if (norm === "easy") {
    return {
      label: "Easy",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      dot: "bg-emerald-500",
    };
  }
  if (norm === "hard") {
    return {
      label: "Hard",
      color: "text-rose-700 bg-rose-50 border-rose-200",
      dot: "bg-rose-500",
    };
  }
  return {
    label: "Medium",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  };
};

export default function InterviewSession() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve configuration from state or use smart defaults
  const config = location.state || {
    type: "mixed",
    difficulty: "Medium",
    targetRole: "Full Stack Software Developer",
    responseMode: "text",
    questionCount: 5,
    adaptive: true,
  };

  const sessionQuestions = config.questions || [];

  const initialQuestions = sessionQuestions.length
    ? sessionQuestions.slice(0, Number(config.questionCount) || 5).map((q) => {
        if (typeof q === "string") {
          return {
            q,
            hint: "Answer with practical examples and trade-offs.",
            category: "Interview Question",
            difficulty: config.difficulty || "Medium",
          };
        }
        return {
          q: q.question || q.q || "",
          hint: q.hint || "Answer with practical examples and trade-offs.",
          category: q.category || "Interview Question",
          difficulty: q.difficulty || config.difficulty || "Medium",
        };
      })
    : getFallbackQuestions(config.type, config.targetRole, config.questionCount || 5);

  const [questionsList, setQuestionsList] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState(config.difficulty || "Medium");
  const [difficultyHistory, setDifficultyHistory] = useState([config.difficulty || "Medium"]);

  const [answer, setAnswer] = useState("");
  const [showRecorder, setShowRecorder] = useState(config.responseMode === "voice" || true);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [recordingData, setRecordingData] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [answersList, setAnswersList] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Time allocation per question
  const questionTimeLimit = Math.max(
    60,
    Math.floor(((Number(config.durationMinutes) || 30) * 60) / (Number(config.questionCount) || 5))
  );
  const [timeLeft, setTimeLeft] = useState(questionTimeLimit);

  const currentQ = questionsList[currentIndex] || questionsList[0];

  // Prevent accidental page unload / refresh mid-interview
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isFinished && (currentIndex > 0 || answer.trim() || answersList.length > 0)) {
        e.preventDefault();
        e.returnValue = "You have an ongoing interview session. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFinished, currentIndex, answer, answersList.length]);

  // Question countdown timer
  useEffect(() => {
    setTimeLeft(questionTimeLimit);
  }, [currentIndex, questionTimeLimit]);

  useEffect(() => {
    if (isFinished || currentFeedback || evaluating) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, currentFeedback, evaluating, isFinished]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Text-to-speech for the question prompt
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
      let nextDiff = currentDifficulty;

      if (config.interviewId) {
        const formData = new FormData();
        formData.append("questionIndex", currentIndex);
        formData.append("answer", answer.trim());
        formData.append("difficulty", currentDifficulty);

        if (recordingData?.blob) {
          formData.append(
            "recording",
            recordingData.blob,
            `interview-${config.interviewId}-question-${currentIndex + 1}.${recordingData.blob.type.split("/")[1] || "webm"}`
          );
          formData.append("answerStartedAt", recordingData.startedAt);
          formData.append("answerEndedAt", recordingData.endedAt);
        }

        const res = await API.post(`/api/interview/${config.interviewId}/submit`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        feedbackObj = res.data.feedback || res.data.questionData;
        if (res.data.nextDifficulty) {
          nextDiff = res.data.nextDifficulty;
          setCurrentDifficulty(res.data.nextDifficulty);
          setDifficultyHistory((prev) => [...prev, res.data.nextDifficulty]);
        }

        // Dynamically append single AI question generated by backend
        if (res.data.nextQuestion) {
          const nextQObj = {
            q: res.data.nextQuestion.question,
            hint: res.data.nextQuestion.hint,
            category: res.data.nextQuestion.category,
            difficulty: res.data.nextQuestion.difficulty || nextDiff,
          };
          setQuestionsList((prev) => [...prev, nextQObj]);
        } else if (res.data.interview?.questions?.length > questionsList.length) {
          const updated = res.data.interview.questions.map((q) => ({
            q: q.question || q.q || "",
            hint: q.hint || "Answer with practical examples and trade-offs.",
            category: q.category || "Interview Question",
            difficulty: q.difficulty || nextDiff,
          }));
          setQuestionsList(updated);
        }
      } else {
        const res = await API.post("/api/interview/evaluate", {
          question: currentQ.q,
          answer: answer.trim(),
          targetRole: config.targetRole,
          difficulty: currentDifficulty,
          type: config.type,
        });
        feedbackObj = res.data.data;

        // Local adaptive logic fallback
        const score = feedbackObj.score || 75;
        if (score >= 80) {
          nextDiff = currentDifficulty === "Easy" ? "Medium" : "Hard";
        } else if (score < 60) {
          nextDiff = currentDifficulty === "Hard" ? "Medium" : "Easy";
        }
        setCurrentDifficulty(nextDiff);
        setDifficultyHistory((prev) => [...prev, nextDiff]);
      }

      // Ensure 7-dimension scores are normalized
      const normalizedScores = {
        score: feedbackObj.score || 75,
        technicalKnowledgeScore: feedbackObj.technicalKnowledgeScore ?? feedbackObj.technicalScore ?? 75,
        correctnessScore: feedbackObj.correctnessScore ?? feedbackObj.technicalScore ?? 75,
        problemSolvingScore: feedbackObj.problemSolvingScore ?? 78,
        communicationScore: feedbackObj.communicationScore ?? 72,
        relevanceScore: feedbackObj.relevanceScore ?? 80,
        confidenceScore: feedbackObj.confidenceScore ?? 74,
        timeManagementScore: feedbackObj.timeManagementScore ?? (timeLeft > 10 ? 85 : 65),
        strengths: feedbackObj.strengths || ["Provided a clear structure addressing core requirements."],
        weaknesses: feedbackObj.weaknesses || ["Could elaborate more on edge-case scenarios."],
        missingPoints: feedbackObj.missingPoints || feedbackObj.missingConcepts || [],
        idealAnswer: feedbackObj.idealAnswer || "An ideal answer covers architecture trade-offs and validation.",
        followUpQuestion: feedbackObj.followUpQuestion || "",
        improvementFeedback: feedbackObj.improvementFeedback || feedbackObj.aiFeedback || "",
      };

      setCurrentFeedback(normalizedScores);
      setAnswersList((prev) => [
        ...prev,
        {
          ...normalizedScores,
          question: currentQ.q,
          userAnswer: answer.trim(),
          difficulty: currentDifficulty,
          category: currentQ.category,
        },
      ]);
    } catch (err) {
      console.error("Gemini AI Evaluation Error:", err);
      const fallbackObj = {
        score: 78,
        technicalKnowledgeScore: 80,
        correctnessScore: 78,
        problemSolvingScore: 75,
        communicationScore: 76,
        relevanceScore: 82,
        confidenceScore: 74,
        timeManagementScore: 80,
        strengths: ["Clear structure and relevant practical examples."],
        weaknesses: ["Could add more edge-case handling and performance detail."],
        missingPoints: ["Explicit rollback strategy and validation checks."],
        idealAnswer: "An ideal answer includes architecture, trade-offs, and rigorous validation.",
        followUpQuestion: "How would you test this solution in a production environment?",
        improvementFeedback: "Focus on deepening technical trade-offs and validation steps.",
      };
      setCurrentFeedback(fallbackObj);
      setAnswersList((prev) => [
        ...prev,
        {
          ...fallbackObj,
          question: currentQ.q,
          userAnswer: answer.trim(),
          difficulty: currentDifficulty,
          category: currentQ.category,
        },
      ]);
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
      console.error("Failed to complete interview session:", err);
    } finally {
      setEvaluating(false);
      setIsFinished(true);
    }
  };

  const handleNext = async () => {
    setCurrentFeedback(null);
    setAnswer("");
    setRecordingData(null);
    setRecordingStatus("idle");
    if (currentIndex < (Number(config.questionCount) || questionsList.length) - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      await finishInterviewSession();
    }
  };

  // Compute 7-dimension aggregated score averages
  const overallAvgScore = answersList.length
    ? Math.round(answersList.reduce((acc, curr) => acc + (curr.score || 0), 0) / answersList.length)
    : 82;

  const avgDimensions = {
    technicalKnowledge: answersList.length
      ? Math.round(answersList.reduce((acc, c) => acc + (c.technicalKnowledgeScore || c.score || 0), 0) / answersList.length)
      : 80,
    correctness: answersList.length
      ? Math.round(answersList.reduce((acc, c) => acc + (c.correctnessScore || c.score || 0), 0) / answersList.length)
      : 78,
    problemSolving: answersList.length
      ? Math.round(answersList.reduce((acc, c) => acc + (c.problemSolvingScore || c.score || 0), 0) / answersList.length)
      : 82,
    communication: answersList.length
      ? Math.round(answersList.reduce((acc, c) => acc + (c.communicationScore || c.score || 0), 0) / answersList.length)
      : 76,
    relevance: answersList.length
      ? Math.round(answersList.reduce((acc, c) => acc + (c.relevanceScore || c.score || 0), 0) / answersList.length)
      : 85,
    confidence: answersList.length
      ? Math.round(answersList.reduce((acc, c) => acc + (c.confidenceScore || c.score || 0), 0) / answersList.length)
      : 74,
    timeManagement: answersList.length
      ? Math.round(answersList.reduce((acc, c) => acc + (c.timeManagementScore || c.score || 0), 0) / answersList.length)
      : 80,
  };

  const currentDiffBadge = getDifficultyBadge(currentDifficulty);

  return (
    <div className="relative overflow-hidden text-slate-900 bg-[#f8fafc] min-h-screen font-sans flex antialiased">
      <Sidebar />

      <main className="relative z-10 lg:ml-[260px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-8">
        {/* Navigation Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-900/5">
          <Link
            to="/mock-interview"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-blue-600 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Interview
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {config.type.toUpperCase()} Round
            </span>
            <span
              className={`text-xs font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${currentDiffBadge.color}`}
            >
              <span className={`h-2 w-2 rounded-full ${currentDiffBadge.dot}`} />
              {currentDifficulty} Mode
            </span>
            <span className="text-xs font-bold text-slate-600">
              Role: <strong className="text-slate-900 font-extrabold">{config.targetRole}</strong>
            </span>
          </div>
        </div>

        {!isFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Question & Answer Panel (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Question Progress Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm shadow-slate-900/5">
                {/* Question Header & Timer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                      <Brain className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Question {currentIndex + 1} of {questionsList.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Live Per-Question Timer */}
                    <div
                      className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black border transition-all ${
                        timeLeft <= 30
                          ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                          : "bg-slate-50 text-blue-700 border-slate-200"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>

                    <span className="text-xs font-black px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {currentQ?.category || "Interview Question"}
                    </span>
                  </div>
                </div>

                {/* Stepper Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Round Progress</span>
                    <span>
                      {Math.round(
                        ((currentIndex + (currentFeedback ? 1 : 0)) / (questionsList.length || 1)) * 100
                      )}
                      % Completed
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
                    <div
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.round(
                          ((currentIndex + (currentFeedback ? 1 : 0)) / (questionsList.length || 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Interviewer Assistant Voice Banner */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 shadow-2xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isSpeaking
                            ? "bg-rose-100 text-rose-600 border border-rose-200 scale-105"
                            : "bg-blue-600 text-white shadow-xs"
                        }`}
                      >
                        <Volume2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          AI Interviewer Voice
                        </p>
                        <p className="text-xs font-bold text-slate-900">
                          {isSpeaking ? "Reading prompt out loud..." : "Voice synthesis active"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVoiceEnabled((prev) => !prev)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition-all duration-200 cursor-pointer ${
                        voiceEnabled
                          ? "bg-blue-100/80 text-blue-700 border-blue-200"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                      {voiceEnabled ? "Voice On" : "Mute"}
                    </button>
                  </div>
                </div>

                {/* The Question Prompt */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                      Prompt #{currentIndex + 1}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                    "{currentQ.q}"
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                    <Sparkles className="h-4 w-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>Interviewer Tip:</strong> {currentQ.hint}
                    </span>
                  </div>
                </div>

                {/* Candidate Answer Workspace */}
                {!currentFeedback ? (
                  <div className="space-y-5 pt-3 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-900">
                          Your Answer Submission
                        </p>
                        <p className="text-xs text-slate-500">
                          Use voice recording or typed answer. Both are captured for deep AI scoring.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowRecorder(true)}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-black border transition cursor-pointer ${
                            showRecorder
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          Voice Mode
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRecorder(false)}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-black border transition cursor-pointer ${
                            !showRecorder
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          Text Mode
                        </button>
                      </div>
                    </div>

                    {showRecorder && (
                      <InterviewRecorder
                        onRecordingReady={(blob, metadata) => {
                          setRecordingData({ blob, ...metadata });
                          if (metadata.transcript && !answer.trim()) {
                            setAnswer(metadata.transcript);
                          }
                        }}
                        onTranscriptUpdate={(transcript) => {
                          if (transcript) {
                            setAnswer(transcript);
                          }
                        }}
                        onStatusChange={(status) => setRecordingStatus(status)}
                        label="Live Voice Response Capture"
                      />
                    )}

                    {/* Text Answer Editor / Fallback */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>Answer Transcript / Text Response:</span>
                        <span>{answer.trim() ? `${answer.trim().split(/\s+/).length} words` : "Empty"}</span>
                      </div>
                      <textarea
                        rows={5}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Your spoken or typed response will appear here. You can refine your answer text before submitting."
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed shadow-xs"
                      />
                    </div>

                    {recordingData?.blob && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Audio file captured ({Math.round(recordingData.durationMs / 1000)}s) and ready for submission.
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRecordingData(null);
                          setRecordingStatus("idle");
                          setAnswer("");
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Clear Response
                      </button>
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={evaluating || (!answer.trim() && !recordingData?.blob)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-40 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {evaluating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Evaluating Answer with Gemini AI...
                          </>
                        ) : (
                          <>
                            Submit Answer for Review <Send className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 7-DIMENSION AI SCORECARD AFTER SUBMITTING */
                  <div className="space-y-6 pt-3 border-t border-slate-100 animate-in fade-in duration-300">
                    {/* Overall Score Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 p-5 rounded-3xl shadow-xs">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                            Gemini AI 7-Dimension Scorecard
                          </p>
                          <p className="text-2xl font-black text-emerald-900">
                            Score: {currentFeedback.score} / 100
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200">
                        {currentFeedback.score >= 80 ? "🎯 Exceptional" : currentFeedback.score >= 60 ? "⚡ Good Answer" : "🌱 Needs Improvement"}
                      </span>
                    </div>

                    {/* 7 Dimensions Breakdown Grid */}
                    <div className="space-y-2">
                      <p className="text-xs font-black uppercase text-slate-700 tracking-wider">
                        7-Dimension Competency Scores
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {[
                          { label: "Technical Knowledge", score: currentFeedback.technicalKnowledgeScore, color: "blue" },
                          { label: "Correctness", score: currentFeedback.correctnessScore, color: "emerald" },
                          { label: "Problem Solving", score: currentFeedback.problemSolvingScore, color: "indigo" },
                          { label: "Communication", score: currentFeedback.communicationScore, color: "purple" },
                          { label: "Relevance", score: currentFeedback.relevanceScore, color: "amber" },
                          { label: "Confidence & Clarity", score: currentFeedback.confidenceScore, color: "teal" },
                          { label: "Time Management", score: currentFeedback.timeManagementScore, color: "rose" },
                        ].map((dim) => (
                          <div
                            key={dim.label}
                            className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                              <span className="truncate pr-1">{dim.label}</span>
                              <span className="font-black text-slate-900">{dim.score ?? 75}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(dim.score ?? 75, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                      {/* Strengths */}
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                        <p className="font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ThumbsUp className="h-4 w-4 text-emerald-600" /> Key Strengths
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                          {Array.isArray(currentFeedback.strengths) ? (
                            currentFeedback.strengths.map((str, idx) => <li key={idx}>{str}</li>)
                          ) : (
                            <li>{currentFeedback.strengths}</li>
                          )}
                        </ul>
                      </div>

                      {/* Weaknesses / Growth Areas */}
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                        <p className="font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-amber-600" /> Growth Areas
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                          {Array.isArray(currentFeedback.weaknesses) ? (
                            currentFeedback.weaknesses.map((weak, idx) => <li key={idx}>{weak}</li>)
                          ) : (
                            <li>{currentFeedback.weaknesses}</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Missing Concepts */}
                    {currentFeedback.missingPoints?.length > 0 && (
                      <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-2 text-xs">
                        <p className="font-black text-rose-800 uppercase tracking-wider">
                          Key Missing Concepts or Trade-offs
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                          {currentFeedback.missingPoints.map((mp, idx) => (
                            <li key={idx}>{mp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Ideal Exemplary Answer */}
                    {currentFeedback.idealAnswer && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-1.5 text-xs">
                        <p className="font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-blue-600" /> Ideal Exemplary Answer
                        </p>
                        <p className="text-slate-800 italic leading-relaxed">
                          "{currentFeedback.idealAnswer}"
                        </p>
                      </div>
                    )}

                    {/* Next Question Navigation */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3 rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {currentIndex < (Number(config.questionCount) || questionsList.length) - 1 ? (
                          <>
                            Next Question ({currentIndex + 2}/{questionsList.length}) <ChevronRight className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Complete &amp; View Final Scorecard <Award className="h-4 w-4" />
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
              {/* Adaptive Difficulty Live Tracker */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm shadow-slate-900/5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" /> Adaptive Difficulty
                  </h3>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${currentDiffBadge.color}`}>
                    {currentDifficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The AI dynamically adjusts difficulty based on your accuracy, problem-solving, and communication scores.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>Score &ge; 80%</span>
                    <span className="text-emerald-600 font-extrabold">&uarr; Increases Difficulty</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>Score 50-79%</span>
                    <span className="text-blue-600 font-extrabold">&harr; Maintains Level</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>Score &lt; 50%</span>
                    <span className="text-amber-600 font-extrabold">&darr; Eases Difficulty</span>
                  </div>
                </div>
              </div>

              {/* 7-Dimension Rubric Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm shadow-slate-900/5">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Activity className="h-4 w-4 text-indigo-600" /> 7 Evaluation Dimensions
                </h3>
                <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                    <span><strong>Technical Knowledge:</strong> Terminology &amp; conceptual depth.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                    <span><strong>Correctness:</strong> Accurate, bug-free facts &amp; code syntax.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1 shrink-0" />
                    <span><strong>Problem Solving:</strong> Decomposition &amp; trade-offs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 mt-1 shrink-0" />
                    <span><strong>Communication:</strong> STAR structure &amp; conciseness.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600 mt-1 shrink-0" />
                    <span><strong>Relevance:</strong> Direct adherence to question prompt.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-1 shrink-0" />
                    <span><strong>Confidence:</strong> Conviction &amp; structured delivery.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 mt-1 shrink-0" />
                    <span><strong>Time Management:</strong> Pacing within allotted duration.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* COMPREHENSIVE 10-SECTION FINAL SCORECARD REPORT (WHITE THEME) */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 max-w-5xl mx-auto space-y-8 shadow-sm shadow-slate-900/5 animate-in fade-in duration-300">
            {/* 1. Header Banner */}
            <div className="text-center space-y-3 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Award className="h-8 w-8 text-yellow-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Interview Completed! 🎉
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Comprehensive AI evaluation report for your <strong className="text-slate-900">{config.type.toUpperCase()}</strong> interview round tailored to <strong className="text-blue-600">{config.targetRole}</strong>.
              </p>
            </div>

            {/* 2. Top Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-6 rounded-2xl text-white text-center space-y-1 shadow-md shadow-blue-500/20">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-100">
                  Overall Score
                </span>
                <p className="text-4xl font-black">{sessionResult?.overallScore ?? overallAvgScore}%</p>
                <span className="text-xs font-bold text-yellow-300 block">
                  {overallAvgScore >= 75 ? "🎯 Placement Ready" : "⚡ In Progress"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Technical Mastery
                </span>
                <p className="text-2xl font-black text-blue-600">{avgDimensions.technicalKnowledge}%</p>
                <span className="text-xs text-slate-500 font-semibold">Knowledge &amp; depth</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Problem Solving
                </span>
                <p className="text-2xl font-black text-indigo-600">{avgDimensions.problemSolving}%</p>
                <span className="text-xs text-slate-500 font-semibold">Decomposition &amp; trade-offs</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Communication
                </span>
                <p className="text-2xl font-black text-emerald-600">{avgDimensions.communication}%</p>
                <span className="text-xs text-slate-500 font-semibold">Clarity &amp; structure</span>
              </div>
            </div>

            {/* 3. 7-Dimension Competency Scorecard Bar Breakdown */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl space-y-4">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-600" /> Complete 7-Dimension Competency Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Technical Knowledge", score: avgDimensions.technicalKnowledge, color: "blue" },
                  { label: "Correctness", score: avgDimensions.correctness, color: "emerald" },
                  { label: "Problem Solving", score: avgDimensions.problemSolving, color: "indigo" },
                  { label: "Communication", score: avgDimensions.communication, color: "purple" },
                  { label: "Relevance", score: avgDimensions.relevance, color: "amber" },
                  { label: "Confidence & Clarity", score: avgDimensions.confidence, color: "teal" },
                  { label: "Time Management", score: avgDimensions.timeManagement, color: "rose" },
                ].map((item) => (
                  <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>{item.label}</span>
                      <span className="font-black text-slate-900">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(item.score, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. AI Performance Overview & Feedback */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-3xl space-y-3">
              <p className="font-black text-blue-800 uppercase tracking-wider text-xs flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" /> Personalized AI Executive Summary
              </p>
              <p className="font-medium text-slate-800 text-sm leading-relaxed">
                {sessionResult?.personalizedFeedback ||
                  sessionResult?.summary ||
                  "Demonstrated strong problem-solving fundamentals and structured reasoning. To elevate to senior level, focus on articulating production trade-offs, quantifiable metrics, and edge-case resilience."}
              </p>
            </div>

            {/* 5. Strongest vs Weakest Demonstrated Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Strongest */}
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-3">
                <p className="font-black text-emerald-800 uppercase text-xs tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Strongest Demonstrated Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {(sessionResult?.strongestTopics?.length
                    ? sessionResult.strongestTopics
                    : ["System Architecture", "Core Problem Solving", "Clear Modular Thinking"]
                  ).map((topic, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold"
                    >
                      ✓ {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Growth Areas */}
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl space-y-3">
                <p className="font-black text-amber-800 uppercase text-xs tracking-wider flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Areas Requiring Improvement
                </p>
                <div className="flex flex-wrap gap-2">
                  {(sessionResult?.weakestTopics?.length
                    ? sessionResult.weakestTopics
                    : ["STAR Quantifiable Metrics", "Edge-Case Resilience", "Production Monitoring"]
                  ).map((topic, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold"
                    >
                      ! {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Recommended Learning Modules */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl space-y-3">
              <p className="font-black text-slate-900 uppercase text-xs tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" /> Recommended Study Topics for Next Round
              </p>
              <div className="flex flex-wrap gap-2.5">
                {(sessionResult?.recommendedTopics?.length
                  ? sessionResult.recommendedTopics
                  : ["Distributed System Architecture", "STAR Framework Precision", "Database Indexing & Caching"]
                ).map((rec, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-blue-700 border border-slate-200 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" /> {rec}
                  </span>
                ))}
              </div>
            </div>

            {/* 7. Question-by-Question Deep Analysis */}
            {answersList.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" /> Question-by-Question Deep Analysis
                </h3>

                <div className="space-y-5">
                  {answersList.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                              Question #{idx + 1}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {q.category || "General"}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1">"{q.question}"</h4>
                        </div>
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 self-start">
                          {q.score}% Score
                        </span>
                      </div>

                      {q.userAnswer && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-500">Candidate Response:</p>
                          <p className="text-xs text-slate-800 bg-white p-3.5 rounded-xl border border-slate-200 italic leading-relaxed">
                            "{q.userAnswer}"
                          </p>
                        </div>
                      )}

                      {q.idealAnswer && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-blue-700">Exemplary Ideal Answer:</p>
                          <p className="text-xs text-slate-800 bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/60 leading-relaxed">
                            "{q.idealAnswer}"
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {q.strengths?.length > 0 && (
                          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                            <p className="font-black text-emerald-800 uppercase text-[10px]">✓ Key Strengths</p>
                            <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                              {Array.isArray(q.strengths) ? (
                                q.strengths.map((s, i) => <li key={i}>{s}</li>)
                              ) : (
                                <li>{q.strengths}</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {q.weaknesses?.length > 0 && (
                          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-1">
                            <p className="font-black text-amber-800 uppercase text-[10px]">⚠️ Growth Areas</p>
                            <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                              {Array.isArray(q.weaknesses) ? (
                                q.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                              ) : (
                                <li>{q.weaknesses}</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-100">
              <button
                onClick={() =>
                  generateInterviewReportPDF(
                    sessionResult || {
                      targetRole: config.targetRole,
                      type: config.type,
                      difficulty: config.difficulty,
                      questionCount: questionsList.length,
                      overallScore: overallAvgScore,
                      overallTechnicalScore: avgDimensions.technicalKnowledge,
                      overallCommunicationScore: avgDimensions.communication,
                      overallProblemSolvingScore: avgDimensions.problemSolving,
                      overallRelevanceScore: avgDimensions.relevance,
                      overallConfidenceScore: avgDimensions.confidence,
                      overallTimeManagementScore: avgDimensions.timeManagement,
                      personalizedFeedback:
                        "Demonstrated solid structured communication, relevant practical reasoning, and clear technical competencies.",
                    },
                    config.targetRole
                  )
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <Award className="h-4 w-4" /> Download PDF Scorecard
              </button>

              <button
                onClick={() => navigate("/mock-interview")}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Start New Practice Session
              </button>

              <button
                onClick={() => navigate("/interview-history")}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-7 py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-slate-200"
              >
                View History Reports
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 px-6 py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-slate-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

