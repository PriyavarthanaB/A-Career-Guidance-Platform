import React from "react";
import { BookOpen, Code, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ModuleCard({ module, onTheory, onPractice, onContinue }) {
  const isCompleted = module.progress === 100;
  const isNotStarted = module.progress === 0;

  return (
    <div className="bg-white border border-[#c3c6d7]/30 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full">
      {/* Header Row: Module # and Difficulty Badge */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg">
          {module.number}
        </span>
        <div className="flex items-center gap-2">
          {module.isReadingCompleted && (
            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Theory Read
            </span>
          )}
          <span
            className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
              module.difficulty === "Easy"
                ? "bg-emerald-50 text-emerald-750 border border-emerald-100"
                : module.difficulty === "Medium"
                ? "bg-amber-50 text-amber-750 border border-amber-100"
                : "bg-rose-50 text-rose-750 border border-rose-100"
            }`}
          >
            {module.difficulty}
          </span>
        </div>
      </div>

      {/* Title & Short Description */}
      <div className="space-y-2 mb-4">
        <h4 className="text-base font-extrabold text-[#0b1c30] leading-tight hover:text-blue-600 transition-colors">
          {module.name}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-3 font-normal leading-relaxed h-[54px]">
          {module.description}
        </p>
      </div>

      {/* Progress Bar Row */}
      <div className="space-y-1.5 mb-5">
        <div className="flex justify-between items-center text-[10px] font-bold text-[#434655]">
          <span>Module Progress</span>
          <span className="text-[#0b1c30] font-extrabold">{module.progress}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted ? "bg-emerald-500" : "bg-[#2563eb]"
            }`}
            style={{ width: `${module.progress}%` }}
          />
        </div>
      </div>

      {/* Actions Section */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        {/* Double Button Row: Theory & Practice */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onTheory(module)}
            className="flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 hover:border-blue-200 hover:bg-[#eff4ff]/30 text-[#434655] hover:text-blue-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Theory
          </button>
          <button
            onClick={() => onPractice(module)}
            className="flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 hover:border-blue-200 hover:bg-[#eff4ff]/30 text-[#434655] hover:text-blue-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Code className="h-3.5 w-3.5" />
            Practice
          </button>
        </div>

        {/* Continue Learning Full-width Button */}
        <button
          onClick={() => onContinue(module)}
          className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            isCompleted
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : isNotStarted
              ? "bg-[#004ac6] hover:bg-[#2563eb] text-white"
              : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          }`}
        >
          <span>
            {isCompleted ? "Review Module" : isNotStarted ? "Start Module" : "Continue Learning"}
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
