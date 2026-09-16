import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password, 3 = Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Request Reset Code via Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/api/auth/forgot-password", { email: email.trim() });
      setSuccessMsg(res.data?.message || `A 6-digit reset code has been sent to ${email}`);
      if (res.data?.devOtp) setDevOtp(res.data.devOtp);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Could not send reset code. Please verify your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/api/auth/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      setSuccessMsg(res.data?.message || "Password reset successfully!");
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid or expired reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7ff] p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-blue-200 selection:text-blue-900">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[130px]" />

      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-2xl shadow-slate-200/80 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-black text-slate-900">
            <img
              src="/assets/app_logo.png"
              alt="SyntacHire AI logo"
              className="h-10 w-10 rounded-xl object-cover shadow-md shadow-blue-500/20"
            />
            <span>SyntacHire <strong className="text-blue-600 font-black">AI</strong></span>
          </Link>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Security &amp; Account Recovery
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 animate-in fade-in duration-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && step !== 3 && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Forgot your password?</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Enter your registered email address. We'll send a 6-digit verification code from <strong className="text-slate-700">syntachire.ai@gmail.com</strong>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Registered Email Address
              </label>
              <div className="relative group">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Sending Reset Code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Enter OTP & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Reset your password</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 6-digit code sent to <strong className="text-slate-800">{email}</strong> and choose a new password.
              </p>
            </div>

            {/* OTP Input */}
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-center font-mono text-lg font-black tracking-widest text-slate-900 placeholder-slate-300 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
              {devOtp && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between animate-in fade-in">
                  <span>Dev/Test Code: <strong className="font-mono text-blue-900 font-bold text-sm tracking-wider">{devOtp}</strong></span>
                  <button type="button" onClick={() => setOtp(devOtp)} className="text-[11px] bg-blue-600 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-blue-700 cursor-pointer">
                    Auto-fill
                  </button>
                </div>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                New Password (min 8 chars)
              </label>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Confirm New Password
              </label>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={handleRequestOtp}
                className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Reset Success */}
        {step === 3 && (
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-md">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900">Password Updated!</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your account password has been successfully updated. You can now log in with your new credentials.
              </p>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <span>Go to Login</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
