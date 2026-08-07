import React from 'react';
import { useNavigate } from 'react-router-dom';
import Orb from '../components/Orb';
import Dock from '../components/Dock';
import { Home, FileText, Code2, Brain, Mic, Settings } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const dockItems = [
    { icon: <Home size={20} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <FileText size={20} />, label: 'Resume Analyzer', onClick: () => navigate('/analyzer') },
    { icon: <Code2 size={20} />, label: 'Coding Practice', onClick: () => navigate('/coding-practice') },
    { icon: <Brain size={20} />, label: 'Coding Hub', onClick: () => navigate('/coding-hub') },
    { icon: <Mic size={20} />, label: 'Mock Interview', onClick: () => navigate('/mock-interview') },
    { icon: <Settings size={20} />, label: 'Settings', onClick: () => navigate('/settings') },
  ];

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen overflow-x-hidden font-sans relative pb-20 selection:bg-[#004ac6] selection:text-white">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-40 flex justify-between items-center px-5 md:px-14 h-16 md:h-20 bg-[#0b1c30]/90 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/10 text-white">
        <div className="flex items-center gap-6 md:gap-10">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <img
              src="/assets/app_logo.png"
              alt="SyntacHire AI logo"
              className="h-9 w-9 md:h-11 md:w-11 rounded-lg object-cover border border-white/10 shadow-sm"
            />
            <span className="text-xl md:text-2xl font-extrabold text-blue-400 hover:text-blue-300 tracking-tight transition-colors duration-200">
              SyntacHire AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-base font-medium">
            <a className="text-blue-400 font-bold border-b-2 border-blue-400 pb-1" href="#features">
              Features
            </a>
            <a className="text-slate-300 hover:text-white transition-colors duration-200" href="#resume">
              Resume
            </a>
            <a className="text-slate-300 hover:text-white transition-colors duration-200" href="#interview">
              Interview
            </a>
            <a className="text-slate-300 hover:text-white transition-colors duration-200" href="#coding">
              Coding
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 md:px-5 md:py-2.5 font-semibold text-sm md:text-base text-slate-200 hover:bg-white/10 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-[#004ac6] hover:bg-blue-600 text-white px-4 py-2 md:px-5 md:py-2.5 font-semibold text-sm md:text-base rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <main className="mt-16 md:mt-20">
        {/* Hero Section with Interactive WebGL Orb Background */}
        <section id="features" className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#070f1e] text-white py-12 md:py-20">
          
          {/* Ambient Decorative Background Glows */}
          <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#004ac6]/25 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-indigo-600/15 blur-[120px]" />
          
          {/* WebGL Animated Orb Background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-[700px] lg:w-[850px] h-[550px] md:h-[750px] opacity-85 pointer-events-auto z-0">
            <Orb
              hoverIntensity={1.5}
              rotateOnHover={true}
              hue={0}
              forceHoverState={false}
              backgroundColor="#070f1e"
            />
          </div>

          <div className="max-w-7xl mx-auto px-5 md:px-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-500/10 border border-blue-400/25 rounded-full text-blue-300 text-sm font-semibold backdrop-blur-xl shadow-inner shadow-blue-500/20">
                <span className="material-symbols-outlined text-[18px] text-blue-400 animate-pulse">auto_awesome</span>
                AI-Powered Career Intelligence
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] text-white tracking-tight">
                Calibrate Your Career with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent drop-shadow-sm">AI Precision</span>
              </h1>
              <p className="text-base md:text-xl leading-relaxed text-slate-300 max-w-2xl font-normal">
                SyntacHire AI transforms your job search into a data-driven journey. Optimize your resume for ATS, simulate high-stakes interviews, and bridge your skill gaps with intelligent precision.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-[#004ac6] hover:bg-blue-600 text-white px-7 py-4 rounded-2xl font-semibold text-base md:text-lg shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <span>Get Started for Free</span>
                  <span className="material-symbols-outlined text-[22px] group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 px-7 py-4 rounded-2xl font-semibold text-base md:text-lg text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-lg shadow-black/10"
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-center gap-4 pt-4 text-slate-400 text-sm font-semibold">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md">JS</div>
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">RK</div>
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-slate-900 bg-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">AL</div>
                </div>
                <span>Joined by 10k+ professionals this month</span>
              </div>
            </div>

            {/* Floating Glassmorphic UI Card Over WebGL Orb */}
            <div className="relative hidden md:block z-10">
              <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-5 md:p-7 rounded-[32px] md:rounded-[36px] border border-white/20 shadow-2xl shadow-blue-500/10 hover:border-white/30 transition-all duration-300 animate-float">
                <img
                  className="rounded-2xl border border-white/10 shadow-2xl w-full"
                  alt="Dashboard Preview"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3MTjOzZ1G3c1KJ920erTDKTCidOckxOhgtLJ96IhSKHTaVQobzC11c5hSuzfewwMmRijp_E3WnRqu-d4UadOauqIafXrkVI7Hfz8auJpCuXHw-9McwBSWPi9iH1eozO24V6iiM2TQgAlxCDAR__TV-qN-DLySmRQMPuF6w4atdyAvifIM073r_-OhSa1Lh3JfRaHSZ1oOByMggKC3SLK5o3Dc_pXA_CvsBGgYs4VyAh92XTbDoWh4"
                />
                {/* Floating Badge */}
                <div className="absolute -right-4 -bottom-4 bg-[#0b1c30]/90 backdrop-blur-2xl p-4 md:p-5 rounded-2xl shadow-2xl border border-blue-500/30 max-w-[200px] md:max-w-[220px] hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                    </div>
                    <span className="font-bold text-sm md:text-base text-white">ATS Score: 94%</span>
                  </div>
                  <p className="text-xs leading-snug text-slate-300 font-medium">"Highly optimized for Senior Engineer roles at Tier 1 firms."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="resume" className="py-16 md:py-24 bg-[#f8f9ff] relative overflow-hidden">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute top-20 right-10 w-96 h-96 rounded-full bg-blue-400/10 blur-[130px]" />
          <div className="pointer-events-none absolute bottom-20 left-10 w-96 h-96 rounded-full bg-purple-400/10 blur-[130px]" />

          <div className="max-w-7xl mx-auto px-5 md:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
              <span className="inline-block px-3.5 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold ring-1 ring-inset ring-blue-700/10 mb-3 uppercase tracking-wider">
                Platform Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0b1c30] mb-4 md:mb-5 tracking-tight">Master Every Stage of the Process</h2>
              <p className="text-base md:text-lg text-[#434655] leading-relaxed">
                Our intelligent engine analyzes every data point to give you the competitive edge in today's job market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8">
              {/* Feature 1 */}
              <div className="md:col-span-8 bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-[24px] md:rounded-[32px] p-6 md:p-10 relative overflow-hidden group shadow-lg shadow-blue-500/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex flex-col h-full justify-between relative z-10 min-h-[180px] md:min-h-[220px]">
                  <div>
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600/10 text-[#004ac6] border border-blue-600/20 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:bg-[#004ac6] group-hover:text-white transition-all duration-300 shadow-sm">
                      <span className="material-symbols-outlined text-[28px] md:text-[32px]">description</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#0b1c30] mb-3">AI Resume Scoring</h3>
                    <p className="text-[#434655] max-w-lg text-sm md:text-base leading-relaxed">
                      Real-time ATS optimization that analyzes your content against industry-specific keywords and semantic relevance.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6 md:mt-8">
                    <span className="px-3.5 md:px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700">Keyword Density</span>
                    <span className="px-3.5 md:px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-700">Format Check</span>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-4 bg-gradient-to-br from-[#004ac6] to-indigo-700 text-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-blue-600/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-5 md:mb-6 shadow-sm">
                    <span className="material-symbols-outlined text-[28px] md:text-[32px]">analytics</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3">Skill Gap Analysis</h3>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">We map your skills against millions of job descriptions to find what you're missing.</p>
                </div>
                <div className="mt-6 md:mt-8 flex justify-end">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">
                    <span className="font-extrabold text-xl md:text-2xl">82%</span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div id="interview" className="md:col-span-4 bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-[24px] md:rounded-[32px] p-6 md:p-10 flex flex-col justify-between group shadow-lg shadow-blue-500/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-600/10 text-purple-600 border border-purple-600/20 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-[28px] md:text-[32px]">mic</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0b1c30] mb-3">Mock Interviews</h3>
                  <p className="text-[#434655] text-sm md:text-base leading-relaxed">Practice HR and Technical rounds with AI avatars that provide instant behavioral feedback.</p>
                </div>
                <button
                  onClick={() => navigate('/mock-interview')}
                  className="flex items-center gap-2 text-[#004ac6] font-bold text-sm md:text-base mt-6 md:mt-8 cursor-pointer hover:gap-3 transition-all duration-200"
                >
                  <span>Launch Room</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                </button>
              </div>

              {/* Feature 4 */}
              <div id="coding" className="md:col-span-8 bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-[24px] md:rounded-[32px] p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center overflow-hidden shadow-lg shadow-blue-500/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex-1">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-600/10 text-emerald-600 border border-emerald-600/20 rounded-2xl flex items-center justify-center mb-5 md:mb-6 shadow-sm">
                    <span className="material-symbols-outlined text-[28px] md:text-[32px]">code</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0b1c30] mb-3">Coding Practice</h3>
                  <p className="text-[#434655] text-sm md:text-base leading-relaxed">Tackle algorithmic challenges in an integrated AI-powered IDE with real-time code optimization hints.</p>
                </div>
                <div className="flex-1 w-full bg-[#0b1c30] border border-slate-800 rounded-2xl p-4 md:p-5 font-mono text-xs md:text-sm text-blue-300 shadow-2xl">
                  <div className="flex gap-2 mb-3 md:mb-4">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-400/80"></div>
                  </div>
                  <div className="space-y-1.5 leading-relaxed">
                    <p><span className="text-purple-400">function</span> <span className="text-yellow-400">optimizeCareer</span>() &#123;</p>
                    <p className="pl-4"><span className="text-purple-400">const</span> skills = <span className="text-orange-400">AI.analyze</span>(resume);</p>
                    <p className="pl-4"><span className="text-purple-400">return</span> skills.<span className="text-orange-400">prepare</span>();</p>
                    <p>&#125;</p>
                    <p className="text-emerald-400 pt-2 font-sans text-xs">// AI Suggestion: Use Map for O(1) lookups</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-20 bg-[#0b1c30] text-white text-center border-y border-white/10 relative overflow-hidden">
          <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px]" />

          <div className="max-w-7xl mx-auto px-5 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 relative z-10">
            <div>
              <div className="text-3xl sm:text-4xl md:text-6xl font-black mb-2 bg-gradient-to-r from-white via-blue-100 to-indigo-300 bg-clip-text text-transparent">94%</div>
              <div className="text-slate-400 text-xs md:text-base font-semibold">ATS Success Rate</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-6xl font-black mb-2 bg-gradient-to-r from-white via-blue-100 to-indigo-300 bg-clip-text text-transparent">12M+</div>
              <div className="text-slate-400 text-xs md:text-base font-semibold">Resumes Scanned</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-6xl font-black mb-2 bg-gradient-to-r from-white via-blue-100 to-indigo-300 bg-clip-text text-transparent">45k</div>
              <div className="text-slate-400 text-xs md:text-base font-semibold">Job Offers Secured</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-6xl font-black mb-2 bg-gradient-to-r from-white via-blue-100 to-indigo-300 bg-clip-text text-transparent">3.5x</div>
              <div className="text-slate-400 text-xs md:text-base font-semibold">Average Salary Increase</div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Navigation Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <Dock items={dockItems} panelHeight={64} baseItemSize={46} magnification={64} />
      </div>

      {/* Footer */}
      <footer className="w-full py-10 md:py-12 px-5 md:px-14 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 bg-[#0b1c30] border-t border-white/10 text-slate-300 text-sm">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <img
              src="/assets/app_logo.png"
              alt="SyntacHire AI logo"
              className="h-8 w-8 md:h-9 md:w-9 rounded-lg object-cover"
            />
            <span className="text-xl md:text-2xl font-extrabold text-blue-400">SyntacHire AI</span>
          </div>
          <p className="text-slate-400 text-xs mt-1">© 2026 SyntacHire AI. Calibrating careers with precision.</p>
        </div>
        <div className="flex gap-6 md:gap-8 text-sm font-medium text-slate-300">
          <a className="hover:text-white transition-colors duration-200" href="#terms">Terms</a>
          <a className="hover:text-white transition-colors duration-200" href="#privacy">Privacy</a>
          <a className="hover:text-white transition-colors duration-200" href="#careers">Careers</a>
          <a className="hover:text-white transition-colors duration-200" href="#support">Support</a>
        </div>
      </footer>
    </div>
  );
}