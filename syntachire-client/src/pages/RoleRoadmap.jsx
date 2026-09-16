import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getRoleRoadmap, getAvailableRoles } from "../api/roadmap";
import {
  Compass,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Sparkles,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Target,
  Brain,
  Code2,
  Wrench,
  Lightbulb,
  Briefcase,
  Award,
  Layers,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  XCircle,
  RotateCcw,
  RefreshCw,
  Shuffle,
  Check
} from "lucide-react";

export default function RoleRoadmap() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected module drawer state
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeTab, setActiveTab] = useState("theory"); // 'theory' | 'practical' | 'interview' | 'quiz' | 'flashcards'

  // Quiz state
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState({});
  const [cardDeck, setCardDeck] = useState([]);

  // Load user role from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.targetRole) setSelectedRole(parsed.targetRole);
      }
    } catch (_) {}
  }, []);

  // Fetch available roles
  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await getAvailableRoles();
        if (data && data.length) setRoles(data);
      } catch (err) {
        console.error("Failed to load roles list:", err);
      }
    }
    loadRoles();
  }, []);

  // Fetch roadmap for selected role
  useEffect(() => {
    async function loadRoadmapData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRoleRoadmap(selectedRole);
        setRoadmap(data);
        if (data?.recommendedModules?.length) {
          setSelectedModule(data.recommendedModules[0]);
        }
      } catch (err) {
        console.error("Failed to load role roadmap:", err);
        setError("Unable to load role roadmap. Please verify backend connection.");
      } finally {
        setLoading(false);
      }
    }
    loadRoadmapData();
  }, [selectedRole]);

  // Reset quiz & flashcards state when selected module changes
  useEffect(() => {
    setUserAnswers({});
    setSubmittedQuiz(false);
    setFlashcardIndex(0);
    setIsFlipped(false);
    if (selectedModule?.flashcards) {
      setCardDeck(selectedModule.flashcards);
    } else {
      setCardDeck([]);
    }
  }, [selectedModule]);

  const handleOptionSelect = (quizId, optionIndex) => {
    if (submittedQuiz) return;
    setUserAnswers((prev) => ({
      ...prev,
      [quizId]: optionIndex,
    }));
  };

  const calculateQuizScore = () => {
    if (!selectedModule?.quiz) return { correct: 0, total: 0 };
    let correct = 0;
    selectedModule.quiz.forEach((q) => {
      const selectedIndex = userAnswers[q.id];
      if (selectedIndex !== undefined && q.options[selectedIndex] === q.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: selectedModule.quiz.length };
  };

  // Flashcards Handlers
  const currentCard = cardDeck[flashcardIndex];

  const handleNextCard = () => {
    if (cardDeck.length === 0) return;
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % cardDeck.length);
  };

  const handlePrevCard = () => {
    if (cardDeck.length === 0) return;
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + cardDeck.length) % cardDeck.length);
  };

  const handleToggleMastered = (cardId) => {
    setMasteredCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleShuffleDeck = () => {
    if (!cardDeck.length) return;
    setIsFlipped(false);
    const shuffled = [...cardDeck].sort(() => Math.random() - 0.5);
    setCardDeck(shuffled);
    setFlashcardIndex(0);
  };

  return (
    <div className="relative min-h-screen bg-[#f4f7ff] text-slate-900 font-sans flex antialiased">
      
      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />

      <main className="relative z-10 lg:ml-[260px] flex-1 min-h-screen px-4 md:px-8 py-8 max-w-[1400px] w-full mx-auto space-y-8">
        
        {/* ── Page Title Hero Header ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 text-white shadow-xl shadow-blue-600/10">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/25 text-xs font-black uppercase tracking-wider shadow-inner">
                <Compass className="w-3.5 h-3.5 text-yellow-300" />
                Role-Specific Placement Engine
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                Role Learning Roadmap &amp; Mastery
              </h1>
              <p className="text-sm text-blue-100/90 font-medium leading-relaxed">
                Step-by-step competency pipeline tailored for your career goal: <strong className="text-yellow-300 underline decoration-yellow-300/60 decoration-2 underline-offset-4">{selectedRole}</strong>
              </p>
            </div>

            {/* Role Selector Dropdown */}
            <div className="flex flex-col gap-1.5 min-w-[280px] bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
              <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-yellow-300" /> Select Job Role:
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-white text-slate-900 text-sm font-extrabold px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer shadow-sm"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.title} className="bg-white text-slate-900 font-bold">
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Visual Flow Pipeline Banner ── */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 flex items-center justify-between overflow-x-auto gap-3 text-xs font-black shadow-sm shadow-slate-900/5">
          <div className="flex items-center gap-2.5 text-blue-600 shrink-0">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shadow-xs">1</span>
            <span>Role Analysis</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="flex items-center gap-2.5 text-purple-600 shrink-0">
            <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs shadow-xs">2</span>
            <span>Required Skills</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="flex items-center gap-2.5 text-indigo-600 shrink-0">
            <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shadow-xs">3</span>
            <span>Target Modules</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="flex items-center gap-2.5 text-emerald-600 shrink-0">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shadow-xs">4</span>
            <span>Structured Theory</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="flex items-center gap-2.5 text-amber-600 shrink-0">
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs shadow-xs">5</span>
            <span>Interactive Quiz &amp; Flashcards</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm font-bold">Analyzing {selectedRole} requirements and building roadmap...</p>
          </div>
        ) : error || !roadmap ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
            <p className="text-sm font-bold text-rose-900">{error || "No roadmap data available."}</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* ── Role Overview Card ── */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm shadow-slate-900/5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{roadmap.role} Competency Path</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">{roadmap.description}</p>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                  {roadmap.recommendedModules?.length || 0} Tailored Modules
                </span>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <p className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Required Core Skill Areas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {roadmap.requiredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Target className="w-3.5 h-3.5 text-blue-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Main Layout: Modules List (Left) + Detailed Theory Drawer (Right) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Recommended Modules List (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Recommended Modules
                </h3>

                <div className="space-y-3">
                  {roadmap.recommendedModules?.map((mod, idx) => {
                    const isSelected = selectedModule?.id === mod.id;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => setSelectedModule(mod)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                          isSelected
                            ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-600 shadow-md shadow-blue-500/10"
                            : "bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            {mod.number}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                            {mod.difficulty}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{mod.name}</h4>
                          <p className="text-xs text-blue-600 font-bold mt-1">Skill: {mod.requiredSkill}</p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                          <span>{mod.topics?.length || 0} Key Topics</span>
                          <span className="font-bold text-slate-700">Est: {mod.estimatedTime}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Interactive Detailed Module Viewer (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {selectedModule ? (
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl shadow-slate-900/5">
                    
                    {/* Module Title Header */}
                    <div className="border-b border-slate-100 pb-6 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                          {selectedModule.number} • {selectedModule.requiredSkill}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Est. Time: <strong className="text-slate-900">{selectedModule.estimatedTime}</strong>
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900">{selectedModule.name}</h2>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
                      <button
                        onClick={() => setActiveTab("theory")}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                          activeTab === "theory"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Structured Theory
                      </button>
                      <button
                        onClick={() => setActiveTab("practical")}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                          activeTab === "practical"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                        }`}
                      >
                        <Briefcase className="w-3.5 h-3.5" /> Practical Relevance
                      </button>
                      <button
                        onClick={() => setActiveTab("interview")}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                          activeTab === "interview"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" /> Interview Relevance
                      </button>
                      <button
                        onClick={() => setActiveTab("quiz")}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                          activeTab === "quiz"
                            ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                            : "bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Knowledge Quiz ({selectedModule.quiz?.length || 0})
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("flashcards");
                          setFlashcardIndex(0);
                          setIsFlipped(false);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                          activeTab === "flashcards"
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "bg-purple-50 text-purple-800 border border-purple-200/80 hover:bg-purple-100"
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" /> Rapid Flashcards ({cardDeck.length})
                      </button>
                    </div>

                    {/* ── TAB 1: Structured Theory Content ── */}
                    {activeTab === "theory" && (
                      <div className="space-y-6 text-sm leading-relaxed">
                        
                        {/* Module Overview */}
                        <div className="bg-blue-50/80 border border-blue-100 p-5 rounded-2xl space-y-2">
                          <h4 className="font-black text-blue-700 uppercase text-xs tracking-wider flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-600" /> Module Overview
                          </h4>
                          <p className="text-slate-800 font-medium">{selectedModule.theoryContent?.overview}</p>
                        </div>

                        {/* Learning Objectives */}
                        {selectedModule.theoryContent?.learningObjectives?.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                              <Target className="w-4 h-4 text-emerald-600" /> Learning Objectives
                            </h4>
                            <ul className="grid grid-cols-1 gap-2">
                              {selectedModule.theoryContent.learningObjectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/80 font-medium">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Important Concepts */}
                        {selectedModule.theoryContent?.importantConcepts?.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                              <Brain className="w-4 h-4 text-purple-600" /> Important Concepts
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedModule.theoryContent.importantConcepts.map((item, i) => (
                                <div key={i} className="bg-purple-50/70 border border-purple-100 p-4 rounded-2xl space-y-1">
                                  <span className="font-extrabold text-purple-900 text-xs">{item.concept}</span>
                                  <p className="text-xs text-slate-700 font-normal leading-relaxed">{item.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Detailed Explanations with Snippets */}
                        {selectedModule.theoryContent?.detailedExplanations?.map((exp, i) => (
                          <div key={i} className="space-y-3 border-t border-slate-100 pt-5">
                            <h4 className="font-black text-slate-900 text-sm">{exp.title}</h4>
                            <p className="text-slate-700 whitespace-pre-line text-xs font-normal leading-relaxed">{exp.content}</p>
                            
                            {exp.snippet && (
                              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-800 space-y-2 shadow-inner">
                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                                  <span>Code / Design Snippet</span>
                                  <span className="uppercase">{exp.language || "code"}</span>
                                </div>
                                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                                  <code>{exp.snippet}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Commonly Used Tools */}
                        {selectedModule.toolsAndTech?.length > 0 && (
                          <div className="space-y-2 border-t border-slate-100 pt-5">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-cyan-600" /> Commonly Used Tools &amp; Technologies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedModule.toolsAndTech.map((tool, i) => (
                                <span key={i} className="px-3.5 py-1 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Best Practices & Common Mistakes Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                          {/* Best Practices */}
                          <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl space-y-2">
                            <h5 className="font-black text-emerald-800 text-xs uppercase tracking-wider">✓ Best Practices</h5>
                            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                              {selectedModule.theoryContent?.bestPractices?.map((bp, i) => (
                                <li key={i}>{bp}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Common Mistakes */}
                          <div className="bg-rose-50/70 border border-rose-200/80 p-4 rounded-2xl space-y-2">
                            <h5 className="font-black text-rose-800 text-xs uppercase tracking-wider">⚠️ Common Mistakes &amp; Fixes</h5>
                            <ul className="space-y-2 text-xs text-slate-700">
                              {selectedModule.theoryContent?.commonMistakes?.map((cm, i) => (
                                <li key={i} className="space-y-0.5">
                                  <span className="font-bold text-rose-900 block">Mistake: {cm.mistake}</span>
                                  <span className="text-slate-600 block">Fix: {cm.solution}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* ── TAB 2: Practical Relevance ── */}
                    {activeTab === "practical" && (
                      <div className="space-y-6">
                        <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-2xl space-y-3">
                          <h4 className="font-black text-blue-700 text-sm flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-600" /> Real-World Job Relevance
                          </h4>
                          <p className="text-sm text-slate-800 leading-relaxed font-medium">
                            {selectedModule.practicalRelevance}
                          </p>
                        </div>

                        {selectedModule.theoryContent?.realWorldExamples?.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                              Industry Use Cases:
                            </h4>
                            <div className="space-y-2">
                              {selectedModule.theoryContent.realWorldExamples.map((ex, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-xs text-slate-700 flex items-start gap-3">
                                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed font-medium">{ex}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── TAB 3: Interview Relevance ── */}
                    {activeTab === "interview" && (
                      <div className="space-y-6">
                        <div className="bg-purple-50/80 border border-purple-100 p-6 rounded-2xl space-y-3">
                          <h4 className="font-black text-purple-900 text-sm flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-600" /> Interview Relevance Overview
                          </h4>
                          <p className="text-sm text-slate-800 leading-relaxed font-medium">
                            {selectedModule.interviewRelevance?.summary}
                          </p>
                        </div>

                        {selectedModule.interviewRelevance?.commonQuestions?.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                              Common Technical Interview Questions &amp; Ideal Answers:
                            </h4>

                            <div className="space-y-4">
                              {selectedModule.interviewRelevance.commonQuestions.map((qObj, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3">
                                  <p className="font-bold text-slate-900 text-xs flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>"{qObj.question}"</span>
                                  </p>
                                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                                    <span className="text-[10px] font-black uppercase text-emerald-600">Ideal Answer Strategy:</span>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{qObj.idealAnswer}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── TAB 4: Interactive Knowledge Quiz ── */}
                    {activeTab === "quiz" && (
                      <div className="space-y-6">
                        {selectedModule.quiz && selectedModule.quiz.length > 0 ? (
                          <div className="space-y-6">
                            
                            {/* Quiz Header */}
                            <div className="flex items-center justify-between bg-amber-50 border border-amber-200/80 p-5 rounded-2xl">
                              <div>
                                <h4 className="font-black text-amber-900 text-sm flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-amber-600" /> Module Mastery Assessment
                                </h4>
                                <p className="text-xs text-slate-600 font-medium mt-0.5">Test your understanding of {selectedModule.name}.</p>
                              </div>

                              {submittedQuiz && (
                                <div className="text-right">
                                  <span className="text-xs font-black uppercase text-slate-500">Your Score:</span>
                                  <p className="text-xl font-black text-amber-600">
                                    {calculateQuizScore().correct} / {calculateQuizScore().total}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Quiz Questions List */}
                            <div className="space-y-6">
                              {selectedModule.quiz.map((q, qIdx) => {
                                const selectedIdx = userAnswers[q.id];
                                const isCorrect = selectedIdx !== undefined && q.options[selectedIdx] === q.correctAnswer;

                                return (
                                  <div key={q.id} className="bg-slate-50/80 border border-slate-200/80 p-6 rounded-2xl space-y-4">
                                    <h5 className="font-bold text-slate-900 text-xs flex items-start gap-2">
                                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                                        {qIdx + 1}
                                      </span>
                                      <span>{q.question}</span>
                                    </h5>

                                    {/* Options */}
                                    <div className="space-y-2">
                                      {q.options.map((opt, optIdx) => {
                                        const isThisSelected = selectedIdx === optIdx;
                                        const isThisCorrectOption = opt === q.correctAnswer;

                                        let btnStyle = "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/40";
                                        if (submittedQuiz) {
                                          if (isThisCorrectOption) {
                                            btnStyle = "bg-emerald-50 border-2 border-emerald-500 text-emerald-900 font-bold";
                                          } else if (isThisSelected && !isCorrect) {
                                            btnStyle = "bg-rose-50 border-2 border-rose-500 text-rose-900 font-bold";
                                          }
                                        } else if (isThisSelected) {
                                          btnStyle = "bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold";
                                        }

                                        return (
                                          <button
                                            key={optIdx}
                                            disabled={submittedQuiz}
                                            onClick={() => handleOptionSelect(q.id, optIdx)}
                                            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                          >
                                            <span>{opt}</span>
                                            {submittedQuiz && isThisCorrectOption && (
                                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                            )}
                                            {submittedQuiz && isThisSelected && !isCorrect && (
                                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Explanation after submission */}
                                    {submittedQuiz && (
                                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                                        <span className="font-extrabold text-blue-600 uppercase text-[10px]">Explanation:</span>
                                        <p className="text-slate-700 leading-relaxed font-medium">{q.explanation}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Quiz Footer Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                              {!submittedQuiz ? (
                                <button
                                  onClick={() => setSubmittedQuiz(true)}
                                  disabled={Object.keys(userAnswers).length < selectedModule.quiz.length}
                                  className={`px-6 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                                    Object.keys(userAnswers).length < selectedModule.quiz.length
                                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                      : "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-[1.02]"
                                  }`}
                                >
                                  Submit Answers &amp; View Results
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSubmittedQuiz(false);
                                    setUserAnswers({});
                                  }}
                                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Retry Quiz
                                </button>
                              )}
                            </div>

                          </div>
                        ) : (
                          <div className="text-center py-10 text-slate-500 text-xs font-medium">
                            No quiz questions available for this module yet.
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── TAB 5: Interactive Flashcard Revision Mode ── */}
                    {activeTab === "flashcards" && (
                      <div className="space-y-6">
                        {cardDeck && cardDeck.length > 0 ? (
                          <div className="space-y-6">
                            
                            {/* Controls Bar & Mastery Progress */}
                            <div className="flex items-center justify-between flex-wrap gap-4 bg-purple-50 border border-purple-100 p-4 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                                  Card {flashcardIndex + 1} of {cardDeck.length}
                                </span>
                                <span className="text-xs font-bold text-slate-600">
                                  Mastered: <strong className="text-emerald-600">{Object.keys(masteredCards).filter(k => masteredCards[k]).length}</strong> / {cardDeck.length}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={handleShuffleDeck}
                                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-purple-200 text-xs font-bold text-purple-800 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                                >
                                  <Shuffle className="w-3.5 h-3.5 text-purple-600" /> Shuffle Deck
                                </button>
                              </div>
                            </div>

                            {/* Flashcard Progress Bar */}
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-300"
                                style={{ width: `${Math.round(((flashcardIndex + 1) / cardDeck.length) * 100)}%` }}
                              />
                            </div>

                            {/* 3D Flip Card Container */}
                            {currentCard && (
                              <div className="space-y-4">
                                <div
                                  onClick={() => setIsFlipped((prev) => !prev)}
                                  className="relative min-h-[300px] w-full rounded-3xl p-8 cursor-pointer transition-all duration-500 flex flex-col justify-between border-2 border-slate-200/80 shadow-xl bg-white hover:border-purple-300 hover:shadow-2xl"
                                >
                                  {/* Card Header Tag */}
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${currentCard.tagColor || "bg-purple-100 text-purple-800 border-purple-200"}`}>
                                      {currentCard.category || "Revision Card"}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                      <RotateCcw className="w-3 h-3 text-purple-600" />
                                      {isFlipped ? "Answer View" : "Prompt View (Click to flip)"}
                                    </span>
                                  </div>

                                  {/* Main Content Area */}
                                  <div className="my-6 space-y-3 text-center">
                                    {!isFlipped ? (
                                      <div className="space-y-3">
                                        <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Question / Concept:</p>
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                                          "{currentCard.front}"
                                        </h3>
                                        <p className="text-xs text-purple-600 font-bold pt-2 animate-pulse">
                                          💡 Click card to reveal explanation
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="space-y-3 text-left">
                                        <p className="text-xs font-black uppercase text-emerald-600 tracking-widest">Answer &amp; Key Insight:</p>
                                        <p className="text-sm md:text-base font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                                          {currentCard.back}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Card Footer Actions */}
                                  <div className="flex items-center justify-between border-t border-slate-100 pt-4" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => handleToggleMastered(currentCard.id)}
                                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                                        masteredCards[currentCard.id]
                                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                      }`}
                                    >
                                      <Check className={`w-3.5 h-3.5 ${masteredCards[currentCard.id] ? "text-emerald-600" : ""}`} />
                                      {masteredCards[currentCard.id] ? "Mastered ✓" : "Mark as Mastered"}
                                    </button>

                                    <button
                                      onClick={() => setIsFlipped((prev) => !prev)}
                                      className="px-4 py-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" /> Flip Card
                                    </button>
                                  </div>
                                </div>

                                {/* Bottom Stepper Buttons */}
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={handlePrevCard}
                                    className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                                  >
                                    <ChevronLeft className="w-4 h-4" /> Previous Card
                                  </button>

                                  <button
                                    onClick={handleNextCard}
                                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs font-black text-white flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                                  >
                                    Next Card <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="text-center py-10 text-slate-500 text-xs font-medium">
                            No flashcards available for this module yet.
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-500 space-y-2">
                    <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
                    <p className="text-sm font-bold">Select a module from the list to view its complete theory and quiz.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
