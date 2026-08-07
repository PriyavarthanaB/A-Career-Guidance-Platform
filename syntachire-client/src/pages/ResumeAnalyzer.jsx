import React, { useCallback, useRef, useState } from "react";
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
      <svg className="h-40 w-40 -rotate-90 transform drop-shadow-lg" viewBox="0 0 110 110">
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
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-0.5">ATS Score</span>
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("Full Stack Software Developer");
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const pickFile = useCallback((selected) => {
    if (!selected) return;
    const ext = "." + selected.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setError("Please upload a PDF, DOC, or DOCX file.");
      return;
    }
    setError("");
    setResult(null);
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

      setResult(res.data.data || res.data);
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

  const copyMissingKeywords = () => {
    if (!result?.missingSkills?.length) return;
    navigator.clipboard.writeText(result.missingSkills.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased flex">
      {/* Decorative Background Gradient Blobs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/15 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />
      <div className="relative z-10 lg:ml-[280px] flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold text-[#004ac6] ring-1 ring-inset ring-[#004ac6]/20 shadow-xs">
            <Sparkles className="h-4 w-4 text-[#004ac6] animate-pulse" />
            AI-Powered Talent Calibration
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#0b1c30] leading-tight">
            Optimize Your Resume for <span className="bg-gradient-to-r from-[#004ac6] via-blue-600 to-indigo-600 bg-clip-text text-transparent">ATS</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-[#434655] font-normal leading-relaxed">
            Upload your resume to receive a real-time ATS match score, extracted technical skills, and tailored suggestions.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Controls & Upload Panel (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Target Role Input Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
              <label className="mb-2.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0b1c30]">
                <Briefcase className="h-4 w-4 text-[#004ac6]" /> Target Job Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, Data Analyst..."
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 text-sm font-semibold text-[#0b1c30] transition-all focus:border-[#004ac6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6]/20 shadow-inner"
              />
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
                  ? "border-[#004ac6] bg-blue-50/80 scale-[1.01] shadow-xl ring-4 ring-[#004ac6]/10"
                  : "border-slate-300/80 bg-white/85 backdrop-blur-xl hover:border-[#004ac6]/60 hover:bg-blue-50/30 shadow-xs hover:shadow-lg hover:-translate-y-0.5"
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
              <p className="mt-1.5 text-xs font-semibold text-[#434655]">
                Supports PDF, DOC, DOCX up to 10MB
              </p>
            </div>

            {/* Selected File Card */}
            {file && (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-4 shadow-xs hover:shadow-md transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#004ac6]">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="truncate">
                    <p className="truncate text-sm font-bold text-[#0b1c30]">{file.name}</p>
                    <p className="text-xs font-semibold text-[#434655]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => {
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

            <div className="flex items-center justify-center gap-6 pt-1 text-xs font-bold text-[#434655]">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Processing</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Real-time Feedback</span>
            </div>
          </div>

          {/* Analysis Results Display Panel (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="min-h-[460px] rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-200">
              
              {/* Empty State */}
              {!result && !analyzing && (
                <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100/80 text-slate-400 shadow-inner">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0b1c30]">No Analysis Yet</h3>
                  <p className="mt-2 max-w-sm text-sm font-medium text-[#434655] leading-relaxed">
                    Upload your resume on the left to generate an ATS compatibility score and key recommendations.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {analyzing && (
                <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                  <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-[#004ac6] animate-spin"></div>
                    <Sparkles className="h-8 w-8 text-[#004ac6] animate-pulse" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0b1c30]">Evaluating Profile</h3>
                  <p className="mt-2 max-w-sm text-sm font-medium text-[#434655] leading-relaxed">
                    Scanning your resume text against benchmark requirements for <span className="font-bold text-[#004ac6]">{targetRole}</span>...
                  </p>
                </div>
              )}

              {/* Active Results Display */}
              {result && !analyzing && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  
                  {/* Score & Summary Header */}
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start border-b border-slate-100/80 pb-7">
                    <ScoreRing score={result.atsScore ?? 0} />
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-between gap-2">
                        <h3 className="text-xl font-black text-[#0b1c30]">Analysis Summary</h3>
                        <span className="text-xs font-extrabold bg-blue-50 text-[#004ac6] px-3.5 py-1.5 rounded-full border border-blue-100 shadow-xs">
                          {targetRole}
                        </span>
                      </div>
                      <p className="mt-2.5 text-sm sm:text-base leading-relaxed font-normal text-[#434655]">
                        {result.summary || "Your profile has been processed and benchmarked against software development expectations."}
                      </p>
                    </div>
                  </div>

                  {/* Extracted Skills */}
                  {result.extractedSkills?.length > 0 && (
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0b1c30]">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Extracted Skills & Strengths
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.extractedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-xl bg-emerald-50/80 backdrop-blur-xs px-3.5 py-2 text-xs font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100/80 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Suggestions */}
                  {result.suggestions?.length > 0 && (
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0b1c30]">
                        <AlertTriangle className="h-4 w-4 text-amber-500" /> Suggested Improvements
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
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0b1c30]">
                          Missing Keywords
                        </h4>
                        <button
                          onClick={copyMissingKeywords}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004ac6] hover:text-blue-800 transition cursor-pointer"
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

            </div>{/* end results panel */}
          </div>{/* end col-span-7 */}
        </div>{/* end grid */}
        </div>{/* end max-w-6xl */}
      </div>{/* end lg:ml-[280px] */}
    </div>
  );
}