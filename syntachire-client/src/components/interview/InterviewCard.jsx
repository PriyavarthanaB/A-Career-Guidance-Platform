import React from "react";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function InterviewCard({
  id,
  title,
  subtitle,
  description,
  icon: Icon,
  badge,
  badgeColor = "bg-blue-50 text-blue-700 border-blue-200",
  gradient = "from-blue-600 to-indigo-600",
  features = [],
  estimatedTime = "30 mins",
  isSelected = false,
  onSelect,
}) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border backdrop-blur-xl ${
        isSelected
          ? "bg-white border-blue-600 shadow-xl ring-2 ring-blue-500/20 -translate-y-1"
          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-1"
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
                ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                : "border-slate-300 bg-slate-100 group-hover:border-blue-500"
            }`}
          >
            {isSelected && <CheckCircle2 className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-xs font-extrabold text-blue-600 uppercase tracking-wide">
            {subtitle}
          </p>
        )}
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* Features List */}
      <div className="pt-4 border-t border-slate-100 space-y-2 mb-6">
        {features.map((feat, index) => (
          <div key={index} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span>{feat}</span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{estimatedTime}</span>
        </div>
        <span
          className={`font-bold text-xs ${
            isSelected ? "text-blue-600 font-bold" : "text-slate-500 group-hover:text-blue-600"
          }`}
        >
          {isSelected ? "Selected" : "Click to select"}
        </span>
      </div>
    </div>
  );
}
