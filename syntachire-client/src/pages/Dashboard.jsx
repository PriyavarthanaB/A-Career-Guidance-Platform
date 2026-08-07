import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useUserStats from '../hooks/useUserStats';
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
  }, []);

  // Use live API stats or sensible zero defaults while loading
  const streakDays         = stats?.streakDays         ?? 0;
  const longestStreak      = stats?.longestStreak       ?? 0;
  const xp                 = stats?.xp                 ?? 0;
  const todayXp            = stats?.todayXp             ?? 0;
  const solvedProblems     = stats?.solvedProblems      ?? 0;
  const totalProblems      = stats?.totalProblems       ?? 120;
  const completionPct      = stats?.completionPercentage ?? 0;
  const xpLevel            = totalProblems > 0 ? Math.min(100, Math.round((xp / (totalProblems * 50 + 10 * 100)) * 100)) : 0;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const firstName = user.name.split(' ')[0];

  // Streak bar: show up to 14 days, filled = streakDays
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

      </main>
    </div>
  );
}