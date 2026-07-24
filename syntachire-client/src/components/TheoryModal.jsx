import React, { useEffect } from "react";
import { X, BookOpen, Lightbulb, Code2, ShieldAlert, Cpu } from "lucide-react";

export default function TheoryModal({ isOpen, onClose, module }) {
  // Prevent scrolling on page background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0b1c30]/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#eff4ff]/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004ac6]/10 text-[#004ac6]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#004ac6] uppercase tracking-wider">
                {module.number} • Theory & Patterns
              </span>
              <h3 className="text-lg font-extrabold text-[#0b1c30]">{module.name}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200/50 text-[#737686] hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin">
          
          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#004ac6]" /> Overview
            </h4>
            <p className="text-sm text-[#434655] leading-relaxed">
              {module.theory?.overview || "Study the basic principles of this module, including storage structures, memory layouts, and key algorithmic concepts."}
            </p>
          </div>

          {/* Key Techniques / Patterns */}
          {module.theory?.patterns && module.theory.patterns.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-[#007d55]" /> Key Patterns & Algorithms
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {module.theory.patterns.map((pat, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                    <p className="font-bold text-xs text-[#0b1c30] mb-1">{pat.title}</p>
                    <p className="text-[11px] text-[#434655] leading-relaxed">{pat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complexity Analysis */}
          {module.theory?.complexities && module.theory.complexities.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#ba1a1a]" /> Complexity Reference
              </h4>
              <div className="overflow-x-auto border border-[#c3c6d7]/35 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#c3c6d7]/35 font-bold text-[#434655]">
                      <th className="py-2.5 px-4">Operation/Algorithm</th>
                      <th className="py-2.5 px-4">Time Complexity</th>
                      <th className="py-2.5 px-4">Space Complexity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c3c6d7]/20 font-medium text-[#434655]">
                    {module.theory.complexities.map((comp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-bold text-[#0b1c30]">{comp.op}</td>
                        <td className="py-2.5 px-4 font-mono text-blue-700">{comp.time}</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-700">{comp.space}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sample Snippet */}
          {module.theory?.code && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#004ac6]" /> Typical Code Snippet
              </h4>
              <div className="relative bg-slate-950 rounded-2xl overflow-hidden font-mono text-xs text-slate-200">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-[10px] text-slate-400 font-bold flex justify-between items-center">
                  <span>{module.theory.codeLanguage || "javascript"}</span>
                  <span className="text-emerald-500">Sample Implementation</span>
                </div>
                <pre className="p-4 overflow-x-auto leading-relaxed max-h-56 scrollbar-thin">
                  <code>{module.theory.code}</code>
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Got it, Let's Practice
          </button>
        </div>

      </div>
    </div>
  );
}
