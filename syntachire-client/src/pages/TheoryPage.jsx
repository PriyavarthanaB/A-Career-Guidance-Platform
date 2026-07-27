import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import QuizSection from "../components/QuizSection";
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
  ArrowRight,
  Dumbbell
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
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Dashboard
          </Link>

          <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100">
            {module.number}
          </span>
        </div>

        {/* Hero Module Header */}
        <header className="space-y-5 border-b border-[#c3c6d7]/30 pb-8">
          <div className="flex flex-wrap items-center gap-3">
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
            <div className="flex items-center gap-1.5 text-slate-400 text-sm font-semibold">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Est. {module.estimatedTime}</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#0b1c30] tracking-tight leading-[1.1]">
            {module.name}
          </h2>
          <p className="text-base text-slate-500 font-normal leading-relaxed max-w-2xl">
            {module.description}
          </p>
        </header>

        {/* 1. Overview */}
        <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <Cpu className="h-4.5 w-4.5 text-blue-600" />
            </div>
            Module Overview
          </h3>
          <p className="text-base text-[#434655] leading-8 font-normal">
            {theory.overview}
          </p>
        </section>

        {/* 2. Learning Objectives */}
        {theory.learningObjectives?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <ListTodo className="h-4.5 w-4.5 text-indigo-600" />
              </div>
              Learning Objectives
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {theory.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-black mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#434655] leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 3. Core Theory Explanation */}
        <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-10 shadow-xs space-y-6">
          <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <BookMarked className="h-4.5 w-4.5 text-blue-700" />
            </div>
            Conceptual Explanations &amp; Deep Dive
          </h3>
          <div className="space-y-5">
            {theory.theoryText.split("\n\n").map((para, i) => (
              <p key={i} className="text-[15px] text-[#2d3748] leading-[1.9] font-normal tracking-[0.01em]">{para}</p>
            ))}
          </div>
        </section>

        {/* Patterns & Algorithms */}
        {theory.patterns?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Lightbulb className="h-4.5 w-4.5 text-yellow-600" />
              </div>
              Key Patterns &amp; Techniques
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {theory.patterns.map((pat, i) => (
                <div key={i} className="border border-slate-100 bg-gradient-to-br from-slate-50 to-yellow-50/20 p-5 rounded-2xl space-y-2.5 hover:border-yellow-200 transition-colors">
                  <p className="font-extrabold text-base text-[#0b1c30] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-[9px] font-black text-white shrink-0">{i+1}</span>
                    {pat.title}
                  </p>
                  <p className="text-sm text-[#434655] leading-relaxed font-normal">{pat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Code Examples */}
        {theory.codeExamples?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Code2 className="h-4.5 w-4.5 text-emerald-600" />
              </div>
              Code Examples &amp; Implementations
            </h3>
            
            <div className="space-y-8">
              {theory.codeExamples.map((ex, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="text-sm font-black uppercase text-[#0b1c30] tracking-widest flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">{i+1}</span>
                    {ex.title}
                  </h4>
                  <div className="bg-slate-950 rounded-2xl overflow-hidden font-mono text-sm text-slate-200 shadow-lg">
                    <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 text-xs text-slate-400 font-bold flex justify-between items-center">
                      <span className="capitalize">{theory.codeLanguage || "javascript"}</span>
                      <span className="text-emerald-400 font-semibold">✓ Standard Implementation</span>
                    </div>
                    <pre className="p-5 overflow-x-auto leading-7 max-h-80">
                      <code>{ex.code}</code>
                    </pre>
                  </div>
                  {ex.explanation && (
                    <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                      <strong className="text-[#0b1c30]">💡 Walkthrough:</strong> {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Complexity Tables */}
        {theory.complexities?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Award className="h-4.5 w-4.5 text-indigo-600" />
              </div>
              Complexity Reference
            </h3>
            <div className="overflow-hidden border border-[#c3c6d7]/35 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#c3c6d7]/35 font-bold text-[#434655]">
                    <th className="py-4 px-5 text-sm">Operation / Algorithm</th>
                    <th className="py-4 px-5 text-sm">Time Complexity</th>
                    <th className="py-4 px-5 text-sm">Space Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d7]/20 font-medium text-[#434655]">
                  {theory.complexities.map((comp, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#0b1c30] text-sm">{comp.op}</td>
                      <td className="py-4 px-5 font-mono text-base font-bold text-blue-700">{comp.time}</td>
                      <td className="py-4 px-5 font-mono text-base font-bold text-emerald-700">{comp.space}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 6. Important Notes */}
        {theory.importantNotes?.length > 0 && (
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-blue-900 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-200 flex items-center justify-center">
                <Info className="h-4.5 w-4.5 text-blue-700" />
              </div>
              Key Considerations &amp; Notes
            </h3>
            <ul className="space-y-3">
              {theory.importantNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-semibold text-blue-950 leading-relaxed bg-white/60 p-3.5 rounded-xl border border-blue-100">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 7. Common Mistakes */}
        {theory.commonMistakes?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                <XOctagon className="h-4.5 w-4.5 text-rose-600" />
              </div>
              Common Pitfalls &amp; Mistakes
            </h3>
            <div className="space-y-4">
              {theory.commonMistakes.map((mistake, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-4 border border-rose-100/60 rounded-2xl p-5 bg-gradient-to-br from-rose-50/30 to-slate-50/30">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">❌ Common Mistake</p>
                    <p className="text-sm font-bold text-[#0b1c30] leading-relaxed">{mistake.mistake}</p>
                  </div>
                  <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">✅ Correct Approach</p>
                    <p className="text-sm font-semibold text-[#434655] leading-relaxed">{mistake.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Common Interview Questions */}
        {theory.interviewQuestions?.length > 0 && (
          <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
            <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <HelpCircle className="h-4.5 w-4.5 text-indigo-600" />
              </div>
              Common Interview Questions
            </h3>
            <div className="divide-y divide-slate-100">
              {theory.interviewQuestions.map((q, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold text-[#0b1c30] leading-relaxed">{q.question}</span>
                  {q.optimalComplexity && (
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
                      🎯 Target: {q.optimalComplexity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. Summary */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-200 flex items-center justify-center">
              <Award className="h-4.5 w-4.5 text-emerald-700" />
            </div>
            Module Summary
          </h3>
          <p className="text-base text-emerald-900 leading-8 font-semibold">
            {theory.summary}
          </p>
        </section>

        {/* 10. Interactive Quiz */}
        {theory.quiz?.length > 0 && (
          <QuizSection quiz={theory.quiz} />
        )}

        {/* 11. Practice Problems CTA Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#004ac6] via-[#1a56d6] to-[#2563eb] rounded-3xl p-6 md:p-8 shadow-xl">
          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
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
              onClick={() => navigate(`/module/${id}/practice`)}
              className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 bg-white text-[#004ac6] hover:bg-blue-50 font-extrabold text-sm rounded-2xl shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              Start Practice Problems
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
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
            onClick={() => navigate(`/module/${id}/practice`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all w-full sm:w-auto cursor-pointer"
          >
            Practice Problems
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
