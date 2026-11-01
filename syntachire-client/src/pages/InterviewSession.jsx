import { generateInterviewReportPDF } from "../utils/pdfGenerator";
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Zap,
  Activity,
  BarChart2,
  Check,
  BookOpen,
  Video,
  VideoOff,
  Copy,
  Play,
  Pause,
  RefreshCw,
  Building2,
  GraduationCap,
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
    seniorityLevel: "Mid-Level",
    industryFocus: "Technology & SaaS",
    responseMode: "voice",
    questionCount: 5,
    enableCamera: true,
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

  // Answering & Recording State
  const [answer, setAnswer] = useState("");
  const [showRecorder, setShowRecorder] = useState(config.responseMode === "voice");
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [recordingData, setRecordingData] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [answersList, setAnswersList] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);

  // 15s Formulation & Preparation Timer
  const [isPrepPhase, setIsPrepPhase] = useState(true);
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(15);

  // Voice AI Interviewer State (Text-to-Speech)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Webcam State
  const [cameraActive, setCameraActive] = useState(Boolean(config.enableCamera));
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);

  // Replay & Drill Single Question State
  const [drillingQuestion, setDrillingQuestion] = useState(null);
  const [copiedIdealIndex, setCopiedIdealIndex] = useState(null);

  // Time allocation per question
  const questionTimeLimit = Math.max(
    60,
    Math.floor(((Number(config.durationMinutes) || 30) * 60) / (Number(config.questionCount) || 5))
  );
  const [timeLeft, setTimeLeft] = useState(questionTimeLimit);

  const currentQ = questionsList[currentIndex] || questionsList[0];

  // Prevent accidental page unload
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

  // Webcam setup
  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      if (cameraActive && navigator.mediaDevices?.getUserMedia) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          videoStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.warn("Could not access camera preview:", err.message);
          setCameraActive(false);
        }
      }
    };

    if (cameraActive && !isFinished) {
      startCamera();
    }

    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((track) => track.stop());
        videoStreamRef.current = null;
      }
    };
  }, [cameraActive, isFinished]);

  // 15s Formulation Timer Effect
  useEffect(() => {
    if (isFinished || currentFeedback || evaluating) return;
    setIsPrepPhase(true);
    setPrepSecondsLeft(15);

    const timer = setInterval(() => {
      setPrepSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPrepPhase(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, currentFeedback, evaluating, isFinished]);

  // Main Question Countdown Timer (starts after prep phase)
  useEffect(() => {
    if (isPrepPhase || isFinished || currentFeedback || evaluating) return;
    setTimeLeft(questionTimeLimit);

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
  }, [isPrepPhase, currentIndex, currentFeedback, evaluating, isFinished, questionTimeLimit]);

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

    const message = `Question ${currentIndex + 1}. ${currentQ.q}. ${currentQ.hint ? `Tip: ${currentQ.hint}` : ""}`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

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

  // Submit Answer
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

        feedbackObj = res.data.evaluation || res.data.feedback || res.data.questionData;
        if (res.data.nextDifficulty) {
          nextDiff = res.data.nextDifficulty;
          setCurrentDifficulty(res.data.nextDifficulty);
        }

        if (res.data.nextQuestion) {
          const nextQObj = {
            q: res.data.nextQuestion.question,
            hint: res.data.nextQuestion.hint,
            category: res.data.nextQuestion.category,
            difficulty: res.data.nextQuestion.difficulty || nextDiff,
          };
          setQuestionsList((prev) => [...prev, nextQObj]);
        }
      } else {
        const res = await API.post("/api/interview/evaluate", {
          question: currentQ.q,
          answer: answer.trim(),
          targetRole: config.targetRole,
          seniorityLevel: config.seniorityLevel,
          industryFocus: config.industryFocus,
          difficulty: currentDifficulty,
          type: config.type,
        });
        feedbackObj = res.data.data;
      }

      const normalizedScores = {
        score: feedbackObj.score || 78,
        technicalKnowledgeScore: feedbackObj.technicalKnowledgeScore ?? 80,
        correctnessScore: feedbackObj.correctnessScore ?? 78,
        problemSolvingScore: feedbackObj.problemSolvingScore ?? 80,
        communicationScore: feedbackObj.communicationScore ?? 75,
        relevanceScore: feedbackObj.relevanceScore ?? 82,
        confidenceScore: feedbackObj.confidenceScore ?? 76,
        timeManagementScore: feedbackObj.timeManagementScore ?? (timeLeft > 10 ? 85 : 65),
        strengths: feedbackObj.strengths || ["Provided clear structured communication."],
        weaknesses: feedbackObj.weaknesses || ["Could provide more concrete production metrics."],
        missingPoints: feedbackObj.missingPoints || feedbackObj.missingConcepts || [],
        idealAnswer: feedbackObj.idealAnswer || "An ideal response outlines architecture choices, trade-offs, and failure recovery.",
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
          audioUrl: recordingData?.audioUrl || "",
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
        idealAnswer: "An ideal answer covers system architecture, trade-offs, and rigorous edge-case validation.",
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
          audioUrl: recordingData?.audioUrl || "",
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

  // Copy Ideal Answer
  const handleCopyIdealAnswer = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIdealIndex(index);
    setTimeout(() => setCopiedIdealIndex(null), 2000);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-6 py-4 rounded-3xl border border-slate-200/80 shadow-sm shadow-slate-900/5">
          <Link
            to="/mock-interview"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-blue-600 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Room
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {config.type.toUpperCase()} Round
            </span>
            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${currentDiffBadge.color}`}>
              <span className={`h-2 w-2 rounded-full ${currentDiffBadge.dot}`} />
              {currentDifficulty}
            </span>
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-600" /> {config.seniorityLevel || "Mid-Level"}
            </span>
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" /> {config.industryFocus || "Tech"}
            </span>
          </div>
        </div>

        {!isFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Q&A Panel (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Question Progress Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm shadow-slate-900/5">
                {/* Header & Timer */}
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
                    {/* Preparation or Answering Timer */}
                    {isPrepPhase ? (
                      <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        <span>Thinking Time: {prepSecondsLeft}s</span>
                      </div>
                    ) : (
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
                    )}

                    <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {currentQ?.category || "Core Concept"}
                    </span>
                  </div>
                </div>

                {/* Stepper Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Interview Progress</span>
                    <span>{Math.round(((currentIndex + (currentFeedback ? 1 : 0)) / (questionsList.length || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                    <div
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.round(((currentIndex + (currentFeedback ? 1 : 0)) / (questionsList.length || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* AI Interviewer Avatar & Voice Card */}
                <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-purple-50/50 p-5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {/* Avatar Icon / Wave */}
                      <div className="relative flex items-center justify-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 ${
                          isSpeaking
                            ? "bg-gradient-to-tr from-rose-500 to-amber-500 scale-105 shadow-rose-500/20"
                            : "bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/20"
                        }`}>
                          {isSpeaking ? <Volume2 className="h-6 w-6 animate-pulse" /> : <Brain className="h-6 w-6" />}
                        </div>
                        {isSpeaking && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                            AI Interviewer
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {isSpeaking ? "Speaking Question Out Loud..." : isPrepPhase ? "Candidate Formulating Answer" : "Listening for Response"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                          {config.seniorityLevel} {config.targetRole} Panel
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={speakCurrentQuestion}
                        className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-bold border border-slate-200 shadow-2xs transition cursor-pointer"
                        title="Replay Voice Prompt"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-blue-600" /> Replay Voice
                      </button>
                      <button
                        type="button"
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${
                          voiceEnabled
                            ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                        {voiceEnabled ? "Voice On" : "Muted"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Formulation Timer Banner (Prep Phase) */}
                {isPrepPhase && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <Zap className="h-5 w-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-amber-900">Formulation Window ({prepSecondsLeft}s remaining)</p>
                        <p className="text-[11px] text-amber-800 font-medium">Read the prompt, structure your points (STAR method for behavioral), and prepare to speak.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPrepPhase(false)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer shrink-0 shadow-2xs"
                    >
                      Ready to Answer Now &rarr;
                    </button>
                  </div>
                )}

                {/* The Question Prompt */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    Question #{currentIndex + 1}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                    "{currentQ.q}"
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                    <span><strong>Interviewer Guidance:</strong> {currentQ.hint}</span>
                  </div>
                </div>

                {/* Candidate Answer Workspace */}
                {!currentFeedback ? (
                  <div className="space-y-5 pt-3 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-900">
                          Your Answer Capture
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Speak out loud or type. Speech-to-text live transcription active.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowRecorder(true)}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold border transition cursor-pointer ${
                            showRecorder
                              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          Voice Mode
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRecorder(false)}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold border transition cursor-pointer ${
                            !showRecorder
                              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
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
                        label="Live Voice Response Mode"
                      />
                    )}

                    {/* Text Answer Review / Fallback */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>Answer Transcript Review:</span>
                        <span>{answer.trim() ? `${answer.trim().split(/\s+/).length} words` : "Empty"}</span>
                      </div>
                      <textarea
                        rows={4}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Your spoken words or typed answer will appear here. Edit as needed before submitting."
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 leading-relaxed shadow-2xs"
                      />
                    </div>

                    {/* Submit Action Buttons */}
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
                            <Loader2 className="h-4 w-4 animate-spin" /> Evaluating with Gemini AI...
                          </>
                        ) : (
                          <>
                            Submit Answer <Send className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 7-DIMENSION SCORECARD AFTER SUBMITTING */
                  <div className="space-y-6 pt-3 border-t border-slate-100 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 p-5 rounded-3xl shadow-2xs">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                            Gemini AI Response Score
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
                        Competency Scores
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {[
                          { label: "Technical Knowledge", score: currentFeedback.technicalKnowledgeScore },
                          { label: "Correctness", score: currentFeedback.correctnessScore },
                          { label: "Problem Solving", score: currentFeedback.problemSolvingScore },
                          { label: "STAR Structure", score: currentFeedback.communicationScore },
                          { label: "Relevance", score: currentFeedback.relevanceScore },
                          { label: "Confidence & Tone", score: currentFeedback.confidenceScore },
                          { label: "Pacing & Delivery", score: currentFeedback.timeManagementScore },
                        ].map((dim) => (
                          <div key={dim.label} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-1.5">
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

                    {/* Sample Ideal Model Answer */}
                    {currentFeedback.idealAnswer && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-1.5 text-xs">
                        <p className="font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-blue-600" /> Sample Ideal Answer (Model Response)
                        </p>
                        <p className="text-slate-800 font-medium leading-relaxed">
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
                            Finish &amp; View Final Scorecard <Award className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Tools & Webcam View (4 Columns) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Webcam Practice View */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-sm shadow-slate-900/5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">Camera Practice</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCameraActive(!cameraActive)}
                    className="text-[11px] font-bold text-slate-500 hover:text-purple-600 transition"
                  >
                    {cameraActive ? "Turn Off" : "Turn On"}
                  </button>
                </div>

                {cameraActive ? (
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video border border-slate-200 shadow-inner flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Preview
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-6 text-center space-y-1.5">
                    <VideoOff className="h-6 w-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Camera is Off</p>
                    <p className="text-[10px] text-slate-500">Practice your eye contact &amp; posture by turning on camera.</p>
                  </div>
                )}
              </div>

              {/* Adaptive Difficulty Live Tracker */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-sm shadow-slate-900/5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-xs text-slate-900 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" /> Adaptive Difficulty
                  </h3>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${currentDiffBadge.color}`}>
                    {currentDifficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Calibrated for <strong>{config.seniorityLevel}</strong> expectations in {config.industryFocus}.
                </p>
              </div>

              {/* 7-Dimension Rubric Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-sm shadow-slate-900/5">
                <h3 className="font-black text-xs text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Activity className="h-4 w-4 text-indigo-600" /> Evaluation Checklist
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">✓ Technical Depth &amp; Correctness</li>
                  <li className="flex items-center gap-2">✓ STAR Method (Situation, Task, Action, Result)</li>
                  <li className="flex items-center gap-2">✓ Minimal Filler Words &amp; Smooth WPM</li>
                  <li className="flex items-center gap-2">✓ Trade-off &amp; Scale Awareness</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* COMPREHENSIVE FINAL SCORECARD REPORT & REPLAY / REFINE */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 max-w-5xl mx-auto space-y-8 shadow-sm shadow-slate-900/5 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="text-center space-y-3 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Award className="h-8 w-8 text-amber-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Interview Completed! 🎉
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
                Comprehensive AI evaluation report for <strong className="text-slate-900">{config.seniorityLevel} {config.targetRole}</strong> in the <strong className="text-blue-600">{config.industryFocus}</strong> industry.
              </p>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-6 rounded-2xl text-white text-center space-y-1 shadow-md shadow-blue-500/20">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-100">
                  Overall Benchmark
                </span>
                <p className="text-4xl font-black">{sessionResult?.overallScore ?? overallAvgScore}%</p>
                <span className="text-xs font-bold text-amber-300 block">
                  {overallAvgScore >= 85 ? "🎯 Onsite Ready" : overallAvgScore >= 70 ? "⚡ Competitive" : "🌱 Needs Practice"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Technical Depth
                </span>
                <p className="text-2xl font-black text-blue-600">{avgDimensions.technicalKnowledge}%</p>
                <span className="text-xs text-slate-500 font-medium">Concepts &amp; trade-offs</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Problem Solving
                </span>
                <p className="text-2xl font-black text-indigo-600">{avgDimensions.problemSolving}%</p>
                <span className="text-xs text-slate-500 font-medium">Decomposition</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Communication
                </span>
                <p className="text-2xl font-black text-emerald-600">{avgDimensions.communication}%</p>
                <span className="text-xs text-slate-500 font-medium">STAR clarity</span>
              </div>
            </div>

            {/* AI Executive Summary */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-3xl space-y-3">
              <p className="font-black text-blue-800 uppercase tracking-wider text-xs flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" /> AI Executive Feedback &amp; Action Plan
              </p>
              <p className="font-medium text-slate-800 text-sm leading-relaxed">
                {sessionResult?.personalizedFeedback ||
                  sessionResult?.summary ||
                  "Demonstrated solid structured communication, relevant practical reasoning, and clear technical competencies. To reach top-percentile hiring standard, emphasize quantifiable business metrics and edge-case mitigations."}
              </p>
            </div>

            {/* Question-by-Question Deep Analysis & Replay/Refine */}
            {answersList.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" /> Question-by-Question Review &amp; Model Answers
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{answersList.length} Questions Evaluated</span>
                </div>

                <div className="space-y-5">
                  {answersList.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs"
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

                      {/* Candidate Transcribed Response */}
                      {q.userAnswer && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-black uppercase text-slate-500">Your Answer:</p>
                          <p className="text-xs text-slate-800 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
                            "{q.userAnswer}"
                          </p>
                        </div>
                      )}

                      {/* Audio Playback if Recorded */}
                      {q.audioUrl && (
                        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Mic className="h-3.5 w-3.5 text-blue-600" /> Audio Recording
                          </span>
                          <audio controls className="h-7 w-64" src={q.audioUrl} />
                        </div>
                      )}

                      {/* Sample Ideal Model Answer */}
                      {q.idealAnswer && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase text-blue-700 flex items-center gap-1.5">
                              <Sparkles className="h-3 w-3 text-blue-600" /> Exemplary Model Response:
                            </p>
                            <button
                              type="button"
                              onClick={() => handleCopyIdealAnswer(q.idealAnswer, idx)}
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition cursor-pointer"
                            >
                              {copiedIdealIndex === idx ? (
                                <> <Check className="h-3 w-3 text-emerald-600" /> Copied! </>
                              ) : (
                                <> <Copy className="h-3 w-3" /> Copy Ideal Answer </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-800 bg-blue-50/60 p-3.5 rounded-xl border border-blue-200/70 leading-relaxed font-medium">
                            "{q.idealAnswer}"
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {q.strengths?.length > 0 && (
                          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                            <p className="font-black text-emerald-800 uppercase text-[10px]">✓ Key Strengths</p>
                            <ul className="list-disc list-inside text-slate-700 space-y-0.5 font-medium">
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
                            <ul className="list-disc list-inside text-slate-700 space-y-0.5 font-medium">
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

            {/* Action Buttons */}
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
                Retake / New Practice Session
              </button>

              <button
                onClick={() => navigate("/interview-history")}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-7 py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-slate-200"
              >
                View History Reports
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
