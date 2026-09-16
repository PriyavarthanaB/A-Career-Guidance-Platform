import React from "react";
import { Zap, ShieldCheck, Flame, Check } from "lucide-react";

const DIFFICULTIES = [
  {
    id: "Easy",
    title: "Easy",
    label: "Entry Level / Junior",
    description: "Foundational questions, supportive hints, and core CS/behavioral concepts.",
    icon: ShieldCheck,
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    activeBorder: "border-emerald-500 ring-2 ring-emerald-500/20 bg-white",
    activeDot: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30",
  },
  {
    id: "Medium",
    title: "Medium",
    label: "Mid-Level Engineer",
    description: "Standard industry interview scenarios, balanced coding, system design & HR rounds.",
    icon: Zap,
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    activeBorder: "border-amber-500 ring-2 ring-amber-500/20 bg-white",
    activeDot: "bg-amber-500 text-white shadow-md shadow-amber-500/30",
  },
  {
    id: "Hard",
    title: "Hard",
    label: "Senior / Staff Level",
    description: "Deep dive probing, strict technical criteria, complex system trade-offs & edge cases.",
    icon: Flame,
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    activeBorder: "border-rose-500 ring-2 ring-rose-500/20 bg-white",
    activeDot: "bg-rose-500 text-white shadow-md shadow-rose-500/30",
  },
];

export default function DifficultySelector({ selectedDifficulty, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {DIFFICULTIES.map((diff) => {
        const Icon = diff.icon;
        const isSelected = selectedDifficulty === diff.id;

        return (
          <div
            key={diff.id}
            onClick={() => onSelect(diff.id)}
            className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between backdrop-blur-xl ${
              isSelected
                ? `${diff.activeBorder} shadow-lg -translate-y-0.5`
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? diff.activeDot
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    {diff.title}
                  </h4>
                </div>

                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${diff.badgeColor}`}
                >
                  {diff.label}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                {diff.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-500">Target Expectation</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                {isSelected ? (
                  <span className="flex items-center gap-1 text-blue-600 font-bold">
                    <Check className="h-3.5 w-3.5" /> Selected
                  </span>
                ) : (
                  <span className="text-slate-500">Select</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
