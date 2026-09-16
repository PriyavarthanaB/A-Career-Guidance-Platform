import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import useUserStats from "../hooks/useUserStats";
import Sidebar from "../components/Sidebar";
import InterviewCard from "../components/interview/InterviewCard";
import DifficultySelector from "../components/interview/DifficultySelector";
import {
  UserCheck,
  Code2,
  Layers,
  Sparkles,
  Play,
  Briefcase,
  Mic,
  MessageSquare,
  Clock,
  Award,
  Flame,
  ChevronRight,
  HelpCircle,
  BarChart2,
  CheckCircle2,
  Zap,
  Target,
  Brain,
  Sliders,
  Loader2,
} from "lucide-react";

// Available Interview Types
const INTERVIEW_TYPES = [
  {
    id: "technical",
    title: "Technical Interview",
    subtitle: "Algorithms & System Design",
    description: "Deep technical evaluation covering Data Structures, Problem Solving, Code Optimization, and System Architecture.",
    icon: Code2,
    badge: "Technical",
    badgeColor: "bg-purple-50 text-purple-700 border border-purple-200",
    gradient: "from-violet-600 to-purple-600",
    features: [
      "Live algorithmic & data structure problems",
      "Time & space complexity analysis",
      "System design & architecture trade-offs",
    ],
    estimatedTime: "30-45 Mins",
  },
  {
    id: "hr",
    title: "HR Interview",
    subtitle: "Cultural Fit & Career Goals",
    description: "Evaluates your soft skills, company culture fit, salary expectations, motivations, and professional background.",
    icon: UserCheck,
    badge: "HR Round",
    badgeColor: "bg-blue-50 text-blue-700 border border-blue-200",
    gradient: "from-blue-600 to-cyan-600",
    features: [
      "Cultural fit & career goals evaluation",
      "Work ethics & team collaboration scenarios",
      "Salary negotiation & motivation prompts",
    ],
    estimatedTime: "15-30 Mins",
  },
  {
    id: "behavioral",
    title: "Behavioral Interview",
    subtitle: "STAR Method & Leadership",
    description: "Assesses how you handle past workplace scenarios, conflict resolution, accountability, and project stress.",
    icon: Brain,
    badge: "STAR Method",
    badgeColor: "bg-amber-50 text-amber-800 border border-amber-200",
    gradient: "from-amber-600 to-orange-600",
    features: [
      "STAR method (Situation, Task, Action, Result)",
      "Conflict resolution & crisis handling",
      "Leadership & initiative scenarios",
    ],
    estimatedTime: "20-30 Mins",
  },
  {
    id: "mixed",
    title: "Mixed Interview",
    subtitle: "Comprehensive Round",
    description: "Full end-to-end simulation combining technical problem solving, behavioral scenarios, and HR questions.",
    icon: Layers,
    badge: "Recommended",
    badgeColor: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    gradient: "from-emerald-600 to-teal-600",
    features: [
      "Blend of Technical + HR + Behavioral",
      "Simulates real 1-on-1 company hiring rounds",
      "Comprehensive 5-dimensional AI score report",
    ],
    estimatedTime: "30-60 Mins",
  },
];

// Duration Options
const DURATION_OPTIONS = [
  { minutes: 15, label: "15 Mins", questions: 3, desc: "Quick Session (3 Qs)" },
  { minutes: 30, label: "30 Mins", questions: 5, desc: "Standard Round (5 Qs)" },
  { minutes: 45, label: "45 Mins", questions: 8, desc: "In-Depth Round (8 Qs)" },
  { minutes: 60, label: "60 Mins", questions: 10, desc: "Full Master Round (10 Qs)" },
];

// Suggested Target Roles
const POPULAR_ROLES = [
  "Full Stack Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Data Analyst",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
];

export default function MockInterview() {
  const navigate = useNavigate();

  // Setup state
  const [selectedType, setSelectedType] = useState("mixed");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
  const [targetRole, setTargetRole] = useState("Full Stack Software Developer");
  const [selectedDuration, setSelectedDuration] = useState(30); // 15, 30, 45, 60
  const [questionCount, setQuestionCount] = useState(5);
  const [responseMode, setResponseMode] = useState("text"); // 'text' or 'voice'
  const [user, setUser] = useState({ name: "Candidate" });

  // Live user stats
  const { stats, loading: statsLoading } = useUserStats();
  const mockSessions = stats?.mockSessionsCount ?? 0;
  const avgMockScore = stats?.avgMockScore ?? 0;

  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setUser(parsed);
        if (parsed.targetRole) setTargetRole(parsed.targetRole);
      }
    } catch (_) {}
  }, []);

  // Update question count when duration changes
  const handleDurationSelect = (durationObj) => {
    setSelectedDuration(durationObj.minutes);
    setQuestionCount(durationObj.questions);
  };

  // Handle Start Interview Button
  const handleStartInterview = async () => {
    setStarting(true);
    setErrorMsg("");
    try {
      const response = await API.post("/api/interview/start", {
        type: selectedType,
        difficulty: selectedDifficulty,
        targetRole,
        responseMode,
        durationMinutes: selectedDuration,
        questionCount,
      });

      const { interviewId, data } = response.data;

      navigate("/mock-interview/session", {
        state: {
          interviewId,
          type: selectedType,
          difficulty: selectedDifficulty,
          targetRole,
          durationMinutes: selectedDuration,
          responseMode,
          questionCount,
          questions: data?.questions,
        },
      });
    } catch (err) {
      console.error("Failed to start interview session:", err);
      setErrorMsg("Unable to connect to server. Launching session with client fallback...");
      
      // Fallback navigation in case server is temporary unreachable
      setTimeout(() => {
        navigate("/mock-interview/session", {
          state: {
            type: selectedType,
            difficulty: selectedDifficulty,
            targetRole,
            durationMinutes: selectedDuration,
            responseMode,
            questionCount,
          },
        });
      }, 1000);
    } finally {
      setStarting(false);
    }
  };

  const selectedCardInfo = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  return (
    <div
      className="relative overflow-hidden text-slate-900 bg-[#f4f7ff] min-h-screen font-sans flex antialiased"
    >
      {/* Background Radial Ambient Glows */}
      <div className="absolute -top-20 right-1/3 w-[650px] h-[650px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[550px] h-[550px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="relative z-10 lg:ml-[260px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-10">
        
        {/* Top Header & Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-xs font-bold text-blue-600 border border-blue-100 mb-3">
              <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
              SyntacHire AI Interviewer Suite
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              AI Interviewer Setup
            </h1>
            <p className="text-sm md:text-base text-slate-600 font-medium mt-1 max-w-xl">
              Configure your interview environment by selecting target role, round type, difficulty level, and session duration.
            </p>
          </div>

          {/* Quick Performance Stats Card */}
          <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 shrink-0 ring-1 ring-white/[0.06]">
            <div className="flex items-center gap-3.5 border-r border-white/[0.06] pr-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Flame className="h-5 w-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Mock Sessions</p>
                <p className="text-base font-bold text-slate-900">
                  {statsLoading ? "…" : `${mockSessions} Session${mockSessions !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Avg Performance</p>
                <p className="text-base font-bold text-blue-600">
                  {statsLoading ? "…" : mockSessions > 0 ? `${avgMockScore}% Match` : "No data yet"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Target Job Role Selection */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-black shadow-md shadow-blue-500/20">
                1
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Target Job Role
              </h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Role-Calibrated
            </span>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Briefcase className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Type or select target role (e.g. Full Stack Software Developer)"
                className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3.5 text-base font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all shadow-xs"
              />
            </div>

            {/* Quick Select Role Chips */}
            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Popular Target Roles:
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      targetRole === role
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Select Interview Type (4 Modes: Technical, HR, Behavioral, Mixed) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-black shadow-md shadow-blue-500/20">
                2
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Select Interview Type
              </h2>
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-lg shadow-black/20">
              4 Round Types Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {INTERVIEW_TYPES.map((type) => (
              <InterviewCard
                key={type.id}
                id={type.id}
                title={type.title}
                subtitle={type.subtitle}
                description={type.description}
                icon={type.icon}
                badge={type.badge}
                badgeColor={type.badgeColor}
                gradient={type.gradient}
                features={type.features}
                estimatedTime={type.estimatedTime}
                isSelected={selectedType === type.id}
                onSelect={setSelectedType}
              />
            ))}
          </div>
        </section>

        {/* SECTION 3: Select Difficulty Level */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-black shadow-md shadow-blue-500/20">
                3
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Choose Difficulty Level
              </h2>
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-lg shadow-black/20">
              Experience Level
            </span>
          </div>

          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onSelect={setSelectedDifficulty}
          />
        </section>

        {/* SECTION 4: Select Duration & Response Mode */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-black shadow-md shadow-blue-500/20">
                4
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Select Session Duration &amp; Mode
              </h2>
            </div>
            <span className="text-xs font-extrabold bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full border border-blue-200">
              Configurable Pace
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Duration Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" /> Target Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DURATION_OPTIONS.map((dur) => (
                  <button
                    key={dur.minutes}
                    type="button"
                    onClick={() => handleDurationSelect(dur)}
                    className={`flex flex-col items-center justify-center py-3.5 px-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      selectedDuration === dur.minutes
                        ? "bg-blue-600 text-white border-blue-600 shadow-md -translate-y-0.5"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <span className="text-base font-black">{dur.label}</span>
                    <span className="text-[10px] font-bold text-slate-500 mt-0.5">{dur.questions} Questions</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Each question allows 3-5 minutes for complete answer delivery &amp; AI evaluation feedback.
              </p>
            </div>

            {/* Response Mode Toggle (Text vs Voice) */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Mic className="h-4 w-4 text-blue-400" /> Response Delivery Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResponseMode("text")}
                  className={`flex items-center justify-center gap-2.5 py-4 rounded-2xl text-xs font-extrabold border transition-all duration-200 cursor-pointer ${
                    responseMode === "text"
                      ? "bg-blue-600 text-white border-blue-600 shadow-md -translate-y-0.5"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <MessageSquare className="h-4.5 w-4.5 text-blue-400" /> Text Input Mode
                </button>
                <button
                  type="button"
                  onClick={() => setResponseMode("voice")}
                  className={`flex items-center justify-center gap-2.5 py-4 rounded-2xl text-xs font-extrabold border transition-all duration-200 cursor-pointer ${
                    responseMode === "voice"
                      ? "bg-blue-600 text-white border-blue-600 shadow-md -translate-y-0.5"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Mic className="h-4.5 w-4.5 text-blue-400 animate-pulse" /> Voice Recording Mode
                </button>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Voice mode enables speech-to-text recording with real-time audio playback by the AI interviewer.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: Start Interview CTA Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/[0.08] p-8 md:p-10 shadow-xl shadow-black/30 hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                AI Interview Room Ready
              </div>
              <h3 className="text-2xl md:text-3xl font-black leading-snug text-slate-900">
                Launch {selectedCardInfo?.title}?
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Configuration: <strong className="text-white">{selectedDifficulty} Difficulty</strong> •{" "}
                <strong className="text-white">{targetRole}</strong> •{" "}
                <strong className="text-white">{selectedDuration} Mins ({questionCount} Qs)</strong> •{" "}
                <strong className="text-white">{responseMode.toUpperCase()} mode</strong>.
              </p>
              {errorMsg && (
                <p className="text-xs text-amber-400 font-bold animate-pulse mt-1">
                  ⚠️ {errorMsg}
                </p>
              )}
            </div>

            <button
              onClick={handleStartInterview}
              disabled={starting}
              className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 px-8 py-4 rounded-2xl font-black text-base shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {starting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
                  Initializing Room...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current text-slate-900" />
                  Start AI Interview Session
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* SECTION 6: Practice History Summary */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Your Practice History</h3>
            {!statsLoading && mockSessions > 0 && (
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {mockSessions} session{mockSessions !== 1 ? "s" : ""} completed
              </span>
            )}
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/50" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-slate-800/50 rounded" />
                      <div className="h-3 w-1/2 bg-slate-800/50 rounded" />
                    </div>
                    <div className="h-6 w-16 bg-slate-800/50 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : mockSessions === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-xs">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">No interviews recorded yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Complete your first mock interview session to see your history and track your score progression.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Round #{mockSessions}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{selectedDifficulty} • {targetRole} • Most Recent</p>
                  </div>
                </div>
                <span className={`text-xs font-black px-3 py-1.5 rounded-full border shadow-lg shadow-black/20 ${
                  avgMockScore >= 80
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : avgMockScore >= 60
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                }`}>
                  {avgMockScore}% Avg
                </span>
              </div>

              {mockSessions >= 2 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Round #{mockSessions - 1}</h4>
                      <p className="text-xs text-slate-500 font-medium">{targetRole} • Previous Session</p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-3 py-1.5 rounded-full border shadow-lg shadow-black/20 ${
                    avgMockScore >= 80
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  }`}>
                    {avgMockScore}% Avg
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
