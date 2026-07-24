import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  // --- BACKEND CONNECTION STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  // --- API CALL TO EXPRESS BACKEND ---
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg({ type: 'success', text: data.message || 'Registration successful! Redirecting...' });
        
        // 1. Save JWT token to local storage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        setEmail('');
        setPassword('');

        // 2. Redirect to Dashboard after 1 second
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/dashboard');
        }, 1000);

      } else {
        setResponseMsg({ type: 'error', text: data.message || 'Something went wrong.' });
      }
    } catch (error) {
      setResponseMsg({ type: 'error', text: 'Unable to connect to express server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-on-surface)] min-h-screen overflow-x-hidden font-sans relative">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-40 flex justify-between items-center px-8 md:px-14 h-20 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-outline-variant)]/30 shadow-sm">
        <div className="flex items-center gap-10">
          <span className="text-2xl font-extrabold text-[var(--color-primary)] tracking-tight cursor-pointer" onClick={() => navigate('/')}>
            SyntacHire AI
          </span>
          <div className="hidden md:flex items-center gap-8 text-base font-medium">
            <a className="text-[var(--color-primary)] font-bold border-b-2 border-[var(--color-primary)] pb-1" href="#dashboard">
              Dashboard
            </a>
            <a className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors" href="#resume">
              Resume
            </a>
            <a className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors" href="#interview">
              Interview
            </a>
            <a className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors" href="#coding">
              Coding
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-container)]/10 rounded-xl transition-all cursor-pointer"
          >
            Log In
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--color-primary)] text-white px-5 py-2.5 font-semibold rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <main className="mt-20">
        {/* Hero Section */}
        <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-container-low)] py-16">
          <div className="max-w-7xl mx-auto px-8 md:px-12 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[var(--color-primary-container)]/10 border border-[var(--color-primary-container)]/20 rounded-full text-[var(--color-primary)] text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                AI-Powered Career Intelligence
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.15] text-[var(--color-on-surface)]">
                Calibrate Your Career with <span className="text-gradient">AI Precision</span>
              </h1>
              <p className="text-xl leading-relaxed text-[var(--color-on-surface-variant)] max-w-2xl font-normal">
                SyntacHire AI transforms your job search into a data-driven journey. Optimize your resume for ATS, simulate high-stakes interviews, and bridge your skill gaps with intelligent precision.
              </p>
              
              {/* Scaled Buttons */}
              <div className="flex flex-wrap gap-5 pt-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[var(--color-primary)] text-white px-9 py-4.5 rounded-2xl font-semibold text-lg shadow-xl shadow-[var(--color-primary)]/25 hover:scale-[1.02] transition-transform flex items-center gap-3 cursor-pointer"
                >
                  Get Started for Free
                  <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[var(--color-surface-container-highest)]/50 backdrop-blur-md border border-[var(--color-outline-variant)]/30 px-9 py-4.5 rounded-2xl font-semibold text-lg text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all cursor-pointer"
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-center gap-4 pt-6 text-[var(--color-on-surface-variant)] text-sm font-semibold">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                </div>
                <span>Joined by 10k+ professionals this month</span>
              </div>
            </div>

            {/* Hero Image / Card */}
            <div className="relative hidden md:block">
              <div className="relative z-10 glass-card p-7 rounded-[36px] ai-glow animate-float">
                <img 
                  className="rounded-2xl border border-[var(--color-outline-variant)]/20 shadow-2xl w-full" 
                  alt="Dashboard Preview" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3MTjOzZ1G3c1KJ920erTDKTCidOckxOhgtLJ96IhSKHTaVQobzC11c5hSuzfewwMmRijp_E3WnRqu-d4UadOauqIafXrkVI7Hfz8auJpCuXHw-9McwBSWPi9iH1eozO24V6iiM2TQgAlxCDAR__TV-qN-DLySmRQMPuF6w4atdyAvifIM073r_-OhSa1Lh3JfRaHSZ1oOByMggKC3SLK5o3Dc_pXA_CvsBGgYs4VyAh92XTbDoWh4" 
                />
                {/* Floating Badge */}
                <div className="absolute -right-4 -bottom-4 glass-card p-5 rounded-2xl shadow-2xl border border-[var(--color-primary)]/20 max-w-[220px]">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-tertiary-container)] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <span className="font-bold text-base text-[var(--color-on-surface)]">ATS Score: 94%</span>
                  </div>
                  <p className="text-xs leading-snug text-[var(--color-on-surface-variant)] font-medium">"Highly optimized for Senior Engineer roles at Tier 1 firms."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-[var(--color-surface)] relative">
          <div className="max-w-7xl mx-auto px-8 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-5">Master Every Stage of the Process</h2>
              <p className="text-lg text-[var(--color-on-surface-variant)] leading-relaxed">
                Our intelligent engine analyzes every data point to give you the competitive edge in today's job market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Feature 1 */}
              <div className="md:col-span-8 bg-white border border-[var(--color-outline-variant)]/30 rounded-[28px] p-10 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col h-full justify-between relative z-10 min-h-[220px]">
                  <div>
                    <div className="w-14 h-14 bg-[var(--color-primary-container)]/10 text-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-[32px]">description</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">AI Resume Scoring</h3>
                    <p className="text-[var(--color-on-surface-variant)] max-w-lg text-base leading-relaxed">
                      Real-time ATS optimization that analyzes your content against industry-specific keywords and semantic relevance.
                    </p>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <span className="px-4 py-1.5 bg-[var(--color-surface-container)] rounded-full text-xs font-semibold">Keyword Density</span>
                    <span className="px-4 py-1.5 bg-[var(--color-surface-container)] rounded-full text-xs font-semibold">Format Check</span>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-4 bg-[var(--color-primary)] text-white rounded-[28px] p-10 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[32px]">analytics</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Skill Gap Analysis</h3>
                  <p className="text-white/90 text-base leading-relaxed">We map your skills against millions of job descriptions to find what you're missing.</p>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center">
                    <span className="font-extrabold text-2xl">82%</span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-4 bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/30 rounded-[28px] p-10 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-[var(--color-tertiary-container)]/10 text-[var(--color-tertiary)] rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[32px]">mic</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Mock Interviews</h3>
                  <p className="text-[var(--color-on-surface-variant)] text-base leading-relaxed">Practice HR and Technical rounds with AI avatars that provide instant behavioral feedback.</p>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-base mt-8 cursor-pointer">
                  <span>Launch Room</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_outward</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-8 glass-card border border-[var(--color-primary)]/10 rounded-[28px] p-10 flex flex-col md:flex-row gap-8 items-center overflow-hidden">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[32px]">code</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Coding Practice</h3>
                  <p className="text-[var(--color-on-surface-variant)] text-base leading-relaxed">Tackle algorithmic challenges in an integrated AI-powered IDE with real-time code optimization hints.</p>
                </div>
                <div className="flex-1 w-full bg-[#1e293b] rounded-2xl p-5 font-mono text-sm text-blue-300 shadow-2xl">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="space-y-1.5 leading-relaxed">
                    <p><span className="text-purple-400">function</span> <span className="text-yellow-400">optimizeCareer</span>() &#123;</p>
                    <p className="pl-4"><span className="text-purple-400">const</span> skills = <span className="text-orange-400">AI.analyze</span>(resume);</p>
                    <p className="pl-4"><span className="text-purple-400">return</span> skills.<span className="text-orange-400">prepare</span>();</p>
                    <p>&#125;</p>
                    <p className="text-emerald-400 pt-2">// AI Suggestion: Use Map for O(1) lookups</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[var(--color-on-surface)] text-white text-center">
          <div className="max-w-7xl mx-auto px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-10">
            <div>
              <div className="text-4xl md:text-6xl font-black mb-2 text-white">94%</div>
              <div className="text-gray-400 text-sm md:text-base font-medium">ATS Success Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-black mb-2 text-white">12M+</div>
              <div className="text-gray-400 text-sm md:text-base font-medium">Resumes Scanned</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-black mb-2 text-white">45k</div>
              <div className="text-gray-400 text-sm md:text-base font-medium">Job Offers Secured</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-black mb-2 text-white">3.5x</div>
              <div className="text-gray-400 text-sm md:text-base font-medium">Average Salary Increase</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 md:px-14 flex flex-col md:flex-row justify-between items-center gap-8 bg-[var(--color-surface-container-highest)] border-t border-[var(--color-outline-variant)]/30 text-sm">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="text-2xl font-extrabold text-[var(--color-primary)]">SyntacHire AI</span>
          <p className="text-[var(--color-on-surface-variant)] text-xs mt-1">© 2026 SyntacHire AI. Calibrating careers with precision.</p>
        </div>
        <div className="flex gap-8 text-sm font-medium text-[var(--color-on-surface-variant)]">
          <a className="hover:text-[var(--color-primary)] transition-colors" href="#terms">Terms</a>
          <a className="hover:text-[var(--color-primary)] transition-colors" href="#privacy">Privacy</a>
          <a className="hover:text-[var(--color-primary)] transition-colors" href="#careers">Careers</a>
          <a className="hover:text-[var(--color-primary)] transition-colors" href="#support">Support</a>
        </div>
      </footer>

      {/* SIGNUP MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative border border-[var(--color-outline-variant)] text-slate-800">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>

            <div className="text-center mb-8">
              <h3 className="text-3xl font-extrabold text-[var(--color-on-surface)]">Get Started Free</h3>
              <p className="text-base text-gray-500 mt-2">Create your SyntacHire AI account.</p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none text-base"
                />
              </div>

              {responseMsg && (
                <div className={`p-4 rounded-2xl text-sm font-medium ${responseMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {responseMsg.text}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[var(--color-primary)] text-white py-4 rounded-2xl font-bold text-base shadow-lg hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer mt-3"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <span 
                onClick={() => {
                  setIsModalOpen(false);
                  navigate('/login');
                }} 
                className="text-[var(--color-primary)] font-bold cursor-pointer hover:underline"
              >
                Log In
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}