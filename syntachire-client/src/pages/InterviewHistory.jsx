import { generateInterviewReportPDF } from "../utils/pdfGenerator";
import { Download } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import {
  ArrowLeft, BarChart2, Trophy, TrendingUp, Sparkles,
  CheckCircle2, AlertTriangle, Target, ChevronDown, ChevronUp, Brain, Award, Activity, Zap, Flame, ShieldAlert,
} from "lucide-react";

const formatDuration = (ms) => {
  if (!ms || ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ScoreBar = ({ label, score, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  const textMap = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-500">{label}</span>
        <span className={textMap[color]}>{score ?? 0}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-700/50 overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(score ?? 0, 100)}%` }}
        />
      </div>
    </div>
  );
};

// SVG Score Trend Chart Component
const ScoreTrendChart = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) return null;

  const points = timeline.map((item, idx) => {
    const x = timeline.length === 1 ? 50 : (idx / (timeline.length - 1)) * 260 + 20;
    const y = 140 - (item.overallScore / 100) * 110;
    return { x, y, score: item.overallScore, date: formatDate(item.date), role: item.targetRole };
  });

  const pathD = points.length === 1
    ? `M 20,${points[0].y} L 280,${points[0].y}`
    : points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`), "");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Score Progression Trend</span>
        <span className="text-xs font-extrabold text-blue-400">{timeline.length} Sessions Tracked</span>
      </div>
      <div className="relative w-full h-44 bg-slate-950/60 rounded-2xl p-3 border border-white/[0.06] flex items-end">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150">
          {/* Horizontal grid lines */}
          <line x1="10" y1="30" x2="290" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="10" y1="85" x2="290" y2="85" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="10" y1="140" x2="290" y2="140" stroke="rgba(255,255,255,0.08)" />

          {/* Area fill */}
          {points.length > 1 && (
            <path
              d={`${pathD} L ${points[points.length - 1].x},140 L ${points[0].x},140 Z`}
              fill="url(#scoreGradient)"
              opacity="0.25"
            />
          )}

          {/* Trend Line */}
          <path d={pathD} fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle cx={pt.x} cy={pt.y} r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="900">
                {pt.score}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchHistoryAndProgress = async () => {
      try {
        const [histRes, progRes] = await Promise.all([
          API.get("/api/interview/history"),
          API.get("/api/interview/progress").catch(() => null),
        ]);

        if (!cancelled && histRes.data?.success) {
          setInterviews(histRes.data.data || []);
        }

        if (!cancelled && progRes?.data?.success) {
          setProgressData(progRes.data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load interview history and progress.");
          console.warn("InterviewHistory:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHistoryAndProgress();
    return () => { cancelled = true; };
  }, []);

  const completedInterviews = interviews.filter((i) => i.status === "completed");
  const sorted = [...completedInterviews].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  const current = sorted[0] || null;
  const previous = sorted[1] || null;

  const scoreComparison = current && previous ? current.overallScore - previous.overallScore : null;
  const improvementLabel =
    scoreComparison > 0 ? "Improved" : scoreComparison < 0 ? "Dropped" : "Unchanged";

  const compareAreas = (curr, prev) =>
    [
      { label: "Technical", key: "overallTechnicalScore" },
      { label: "Problem Solving", key: "overallProblemSolvingScore" },
      { label: "Communication", key: "overallCommunicationScore" },
      { label: "Relevance", key: "overallRelevanceScore" },
      { label: "Confidence", key: "overallConfidenceScore" },
      { label: "Time Management", key: "overallTimeManagementScore" },
    ].map((a) => ({ label: a.label, diff: Math.round((curr[a.key] || 0) - (prev[a.key] || 0)) }));

  const improvements = current && previous ? compareAreas(current, previous) : [];
  const mostImproved = improvements.reduce(
    (best, item) => (item.diff > best.diff ? item : best),
    { label: "", diff: -Infinity }
  );

  const overallImprovement = progressData?.overallImprovement ?? (scoreComparison || 0);
  const recurringWeakTopics = progressData?.recurringWeakTopics || [];
  const scoreTimeline = progressData?.scoreTimeline || [];

  return (
    <div
      className="relative overflow-hidden text-slate-900 bg-[#f4f7ff] min-h-screen font-sans flex antialiased"
    >
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />
      <main className="relative z-10 lg:ml-[260px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-xs font-extrabold text-blue-400 ring-1 ring-inset ring-blue-500/30 mb-3">
              <TrendingUp className="h-4 w-4" /> Multi-Session AI Interview Progress
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Interview Analytics &amp; Progress Tracking
            </h1>
            <p className="text-sm text-slate-300 font-normal mt-2 max-w-2xl">
              Track performance trends over time, discover recurring weak topics identified across AI interviews, and monitor skill growth.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/mock-interview")}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 text-sm font-bold shadow-md hover:shadow-lg transition"
          >
            <Sparkles className="h-4 w-4" /> Start New Interview
          </button>
        </div>

        {/* ── Multi-Interview Progress Metrics Bar ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Completed Sessions</span>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-black text-white">{completedInterviews.length}</p>
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                <Trophy className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">Across technical &amp; HR rounds</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Overall Score Growth</span>
            <div className="flex items-center justify-between">
              <p className={`text-3xl font-black ${overallImprovement >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {overallImprovement >= 0 ? `+${overallImprovement}%` : `${overallImprovement}%`}
              </p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${overallImprovement >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">From first session to latest</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Average Match Score</span>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-black text-blue-400">{progressData?.averageScore ?? (current?.overallScore || 0)}%</p>
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">Mean score across all sessions</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Top Recurring Weak Spot</span>
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-amber-400 truncate max-w-[170px]">
                {recurringWeakTopics[0]?.topic || "None Identified"}
              </p>
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">Targeted in future AI questions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-8">
          <section className="space-y-6">

            {/* Score Trend Chart Section */}
            {scoreTimeline.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-extrabold text-blue-400">Multi-Interview Trend</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">Score Growth Chart Over Time</h2>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-blue-500/10 text-xs font-black text-blue-400 border border-blue-500/20">
                    {scoreTimeline.length} Sessions Analyzed
                  </div>
                </div>

                <ScoreTrendChart timeline={scoreTimeline} />
              </div>
            )}

            {/* Recurring Weak Topics Tracker Card */}
            {recurringWeakTopics.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl rounded-3xl p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider">
                    <ShieldAlert className="h-5 w-5 text-amber-400" />
                    Recurring Candidate Weak Spots Across Interviews
                  </div>
                  <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                    Auto-Targeted by AI
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  The AI Interviewer has identified topics where you repeatedly struggled across multiple sessions. Future interview sessions automatically target these recurring weak spots to evaluate your improvement:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {recurringWeakTopics.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-amber-500/25 p-4 rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{item.topic}</span>
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/25">
                          {item.count} session{item.count > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${Math.min(item.percentageOfSessions || 50, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal">Flagged in {item.percentageOfSessions}% of past completed interviews</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest AI Interview Report Panel */}
            {current && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-xs font-extrabold uppercase tracking-widest text-blue-400 border border-blue-500/20 mb-3">
                      <Award className="h-3.5 w-3.5" /> Latest AI Interview Scorecard
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {current.type.toUpperCase()} — {current.targetRole}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {current.difficulty} &bull; {current.questionCount} questions &bull; {formatDate(current.completedAt)} &bull; {formatDuration(current.totalDurationMs)}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <div>
                      <p className="text-4xl font-black text-blue-600">{current.overallScore}%</p>
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Overall</span>
                    </div>
                    <button
                      onClick={() => generateInterviewReportPDF(current, current.targetRole)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-105"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </button>
                  </div>
                </div>

                {/* Category Score Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <ScoreBar label="Technical Knowledge" score={current.overallTechnicalScore} color="blue" />
                  <ScoreBar label="Problem Solving" score={current.overallProblemSolvingScore} color="purple" />
                  <ScoreBar label="Communication" score={current.overallCommunicationScore} color="emerald" />
                  <ScoreBar label="Relevance" score={current.overallRelevanceScore} color="amber" />
                  <ScoreBar label="Confidence" score={current.overallConfidenceScore} color="rose" />
                  <ScoreBar label="Time Management" score={current.overallTimeManagementScore} color="blue" />
                </div>

                {/* Personalized Feedback */}
                {current.personalizedFeedback && (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Personalized AI Feedback
                    </p>
                    <p className="text-sm text-slate-200 leading-relaxed">{current.personalizedFeedback}</p>
                  </div>
                )}
              </div>
            )}

            {/* All Completed Sessions – Expandable */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] font-extrabold text-slate-500">Performance History</p>
                  <h2 className="mt-3 text-2xl font-black text-slate-900">All Completed Sessions</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-400">{completedInterviews.length} Completed</p>
                  <p className="text-xs text-slate-500">Sorted by most recent</p>
                </div>
              </div>

              {loading ? (
                <div className="mt-8 space-y-3 animate-pulse">
                  {[...Array(3)].map((_, idx) => <div key={idx} className="h-20 rounded-3xl bg-slate-800/50" />)}
                </div>
              ) : error ? (
                <div className="mt-8 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-sm text-rose-400">{error}</div>
              ) : completedInterviews.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-white/[0.08] bg-slate-800/50 p-8 text-sm text-slate-300 text-center">
                  No completed interviews yet. Finish a mock interview to start comparing results.
                </div>
              ) : (
                <div className="mt-8 space-y-3">
                  {sorted.slice(0, 8).map((session) => {
                    const isExpanded = expandedId === session._id;
                    return (
                      <div key={session._id} className="rounded-3xl border border-white/[0.08] bg-white/[0.04] overflow-hidden">
                        {/* Header Row */}
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : session._id)}
                          className="w-full text-left p-5 hover:bg-white/[0.03] transition flex items-start justify-between gap-4"
                        >
                          <div>
                            <p className="text-xs uppercase tracking-[0.26em] font-bold text-slate-500">{formatDate(session.completedAt)}</p>
                            <h3 className="mt-2 text-base font-extrabold text-slate-900">{session.type.toUpperCase()} | {session.targetRole}</h3>
                            <p className="text-xs text-slate-500 mt-1">{session.difficulty} &bull; {session.questionCount} questions &bull; {formatDuration(session.totalDurationMs)}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <p className="text-2xl font-black text-blue-400">{session.overallScore}%</p>
                              <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Score</span>
                            </div>
                            {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
                          </div>
                        </button>

                        {/* Expanded Report */}
                        {isExpanded && (
                          <div className="border-t border-white/[0.06] p-5 space-y-5 bg-slate-900/40">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                              <ScoreBar label="Technical Knowledge" score={session.overallTechnicalScore} color="blue" />
                              <ScoreBar label="Problem Solving" score={session.overallProblemSolvingScore} color="purple" />
                              <ScoreBar label="Communication" score={session.overallCommunicationScore} color="emerald" />
                              <ScoreBar label="Relevance" score={session.overallRelevanceScore} color="amber" />
                              <ScoreBar label="Confidence" score={session.overallConfidenceScore} color="rose" />
                              <ScoreBar label="Time Management" score={session.overallTimeManagementScore} color="blue" />
                            </div>
                            {session.personalizedFeedback && (
                              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl space-y-1">
                                <p className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                                  <Sparkles className="h-3.5 w-3.5" /> AI Feedback
                                </p>
                                <p className="text-xs text-slate-300 leading-relaxed">{session.personalizedFeedback}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Aside */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-blue-400 border border-blue-500/30">
                <Sparkles className="h-4 w-4" /> AI Progress Features
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { icon: <TrendingUp className="h-5 w-5" />, bg: "bg-blue-600 text-white", title: "Score Trend Charts", desc: "Track overall score growth from session 1." },
                  { icon: <ShieldAlert className="h-5 w-5" />, bg: "bg-amber-500/20 text-amber-400 border border-amber-500/30", title: "Recurring Weak Spot Tracker", desc: "AI flags topics where you repeatedly struggle." },
                  { icon: <Brain className="h-5 w-5" />, bg: "bg-purple-500/20 text-purple-400 border border-purple-500/30", title: "Targeted Question Selection", desc: "Future AI questions specifically target weak topics." },
                  { icon: <Trophy className="h-5 w-5" />, bg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30", title: "6-Dimension Analytics", desc: "Technical, Problem Solving, Communication & more." },
                ].map(({ icon, bg, title, desc }) => (
                  <div key={title} className="flex items-center gap-3">
                    <div className={`rounded-2xl p-3 ${bg}`}>{icon}</div>
                    <div>
                      <p className="text-sm font-bold text-white">{title}</p>
                      <p className="text-xs text-slate-300">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-xl p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-bold">Progress Tips</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {[
                  "Check your recurring weak spots before starting a new interview.",
                  "Conduct mock interviews regularly to update your score trend curve.",
                  "Focus on addressing recommended topics between sessions.",
                  "Compare current vs previous scorecards to verify improvement.",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
