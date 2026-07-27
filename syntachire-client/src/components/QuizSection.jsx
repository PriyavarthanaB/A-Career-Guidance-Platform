import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Trophy,
  Brain,
  Lightbulb,
  Target,
  Sparkles,
  Star,
} from "lucide-react";

/* ─── Grade helper ─────────────────────────────────────────── */
function getGrade(score, total) {
  const pct = (score / total) * 100;
  if (pct === 100) return { label: "Perfect!", color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-200", icon: "🏆" };
  if (pct >= 80)  return { label: "Excellent!", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: "🎯" };
  if (pct >= 60)  return { label: "Good Job!", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: "👍" };
  if (pct >= 40)  return { label: "Keep Practicing", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: "💪" };
  return { label: "Needs Review", color: "text-rose-600", bg: "bg-rose-50 border-rose-200", icon: "📚" };
}

/* ─── Single Option Button ─────────────────────────────────── */
function OptionButton({ letter, text, state, onClick, disabled }) {
  const base =
    "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left text-sm font-semibold transition-all duration-300 cursor-pointer group";

  const styles = {
    idle:    "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-800 hover:shadow-md hover:-translate-y-0.5",
    correct: "border-emerald-400 bg-emerald-50 text-emerald-800 shadow-md shadow-emerald-100",
    wrong:   "border-rose-400 bg-rose-50 text-rose-800 shadow-md shadow-rose-100",
    missed:  "border-emerald-300 bg-emerald-50/60 text-emerald-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[state]} ${disabled ? "cursor-default" : ""}`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black border-2 transition-all duration-300 ${
          state === "correct"
            ? "border-emerald-500 bg-emerald-500 text-white"
            : state === "wrong"
            ? "border-rose-500 bg-rose-500 text-white"
            : state === "missed"
            ? "border-emerald-400 bg-emerald-100 text-emerald-700"
            : "border-slate-300 bg-white text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600"
        }`}
      >
        {letter}
      </span>
      <span className="flex-1 leading-snug">{text}</span>
      {state === "correct" && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
      {state === "wrong"   && <XCircle       className="h-5 w-5 text-rose-500 shrink-0" />}
    </button>
  );
}

/* ─── Score Summary Card ───────────────────────────────────── */
function ScoreCard({ score, total, onRetry }) {
  const grade = getGrade(score, total);
  const pct   = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col items-center gap-6 py-4 animate-fade-in">
      {/* Trophy Ring */}
      <div className="relative">
        <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 shadow-xl ${grade.bg.replace("border-", "border-")} ${grade.bg}`}>
          <span className="text-3xl leading-none mb-1">{grade.icon}</span>
          <p className={`text-2xl font-black ${grade.color}`}>{pct}%</p>
        </div>
        {/* Sparkle badge */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
          <Star className="h-4 w-4 text-white fill-current" />
        </div>
      </div>

      {/* Grade label */}
      <div className="text-center space-y-1">
        <p className={`text-2xl font-black ${grade.color}`}>{grade.label}</p>
        <p className="text-sm text-slate-500 font-medium">
          You got <span className="font-black text-slate-700">{score}</span> out of{" "}
          <span className="font-black text-slate-700">{total}</span> questions correct
        </p>
      </div>

      {/* Score breakdown pills */}
      <div className="flex gap-3 flex-wrap justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> {score} Correct
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-full text-xs font-bold text-rose-700">
          <XCircle className="h-3.5 w-3.5" /> {total - score} Wrong
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
          <Trophy className="h-3.5 w-3.5" /> {pct}% Score
        </span>
      </div>

      {/* Retry Button */}
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" />
        Retry Quiz
      </button>
    </div>
  );
}

/* ─── Main QuizSection ─────────────────────────────────────── */
export default function QuizSection({ quiz }) {
  const [currentIdx, setCurrentIdx]     = useState(0);
  const [selectedMap, setSelectedMap]   = useState({});   // { qIdx: optionText }
  const [submittedIdx, setSubmittedIdx] = useState(null); // which q has been confirmed
  const [showResult, setShowResult]     = useState(false);
  const [score, setScore]               = useState(0);
  const [animating, setAnimating]       = useState(false);

  // Guard: no quiz data
  if (!quiz || quiz.length === 0) return null;

  const current       = quiz[currentIdx];
  const isLastQ       = currentIdx === quiz.length - 1;
  const selectedNow   = selectedMap[currentIdx];
  const isSubmitted   = submittedIdx === currentIdx;
  const isCorrectNow  = isSubmitted && selectedNow === current.correctAnswer;

  /* Option state for styling */
  function optionState(opt) {
    if (!isSubmitted) return "idle";
    if (opt === current.correctAnswer)     return "correct";
    if (opt === selectedNow)               return "wrong";
    return "idle";
  }

  /* Submit current answer */
  function handleSubmit() {
    if (!selectedNow || isSubmitted) return;
    setSubmittedIdx(currentIdx);
    if (selectedNow === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  }

  /* Navigate to next question */
  function goNext() {
    if (animating) return;
    if (isLastQ) {
      setShowResult(true);
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrentIdx((i) => i + 1);
      setSubmittedIdx(null);
      setAnimating(false);
    }, 200);
  }

  /* Navigate to prev question */
  function goPrev() {
    if (animating || currentIdx === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIdx((i) => i - 1);
      setSubmittedIdx(null);
      setAnimating(false);
    }, 200);
  }

  /* Retry full quiz */
  function handleRetry() {
    setCurrentIdx(0);
    setSelectedMap({});
    setSubmittedIdx(null);
    setShowResult(false);
    setScore(0);
    setAnimating(false);
  }

  /* Progress bar width */
  const progressPct = ((currentIdx + (isSubmitted ? 1 : 0)) / quiz.length) * 100;

  return (
    <section className="bg-white border border-[#c3c6d7]/20 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#0b1c30] flex items-center gap-2">
          <Brain className="h-5 w-5 text-violet-600" />
          Knowledge Quiz
          <span className="ml-1 px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-black rounded-full border border-violet-100 uppercase tracking-wider">
            {quiz.length} Questions
          </span>
        </h3>
        {!showResult && (
          <span className="text-xs font-bold text-slate-400">
            {currentIdx + 1} / {quiz.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!showResult && (
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* ── Score Summary ── */}
      {showResult ? (
        <ScoreCard score={score} total={quiz.length} onRetry={handleRetry} />
      ) : (
        <div
          className={`space-y-5 transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
        >
          {/* Question Card */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-100 rounded-2xl p-5 space-y-1">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#004ac6] text-white text-[11px] font-black mt-0.5">
                {currentIdx + 1}
              </span>
              <p className="text-sm font-bold text-[#0b1c30] leading-relaxed">{current.question}</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {current.options.map((opt, i) => {
              const letters = ["A", "B", "C", "D", "E"];
              return (
                <OptionButton
                  key={i}
                  letter={letters[i] || String(i + 1)}
                  text={opt}
                  state={optionState(opt)}
                  disabled={isSubmitted}
                  onClick={() => {
                    if (!isSubmitted) {
                      setSelectedMap((prev) => ({ ...prev, [currentIdx]: opt }));
                    }
                  }}
                />
              );
            })}
          </div>

          {/* Feedback / Explanation (after submit) */}
          {isSubmitted && (
            <div
              className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium leading-relaxed animate-slide-up ${
                isCorrectNow
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
              }`}
            >
              <span className="shrink-0 text-lg">{isCorrectNow ? "✅" : "❌"}</span>
              <div className="space-y-1">
                <p className="font-black">
                  {isCorrectNow ? "Correct!" : `Incorrect — The answer is: "${current.correctAnswer}"`}
                </p>
                {current.explanation && (
                  <div className="flex items-start gap-1.5 mt-2">
                    <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <p className="text-xs font-semibold opacity-80">{current.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1 gap-3">
            {/* Back */}
            <button
              onClick={goPrev}
              disabled={currentIdx === 0 || animating}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex gap-2">
              {/* Submit answer */}
              {!isSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedNow}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-300/30 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
                >
                  <Target className="h-4 w-4" />
                  Submit Answer
                </button>
              )}

              {/* Next / Finish */}
              {isSubmitted && (
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-md shadow-blue-300/30 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  {isLastQ ? (
                    <>
                      <Sparkles className="h-4 w-4" /> View Results
                    </>
                  ) : (
                    <>
                      Next <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Question dot navigation */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {quiz.map((_, i) => {
              const answered = selectedMap[i] !== undefined;
              const correct  = answered && selectedMap[i] === quiz[i].correctAnswer;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!animating) {
                      setAnimating(true);
                      setTimeout(() => {
                        setCurrentIdx(i);
                        setSubmittedIdx(null);
                        setAnimating(false);
                      }, 150);
                    }
                  }}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIdx
                      ? "w-6 h-2.5 bg-[#004ac6]"
                      : answered
                      ? correct
                        ? "w-2.5 h-2.5 bg-emerald-400"
                        : "w-2.5 h-2.5 bg-rose-400"
                      : "w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300"
                  }`}
                  title={`Question ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
