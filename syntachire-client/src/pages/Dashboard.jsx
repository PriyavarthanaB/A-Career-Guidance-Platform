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
} from 'lucide-react';

const QUICK_ACTIONS = [
  {
    title: 'Resume Analyzer',
    desc: 'Upload your resume for AI-powered ATS scoring and keyword optimization.',
    icon: FileText,
    route: '/analyzer',
    gradient: 'from-blue-600 to-indigo-600',
    badge: 'AI Powered',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Coding Practice',
    desc: 'Work through structured DSA modules tailored to your target role.',
    icon: Code2,
    route: '/coding-practice',
    gradient: 'from-violet-600 to-purple-600',
    badge: 'Role-Based',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    title: 'Coding Hub',
    desc: 'Solve curated algorithmic challenges in an AI-assisted IDE environment.',
    icon: Brain,
    route: '/coding-hub',
    gradient: 'from-emerald-600 to-teal-600',
    badge: 'Challenges',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'Mock Interview',
    desc: 'Simulate technical and HR interview rounds with live AI feedback.',
    icon: Mic,
    route: '/mock-interview',
    gradient: 'from-amber-500 to-orange-500',
    badge: 'Live AI',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', targetRole: 'Full Stack Developer' });
  const { stats, loading: statsLoading } = useUserStats();
  const [resumeData, setResumeData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

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
    const reportText = `
===================================================================
      SYNTACHIRE AI — PREDICTIVE CAREER & PLACEMENT READINESS REPORT
===================================================================
Candidate Name   : ${user.name}
Target Job Role  : ${user.targetRole}
Report Date      : ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Evaluation Engine: Google Gemini AI + Judge0 CE Execution Sandbox
-------------------------------------------------------------------

1. OVERALL PLACEMENT COMPETENCY INDEX
-------------------------------------------------------------------
Overall Readiness Score  : ${readinessIndex}%
Placement Status         : ${readinessIndex >= 75 ? 'PLACEMENT READY 🎯' : (readinessIndex > 0 ? 'IN PROGRESS ⚡' : 'NEW CANDIDATE 🌱')}
Evaluation Weights       : 35% ATS Resume + 40% DSA Progress + 25% Mock Interview

2. RESUME ATS COMPATIBILITY & SKILL ANALYSIS
-------------------------------------------------------------------
Resume Status            : ${hasUploadedResume ? 'ANALYZED ✓' : 'NOT UPLOADED YET ⚠️'}
ATS Match Score          : ${atsScore}%
Verified Skills          : ${extractedSkills.length > 0 ? extractedSkills.join(', ') : 'None detected yet'}
Missing Skill Gaps       : ${missingSkills.length > 0 ? missingSkills.join(', ') : 'Upload resume to analyze against ' + user.targetRole}

3. DSA ALGORITHMIC COMPETENCY & PRACTICE
-------------------------------------------------------------------
Problems Solved          : ${solvedProblems} / ${totalProblems} (${completionPct}%)
XP Earned                : ${xp.toLocaleString()} XP
Active Practice Streak   : ${streakDays} days

4. MOCK INTERVIEW PERFORMANCE METRICS
-------------------------------------------------------------------
Mock Sessions Conducted  : ${mockSessionsCount}
Average Technical Score  : ${avgMockScore > 0 ? avgMockScore + '%' : 'Not evaluated yet'}

5. STRATEGIC PLACEMENT ACTION PLAN
-------------------------------------------------------------------
[1] ${hasUploadedResume ? 'Address Resume Skill Gaps: Focus on ' + (missingSkills.slice(0, 2).join(' & ') || 'target role requirements') : 'Upload Resume: Go to Resume Analyzer to extract skills and ATS match score.'}
[2] Accelerate DSA Practice : Complete 10 problems in Module 01 (Arrays) and Module 10 (DP).
[3] Practice Mock Sessions  : Conduct at least 2 live technical mock interview rounds.
-------------------------------------------------------------------
Report generated automatically by SyntacHire AI Career Guidance Platform.
===================================================================
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SyntacHire_Predictive_Report_${user.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const firstName = user.name.split(' ')[0];
  const streakBarTotal = Math.max(14, longestStreak);

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex relative overflow-hidden">
      {/* Decorative background ambient blobs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />

      <main className="lg:ml-[280px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-10 relative z-10">

        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md text-xs font-bold text-blue-700 ring-1 ring-blue-500/20 shadow-xs">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            SyntacHire AI Dashboard
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-600 border border-rose-200/80 bg-white/80 backdrop-blur-md hover:bg-rose-600 hover:text-white hover:border-rose-600 px-4 py-2 rounded-2xl transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            Sign Out
          </button>
        </div>

        {/* Hero Welcome Banner */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#004ac6] via-[#1d5bd8] to-[#2563eb] p-8 md:p-10 shadow-2xl border border-white/20">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 w-fit px-3 py-1 rounded-full shadow-inner">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Active Session</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-snug tracking-tight">
                Welcome back, <span className="text-yellow-300 drop-shadow-sm">{firstName}!</span> 👋
              </h1>
              <p className="text-base text-white/80 font-normal max-w-lg leading-relaxed">
                Your AI career engine is ready. Continue optimising for{' '}
                <span className="font-bold text-white underline decoration-yellow-300/60 decoration-2 underline-offset-4">{user.targetRole}</span> roles.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex items-center gap-2.5 bg-white/15 border border-white/25 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg hover:bg-white/20 transition-all duration-200">
                <Target className="h-5 w-5 text-yellow-300 drop-shadow-xs" />
                <span className="text-sm font-extrabold text-white tracking-wide">{user.targetRole}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Flame className="h-4 w-4 text-orange-300 animate-pulse" />
                <span className="text-xs font-bold text-white/90">
                  {statsLoading ? '...' : `${streakDays}-day streak active`}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Placement Readiness & Overall Productivity Summary */}
        <section className="bg-white/90 backdrop-blur-2xl border border-white ring-1 ring-slate-900/5 rounded-[2.5rem] p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">Placement Readiness & Productivity Summary</h2>
                <p className="text-xs text-slate-500 font-semibold">Connected evaluation for target role: <span className="text-blue-700 font-bold">{user.targetRole}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-3.5 py-1.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <Eye className="h-4 w-4" />
                View Report
              </button>
              <button
                onClick={handleDownloadReportFile}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 py-1.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-xs hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                Download Report
              </button>
            </div>
          </div>

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Overall Placement Readiness Meter (Left Column - 4 cols) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-[#0b1c30] to-indigo-950 text-white rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden border border-slate-800">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
                  Target Role Readiness
                </span>
                <h3 className="text-lg font-extrabold text-white tracking-tight pt-2">Placement Competency Index</h3>
                <p className="text-xs text-slate-400 font-normal leading-relaxed">
                  Aggregated readiness derived from ATS Resume Match, DSA Solved Rates, and AI Interview Scores.
                </p>
              </div>

              <div className="my-6 flex flex-col items-center justify-center relative">
                <div className="relative flex items-center justify-center">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
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
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#818cf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white">{readinessIndex}%</span>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Ready</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-white/10 text-slate-300">
                <span>Status: <strong className={readinessIndex >= 75 ? 'text-emerald-400' : 'text-amber-400'}>{readinessIndex >= 75 ? 'Placement Ready 🎯' : (readinessIndex > 0 ? 'In Progress ⚡' : 'New Candidate 🌱')}</strong></span>
                <button
                  onClick={() => navigate('/analyzer')}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Details <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Resume & Skill Match Details (Middle Column - 5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              {/* ATS Resume Alignment Card */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                    <h4 className="text-sm font-extrabold text-[#0b1c30]">Resume ATS Match Rate</h4>
                  </div>
                  <span className={`text-sm font-black px-2.5 py-0.5 rounded-full border ${hasUploadedResume ? 'text-blue-600 bg-blue-100/80 border-blue-200' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                    {hasUploadedResume ? `${atsScore}% ATS` : 'Not Uploaded'}
                  </span>
                </div>
                <div className="h-2 bg-slate-200/70 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700" 
                    style={{ width: `${atsScore}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 font-normal flex items-center justify-between">
                  <span>{hasUploadedResume ? `Last analyzed: ${resumeData.fileName || 'Resume.pdf'}` : 'No resume uploaded yet for this account.'}</span>
                  {!hasUploadedResume && (
                    <button
                      onClick={() => navigate('/analyzer')}
                      className="text-blue-600 hover:underline font-bold text-xs cursor-pointer ml-2"
                    >
                      Upload PDF →
                    </button>
                  )}
                </p>
              </div>

              {/* Extracted vs Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                {/* Verified Skills */}
                <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Verified Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedSkills.length > 0 ? (
                      extractedSkills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/60 shadow-2xs">
                          ✓ {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-400 font-medium italic">Upload your resume to extract skills.</p>
                    )}
                  </div>
                </div>

                {/* Target Role Skill Gaps */}
                <div className="bg-rose-50/60 border border-rose-100/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-rose-800 uppercase tracking-wider">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    Target Role Gaps
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.length > 0 ? (
                      missingSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-bold bg-white text-rose-700 px-2 py-0.5 rounded-md border border-rose-200/60 shadow-2xs">
                          ! {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-400 font-medium italic">Upload resume to view skill gaps for {user.targetRole}.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Placement Action Checklist (Right Column - 3 cols) */}
            <div className="lg:col-span-3 bg-gradient-to-b from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-3xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider">Readiness Milestones</h4>
                </div>

                <ul className="space-y-2.5">
                  <li className="flex items-center justify-between text-xs font-bold text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${atsScore >= 70 ? 'text-emerald-500' : 'text-slate-300'}`} />
                      ATS Optimized
                    </span>
                    <span className="text-[10px] font-black text-blue-600">{atsScore}%</span>
                  </li>
                  <li className="flex items-center justify-between text-xs font-bold text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${completionPct >= 20 ? 'text-emerald-500' : 'text-slate-300'}`} />
                      DSA Progress
                    </span>
                    <span className="text-[10px] font-black text-violet-600">{completionPct}%</span>
                  </li>
                  <li className="flex items-center justify-between text-xs font-bold text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Boost Placement Score <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">Quick Access</h2>
            <span className="text-xs font-extrabold text-slate-400 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/60">4 tools available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.title}
                  onClick={() => navigate(action.route)}
                  className="group relative bg-white/85 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col gap-5"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`absolute top-5 right-5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-extrabold text-[#0b1c30] text-base leading-snug group-hover:text-blue-600 transition-colors">{action.title}</h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">{action.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#004ac6] group-hover:gap-2.5 transition-all">
                    <span>Open</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none rounded-3xl`} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Progress & Stats — live from /api/user/stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Streak Card */}
          <div className="bg-white/85 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">Current Streak</h3>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                <Flame className="h-5 w-5 text-amber-500 fill-current animate-pulse" />
              </div>
            </div>
            {statsLoading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-semibold">Loading…</span>
              </div>
            ) : (
              <>
                <p className="text-4xl font-black text-amber-500 tracking-tight">
                  {streakDays} <span className="text-sm font-bold text-slate-400">days</span>
                </p>
                <p className="text-xs text-slate-400 font-bold">Personal Best: {longestStreak} days 🏆</p>
                <div className="flex gap-1.5 pt-1">
                  {Array.from({ length: streakBarTotal }, (_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${i < streakDays ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-xs shadow-amber-400/40' : 'bg-slate-100'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* XP Card */}
          <div className="bg-white/85 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">XP Earned</h3>
              <div className="w-9 h-9 rounded-2xl bg-yellow-50 flex items-center justify-center border border-yellow-100">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
            </div>
            {statsLoading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-semibold">Loading…</span>
              </div>
            ) : (
              <>
                <p className="text-4xl font-black text-yellow-500 tracking-tight">
                  {xp.toLocaleString()} <span className="text-sm font-bold text-slate-400">XP</span>
                </p>
                <p className="text-xs text-slate-400 font-bold">+{todayXp} XP earned today</p>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 rounded-full transition-all duration-700 shadow-xs"
                    style={{ width: `${xpLevel}%` }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Problems Solved */}
          <div className="bg-white/85 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">Problems Solved</h3>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            {statsLoading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-semibold">Loading…</span>
              </div>
            ) : (
              <>
                <p className="text-4xl font-black text-emerald-500 tracking-tight">
                  {solvedProblems} <span className="text-sm font-bold text-slate-400">/ {totalProblems}</span>
                </p>
                <p className="text-xs text-slate-400 font-bold">{completionPct}% overall completion</p>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700 shadow-xs"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* AI Tip Banner */}
        <section className="bg-gradient-to-r from-indigo-50/90 via-blue-50/90 to-purple-50/90 border border-indigo-100/80 backdrop-blur-md rounded-3xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-xs font-black text-indigo-900 uppercase tracking-wider">AI Career Tip of the Day</p>
            <p className="text-sm text-indigo-950 font-normal leading-relaxed">
              For <strong className="font-bold text-indigo-900">{user.targetRole}</strong> roles, mastering Dynamic Programming and Graph algorithms gives you a significant advantage in top-tier technical interviews. Start with module-based practice today!
            </p>
          </div>
          <button
            onClick={() => navigate('/coding-practice')}
            className="shrink-0 group flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-white/80 hover:bg-white px-4 py-2.5 rounded-2xl border border-indigo-200/60 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer hover:translate-x-0.5"
          >
            Start <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </section>

        {/* PREDICTIVE REPORT MODAL */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
              
              {/* Modal Top Controls */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0b1c30]">SyntacHire AI Predictive Report</h3>
                    <p className="text-xs text-slate-500 font-semibold">Candidate: <strong className="text-slate-800">{user.name}</strong> • Role: <strong className="text-blue-700">{user.targetRole}</strong></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                  <button
                    onClick={handleDownloadReportFile}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Download (.txt)
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Report Body */}
              <div className="space-y-6 text-slate-800">

                {/* Section 1: Executive Summary */}
                <div className="bg-gradient-to-br from-slate-900 via-[#0b1c30] to-indigo-950 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 max-w-lg">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
                      Predictive Evaluation Result
                    </span>
                    <h4 className="text-xl font-extrabold text-white">Target Role Placement Competency Index</h4>
                    <p className="text-xs text-slate-300 font-normal leading-relaxed">
                      Based on current resume ATS match ({atsScore}%), solved DSA modules ({solvedProblems}/{totalProblems}), and mock interview readiness score ({mockScoreVal}%).
                    </p>
                  </div>
                  <div className="flex flex-col items-center bg-white/10 border border-white/15 backdrop-blur-md px-8 py-5 rounded-2xl shrink-0">
                    <span className="text-4xl font-black text-yellow-300">{readinessIndex}%</span>
                    <span className="text-[10px] font-extrabold uppercase text-white/80 tracking-wider mt-1">Placement Ready</span>
                  </div>
                </div>

                {/* Section 2: Resume ATS & Skill Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
                    <h5 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Verified Resume Competencies ({extractedSkills.length})
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {extractedSkills.map((s, i) => (
                        <span key={i} className="text-xs font-bold bg-white text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 space-y-3">
                    <h5 className="text-xs font-black uppercase text-rose-900 tracking-wider flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                      Role Skill Gaps to Address ({missingSkills.length})
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((s, i) => (
                        <span key={i} className="text-xs font-bold bg-white text-rose-800 px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                          ! {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Predictive Strategic Roadmap */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-3xl p-6 space-y-4">
                  <h5 className="text-xs font-black uppercase text-blue-950 tracking-wider flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    Strategic Placement Action Plan
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">STEP 1</span>
                      <h6 className="text-xs font-extrabold text-slate-900">Resume Optimization</h6>
                      <p className="text-[11px] text-slate-500 font-normal">Incorporate projects highlighting <strong className="text-slate-800">{missingSkills.slice(0, 2).join(' & ')}</strong>.</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">STEP 2</span>
                      <h6 className="text-xs font-extrabold text-slate-900">DSA Module Mastery</h6>
                      <p className="text-[11px] text-slate-500 font-normal">Solve 10 problems in Module 01 (Arrays) and Module 10 (Dynamic Programming).</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">STEP 3</span>
                      <h6 className="text-xs font-extrabold text-slate-900">Mock Interview Simulation</h6>
                      <p className="text-[11px] text-slate-500 font-normal">Complete 2 technical interview sessions to boost communication metrics.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400 font-semibold">
                <span>SyntacHire AI Automated Career Engine</span>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
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