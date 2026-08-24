import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, BarChart2, Clock, Trophy, TrendingUp, Activity, Sparkles, ShieldCheck, Globe2, UserCheck } from 'lucide-react';

const formatDuration = (ms) => {
  if (!ms || ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchHistory = async () => {
      try {
        const res = await API.get('/api/interview/history');
        if (!cancelled && res.data?.success) {
          setInterviews(res.data.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to load interview history.');
          console.warn('InterviewHistory:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  const completedInterviews = interviews.filter((item) => item.status === 'completed');
  const sorted = completedInterviews.sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  const current = sorted[0] || null;
  const previous = sorted[1] || null;

  const scoreComparison = current && previous ? current.overallScore - previous.overallScore : null;
  const improvementLabel = scoreComparison > 0 ? 'Improved' : scoreComparison < 0 ? 'Dropped' : 'Unchanged';

  const getScoreDiff = (currentVal, previousVal) => {
    if (currentVal == null || previousVal == null) return 0;
    return Math.round(currentVal - previousVal);
  };

  const compareAreas = (current, previous) => {
    const fields = [
      { label: 'Technical', key: 'overallTechnicalScore' },
      { label: 'Problem Solving', key: 'overallProblemSolvingScore' },
      { label: 'Communication', key: 'overallCommunicationScore' },
      { label: 'Relevance', key: 'overallRelevanceScore' },
      { label: 'Confidence', key: 'overallConfidenceScore' },
      { label: 'Time Management', key: 'overallTimeManagementScore' },
    ];
    return fields.map((area) => ({
      label: area.label,
      diff: getScoreDiff(current[area.key], previous[area.key]),
    }));
  };

  const improvements = current && previous ? compareAreas(current, previous) : [];
  const mostImproved = improvements.reduce((best, item) => (item.diff > best.diff ? item : best), { label: '', diff: -Infinity });
  const weakestArea = current
    ? [
        { label: 'Technical', score: current.overallTechnicalScore || 0 },
        { label: 'Problem Solving', score: current.overallProblemSolvingScore || 0 },
        { label: 'Communication', score: current.overallCommunicationScore || 0 },
        { label: 'Relevance', score: current.overallRelevanceScore || 0 },
        { label: 'Confidence', score: current.overallConfidenceScore || 0 },
        { label: 'Time Management', score: current.overallTimeManagementScore || 0 },
      ].reduce((worst, item) => (item.score < worst.score ? item : worst), { label: '', score: Infinity })
    : null;

  return (
    <div className="relative overflow-hidden bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
      <Sidebar />
      <main className="relative z-10 lg:ml-[280px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 backdrop-blur-md text-xs font-extrabold text-[#004ac6] ring-1 ring-inset ring-[#004ac6]/20 mb-3 shadow-xs">
              <TrendingUp className="h-4 w-4 text-[#004ac6]" /> Interview History
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0b1c30] tracking-tight">Interview History & Comparison</h1>
            <p className="text-sm md:text-base text-[#434655] font-normal mt-2 max-w-2xl">
              Track your past mock interviews, compare your latest performance with previous sessions, and identify the most improved areas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/mock-interview')}
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-3 text-sm font-bold text-[#0b1c30] shadow-sm hover:shadow-md transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Interview Setup
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-8">
          <section className="space-y-6">
            <div className="bg-white/90 border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] font-extrabold text-slate-400">Performance Snapshot</p>
                  <h2 className="mt-3 text-2xl font-black text-[#0b1c30]">Latest Completed Sessions</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#004ac6]">{completedInterviews.length} Completed</p>
                  <p className="text-xs text-slate-500">Sorted by most recent</p>
                </div>
              </div>

              {loading ? (
                <div className="mt-8 space-y-3 animate-pulse">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="h-20 rounded-3xl bg-slate-100" />
                  ))}
                </div>
              ) : error ? (
                <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                  {error}
                </div>
              ) : completedInterviews.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-sm text-slate-600 text-center">
                  No completed interviews yet. Finish a mock interview to start comparing results.
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {sorted.slice(0, 5).map((session) => (
                    <div key={session._id} className="rounded-3xl border border-slate-200 p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.26em] font-bold text-slate-400">{formatDate(session.completedAt)}</p>
                          <h3 className="mt-3 text-lg font-extrabold text-[#0b1c30]">{session.type.toUpperCase()} | {session.targetRole}</h3>
                          <p className="text-sm text-slate-500 mt-1">{session.difficulty} • {session.questionCount} questions • {formatDuration(session.totalDurationMs)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-[#004ac6]">{session.overallScore}%</p>
                          <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Overall Score</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {current && previous && (
              <div className="bg-white/90 border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] font-extrabold text-slate-400">Comparison</p>
                    <h2 className="mt-2 text-2xl font-black text-[#0b1c30]">Current vs Previous Interview</h2>
                  </div>
                  <div className="rounded-3xl bg-blue-50 px-4 py-3 text-sm font-bold text-[#004ac6]">
                    {improvementLabel}: {scoreComparison >= 0 ? '+' : ''}{scoreComparison}%
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Latest', score: current.overallScore, date: current.completedAt },
                    { label: 'Previous', score: previous.overallScore, date: previous.completedAt },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-bold">{item.label}</p>
                      <p className="mt-4 text-4xl font-black text-[#0b1c30]">{item.score}%</p>
                      <p className="mt-2 text-sm text-slate-500">Completed {formatDate(item.date)}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {improvements.map((area) => (
                    <div key={area.label} className="rounded-3xl border border-slate-200 p-5 bg-white">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">{area.label}</p>
                      <p className="mt-4 text-3xl font-black text-[#0b1c30]">{area.diff >= 0 ? '+' : ''}{area.diff}</p>
                      <p className="mt-2 text-sm text-slate-500">Comparison change</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm text-slate-500">Most improved area:</p>
                  <p className="mt-2 text-lg font-black text-[#0b1c30]">{mostImproved.label || 'N/A'} ({mostImproved.diff >= 0 ? '+' : ''}{mostImproved.diff})</p>
                  <p className="mt-4 text-sm text-slate-500">Weakest current area:</p>
                  <p className="mt-2 text-lg font-black text-[#0b1c30]">{weakestArea?.label || 'N/A'} ({weakestArea?.score ?? 0})</p>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-blue-700 shadow-sm">
                <Sparkles className="h-4 w-4" /> Interview Trends
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#004ac6] p-3 text-white">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">Overall Accuracy</p>
                    <p className="text-xs text-slate-500">Compare scores and question-level performance.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">Improvement Insights</p>
                    <p className="text-xs text-slate-500">See your strongest and weakest interview areas.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-purple-50 p-3 text-purple-700">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">Session Consistency</p>
                    <p className="text-xs text-slate-500">Track session duration and score stability.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">How to use history</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#004ac6]" /> Review each completed interview score.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#004ac6]" /> Compare the latest session with the previous one.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#004ac6]" /> Focus on the area that improved most.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
