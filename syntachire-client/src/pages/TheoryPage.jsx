import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import QuizSection from "../components/QuizSection";
import { getModuleTheory } from "../api/modules";
import API from "../api/axios";
import { 
  ArrowLeft, 
  CheckCircle2,
  Cpu, 
  Lightbulb, 
  Code2, 
  ListTodo, 
  HelpCircle, 
  XOctagon, 
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Dumbbell,
  BookOpen,
  Zap,
  Target,
  FileCode,
  Layers,
  Sparkles,
  ShieldAlert
} from "lucide-react";

export default function TheoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State managers
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingRead, setMarkingRead] = useState(false);
  const [isRead, setIsRead] = useState(false);

  // Fetch theory dataset on parameter change
  const loadTheory = async () => {
    setLoading(true);
    setError(null);
    try {
      const theoryData = await getModuleTheory(id);
      setData(theoryData);
      setIsRead(!!theoryData?.module?.isReadingCompleted);
    } catch (err) {
      console.error("Failed to load theory content:", err);
      setError("We encountered an error loading this module's theory. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheory();
  }, [id]);

  const handleMarkComplete = async () => {
    setMarkingRead(true);
    try {
      await API.post(`/api/modules/${id}/complete-reading`);
      setIsRead(true);
    } catch (err) {
      console.error("Failed to mark reading complete:", err);
    } finally {
      setMarkingRead(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
        <Sidebar />
        <main className="lg:ml-[280px] flex-1 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-sm font-bold">Loading comprehensive theory content...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
        <Sidebar />
        <main className="lg:ml-[280px] flex-1 flex items-center justify-center min-h-screen p-6">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-4 max-w-lg">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h4 className="font-extrabold text-red-950">Theory Load Failed</h4>
            <p className="text-xs text-red-800 leading-relaxed">{error || "Data not found."}</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={loadTheory}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                Retry
              </button>
              <Link 
                to="/coding-practice"
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                Back to Practice Sheet
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { module, previousModule, nextModule } = data;
  const theory = module.theory || {};

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex flex-col">
      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:ml-[280px] min-h-screen px-4 md:px-10 py-10 max-w-[1050px] w-full mx-auto space-y-8">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <Link 
            to="/coding-practice" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Practice Modules
          </Link>

          <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100">
            {module.number}
          </span>
        </div>

        {/* Hero Module Header */}
        <header className="space-y-5 border-b border-[#c3c6d7]/30 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={`px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${
                  module.difficulty === "Easy"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : module.difficulty === "Medium"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {module.difficulty}
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">
                {module.topic || "Data Structures & Algorithms"}
              </span>
            </div>

            {/* Per-User Theory Completion Button */}
            <button
              onClick={handleMarkComplete}
              disabled={markingRead || isRead}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                isRead
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isRead ? "Theory Completed 🎉" : markingRead ? "Saving..." : "Mark Theory as Read"}</span>
            </button>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#0b1c30] tracking-tight leading-[1.1]">
            {module.name}
          </h2>
          <p className="text-base text-slate-500 font-normal leading-relaxed max-w-3xl">
            {module.description}
          </p>
        </header>

        {/* 1. Overview */}
        {theory.overview && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <Cpu className="h-4.5 w-4.5 text-blue-600" />
              </div>
              Module Overview & Motivation
            </h3>
            <p className="text-base text-[#434655] leading-8 font-normal">
              {theory.overview}
            </p>
          </section>
        )}

        {/* 2. Detailed Theory Narrative */}
        {theory.theoryText && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
              </div>
              Core Theoretical Foundations
            </h3>
            <div className="text-sm text-[#434655] leading-relaxed font-normal whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {theory.theoryText}
            </div>
          </section>
        )}

        {/* 3. Learning Objectives */}
        {theory.learningObjectives?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Target className="h-4.5 w-4.5 text-emerald-600" />
              </div>
              Learning Objectives
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {theory.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/60 text-xs font-semibold text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 4. Deep Dive Sections */}
        {theory.sections?.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <Layers className="h-4.5 w-4.5 text-blue-600" />
              </div>
              Deep-Dive Technical Breakdown
            </h3>

            {theory.sections.map((sec, index) => (
              <div 
                key={index}
                className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-extrabold text-[#0b1c30]">
                    {sec.title}
                  </h4>
                </div>

                <p className="text-sm text-[#434655] leading-relaxed font-normal whitespace-pre-line">
                  {sec.content}
                </p>

                {sec.codeSnippet && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code Illustration</span>
                    <div className="bg-[#1e1e1e] rounded-2xl p-5 overflow-x-auto text-xs font-mono text-slate-200 border border-slate-800 shadow-inner">
                      <pre><code>{sec.codeSnippet}</code></pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 5. Key Concepts & Patterns */}
        {theory.patterns?.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <Lightbulb className="h-4.5 w-4.5 text-amber-600" />
              </div>
              Problem Solving Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {theory.patterns.map((pat, index) => (
                <div 
                  key={index}
                  className="bg-white border border-[#c3c6d7]/20 rounded-2xl p-5 shadow-xs space-y-2 hover:border-amber-200 transition-colors"
                >
                  <h4 className="font-extrabold text-sm text-[#0b1c30]">{pat.title}</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">{pat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Code Examples */}
        {theory.codeExamples?.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                <FileCode className="h-4.5 w-4.5 text-violet-600" />
              </div>
              Implementation Code Examples
            </h3>
            {theory.codeExamples.map((ex, index) => (
              <div key={index} className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 shadow-xs space-y-3">
                <h4 className="text-base font-extrabold text-[#0b1c30]">{ex.title}</h4>
                <div className="bg-[#1e1e1e] rounded-2xl p-4 overflow-x-auto text-xs font-mono text-[#61afef] border border-slate-800">
                  <pre><code>{ex.code}</code></pre>
                </div>
                {ex.explanation && (
                  <p className="text-xs text-slate-600 font-normal leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    💡 <strong>Explanation:</strong> {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 7. Operational Complexity Table */}
        {theory.complexities?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
                <Zap className="h-4.5 w-4.5 text-teal-600" />
              </div>
              Time & Space Complexity Reference
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3 font-extrabold text-slate-700">Operation / Case</th>
                    <th className="p-3 font-extrabold text-slate-700">Time Complexity</th>
                    <th className="p-3 font-extrabold text-slate-700">Space Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {theory.complexities.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-semibold text-slate-800">{comp.op}</td>
                      <td className="p-3 font-mono font-bold text-blue-600">{comp.time}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600">{comp.space}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 8. Common Pitfalls & Mistakes */}
        {theory.commonMistakes?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-600" />
              </div>
              Common Pitfalls & Mistakes
            </h3>
            <div className="space-y-3">
              {theory.commonMistakes.map((m, i) => (
                <div key={i} className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 space-y-1.5">
                  <p className="text-xs font-extrabold text-rose-900">⚠️ Mistake: {m.mistake}</p>
                  <p className="text-xs text-rose-800 font-medium">✅ Solution: {m.solution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. Quiz Section */}
        {theory.quiz?.length > 0 && (
          <QuizSection quiz={theory.quiz} />
        )}

        {/* 10. Practice Arena CTA Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#004ac6] via-[#1a56d6] to-[#2563eb] rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full">
                <Dumbbell className="h-3.5 w-3.5 text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Practice Arena</span>
              </div>
              <h3 className="text-xl font-extrabold text-white leading-snug">
                Ready to test your skills?
              </h3>
              <p className="text-sm text-blue-100 font-normal max-w-sm">
                Tackle hand-picked coding problems for this module and reinforce what you've learned.
              </p>
            </div>
            <button
              onClick={() => navigate(`/coding-hub?module=${id}`)}
              className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 bg-white text-[#004ac6] hover:bg-blue-50 font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              Start Practice Problems
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Adjacent Navigation */}
        <footer className="border-t border-[#c3c6d7]/30 pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          {previousModule ? (
            <Link 
              to={`/module/${previousModule.id}/theory`}
              className="flex items-center gap-2.5 px-5 py-3 border border-slate-200 hover:border-blue-200 hover:bg-[#eff4ff]/25 text-[#434655] hover:text-blue-700 rounded-2xl text-xs font-bold transition-all w-full sm:w-auto justify-center"
            >
              <ChevronLeft className="h-4 w-4" />
              <div className="text-left">
                <span className="block text-[9px] opacity-60 uppercase font-black tracking-wider">Previous Module</span>
                <span>{previousModule.name}</span>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block w-[180px]"></div>
          )}

          <button
            onClick={handleMarkComplete}
            disabled={markingRead || isRead}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold shadow-md transition-all w-full sm:w-auto cursor-pointer ${
              isRead ? "bg-emerald-600 text-white" : "bg-[#004ac6] hover:bg-[#2563eb] text-white"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isRead ? "Theory Completed 🎉" : "Mark Theory as Read"}</span>
          </button>

          {nextModule ? (
            <Link 
              to={`/module/${nextModule.id}/theory`}
              className="flex items-center gap-2.5 px-5 py-3 border border-slate-200 hover:border-blue-200 hover:bg-[#eff4ff]/25 text-[#434655] hover:text-blue-700 rounded-2xl text-xs font-bold transition-all w-full sm:w-auto justify-center"
            >
              <div className="text-right">
                <span className="block text-[9px] opacity-60 uppercase font-black tracking-wider">Next Module</span>
                <span>{nextModule.name}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="hidden sm:block w-[180px]"></div>
          )}
        </footer>

      </main>
    </div>
  );
}
