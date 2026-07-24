import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ModuleCard from "../components/ModuleCard";
import { getModules } from "../api/modules";
import { 
  Flame, 
  Star, 
  CheckCircle2, 
  BookOpen, 
  Target, 
  Search, 
  SlidersHorizontal,
  Sparkles,
  Loader2,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

export default function CodingPractice() {
  const navigate = useNavigate();
  
  // State for modules from backend
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  


  // Fetch modules from MongoDB via Axios
  const loadModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getModules();
      setModules(data || []);
    } catch (err) {
      console.error("Failed to load modules:", err);
      setError("Unable to connect to the server. Please verify your backend server is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  // Statistics Data (Calculated dynamically from loaded modules)
  const stats = useMemo(() => {
    const totalCount = modules.length || 11;
    const solvedCount = modules.filter(m => m.progress === 100).length;
    const completionPercentage = Math.round((solvedCount / totalCount) * 100);

    return [
      {
        title: "Current Streak",
        value: "7 Days",
        icon: <Flame className="h-6 w-6 text-amber-500 fill-current animate-pulse" />,
        bg: "bg-amber-50 border-amber-200 text-amber-900",
        sub: "Personal Best: 14d"
      },
      {
        title: "XP Earned",
        value: "1,450 XP",
        icon: <Star className="h-6 w-6 text-yellow-500 fill-current" />,
        bg: "bg-yellow-50 border-yellow-200 text-yellow-900",
        sub: "+150 XP today"
      },
      {
        title: "Problems Solved",
        value: "42 / 120",
        icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
        bg: "bg-emerald-50 border-emerald-200 text-emerald-900",
        sub: "35% Complete"
      },
      {
        title: "Modules Completed",
        value: `${solvedCount} / ${totalCount}`,
        icon: <BookOpen className="h-6 w-6 text-blue-500" />,
        bg: "bg-blue-50 border-blue-200 text-blue-900",
        sub: `${completionPercentage}% Complete`
      },
      {
        title: "Daily Goal",
        value: "2 / 3 Solved",
        icon: <Target className="h-6 w-6 text-rose-500" />,
        bg: "bg-rose-50 border-rose-200 text-rose-900",
        sub: "1 problem left!"
      }
    ];
  }, [modules]);

  // Filtering Logic
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      // Search matches module name, description, or number
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.number.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter matches
      const matchesDifficulty = selectedDifficulty === "All" || m.difficulty === selectedDifficulty;
      
      let matchesTopic = true;
      if (selectedTopic !== "All") {
        matchesTopic = m.topic === selectedTopic;
      }
      
      let matchesStatus = true;
      if (selectedStatus === "Completed") {
        matchesStatus = m.progress === 100;
      } else if (selectedStatus === "In Progress") {
        matchesStatus = m.progress > 0 && m.progress < 100;
      } else if (selectedStatus === "Not Started") {
        matchesStatus = m.progress === 0;
      }

      return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus;
    });
  }, [modules, searchQuery, selectedDifficulty, selectedTopic, selectedStatus]);

  // Navigate to coding practice list page
  const navigateToPractice = (module) => {
    navigate(`/module/${module._id}/practice`);
  };

  // Open theory page
  const openTheory = (module) => {
    navigate(`/module/${module._id}/theory`);
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex flex-col">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Dashboard */}
      <main className="lg:ml-[280px] min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-8">
        
        {/* Page Title Header */}
        <header className="flex flex-col gap-2 border-b border-[#c3c6d7]/30 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-4 py-1.5 text-xs font-bold text-blue-800 ring-1 ring-inset ring-blue-700/10 w-fit shadow-xs">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            Interview Preparation Track
          </div>
          <h2 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Data Structures & Algorithms
          </h2>
          <p className="text-sm text-[#434655] max-w-xl font-normal leading-relaxed">
            Master coding interviews through structured learning and practice.
          </p>
        </header>

        {/* Five Statistics Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`p-5 rounded-2xl border bg-white flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 ${stat.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                <p className="text-[10px] opacity-80 font-bold mt-1">{stat.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Search Bar & Filters Section */}
        <section className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/30 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#737686]" />
              <input
                type="text"
                placeholder="Search modules, concepts, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-[#0b1c30] focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Quick Title Indicators */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-bold text-[#737686]">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter Modules:</span>
            </div>
          </div>

          {/* Filtering Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Difficulty Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#737686]">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-slate-50/70 text-xs font-bold text-[#434655] border border-slate-200 rounded-xl px-3 py-2.5 outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Topic Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#737686]">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-50/70 text-xs font-bold text-[#434655] border border-slate-200 rounded-xl px-3 py-2.5 outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Topics</option>
                <option value="Programming Basics & Complexity">Programming Basics & Complexity</option>
                <option value="Arrays">Arrays</option>
                <option value="Strings">Strings</option>
                <option value="Hashing">Hashing</option>
                <option value="Linked Lists">Linked Lists</option>
                <option value="Stacks & Queues">Stacks & Queues</option>
                <option value="Trees & BST">Trees & BST</option>
                <option value="Heap & Priority Queue">Heap & Priority Queue</option>
                <option value="Graphs">Graphs</option>
                <option value="Dynamic Programming">Dynamic Programming</option>
                <option value="Advanced Algorithms">Advanced Algorithms</option>
              </select>
            </div>

            {/* Completion Status Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#737686]">Completion Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-50/70 text-xs font-bold text-[#434655] border border-slate-200 rounded-xl px-3 py-2.5 outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Not Started">Not Started (0%)</option>
                <option value="In Progress">In Progress (1-99%)</option>
                <option value="Completed">Completed (100%)</option>
              </select>
            </div>

          </div>
        </section>

        {/* Responsive Modules Grid with Loading & Error States */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0b1c30]">
              Study Plan Modules ({filteredModules.length})
            </h3>
            {(searchQuery || selectedDifficulty !== "All" || selectedTopic !== "All" || selectedStatus !== "All") && !loading && !error ? (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDifficulty("All");
                  setSelectedTopic("All");
                  setSelectedStatus("All");
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            ) : null}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs animate-pulse space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-16 bg-slate-100 rounded-md"></div>
                    <div className="h-6 w-12 bg-slate-100 rounded-md"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-slate-100 rounded-md"></div>
                    <div className="h-3 w-full bg-slate-100 rounded-md"></div>
                    <div className="h-3 w-5/6 bg-slate-100 rounded-md"></div>
                  </div>
                  <div className="h-4 w-1/2 bg-slate-100 rounded-md"></div>
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-slate-100 rounded-md"></div>
                  </div>
                  <div className="pt-2 border-t border-slate-50 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-9 bg-slate-100 rounded-xl"></div>
                      <div className="h-9 bg-slate-100 rounded-xl"></div>
                    </div>
                    <div className="h-9 bg-slate-100 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-red-950">Connection Error</h4>
              <p className="text-xs text-red-800 leading-relaxed">
                {error}
              </p>
              <button 
                onClick={loadModules}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Connection
              </button>
            </div>
          )}

          {/* Data Loaded State */}
          {!loading && !error && (
            filteredModules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredModules.map((module, index) => (
                  <ModuleCard 
                    key={index}
                    module={module}
                    onTheory={openTheory}
                    onPractice={navigateToPractice}
                    onContinue={navigateToPractice}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-[#c3c6d7]/30 text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <Search className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-[#0b1c30]">No Modules Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We couldn't find any study plan modules matching your current search filters. Try adjusting your query.
                </p>
              </div>
            )
          )}
        </section>

      </main>

    </div>
  );
}