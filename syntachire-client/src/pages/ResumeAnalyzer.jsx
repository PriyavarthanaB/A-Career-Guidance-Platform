import React, { useCallback, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from '../components/Sidebar';
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
} from "lucide-react";

const ACCEPTED_TYPES = [".pdf", ".doc", ".docx"];

function ScoreRing({ score }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative flex h-40 w-40 items-center justify-center shrink-0">
      <svg className="h-40 w-40 -rotate-90 transform drop-shadow-xl" viewBox="0 0 110 110">
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="8"
        />
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black tracking-tight text-slate-900">{score}%</span>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">ATS Match</span>
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
        // Sanitize legacy default targetRole strings if any exist in DB
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
    <div className="relative overflow-hidden min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-[550px] h-[550px] bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400/10 via-blue-500/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-10 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-[#004ac6] ring-1 ring-blue-500/20 shadow-xs">
            <Sparkles className="h-4 w-4 text-[#004ac6] animate-pulse" />
            AI-Powered Talent Calibration
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0b1c30] leading-tight">
            Optimize Your Resume for <span className="bg-gradient-to-r from-[#004ac6] via-blue-600 to-indigo-600 bg-clip-text text-transparent">ATS</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
            Upload your resume to receive a real-time ATS match score, extracted technical skills, and tailored suggestions for your profile role.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Controls & Upload Panel (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Locked Target Role Display Box */}
            <div className="rounded-3xl border border-white/80 bg-white/85 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 ring-1 ring-slate-900/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#004ac6]" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Target Job Role</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                  <Lock className="h-3 w-3 text-amber-600" />
                  Auto-Assigned
                </div>
              </div>

              {/* Locked Role Card */}
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/50 border border-blue-100 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[#0b1c30] tracking-tight">{targetRole}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Configured in your account profile</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-1 text-xs font-extrabold text-[#004ac6] hover:text-blue-800 transition-colors cursor-pointer bg-white/80 hover:bg-white px-3 py-1.5 rounded-xl border border-blue-200/60 shadow-2xs"
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
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-[#004ac6] bg-blue-50/90 scale-[1.01] shadow-xl ring-4 ring-[#004ac6]/10"
                  : "border-slate-300/80 bg-white/85 backdrop-blur-xl hover:border-[#004ac6]/60 hover:bg-blue-50/30 shadow-xs hover:shadow-lg hover:-translate-y-0.5 ring-1 ring-slate-900/5"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-[#004ac6] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#004ac6] group-hover:text-white shadow-xs">
                <UploadCloud className="h-8 w-8" />
              </div>
              <p className="text-base font-bold text-[#0b1c30]">
                Drag resume here, or <span className="text-[#004ac6] underline underline-offset-4 decoration-[#004ac6]/40 font-black hover:decoration-[#004ac6]">browse</span>
              </p>
              <p className="mt-1.5 text-xs font-semibold text-slate-400">
                Supports PDF, DOC, DOCX up to 10MB
              </p>

              {/* Format badges */}
              <div className="flex gap-2 mt-4">
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">PDF</span>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">DOC</span>
                <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">DOCX</span>
              </div>
            </div>

            {/* Selected File Card */}
            {file && (
              <div className="flex items-center justify-between rounded-2xl border border-blue-200/80 bg-blue-50/60 backdrop-blur-md p-4 shadow-xs hover:shadow-md transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="truncate">
                    <p className="truncate text-sm font-bold text-[#0b1c30]">{file.name}</p>
                    <p className="text-xs font-semibold text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setResult(null);
                  }}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Error Message Alert */}
            {error && (
              <div className="flex items-center gap-3 rounded-2xl bg-red-50/90 backdrop-blur-sm p-4 text-sm font-semibold text-red-700 border border-red-200/80 shadow-xs">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Analyze CTA Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#004ac6] via-blue-600 to-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-[#004ac6]/25 transition-all duration-200 hover:from-[#003bb0] hover:to-indigo-700 hover:shadow-xl hover:shadow-[#004ac6]/35 hover:-translate-y-0.5 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Parsing Resume & Extracting Insights...
                </>
              ) : (
                <>
                  Analyze Resume Now
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-6 pt-1 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Processing</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Real-time Feedback</span>
            </div>
          </div>

          {/* Analysis Results Display Panel (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="min-h-[480px] rounded-3xl border border-white/80 bg-white/85 backdrop-blur-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 ring-1 ring-slate-900/5">
              
              {/* Empty State */}
              {!result && !analyzing && (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#004ac6] shadow-inner">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0b1c30]">No Analysis Yet</h3>
                  <p className="mt-2 max-w-sm text-sm font-medium text-slate-400 leading-relaxed">
                    Upload your resume on the left to generate an ATS compatibility score and key recommendations for <strong className="text-blue-700">{targetRole}</strong>.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {analyzing && (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                  <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-[#004ac6] animate-spin"></div>
                    <Sparkles className="h-8 w-8 text-[#004ac6] animate-pulse" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0b1c30]">Evaluating Profile</h3>
                  <p className="mt-2 max-w-sm text-sm font-medium text-slate-400 leading-relaxed">
                    Scanning your resume text against benchmark requirements for <span className="font-bold text-[#004ac6]">{targetRole}</span>...
                  </p>
                </div>
              )}

              {/* Active Results Display */}
              {result && !analyzing && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  
                  {/* Target Role Mismatch Notice if viewing historical resume for different role */}
                  {result.targetRole && result.targetRole !== targetRole && (
                    <div className="flex items-center gap-2.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 font-medium">
                      <Briefcase className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>This resume was analyzed for <strong>{result.targetRole}</strong>. Your current profile target role is <strong>{targetRole}</strong>.</span>
                    </div>
                  )}

                  {/* Score & Summary Header */}
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start border-b border-slate-100/80 pb-7">
                    <ScoreRing score={result.atsScore ?? 0} />
                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="flex items-center justify-center sm:justify-between gap-2 flex-wrap">
                        <h3 className="text-xl font-black text-[#0b1c30]">Analysis Summary</h3>
                        <div className="flex items-center gap-2">
                          {result.rawText && (
                            <button
                              onClick={() => {
                                setViewModalResume(result);
                                setViewModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 text-xs font-bold text-[#004ac6] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs transition cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Resume Document
                            </button>
                          )}
                          <span className="text-xs font-extrabold bg-blue-50 text-[#004ac6] px-3.5 py-1.5 rounded-full border border-blue-100 shadow-2xs">
                            {result.targetRole || targetRole}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed font-normal text-slate-600">
                        {result.summary || `Your profile has been benchmarked against ${result.targetRole || targetRole} industry expectations.`}
                      </p>
                    </div>
                  </div>

                  {/* Extracted Skills */}
                  {result.extractedSkills?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0b1c30]">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Extracted Skills & Strengths ({result.extractedSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.extractedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-50/80 backdrop-blur-xs px-3.5 py-2 text-xs font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100/80 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-default"
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
                      <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0b1c30]">
                        <AlertTriangle className="h-4 w-4 text-amber-500" /> Suggested Improvements ({result.suggestions.length})
                      </h4>
                      <ul className="space-y-2.5">
                        {result.suggestions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm font-medium text-[#0b1c30] bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 leading-relaxed hover:bg-amber-50 hover:shadow-xs transition-all duration-200">
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
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0b1c30]">
                          Missing Target Role Keywords ({result.missingSkills.length})
                        </h4>
                        <button
                          onClick={copyMissingKeywords}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004ac6] hover:text-blue-800 transition cursor-pointer bg-blue-50 px-3 py-1 rounded-lg border border-blue-100"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" /> Copy List
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.missingSkills.map((kw, idx) => (
                          <span
                            key={idx}
                            className="rounded-xl bg-slate-100/80 backdrop-blur-xs px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-200/50 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
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
        <section className="space-y-4 pt-4 border-t border-slate-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderCheck className="h-5 w-5 text-[#004ac6]" />
              <h3 className="text-lg font-extrabold text-[#0b1c30]">Your Saved Resumes & Analyses</h3>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {history.length} Saved
              </span>
            </div>
            {history.length > 0 && (
              <span className="text-xs font-semibold text-slate-400">
                Click any resume card to view full ATS insights
              </span>
            )}
          </div>

          {loadingHistory ? (
            <div className="flex items-center justify-center p-8 bg-white/80 rounded-3xl border border-slate-200/80">
              <Loader2 className="h-6 w-6 text-[#004ac6] animate-spin" />
              <span className="ml-2 text-sm font-semibold text-slate-500">Loading your saved resumes...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 text-center space-y-2">
              <Clock className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-[#0b1c30]">No Saved Resumes Yet</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
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
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : score >= 60
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300';

                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      setResult(item);
                      setSelectedResumeId(item._id);
                    }}
                    className={`group relative bg-white/90 backdrop-blur-md border rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-[#004ac6] ring-2 ring-[#004ac6]/20 shadow-md bg-blue-50/20'
                        : 'border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-[#004ac6]'}`}>
                          <FileCheck className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-sm font-extrabold text-[#0b1c30] truncate">{item.fileName || 'Uploaded Resume'}</h4>
                          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {item.targetRole || 'Software Engineer'}
                          </p>
                        </div>
                      </div>

                      <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${scoreBg} shrink-0`}>
                        {score}% ATS
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(item.analyzedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewModalResume(item);
                            setViewModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-slate-600 hover:text-[#004ac6] hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200/80 transition flex items-center gap-1 cursor-pointer"
                          title="Preview raw resume text"
                        >
                          <Eye className="h-3 w-3" /> View Content
                        </button>
                        <button
                          onClick={(e) => handleDeleteResume(item._id, e)}
                          className="p-1 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#004ac6] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0b1c30]">{viewModalResume.fileName || 'Uploaded Resume'}</h3>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                    <span>Role: <strong className="text-slate-700">{viewModalResume.targetRole || targetRole}</strong></span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600">{viewModalResume.atsScore ?? 0}% ATS Match</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {viewModalResume.rawText && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(viewModalResume.rawText);
                      setCopiedResumeText(true);
                      setTimeout(() => setCopiedResumeText(false), 2000);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#004ac6] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition cursor-pointer"
                  >
                    {copiedResumeText ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedResumeText ? 'Copied' : 'Copy Text'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setViewModalResume(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Paper Document View */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc]">
              <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {viewModalResume.rawText ? (
                  viewModalResume.rawText
                ) : (
                  <div className="text-center py-12 text-slate-400 font-sans space-y-2">
                    <FileText className="h-10 w-10 mx-auto opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No Raw Text Stored</p>
                    <p className="text-xs">The text content for this document could not be previewed.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Uploaded on {new Date(viewModalResume.analyzedAt || Date.now()).toLocaleString()}
              </span>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setViewModalResume(null);
                }}
                className="px-4 py-2 font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer"
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