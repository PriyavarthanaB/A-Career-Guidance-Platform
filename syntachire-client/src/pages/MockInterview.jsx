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
} from "lucide-react";

// Available Interview Types
const INTERVIEW_TYPES = [
  {
    id: "hr",
    title: "HR Interview",
    subtitle: "Behavioral & Cultural",
    description: "Evaluates your soft skills, leadership qualities, conflict resolution, and alignment with company values.",
    icon: UserCheck,
    badge: "Behavioral",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    gradient: "from-blue-600 to-cyan-600",
    features: [
      "STAR method answer evaluation",
      "Culture fit & leadership scenarios",
      "Salary negotiation & career goal prompts",
    ],
    estimatedTime: "20-30 Mins",
  },
  {
    id: "technical",
    title: "Technical Interview",
    subtitle: "Algorithms & System Design",
    description: "Deep technical evaluation covering Data Structures, Problem Solving, Code Optimization, and Architecture.",
    icon: Code2,
    badge: "Hands-On",
    badgeColor: "bg-violet-100 text-violet-700 border-violet-200",
    gradient: "from-violet-600 to-purple-600",
    features: [
      "Live algorithmic & data structure problems",
      "Time/space complexity analysis",
      "System design & architecture trade-offs",
    ],
    estimatedTime: "35-45 Mins",
  },
  {
    id: "mixed",
    title: "Mixed Interview",
    subtitle: "Comprehensive Round",
    description: "Full end-to-end simulation combining behavioral HR questions with technical problem solving.",
    icon: Layers,
    badge: "Recommended",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    gradient: "from-emerald-600 to-teal-600",
    features: [
      "15 min HR + 30 min Technical coding",
      "Simulates real 1-on-1 hiring rounds",
      "Comprehensive AI score breakdown",
    ],
    estimatedTime: "45-60 Mins",
  },
];

export default function MockInterview() {
  const navigate = useNavigate();

  // Selected parameters state
  const [selectedType, setSelectedType] = useState("mixed");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
  const [targetRole, setTargetRole] = useState("Full Stack Software Developer");
  const [responseMode, setResponseMode] = useState("text"); // 'text' or 'voice'
  const [questionCount, setQuestionCount] = useState(5);
  const [user, setUser] = useState({ name: "Candidate" });

  // Live user stats
  const { stats, loading: statsLoading } = useUserStats();
  const mockSessions   = stats?.mockSessionsCount   ?? 0;
  const avgMockScore   = stats?.avgMockScore        ?? 0;

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

  const [starting, setStarting] = useState(false);

  // Handle Start Interview Button
  const handleStartInterview = async () => {
    setStarting(true);
    try {
      const response = await API.post("/api/interview/start", {
        type: selectedType,
        difficulty: selectedDifficulty,
        targetRole,
        responseMode,
        questionCount,
      });

      const { interviewId, data } = response.data;

      navigate("/mock-interview/session", {
        state: {
          interviewId,
          type: selectedType,
          difficulty: selectedDifficulty,
          targetRole,
          responseMode,
          questionCount,
          questions: data?.questions,
        },
      });
    } catch (err) {
      console.error("Failed to start interview session:", err);
      // Fallback navigation in case server is unreachable
      navigate("/mock-interview/session", {
        state: {
          type: selectedType,
          difficulty: selectedDifficulty,
          targetRole,
          responseMode,
          questionCount,
        },
      });
    } finally {
      setStarting(false);
    }
  };

  const selectedCardInfo = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
      {/* Sidebar for uniform post-login navigation */}
      <Sidebar />

      {/* Main Content Area offset by Sidebar width */}
      <main className="lg:ml-[280px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-10">
        
        {/* Top Header & Tagline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 text-xs font-bold text-blue-800 ring-1 ring-inset ring-blue-700/10 mb-3 shadow-xs">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              SyntacHire AI Mock Interviewer
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
              Interview Simulator
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-normal mt-1 max-w-xl">
              Configure your interview environment, select interview type & difficulty, and practice with real-time AI evaluation.
            </p>
          </div>

          {/* Quick Stats Pill — live per-user data */}
          <div className="flex items-center gap-4 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-xs shrink-0">
            <div className="flex items-center gap-3 border-r border-slate-100 pr-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="h-5 w-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Mock Sessions</p>
                <p className="text-base font-black text-slate-800">
                  {statsLoading ? '…' : `${mockSessions} Session${mockSessions !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Avg Performance</p>
                <p className="text-base font-black text-blue-600">
                  {statsLoading ? '…' : mockSessions > 0 ? `${avgMockScore}% Match` : 'No data yet'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Choose Interview Type */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-black">
                1
              </span>
              <h2 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">
                Select Interview Type
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">
              3 Modes Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Section 2: Choose Difficulty Level */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-black">
                2
              </span>
              <h2 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">
                Choose Difficulty Level
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Calibrated to Role Level
            </span>
          </div>

          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onSelect={setSelectedDifficulty}
          />
        </section>

        {/* Section 3: Fine-Tune Preferences */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-xs font-black">
                3
              </span>
              <h2 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">
                Fine-Tune Session Settings
              </h2>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Customizable
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Target Role Input */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" /> Target Job Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Developer, DevOps Engineer"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition"
              />
              <p className="text-[11px] text-slate-400">
                Questions will be tailored specifically to this role.
              </p>
            </div>

            {/* Question Count Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" /> Question Count
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                      questionCount === count
                        ? "bg-[#004ac6] text-white border-[#004ac6] shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {count} Qs ({count * 5} mins)
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Estimated duration: ~{questionCount * 5} minutes total.
              </p>
            </div>

            {/* Response Mode Toggle (Text vs Voice) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Mic className="h-4 w-4 text-blue-600" /> Response Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResponseMode("text")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                    responseMode === "text"
                      ? "bg-[#004ac6] text-white border-[#004ac6] shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" /> Text Input
                </button>
                <button
                  type="button"
                  onClick={() => setResponseMode("voice")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                    responseMode === "voice"
                      ? "bg-[#004ac6] text-white border-[#004ac6] shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Mic className="h-4 w-4" /> Voice Mode
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Choose between typing answers or speech-to-text live audio.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Start Interview Banner CTA */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#004ac6] via-[#1a56d6] to-[#2563eb] p-8 md:p-10 shadow-xl text-white">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-yellow-300 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Session Ready to Initialize
              </div>
              <h3 className="text-2xl md:text-3xl font-black leading-snug">
                Ready for your {selectedCardInfo?.title}?
              </h3>
              <p className="text-sm text-white/80 max-w-xl">
                Configuration: <strong className="text-white">{selectedDifficulty} Difficulty</strong> •{" "}
                <strong className="text-white">{targetRole}</strong> •{" "}
                <strong className="text-white">{questionCount} Questions</strong> ({responseMode.toUpperCase()} mode).
              </p>
            </div>

            <button
              onClick={handleStartInterview}
              className="group relative flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-[#0b1c30] px-8 py-4 rounded-2xl font-black text-base shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Play className="h-5 w-5 fill-current text-[#0b1c30]" />
              Start Interview Now
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* Section 5: Past Mock Sessions — dynamic */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0b1c30]">Your Practice History</h3>
            {!statsLoading && mockSessions > 0 && (
              <span className="text-xs font-bold text-slate-400">{mockSessions} session{mockSessions !== 1 ? 's' : ''} completed</span>
            )}
          </div>

          {statsLoading ? (
            /* Loading skeleton */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-slate-100 rounded" />
                      <div className="h-3 w-1/2 bg-slate-100 rounded" />
                    </div>
                    <div className="h-6 w-16 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : mockSessions === 0 ? (
            /* No sessions yet */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-sm text-[#0b1c30]">No interviews yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Complete your first mock interview to see your history and track your progress here.
              </p>
            </div>
          ) : (
            /* Show last up to 2 sessions based on stats */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0b1c30]">
                      {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Round #{mockSessions}
                    </h4>
                    <p className="text-xs text-slate-500">{selectedDifficulty} • {targetRole} • Most recent</p>
                  </div>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                  avgMockScore >= 80
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                    : avgMockScore >= 60
                    ? 'text-amber-600 bg-amber-50 border-amber-200'
                    : 'text-rose-600 bg-rose-50 border-rose-200'
                }`}>
                  {avgMockScore}% Avg
                </span>
              </div>

              {mockSessions >= 2 && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0b1c30]">Round #{mockSessions - 1}</h4>
                      <p className="text-xs text-slate-500">{targetRole} • Previous session</p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                    avgMockScore >= 80
                      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                      : 'text-amber-600 bg-amber-50 border-amber-200'
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
