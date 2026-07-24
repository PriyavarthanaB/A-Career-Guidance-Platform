import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Play, RotateCcw, Code2, Terminal, ArrowLeft } from "lucide-react";

// Judge0 Language IDs
const LANGUAGE_MAPPING = {
  python: { id: 71, label: "Python 3" },
  javascript: { id: 63, label: "JavaScript (Node.js)" },
  java: { id: 62, label: "Java" },
  c: { id: 50, label: "C (GCC)" },
};

const SAMPLE_PROBLEM = {
  title: "1. Two Sum",
  difficulty: "Easy",
  description:
    "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
  examples: [
    { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" },
    { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
  ],
};

// Generates dynamic starter code based on language and problem name
const getDefaultCode = (lang, probName) => {
  const cleanName = probName 
    ? probName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') 
    : "solve";
  
  // Special case for Two Sum fallback
  if (probName === "1. Two Sum" || probName === "Two Sum") {
    if (lang === "python") return `def two_sum(nums, target):\n    # Write code here\n    pass\n\nprint(two_sum([2, 7, 11, 15], 9))`;
    if (lang === "javascript") return `function twoSum(nums, target) {\n    // Write code here\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`;
  }

  if (lang === "python") {
    return `def ${cleanName}():\n    # Write code here\n    pass\n`;
  } else if (lang === "javascript") {
    const camelName = cleanName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    return `function ${camelName}() {\n    // Write code here\n}\n`;
  } else if (lang === "java") {
    return `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Solution working");\n    }\n}`;
  } else {
    return `#include <stdio.h>\n\nint main() {\n    printf("Solution working\\n");\n    return 0;\n}`;
  }
};

export default function CodingEditor() {
  const location = useLocation();
  const problemData = location.state?.problem;

  // Determine active problem
  const problem = problemData ? {
    title: problemData.name,
    difficulty: problemData.difficulty,
    description: problemData.description,
    examples: problemData.examples || []
  } : SAMPLE_PROBLEM;

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Initialize code when problem or language changes
  useEffect(() => {
    setCode(getDefaultCode(language, problem.title));
    setOutput("");
  }, [language, problem.title]);

  const handleLanguageChange = (langKey) => {
    setLanguage(langKey);
  };

  const runCodeWithJudge0 = async () => {
    setIsRunning(true);
    setOutput("Compiling and running on Judge0 engine...");
    setHasError(false);

    const apiKey =
      import.meta.env?.VITE_JUDGE0_KEY || process.env.REACT_APP_JUDGE0_KEY;

    try {
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?wait=true&fields=stdout,stderr,compile_output,status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": apiKey,
          },
          body: JSON.stringify({
            source_code: code,
            language_id: LANGUAGE_MAPPING[language].id,
          }),
        }
      );

      const data = await response.json();

      if (data.stdout) {
        setOutput(data.stdout);
      } else if (data.stderr) {
        setHasError(true);
        setOutput(data.stderr);
      } else if (data.compile_output) {
        setHasError(true);
        setOutput(data.compile_output);
      } else if (data.status?.description) {
        setHasError(data.status.id !== 3); // 3 = Accepted
        setOutput(`Status: ${data.status.description}`);
      } else {
        setOutput("Program finished with no output.");
      }
    } catch (err) {
      setHasError(true);
      setOutput("API Connection Error: Check your RapidAPI Key and network.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 font-sans">
      <div className="mx-auto max-w-7xl space-y-4">
        
        {/* Top Header & Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <Link 
              to={location.state?.from || "/coding-practice"}
              className="p-2 text-slate-400 hover:text-white bg-slate-700/30 hover:bg-slate-700 rounded-xl transition border border-slate-700/40"
              title="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                {problem.title}
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {problem.difficulty}
                </span>
              </h1>
              <p className="text-xs text-slate-400">Powered by Judge0 Engine</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-900 text-slate-200 text-sm font-semibold border border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
            >
              {Object.entries(LANGUAGE_MAPPING).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setCode(getDefaultCode(language, problem.title))}
              className="p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-xl transition border border-slate-600/40 cursor-pointer"
              title="Reset Code"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={runCodeWithJudge0}
              disabled={isRunning}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-sm transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              {isRunning ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Problem Description Panel */}
          <div className="lg:col-span-5 bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4 h-[580px] overflow-y-auto">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Description</h2>
            <p className="text-sm leading-relaxed text-slate-300 font-normal whitespace-pre-line">
              {problem.description}
            </p>

            {problem.examples?.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Examples</h3>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50 text-xs font-mono space-y-1 animate-in fade-in duration-200">
                    <div className="text-slate-400"><span className="text-blue-400">Input:</span> {ex.input}</div>
                    <div className="text-slate-400"><span className="text-emerald-400">Output:</span> {ex.output}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor & Terminal */}
          <div className="lg:col-span-7 flex flex-col space-y-4 h-[580px]">
            
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 text-xs font-bold text-slate-400">
                SOLUTION.{language === "python" ? "py" : language === "javascript" ? "js" : language}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="w-full flex-1 bg-transparent p-4 font-mono text-sm text-slate-200 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Output Panel */}
            <div className="h-44 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
              <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 text-xs font-bold text-slate-400 flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5" /> Output Terminal
              </div>
              <div className="p-4 flex-1 overflow-y-auto font-mono text-xs leading-relaxed">
                {!output && !isRunning && (
                  <span className="text-slate-600">Click "Run Code" to compile...</span>
                )}
                {output && (
                  <pre className={hasError ? "text-red-400 whitespace-pre-wrap" : "text-emerald-400 whitespace-pre-wrap"}>
                    {output}
                  </pre>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
