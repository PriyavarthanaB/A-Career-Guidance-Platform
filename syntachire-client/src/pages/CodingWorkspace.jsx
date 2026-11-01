import React, { useState, useEffect } from "react";
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
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  XCircle,
  Zap,
  Code2
} from "lucide-react";

// Judge0 Language IDs
const LANGUAGE_MAPPING = {
  python: { id: 71, label: "Python 3", monaco: "python" },
  javascript: { id: 63, label: "JavaScript (Node.js)", monaco: "javascript" },
  java: { id: 62, label: "Java (OpenJDK 13)", monaco: "java" },
  cpp: { id: 54, label: "C++ (GCC 9.2.0)", monaco: "cpp" },
  c: { id: 50, label: "C (GCC 9.2.0)", monaco: "c" },
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
  const [activeSolutionLang, setActiveSolutionLang] = useState("python");
  const [activeTestcaseTab, setActiveTestcaseTab] = useState(0); // index of selected testcase result

  // Mobile layout state
  const [activeMainTab, setActiveMainTab] = useState("problem"); // problem, editor

  // Coding workspace states
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  
  // Execution loading states
  const [executing, setExecuting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Expandable hints tracker
  const [revealedHints, setRevealedHints] = useState({});

  // Submissions list state
  const [submissions, setSubmissions] = useState([]);

  // Generates clean, minimal LeetCode-style starter code for the editor
  const getStarterCode = (lang, prob) => {
    if (!prob) return "";

    const probName = prob.name || "";
    const cleanName = probName 
      ? probName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') 
      : "solve";
    const camelName = cleanName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

    if (lang === "python") {
      return `def ${camelName}(s):
    # Write your solution code here
    pass
`;
    } else if (lang === "javascript") {
      return `function ${camelName}(s) {
    // Write your solution code here
}
`;
    } else if (lang === "java") {
      return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your solution code here
        System.out.println("Output");
    }
}
`;
    } else if (lang === "cpp") {
      return `#include <iostream>
using namespace std;

int main() {
    // Write your solution code here
    cout << "Output" << endl;
    return 0;
}
`;
    } else {
      return `#include <stdio.h>

int main() {
    // Write your solution code here
    printf("Output\\n");
    return 0;
}
`;
    }
  };

  // Prepares execution code behind the scenes for Judge0 API
  const wrapCodeForExecution = (userCode, langKey, prob) => {
    if (!prob) return userCode;
    const probName = prob.name || "";
    const cleanName = probName 
      ? probName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') 
      : "solve";
    const camelName = cleanName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

    if (langKey === "python") {
      if (userCode.includes("__main__") || userCode.includes(`print(`)) {
        return userCode;
      }
      return `${userCode}

import sys, json
if __name__ == "__main__":
    raw_input = sys.stdin.read().strip()
    if raw_input:
        try:
            val = json.loads(raw_input)
        except Exception:
            val = raw_input
        res = ${camelName}(val)
        if res is not None:
            print(res)
`;
    }

    if (langKey === "javascript") {
      if (userCode.includes("fs.readFileSync") || userCode.includes(`console.log(`)) {
        return userCode;
      }
      return `${userCode}

const fs = require('fs');
const rawInput = fs.readFileSync(0, 'utf-8').trim();
if (rawInput) {
    let val;
    try { val = JSON.parse(rawInput); } catch(e) { val = rawInput; }
    const res = ${camelName}(val);
    if (res !== undefined) console.log(res);
}
`;
    }

    return userCode;
  };

  const isPlaceholderExample = (value) => {
    if (!value || typeof value !== "string") return true;
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "" ||
      normalized === "n/a" ||
      normalized === "not available" ||
      normalized.includes("see problem statement") ||
      normalized.includes("see expected") ||
      normalized.includes("see output") ||
      normalized.includes("see input") ||
      normalized.includes("placeholder")
    );
  };

  const getExampleInput = (example) => {
    return example && !isPlaceholderExample(example.input) ? example.input : "";
  };

  const getExampleOutput = (example) => {
    return example && !isPlaceholderExample(example.output) ? example.output : "";
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
        setRelatedProblems(list.filter(p => p._id !== id));
      }

      // Initialize default testcase input with sample 1
      const firstExample = probData.examples?.[0];
      setCustomInput(getExampleInput(firstExample));
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
      setCode(getStarterCode(language, problem));
      setRunResult(null);
    }
  }, [language, problem?.name]);

  // Real code runner via Judge0 API
  const handleRunCode = async () => {
    setExecuting(true);
    setActiveConsoleTab("result");
    setRunResult(null);

    const langObj = LANGUAGE_MAPPING[language] || LANGUAGE_MAPPING.python;
    const example = problem?.examples?.[0];
    const defaultInput = getExampleInput(example);
    const expectedOutput = getExampleOutput(example);
    const codeToRun = wrapCodeForExecution(code, language, problem);

    const isCustomInputDifferent = 
      customInput && 
      defaultInput && 
      customInput.trim().replace(/\s+/g, '') !== defaultInput.trim().replace(/\s+/g, '');

    try {
      const res = await executeCode(codeToRun, langObj.id, customInput);

      const rawStdout = (res.stdout || "").trim();
      const rawStderr = (res.stderr || res.compile_output || "").trim();
      const isCompileOrRuntimeError = !!rawStderr || (res.status?.id && res.status.id > 3);

      const inputVal = customInput || defaultInput || "N/A";
      
      let expectedVal = "N/A";
      let hasExpected = false;

      if (!isCustomInputDifferent && expectedOutput) {
        expectedVal = expectedOutput;
        hasExpected = true;
      } else if (isCustomInputDifferent) {
        expectedVal = "(Custom test input — evaluate actual output above)";
        hasExpected = false;
      }

      // Check if actual output matches sample expected output (case-insensitive for booleans True/false)
      const cleanActual = rawStdout.replace(/\s+/g, " ").toLowerCase();
      const cleanExpected = expectedOutput ? expectedOutput.replace(/\s+/g, " ").toLowerCase() : "";
      const matchesExpected = hasExpected && !isCompileOrRuntimeError && cleanActual === cleanExpected;

      let statusMsg = "Executed Successfully";
      if (isCompileOrRuntimeError) {
        statusMsg = res.status?.description || "Compilation / Execution Error";
      } else if (hasExpected) {
        statusMsg = matchesExpected ? "Passed 🎉 (Output Matches)" : "Executed (Output Mismatch)";
      }

      setRunResult({
        status: statusMsg,
        runtime: res.time ? `${res.time}s` : "<0.01s",
        memory: res.memory ? `${res.memory} KB` : "<1MB",
        input: inputVal,
        output: isCompileOrRuntimeError
          ? rawStderr
          : (rawStdout || "No output returned (add print(...) or console.log(...) to print output)"),
        expected: expectedVal,
        isError: isCompileOrRuntimeError,
        hasExpected
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

  // Real submit handler via Judge0 API — runs ALL testcases for the problem!
  const handleSubmit = async () => {
    setSubmitting(true);
    setActiveConsoleTab("result");
    setRunResult(null);
    setActiveTestcaseTab(0);

    const langObj = LANGUAGE_MAPPING[language] || LANGUAGE_MAPPING.python;
    const examples = problem?.examples || [];
    const codeToRun = wrapCodeForExecution(code, language, problem);

    if (!examples || examples.length === 0) {
      setRunResult({
        status: "No Testcases Defined",
        isError: true,
        errorMsg: "This problem does not have testcases defined."
      });
      setSubmitting(false);
      return;
    }

    const testResults = [];
    let allPassed = true;
    let firstErrorMsg = null;

    try {
      for (let i = 0; i < examples.length; i++) {
        const ex = examples[i];
        const testInput = getExampleInput(ex);
        const expectedOutput = getExampleOutput(ex);

        const res = await executeCode(codeToRun, langObj.id, testInput);

        const rawStdout = (res.stdout || "").trim();
        const rawStderr = (res.stderr || res.compile_output || "").trim();
        const hasError = !!rawStderr || (res.status?.id && res.status.id > 3);

        // Normalize case for boolean comparison (True/False vs true/false)
        const cleanActual = rawStdout.replace(/\s+/g, " ").toLowerCase();
        const cleanExpected = expectedOutput ? expectedOutput.replace(/\s+/g, " ").toLowerCase() : "";
        
        const isPassed = expectedOutput
          ? !hasError && (cleanActual === cleanExpected || cleanActual.includes(cleanExpected))
          : !hasError;

        if (!isPassed) {
          allPassed = false;
          if (hasError && !firstErrorMsg) {
            firstErrorMsg = rawStderr || res.status?.description;
          }
        }

        testResults.push({
          index: i + 1,
          input: testInput || "N/A",
          expected: expectedOutput || "N/A",
          actual: hasError ? (rawStderr || "Execution Error") : (rawStdout || "(Empty Output)"),
          passed: isPassed,
          error: hasError
        });
      }

      const passedCount = testResults.filter(t => t.passed).length;
      const totalCount = testResults.length;

      if (allPassed) {
        // Persist solved status to MongoDB Atlas for authenticated user!
        await updateProblemStatus(id, "solved");
        setProblem((prev) => ({ ...prev, status: "solved" }));

        const newSub = {
          id: `s_new_${Date.now()}`,
          status: "Accepted",
          time: "Just now",
          runtime: "0.02s",
          memory: "1840 KB",
          lang: langObj.label,
        };
        setSubmissions((prev) => [newSub, ...prev]);

        setRunResult({
          status: `Accepted 🎉 (${passedCount}/${totalCount} Passed)`,
          isSubmission: true,
          testcaseResults: testResults,
          passedCount,
          totalCount,
          runtime: "0.02s",
          memory: "1840 KB",
          beatsRuntime: "96.2%",
          beatsMemory: "91.4%"
        });
      } else {
        const subStatus = firstErrorMsg ? "Runtime / Compile Error" : "Wrong Answer";

        const newSub = {
          id: `s_new_${Date.now()}`,
          status: `${subStatus} (${passedCount}/${totalCount})`,
          time: "Just now",
          runtime: "N/A",
          lang: langObj.label,
        };
        setSubmissions((prev) => [newSub, ...prev]);

        setRunResult({
          status: `${subStatus} (${passedCount}/${totalCount} Passed)`,
          isSubmission: true,
          isError: true,
          testcaseResults: testResults,
          passedCount,
          totalCount,
          errorMsg: firstErrorMsg
        });
      }
    } catch (err) {
      console.error("Failed to submit code:", err);
      setRunResult({
        status: "Submission Failed",
        isError: true,
        errorMsg: err.message || "Network error executing solution via Judge0 API.",
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

  const copySolutionCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-[#070f1e] text-slate-100 min-h-screen font-sans flex relative overflow-hidden">
        <div className="pointer-events-none absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#004ac6]/15 rounded-full blur-[140px]" />
        <Sidebar />
        <main className="lg:ml-[280px] flex-1 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4 text-slate-500 bg-slate-900/70 p-8 rounded-3xl border border-slate-800 backdrop-blur-2xl shadow-2xl">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-[#004ac6] animate-spin" />
              <div className="absolute inset-0 rounded-full bg-[#004ac6]/20 blur-md animate-pulse" />
            </div>
            <p className="text-base font-bold text-white tracking-wide">Initializing Monaco IDE Environment...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="bg-[#f4f7ff] text-slate-900 min-h-screen font-sans flex relative overflow-hidden">
        <Sidebar />
        <main className="lg:ml-[280px] flex-1 flex items-center justify-center min-h-screen p-6">
          <div className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-8 text-center space-y-5 max-w-lg shadow-2xl shadow-rose-950/20 backdrop-blur-2xl">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h4 className="font-extrabold text-xl text-slate-900">Workspace Initialization Error</h4>
            <p className="text-sm text-rose-300/90 leading-relaxed">{error || "Problem details not found."}</p>
            <div className="flex justify-center gap-3 pt-2">
              <button 
                onClick={loadWorkspaceData}
                className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
              >
                Retry Workspace
              </button>
              <Link 
                to="/coding-hub"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold px-6 py-3 rounded-xl transition"
              >
                Back to Problem Sheet
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const solutionObj = problem.solution || {};

  return (
    <div className="bg-[#f4f7ff] text-slate-900 min-h-screen font-sans flex flex-col relative">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[160px]" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px]" />

      <Sidebar />

      {/* Main Workspace Frame */}
      <main className="lg:ml-[260px] pl-14 lg:pl-0 min-h-screen px-3 md:px-6 py-5 max-w-[1440px] w-full mx-auto flex flex-col gap-4 relative z-10">
        
        {/* Top Breadcrumb & High-Tech Status Header */}
        <div className="flex flex-wrap items-center justify-between bg-white/95 backdrop-blur-xl px-5 py-3 rounded-2xl border border-slate-200/80 shadow-sm gap-3">
          <Link 
            to={problem.moduleId ? `/coding-hub?module=${problem.moduleId}` : "/coding-hub"}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#004ac6] transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Problem Sheet
          </Link>
          
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-xs ${
                problem.difficulty === "Easy"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                  : problem.difficulty === "Medium"
                  ? "bg-amber-50 text-amber-700 border border-amber-200/80"
                  : "bg-rose-50 text-rose-700 border border-rose-200/80"
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="text-slate-300 text-sm">|</span>
            <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
              <Clock className="h-3.5 w-3.5 text-[#004ac6]" />
              <span>Est: {problem.estimatedTime || "25 mins"}</span>
            </div>
            {problem.status === "solved" && (
              <>
                <span className="text-slate-300 text-sm">|</span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-extrabold px-3 py-1 rounded-xl shrink-0 shadow-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                  Solved
                </span>
              </>
            )}
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveMainTab("problem")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              activeMainTab === "problem"
                ? "bg-[#004ac6] text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Problem & Solution
          </button>
          <button
            onClick={() => setActiveMainTab("editor")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              activeMainTab === "editor"
                ? "bg-[#004ac6] text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            IDE & Console
          </button>
        </div>

        {/* Split Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          
          {/* LEFT PANEL: Description, Editorial, Submissions (5 Cols) */}
          <div className={`lg:col-span-5 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[640px] ${
            activeMainTab !== "problem" ? "hidden lg:flex" : "flex"
          }`}>
            
            {/* Header Tabs */}
            <div className="flex border-b border-slate-200/90 bg-slate-50/80 p-2 gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveLeftTab("description")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                  activeLeftTab === "description"
                    ? "bg-[#004ac6] text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                Description
              </button>
              <button
                onClick={() => setActiveLeftTab("editorial")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                  activeLeftTab === "editorial"
                    ? "bg-[#004ac6] text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Editorial Solution
              </button>
              <button
                onClick={() => setActiveLeftTab("submissions")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                  activeLeftTab === "submissions"
                    ? "bg-[#004ac6] text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <History className="h-3.5 w-3.5" />
                Submissions ({submissions.length})
              </button>
              <button
                onClick={() => setActiveLeftTab("related")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                  activeLeftTab === "related"
                    ? "bg-[#004ac6] text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Related
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto max-h-[78vh] scrollbar-thin">
              
              {/* TAB 1: DESCRIPTION */}
              {activeLeftTab === "description" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{problem.name}</h3>
                    {problem.subtitle && <p className="text-xs text-slate-500 font-semibold">{problem.subtitle}</p>}
                    
                    {/* Tags & Companies */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {problem.companies?.map((comp) => (
                        <span key={comp} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-200/80 shadow-xs">
                          {comp}
                        </span>
                      ))}
                      {problem.tags?.map((tag) => (
                        <span key={tag} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Problem Description Statement */}
                  <div className="prose max-w-none text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line border-t border-slate-200/80 pt-4">
                    {problem.description}
                  </div>

                  {/* Examples Section */}
                  {problem.examples?.length > 0 && (
                    <div className="space-y-4 border-t border-slate-200/80 pt-4">
                      <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-[#004ac6]" />
                        Sample Test Cases
                      </h4>
                      {problem.examples.map((ex, index) => {
                        const displayInput = getExampleInput(ex);
                        const displayOutput = getExampleOutput(ex);
                        return (
                          <div key={index} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
                            <p className="font-bold text-xs text-slate-900">Example {index + 1}:</p>
                            <div className="font-mono text-xs text-slate-800 space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200">
                              <p>
                                <span className="font-bold text-[#004ac6]">Input:</span> {displayInput || "Example input not provided."}
                              </p>
                              <p>
                                <span className="font-bold text-emerald-600">Output:</span> {displayOutput || "Example output not provided."}
                              </p>
                              {ex.explanation && (
                                <p className="text-slate-600 text-[11px] pt-1.5 font-sans border-t border-slate-100 mt-1.5">
                                  <span className="font-bold text-slate-800">Explanation:</span> {ex.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Step-by-Step Expandable Hints */}
                  {problem.hints?.length > 0 && (
                    <div className="space-y-2.5 border-t border-slate-200/80 pt-4">
                      <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Step-by-Step Hints
                      </h4>
                      <div className="space-y-2">
                        {problem.hints.map((hint, idx) => {
                          const isRevealed = !!revealedHints[idx];
                          return (
                            <div key={idx} className="border border-amber-200/80 rounded-xl overflow-hidden text-xs bg-amber-50/30">
                              <button
                                onClick={() => toggleHint(idx)}
                                className="w-full flex justify-between items-center px-4 py-3 bg-amber-50/60 hover:bg-amber-100/60 font-bold text-slate-900 transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                  Hint {idx + 1}
                                </span>
                                <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform ${isRevealed ? "rotate-90 text-[#004ac6]" : ""}`} />
                              </button>
                              {isRevealed && (
                                <div className="p-4 bg-white border-t border-amber-200/80 text-slate-700 font-medium leading-relaxed">
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

              {/* TAB 2: EDITORIAL SOLUTION */}
              {activeLeftTab === "editorial" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-4 py-3 rounded-2xl">
                    <BookOpen className="h-5 w-5 text-indigo-600 shrink-0" />
                    <p className="text-xs font-extrabold">Official Solution Guide</p>
                  </div>
                  
                  {/* Overview & Complexities */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-sm">Intuition & Approach</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                      {solutionObj.overview || `Analyze problem constraints, handle edge cases, and construct the optimal solution using standard data structures.`}
                    </p>

                    <div className="flex gap-3">
                      <div className="flex-1 bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-2xl text-center shadow-xs">
                        <p className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">Time Complexity</p>
                        <p className="text-sm font-black text-emerald-900 mt-1">{solutionObj.timeComplexity || "O(N)"}</p>
                      </div>
                      <div className="flex-1 bg-blue-50 border border-blue-200/80 p-3.5 rounded-2xl text-center shadow-xs">
                        <p className="text-[10px] font-black uppercase text-blue-700 tracking-wider">Space Complexity</p>
                        <p className="text-sm font-black text-blue-900 mt-1">{solutionObj.spaceComplexity || "O(1)"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Language Solution Tabs */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-slate-900 text-sm">Solution Code</h4>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {["python", "js", "java", "cpp"].map((langKey) => (
                          <button
                            key={langKey}
                            onClick={() => setActiveSolutionLang(langKey)}
                            className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg transition cursor-pointer ${
                              activeSolutionLang === langKey
                                ? "bg-[#004ac6] text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {langKey === "js" ? "JavaScript" : langKey}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-xs font-mono text-slate-200 relative shadow-sm">
                      <button
                        onClick={() => copySolutionCode(solutionObj[`${activeSolutionLang}Code`] || code)}
                        className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-[10px] font-sans font-bold border border-slate-700"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Copy Solution"}
                      </button>
                      <pre className="p-4 overflow-x-auto leading-relaxed max-h-72 scrollbar-thin text-slate-300">
                        <code>
                          {solutionObj[`${activeSolutionLang}Code`] || solutionObj.pythonCode || `# Solution code:\n${code}`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SUBMISSIONS HISTORY */}
              {activeLeftTab === "submissions" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-sm font-extrabold text-slate-900">Your Submission Logs</h4>
                  {submissions.length > 0 ? (
                    <div className="space-y-3">
                      {submissions.map((sub) => (
                        <div key={sub.id} className="border border-slate-200 p-4 rounded-2xl bg-slate-50 flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <p className={`font-black ${
                              sub.status.includes("Accepted") 
                                ? "text-emerald-600" 
                                : sub.status.includes("Wrong") 
                                ? "text-rose-600" 
                                : "text-amber-600"
                            }`}>
                              {sub.status}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold">{sub.time} • {sub.lang}</p>
                          </div>
                          <span className="font-mono text-slate-700 font-bold bg-white px-3 py-1 rounded-lg border border-slate-200">
                            {sub.runtime}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500 space-y-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <History className="h-9 w-9 mx-auto text-slate-400" />
                      <p className="text-xs font-bold text-slate-700">No submissions recorded yet for this session.</p>
                      <p className="text-[11px] text-slate-500">Click "Submit Solution" to run testcases and log attempts.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: RELATED PROBLEMS */}
              {activeLeftTab === "related" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-sm font-extrabold text-slate-900">Similar Module Challenges</h4>
                  {relatedProblems.length > 0 ? (
                    <div className="space-y-2.5">
                      {relatedProblems.map((prob) => (
                        <Link
                          key={prob._id}
                          to={`/problem/${prob._id}`}
                          className="flex justify-between items-center p-4 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-2xl transition-all group bg-slate-50/50"
                        >
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-[#004ac6] transition-colors">
                              {prob.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-semibold">{prob.successRate || "80%"} success rate</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                              prob.difficulty === "Easy"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : prob.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}>
                              {prob.difficulty}
                            </span>
                            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#004ac6]" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No other problems in this module.</p>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT PANEL: Code Editor & Console Output (7 Cols) */}
          <div className={`lg:col-span-7 flex flex-col gap-4 min-h-[640px] ${
            activeMainTab !== "editor" ? "hidden lg:flex" : "flex"
          }`}>
            
            {/* Editor Workspace Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col flex-1">
              
              {/* Ultra-High Tech Editor Toolbar */}
              <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex justify-between items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-xl text-blue-300 text-xs font-bold">
                    <Code2 className="h-4 w-4" />
                    <span>Monaco IDE</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                    High Velocity Engine
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language Selector */}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-slate-800 text-slate-100 text-xs font-bold border border-slate-700 rounded-xl px-3.5 py-1.5 outline-none focus:border-blue-400 cursor-pointer shadow-inner"
                  >
                    {Object.entries(LANGUAGE_MAPPING).map(([key, val]) => (
                      <option key={key} value={key} className="bg-slate-900 text-white">
                        {val.label}
                      </option>
                    ))}
                  </select>

                  {/* Reset Code */}
                  <button
                    onClick={() => setCode(getStarterCode(language, problem))}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700 cursor-pointer"
                    title="Reset to starter template"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>

                  <span className="text-slate-700">|</span>

                  {/* Action Buttons */}
                  <button
                    onClick={handleRunCode}
                    disabled={executing || submitting}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-4 py-1.5 rounded-xl text-xs transition border border-slate-700 cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5 fill-current text-blue-400" />
                    Run Code
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={executing || submitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#004ac6] to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-bold px-5 py-1.5 rounded-xl text-xs transition shadow-md shadow-blue-600/25 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Submit Solution
                  </button>
                </div>
              </div>

              {/* Monaco Code Editor */}
              <div className="flex-1 min-h-[380px] relative p-1 bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={LANGUAGE_MAPPING[language]?.monaco || "python"}
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  loading={
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-400 text-xs gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-[#004ac6]" />
                      Loading Monaco IDE environment...
                    </div>
                  }
                  options={{
                    fontSize: 13,
                    fontFamily: "Fira Code, Courier New, monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    cursorBlinking: "smooth",
                    lineNumbersMinChars: 3,
                    padding: { top: 14, bottom: 14 },
                    tabSize: 4
                  }}
                />
              </div>

            </div>

            {/* Console Output & Testcases */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col min-h-64">
              
              {/* Console Header Tabs */}
              <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveConsoleTab("testcase")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeConsoleTab === "testcase"
                        ? "bg-white text-[#004ac6] border border-slate-200 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Testcase Input
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab("result")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      activeConsoleTab === "result"
                        ? "bg-white text-[#004ac6] border border-slate-200 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    Execution Result
                  </button>
                </div>
                
                {executing && (
                  <span className="text-[10px] text-[#004ac6] font-bold flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#004ac6]" />
                    Executing Sandbox...
                  </span>
                )}
                {submitting && (
                  <span className="text-[10px] text-[#004ac6] font-bold flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#004ac6]" />
                    Evaluating Test Cases...
                  </span>
                )}
              </div>

              {/* Console Body */}
              <div className="flex-1 p-4 overflow-y-auto text-xs font-mono text-slate-700 scrollbar-thin">
                
                {/* Custom Testcase Input */}
                {activeConsoleTab === "testcase" && (
                  <div className="h-full flex flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Custom Test Input (stdin)</span>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Input parameters, e.g. 123..."
                      className="w-full min-h-32 flex-1 bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-emerald-400 outline-none resize-none focus:border-[#004ac6] leading-relaxed font-mono shadow-inner"
                    />
                  </div>
                )}

                {/* Execution Results */}
                {activeConsoleTab === "result" && (
                  <div className="h-full flex flex-col">
                    {(executing || submitting) && (
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-500 py-12">
                        <Activity className="h-8 w-8 text-[#004ac6] animate-pulse" />
                        <p className="text-xs font-bold text-slate-700">
                          {executing ? "Compiling source code on Judge0 sandbox..." : "Running evaluation test suite..."}
                        </p>
                      </div>
                    )}

                    {!runResult && !executing && !submitting && (
                      <div className="flex flex-col items-center justify-center text-slate-500 py-12 gap-2">
                        <Terminal className="h-7 w-7 text-slate-400" />
                        <p className="text-xs">Click "Run Code" or "Submit Solution" to compile your code.</p>
                      </div>
                    )}

                    {runResult && !executing && !submitting && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Status:</span>
                            <span className={`font-black text-sm uppercase ${
                              runResult.status.includes("Accepted") || runResult.status.includes("Executed")
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}>
                              {runResult.status}
                            </span>
                          </div>
                          {runResult.runtime && (
                            <span className="text-xs text-slate-500 font-sans">
                              Runtime: <strong className="text-slate-900 font-mono">{runResult.runtime}</strong>
                            </span>
                          )}
                        </div>

                        {/* Testcase Batch Results for Submissions */}
                        {runResult.testcaseResults && runResult.testcaseResults.length > 0 ? (
                          <div className="space-y-3 pt-1">
                            {/* Testcase Tabs */}
                            <div className="flex gap-2 border-b border-slate-200 pb-2.5 overflow-x-auto">
                              {runResult.testcaseResults.map((tc, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveTestcaseTab(idx)}
                                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                    activeTestcaseTab === idx
                                      ? "bg-slate-900 text-white shadow-sm"
                                      : "text-slate-600 hover:text-slate-900 bg-slate-100"
                                  }`}
                                >
                                  {tc.passed ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                                  )}
                                  Case {tc.index}
                                </button>
                              ))}
                            </div>

                            {/* Active Testcase Details */}
                            {runResult.testcaseResults[activeTestcaseTab] && (
                              <div className="grid gap-2.5 font-mono text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800 text-slate-200 shadow-inner">
                                <div className="grid grid-cols-12 gap-2 items-start">
                                  <span className="col-span-3 text-slate-400 font-bold">Input:</span>
                                  <span className="col-span-9 text-slate-200 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80 whitespace-pre-wrap">
                                    {runResult.testcaseResults[activeTestcaseTab].input}
                                  </span>
                                </div>
                                <div className="grid grid-cols-12 gap-2 items-start">
                                  <span className="col-span-3 text-slate-400 font-bold">Actual Output:</span>
                                  <span className={`col-span-9 px-3 py-1.5 rounded-xl border whitespace-pre-wrap font-bold ${
                                    runResult.testcaseResults[activeTestcaseTab].passed ? "text-emerald-400 bg-slate-950 border-slate-800/80" : "text-rose-400 bg-rose-950/40 border-rose-900/60"
                                  }`}>
                                    {runResult.testcaseResults[activeTestcaseTab].actual}
                                  </span>
                                </div>
                                <div className="grid grid-cols-12 gap-2 items-start">
                                  <span className="col-span-3 text-slate-400 font-bold">Expected Output:</span>
                                  <span className="col-span-9 text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80 whitespace-pre-wrap font-bold">
                                    {runResult.testcaseResults[activeTestcaseTab].expected}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : runResult.isError ? (
                          <pre className="text-rose-400 whitespace-pre-wrap font-mono text-xs bg-slate-950 p-4 rounded-2xl border border-rose-900/50 shadow-inner">
                            {runResult.errorMsg || runResult.output}
                          </pre>
                        ) : (
                          /* Run Code Simple Result */
                          <div className="grid gap-2.5 border-t border-slate-200 pt-3 font-mono text-xs">
                            <div className="grid grid-cols-12 gap-2 items-start">
                              <span className="col-span-3 text-slate-500 font-bold">Input:</span>
                              <span className="col-span-9 text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 whitespace-pre-wrap">{runResult.input}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-2 items-start">
                              <span className="col-span-3 text-slate-500 font-bold">Actual Output:</span>
                              <span className="col-span-9 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold whitespace-pre-wrap">{runResult.output}</span>
                            </div>
                            {runResult.hasExpected && (
                              <div className="grid grid-cols-12 gap-2 items-start">
                                <span className="col-span-3 text-slate-500 font-bold">Expected Output:</span>
                                <span className="col-span-9 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 font-bold whitespace-pre-wrap">{runResult.expected}</span>
                              </div>
                            )}
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
