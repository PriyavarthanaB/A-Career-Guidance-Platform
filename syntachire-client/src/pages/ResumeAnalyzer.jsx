import React, { useCallback, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Briefcase,
  Lock,
  Settings as SettingsIcon,
  Target,
  Clock,
  Trash2,
  Eye,
  FileCheck,
  FolderCheck,
  Calendar,
  Layers,
  BarChart3,
  Award,
  AlertCircle,
} from "lucide-react";

const ACCEPTED_TYPES = [".pdf", ".doc", ".docx"];

function ScoreRing({ score }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeGradient =
    score >= 80 ? "url(#emeraldGradient)" : score >= 60 ? "url(#amberGradient)" : "url(#roseGradient)";

  const scoreTextColor =
    score >= 80 ? "text-emerald-700" : score >= 60 ? "text-amber-700" : "text-rose-700";

  const badgeBg =
    score >= 80
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : score >= 60
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-rose-50 text-rose-800 border-rose-200";

  return (
    <div className="relative flex h-40 w-40 sm:h-44 sm:w-44 items-center justify-center shrink-0">
      <svg className="h-40 w-40 sm:h-44 sm:w-44 -rotate-90 transform drop-shadow-sm" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
        {/* Outer subtle track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="9"
        />
        {/* Animated value ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={strokeGradient}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-3xl sm:text-4xl font-black tracking-tight ${scoreTextColor}`}>{score}%</span>
        <span className={`mt-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border ${badgeBg}`}>
          ATS Match
        </span>
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.targetRole) return parsed.targetRole;
      }
    } catch (_) {}
    return "Backend Developer";
  });
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Resume History State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  // Resume Document Viewer Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewModalResume, setViewModalResume] = useState(null);
  const [copiedResumeText, setCopiedResumeText] = useState(false);

  // Automatically load targetRole & Resume History on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.targetRole) {
          setTargetRole(parsed.targetRole);
        }
      }
    } catch (_) {}

    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/resume/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        const currentProfileRole = (() => {
          try {
            const u = JSON.parse(localStorage.getItem("user") || "{}");
            return u.targetRole || "Backend Developer";
          } catch (_) {
            return "Backend Developer";
          }
        })();

        const cleanedHistory = res.data.data.map((item) => {
          if (!item.targetRole || item.targetRole === "Full Stack Software Developer") {
            return { ...item, targetRole: currentProfileRole };
          }
          return item;
        });

        setHistory(cleanedHistory);
        if (cleanedHistory.length > 0) {
          setResult(cleanedHistory[0]);
          setSelectedResumeId(cleanedHistory[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch resume history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const pickFile = useCallback((selected) => {
    if (!selected) return;
    const ext = "." + selected.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setError("Please upload a PDF, DOC, or DOCX file.");
      return;
    }
    setError("");
    setFile(selected);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError("");

    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("targetRole", targetRole);

      const token = localStorage.getItem("token");

      const res = await API.post("/api/resume/analyze", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const newAnalysis = res.data.data || res.data;
      setResult(newAnalysis);
      setSelectedResumeId(newAnalysis._id);

      // Refresh history list
      fetchHistory();
    } catch (err) {
      console.error("Resume Analysis Error:", err.response);
      const serverMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Couldn't analyze this resume. Please check your network connection and try again.";
      setError(serverMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/api/resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((r) => r._id !== id));
      if (selectedResumeId === id || result?._id === id) {
        const remaining = history.filter((r) => r._id !== id);
        if (remaining.length > 0) {
          setResult(remaining[0]);
          setSelectedResumeId(remaining[0]._id);
        } else {
          setResult(null);
          setSelectedResumeId(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete resume:", err);
    }
  };

  const copyMissingKeywords = () => {
    if (!result?.missingSkills?.length) return;
    navigator.clipboard.writeText(result.missingSkills.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden min-h-screen text-slate-900 bg-[#f8fafc] antialiased">
      <Sidebar />

      <main className="lg:ml-[260px] min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-10 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-2xs">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            AI Talent Calibration &amp; ATS Optimization Engine
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Optimize Your Resume for{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ATS Success
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Instant AI benchmark scan for your target role. Uncover real-time ATS match scores, extracted skill inventories, and high-impact structural recommendations.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Controls & Upload Panel (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Target Job Role Display Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm shadow-slate-900/5 hover:shadow-md transition-all duration-300 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600">Target Job Role</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Lock className="h-3 w-3 text-amber-600" />
                  Auto-Assigned
                </div>
              </div>

              {/* Locked Role Card */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-base font-bold text-slate-900 tracking-tight truncate">{targetRole}</h4>
                    <p className="text-xs text-slate-500 font-medium">Configured in your account profile</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs shrink-0"
                  title="Change target role in Settings"
                >
                  <SettingsIcon className="h-3.5 w-3.5" />
                  Change
                </button>
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 shadow-sm shadow-slate-900/5 ${
                dragActive
                  ? "border-blue-600 bg-blue-50 scale-[1.01] shadow-lg ring-4 ring-blue-500/10"
                  : "border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/40 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white shadow-md shadow-blue-500/10">
                <UploadCloud className="h-8 w-8" />
              </div>
              <p className="text-base font-bold text-slate-900">
                Drag resume here, or <span className="text-blue-600 underline underline-offset-4 font-bold">browse file</span>
              </p>
              <p className="mt-1.5 text-xs font-medium text-slate-500">
                Supports PDF, DOC, DOCX up to 10MB
              </p>

              {/* Format badges */}
              <div className="flex gap-2 mt-4">
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 shadow-2xs">PDF</span>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 shadow-2xs">DOC</span>
                <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200 shadow-2xs">DOCX</span>
              </div>
            </div>

            {/* Selected File Card */}
            {file && (
              <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-2xs animate-in fade-in">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="truncate">
                    <p className="truncate text-sm font-bold text-slate-900">{file.name}</p>
                    <p className="text-xs font-medium text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setResult(null);
                  }}
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-rose-100 hover:text-rose-600 cursor-pointer"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Error Message Alert */}
            {error && (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 border border-rose-200 shadow-2xs">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Analyze CTA Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 py-4 text-base font-black text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Parsing Resume &amp; Benchmarking ATS Match...
                </>
              ) : (
                <>
                  Analyze Resume Now
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-6 pt-1 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Secure Encryption</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Instant AI Insights</span>
            </div>

            {/* ATS Pre-Flight Checklist Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm shadow-slate-900/5 hover:shadow-md transition-all duration-300 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">ATS Pass Checklist</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Best Practices
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Single-Column Hierarchy</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Standard sections without text boxes or complex nested tables</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Quantifiable Metrics</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Highlight impact using %, numbers, scale, and performance gains</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Role Keyword Alignment</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Match skills directly against your target role: <span className="font-semibold text-blue-600">{targetRole}</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Machine-Readable Fonts</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Standard fonts (Inter, Calibri, Arial, Roboto) ensure 100% parse accuracy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Role Benchmark Scope Card */}
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/50 p-5 sm:p-6 shadow-sm shadow-slate-900/5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">Role Benchmark Scope</span>
                </div>
                <span className="text-[10px] font-extrabold text-blue-700 bg-white/90 px-2.5 py-0.5 rounded-full border border-blue-200">
                  AI Calibrated
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Our parser evaluates your resume against industry benchmarks and competency standards for <strong className="text-slate-900">{targetRole}</strong>.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] font-semibold bg-white/95 text-slate-700 px-2.5 py-1 rounded-xl border border-slate-200/80 shadow-2xs">System Architecture</span>
                <span className="text-[11px] font-semibold bg-white/95 text-slate-700 px-2.5 py-1 rounded-xl border border-slate-200/80 shadow-2xs">Core Tech Stack</span>
                <span className="text-[11px] font-semibold bg-white/95 text-slate-700 px-2.5 py-1 rounded-xl border border-slate-200/80 shadow-2xs">Scalability &amp; Clean Code</span>
                <span className="text-[11px] font-semibold bg-white/95 text-slate-700 px-2.5 py-1 rounded-xl border border-slate-200/80 shadow-2xs">CI/CD &amp; Cloud Ops</span>
              </div>
            </div>
          </div>

          {/* Analysis Results Display Panel (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="min-h-[480px] rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm shadow-slate-900/5 hover:shadow-md transition-all duration-300">
              {/* Empty State */}
              {!result && !analyzing && (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner border border-blue-200">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Analysis Yet</h3>
                  <p className="mt-2 max-w-sm text-sm font-medium text-slate-600 leading-relaxed">
                    Upload your resume on the left to generate an ATS compatibility score and key recommendations for <strong className="text-blue-600">{targetRole}</strong>.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {analyzing && (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                  <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                    <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Evaluating Profile</h3>
                  <p className="mt-2 max-w-sm text-sm font-medium text-slate-600 leading-relaxed">
                    Scanning your resume text against benchmark requirements for <span className="font-bold text-blue-600">{targetRole}</span>...
                  </p>
                </div>
              )}

              {/* Active Results Display */}
              {result && !analyzing && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* Target Role Mismatch Notice */}
                  {result.targetRole && result.targetRole !== targetRole && (
                    <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 font-medium">
                      <Briefcase className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>This resume was analyzed for <strong>{result.targetRole}</strong>. Your current profile target role is <strong>{targetRole}</strong>.</span>
                    </div>
                  )}

                  {/* Score & Summary Header */}
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start border-b border-slate-100 pb-7">
                    <ScoreRing score={result.atsScore ?? 0} />
                    <div className="flex-1 text-center sm:text-left space-y-2.5">
                      <div className="flex items-center justify-center sm:justify-between gap-2 flex-wrap">
                        <h3 className="text-xl font-black text-slate-900">Analysis Summary</h3>
                        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                          {result.rawText && (
                            <button
                              onClick={() => {
                                setViewModalResume(result);
                                setViewModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs transition cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Resume Document
                            </button>
                          )}
                          <span className="text-xs font-extrabold bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full border border-blue-200 shadow-2xs">
                            {result.targetRole || targetRole}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed font-normal text-slate-700">
                        {result.summary || `Your profile has been benchmarked against ${result.targetRole || targetRole} industry expectations.`}
                      </p>
                    </div>
                  </div>

                  {/* Extracted Skills */}
                  {result.extractedSkills?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Extracted Skills &amp; Strengths ({result.extractedSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.extractedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:shadow-2xs hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Suggestions */}
                  {result.suggestions?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                        <AlertTriangle className="h-4 w-4 text-amber-600" /> Suggested Improvements ({result.suggestions.length})
                      </h4>
                      <ul className="space-y-2.5">
                        {result.suggestions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-slate-800 bg-amber-50/80 p-4 rounded-2xl border border-amber-200 leading-relaxed hover:bg-amber-100/70 transition-all duration-200 shadow-2xs">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {result.missingSkills?.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                          Missing Target Role Keywords ({result.missingSkills.length})
                        </h4>
                        <button
                          onClick={copyMissingKeywords}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition cursor-pointer bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 shadow-2xs"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-blue-600" /> Copy List
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.missingSkills.map((kw, idx) => (
                          <span
                            key={idx}
                            className="rounded-xl bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-100 hover:-translate-y-0.5 transition-all duration-200 cursor-default shadow-2xs"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Saved Resumes & History Section */}
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FolderCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-black text-slate-900">Your Saved Resumes &amp; Analyses</h3>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {history.length} Saved
              </span>
            </div>
            {history.length > 0 && (
              <span className="text-xs font-medium text-slate-500">
                Click any resume card to view full ATS insights
              </span>
            )}
          </div>

          {loadingHistory ? (
            <div className="flex items-center justify-center p-8 bg-white rounded-3xl border border-slate-200">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              <span className="ml-2 text-sm font-semibold text-slate-600">Loading your saved resumes...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-2 shadow-sm shadow-slate-900/5">
              <Clock className="h-8 w-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900">No Saved Resumes Yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Resumes you upload above will automatically be saved to your account history so you can review their ATS scores anytime.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item) => {
                const isSelected = selectedResumeId === item._id || result?._id === item._id;
                const score = item.atsScore ?? 0;
                const scoreBg =
                  score >= 80
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : score >= 60
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-rose-50 text-rose-800 border-rose-200";

                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      setResult(item);
                      setSelectedResumeId(item._id);
                    }}
                    className={`group relative bg-white border rounded-2xl p-5 shadow-sm shadow-slate-900/5 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md bg-blue-50/20 translate-y-[-1px]"
                        : "border-slate-200/80 hover:border-blue-300 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>
                          <FileCheck className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{item.fileName || "Uploaded Resume"}</h4>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {item.targetRole || "Software Engineer"}
                          </p>
                        </div>
                      </div>

                      <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${scoreBg} shrink-0`}>
                        {score}% ATS
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(item.analyzedAt || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewModalResume(item);
                            setViewModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                          title="Preview raw resume text"
                        >
                          <Eye className="h-3 w-3" /> View Content
                        </button>
                        <button
                          onClick={(e) => handleDeleteResume(item._id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                          title="Delete saved resume"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Resume Document Content Preview Modal */}
      {viewModalOpen && viewModalResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 border-b border-slate-100 bg-white gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {viewModalResume.fileName || "Uploaded Resume"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5 flex-wrap">
                    <span>Target Role: <strong className="text-slate-800 font-bold">{viewModalResume.targetRole || targetRole}</strong></span>
                    <span>•</span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {viewModalResume.atsScore ?? 0}% ATS Match
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {viewModalResume.rawText && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(viewModalResume.rawText);
                      setCopiedResumeText(true);
                      setTimeout(() => setCopiedResumeText(false), 2000);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition cursor-pointer shadow-2xs"
                  >
                    {copiedResumeText ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-blue-600" />}
                    {copiedResumeText ? "Copied" : "Copy Text"}
                  </button>
                )}
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setViewModalResume(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Paper Document View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-100/70">
              <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm font-sans text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-wrap leading-relaxed select-text tracking-normal border-l-4 border-l-blue-600">
                {viewModalResume.rawText ? (
                  viewModalResume.rawText
                ) : (
                  <div className="text-center py-12 text-slate-500 font-sans space-y-2">
                    <FileText className="h-10 w-10 mx-auto opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-700">No Raw Text Stored</p>
                    <p className="text-xs text-slate-500">The text content for this document could not be previewed.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                Uploaded on {new Date(viewModalResume.analyzedAt || Date.now()).toLocaleString()}
              </span>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setViewModalResume(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition cursor-pointer shadow-2xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}