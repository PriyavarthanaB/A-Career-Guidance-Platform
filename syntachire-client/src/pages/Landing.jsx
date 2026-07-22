import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, BarChart3, Mic, Code, CheckCircle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100">
        <div className="flex items-center space-x-2 font-bold text-xl text-brand-600">
          <div className="w-8 h-8 bg-brand-600 text-white flex items-center justify-center rounded-lg font-extrabold text-sm">
            S
          </div>
          <span>SyntacHire AI</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
            Log In
          </Link>
          <Link to="/signup" className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-all shadow-md shadow-brand-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block px-3 py-1 text-xs font-bold text-brand-600 bg-brand-50 border border-brand-100 rounded-full mb-6">
          ✨ AI-Powered Career Intelligence
        </span>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Calibrate Your Career with <span className="text-brand-600">AI Precision</span>
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          SyntacHire AI transforms your job search into a data-driven journey. Optimize your resume for ATS, simulate high-stakes interviews, and bridge skill gaps.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/signup" className="flex items-center space-x-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-500/25">
            <span>Get Started for Free</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition">
            View Demo
          </Link>
        </div>
      </section>

      {/* Grid Features */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Master Every Stage of the Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <FileText className="text-brand-600 mb-4" size={28} />
            <h3 className="font-bold text-lg mb-1">AI Resume Scoring</h3>
            <p className="text-sm text-slate-500">Real-time ATS optimization that analyzes keywords and format checks.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <BarChart3 className="text-brand-600 mb-4" size={28} />
            <h3 className="font-bold text-lg mb-1">Skill Gap Analysis</h3>
            <p className="text-sm text-slate-500">We map your skills against job descriptions to find missing gaps.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <Mic className="text-brand-600 mb-4" size={28} />
            <h3 className="font-bold text-lg mb-1">Mock Interviews</h3>
            <p className="text-sm text-slate-500">Practice HR and Technical rounds with AI avatars and live feedback.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <Code className="text-brand-600 mb-4" size={28} />
            <h3 className="font-bold text-lg mb-1">Coding Practice</h3>
            <p className="text-sm text-slate-500">Tackle algorithmic challenges in an integrated AI-powered IDE.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;