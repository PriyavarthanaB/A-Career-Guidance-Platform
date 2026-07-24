import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getProblemsByModule, toggleProblemBookmark, getModuleById } from "../api/modules";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Tag, 
  Sparkles, 
  Loader2, 
  AlertTriangle,
  Code
} from "lucide-react";

export default function PracticePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State managers
  const [module, setModule] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tracks open hints per problem using a Map of boolean states
  const [openHints, setOpenHints] = useState({});

  // Fetch problems and module details
  const loadPracticeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [moduleData, problemsData] = await Promise.all([
        getModuleById(id),
        getProblemsByModule(id)
      ]);
      setModule(moduleData);
      setProblems(problemsData || []);
    } catch (err) {
      console.error("Failed to load practice data:", err);
      setError("Unable to load coding problems. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPracticeData();
  }, [id]);

  // Toggle bookmark handler
  const handleBookmarkToggle = async (problemId) => {
    try {
      const updated = await toggleProblemBookmark(problemId);
      setProblems((prev) =>
        prev.map((prob) => (prob._id === problemId ? { ...prob, isBookmarked: !prob.isBookmarked } : prob))
      );
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  // Toggle hint view helper
  const toggleHint = (problemId) => {
    setOpenHints((prev) => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  // Navigate to Code Workspace
  const handleSolve = (problem) => {
    navigate(`/problem/${problem._id}`);
  };

  if (loading) {
    return (
      <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
        <Sidebar />
        <main className="lg:ml-[280px] flex-1 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-sm font-bold">Loading coding problems...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
        <Sidebar />
        <main className="lg:ml-[280px] flex-1 flex items-center justify-center min-h-screen p-6">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-4 max-w-lg">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h4 className="font-extrabold text-red-950">Fetch Failed</h4>
            <p className="text-xs text-red-800 leading-relaxed">{error}</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={loadPracticeData}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                Retry
              </button>
              <Link 
                to="/coding-practice"
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex flex-col">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Dashboard */}
      <main className="lg:ml-[280px] min-h-screen px-4 md:px-10 py-10 max-w-[1000px] w-full mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            to="/coding-practice" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Dashboard
          </Link>

          {module && (
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
              {module.number}
            </span>
          )}
        </div>

        {/* Hero Practice Header */}
        <header className="space-y-3 border-b border-[#c3c6d7]/30 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-4 py-1.5 text-xs font-bold text-blue-800 ring-1 ring-inset ring-blue-700/10 w-fit shadow-xs">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            Practice Sandbox
          </div>
          <h2 className="text-3xl font-black text-[#0b1c30] tracking-tight leading-tight">
            {module ? `Practice: ${module.name}` : "Practice Problems"}
          </h2>
          <p className="text-sm text-slate-500 font-normal leading-relaxed">
            Apply theoretical concepts to solve coding interview challenges.
          </p>
        </header>

        {/* Problems List Grid / Empty State */}
        <section className="space-y-4">
          {problems.length > 0 ? (
            <div className="space-y-4">
              {problems.map((problem) => {
                const isSolved = problem.status === "solved";
                const isHintOpen = !!openHints[problem._id];

                return (
                  <div 
                    key={problem._id} 
                    className="bg-white border border-[#c3c6d7]/30 rounded-3xl p-5 md:p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
                  >
                    
                    {/* Upper row: Title, Difficulty badge, Solve Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-base font-extrabold text-[#0b1c30] leading-tight">
                            {problem.name}
                          </h4>
                          {isSolved && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              Solved
                            </span>
                          )}
                        </div>
                        {problem.subtitle && (
                          <p className="text-xs text-slate-400 font-medium">{problem.subtitle}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        
                        {/* Bookmark Button */}
                        <button
                          onClick={() => handleBookmarkToggle(problem._id)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            problem.isBookmarked
                              ? "bg-amber-50 text-amber-500 border-amber-200"
                              : "border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                          }`}
                          title="Bookmark problem"
                        >
                          <Bookmark className={`h-4 w-4 ${problem.isBookmarked ? "fill-current" : ""}`} />
                        </button>

                        {/* Hint Toggle Button */}
                        {problem.hints?.length > 0 && (
                          <button
                            onClick={() => toggleHint(problem._id)}
                            className={`p-2 rounded-xl border text-slate-500 transition-all flex items-center gap-1 cursor-pointer ${
                              isHintOpen
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                            title="Show hints"
                          >
                            <HelpCircle className="h-4 w-4" />
                            {isHintOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                        )}

                        {/* Solve Button */}
                        <button
                          onClick={() => handleSolve(problem)}
                          className="flex items-center gap-1.5 px-5 py-2 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                          <Code className="h-3.5 w-3.5" />
                          Solve
                        </button>

                      </div>
                    </div>

                    {/* Middle row: Badges (Difficulty, Success, Time) */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-slate-400 border-t border-slate-50 pt-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                          problem.difficulty === "Easy"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : problem.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                        {problem.difficulty}
                      </span>

                      <div className="flex items-center gap-1">
                        <span>Success Rate:</span>
                        <span className="text-[#0b1c30]">{problem.successRate}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>Est. Time: {problem.estimatedTime}</span>
                      </div>
                    </div>

                    {/* Companies Row */}
                    {problem.companies?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#434655]">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-slate-400 font-bold mr-1">Target Companies:</span>
                        {problem.companies.map((company, index) => (
                          <span 
                            key={index}
                            className="bg-slate-100/70 border border-slate-200/50 text-[#0b1c30] px-2.5 py-0.5 rounded-md text-[10px]"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tags Row */}
                    {problem.tags?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#434655]">
                        <Tag className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-slate-400 font-bold mr-1">Tags:</span>
                        {problem.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Expandable Hints Panel */}
                    {isHintOpen && problem.hints?.length > 0 && (
                      <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-4 mt-2 animate-in fade-in duration-200">
                        <h5 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
                          Hints Reference
                        </h5>
                        <ul className="space-y-2 text-xs text-[#434655] font-medium leading-relaxed list-decimal pl-4">
                          {problem.hints.map((hint, idx) => (
                            <li key={idx}>{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-[#c3c6d7]/30 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Code className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-[#0b1c30]">No Problems Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                There are no practice problems registered for this module yet. We are dynamically preparing sandbox scenarios.
              </p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
