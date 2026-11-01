import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import useUserStats from "../hooks/useUserStats";
import Sidebar from "../components/Sidebar";
import InterviewCard from "../components/interview/InterviewCard";
import DifficultySelector from "../components/interview/DifficultySelector";
import { generateInterviewReportPDF } from "../utils/pdfGenerator";
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
  FileText,
  Video,
  Building2,
  GraduationCap,
  FileCheck,
  AlignLeft,
  Download,
  X,
  Check,
  Copy,
  ThumbsUp,
  AlertTriangle,
  Activity,
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
      "Comprehensive 7-dimensional AI score report",
    ],
    estimatedTime: "30-60 Mins",
  },
];

// Seniority Level Options
const SENIORITY_OPTIONS = [
  { id: "Junior / Entry-Level", label: "Entry / Junior", exp: "0 - 2 Yrs", desc: "Core fundamentals & coding logic" },
  { id: "Mid-Level", label: "Mid-Level", exp: "2 - 5 Yrs", desc: "Feature delivery & practical architecture" },
  { id: "Senior", label: "Senior", exp: "5 - 8 Yrs", desc: "Scalability, fault tolerance & trade-offs" },
  { id: "Lead / Staff", label: "Lead / Staff", exp: "8+ Yrs", desc: "System strategy & high-level architecture" },
];

// Industry Focus Options
const INDUSTRY_OPTIONS = [
  "Technology & SaaS",
  "FinTech & Banking",
  "E-Commerce & Retail",
  "Healthcare & HealthTech",
  "AI & Data Science",
  "Enterprise & Consulting",
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
  const [seniorityLevel, setSeniorityLevel] = useState("Mid-Level");
  const [industryFocus, setIndustryFocus] = useState("Technology & SaaS");
  const [calibrationTab, setCalibrationTab] = useState("resume"); // 'resume' | 'jd' | 'custom'
  const [jobDescription, setJobDescription] = useState("");
  const [enableCamera, setEnableCamera] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [questionCount, setQuestionCount] = useState(5);
  const [responseMode, setResponseMode] = useState("voice"); // Default to Voice Mode for real simulation
  const [user, setUser] = useState({ name: "Candidate" });

  // Resume context
  const [resumeLoaded, setResumeLoaded] = useState(false);
  const [resumeSkills, setResumeSkills] = useState([]);

  // Live user stats
  const { stats, loading: statsLoading } = useUserStats();
  const mockSessions = stats?.mockSessionsCount ?? 0;
  const avgMockScore = stats?.avgMockScore ?? 0;

  // Real recent interview history state
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedReportSession, setSelectedReportSession] = useState(null);
  const [copiedIdealIndex, setCopiedIdealIndex] = useState(null);

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

    // Load latest parsed resume if available
    const fetchLatestResume = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await API.get("/api/resume/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const latest = res.data.data[0];
          if (latest.extractedSkills && latest.extractedSkills.length > 0) {
            setResumeSkills(latest.extractedSkills);
            setResumeLoaded(true);
          }
        }
      } catch (err) {
        console.warn("Could not load latest resume skills:", err);
      }
    };

    // Fetch actual recent interview history from backend
    const fetchRecentHistory = async () => {
      setLoadingHistory(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await API.get("/api/interview/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success && Array.isArray(res.data.data)) {
          setRecentInterviews(res.data.data);
        }
      } catch (err) {
        console.warn("Could not load interview history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchLatestResume();
    fetchRecentHistory();
  }, []);

  const handleDurationSelect = (durationObj) => {
    setSelectedDuration(durationObj.minutes);
    setQuestionCount(durationObj.questions);
  };

  const handleStartInterview = async () => {
    setStarting(true);
    setErrorMsg("");
    try {
      const response = await API.post("/api/interview/start", {
        type: selectedType,
        difficulty: selectedDifficulty,
        targetRole,
        seniorityLevel,
        industryFocus,
        jobDescription: calibrationTab === "jd" ? jobDescription : "",
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
          seniorityLevel,
          industryFocus,
          jobDescription: calibrationTab === "jd" ? jobDescription : "",
          durationMinutes: selectedDuration,
          responseMode,
          questionCount,
          enableCamera,
          questions: data?.questions,
        },
      });
    } catch (err) {
      console.error("Failed to start interview session:", err);
      setErrorMsg("Unable to connect to server. Launching session with client fallback...");
      
      setTimeout(() => {
        navigate("/mock-interview/session", {
          state: {
            type: selectedType,
            difficulty: selectedDifficulty,
            targetRole,
            seniorityLevel,
            industryFocus,
            jobDescription: calibrationTab === "jd" ? jobDescription : "",
            durationMinutes: selectedDuration,
            responseMode,
            questionCount,
            enableCamera,
          },
        });
      }, 1000);
    } finally {
      setStarting(false);
    }
  };

  const selectedCardInfo = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  return (
    <div className="relative overflow-hidden text-slate-900 bg-[#f8fafc] min-h-screen font-sans flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="relative z-10 lg:ml-[260px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-10">
        
        {/* Top Header & Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-xs font-bold text-blue-700 border border-blue-200 mb-3 shadow-2xs">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              SyntacHire AI Mock Interview Platform
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              AI Mock Interview Setup
            </h1>
            <p className="text-sm md:text-base text-slate-600 font-medium mt-1 max-w-xl leading-relaxed">
              Step 1 of the 6-stage interview workflow: calibrate target job title, seniority level, industry domain, and question customization.
            </p>
          </div>

          {/* Quick Performance Stats Card */}
          <div className="flex items-center gap-4 bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 shrink-0">
            <div className="flex items-center gap-3.5 border-r border-slate-100 pr-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Flame className="h-5 w-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Completed</p>
                <p className="text-base font-bold text-slate-900">
                  {statsLoading ? "…" : `${mockSessions} Session${mockSessions !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">Avg Benchmark</p>
                <p className="text-base font-bold text-blue-600">
                  {statsLoading ? "…" : mockSessions > 0 ? `${avgMockScore}% Match` : "No data yet"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Target Role, Seniority & Industry Focus */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-xs font-black shadow-2xs">
                1
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Profile &amp; Role Calibration
                </h2>
                <p className="text-xs text-slate-500 font-medium">Define your target title, seniority, and industry focus</p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Role-Calibrated
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Target Job Title (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" /> Target Job Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Type target role (e.g. Full Stack Software Developer)"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-4 py-3.5 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs"
                />
              </div>

              {/* Popular Role Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {POPULAR_ROLES.slice(0, 6).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                      targetRole === role
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Seniority Level (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-600" /> Seniority Level
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {SENIORITY_OPTIONS.map((sen) => (
                  <button
                    key={sen.id}
                    type="button"
                    onClick={() => setSeniorityLevel(sen.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      seniorityLevel === sen.id
                        ? "bg-blue-50/90 border-blue-300 ring-2 ring-blue-500/20 shadow-2xs"
                        : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-900">{sen.label}</p>
                      <span className="text-[10px] font-bold text-slate-500">{sen.exp}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{sen.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Industry Focus (12 cols) */}
            <div className="lg:col-span-12 space-y-2.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-600" /> Industry Domain Focus
              </label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_OPTIONS.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setIndustryFocus(ind)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                      industryFocus === ind
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Custom Question Calibration Source */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center text-xs font-black shadow-2xs">
                2
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Question Bank Customization
                </h2>
                <p className="text-xs text-slate-500 font-medium">Link your resume or paste a specific job description</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCalibrationTab("resume")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                  calibrationTab === "resume"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                Resume Profile Sync
              </button>
              <button
                type="button"
                onClick={() => setCalibrationTab("jd")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                  calibrationTab === "jd"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                Paste Job Description
              </button>
            </div>
          </div>

          {calibrationTab === "resume" ? (
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span>Resume Skills Connected</span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {resumeLoaded ? `${resumeSkills.length} Verified Skills` : "Auto-Calibrating"}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI interviewer will adapt questions directly based on the projects, tech stack, and skill gaps identified from your analyzed resume.
              </p>
              {resumeSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resumeSkills.slice(0, 10).map((sk, idx) => (
                    <span key={idx} className="text-[11px] font-bold bg-white text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-indigo-600" /> Paste Targeted Job Description (JD)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                placeholder="Paste the full job posting, required qualifications, and tech stack here..."
                className="w-full text-xs font-medium text-slate-900 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 resize-y"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                AI will calibrate scenario questions and system design architectures to match the exact requirements of this posting.
              </p>
            </div>
          )}
        </section>

        {/* SECTION 3: Select Interview Type (4 Modes) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-xs font-black shadow-2xs">
                3
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Select Interview Round Type
                </h2>
                <p className="text-xs text-slate-500 font-medium">Choose between technical problem solving, STAR behavioral, or full simulation</p>
              </div>
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shadow-2xs">
              4 Round Types
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

        {/* SECTION 4: Select Difficulty Level */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-xs font-black shadow-2xs">
                4
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Choose Initial Difficulty
                </h2>
                <p className="text-xs text-slate-500 font-medium">Difficulty adapts dynamically as you answer</p>
              </div>
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shadow-2xs">
              Adaptive Engine
            </span>
          </div>

          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onSelect={setSelectedDifficulty}
          />
        </section>

        {/* SECTION 5: Duration, Response Mode & Webcam Practice */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-xs font-black shadow-2xs">
                5
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Session Duration &amp; Simulation Environment
                </h2>
                <p className="text-xs text-slate-500 font-medium">Pacing, voice recording, and camera practice controls</p>
              </div>
            </div>
            <span className="text-xs font-extrabold bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full border border-blue-200">
              Interactive Room
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Duration Selector (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" /> Target Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {DURATION_OPTIONS.map((dur) => (
                  <button
                    key={dur.minutes}
                    type="button"
                    onClick={() => handleDurationSelect(dur)}
                    className={`flex flex-col items-center justify-center py-3.5 px-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      selectedDuration === dur.minutes
                        ? "bg-blue-600 text-white border-blue-600 shadow-md -translate-y-0.5"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <span className="text-sm font-black">{dur.label}</span>
                    <span className="text-[10px] font-bold opacity-80 mt-0.5">{dur.questions} Qs</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Response Mode (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Mic className="h-4 w-4 text-blue-600" /> Response Delivery Mode
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setResponseMode("voice")}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    responseMode === "voice"
                      ? "bg-blue-600 text-white border-blue-600 shadow-md -translate-y-0.5"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Mic className="h-4 w-4 mb-1 animate-pulse" />
                  <span>Voice + AI Avatar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResponseMode("text")}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    responseMode === "text"
                      ? "bg-blue-600 text-white border-blue-600 shadow-md -translate-y-0.5"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mb-1" />
                  <span>Text Mode</span>
                </button>
              </div>
            </div>

            {/* Camera Preview Toggle (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Video className="h-4 w-4 text-purple-600" /> Webcam Practice
              </label>
              <button
                type="button"
                onClick={() => setEnableCamera(!enableCamera)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  enableCamera
                    ? "bg-purple-50 text-purple-900 border-purple-200 shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Video className={`h-4 w-4 ${enableCamera ? "text-purple-600" : "text-slate-400"}`} />
                  <span className="text-xs font-bold">{enableCamera ? "Camera On" : "Camera Off"}</span>
                </div>
                <div className={`w-8 h-4 rounded-full p-0.5 transition ${enableCamera ? "bg-purple-600" : "bg-slate-300"}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition ${enableCamera ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 6: Start Interview CTA Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-8 md:p-10 shadow-xl shadow-blue-500/15 hover:shadow-2xl transition-all duration-300 text-white">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                AI Interview Room Ready
              </div>
              <h3 className="text-2xl md:text-3xl font-black leading-snug">
                Launch {selectedCardInfo?.title}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl font-medium leading-relaxed">
                Role: <strong className="text-white font-bold">{seniorityLevel} {targetRole}</strong> ({industryFocus}) •{" "}
                <strong className="text-white font-bold">{selectedDifficulty} Difficulty</strong> •{" "}
                <strong className="text-white font-bold">{selectedDuration} Mins ({questionCount} Qs)</strong> •{" "}
                <strong className="text-white font-bold">{responseMode.toUpperCase()} Mode</strong>.
              </p>
              {errorMsg && (
                <p className="text-xs text-amber-300 font-bold animate-pulse mt-1">
                  ⚠️ {errorMsg}
                </p>
              )}
            </div>

            <button
              onClick={handleStartInterview}
              disabled={starting}
              className="group relative flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-4 rounded-2xl font-black text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {starting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-slate-950" />
                  Calibrating AI Room...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current text-slate-950" />
                  Start AI Interview Session
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* SECTION 7: Practice History Summary */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900">Your Practice History</h3>
              <p className="text-xs text-slate-500 font-medium">Review your past performance and score progression</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/interview-history")}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl border border-blue-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>View Full History ({recentInterviews.length || mockSessions})</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {loadingHistory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-slate-100 rounded" />
                      <div className="h-3 w-1/2 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentInterviews.length === 0 && mockSessions === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-3 shadow-2xs">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">No interviews recorded yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
                Complete your first mock interview session to see your history and track your score progression.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentInterviews.slice(0, 6).map((item, idx) => {
                const score = item.overallScore ?? item.score ?? 0;
                const scoreColor =
                  score >= 80
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : score >= 60
                    ? "text-amber-700 bg-amber-50 border-amber-200"
                    : "text-rose-700 bg-rose-50 border-rose-200";

                const roundLabel = (item.type || "mixed").toUpperCase();
                const roleLabel = item.targetRole || targetRole;
                const dateStr = item.completedAt || item.createdAt
                  ? new Date(item.completedAt || item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent Session";

                return (
                  <div
                    key={item._id || idx}
                    onClick={() => setSelectedReportSession(item)}
                    className="group bg-white border border-slate-200/80 hover:border-blue-300 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition">
                          {roundLabel.includes("TECH") ? (
                            <Code2 className="h-5 w-5" />
                          ) : roundLabel.includes("HR") ? (
                            <UserCheck className="h-5 w-5" />
                          ) : roundLabel.includes("BEHAV") ? (
                            <Brain className="h-5 w-5" />
                          ) : (
                            <Layers className="h-5 w-5" />
                          )}
                        </div>
                        <div className="truncate">
                          <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700 transition truncate">
                            {roundLabel} Round
                          </h4>
                          <p className="text-xs text-slate-500 font-medium truncate">{roleLabel}</p>
                        </div>
                      </div>

                      <span className={`text-xs font-black px-2.5 py-1 rounded-full border shrink-0 ${scoreColor}`}>
                        {score}% Score
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" /> {dateStr}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReportSession(item);
                        }}
                        className="font-bold text-blue-600 group-hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0"
                      >
                        View Report &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* FULL SCORECARD REPORT MODAL */}
      {selectedReportSession && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedReportSession(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative text-slate-900 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {(selectedReportSession.type || "mixed").toUpperCase()} Round Scorecard
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {selectedReportSession.difficulty || "Medium"} Difficulty
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {selectedReportSession.questionCount || selectedReportSession.questions?.length || 5} Questions
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                  {selectedReportSession.targetRole || targetRole}
                </h2>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Completed on{" "}
                  {selectedReportSession.completedAt || selectedReportSession.createdAt
                    ? new Date(selectedReportSession.completedAt || selectedReportSession.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recent Session"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateInterviewReportPDF(selectedReportSession, user.name || "Candidate")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                  title="Download Scorecard PDF"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedReportSession(null)}
                  className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  title="Close Modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Top Metric Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-5 rounded-2xl text-white text-center space-y-1 shadow-md shadow-blue-500/20">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-100">
                  Overall Score
                </span>
                <p className="text-3xl font-black">{selectedReportSession.overallScore ?? selectedReportSession.score ?? 0}%</p>
                <span className="text-[11px] font-bold text-amber-300 block">
                  {(selectedReportSession.overallScore ?? selectedReportSession.score ?? 0) >= 80
                    ? "🎯 Onsite Ready"
                    : (selectedReportSession.overallScore ?? selectedReportSession.score ?? 0) >= 60
                    ? "⚡ Competitive"
                    : "🌱 Needs Practice"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Technical Depth
                </span>
                <p className="text-2xl font-black text-blue-600">
                  {selectedReportSession.overallTechnicalScore ?? selectedReportSession.overallScore ?? 0}%
                </p>
                <span className="text-[11px] text-slate-500 font-medium">Domain knowledge</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Problem Solving
                </span>
                <p className="text-2xl font-black text-indigo-600">
                  {selectedReportSession.overallProblemSolvingScore ?? selectedReportSession.overallScore ?? 0}%
                </p>
                <span className="text-[11px] text-slate-500 font-medium">Approach &amp; logic</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Communication
                </span>
                <p className="text-2xl font-black text-emerald-600">
                  {selectedReportSession.overallCommunicationScore ?? selectedReportSession.overallScore ?? 0}%
                </p>
                <span className="text-[11px] text-slate-500 font-medium">Clarity &amp; structure</span>
              </div>
            </div>

            {/* 6 Dimension Competency Breakdown */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-600" /> 6-Dimensional Competency Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1">
                {[
                  { label: "Technical Knowledge", val: selectedReportSession.overallTechnicalScore ?? selectedReportSession.overallScore ?? 0, color: "bg-blue-600" },
                  { label: "Problem Solving", val: selectedReportSession.overallProblemSolvingScore ?? selectedReportSession.overallScore ?? 0, color: "bg-indigo-600" },
                  { label: "Communication Clarity", val: selectedReportSession.overallCommunicationScore ?? selectedReportSession.overallScore ?? 0, color: "bg-emerald-600" },
                  { label: "Relevance & Focus", val: selectedReportSession.overallRelevanceScore ?? selectedReportSession.overallScore ?? 0, color: "bg-amber-500" },
                  { label: "Confidence & Delivery", val: selectedReportSession.overallConfidenceScore ?? selectedReportSession.overallScore ?? 0, color: "bg-rose-500" },
                  { label: "Time Management", val: selectedReportSession.overallTimeManagementScore ?? selectedReportSession.overallScore ?? 0, color: "bg-purple-600" },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="text-slate-900">{item.val}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(item.val, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-5 space-y-2">
              <p className="font-black text-blue-800 uppercase tracking-wider text-xs flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" /> AI Executive Feedback &amp; Action Plan
              </p>
              <p className="font-medium text-slate-800 text-xs sm:text-sm leading-relaxed">
                {selectedReportSession.personalizedFeedback ||
                  selectedReportSession.summary ||
                  "Demonstrated solid structured communication, relevant practical reasoning, and clear technical competencies. Continue practicing STAR responses and edge-case mitigations for top-tier hiring readiness."}
              </p>
            </div>

            {/* Question by Question Detailed Breakdown */}
            {((selectedReportSession.questions && selectedReportSession.questions.length > 0) ||
              (selectedReportSession.answersList && selectedReportSession.answersList.length > 0)) && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-600" /> Question Breakdown &amp; Model Answers
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    {(selectedReportSession.questions || selectedReportSession.answersList).length} Questions
                  </span>
                </div>

                <div className="space-y-4">
                  {(selectedReportSession.questions || selectedReportSession.answersList).map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 border-b border-slate-200 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                              Question #{idx + 1}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {q.category || "General"}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">"{q.question}"</h4>
                        </div>
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 self-start">
                          {q.score ?? selectedReportSession.overallScore ?? 0}% Score
                        </span>
                      </div>

                      {/* Candidate Answer */}
                      {q.userAnswer && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-500">Your Answer:</p>
                          <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                            "{q.userAnswer}"
                          </p>
                        </div>
                      )}

                      {/* Model Answer */}
                      {q.idealAnswer && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase text-blue-700 flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-blue-600" /> Exemplary Model Response:
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(q.idealAnswer);
                                setCopiedIdealIndex(idx);
                                setTimeout(() => setCopiedIdealIndex(null), 2000);
                              }}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition cursor-pointer"
                            >
                              {copiedIdealIndex === idx ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-600" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" /> Copy Ideal Answer
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-800 bg-blue-50/60 p-3 rounded-xl border border-blue-200/70 leading-relaxed font-medium">
                            "{q.idealAnswer}"
                          </p>
                        </div>
                      )}

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {q.strengths?.length > 0 && (
                          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-0.5">
                            <p className="font-black text-emerald-800 uppercase text-[10px] flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3 text-emerald-600" /> Key Strengths
                            </p>
                            <ul className="list-disc list-inside text-slate-700 font-medium text-[11px] space-y-0.5">
                              {Array.isArray(q.strengths) ? (
                                q.strengths.map((s, i) => <li key={i}>{s}</li>)
                              ) : (
                                <li>{q.strengths}</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {q.weaknesses?.length > 0 && (
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-0.5">
                            <p className="font-black text-amber-800 uppercase text-[10px] flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-amber-600" /> Growth Areas
                            </p>
                            <ul className="list-disc list-inside text-slate-700 font-medium text-[11px] space-y-0.5">
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

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReportSession(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedReportSession(null);
                  handleStartInterview();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
              >
                Start Similar Mock Session
              </button>
              <button
                type="button"
                onClick={() => generateInterviewReportPDF(selectedReportSession, user.name || "Candidate")}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download PDF Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
