import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const closeDrawer = () => setDrawerOpen(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "dashboard",
    },
    {
      name: "Resume Analyzer",
      path: "/analyzer",
      icon: "description",
    },
    {
      name: "Mock Interview",
      path: "/mock-interview",
      icon: "mic",
    },
    {
      name: "Coding Hub",
      path: "/coding-hub",
      icon: "code",
    },
    {
      name: "Coding Practice",
      path: "/coding-practice",
      icon: "school",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "settings",
    },
  ];

  /* ─── Reusable sidebar content ─────────────────────────────── */
  const SidebarContent = ({ onNavClick }) => (
    <>
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-6">
        <img
          src="/assets/app_logo.png"
          alt="SyntacHire AI logo"
          className="w-10 h-10 rounded-xl object-cover border border-[#c3c6d7]/40 shadow-sm flex-shrink-0"
        />
        <div>
          <h1 className="font-bold text-[#004ac6] text-xl">SyntacHire AI</h1>
          <p className="text-xs text-[#434655]">Intelligent Calibration</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? "bg-[#2563eb] text-[#eeefff] shadow-md translate-x-1"
                  : "text-[#434655] hover:bg-[#d3e4fe]/50 hover:text-[#0b1c30]"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Premium Upgrade Banner */}
      <div className="p-4 bg-[#004ac6]/5 rounded-2xl mb-6">
        <p className="text-sm text-[#004ac6] font-bold mb-2">Upgrade to Pro</p>
        <p className="text-[#434655] text-[12px] mb-3">
          Unlock System Design mocks &amp; real-time debug AI.
        </p>
        <button className="w-full py-2 bg-[#004ac6] text-white rounded-lg text-sm font-medium shadow-lg shadow-[#004ac6]/20 hover:scale-[1.02] transition-transform cursor-pointer">
          Go Premium
        </button>
      </div>

      {/* Footer / Helper Links */}
      <div className="pt-4 border-t border-[#c3c6d7]/30 space-y-1">
        <Link
          to="/help"
          onClick={onNavClick}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-xs font-medium ${
            location.pathname === "/help"
              ? "bg-[#d3e4fe] text-[#0b1c30]"
              : "text-[#434655] hover:bg-[#d3e4fe]/50"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          Help Center
        </Link>

        <button
          onClick={() => {
            if (onNavClick) onNavClick();
            handleLogout();
          }}
          className="w-full flex items-center gap-3 text-[#434655] px-4 py-2 hover:bg-[#d3e4fe]/50 rounded-xl transition-all text-xs font-medium text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── DESKTOP sidebar (lg+): always visible, fixed left ── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen p-4 z-40 bg-[#eff4ff] w-[280px] border-r border-[#c3c6d7]/50">
        <SidebarContent onNavClick={null} />
      </aside>

      {/* ── MOBILE / TABLET: hamburger button ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur rounded-xl shadow-md flex items-center justify-center"
      >
        <Menu size={22} className="text-[#004ac6]" />
      </button>

      {/* ── MOBILE / TABLET: overlay ── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE / TABLET: slide-in drawer panel ── */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-[#eff4ff] z-50 flex flex-col p-4 border-r border-[#c3c6d7]/50 transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button inside the drawer */}
        <button
          onClick={closeDrawer}
          aria-label="Close navigation menu"
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#d3e4fe]/60 transition-colors"
        >
          <X size={20} className="text-[#434655]" />
        </button>

        <SidebarContent onNavClick={closeDrawer} />
      </div>
    </>
  );
}
