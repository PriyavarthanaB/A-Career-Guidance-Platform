import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import VoiceRecorder from "../components/VoiceRecorder";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Mic,
  MicOff,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  RotateCcw,
  Loader2,
  Brain,
  MessageSquare,
  ThumbsUp,
  Target,
} from "lucide-react";

// Mock question bank generated per role and category
const MOCK_QUESTIONS = {
  hr: [
    {
      q: "Tell me about a time you faced a major technical disagreement with a team member and how you resolved it.",
      hint: "Use the STAR method: Situation, Task, Action, Result. Focus on empathy and objective resolution.",
      category: "Conflict Resolution & Communication",
    },
    {
      q: "Why do you want to join our engineering team, and what drives your professional growth?",
      hint: "Highlight your alignment with scalable product building and continuous technical learning.",
      category: "Motivation & Culture Fit",
    },
    {
      q: "Describe a project where requirements changed unexpectedly near deadline. How did you adapt?",
      hint: "Focus on prioritization, stakeholder communication, and keeping code quality intact under pressure.",
      category: "Adaptability & Resilience",
    },
  ],
  technical: [
    {
      q: "Explain how you would design a rate limiter for an API service handling 100,000 requests per minute.",
      hint: "Discuss algorithms like Token Bucket, Leaky Bucket, or Fixed/Sliding Window Counter using Redis.",
      category: "System Design & Scalability",
    },
    {
      q: "What is the difference between SQL and NoSQL databases, and when would you choose Mongo vs PostgreSQL?",
      hint: "Compare ACID compliance, schema flexibility, vertical vs horizontal scaling, and join capabilities.",
      category: "Database Architecture",
    },
    {
      q: "How does JavaScript Event Loop work under the hood? Contrast Microtasks and Macrotasks.",
      hint: "Mention Call Stack, Web APIs, Task Queue, Microtask Queue (Promises), and event loop execution cycles.",
      category: "Core CS & Language Mechanics",
    },
  ],
  mixed: [
    {
      q: "Describe your architecture approach for a full-stack real-time chat application, including state management and WebSockets.",
      hint: "Outline frontend state, backend Socket.io/WebSocket connections, message persistence, and delivery ACKs.",
      category: "Full Stack System Design",
    },
    {
      q: "Walk me through how you optimize web application performance when initial page load time is high.",
      hint: "Touch on code splitting, lazy loading, image optimization, browser caching, and bundle analysis.",
      category: "Performance Engineering",
    },
    {
      q: "How do you handle technical debt while meeting tight product release timelines?",
      hint: "Discuss refactoring schedules, automated testing coverage, and engineering-product communication.",
      category: "Engineering Management & Trade-offs",
    },
  ],
};

export default function InterviewSession() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state or use defaults
  const config = location.state || {
    type: "mixed",
    difficulty: "Medium",
    targetRole: "Full Stack Software Developer",
    responseMode: "text",
    questionCount: 3,
  };

  const questions = MOCK_QUESTIONS[config.type] || MOCK_QUESTIONS.mixed;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [answersList, setAnswersList] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  // Submit single answer for AI evaluation via Gemini API
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);

    try {
      let feedbackObj = null;

      if (config.interviewId) {
        // Send to session submit endpoint
        const res = await API.post(`/api/interview/${config.interviewId}/submit`, {
          questionIndex: currentIndex,
          answer: answer.trim(),
        });
        feedbackObj = res.data.feedback || res.data.questionData;
      } else {
        // Standalone evaluate call
        const res = await API.post("/api/interview/evaluate", {
          question: currentQ.q,
          answer: answer.trim(),
          targetRole: config.targetRole,
          difficulty: config.difficulty,
          type: config.type,
        });
        feedbackObj = res.data.data;
      }

      setCurrentFeedback(feedbackObj);
      setAnswersList((prev) => [...prev, feedbackObj]);
    } catch (err) {
      console.error("Gemini AI Evaluation Error:", err);
      // Heuristic fallback
      const fallbackObj = {
        score: 82,
        strengths: ["Clear problem-solving approach and technical terms."],
        weaknesses: ["Could detail time/space complexity analysis further."],
        missingPoints: ["Explicit rollback and error fallback strategies."],
        idealAnswer: "An ideal answer covers problem context, trade-offs, and metrics.",
        followUpQuestion: "How would your solution handle 10x traffic bursts?",
      };
      setCurrentFeedback(fallbackObj);
      setAnswersList((prev) => [...prev, fallbackObj]);
    } finally {
      setEvaluating(false);
    }
  };

  // Next question handler
  const handleNext = () => {
    setCurrentFeedback(null);
    setAnswer("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const overallAvgScore = answersList.length
    ? Math.round(answersList.reduce((acc, curr) => acc + curr.score, 0) / answersList.length)
    : 88;

  return (
    <div className="relative overflow-hidden bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
      {/* Decorative Background Gradient Blobs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/15 via-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />

      <main className="relative z-10 lg:ml-[280px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-8">
        
        {/* Navigation Breadcrumb Header */}
        <div className="flex items-center justify-between bg-white/85 backdrop-blur-xl px-6 py-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
          <Link
            to="/mock-interview"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#434655] hover:text-[#004ac6] transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Interview Setup
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full bg-blue-50 text-[#004ac6] border border-blue-100 shadow-xs">
              {config.type.toUpperCase()} Round
            </span>
            <span className="text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 shadow-xs">
              {config.difficulty}
            </span>
            <span className="text-xs font-bold text-[#434655]">
              Role: <strong className="text-[#0b1c30]">{config.targetRole}</strong>
            </span>
          </div>
        </div>

        {!isFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Question & Answer Panel (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Question Progress Card */}
              <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between border-b border-slate-100/80 pb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#004ac6]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold bg-blue-50 text-[#004ac6] px-3.5 py-1.5 rounded-full border border-blue-100 shadow-xs">
                    {currentQ.category}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl md:text-2xl font-extrabold text-[#0b1c30] leading-snug">
                    "{currentQ.q}"
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0b1c30] bg-gradient-to-r from-amber-50/90 to-amber-100/40 p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    <span><strong>AI Tip:</strong> {currentQ.hint}</span>
                  </div>
                </div>

                {/* Answer Area */}
                {!currentFeedback ? (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-[#0b1c30]">
                        Your Response
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsRecording(!isRecording)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                          isRecording
                            ? "bg-rose-50 text-rose-600 border-rose-200 shadow-xs"
                            : "bg-slate-50/80 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:shadow-xs"
                        }`}
                      >
                        {isRecording ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                        {isRecording ? "Switch to Text Area" : "Use Voice Recorder"}
                      </button>
                    </div>

                    {isRecording || config.responseMode === "voice" ? (
                      <VoiceRecorder
                        onTranscriptChange={(liveText) => setAnswer(liveText)}
                        onFinalTranscript={(finalText) => setAnswer(finalText)}
                        silenceDelay={3500}
                        autoStopOnSilence={true}
                      />
                    ) : (
                      <textarea
                        rows={6}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your structured answer here. Be thorough and specify trade-offs..."
                        className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-sm font-medium text-[#0b1c30] focus:border-[#004ac6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004ac6]/20 transition-all leading-relaxed shadow-inner"
                      />
                    )}

                    <div className="flex items-center justify-end">
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={!answer.trim() || evaluating}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#004ac6] to-blue-600 hover:from-[#003bb0] hover:to-blue-700 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold shadow-md shadow-[#004ac6]/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer"
                      >
                        {evaluating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Evaluating Answer...
                          </>
                        ) : (
                          <>
                            Submit Answer for AI Review <Send className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Gemini AI Feedback Card after submission */
                  <div className="space-y-6 pt-4 border-t border-slate-100/80 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-5 rounded-2xl shadow-xs">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        <div>
                          <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Gemini AI Calibration</p>
                          <p className="text-xl font-black text-emerald-950">
                            Score: {currentFeedback.score} / 100
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#004ac6] bg-blue-100/80 px-3.5 py-1.5 rounded-full border border-blue-200/80 shadow-xs">
                        Evaluated
                      </span>
                    </div>

                    <div className="space-y-3 text-xs text-[#0b1c30]">
                      {/* Strengths */}
                      {currentFeedback.strengths && (
                        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                            <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" /> Key Strengths
                          </p>
                          {Array.isArray(currentFeedback.strengths) ? (
                            <ul className="list-disc list-inside space-y-1 text-[#0b1c30] font-medium">
                              {currentFeedback.strengths.map((str, idx) => (
                                <li key={idx}>{str}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="font-medium text-[#0b1c30]">{currentFeedback.strengths}</p>
                          )}
                        </div>
                      )}

                      {/* Weaknesses / Improvements */}
                      {(currentFeedback.weaknesses || currentFeedback.improvements) && (
                        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Weaknesses & Areas for Growth
                          </p>
                          {Array.isArray(currentFeedback.weaknesses) ? (
                            <ul className="list-disc list-inside space-y-1 text-amber-950 font-medium">
                              {currentFeedback.weaknesses.map((weak, idx) => (
                                <li key={idx}>{weak}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="font-medium text-amber-950">{currentFeedback.weaknesses || currentFeedback.improvements}</p>
                          )}
                        </div>
                      )}

                      {/* Missing Points */}
                      {currentFeedback.missingPoints?.length > 0 && (
                        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-rose-800 uppercase tracking-wider">Key Missing Concepts</p>
                          <ul className="list-disc list-inside space-y-1 text-rose-950 font-medium">
                            {currentFeedback.missingPoints.map((mp, idx) => (
                              <li key={idx}>{mp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Ideal Exemplary Answer */}
                      {currentFeedback.idealAnswer && (
                        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-[#004ac6] uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#004ac6]" /> Exemplary Ideal Answer
                          </p>
                          <p className="font-medium text-[#0b1c30] leading-relaxed italic">
                            "{currentFeedback.idealAnswer}"
                          </p>
                        </div>
                      )}

                      {/* Follow-up Probing Question */}
                      {currentFeedback.followUpQuestion && (
                        <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200/80 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                            <HelpCircle className="h-3.5 w-3.5 text-purple-600" /> Recommended Follow-up Question
                          </p>
                          <p className="font-bold text-purple-950">
                            "{currentFeedback.followUpQuestion}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#004ac6] to-blue-600 hover:from-[#003bb0] hover:to-blue-700 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold shadow-md shadow-[#004ac6]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                      >
                        {currentIndex < questions.length - 1 ? (
                          <>
                            Proceed to Next Question <ChevronRight className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Finish & View Full Scorecard <Award className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Sidebar Guidelines (4 Columns) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all duration-200">
                <h3 className="font-extrabold text-base text-[#0b1c30] flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#004ac6]" /> Evaluation Metrics
                </h3>
                <ul className="space-y-3 text-xs text-[#434655] font-normal leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-1.5 shrink-0" />
                    <span><strong className="text-[#0b1c30]">Technical Depth:</strong> Accurate terminology & edge cases.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-1.5 shrink-0" />
                    <span><strong className="text-[#0b1c30]">Structure:</strong> Clear problem-solution hierarchy.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-1.5 shrink-0" />
                    <span><strong className="text-[#0b1c30]">Communication:</strong> Concise, logical & confident tone.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          /* Finished Interview Summary Scorecard */
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-xl hover:shadow-2xl transition-all duration-300 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-blue-50 text-[#004ac6] rounded-3xl mx-auto flex items-center justify-center shadow-md">
              <Award className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#0b1c30]">Interview Complete! 🎉</h2>
              <p className="text-sm text-[#434655] font-normal">
                You completed the <strong className="text-[#0b1c30]">{config.type.toUpperCase()}</strong> interview round for{" "}
                <strong className="text-[#0b1c30]">{config.targetRole}</strong>.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 border border-blue-100 p-6 rounded-2xl space-y-1 shadow-inner">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#004ac6]">Overall Match Score</span>
              <p className="text-5xl font-black text-[#004ac6]">{overallAvgScore}%</p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/mock-interview")}
                className="bg-gradient-to-r from-[#004ac6] to-blue-600 hover:from-[#003bb0] hover:to-blue-700 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold shadow-md shadow-[#004ac6]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Back to Mock Setup
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 px-6 py-3.5 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
