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
  Compass
} from "lucide-react";

const menuItems = [
  { name: "Dashboard",      path: "/dashboard",       icon: LayoutDashboard },
  { name: "Role Roadmap",   path: "/roadmap",         icon: Compass         },
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
      <div className="relative flex items-center gap-3 px-4 py-4 mb-4">
        <div className="relative flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25 flex-shrink-0">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-extrabold text-slate-900 text-base tracking-tight truncate">SyntacHire AI</h1>
            <p className="text-[10px] font-bold text-blue-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Career Velocity Engine
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <div className="px-2 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Navigation</p>
        <nav className="space-y-1">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={onNavClick}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                  }`}
                  size={18}
                />
                <span className="flex-1 tracking-tight">{name}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Success Banner ── */}
      <div className="mx-2 mb-4 relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 border border-blue-200/80 shadow-sm transition-all hover:border-blue-300">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-100 border border-blue-200 mb-2">
            <Trophy className="w-3 h-3 text-blue-600" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700">Achieve Greatness</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">Top 1% Career Readiness</h3>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed mb-3">AI-powered roadmap for your dream role.</p>
          <Link
            to="/premium"
            onClick={onNavClick}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[11px] rounded-xl shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            Unlock Premium
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mx-2 border-t border-slate-100 pt-3 space-y-0.5">
        <Link
          to="/settings"
          onClick={onNavClick}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <HelpCircle size={16} />
          Help Center
        </Link>
        <button
          onClick={() => { if (onNavClick) onNavClick(); handleLogout(); }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer text-left"
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
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] z-40 border-r border-slate-200 bg-white/95 backdrop-blur-xl py-5 px-3 shadow-sm">
        <SidebarContent onNavClick={null} />
      </aside>

      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-xl text-blue-600 hover:scale-105 active:scale-95 transition-all shadow-md"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile overlay ── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          onClick={closeDrawer}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-screen w-[260px] z-50 flex flex-col py-5 px-3 border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={closeDrawer}
          aria-label="Close navigation"
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>
        <SidebarContent onNavClick={closeDrawer} />
      </div>
    </>
  );
}
