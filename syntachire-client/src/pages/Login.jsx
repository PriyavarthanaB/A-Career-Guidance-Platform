import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Target,
  FileText,
  Mic,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const HIGHLIGHTS = [
  { 
    icon: FileText, 
    title: "AI Resume Scoring",
    text: "Real-time ATS optimization tuned to job descriptions" 
  },
  { 
    icon: Target, 
    title: "Skill Gap Analysis",
    text: "Map missing competencies against industry benchmarks" 
  },
  { 
    icon: Mic, 
    title: "Mock Interview AI",
    text: "Simulate high-stakes technical & HR rounds" 
  },
];

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await API.post("/api/auth/login", {
        email: form.email,
        password: form.password,
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
        "Invalid credentials. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-slate-950 font-sans md:grid-cols-12 selection:bg-indigo-500 selection:text-white">
      {/* BRAND & VISUAL PANEL (7 Cols) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 text-white md:col-span-7 md:flex lg:p-16">
        
        {/* Background Mesh Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-blue-600/15 blur-[100px]" />

        {/* Top Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3 text-2xl font-black tracking-tight lg:text-3xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              SyntacHire <span className="text-indigo-400 font-extrabold">AI</span>
            </span>
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-300 backdrop-blur-md">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            System v2.4 Active
          </span>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 my-auto py-10">
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl font-black tracking-tight leading-[1.2] text-white lg:text-5xl">
              Calibrate your career with <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-teal-300 bg-clip-text text-transparent">AI Precision.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              Log in to resume your progress, review job-matched ATS scores, and access continuous AI mock feedback tailored for top engineering roles.
            </p>

            {/* Feature Cards Grid */}
            <div className="mt-8 space-y-4 pt-2">
              {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
                <div 
                  key={title} 
                  className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.06] hover:translate-x-1"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
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
        <div className="relative z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
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

      {/* LOGIN FORM PANEL (5 Cols) */}
      <div className="flex items-center justify-center bg-slate-900/50 p-6 md:col-span-5 md:bg-slate-950 lg:p-12">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          
          {/* Mobile Header */}
          <div className="md:hidden">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
              <Sparkles className="h-6 w-6 text-indigo-500" />
              SyntacHire <span className="text-indigo-500">AI</span>
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
              Welcome back
            </h2>
            <p className="mt-2 text-base text-slate-400">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {/* Dynamic Error Alert */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400 animate-in fade-in duration-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* Email Address */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-bold uppercase tracking-wider text-slate-300"
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full rounded-xl border bg-slate-900/80 py-4 pl-12 pr-4 text-base text-white placeholder-slate-500 outline-none transition-all duration-200 focus:bg-slate-900 ${
                    fieldErrors.email
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-red-400 font-medium pl-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-slate-900/80 py-4 pl-12 pr-12 text-base text-white placeholder-slate-500 outline-none transition-all duration-200 focus:bg-slate-900 ${
                    fieldErrors.password
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-red-400 font-medium pl-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-base text-slate-400">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
            >
              Sign Up for Free
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;