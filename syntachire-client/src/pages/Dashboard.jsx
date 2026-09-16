import { generatePredictiveReportPDF, generateInterviewReportPDF } from "../utils/pdfGenerator";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useUserStats from '../hooks/useUserStats';
import API from '../api/axios';
import {
  FileText,
  Code2,
  Mic,
  ArrowRight,
  Sparkles,
  Target,
  Flame,
  TrendingUp,
  Zap,
  Star,
  ChevronRight,
  Brain,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Award,
  Activity,
  FileCheck,
  ShieldCheck,
  Layers,
  Eye,
  Download,
  Printer,
  X,
  FileDown,
  Rocket,
  Trophy,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  BarChart2,
} from 'lucide-react';

const QUICK_ACTIONS = [
  {
    title: 'Resume Analyzer',
    desc: 'Upload your resume for AI-powered ATS scoring and keyword optimization.',
    icon: FileText,
    route: '/analyzer',
    gradient: 'from-blue-600 to-indigo-600',
    badge: 'AI Powered',
    badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  },
  {
    title: 'Coding Practice',
    desc: 'Work through structured DSA modules tailored to your target role.',
    icon: Code2,
    route: '/coding-practice',
    gradient: 'from-violet-600 to-purple-600',
    badge: 'Role-Based',
    badgeColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  },
  {
    title: 'Coding Hub',
    desc: 'Solve curated algorithmic challenges in an AI-assisted IDE environment.',
    icon: Brain,
    route: '/coding-hub',
    gradient: 'from-emerald-600 to-teal-600',
    badge: 'Challenges',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  },
  {
    title: 'Mock Interview',
    desc: 'Simulate technical and HR interview rounds with live AI feedback.',
    icon: Mic,
    route: '/mock-interview',
    gradient: 'from-amber-500 to-orange-500',
    badge: 'Live AI',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', targetRole: 'Full Stack Developer' });
  const { stats, loading: statsLoading } = useUserStats();
  const [resumeData, setResumeData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [interviewLoading, setInterviewLoading] = useState(true);
  const [expandedInterviewId, setExpandedInterviewId] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDetailLoading, setInterviewDetailLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser({
          name: parsed.name || 'User',
          targetRole: parsed.targetRole || 'Full Stack Developer',
        });
      }
    } catch (_) {}

    // Fetch latest resume analysis from backend API
    const fetchLatestResume = async () => {
      setResumeLoading(true);
      try {
        const res = await API.get('/api/resume/latest');
        if (res.data?.success && res.data?.data) {
          setResumeData(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load latest resume analysis', err);
      } finally {
        setResumeLoading(false);
      }
    };

    fetchLatestResume();

    const fetchInterviewHistory = async () => {
      setInterviewLoading(true);
      try {
        const res = await API.get('/api/interview/history');
        if (res.data?.success) {
          const completed = (res.data.data || [])
            .filter((i) => i.status === 'completed')
            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
          setInterviewHistory(completed);
        }
      } catch (err) {
        console.warn('Could not load interview history', err);
      } finally {
        setInterviewLoading(false);
      }
    };

    fetchInterviewHistory();
  }, []);

  // Live API stats or sensible defaults
  const streakDays         = stats?.streakDays         ?? 0;
  const longestStreak      = stats?.longestStreak       ?? 0;
  const xp                 = stats?.xp                 ?? 0;
  const todayXp            = stats?.todayXp             ?? 0;
  const solvedProblems     = stats?.solvedProblems      ?? 0;
  const totalProblems      = stats?.totalProblems       ?? 120;
  const completionPct      = stats?.completionPercentage ?? 0;
  const mockSessionsCount  = stats?.mockSessionsCount  ?? 0;
  const avgMockScore       = stats?.avgMockScore       ?? 0;
  const xpLevel            = totalProblems > 0 ? Math.min(100, Math.round((xp / (totalProblems * 50 + 10 * 100)) * 100)) : 0;

  // Connected Resume Analytics — STRICTLY per-user, NO fake fallback defaults
  const hasUploadedResume = Boolean(resumeData && (resumeData.atsScore !== undefined || resumeData.fileName));
  const atsScore = hasUploadedResume ? (resumeData?.atsScore ?? 0) : 0;
  const extractedSkills = hasUploadedResume ? (resumeData?.extractedSkills || []) : [];
  const missingSkills = hasUploadedResume ? (resumeData?.missingSkills || []) : [];

  // Overall Placement Readiness Index calculation — strictly based on user's actual progress
  const mockScoreVal = avgMockScore > 0 ? avgMockScore : (mockSessionsCount > 0 ? 80 : 0);
  const readinessIndex = hasUploadedResume || completionPct > 0 || mockSessionsCount > 0
    ? Math.min(100, Math.round((atsScore * 0.35) + (completionPct * 0.40) + (mockScoreVal * 0.25)))
    : 0;

  const handleDownloadReportFile = () => {
    generatePredictiveReportPDF({
      userName: user.name || "Candidate",
      targetRole: user.targetRole || "Software Developer",
      readinessIndex,
      atsScore,
      extractedSkills,
      missingSkills,
      solvedProblems,
      totalProblems,
      completionPct,
      xp,
      streakDays,
      mockSessionsCount,
      avgMockScore,
      hasUploadedResume,
    });
  };

  const formatInterviewDate = (val) => {
    if (!val) return '—';
    return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDurationMs = (ms) => {
    if (!ms || ms <= 0) return '00:00';
    const totalSec = Math.floor(ms / 1000);
    return `${String(Math.floor(totalSec / 60)).padStart(2, '0')}:${String(totalSec % 60).padStart(2, '0')}`;
  };

  const handleOpenInterview = async (interviewId) => {
    setInterviewDetailLoading(true);
    setShowInterviewModal(true);
    try {
      const res = await API.get(`/api/interview/${interviewId}`);
      if (res.data?.success) {
        setSelectedInterview(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load interview detail', err);
    } finally {
      setInterviewDetailLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const firstName = user.name.split(' ')[0];
  const streakBarTotal = Math.max(14, longestStreak);

  return (
    <div className="min-h-screen bg-[#f4f7ff] text-slate-900 font-sans flex relative overflow-hidden">
      {/* Dynamic ambient background radial glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Sidebar />

      <main className="lg:ml-[260px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-10 relative z-10">

        {/* Top Navigation & Status Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-blue-100 text-xs font-bold text-blue-600 shadow-sm group hover:scale-[1.02] transition-all">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="tracking-tight">SyntacHire AI Career Success Engine</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 px-4 py-2 rounded-2xl transition-all duration-200 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
          >
            Sign Out
          </button>
        </div>

        {/* Hero Welcome Banner */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#003da5] via-[#004ac6] to-[#1d5bd8] p-8 md:p-11 shadow-2xl border border-white/20 group">
          {/* Ambient light elements inside card */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 w-fit px-3.5 py-1 rounded-full shadow-inner">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Career Acceleration</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-snug tracking-tight">
                Welcome back, <span className="text-yellow-300 drop-shadow-sm">{firstName}!</span> 🚀
              </h1>
              
              <p className="text-sm md:text-base text-white/85 font-medium max-w-xl leading-relaxed">
                Your AI-powered career engine is active. Continuous optimization towards high-impact{' '}
                <span className="font-extrabold text-white underline decoration-yellow-300/70 decoration-2 underline-offset-4">{user.targetRole}</span> roles.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="flex items-center gap-2.5 bg-white/15 border border-white/25 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg hover:bg-white/20 transition-all duration-200">
                <Target className="h-5 w-5 text-yellow-300 drop-shadow-xs" />
                <span className="text-sm font-black text-white tracking-wide">{user.targetRole}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Flame className="h-4 w-4 text-orange-300 animate-pulse fill-current" />
                <span className="text-xs font-extrabold text-white/90">
                  {statsLoading ? '...' : `${streakDays}-day active streak`}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Placement Readiness & Overall Productivity Summary */}
        <section className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 md:p-8 shadow-sm shadow-slate-900/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                <Trophy className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Placement Readiness &amp; Success Summary</h2>
                <p className="text-xs text-slate-500 font-semibold">Real-time score calibration for target role: <span className="text-blue-600 font-extrabold">{user.targetRole}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Eye className="h-4 w-4" />
                View Report
              </button>
              <button
                onClick={handleDownloadReportFile}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <Download className="h-4 w-4" />
                Download Report
              </button>
            </div>
          </div>

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Overall Placement Readiness Meter (Left Column - 4 cols) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-blue-600/20 relative overflow-hidden border border-blue-500/30 group">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-300 bg-yellow-300/15 px-2.5 py-1 rounded-full border border-yellow-300/30">
                  Target Readiness Score
                </span>
                <h3 className="text-lg font-black text-white tracking-tight pt-1">Placement Competency Index</h3>
                <p className="text-xs text-blue-100/80 font-normal leading-relaxed">
                  Aggregated score calculated from ATS Resume Match, DSA Modules, and AI Interviews.
                </p>
              </div>

              <div className="my-6 flex flex-col items-center justify-center relative">
                <div className="relative flex items-center justify-center">
                  <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="url(#readinessGradient)"
                      strokeWidth="9"
                      strokeDasharray={263.8}
                      strokeDashoffset={263.8 - (263.8 * readinessIndex) / 100}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#a5f3fc" />
                        <stop offset="100%" stopColor="#facc15" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white tracking-tight">{readinessIndex}%</span>
                    <span className="text-[10px] font-black uppercase text-blue-200 tracking-wider">Ready</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-white/20 text-blue-100">
                <span>Status: <strong className={readinessIndex >= 75 ? 'text-yellow-300' : 'text-orange-300'}>{readinessIndex >= 75 ? 'Placement Ready 🎯' : (readinessIndex > 0 ? 'In Progress ⚡' : 'New Candidate 🌱')}</strong></span>
                <button
                  onClick={() => navigate('/analyzer')}
                  className="text-white/80 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-black"
                >
                  Details <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Resume & Skill Match Details (Middle Column - 5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              {/* ATS Resume Alignment Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-sm shadow-slate-900/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                    <h4 className="text-sm font-black text-slate-900">Resume ATS Match Rate</h4>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${hasUploadedResume ? 'text-blue-700 bg-blue-100 border-blue-200' : 'text-slate-500 bg-slate-200 border-slate-300'}`}>
                    {hasUploadedResume ? `${atsScore}% ATS` : 'Not Uploaded'}
                  </span>
                </div>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700 shadow-xs" 
                    style={{ width: `${atsScore}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 font-normal flex items-center justify-between">
                  <span>{hasUploadedResume ? `Last analyzed: ${resumeData.fileName || 'Resume.pdf'}` : 'No resume uploaded yet for this account.'}</span>
                  {!hasUploadedResume && (
                    <button
                      onClick={() => navigate('/analyzer')}
                      className="text-blue-600 hover:underline font-extrabold text-xs cursor-pointer ml-2"
                    >
                      Upload PDF →
                    </button>
                  )}
                </p>
              </div>

              {/* Extracted vs Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                {/* Verified Skills */}
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Verified Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedSkills.length > 0 ? (
                      extractedSkills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                          ✓ {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-500 font-medium italic">Upload your resume to extract skills.</p>
                    )}
                  </div>
                </div>

                {/* Target Role Skill Gaps */}
                <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 uppercase tracking-wider">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    Target Role Gaps
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.length > 0 ? (
                      missingSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200">
                          ! {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-500 font-medium italic">Upload resume to view skill gaps for {user.targetRole}.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Placement Action Checklist (Right Column - 3 cols) */}
            <div className="lg:col-span-3 bg-blue-50 border border-blue-200/80 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-sm shadow-slate-900/5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Readiness Milestones</h4>
                </div>

                <ul className="space-y-2.5">
                  <li className="flex items-center justify-between text-xs font-extrabold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${atsScore >= 70 ? 'text-emerald-500' : 'text-slate-300'}`} />
                      ATS Optimized
                    </span>
                    <span className="text-[10px] font-black text-blue-600">{atsScore}%</span>
                  </li>
                  <li className="flex items-center justify-between text-xs font-extrabold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${completionPct >= 20 ? 'text-emerald-500' : 'text-slate-300'}`} />
                      DSA Progress
                    </span>
                    <span className="text-[10px] font-black text-violet-600">{completionPct}%</span>
                  </li>
                  <li className="flex items-center justify-between text-xs font-extrabold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${mockSessionsCount > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                      Mock Interview
                    </span>
                    <span className="text-[10px] font-black text-amber-600">{mockSessionsCount} run</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/coding-practice')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Boost Placement Score <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </section>


        {/* Quick Access Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Quick Access Tools</h2>
            <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">4 tools active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.title}
                  onClick={() => navigate(action.route)}
                  className="group relative bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm shadow-slate-900/5 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col gap-5"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <span className={`absolute top-5 right-5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">{action.title}</h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">{action.desc}</p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs font-black text-blue-600 group-hover:gap-2.5 transition-all">
                    <span>Open</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none rounded-3xl`} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Progress & Stats — live from /api/user/stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Streak Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm shadow-slate-900/5 hover:shadow-md transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Current Streak</h3>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center border border-amber-200">
                <Flame className="h-5 w-5 text-amber-600 fill-current animate-pulse" />
              </div>
            </div>
            {statsLoading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                <span className="text-sm font-semibold">Loading…</span>
              </div>
            ) : (
              <>
                <p className="text-4xl font-black text-amber-600 tracking-tight">
                  {streakDays} <span className="text-sm font-bold text-slate-500">days</span>
                </p>
                <p className="text-xs text-slate-500 font-extrabold">Personal Best: {longestStreak} days 🏆</p>
                <div className="flex gap-1.5 pt-1">
                  {Array.from({ length: streakBarTotal }, (_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${i < streakDays ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* XP Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm shadow-slate-900/5 hover:shadow-md transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">XP Earned</h3>
              <div className="w-10 h-10 rounded-2xl bg-yellow-100 flex items-center justify-center border border-yellow-200">
                <Star className="h-5 w-5 text-yellow-600 fill-current" />
              </div>
            </div>
            {statsLoading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
                <span className="text-sm font-semibold">Loading…</span>
              </div>
            ) : (
              <>
                <p className="text-4xl font-black text-yellow-600 tracking-tight">
                  {xp.toLocaleString()} <span className="text-sm font-bold text-slate-500">XP</span>
                </p>
                <p className="text-xs text-slate-500 font-extrabold">+{todayXp} XP earned today</p>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${xpLevel}%` }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Problems Solved */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm shadow-slate-900/5 hover:shadow-md transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Problems Solved</h3>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            {statsLoading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                <span className="text-sm font-semibold">Loading…</span>
              </div>
            ) : (
              <>
                <p className="text-4xl font-black text-emerald-600 tracking-tight">
                  {solvedProblems} <span className="text-sm font-bold text-slate-500">/ {totalProblems}</span>
                </p>
                <p className="text-xs text-slate-500 font-extrabold">{completionPct}% overall completion</p>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Interview History Section */}
        <section className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 md:p-8 shadow-sm shadow-slate-900/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
                <Mic className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Interview History</h2>
                <p className="text-xs text-slate-500 font-semibold">
                  {interviewHistory.length > 0 ? `${interviewHistory.length} completed session${interviewHistory.length > 1 ? 's' : ''}` : 'No sessions yet'} &bull; Click to expand or view full report
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/interview-history')}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <BarChart2 className="h-4 w-4" />
              View Full History
            </button>
          </div>

          {/* Interview Cards */}
          {interviewLoading ? (
            <div className="flex items-center gap-2 text-slate-500 py-8 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              <span className="text-sm font-semibold">Loading interview history…</span>
            </div>
          ) : interviewHistory.length === 0 ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Mic className="h-8 w-8 text-amber-400" />
              </div>
              <p className="text-sm text-slate-300 font-medium">No completed interviews yet.</p>
              <button
                onClick={() => navigate('/mock-interview')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Start Your First Interview <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {interviewHistory.slice(0, 5).map((session) => {
                const isExpanded = expandedInterviewId === session._id;
                const scoreColor = session.overallScore >= 80 ? 'text-emerald-400' : session.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400';
                return (
                  <div
                    key={session._id}
                    className="rounded-3xl border border-white/[0.08] bg-white/[0.04] overflow-hidden transition-all duration-200"
                  >
                    {/* Row Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedInterviewId(isExpanded ? null : session._id)}
                      className="w-full text-left p-5 hover:bg-white/[0.03] transition flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                            {session.type?.toUpperCase() || 'MIXED'}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white/[0.06] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                            {session.difficulty}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">{session.targetRole}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {formatInterviewDate(session.completedAt)}
                          </span>
                          <span>{session.questionCount} questions</span>
                          <span>{formatDurationMs(session.totalDurationMs)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className={`text-2xl font-black ${scoreColor}`}>{session.overallScore}%</p>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Score</span>
                        </div>
                        {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
                      </div>
                    </button>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="border-t border-white/[0.06] p-5 space-y-5 bg-slate-900/40">
                        {/* Category Score Bars */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { label: 'Technical', score: session.overallTechnicalScore, color: 'blue' },
                            { label: 'Problem Solving', score: session.overallProblemSolvingScore, color: 'purple' },
                            { label: 'Communication', score: session.overallCommunicationScore, color: 'emerald' },
                            { label: 'Relevance', score: session.overallRelevanceScore, color: 'amber' },
                            { label: 'Confidence', score: session.overallConfidenceScore, color: 'rose' },
                            { label: 'Time Mgmt', score: session.overallTimeManagementScore, color: 'blue' },
                          ].map((cat) => (
                            <div key={cat.label} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3 space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                                <span className="text-slate-500">{cat.label}</span>
                                <span className={`text-${cat.color}-400`}>{cat.score ?? 0}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                                <div className={`h-full bg-${cat.color}-500 rounded-full transition-all duration-500`} style={{ width: `${Math.min(cat.score ?? 0, 100)}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Strongest & Weakest Topics */}
                        {(session.strongestTopics?.length > 0 || session.weakestTopics?.length > 0) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {session.strongestTopics?.length > 0 && (
                              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Strongest
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {session.strongestTopics.slice(0, 3).map((t, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-bold">{t}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {session.weakestTopics?.length > 0 && (
                              <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                  <AlertTriangle className="h-3.5 w-3.5" /> Needs Work
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {session.weakestTopics.slice(0, 3).map((t, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] font-bold">{t}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* View Full Report Button */}
                        <button
                          onClick={() => handleOpenInterview(session._id)}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        >
                          View Full Interview Report <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {interviewHistory.length > 5 && (
                <button
                  onClick={() => navigate('/interview-history')}
                  className="w-full text-center text-xs font-black text-blue-400 hover:text-blue-300 py-3 transition-colors cursor-pointer"
                >
                  View all {interviewHistory.length} sessions →
                </button>
              )}
            </div>
          )}
        </section>

        {/* Interview Detail Modal */}
        {showInterviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-slate-900/95 border border-white/[0.10] rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">AI Interview Report</h3>
                    {selectedInterview && (
                      <p className="text-xs text-slate-500 font-semibold">
                        {selectedInterview.type?.toUpperCase()} &bull; {selectedInterview.targetRole} &bull; {formatInterviewDate(selectedInterview.completedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { setShowInterviewModal(false); setSelectedInterview(null); }}
                  className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {interviewDetailLoading ? (
                <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                  <span className="text-sm font-semibold">Loading interview details…</span>
                </div>
              ) : selectedInterview ? (
                <div className="space-y-6 text-slate-300">

                  {/* Score Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl text-white text-center shadow-lg">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-100">Overall Score</span>
                      <p className="text-3xl font-black mt-1">{selectedInterview.overallScore}%</p>
                    </div>
                    {[
                      { label: 'Technical', score: selectedInterview.overallTechnicalScore },
                      { label: 'Communication', score: selectedInterview.overallCommunicationScore },
                      { label: 'Problem Solving', score: selectedInterview.overallProblemSolvingScore },
                    ].map((d) => (
                      <div key={d.label} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{d.label}</span>
                        <p className="text-2xl font-black text-blue-400 mt-1">{d.score ?? 0}%</p>
                      </div>
                    ))}
                  </div>

                  {/* Personalized Feedback */}
                  {selectedInterview.personalizedFeedback && (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl space-y-2">
                      <p className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> Personalized AI Feedback
                      </p>
                      <p className="text-sm text-slate-200 leading-relaxed">{selectedInterview.personalizedFeedback}</p>
                    </div>
                  )}

                  {/* Strongest & Weakest Topics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedInterview.strongestTopics?.length > 0 && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl space-y-2">
                        <p className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> Strongest Topics
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedInterview.strongestTopics.map((t, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-xs font-bold">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedInterview.weakestTopics?.length > 0 && (
                      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-2">
                        <p className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> Weakest Topics
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedInterview.weakestTopics.map((t, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 text-xs font-bold">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recommended Topics */}
                  {selectedInterview.recommendedTopics?.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                      <p className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                        <Target className="h-4 w-4" /> Recommended Topics for Improvement
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedInterview.recommendedTopics.map((rec, i) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/25 text-xs font-extrabold">{rec}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Question-by-Question Breakdown */}
                  {selectedInterview.questions?.length > 0 && (
                    <div className="space-y-4 border-t border-white/[0.06] pt-5">
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-400" /> Question-by-Question Breakdown
                      </h4>
                      {selectedInterview.questions.map((q, idx) => (
                        <div key={idx} className="bg-slate-800/40 border border-white/[0.08] rounded-2xl p-5 space-y-3">
                          <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] pb-2">
                            <div>
                              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Q{idx + 1} &bull; {q.category || 'General'}</span>
                              <p className="text-sm font-bold text-white mt-0.5">"{q.question}"</p>
                            </div>
                            <span className={`text-xs font-black px-2.5 py-1 rounded-full shrink-0 ${q.score >= 75 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : q.score >= 50 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'}`}>
                              {q.score}%
                            </span>
                          </div>

                          {q.userAnswer && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-slate-500">Candidate Answer:</p>
                              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-white/[0.06] italic">"{q.userAnswer}"</p>
                            </div>
                          )}

                          {q.strengths?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {q.strengths.map((s, si) => (
                                <span key={si} className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">✓ {s}</span>
                              ))}
                            </div>
                          )}
                          {q.weaknesses?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {q.weaknesses.map((w, wi) => (
                                <span key={wi} className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">! {w}</span>
                              ))}
                            </div>
                          )}
                          {q.aiFeedback && (
                            <p className="text-xs text-slate-500 bg-blue-500/5 border border-blue-500/15 p-3 rounded-xl leading-relaxed">
                              <strong className="text-blue-400">Feedback:</strong> {q.aiFeedback}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500 py-8 text-center">Could not load interview data.</p>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500 font-semibold">
                <button
                  onClick={() => generateInterviewReportPDF(selectedInterview, user.name)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  Download PDF Report
                </button>
                <button
                  onClick={() => { setShowInterviewModal(false); setSelectedInterview(null); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Tip Banner */}
        <section className="bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-md rounded-3xl p-6 flex items-start gap-4 shadow-lg shadow-black/20 hover:shadow-md transition-all duration-300">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-xs font-black text-indigo-300 uppercase tracking-wider">AI Career Tip of the Day</p>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              For <strong className="font-black text-indigo-300">{user.targetRole}</strong> roles, mastering Dynamic Programming and Graph algorithms gives you a significant advantage in top-tier technical interviews. Start with module-based practice today!
            </p>
          </div>
          <button
            onClick={() => navigate('/coding-practice')}
            className="shrink-0 group flex items-center gap-1.5 text-xs font-black text-indigo-300 hover:text-indigo-200 bg-white/[0.08] hover:bg-white/[0.12] px-4 py-2.5 rounded-2xl border border-indigo-500/25 shadow-lg shadow-black/20 hover:shadow-xs transition-all duration-200 cursor-pointer hover:scale-105"
          >
            Start <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </section>

        {/* PREDICTIVE REPORT MODAL */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-slate-900/95 border border-white/[0.10] rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
              
              {/* Modal Top Controls */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">SyntacHire AI Predictive Report</h3>
                    <p className="text-xs text-slate-500 font-semibold">Candidate: <strong className="text-slate-200">{user.name}</strong> • Role: <strong className="text-blue-400">{user.targetRole}</strong></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.12] text-slate-300 px-3.5 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                  <button
                    onClick={handleDownloadReportFile}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF Report
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Report Body */}
              <div className="space-y-6 text-slate-300">

                {/* Section 1: Executive Summary */}
                <div className="bg-gradient-to-br from-slate-950 via-[#0b1c30] to-indigo-950 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 max-w-lg">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
                      Predictive Evaluation Result
                    </span>
                    <h4 className="text-xl font-black text-white">Target Role Placement Competency Index</h4>
                    <p className="text-xs text-slate-300 font-normal leading-relaxed">
                      Based on current resume ATS match ({atsScore}%), solved DSA modules ({solvedProblems}/{totalProblems}), and mock interview readiness score ({mockScoreVal}%).
                    </p>
                  </div>
                  <div className="flex flex-col items-center bg-white/10 border border-white/15 backdrop-blur-md px-8 py-5 rounded-2xl shrink-0">
                    <span className="text-4xl font-black text-yellow-300">{readinessIndex}%</span>
                    <span className="text-[10px] font-black uppercase text-white/80 tracking-wider mt-1">Placement Ready</span>
                  </div>
                </div>

                {/* Section 2: Resume ATS & Skill Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
                    <h5 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      Verified Resume Competencies ({extractedSkills.length})
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {extractedSkills.map((s, i) => (
                        <span key={i} className="text-xs font-extrabold bg-emerald-500/15 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-lg shadow-black/20">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 space-y-3">
                    <h5 className="text-xs font-black uppercase text-rose-400 tracking-wider flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-400" />
                      Role Skill Gaps to Address ({missingSkills.length})
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((s, i) => (
                        <span key={i} className="text-xs font-extrabold bg-rose-500/15 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/20 shadow-lg shadow-black/20">
                          ! {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Predictive Strategic Roadmap */}
                <div className="bg-blue-500/8 border border-blue-500/15 rounded-3xl p-6 space-y-4">
                  <h5 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    Strategic Placement Action Plan
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/[0.05] p-4 rounded-2xl border border-white/[0.06] space-y-1.5 shadow-lg shadow-black/20">
                      <span className="text-[10px] font-black text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-md">STEP 1</span>
                      <h6 className="text-xs font-black text-white">Resume Optimization</h6>
                      <p className="text-[11px] text-slate-500 font-normal">Incorporate projects highlighting <strong className="text-slate-200">{missingSkills.slice(0, 2).join(' & ')}</strong>.</p>
                    </div>
                    <div className="bg-white/[0.05] p-4 rounded-2xl border border-white/[0.06] space-y-1.5 shadow-lg shadow-black/20">
                      <span className="text-[10px] font-black text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-md">STEP 2</span>
                      <h6 className="text-xs font-black text-white">DSA Module Mastery</h6>
                      <p className="text-[11px] text-slate-500 font-normal">Solve 10 problems in Module 01 (Arrays) and Module 10 (Dynamic Programming).</p>
                    </div>
                    <div className="bg-white/[0.05] p-4 rounded-2xl border border-white/[0.06] space-y-1.5 shadow-lg shadow-black/20">
                      <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md">STEP 3</span>
                      <h6 className="text-xs font-black text-white">Mock Interview Simulation</h6>
                      <p className="text-[11px] text-slate-500 font-normal">Complete 2 technical interview sessions to boost communication metrics.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs text-slate-500 font-semibold">
                <span>SyntacHire AI Automated Career Engine</span>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="bg-white/[0.08] hover:bg-white/[0.12] text-white font-black px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Close Report
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}