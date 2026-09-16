import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
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
  Moon,
  Sun,
  Sparkles,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Check,
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
  const [saving, setSaving] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [reanalyzeMsg, setReanalyzeMsg] = useState("");
  const [statusAlert, setStatusAlert] = useState(null); // { type: 'success' | 'error', text: '' }

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
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("settings_notifications");
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return {
      practiceReminders: true,
      mockInterviewAlerts: true,
      weeklyProgress: true,
      newProblems: false,
      tips: true,
    };
  });

  // Appearance state
  const [appearance, setAppearance] = useState(() => {
    try {
      const stored = localStorage.getItem("settings_appearance");
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return {
      theme: "light",
      compactMode: false,
      animations: true,
    };
  });

  // Account Deletion Password Confirmation States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load user profile on mount
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

  // Save profile & sync to backend
  const handleSaveProfile = async () => {
    setSaving(true);
    setStatusAlert(null);
    try {
      const token = localStorage.getItem("token");
      const res = await API.put("/api/auth/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data?.user || profile;
      const stored = localStorage.getItem("user");
      const existing = stored ? JSON.parse(stored) : {};
      const merged = { ...existing, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(merged));

      // Trigger automatic resume re-analysis for new targetRole
      setReanalyzing(true);
      setReanalyzeMsg("Target role updated! Re-analyzing your resume with AI...");
      try {
        const reRes = await API.post("/api/resume/reanalyze-for-role", {
          targetRole: profile.targetRole,
        });
        if (reRes.data?.message) {
          setReanalyzeMsg(reRes.data.message);
        }
      } catch (apiErr) {
        console.warn("Re-analysis notice:", apiErr);
      } finally {
        setReanalyzing(false);
      }

      setSaved(true);
      setStatusAlert({ type: "success", text: "Profile details updated successfully!" });
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error("Save Profile Error:", err);
      setStatusAlert({ type: "error", text: err.response?.data?.message || "Failed to update profile. Saved locally." });
    } finally {
      setSaving(false);
    }
  };

  // Change password handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatusAlert(null);

    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setStatusAlert({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setStatusAlert({ type: "error", text: "New passwords do not match!" });
      return;
    }
    if (passwords.newPass.length < 6) {
      setStatusAlert({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    setUpdatingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.put("/api/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setStatusAlert({ type: "success", text: "Password changed successfully!" });
        setPasswords({ current: "", newPass: "", confirm: "" });
      }
    } catch (err) {
      console.error("Password Change Error:", err);
      setStatusAlert({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Toggle notification preference
  const toggleNotification = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("settings_notifications", JSON.stringify(next));
      return next;
    });
    setStatusAlert({ type: "success", text: "Notification preference saved!" });
    setTimeout(() => setStatusAlert(null), 2000);
  };

  // Toggle appearance preference
  const toggleAppearanceKey = (key, val) => {
    setAppearance((prev) => {
      const next = { ...prev, [key]: val !== undefined ? val : !prev[key] };
      localStorage.setItem("settings_appearance", JSON.stringify(next));
      return next;
    });
    setStatusAlert({ type: "success", text: "Appearance preference updated!" });
    setTimeout(() => setStatusAlert(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleConfirmDeleteAccount = async (e) => {
    e.preventDefault();
    if (!confirmPassword) {
      setDeleteError("Please enter your password to confirm account deletion.");
      return;
    }
    setDeleting(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("token");
      const res = await API.delete("/api/auth/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: confirmPassword },
      });
      if (res.data?.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/", { state: { message: "Your account and all associated user data have been permanently deleted." } });
      }
    } catch (err) {
      console.error("Delete Account Error:", err.response);
      const msg = err.response?.data?.message || err.response?.data?.error || "Incorrect password. Account deletion cancelled.";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  const avatarInitial = profile.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="text-slate-900 bg-[#f4f7ff] min-h-screen font-sans flex relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[130px]" />

      <Sidebar />

      <main className="lg:ml-[260px] flex-1 min-h-screen px-4 md:px-10 pt-20 lg:pt-10 pb-10 max-w-[1100px] w-full mx-auto space-y-8 relative z-10">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-xs font-bold text-blue-600 ring-1 ring-inset ring-blue-200 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              Account Settings
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Settings &amp; Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your account, preferences, and notifications.
            </p>
          </div>

          {activeTab === "profile" && (
            <button
              onClick={handleSaveProfile}
              disabled={saving || reanalyzing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer shadow-md ${
                saved
                  ? "bg-emerald-500/20 text-emerald-700 border border-emerald-300"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5"
              }`}
            >
              {saving || reanalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>

        {/* Dynamic Status Alert Banner */}
        {statusAlert && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold shadow-xs animate-in fade-in duration-300 ${
            statusAlert.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}>
            {statusAlert.type === "success" ? (
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
            )}
            <span>{statusAlert.text}</span>
          </div>
        )}

        {/* Re-analysis Status Alert Banner */}
        {reanalyzeMsg && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-2xl text-xs font-semibold shadow-xs animate-in fade-in duration-300">
            {reanalyzing ? <Loader2 className="h-4.5 w-4.5 text-blue-600 animate-spin shrink-0" /> : <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />}
            <span>{reanalyzeMsg}</span>
          </div>
        )}

        {/* Layout: tabs + content */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* Tab nav */}
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible md:w-56 shrink-0 bg-white border border-slate-200 rounded-2xl p-2.5 h-fit shadow-xs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setStatusAlert(null); }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer w-full text-left ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 scale-[1.01]"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}

            <div className="hidden md:block h-px bg-slate-200 my-2" />

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 cursor-pointer w-full text-left"
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
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white text-3xl font-black shadow-md shadow-blue-600/20">
                      {avatarInitial}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">{profile.name || "Your Name"}</h3>
                    <p className="text-sm text-slate-500">{profile.email || "your@email.com"}</p>
                    <span className="inline-block mt-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shadow-xs">
                      {profile.targetRole}
                    </span>
                  </div>
                </div>

                {/* Personal info */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-200 space-y-5">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                        Target Job Role
                      </label>
                      <select
                        value={profile.targetRole}
                        onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200 cursor-pointer"
                      >
                        {TARGET_ROLES.map((role) => (
                          <option key={role} value={role} className="bg-white text-slate-900">{role}</option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500">This customizes your DSA modules and interview questions.</p>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                        placeholder="Tell us about yourself, your goals, and your experience…"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">College / University</label>
                      <input
                        type="text"
                        value={profile.college}
                        onChange={(e) => setProfile((p) => ({ ...p, college: e.target.value }))}
                        placeholder="MIT, IIT, etc."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Graduation Year</label>
                      <input
                        type="number"
                        value={profile.graduationYear}
                        onChange={(e) => setProfile((p) => ({ ...p, graduationYear: e.target.value }))}
                        placeholder="2025"
                        min="2020"
                        max="2030"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">LinkedIn URL</label>
                      <input
                        type="url"
                        value={profile.linkedin}
                        onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/yourname"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">GitHub URL</label>
                      <input
                        type="url"
                        value={profile.github}
                        onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))}
                        placeholder="https://github.com/yourusername"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving || reanalyzing}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Profile Changes
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── ACCOUNT & SECURITY TAB ── */}
            {activeTab === "account" && (
              <>
                <form onSubmit={handlePasswordChange} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Key className="h-4 w-4 text-blue-600" />
                    Change Password
                  </h3>

                  <div className="space-y-4">
                    {[
                      { key: "current", label: "Current Password", placeholder: "Enter current password" },
                      { key: "newPass", label: "New Password", placeholder: "At least 6 characters" },
                      { key: "confirm", label: "Confirm New Password", placeholder: "Re-enter new password" },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">{label}</label>
                        <div className="relative">
                          <input
                            type={showPasswords[key] ? "text" : "password"}
                            value={passwords[key]}
                            onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords((p) => ({ ...p, [key]: !p[key] }))}
                            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {showPasswords[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {updatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                    Update Password
                  </button>
                </form>

                {/* Danger zone */}
                <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                    <h3 className="font-extrabold text-rose-800 text-xs uppercase tracking-wider">Danger Zone</h3>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed font-medium">
                    Deleting your account will permanently remove all your progress, interview records, and data. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setConfirmPassword("");
                      setDeleteError("");
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>
              </>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === "notifications" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-600" />
                    Email Notifications &amp; Alerts
                  </h3>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Instant Auto-Save
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {Object.entries({
                    practiceReminders: { label: "Daily Practice Reminders", desc: "Get notified to maintain your active coding streak." },
                    mockInterviewAlerts: { label: "Mock Interview Session Alerts", desc: "Receive session scheduling and score breakdown alerts." },
                    weeklyProgress: { label: "Weekly Progress Reports", desc: "A summary email of your DSA progress & placement readiness index." },
                    newProblems: { label: "New Problem Announcements", desc: "Stay informed when new curated modules or problems drop." },
                    tips: { label: "Career Tips & AI Recommendations", desc: "Tailored AI insights for resume ATS scoring and target roles." },
                  }).map(([key, item]) => {
                    const isChecked = !!notifications[key];
                    return (
                      <div
                        key={key}
                        onClick={() => toggleNotification(key)}
                        className="flex items-center justify-between py-4 cursor-pointer group transition-colors hover:bg-slate-50/80 px-2 rounded-xl"
                      >
                        <div className="space-y-0.5 pr-4">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-500 font-normal">
                            {item.desc}
                          </p>
                        </div>

                        {/* Custom Toggle Switch */}
                        <div
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isChecked ? "bg-blue-600 shadow-sm" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isChecked ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── APPEARANCE TAB ── */}
            {activeTab === "appearance" && (
              <div className="space-y-5">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Palette className="h-4 w-4 text-blue-600" />
                    Theme Mode
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "light", label: "Light Mode", Icon: Sun, desc: "Clean white background & high contrast" },
                      { id: "dark", label: "Dark Mode", Icon: Moon, desc: "Soft dark theme for night sessions" },
                    ].map(({ id, label, Icon, desc }) => {
                      const isSelected = appearance.theme === id;
                      return (
                        <div
                          key={id}
                          onClick={() => toggleAppearanceKey("theme", id)}
                          className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/70 shadow-sm scale-[1.01]"
                              : "border-slate-200 hover:border-slate-300 bg-slate-50"
                          }`}
                        >
                          <Icon className={`h-7 w-7 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                          <div className="text-center">
                            <p className={`text-sm font-extrabold ${isSelected ? "text-blue-600" : "text-slate-800"}`}>{label}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    Display Preferences
                  </h3>

                  <div className="divide-y divide-slate-100">
                    {[
                      { key: "compactMode", label: "Compact Density Mode", desc: "Reduce UI spacing to display more information on desktop." },
                      { key: "animations", label: "Motion & Micro-Animations", desc: "Enable smooth hover transitions and card micro-interactions." },
                    ].map(({ key, label, desc }) => {
                      const isChecked = !!appearance[key];
                      return (
                        <div
                          key={key}
                          onClick={() => toggleAppearanceKey(key)}
                          className="flex items-center justify-between py-4 cursor-pointer group transition-colors hover:bg-slate-50/80 px-2 rounded-xl"
                        >
                          <div className="space-y-0.5 pr-4">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {label}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">{desc}</p>
                          </div>
                          <div
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                              isChecked ? "bg-blue-600 shadow-sm" : "bg-slate-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                isChecked ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Account Password Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Confirm Account Deletion</h3>
                <p className="text-xs text-rose-600 font-bold">Permanent &amp; Irreversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              This action will permanently delete your account profile, all uploaded resumes, DSA practice statistics, and mock interview reports. Please enter your password to proceed.
            </p>

            <form onSubmit={handleConfirmDeleteAccount} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Enter Your Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/15 placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setConfirmPassword("");
                    setDeleteError("");
                  }}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting || !confirmPassword}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Permanently Delete
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
