import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getModuleTheory } from "../api/modules";
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  Cpu, 
  Lightbulb, 
  Code2, 
  ListTodo, 
  HelpCircle, 
  XOctagon, 
  BookMarked,
  Info,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";

export default function TheoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State managers
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch theory dataset on parameter change
  const loadTheory = async () => {
    setLoading(true);
    setError(null);
    try {
      const theoryData = await getModuleTheory(id);
      setData(theoryData);
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

  if (loading) {
    return (
      <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
        <Sidebar />
        <main className="lg:ml-[280px] flex-1 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-sm font-bold">Loading detailed theory content...</p>
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
                Back to Dashboard
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
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:ml-[280px] min-h-screen px-4 md:px-10 py-10 max-w-[1000px] w-full mx-auto space-y-8">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <Link 
            to="/coding-practice" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Dashboard
          </Link>

          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
            {module.number}
          </span>
        </div>

        {/* Hero Module Header */}
        <header className="space-y-4 border-b border-[#c3c6d7]/30 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                module.difficulty === "Easy"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : module.difficulty === "Medium"
                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                  : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}
            >
              {module.difficulty}
            </span>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Duration: {module.estimatedTime}</span>
            </div>
          </div>

          <h2 className="text-3xl font-black text-[#0b1c30] tracking-tight leading-tight">
            {module.name}
          </h2>
          <p className="text-sm text-slate-500 font-normal leading-relaxed">
            {module.description}
          </p>
        </header>

        {/* 1. Overview */}
        <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-3">
          <h3 className="text-base font-extrabold text-[#0b1c30] flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-600" />
            Module Overview
          </h3>
          <p className="text-sm text-[#434655] leading-relaxed font-normal">
            {theory.overview}
          </p>
        </section>

        {/* 2. Learning Objectives */}
        {theory.learningObjectives?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0b1c30] flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-indigo-600" />
              Learning Objectives
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {theory.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    ✓
                  </span>
                  <span className="text-xs font-semibold text-[#434655] leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 3. Core Theory Explanation */}
        <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0b1c30] flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-blue-700" />
            Conceptual Explanations & Deep Dive
          </h3>
          <div className="prose prose-slate max-w-none text-sm text-[#434655] leading-relaxed font-normal space-y-4">
            {theory.theoryText.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* Patterns & Algorithms */}
        {theory.patterns?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0b1c30] flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Key Patterns & Techniques
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {theory.patterns.map((pat, i) => (
                <div key={i} className="border border-slate-100 bg-slate-50/50 p-5 rounded-2xl space-y-2">
                  <p className="font-extrabold text-sm text-[#0b1c30]">{pat.title}</p>
                  <p className="text-xs text-[#434655] leading-relaxed font-normal">{pat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Code Examples */}
        {theory.codeExamples?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-base font-extrabold text-[#0b1c30] flex items-center gap-2">
              <Code2 className="h-5 w-5 text-emerald-600" />
              Typical Implementations & Code Examples
            </h3>
            
            <div className="space-y-6">
              {theory.codeExamples.map((ex, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-[#0b1c30] tracking-wider">
                    Example {i + 1}: {ex.title}
                  </h4>
                  <div className="bg-slate-950 rounded-2xl overflow-hidden font-mono text-xs text-slate-200">
                    <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 text-[10px] text-slate-400 font-bold flex justify-between items-center">
                      <span>{theory.codeLanguage || "javascript"}</span>
                      <span className="text-emerald-500 font-semibold">Standard Code</span>
                    </div>
                    <pre className="p-4 overflow-x-auto leading-relaxed max-h-80 scrollbar-thin">
                      <code>{ex.code}</code>
                    </pre>
                  </div>
                  {ex.explanation && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <strong>Code Walkthrough:</strong> {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Complexity Tables */}
        {theory.complexities?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0b1c30] flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              Complexity Reference Tables
            </h3>
            <div className="overflow-hidden border border-[#c3c6d7]/35 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#c3c6d7]/35 font-bold text-[#434655]">
                    <th className="py-3 px-5">Operation / Algorithm</th>
                    <th className="py-3 px-5">Time Complexity</th>
                    <th className="py-3 px-5">Space Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d7]/20 font-medium text-[#434655]">
                  {theory.complexities.map((comp, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-5 font-bold text-[#0b1c30]">{comp.op}</td>
                      <td className="py-3 px-5 font-mono text-blue-700">{comp.time}</td>
                      <td className="py-3 px-5 font-mono text-emerald-700">{comp.space}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 6. Important Notes */}
        {theory.importantNotes?.length > 0 && (
          <section className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-3">
            <h3 className="text-base font-extrabold text-blue-900 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Key Considerations & Notes
            </h3>
            <ul className="space-y-2.5">
              {theory.importantNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-3 text-xs md:text-sm font-semibold text-blue-950 leading-relaxed">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 7. Common Mistakes */}
        {theory.commonMistakes?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0b1c30] flex items-center gap-2">
              <XOctagon className="h-5 w-5 text-rose-500" />
              Common Pitfalls & Mistakes
            </h3>
            <div className="space-y-4">
              {theory.commonMistakes.map((mistake, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-4 border border-slate-100 rounded-2xl p-4 md:p-5 bg-slate-50/30">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                      ❌ Common Mistake
                    </p>
                    <p className="text-xs font-bold text-[#0b1c30] leading-relaxed">{mistake.mistake}</p>
                  </div>
                  <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                      ✓ Correct Solution
                    </p>
                    <p className="text-xs font-semibold text-[#434655] leading-relaxed">{mistake.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Common Interview Questions */}
        {theory.interviewQuestions?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0b1c30] flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              Common Interview Questions
            </h3>
            <div className="divide-y divide-slate-100">
              {theory.interviewQuestions.map((q, i) => (
                <div key={i} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs md:text-sm font-semibold">
                  <span className="text-[#0b1c30]">{q.question}</span>
                  {q.optimalComplexity && (
                    <span className="bg-slate-100 text-[#434655] px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 self-start sm:self-auto">
                      Target Optimal: {q.optimalComplexity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. Summary */}
        <section className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-3">
          <h3 className="text-base font-extrabold text-emerald-950 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            Module Summary
          </h3>
          <p className="text-xs md:text-sm text-emerald-900 leading-relaxed font-semibold">
            {theory.summary}
          </p>
        </section>

        {/* Adjacent Navigation & Footer Actions */}
        <footer className="border-t border-[#c3c6d7]/30 pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          
          {/* Previous Module Link */}
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

          {/* Practice CTA Center Button */}
          <button
            onClick={() => navigate("/practice")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all w-full sm:w-auto cursor-pointer"
          >
            Start Practice Problems
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Next Module Link */}
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
