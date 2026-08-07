import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  User,
  Mail,
  Briefcase,
  Bell,
  Shield,
  Palette,
  LogOut,
  Save,
  CheckCircle2,
  Camera,
  Key,
  Globe,
  Moon,
  Sun,
  Sparkles,
  ChevronRight,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account & Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const TARGET_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Mobile Developer",
  "Machine Learning Engineer",
];

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    targetRole: "Full Stack Developer",
    bio: "",
    college: "",
    graduationYear: "",
    linkedin: "",
    github: "",
  });

  // Security state
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    practiceReminders: true,
    mockInterviewAlerts: true,
    weeklyProgress: true,
    newProblems: false,
    tips: true,
  });

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: "light",
    compactMode: false,
    animations: true,
  });

  // Load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile((prev) => ({
          ...prev,
          name: parsed.name || "",
          email: parsed.email || "",
          targetRole: parsed.targetRole || "Full Stack Developer",
          bio: parsed.bio || "",
          college: parsed.college || "",
          graduationYear: parsed.graduationYear || "",
          linkedin: parsed.linkedin || "",
          github: parsed.github || "",
        }));
      }
    } catch (_) {}
  }, []);

  const handleSave = () => {
    try {
      const stored = localStorage.getItem("user");
      const existing = stored ? JSON.parse(stored) : {};
      const updated = { ...existing, ...profile };
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (_) {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const avatarInitial = profile.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex relative overflow-hidden selection:bg-[#004ac6] selection:text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[130px]" />

      <Sidebar />

      <main className="lg:ml-[280px] flex-1 min-h-screen px-4 md:px-10 pt-20 lg:pt-10 pb-10 max-w-[1100px] w-full mx-auto space-y-8 relative z-10">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 text-xs font-bold text-blue-800 ring-1 ring-inset ring-blue-700/10 mb-3 shadow-inner shadow-blue-500/10">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              Account Settings
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Settings & Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your account, preferences, and notifications.
            </p>
          </div>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer shadow-lg ${
              saved
                ? "bg-emerald-500 text-white shadow-emerald-500/25"
                : "bg-[#004ac6] hover:bg-blue-600 text-white shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5"
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Layout: tabs + content */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* Tab nav */}
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible md:w-56 shrink-0 bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-2.5 h-fit shadow-md shadow-blue-500/5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer w-full text-left ${
                    isActive
                      ? "bg-gradient-to-r from-[#004ac6] to-indigo-600 text-white shadow-md shadow-blue-600/25 scale-[1.01]"
                      : "text-[#434655] hover:bg-slate-100/70 hover:text-[#0b1c30]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}

            <div className="hidden md:block h-px bg-slate-200/70 my-2" />

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50/80 transition-all duration-200 cursor-pointer w-full text-left"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign Out
            </button>
          </nav>

          {/* Tab content */}
          <div className="flex-1 space-y-6">

            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <>
                {/* Avatar card */}
                <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md shadow-blue-500/5 hover:shadow-lg transition-all duration-200 flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#004ac6] via-indigo-600 to-blue-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-600/30">
                      {avatarInitial}
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md cursor-pointer hover:bg-slate-50 hover:scale-105 transition-all">
                      <Camera className="h-3.5 w-3.5 text-[#004ac6]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0b1c30] text-lg">{profile.name || "Your Name"}</h3>
                    <p className="text-sm text-slate-500">{profile.email || "your@email.com"}</p>
                    <span className="inline-block mt-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-xs">
                      {profile.targetRole}
                    </span>
                  </div>
                </div>

                {/* Personal info */}
                <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md shadow-blue-500/5 hover:shadow-lg transition-all duration-200 space-y-5">
                  <h3 className="font-extrabold text-[#0b1c30] text-xs uppercase tracking-wider">Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-sm font-semibold text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/15 hover:border-slate-300 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-sm font-semibold text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/15 hover:border-slate-300 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                        Target Job Role
                      </label>
                      <select
                        value={profile.targetRole}
                        onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-sm font-semibold text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/15 hover:border-slate-300 transition-all duration-200 cursor-pointer"
                      >
                        {TARGET_ROLES.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-400">This customizes your DSA modules and interview questions.</p>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                        placeholder="Tell us about yourself, your goals, and your experience…"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-sm font-semibold text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/15 hover:border-slate-300 transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">College / University</label>
                      <input
                        type="text"
                        value={profile.college}
                        onChange={(e) => setProfile((p) => ({ ...p, college: e.target.value }))}
                        placeholder="MIT, IIT, etc."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-sm font-semibold text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/15 hover:border-slate-300 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Graduation Year</label>
                      <input
                        type="number"
                        value={profile.graduationYear}
                        onChange={(e) => setProfile((p) => ({ ...p, graduationYear: e.target.value }))}
                        placeholder="2025"
                        min="2020"
                        max="2030"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-sm font-semibold text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/15 hover:border-slate-300 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">LinkedIn URL</label>
                      <input
                        type="url"
                        value={profile.linkedin}
                        onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/yourname"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-sm font-semibold text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/15 hover:border-slate-300 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">GitHub URL</label>
                      <input
                        type="url"
                        value={profile.github}
                        onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))}
                        placeholder="https://github.com/yourusername"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-sm font-semibold text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/15 hover:border-slate-300 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── ACCOUNT & SECURITY TAB ── */}
            {activeTab === "account" && (
              <>
                <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md shadow-blue-500/5 hover:shadow-lg transition-all duration-200 space-y-5">
                  <h3 className="font-extrabold text-[#0b1c30] text-xs uppercase tracking-wider flex items-center gap-2">
                    <Key className="h-4 w-4 text-blue-500" />
                    Change Password
                  </h3>

                  {["current", "newPass", "confirm"].map((field) => {
                    const labels = { current: "Current Password", newPass: "New Password", confirm: "Confirm New Password" };
                    return (
                      <div key={field} className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{labels[field]}</label>
                        <div className="relative">
                          <input
                            type={showPasswords[field] ? "text" : "password"}
                            value={passwords[field]}
                            onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200/80 bg-slate-50/70 text-sm font-semibold text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/15 hover:border-slate-300 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords((p) => ({ ...p, [field]: !p[field] }))}
                            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            {showPasswords[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button className="flex items-center gap-2 px-5 py-2.5 bg-[#004ac6] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5">
                    <Shield className="h-4 w-4" />
                    Update Password
                  </button>
                </div>

                {/* Danger zone */}
                <div className="bg-rose-50/80 backdrop-blur-xl border border-rose-200/90 rounded-3xl p-6 sm:p-8 shadow-md shadow-rose-500/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                    <h3 className="font-extrabold text-rose-900 text-xs uppercase tracking-wider">Danger Zone</h3>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed font-medium">
                    Deleting your account will permanently remove all your progress, interview records, and data. This action cannot be undone.
                  </p>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-rose-600/25 hover:-translate-y-0.5">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>
              </>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === "notifications" && (
              <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md shadow-blue-500/5 space-y-1">
                <h3 className="font-extrabold text-[#0b1c30] text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  Email Notifications
                </h3>

                {Object.entries({
                  practiceReminders: "Daily Practice Reminders",
                  mockInterviewAlerts: "Mock Interview Session Alerts",
                  weeklyProgress: "Weekly Progress Reports",
                  newProblems: "New Problem Announcements",
                  tips: "Career Tips & AI Recommendations",
                }).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 cursor-pointer group"
                  >
                    <span className="text-sm font-semibold text-[#0b1c30] group-hover:text-[#004ac6] transition-colors duration-200">{label}</span>
                    <div
                      onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                        notifications[key] ? "bg-[#004ac6] shadow-md shadow-blue-600/20" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                          notifications[key] ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* ── APPEARANCE TAB ── */}
            {activeTab === "appearance" && (
              <div className="space-y-5">
                <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md shadow-blue-500/5 space-y-5">
                  <h3 className="font-extrabold text-[#0b1c30] text-xs uppercase tracking-wider flex items-center gap-2">
                    <Palette className="h-4 w-4 text-blue-500" />
                    Theme
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "light", label: "Light Mode", Icon: Sun, desc: "Clean white background" },
                      { id: "dark", label: "Dark Mode", Icon: Moon, desc: "Easy on the eyes" },
                    ].map(({ id, label, Icon, desc }) => (
                      <button
                        key={id}
                        onClick={() => setAppearance((a) => ({ ...a, theme: id }))}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                          appearance.theme === id
                            ? "border-[#004ac6] bg-blue-50/70 shadow-md shadow-blue-500/10 scale-[1.01]"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <Icon className={`h-7 w-7 ${appearance.theme === id ? "text-[#004ac6]" : "text-slate-400"}`} />
                        <div className="text-center">
                          <p className={`text-sm font-extrabold ${appearance.theme === id ? "text-[#004ac6]" : "text-[#0b1c30]"}`}>{label}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md shadow-blue-500/5 space-y-1">
                  <h3 className="font-extrabold text-[#0b1c30] text-xs uppercase tracking-wider mb-4">Display Preferences</h3>

                  {[
                    { key: "compactMode", label: "Compact Mode", desc: "Reduce spacing for more content" },
                    { key: "animations", label: "Motion & Animations", desc: "Enable micro-animations and transitions" },
                  ].map(({ key, label, desc }) => (
                    <label key={key} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 cursor-pointer">
                      <div>
                        <p className="text-sm font-semibold text-[#0b1c30]">{label}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                      </div>
                      <div
                        onClick={() => setAppearance((a) => ({ ...a, [key]: !a[key] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                          appearance[key] ? "bg-[#004ac6] shadow-md shadow-blue-600/20" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                            appearance[key] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
