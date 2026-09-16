import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Mail,
  Lock,
  User,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Target,
  FileText,
  Mic,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

const HIGHLIGHTS = [
  { 
    icon: FileText, 
    title: "AI-Scored Resumes",
    text: "Tuned specifically for each target job description" 
  },
  { 
    icon: Target, 
    title: "Skill Gap Mapping",
    text: "Identify missing competencies against real market data" 
  },
  { 
    icon: Mic, 
    title: "Interactive Mock Interviews",
    text: "Simulate tech & HR rounds with instant feedback" 
  },
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
];

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Form, 2 = Verify Email OTP
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    targetRole: "Full Stack Developer",
  });
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validate() {
    const next = {};
    if (!formData.name.trim()) next.name = "Enter your full name.";
    if (!formData.email.trim()) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      next.email = "Enter a valid email address.";
    if (!formData.password) next.password = "Create a password.";
    else if (formData.password.length < 8)
      next.password = "Use at least 8 characters.";
    
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  // Step 1: Send Signup OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await API.post("/api/auth/send-signup-otp", formData);
      setSuccessMsg(res.data?.message || `A 6-digit confirmation code has been sent to ${formData.email}`);
      if (res.data?.devOtp) setDevOtp(res.data.devOtp);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Could not send verification code. Please check your information and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP and activate account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit confirmation code sent to your email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post("/api/auth/verify-signup-otp", {
        email: formData.email,
        otp: otp.trim(),
      });

      const token = res.data?.token || res.data?.accessToken;
      const user = res.data?.user || res.data?.data?.user;

      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid or expired verification code. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen font-sans md:grid-cols-12 selection:bg-blue-200 selection:text-blue-900 bg-[#f4f7ff]">
      
      {/* BRAND & VISUAL PANEL (7 Cols) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-[#070f1e] to-indigo-955 p-12 text-white md:col-span-7 md:flex lg:p-16">
        
        {/* Background Mesh Overlay & Ambient Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-600/25 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-indigo-600/20 blur-[110px]" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3 text-2xl font-black tracking-tight lg:text-3xl">
            <img
              src="/assets/app_logo.png"
              alt="SyntacHire AI logo"
              className="h-11 w-11 rounded-xl object-cover shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              SyntacHire <span className="text-blue-400 font-extrabold">AI</span>
            </span>
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-300 backdrop-blur-xl shadow-inner shadow-blue-500/20">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Verified Candidates
          </span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto py-8">
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl font-black tracking-tight leading-[1.2] text-white lg:text-5xl">
              Accelerate your dream role with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">AI Intelligence.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              Create your free account to instantly calculate your ATS resume compatibility score, map required industry skills, and rehearse technical interviews.
            </p>

            {/* Feature Cards Grid */}
            <div className="mt-8 space-y-4 pt-2">
              {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
                <div 
                  key={title} 
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/40 hover:bg-white/[0.08] hover:-translate-y-0.5 shadow-lg shadow-black/20"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-[#004ac6] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-100">{title}</h4>
                    <p className="text-sm text-slate-400 mt-0.5">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Floating Stats Card */}
        <div className="relative z-10 flex items-center justify-between rounded-2xl border border-white/15 bg-slate-900/80 p-4 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Match Rate</p>
              <p className="text-base font-bold text-white">94% ATS Optimization Score</p>
            </div>
          </div>
          <span className="text-sm text-slate-400 font-medium">Joined by 10k+ engineers</span>
        </div>
      </div>

      {/* FORM PANEL (5 Cols) */}
      <div className="flex items-center justify-center bg-white p-6 md:col-span-5 md:bg-white lg:p-12 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-blue-600/15 blur-[120px]" />

        <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 md:border md:border-slate-200 md:bg-white md:p-10 relative z-10">
          
          {/* Mobile Header */}
          <div className="md:hidden">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
              <img
                src="/assets/app_logo.png"
                alt="SyntacHire AI logo"
                className="h-8 w-8 rounded-lg object-cover"
              />
              SyntacHire <span className="text-blue-600">AI</span>
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              {step === 1 ? "Create Account" : "Confirm Email"}
            </h2>
            <p className="mt-2 text-base text-slate-500">
              {step === 1
                ? "Set up your profile to start optimizing your career path."
                : `We sent a 6-digit confirmation code to ${formData.email}`}
            </p>
          </div>

          {/* Dynamic Error Alert */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-300/60 bg-red-50 p-4 text-sm font-medium text-red-600 animate-in fade-in duration-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && step === 2 && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
              <div className="leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* STEP 1: Registration Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
              
              {/* Full Name */}
              <div className="space-y-2">
                <label 
                  htmlFor="name" 
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleFieldChange("name")}
                    className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-12 pr-4 text-base text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white ${
                      fieldErrors.name
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-sm text-red-500 font-medium pl-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleFieldChange("email")}
                    className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-12 pr-4 text-base text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white ${
                      fieldErrors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-sm text-red-500 font-medium pl-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleFieldChange("password")}
                    className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-12 pr-12 text-base text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white ${
                      fieldErrors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-sm text-red-500 font-medium pl-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Target Role Dropdown */}
              <div className="space-y-2">
                <label 
                  htmlFor="targetRole" 
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Target Role
                </label>
                <div className="relative group">
                  <Briefcase className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />
                  <select
                    id="targetRole"
                    value={formData.targetRole}
                    onChange={handleFieldChange("targetRole")}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-8 text-base text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 hover:border-slate-300 cursor-pointer"
                  >
                    {TARGET_ROLES.map((role) => (
                      <option key={role} value={role} className="bg-white text-slate-900">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#004ac6] to-indigo-600 hover:from-blue-600 hover:to-indigo-500 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer mt-3"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span>Sending Confirmation Code...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Email Verification</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Email Confirmation OTP Screen */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  6-Digit Verification Code
                </label>
                <div className="relative group">
                  <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-center font-mono text-xl font-black tracking-widest text-slate-900 placeholder-slate-300 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Sent from <strong className="text-slate-700">syntachire.ai@gmail.com</strong>. Valid for 10 minutes.
                </p>
                {devOtp && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between animate-in fade-in">
                    <span>Dev/Test Code: <strong className="font-mono text-blue-900 font-bold text-sm tracking-wider">{devOtp}</strong></span>
                    <button type="button" onClick={() => setOtp(devOtp)} className="text-[11px] bg-blue-600 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-blue-700 cursor-pointer">
                      Auto-fill
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    <span>Confirm &amp; Activate Account</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  ← Edit details
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* Footer Link */}
          <div className="pt-2 text-center text-base text-slate-500">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors underline-offset-4 hover:underline"
            >
              Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
