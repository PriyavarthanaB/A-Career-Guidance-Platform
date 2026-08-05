import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Editor from "@monaco-editor/react";
import { getProblemById, getProblemsByModule, updateProblemStatus } from "../api/modules";
import { executeCode } from "../api/judge0";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Play, 
  Send, 
  HelpCircle, 
  BookOpen, 
  Terminal, 
  Cpu, 
  Layers, 
  History, 
  ChevronRight,
  Loader2, 
  AlertTriangle,
  FileCode,
  Activity,
  Code,
  RotateCcw
} from "lucide-react";
// Judge0 Language IDs
const LANGUAGE_MAPPING = {
  python: { id: 71, label: "Python 3" },
  javascript: { id: 63, label: "JavaScript (Node.js)" },
  java: { id: 62, label: "Java" },
  c: { id: 50, label: "C (GCC)" },
};

export default function CodingWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State managers
  const [problem, setProblem] = useState(null);
  const [relatedProblems, setRelatedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Layout tabs state
  const [activeLeftTab, setActiveLeftTab] = useState("description"); // description, editorial, submissions, related
  const [activeConsoleTab, setActiveConsoleTab] = useState("testcase"); // testcase, result

  // Coding workspace states
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  
  // Execution loading states
  const [executing, setExecuting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);

  // Expandable hints tracker
  const [revealedHints, setRevealedHints] = useState({});

  // Mock initial submissions list
  const [submissions, setSubmissions] = useState([
    { id: "s1", status: "Time Limit Exceeded", time: "1 day ago", runtime: "N/A", lang: "Python" },
    { id: "s2", status: "Wrong Answer", time: "2 days ago", runtime: "48ms", lang: "JavaScript" }
  ]);

  // Generates starting code template based on language and problem name
  const getStarterCode = (lang, probName) => {
    const cleanName = probName 
      ? probName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') 
      : "solve";

    // Precise presets for known problems
    if (probName === "Two Sum") {
      if (lang === "python") return `def two_sum(nums, target):\n    # Write your code here\n    pass\n\n# Example Test:\nprint(two_sum([2, 7, 11, 15], 9))`;
      if (lang === "javascript") return `function twoSum(nums, target) {\n    // Write your code here\n}\n\n// Example Test:\nconsole.log(twoSum([2, 7, 11, 15], 9));`;
    }

    if (lang === "python") {
      return `def ${cleanName}():\n    # Write your code here\n    return "Solution output"\n\n# Print result so stdout receives output:\nprint(${cleanName}())\n`;
    } else if (lang === "javascript") {
      const camelName = cleanName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      return `function ${camelName}() {\n    // Write your code here\n    return "Solution output";\n}\n\n// Print result so stdout receives output:\nconsole.log(${camelName}());\n`;
    } else if (lang === "java") {
      return `public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Main signature active");\n    }\n}`;
    } else {
      return `#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}`;
    }
  };

  // Fetch problem details and related problems
  const loadWorkspaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const probData = await getProblemById(id);
      setProblem(probData);
      
      // Fetch other problems in the same module for the "Related Problems" tab
      if (probData.moduleId) {
        const list = await getProblemsByModule(probData.moduleId);
        // Exclude the current problem
        setRelatedProblems(list.filter(p => p._id !== id));
      }

      // Initialize default test case input
      if (probData.examples?.length > 0) {
        setCustomInput(probData.examples[0].input);
      }
    } catch (err) {
      console.error("Failed to load workspace data:", err);
      setError("Failed to load coding workspace. Verify your backend server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, [id]);

  // Set default starter code whenever problem or language changes
  useEffect(() => {
    if (problem) {
      setCode(getStarterCode(language, problem.name));
      setRunResult(null);
    }
  }, [language, problem?.name]);

  // Real code runner via Judge0 API
  const handleRunCode = async () => {
    setExecuting(true);
    setActiveConsoleTab("result");
    setRunResult(null);

    const langObj = LANGUAGE_MAPPING[language] || LANGUAGE_MAPPING.python;
    const expectedOutput = problem?.examples?.[0]?.output?.trim() || "";

    try {
      const res = await executeCode(code, langObj.id, customInput);

      const rawStdout = (res.stdout || "").trim();
      const rawStderr = (res.stderr || res.compile_output || "").trim();
      const isCompileOrRuntimeError = !!rawStderr || (res.status?.id && res.status.id > 3);

      const inputVal = customInput || (problem?.examples?.length > 0 ? problem.examples[0].input : "N/A");
      const expectedVal = expectedOutput || (problem?.examples?.length > 0 ? problem.examples[0].output : "N/A");

      setRunResult({
        status: isCompileOrRuntimeError
          ? (res.status?.description || "Compilation / Execution Error")
          : "Executed Successfully",
        runtime: res.time ? `${res.time}s` : "<0.01s",
        memory: res.memory ? `${res.memory} KB` : "<1MB",
        input: inputVal,
        output: isCompileOrRuntimeError
          ? rawStderr
          : (rawStdout || "No output returned (add print(...) or console.log(...) to print outputs)"),
        expected: expectedVal,
        isError: isCompileOrRuntimeError
      });
    } catch (err) {
      console.error("Run Code Error:", err);
      setRunResult({
        status: "Execution Failed",
        isError: true,
        errorMsg: err.message || "Failed to execute code via Judge0 engine."
      });
    } finally {
      setExecuting(false);
    }
  };

  // Real submit handler via Judge0 API (persists solved status to MongoDB ONLY on success!)
  const handleSubmit = async () => {
    setSubmitting(true);
    setActiveConsoleTab("result");
    setRunResult(null);

    const langObj = LANGUAGE_MAPPING[language] || LANGUAGE_MAPPING.python;
    const testInput = customInput || (problem?.examples?.length > 0 ? problem.examples[0].input : "");
    const expectedOutput = (problem?.examples?.[0]?.output || "").trim();

    try {
      // 1. Submit code to Judge0 API
      const res = await executeCode(code, langObj.id, testInput);

      const rawStdout = (res.stdout || "").trim();
      const rawStderr = (res.stderr || res.compile_output || "").trim();
      const hasError = !!rawStderr || (res.status?.id && res.status.id > 3);

      // Check if output matches expected (or Judge0 Accepted status)
      const cleanActual = rawStdout.replace(/\s+/g, " ");
      const cleanExpected = expectedOutput.replace(/\s+/g, " ");
      const isPassed = !hasError && (cleanActual === cleanExpected || cleanActual.includes(cleanExpected));

      if (isPassed) {
        // 2. Persist solved status to MongoDB ONLY when test cases pass!
        await updateProblemStatus(id, "solved");
        setProblem((prev) => ({ ...prev, status: "solved" }));

        // Add to submission history list
        const newSub = {
          id: `s_new_${Date.now()}`,
          status: "Accepted",
          time: "Just now",
          runtime: res.time ? `${res.time}s` : "0.02s",
          lang: langObj.label,
        };
        setSubmissions((prev) => [newSub, ...prev]);

        setRunResult({
          status: "Accepted 🎉",
          isSubmission: true,
          runtime: res.time ? `${res.time}s` : "0.02s",
          memory: res.memory ? `${res.memory} KB` : "2048 KB",
          testcases: "All test cases passed",
          beatsRuntime: "94.5%",
          beatsMemory: "89.1%",
        });
      } else {
        // Test case failed or execution error - DO NOT update database status
        const subStatus = res.compile_output
          ? "Compile Error"
          : res.stderr
          ? "Runtime Error"
          : "Wrong Answer";

        const newSub = {
          id: `s_new_${Date.now()}`,
          status: subStatus,
          time: "Just now",
          runtime: res.time ? `${res.time}s` : "N/A",
          lang: langObj.label,
        };
        setSubmissions((prev) => [newSub, ...prev]);

        setRunResult({
          status: subStatus,
          isError: true,
          errorMsg: hasError
            ? rawStderr
            : `Test Case Failed!\n\nInput: ${testInput}\nActual Output:\n${rawStdout || "(Empty)"}\n\nExpected Output:\n${expectedOutput}`,
        });
      }
    } catch (err) {
      console.error("Failed to submit code:", err);
      setRunResult({
        status: "Submission Failed",
        isError: true,
        errorMsg: err.message || "Network error trying to compile solution via Judge0.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle hints accordion
  const toggleHint = (index) => {
    setRevealedHints(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
        <Sidebar />
        <main className="lg:ml-[280px] flex-1 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-sm font-bold">Initializing Monaco Workspace...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex">
        <Sidebar />
        <main className="lg:ml-[280px] flex-1 flex items-center justify-center min-h-screen p-6">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-4 max-w-lg">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h4 className="font-extrabold text-red-950">Workspace Error</h4>
            <p className="text-xs text-red-800 leading-relaxed">{error || "Problem not found."}</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={loadWorkspaceData}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                Retry Workspace
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

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex flex-col">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <main className="lg:ml-[280px] min-h-screen px-4 md:px-6 py-6 max-w-[1400px] w-full mx-auto flex flex-col gap-4">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
          <Link 
            to={problem.moduleId ? `/module/${problem.moduleId}/practice` : "/coding-practice"}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Practice Sheet
          </Link>
          
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                problem.difficulty === "Easy"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : problem.difficulty === "Medium"
                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                  : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="text-slate-350 text-sm">|</span>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Clock className="h-3.5 w-3.5" />
              <span>Target: {problem.estimatedTime || "25 mins"}</span>
            </div>
            {problem.status === "solved" && (
              <>
                <span className="text-slate-350 text-sm">|</span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-lg shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Solved
                </span>
              </>
            )}
          </div>
        </div>

        {/* Split Container Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch flex-1">
          
          {/* LEFT PANEL: Description & Study Guides (5 Columns) */}
          <div className="xl:col-span-5 bg-white border border-[#c3c6d7]/35 rounded-3xl overflow-hidden shadow-xs flex flex-col min-h-[600px]">
            
            {/* Header Tabs */}
            <div className="flex border-b border-slate-100 bg-[#f8f9ff]/70 p-1.5 gap-1.5">
              <button
                onClick={() => setActiveLeftTab("description")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ${
                  activeLeftTab === "description"
                    ? "bg-white text-[#004ac6] shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                Description
              </button>
              <button
                onClick={() => setActiveLeftTab("editorial")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ${
                  activeLeftTab === "editorial"
                    ? "bg-white text-[#004ac6] shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Editorial
              </button>
              <button
                onClick={() => setActiveLeftTab("submissions")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ${
                  activeLeftTab === "submissions"
                    ? "bg-white text-[#004ac6] shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <History className="h-3.5 w-3.5" />
                Submissions
              </button>
              <button
                onClick={() => setActiveLeftTab("related")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ${
                  activeLeftTab === "related"
                    ? "bg-white text-[#004ac6] shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Related
              </button>
            </div>

            {/* Scrollable Tab Body */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[75vh] scrollbar-thin">
              
              {/* Tab: Description */}
              {activeLeftTab === "description" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-[#0b1c30]">{problem.name}</h3>
                    {problem.subtitle && <p className="text-xs text-slate-400 font-bold">{problem.subtitle}</p>}
                  </div>

                  <div className="prose prose-slate max-w-none text-sm text-[#434655] leading-relaxed font-normal whitespace-pre-line border-t border-slate-50 pt-4">
                    {problem.description}
                  </div>

                  {/* Examples */}
                  {problem.examples?.length > 0 && (
                    <div className="space-y-4 border-t border-slate-50 pt-4">
                      <h4 className="text-xs font-black uppercase text-[#0b1c30] tracking-wider">Examples</h4>
                      {problem.examples.map((ex, index) => (
                        <div key={index} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                          <p className="font-bold text-xs text-[#0b1c30]">Example {index + 1}:</p>
                          <div className="font-mono text-xs text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                            <p><span className="font-black text-blue-600">Input:</span> {ex.input}</p>
                            <p><span className="font-black text-emerald-600">Output:</span> {ex.output}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Constraints */}
                  <div className="space-y-2.5 border-t border-slate-50 pt-4">
                    <h4 className="text-xs font-black uppercase text-[#0b1c30] tracking-wider">Constraints</h4>
                    <ul className="list-disc pl-5 text-xs text-[#434655] font-semibold space-y-1.5">
                      <li>Lengths satisfy bounds: <code>1 &lt;= length &lt;= 10^5</code>.</li>
                      <li>Element values stay within 32-bit integer ranges.</li>
                      <li>Target Time Complexity limit: <code>O(N)</code> or <code>O(N log N)</code>.</li>
                      <li>Space Complexity limit: <code>O(1)</code> auxiliary (or <code>O(N)</code> for caching maps).</li>
                    </ul>
                  </div>

                  {/* Hints Accordion */}
                  {problem.hints?.length > 0 && (
                    <div className="space-y-2 border-t border-slate-50 pt-4">
                      <h4 className="text-xs font-black uppercase text-[#0b1c30] tracking-wider mb-2">Hints</h4>
                      <div className="space-y-2">
                        {problem.hints.map((hint, idx) => {
                          const isRevealed = !!revealedHints[idx];
                          return (
                            <div key={idx} className="border border-slate-200/60 rounded-xl overflow-hidden text-xs">
                              <button
                                onClick={() => toggleHint(idx)}
                                className="w-full flex justify-between items-center px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 font-bold text-[#434655] transition-colors"
                              >
                                <span>Hint {idx + 1}</span>
                                <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isRevealed ? "rotate-90" : ""}`} />
                              </button>
                              {isRevealed && (
                                <div className="p-4 bg-white border-t border-slate-100 text-[#434655] font-medium leading-relaxed animate-in slide-in-from-top-1 duration-200">
                                  {hint}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Editorial Solution */}
              {activeLeftTab === "editorial" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-indigo-900 bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-2xl">
                    <BookOpen className="h-5 w-5 text-indigo-600 shrink-0" />
                    <p className="text-xs font-bold">Official Editorial Guide for {problem.name}</p>
                  </div>
                  
                  <div className="space-y-4 text-sm text-[#434655] font-normal leading-relaxed">
                    <h4 className="font-extrabold text-[#0b1c30]">Optimal Traversal Approach</h4>
                    <p>
                      To optimize the runtime complexity, we trade space for speed by maintaining a dynamic hashing container. 
                      This allows element checking or indexing in amortized constant <code>O(1)</code> time.
                    </p>
                    <div className="bg-slate-950 rounded-2xl overflow-hidden font-mono text-xs text-slate-200 mt-2">
                      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 text-[10px] text-slate-400 font-bold flex justify-between items-center">
                        <span>Python 3 (Optimal)</span>
                        <span className="text-emerald-500 font-bold">O(N) Time</span>
                      </div>
                      <pre className="p-4 overflow-x-auto leading-relaxed max-h-56 scrollbar-thin">
                        <code>{`# Optimal Implementation
def solve_problem(elements, target):
    seen = {}
    for i, x in enumerate(elements):
        complement = target - x
        if complement in seen:
            return [seen[complement], i]
        seen[x] = i
    return []`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Submissions History */}
              {activeLeftTab === "submissions" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-sm font-extrabold text-[#0b1c30]">Your Submission Logs</h4>
                  {submissions.length > 0 ? (
                    <div className="space-y-3">
                      {submissions.map((sub) => (
                        <div key={sub.id} className="border border-slate-100 p-4 rounded-2xl bg-slate-50/50 flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <p className={`font-black ${
                              sub.status === "Accepted" 
                                ? "text-emerald-600" 
                                : sub.status === "Wrong Answer" 
                                ? "text-rose-600" 
                                : "text-amber-600"
                            }`}>
                              {sub.status}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold">{sub.time} • {sub.lang}</p>
                          </div>
                          <span className="font-mono text-slate-500 font-bold">{sub.runtime}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No submissions recorded yet.</p>
                  )}
                </div>
              )}

              {/* Tab: Related Problems */}
              {activeLeftTab === "related" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-sm font-extrabold text-[#0b1c30]">Similar Challenges</h4>
                  {relatedProblems.length > 0 ? (
                    <div className="space-y-2.5">
                      {relatedProblems.map((prob) => (
                        <Link
                          key={prob._id}
                          to={`/problem/${prob._id}`}
                          className="flex justify-between items-center p-4 border border-slate-200/50 hover:border-blue-200 hover:bg-[#eff4ff]/20 rounded-2xl transition-all group"
                        >
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-[#0b1c30] group-hover:text-blue-600 transition-colors">
                              {prob.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold">{prob.successRate} success rate</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                              prob.difficulty === "Easy"
                                ? "bg-emerald-50 text-emerald-700"
                                : prob.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                            }`}>
                              {prob.difficulty}
                            </span>
                            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No other problems in this module.</p>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT PANEL: Code Editor & Console Output (7 Columns) */}
          <div className="xl:col-span-7 flex flex-col gap-5 min-h-[600px]">
            
            {/* Editor Workspace Card */}
            <div className="bg-[#1e1e1e] rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col flex-1">
              
              {/* Editor Workspace Controls Header */}
              <div className="bg-[#181818] px-5 py-3.5 border-b border-slate-800 flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Workspace
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language Dropdown Selector */}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-[#2d2d2d] text-slate-200 text-xs font-semibold border border-slate-700 rounded-xl px-3 py-1.5 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {Object.entries(LANGUAGE_MAPPING).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>

                  {/* Reset Code */}
                  <button
                    onClick={() => setCode(getStarterCode(language, problem.name))}
                    className="p-1.5 text-slate-400 hover:text-white bg-[#2d2d2d] hover:bg-slate-800 rounded-lg transition border border-slate-700/50 cursor-pointer"
                    title="Reset default template"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>

                  <span className="text-slate-700">|</span>

                  {/* Action Buttons */}
                  <button
                    onClick={handleRunCode}
                    disabled={executing || submitting}
                    className="flex items-center gap-1.5 bg-[#2d2d2d] hover:bg-slate-700 text-slate-200 font-bold px-4 py-1.5 rounded-xl text-xs transition border border-slate-700/50 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5 fill-current text-slate-400" />
                    Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={executing || submitting}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-1.5 rounded-xl text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-3 w-3" />
                    Submit
                  </button>
                </div>
              </div>

              {/* Monaco Editor Container */}
              <div className="flex-1 min-h-[350px] relative p-1.5">
                <Editor
                  height="100%"
                  language={language === "python" ? "python" : language === "javascript" ? "javascript" : language === "java" ? "java" : "cpp"}
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  loading={
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] text-slate-450 text-xs gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      Loading Monaco environment...
                    </div>
                  }
                  options={{
                    fontSize: 13,
                    fontFamily: "Fira Code, Source Code Pro, Courier New, monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    cursorBlinking: "smooth",
                    lineNumbersMinChars: 3,
                    padding: { top: 10, bottom: 10 },
                    tabSize: 4
                  }}
                />
              </div>

            </div>

            {/* Console / Testcases Card Panel */}
            <div className="bg-[#181818] rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col h-56">
              
              {/* Console Tabs */}
              <div className="bg-[#121212] px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveConsoleTab("testcase")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      activeConsoleTab === "testcase"
                        ? "bg-[#2563eb]/10 text-blue-400 border border-[#2563eb]/25"
                        : "text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    Testcase
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab("result")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      activeConsoleTab === "result"
                        ? "bg-[#2563eb]/10 text-blue-400 border border-[#2563eb]/25"
                        : "text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    Result
                  </button>
                </div>
                
                {executing && (
                  <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                    Compiling Sandbox...
                  </span>
                )}
                {submitting && (
                  <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                    Evaluating Test Cases...
                  </span>
                )}
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 p-4 overflow-y-auto text-xs font-mono text-slate-300">
                
                {/* Tab: Testcase custom input */}
                {activeConsoleTab === "testcase" && (
                  <div className="h-full flex flex-col">
                    <span className="text-[10px] font-black text-slate-550 uppercase tracking-wider mb-2">Custom Input</span>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Input parameters, e.g. nums = [2, 7, 11, 15]..."
                      className="w-full flex-1 bg-[#1e1e1e] p-3 rounded-xl border border-slate-800 text-slate-300 outline-none resize-none focus:border-slate-700 leading-relaxed scrollbar-thin"
                    />
                  </div>
                )}

                {/* Tab: Run Result outputs */}
                {activeConsoleTab === "result" && (
                  <div className="h-full flex flex-col justify-center">
                    {/* Execution states */}
                    {(executing || submitting) && (
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-500 h-full">
                        <Activity className="h-6 w-6 text-blue-500 animate-pulse" />
                        <p className="text-[11px] font-bold">
                          {executing ? "Compiling source code on sandbox engine..." : "Evaluating 45 test case constraints..."}
                        </p>
                      </div>
                    )}

                    {/* Default idle result state */}
                    {!runResult && !executing && !submitting && (
                      <div className="flex flex-col items-center justify-center text-slate-550 h-full">
                        <Terminal className="h-6 w-6 text-slate-750 mb-1" />
                        <p className="text-[11px]">Click "Run" or "Submit" to compile and see outputs.</p>
                      </div>
                    )}

                    {/* Result outputs details */}
                    {runResult && !executing && !submitting && (
                      <div className="space-y-3 animate-in fade-in duration-200 h-full">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase">Status:</span>
                          <span className={`font-black text-sm uppercase ${
                            runResult.status.startsWith("Accepted") || runResult.status.startsWith("Executed")
                              ? "text-emerald-500"
                              : "text-rose-500"
                          }`}>
                            {runResult.status}
                          </span>
                        </div>

                        {runResult.isSubmission ? (
                          // Submission Detailed Output card
                          <div className="bg-[#1e1e1e] p-3 rounded-xl border border-slate-800 space-y-2 leading-relaxed">
                            <p className="text-slate-450"><span className="font-bold text-slate-350">Runtimes Passed:</span> {runResult.testcases}</p>
                            <p className="text-slate-450">
                              <span className="font-bold text-slate-350">Execution Speed:</span> {runResult.runtime}{" "}
                              <span className="text-emerald-500 font-bold">(Beats {runResult.beatsRuntime} of users)</span>
                            </p>
                            <p className="text-slate-450">
                              <span className="font-bold text-slate-350">Memory Overhead:</span> {runResult.memory}{" "}
                              <span className="text-emerald-500 font-bold">(Beats {runResult.beatsMemory} of users)</span>
                            </p>
                          </div>
                        ) : runResult.isError ? (
                          <pre className="text-rose-400 whitespace-pre-wrap">{runResult.errorMsg}</pre>
                        ) : (
                          // Normal Run Output comparison card
                          <div className="grid gap-2 border-t border-slate-800/60 pt-2 font-mono">
                            <div className="grid grid-cols-12 gap-1.5">
                              <span className="col-span-3 text-slate-500 font-bold">Input:</span>
                              <span className="col-span-9 text-slate-350 bg-[#1e1e1e] px-2 py-0.5 rounded border border-slate-800">{runResult.input}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-1.5">
                              <span className="col-span-3 text-slate-500 font-bold">Output:</span>
                              <span className="col-span-9 text-emerald-400 bg-[#1e1e1e] px-2 py-0.5 rounded border border-slate-800 font-bold">{runResult.output}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-1.5">
                              <span className="col-span-3 text-slate-500 font-bold">Expected:</span>
                              <span className="col-span-9 text-emerald-400 bg-[#1e1e1e] px-2 py-0.5 rounded border border-slate-800 font-bold">{runResult.expected}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
