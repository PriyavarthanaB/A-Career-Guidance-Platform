import React from "react";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function InterviewCard({
  id,
  title,
  subtitle,
  description,
  icon: Icon,
  badge,
  badgeColor = "bg-blue-100 text-blue-700 border-blue-200",
  gradient = "from-blue-600 to-indigo-600",
  features = [],
  estimatedTime = "30 mins",
  isSelected = false,
  onSelect,
}) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
        isSelected
          ? "bg-white border-[#004ac6] shadow-xl ring-2 ring-[#004ac6]/30 translate-y-[-2px]"
          : "bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      {/* Top Header Badge & Selection Indicator */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div
          className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeColor}`}
            >
              {badge}
            </span>
          )}
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? "border-[#004ac6] bg-[#004ac6] text-white"
                : "border-slate-300 bg-slate-50 group-hover:border-blue-400"
            }`}
          >
            {isSelected && <CheckCircle2 className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-[#0b1c30] group-hover:text-[#004ac6] transition-colors">
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
            {subtitle}
          </p>
        )}
        <p className="text-sm text-slate-600 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Features List */}
      <div className="pt-4 border-t border-slate-100 space-y-2 mb-6">
        {features.map((feat, index) => (
          <div key={index} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>{feat}</span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
          <Clock className="h-3.5 w-3.5 text-slate-600" />
          <span>{estimatedTime}</span>
        </div>
        <span
          className={`font-bold text-xs ${
            isSelected ? "text-[#004ac6]" : "text-slate-400 group-hover:text-blue-600"
          }`}
        >
          {isSelected ? "Selected" : "Click to select"}
        </span>
      </div>

      {/* Selected Accent Glow */}
      {isSelected && (
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl" />
      )}
    </div>
  );
}
