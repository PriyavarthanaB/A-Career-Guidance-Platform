import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Brain,
  CheckCircle2,
  Code2,
  FileText,
  Globe,
  Mic,
  Search,
  Settings,
  Share2,
  Trophy,
  Upload,
} from 'lucide-react';

const navLinks = [
  { label: 'Dashboard', href: '/', active: true },
  { label: 'Resume', href: '/analyzer' },
  { label: 'Interview', href: '/login' },
  { label: 'Coding', href: '/login' },
];

const stats = [
  { value: '94%', label: 'ATS Success Rate' },
  { value: '12M+', label: 'Resumes Scanned' },
  { value: '45k', label: 'Job Offers Secured' },
  { value: '3.5x', label: 'Average Salary Increase' },
];

const pathSteps = [
  { icon: Upload, label: 'Upload', desc: 'Drop your resume' },
  { icon: Search, label: 'Analyze', desc: 'AI scans & scores' },
  { icon: Brain, label: 'Practice', desc: 'Mock interviews' },
  { icon: Trophy, label: 'Get Hired', desc: 'Land your offer' },
];

const Logo = ({ className = '' }) => (
  <span className={`font-bold text-xl tracking-tight ${className}`}>
    SyntacHire <span className="text-brand-600">AI</span>
  </span>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, href, active }) => (
              <li key={label}>
                <Link
                  to={href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? 'text-brand-600 border-b-2 border-brand-600 pb-0.5'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 min-w-[180px] lg:min-w-[220px]">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="search"
                placeholder="Search..."
                className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none w-full"
              />
            </div>
            <button type="button" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <button type="button" className="hidden sm:block p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition" aria-label="Settings">
              <Settings size={20} />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-white shadow-sm overflow-hidden shrink-0">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=SyntacHire"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/80 via-white to-white pointer-events-none" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column */}
            <div className="text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-brand-700 bg-brand-100 rounded-full mb-6">
                ✨ AI-Powered Career Intelligence
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Calibrate Your Career with{' '}
                <span className="text-brand-600">AI Precision</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl">
                SyntacHire AI transforms your job search into a data-driven journey. Optimize your resume for ATS, simulate high-stakes interviews, and bridge skill gaps with precision.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-500/25"
                >
                  Get Started for Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3.5 bg-brand-50 text-brand-700 font-semibold rounded-xl hover:bg-brand-100 transition border border-brand-100"
                >
                  View Demo
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {['#6366f1', '#8b5cf6', '#ec4899'].map((color, i) => (
                    <div
                      key={color}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: color, zIndex: 3 - i }}
                    >
                      {['JD', 'SK', 'MR'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  Joined by <span className="font-semibold text-slate-700">10k+ professionals</span> this month
                </p>
              </div>
            </div>

            {/* Right column — laptop mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Laptop */}
                <div className="relative bg-slate-800 rounded-t-2xl p-3 pt-3 pb-0 shadow-2xl">
                  <div className="bg-slate-900 rounded-t-lg overflow-hidden aspect-[16/10]">
                    {/* Dashboard mockup */}
                    <div className="h-full bg-slate-50 p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div className="col-span-2 bg-white rounded-lg p-3 shadow-sm border border-slate-100">
                          <div className="h-2 w-16 bg-slate-200 rounded mb-3" />
                          <div className="space-y-2">
                            {[85, 72, 94, 68].map((w) => (
                              <div key={w} className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${w}%` }} />
                                </div>
                                <span className="text-[10px] text-slate-400 w-6">{w}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-brand-600 rounded-lg p-2 h-16 flex flex-col justify-end">
                            <span className="text-[10px] text-white/80">Score</span>
                            <span className="text-lg font-bold text-white">94</span>
                          </div>
                          <div className="bg-white rounded-lg p-2 h-16 border border-slate-100">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-auto">
                              <div className="h-full w-3/4 bg-green-500 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} className="h-8 bg-white rounded border border-slate-100" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-b-sm mx-auto w-[110%] -ml-[5%]" />
                  <div className="h-1.5 bg-slate-600 rounded-b-xl mx-auto w-[120%] -ml-[10%]" />
                </div>

                {/* Floating ATS card */}
                <div className="absolute -left-4 sm:left-0 bottom-8 sm:bottom-12 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 max-w-[240px] animate-float">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 size={22} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">ATS Score: 94%</p>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        Highly optimized for Senior Engineer roles at Tier 1 firms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Every Stage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Master Every Stage of the Process
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
            From resume optimization to offer negotiation — every tool you need, powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {/* AI Resume Scoring */}
          <div className="relative bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[280px] flex flex-col">
            <div className="absolute right-4 bottom-4 opacity-[0.06] pointer-events-none">
              <FileText size={160} className="text-brand-600" />
            </div>
            <FileText className="text-brand-600 mb-4" size={32} />
            <h3 className="font-bold text-xl text-slate-900 mb-2">AI Resume Scoring</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm flex-1">
              Real-time ATS optimization that analyzes keyword density, format compliance, and role-specific alignment.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-full">Keyword Density</span>
              <span className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-full">Format Check</span>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="bg-brand-600 p-6 sm:p-8 rounded-2xl shadow-lg shadow-brand-600/20 min-h-[280px] flex flex-col text-white">
            <BarChart3 className="mb-4 text-white/90" size={32} />
            <h3 className="font-bold text-xl mb-2">Skill Gap Analysis</h3>
            <p className="text-sm text-brand-100 leading-relaxed flex-1">
              We map your skills against target job descriptions to identify missing competencies and recommend learning paths.
            </p>
            <div className="mt-6 flex items-end gap-2 h-16">
              {[40, 65, 45, 80, 55].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-white/20 rounded-t-md"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Mock Interviews */}
          <div className="bg-brand-100 p-6 sm:p-8 rounded-2xl min-h-[240px] flex flex-col">
            <Mic className="text-brand-600 mb-4" size={32} />
            <h3 className="font-bold text-xl text-slate-900 mb-2">Mock Interviews</h3>
            <p className="text-sm text-slate-600 leading-relaxed flex-1">
              Practice HR and Technical rounds with AI avatars. Get live feedback on tone, clarity, and technical depth.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-brand-600 hover:text-brand-700 transition"
            >
              Launch Room
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Coding Practice */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[240px] flex flex-col">
            <Code2 className="text-brand-600 mb-4" size={32} />
            <h3 className="font-bold text-xl text-slate-900 mb-2">Coding Practice</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Tackle algorithmic challenges in an integrated AI-powered IDE with real-time suggestions.
            </p>
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto">
              <p className="text-slate-400">
                <span className="text-purple-400">function</span>{' '}
                <span className="text-blue-400">twoSum</span>
                <span className="text-slate-300">(nums, target) {'{'}</span>
              </p>
              <p className="text-green-400 pl-4 mt-1">
                {'// AI Suggestion: Use Map for O(1) lookups'}
              </p>
              <p className="text-slate-300 pl-4 mt-1">
                <span className="text-purple-400">const</span> map = <span className="text-purple-400">new</span> Map();
              </p>
              <p className="text-slate-500 pl-4">...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Path to the Offer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Path to the Offer
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {pathSteps.map(({ icon: Icon, label, desc }, index) => (
            <div key={label} className="relative flex flex-col items-center text-center">
              {index < pathSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-slate-200" />
              )}
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 relative z-10">
                <Icon size={28} className="text-brand-600" />
              </div>
              <h3 className="font-bold text-slate-900">{label}</h3>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-600 text-white font-semibold text-lg rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-500/25"
          >
            Start Your Calibration Now
          </Link>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="bg-navy py-12 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{value}</p>
                <p className="mt-2 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <Logo />
            <p className="mt-2 text-sm text-slate-500">
              © 2024 SyntacHire AI. Calibrating careers with precision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              {['Terms', 'Privacy', 'Careers', 'Support'].map((link) => (
                <a key={link} href="#" className="hover:text-brand-600 transition">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition" aria-label="Language">
                <Globe size={18} />
              </button>
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition" aria-label="Share">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
