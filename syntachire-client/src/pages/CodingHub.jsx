import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getModules, getProblemsByModule } from "../api/modules";
import {
  Code2,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  Building2,
  Play,
  RefreshCw,
  BarChart2,
  Bookmark,
  ArrowLeft,
  Layers,
} from "lucide-react";

const DIFFICULTY_COLORS = {
  Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Hard: "bg-rose-50 text-rose-700 border-rose-200",
};

const MODULE_ICONS = [
  "⚡", "🔢", "📝", "🔑", "🔗", "📚", "🌳", "⛰️", "🕸️", "🧠", "🚀"
];

export default function CodingHub() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Modules
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError, setModulesError] = useState(null);

  // Selected module & its problems
  const [selectedModuleId, setSelectedModuleId] = useState(searchParams.get("module") || null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [problemsError, setProblemsError] = useState(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [openHints, setOpenHints] = useState({});
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);

  // Load all modules
  const loadModules = async () => {
    setModulesLoading(true);
    setModulesError(null);
    try {
      const data = await getModules();
      setModules(data || []);
      // Auto-select first module if none selected
      if (!selectedModuleId && data?.length > 0) {
        selectModule(data[0]);
      }
    } catch (err) {
      console.error("Failed to load modules:", err);
      setModulesError("Could not load modules. Check your server connection.");
    } finally {
      setModulesLoading(false);
    }
  };

  // Load problems for a module
  const loadProblems = async (moduleId) => {
    setProblemsLoading(true);
    setProblemsError(null);
    setProblems([]);
    setOpenHints({});
    try {
      const data = await getProblemsByModule(moduleId);
      setProblems(data || []);
    } catch (err) {
      console.error("Failed to load problems:", err);
      setProblemsError("Could not load problems for this module.");
    } finally {
      setProblemsLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  // When selectedModuleId changes, reload problems
  useEffect(() => {
    if (selectedModuleId) {
      const mod = modules.find((m) => m._id === selectedModuleId);
      if (mod) {
        setSelectedModule(mod);
        loadProblems(selectedModuleId);
      }
    }
  }, [selectedModuleId, modules]);

  const selectModule = (mod) => {
    setSelectedModuleId(mod._id);
    setSelectedModule(mod);
    setSearchParams({ module: mod._id });
    setMobileModulesOpen(false);
  };

  const toggleHint = (problemId) => {
    setOpenHints((prev) => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  const filteredProblems = useMemo(() => {
    if (!searchQuery.trim()) return problems;
    const q = searchQuery.toLowerCase();
    return problems.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.difficulty?.toLowerCase().includes(q)
    );
  }, [problems, searchQuery]);

  const solvedCount = useMemo(() => problems.filter((p) => p.status === "solved").length, [problems]);

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
      {/* App-level sidebar (main nav) */}
      <Sidebar />

      {/* Main area offset from app sidebar */}
      <div className="lg:ml-[280px] flex-1 min-h-screen flex flex-col">

        {/* Top header bar */}
        <header className="sticky top-0 z-20 bg-[#f8f9ff]/95 backdrop-blur border-b border-slate-200/60 px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile: hamburger already in Sidebar, this is just a back button on mobile */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-100/70 px-3 py-1 rounded-full ring-1 ring-inset ring-blue-700/10 w-fit mb-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                Coding Hub
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
                {selectedModule ? selectedModule.name : "Select a Module"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile: show/hide modules list */}
            <button
              onClick={() => setMobileModulesOpen((v) => !v)}
              className="md:hidden flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-bold text-[#004ac6] px-3 py-2 rounded-xl shadow-xs"
            >
              <Layers className="h-4 w-4" />
              Modules
            </button>

            {selectedModule && (
              <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-600">
                  {solvedCount}/{problems.length} Solved
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Two-panel layout */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT PANEL: Module list */}
          <aside
            className={`
              ${mobileModulesOpen ? "block" : "hidden"} md:block
              w-full md:w-72 lg:w-80 flex-shrink-0
              bg-white border-r border-slate-200/60
              overflow-y-auto
              ${mobileModulesOpen ? "absolute inset-0 z-30 md:relative md:z-auto" : ""}
            `}
          >
            {/* Mobile close */}
            {mobileModulesOpen && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 md:hidden">
                <span className="font-extrabold text-sm text-[#0b1c30]">Choose a Module</span>
                <button
                  onClick={() => setMobileModulesOpen(false)}
                  className="text-slate-500 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>
            )}

            <div className="p-4 border-b border-slate-100">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                All Modules
              </h2>
              <p className="text-[11px] text-slate-400">
                {modules.length} modules • Click to load problems
              </p>
            </div>

            {modulesLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Loading modules…</p>
              </div>
            ) : modulesError ? (
              <div className="p-4 text-center space-y-2">
                <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto" />
                <p className="text-xs text-rose-700 font-semibold">{modulesError}</p>
                <button
                  onClick={loadModules}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <nav className="p-2 space-y-0.5">
                {modules.map((mod, idx) => {
                  const isActive = selectedModuleId === mod._id;
                  const diffColor =
                    mod.difficulty === "Easy"
                      ? "text-emerald-600"
                      : mod.difficulty === "Medium"
                      ? "text-amber-600"
                      : "text-rose-600";
                  return (
                    <button
                      key={mod._id}
                      onClick={() => selectModule(mod)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                        isActive
                          ? "bg-[#004ac6] text-white shadow-md"
                          : "hover:bg-slate-50 text-[#434655]"
                      }`}
                    >
                      <span className="text-base shrink-0 w-7 text-center">
                        {MODULE_ICONS[idx % MODULE_ICONS.length]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-extrabold leading-tight truncate ${isActive ? "text-white" : "text-[#0b1c30]"}`}>
                          {mod.name}
                        </p>
                        <p className={`text-[10px] font-semibold mt-0.5 ${isActive ? "text-white/70" : diffColor}`}>
                          {mod.difficulty} · {mod.number}
                        </p>
                      </div>
                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-white/80 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            )}
          </aside>

          {/* RIGHT PANEL: Problems */}
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">

            {!selectedModule && !modulesLoading && (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-extrabold text-lg text-[#0b1c30]">Select a Module</h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  Choose a module from the left panel to view its practice problems.
                </p>
              </div>
            )}

            {selectedModule && (
              <>
                {/* Module hero banner */}
                <div className="bg-gradient-to-br from-[#004ac6] via-[#1a56d6] to-[#2563eb] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <span className="text-xs font-black uppercase tracking-widest text-white/60">
                          {selectedModule.number} · {selectedModule.difficulty}
                        </span>
                        <h2 className="text-xl md:text-2xl font-extrabold">{selectedModule.name}</h2>
                        <p className="text-sm text-white/75 max-w-lg">{selectedModule.description}</p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                        <div className="bg-white/15 border border-white/20 rounded-2xl px-4 py-2.5 text-center">
                          <p className="text-2xl font-black">{problems.length}</p>
                          <p className="text-[10px] text-white/70 font-bold uppercase">Problems</p>
                        </div>
                        <div className="bg-emerald-500/20 border border-emerald-300/30 rounded-xl px-3 py-1.5 text-center">
                          <p className="text-sm font-black text-emerald-200">{solvedCount} Solved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Theory shortcut */}
                <div className="bg-white border border-blue-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#0b1c30]">Study Theory First</p>
                      <p className="text-xs text-slate-400">Read concepts, examples, and complexity before solving</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/module/${selectedModule._id}/theory`)}
                    className="shrink-0 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Open Theory <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search problems in this module…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-[#0b1c30] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                {/* Problems list */}
                {problemsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="text-sm font-semibold">Loading problems…</p>
                  </div>
                ) : problemsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-3">
                    <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto" />
                    <p className="font-extrabold text-red-900">Failed to load problems</p>
                    <p className="text-xs text-red-700">{problemsError}</p>
                    <button
                      onClick={() => loadProblems(selectedModuleId)}
                      className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Retry
                    </button>
                  </div>
                ) : filteredProblems.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3">
                    <Code2 className="h-10 w-10 text-slate-300 mx-auto" />
                    <h4 className="font-extrabold text-[#0b1c30]">
                      {searchQuery ? "No matches found" : "No problems yet"}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      {searchQuery
                        ? "Try a different search term."
                        : "Problems for this module are being prepared. Check back soon!"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-[#0b1c30]">
                        Practice Problems ({filteredProblems.length})
                      </h3>
                      <span className="text-xs text-slate-400 font-semibold">
                        Click Solve to open the code editor
                      </span>
                    </div>

                    {filteredProblems.map((problem, idx) => {
                      const isSolved = problem.status === "solved";
                      const isHintOpen = !!openHints[problem._id];

                      return (
                        <div
                          key={problem._id}
                          className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-xs hover:shadow-md transition-all duration-300 space-y-4"
                        >
                          {/* Header row */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <span className="text-xs font-black text-slate-400 bg-slate-50 border border-slate-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-base font-extrabold text-[#0b1c30] leading-tight">
                                    {problem.name}
                                  </h4>
                                  {isSolved && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Solved
                                    </span>
                                  )}
                                </div>
                                {problem.subtitle && (
                                  <p className="text-xs text-slate-400 mt-0.5">{problem.subtitle}</p>
                                )}
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 sm:shrink-0">
                              {problem.hints?.length > 0 && (
                                <button
                                  onClick={() => toggleHint(problem._id)}
                                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                    isHintOpen
                                      ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                      : "border-slate-200 text-slate-400 hover:bg-slate-50"
                                  }`}
                                  title="Show hints"
                                >
                                  <HelpCircle className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/problem/${problem._id}`)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                              >
                                <Play className="h-3.5 w-3.5 fill-current" />
                                Solve
                              </button>
                            </div>
                          </div>

                          {/* Badges row */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                                DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.Medium
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                            {problem.estimatedTime && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                <Clock className="h-3 w-3" />
                                {problem.estimatedTime}
                              </span>
                            )}
                            {problem.successRate && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                <BarChart2 className="h-3 w-3" />
                                {problem.successRate} success
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          {problem.tags?.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Tag className="h-3 w-3 text-slate-300 shrink-0" />
                              {problem.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="bg-blue-50 text-blue-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-blue-100"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Companies */}
                          {problem.companies?.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Building2 className="h-3 w-3 text-slate-300 shrink-0" />
                              {problem.companies.map((c, i) => (
                                <span
                                  key={i}
                                  className="bg-slate-50 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-100"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Hints panel */}
                          {isHintOpen && problem.hints?.length > 0 && (
                            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4">
                              <h5 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
                                Hints
                              </h5>
                              <ul className="space-y-1.5 text-xs text-[#434655] font-medium list-decimal pl-4">
                                {problem.hints.map((hint, i) => (
                                  <li key={i}>{hint}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}