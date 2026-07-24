import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function CodingHub({ onSolveProblem }) {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("problem-list");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Fetch problems from Node/Express Backend
  useEffect(() => {
    fetch("http://localhost:5000/api/problems")
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch((err) => console.error("Failed to fetch problems:", err));
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear session token
    navigate("/"); // Redirect to Landing Page
  };

  // Toggle problem status and update backend
  const handleSolveToggle = async (problem) => {
    const newStatus = problem.status === "solved" ? "unsolved" : "solved";
    
    // Optimistic UI update
    setProblems((prev) =>
      prev.map((p) => (p._id === problem._id || p.id === problem.id ? { ...p, status: newStatus } : p))
    );

    try {
      await fetch(`http://localhost:5000/api/problems/${problem._id || problem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }

    if (onSolveProblem) onSolveProblem(problem);
  };

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesCategory =
        activeCategory === "All" || problem.category === activeCategory;
      const matchesDifficulty =
        activeDifficulty === "All" || problem.difficulty === activeDifficulty;
      const matchesSearch =
        problem.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [problems, activeCategory, activeDifficulty, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / itemsPerPage));
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(start, start + itemsPerPage);
  }, [filteredProblems, currentPage, itemsPerPage]);

  const totalSolved = useMemo(() => {
    return problems.filter((p) => p.status === "solved").length;
  }, [problems]);

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex flex-col justify-between">
      {/* Reusable Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:ml-[280px] min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Coding Skills Calibration
            </h2>
            <p className="text-sm text-[#434655] mt-1 max-w-xl">
              Master high-stakes technical interviews with AI-driven problem selection tailored to your specific career trajectory.
            </p>
          </div>

          <div className="flex bg-[#e5eeff] p-1 rounded-xl gap-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("problem-list")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "problem-list"
                  ? "bg-white text-[#004ac6] shadow-sm"
                  : "text-[#434655] hover:text-[#0b1c30]"
              }`}
            >
              Problem List
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "leaderboard"
                  ? "bg-white text-[#004ac6] shadow-sm"
                  : "text-[#434655] hover:text-[#0b1c30]"
              }`}
            >
              Leaderboard
            </button>
          </div>
        </header>

        {/* Problems List Table */}
        <div className="bg-white border border-[#c3c6d7]/30 rounded-3xl overflow-hidden shadow-sm mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c3c6d7]/30 text-[11px] font-bold text-[#737686] uppercase tracking-wider bg-[#f8f9ff]/50">
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Problem Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Difficulty</th>
                  <th className="py-4 px-6">Success Rate</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d7]/20 text-xs font-medium">
                {paginatedProblems.length > 0 ? (
                  paginatedProblems.map((p) => (
                    <tr key={p._id || p.id} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="py-4 px-6">
                        {p.status === "solved" ? (
                          <div className="w-6 h-6 rounded-full bg-[#007d55]/10 flex items-center justify-center text-[#007d55]">
                            <span className="material-symbols-outlined text-[16px]">check</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-[#c3c6d7]" />
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-[#0b1c30] text-sm">{p.name}</p>
                        <p className="text-[#737686] text-[11px]">{p.subtitle}</p>
                      </td>
                      <td className="py-4 px-6 text-[#434655]">{p.category}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            p.difficulty === "Easy"
                              ? "bg-[#007d55]/10 text-[#006242]"
                              : p.difficulty === "Medium"
                              ? "bg-[#ffedd5] text-[#9a3412]"
                              : "bg-[#ffdad6] text-[#ba1a1a]"
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#434655]">{p.successRate}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleSolveToggle(p)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                            p.status === "solved"
                              ? "border border-[#c3c6d7] text-[#004ac6] hover:bg-[#eff4ff]"
                              : "bg-[#004ac6] text-white hover:bg-[#2563eb] shadow-sm"
                          }`}
                        >
                          {p.status === "solved" ? "Re-solve" : "Solve"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#737686]">
                      No problems match your selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}