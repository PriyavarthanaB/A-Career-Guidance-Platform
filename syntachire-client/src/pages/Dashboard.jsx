import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  FileText,
  Code2,
  Mic,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Zap,
  Star,
  ChevronRight,
  Brain
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
    badge: 'Coming Soon',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', targetRole: 'Full Stack Developer' });

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const firstName = user.name.split(' ')[0];

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
      <Sidebar />

      <main className="lg:ml-[280px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-10">

        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/70 text-xs font-bold text-blue-800 ring-1 ring-inset ring-blue-700/10">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            SyntacHire AI Dashboard
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Hero Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#004ac6] via-[#1a56d6] to-[#2563eb] p-8 md:p-10 shadow-xl">
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-white/70">Active Session</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">
                Welcome back, <span className="text-yellow-300">{firstName}!</span> 👋
              </h1>
              <p className="text-base text-white/75 font-normal max-w-lg">
                Your AI career engine is ready. Continue optimising for{' '}
                <span className="font-bold text-white">{user.targetRole}</span> roles.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-2.5 rounded-2xl">
                <Target className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-bold text-white">{user.targetRole}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-xl">
                <Flame className="h-4 w-4 text-orange-300" />
                <span className="text-xs font-semibold text-white/80">7-day streak active</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">Quick Access</h2>
            <span className="text-xs font-bold text-slate-400">4 tools available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.title}
                  onClick={() => navigate(action.route)}
                  className="group relative bg-white border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col gap-5"
                >
                  {/* Icon */}
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Badge */}
                  <span className={`absolute top-5 right-5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${action.badgeColor}`}>
                    {action.badge}
                  </span>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-extrabold text-[#0b1c30] text-base leading-snug">{action.title}</h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">{action.desc}</p>
                  </div>

                  {/* Footer CTA */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#004ac6] group-hover:gap-2.5 transition-all">
                    <span>Open</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>

                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none rounded-3xl`} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Progress & Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Streak Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">Current Streak</h3>
              <Flame className="h-5 w-5 text-amber-500 fill-current animate-pulse" />
            </div>
            <p className="text-4xl font-black text-amber-500">7 <span className="text-sm font-bold text-slate-400">days</span></p>
            <p className="text-xs text-slate-400 font-medium">Personal Best: 14 days 🏆</p>
            <div className="flex gap-1">
              {[1,2,3,4,5,6,7].map((d) => (
                <div key={d} className="flex-1 h-1.5 bg-amber-400 rounded-full" />
              ))}
              {[8,9,10,11,12,13,14].map((d) => (
                <div key={d} className="flex-1 h-1.5 bg-slate-100 rounded-full" />
              ))}
            </div>
          </div>

          {/* XP Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">XP Earned</h3>
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            </div>
            <p className="text-4xl font-black text-yellow-500">1,450 <span className="text-sm font-bold text-slate-400">XP</span></p>
            <p className="text-xs text-slate-400 font-medium">+150 XP earned today</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" style={{width: '65%'}} />
            </div>
          </div>

          {/* Problems Solved */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">Problems Solved</h3>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-4xl font-black text-emerald-500">42 <span className="text-sm font-bold text-slate-400">/ 120</span></p>
            <p className="text-xs text-slate-400 font-medium">35% overall completion</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{width: '35%'}} />
            </div>
          </div>
        </section>

        {/* AI Tip Banner */}
        <section className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-extrabold text-indigo-900">AI Career Tip of the Day</p>
            <p className="text-sm text-indigo-700 font-normal leading-relaxed">
              For <strong>{user.targetRole}</strong> roles, mastering Dynamic Programming and Graph algorithms gives you a significant advantage in top-tier technical interviews. Start with module-based practice today!
            </p>
          </div>
          <button
            onClick={() => navigate('/coding-practice')}
            className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            Start <ChevronRight className="h-4 w-4" />
          </button>
        </section>

      </main>
    </div>
  );
}