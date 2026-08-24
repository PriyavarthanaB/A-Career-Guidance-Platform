import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Code2,
  Mic,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Sparkles,
  Zap,
  Rocket,
  Trophy,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard",      path: "/dashboard",       icon: LayoutDashboard },
  { name: "Resume Analyzer",path: "/analyzer",        icon: FileText        },
  { name: "Modules",        path: "/coding-practice", icon: BookOpen        },
  { name: "Coding Hub",     path: "/coding-hub",      icon: Code2           },
  { name: "Mock Interview", path: "/mock-interview",  icon: Mic             },
  { name: "Settings",       path: "/settings",        icon: Settings        },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const closeDrawer = () => setDrawerOpen(false);

  const SidebarContent = ({ onNavClick }) => (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="relative flex items-center gap-3 px-3 py-4 mb-6">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/10 blur-sm" />
        <div className="relative flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-black text-white text-base tracking-tight truncate">SyntacHire AI</h1>
            <p className="text-[10px] font-bold text-blue-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Career Velocity Engine
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <div className="px-2 mb-2">
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 px-3 mb-2">Navigation</p>
        <nav className="space-y-0.5">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={onNavClick}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-sm -z-10" />
                )}
                <Icon
                  className={`w-4.5 h-4.5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
                  }`}
                  size={18}
                />
                <span className="flex-1 tracking-tight">{name}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-sm shadow-yellow-300/60" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Success Banner ── */}
      <div className="mx-2 mb-4 relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-indigo-900/80 via-blue-900/60 to-purple-900/50 border border-blue-500/20 shadow-xl">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-500/15 blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-indigo-500/15 blur-xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-400/15 border border-yellow-400/25 mb-2">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-[9px] font-black uppercase tracking-wider text-yellow-300">Achieve Greatness</span>
          </div>
          <h3 className="text-sm font-extrabold text-white mb-1 leading-snug">Top 1% Career Readiness</h3>
          <p className="text-[11px] text-blue-200/70 leading-relaxed mb-3">AI-powered roadmap for your dream role.</p>
          <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-[11px] rounded-xl shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
            <Zap className="w-3.5 h-3.5" />
            Unlock Premium
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mx-2 border-t border-white/[0.06] pt-3 space-y-0.5">
        <Link
          to="/help"
          onClick={onNavClick}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-all"
        >
          <HelpCircle size={16} />
          Help Center
        </Link>
        <button
          onClick={() => { if (onNavClick) onNavClick(); handleLogout(); }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer text-left"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] z-40 border-r border-white/[0.06] py-5 px-3"
        style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1b2e 50%, #0a1628 100%)" }}
      >
        <SidebarContent onNavClick={null} />
      </aside>

      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl border border-white/[0.10] bg-slate-900/80 backdrop-blur-xl text-blue-400 hover:scale-105 active:scale-95 transition-all shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile overlay ── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          onClick={closeDrawer}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-screen w-[260px] z-50 flex flex-col py-5 px-3 border-r border-white/[0.06] shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1b2e 50%, #0a1628 100%)" }}
      >
        <button
          onClick={closeDrawer}
          aria-label="Close navigation"
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/[0.08] text-slate-400 transition-colors"
        >
          <X size={18} />
        </button>
        <SidebarContent onNavClick={closeDrawer} />
      </div>
    </>
  );
}
