import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Trophy,
  Zap,
  Check,
  Sparkles,
  ShieldCheck,
  Star,
  Crown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Layers,
  Brain,
  Code2,
  UserCheck,
  Flame,
  Award,
  HelpCircle,
  Clock,
  ArrowLeft,
  X,
  CreditCard,
  Gift,
  Mic,
  Target,
} from "lucide-react";

export default function PremiumPlan() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("annual"); // 'monthly' | 'annual'
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState("pro");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const toggleFaq = (idx) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "CAREER100" || promoCode.trim().toUpperCase() === "SYNTACHIRE") {
      setPromoApplied(true);
    } else {
      alert("Invalid coupon code. Try 'CAREER100' or 'SYNTACHIRE' for demo promo!");
    }
  };

  const handleSimulateUpgrade = () => {
    setUpgradeSuccess(true);
    setTimeout(() => {
      setShowUpgradeModal(false);
      setUpgradeSuccess(false);
    }, 2000);
  };

  const FAQS = [
    {
      q: "How does the AI Mock Interview system prepare me for real company interviews?",
      a: "Our Gemini AI evaluates your spoken or typed responses across 7 core dimensions (Technical Knowledge, Correctness, Problem Solving, Communication, Relevance, Confidence, and Time Management). It provides immediate feedback, exemplary answers, and adapts difficulty in real time just like a human interviewer.",
    },
    {
      q: "What job roles are included in the Top 1% Career Roadmap?",
      a: "SyntacHire covers over 10 specialized tech domains including Full Stack Web Development, Frontend React/UI, Backend Node/Java/Python, Data Science & Machine Learning, DevOps & Cloud Engineering, Cybersecurity, Mobile Development, and System Design.",
    },
    {
      q: "Can I cancel or change my plan at any time?",
      a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from the Account Settings panel with zero cancellation fees.",
    },
    {
      q: "Are there college campus or student discounts available?",
      a: "Yes! Students with a valid college email address (.edu, .ac.in, etc.) or institutional tie-up receive an automatic 40% discount on all annual subscriptions.",
    },
    {
      q: "How does the ATS Resume Optimizer work?",
      a: "Our PDF parser extracts your exact skills, projects, and work experience, comparing them directly against industry job descriptions to calculate an ATS compatibility score and pinpoint missing keywords.",
    },
  ];

  return (
    <div className="relative overflow-hidden text-slate-900 bg-[#f8fafc] min-h-screen font-sans flex antialiased">
      <Sidebar />

      <main className="relative z-10 lg:ml-[260px] flex-1 min-h-screen px-4 md:px-10 py-10 max-w-[1280px] w-full mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-900/5">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-blue-600 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5 text-yellow-500" /> Premium Member Suite
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="text-center space-y-5 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 text-xs font-black shadow-2xs">
            <Trophy className="h-4 w-4 text-yellow-500" />
            ACHIEVE GREATNESS &bull; TOP 1% CAREER READINESS
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Accelerate into the{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Top 1% Candidate Pool
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
            Supercharge your placement journey with unlimited AI-powered voice mock interviews, role-specific learning pipelines, instant ATS resume calibrations, and FAANG-grade assessment simulations.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "annual"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-yellow-300 text-slate-900 px-2 py-0.5 rounded-full font-black">
                  SAVE 35%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Free Starter Tier */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 flex flex-col justify-between shadow-sm shadow-slate-900/5 hover:shadow-md transition-all space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Starter Plan</h3>
                  <p className="text-xs text-slate-500">Core tools for basic preparation</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="pt-2">
                <span className="text-4xl font-black text-slate-900">₹0</span>
                <span className="text-xs text-slate-500 font-bold ml-1">/ Free Forever</span>
              </div>

              <ul className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>1 AI Resume ATS scan per month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Standard DSA Coding Practice Hub</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>1 Basic Mock Interview session</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-400">
                  <X className="h-4 w-4 text-slate-300 shrink-0" />
                  <span>Adaptive difficulty AI generation</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-400">
                  <X className="h-4 w-4 text-slate-300 shrink-0" />
                  <span>Role Roadmap &amp; Spaced Flashcards</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs cursor-default border border-slate-200"
            >
              Current Active Plan
            </button>
          </div>

          {/* Pro Placement Tier (FEATURED) */}
          <div className="bg-gradient-to-b from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-7 text-white flex flex-col justify-between shadow-xl shadow-blue-600/20 relative overflow-hidden space-y-6 border-2 border-blue-400 scale-[1.02]">
            <div className="absolute top-4 right-4 bg-yellow-300 text-slate-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    Pro Placement <Sparkles className="h-4 w-4 text-yellow-300" />
                  </h3>
                  <p className="text-xs text-blue-100/80">Everything you need to land your dream offer</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-4xl font-black text-white">
                  {billingCycle === "annual" ? "₹349" : "₹499"}
                </span>
                <span className="text-xs text-blue-200 font-bold ml-1">
                  / month {billingCycle === "annual" && "(billed annually at ₹4,188)"}
                </span>
              </div>

              <ul className="space-y-3 pt-3 border-t border-white/20 text-xs text-blue-50 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-yellow-300 shrink-0" />
                  <span><strong>Unlimited</strong> AI Resume Analyses &amp; ATS calibrations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-yellow-300 shrink-0" />
                  <span><strong>Unlimited Voice &amp; Text</strong> AI Mock Interviews</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-yellow-300 shrink-0" />
                  <span><strong>7-Dimension Multi-Factor</strong> AI evaluation scorecards</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-yellow-300 shrink-0" />
                  <span><strong>Adaptive Difficulty</strong> that scales to your answers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-yellow-300 shrink-0" />
                  <span><strong>10+ Role Roadmaps</strong> with Rapid-Fire Spaced Flashcards</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-yellow-300 shrink-0" />
                  <span><strong>Downloadable PDF</strong> official assessment certificates</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setSelectedTier("pro");
                setShowUpgradeModal(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 font-black text-xs shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4 text-yellow-500 fill-current" />
              Upgrade to Pro Placement
            </button>
          </div>

          {/* Elite Mentorship Tier */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 flex flex-col justify-between shadow-sm shadow-slate-900/5 hover:shadow-md transition-all space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Elite 1-on-1</h3>
                  <p className="text-xs text-slate-500">FAANG mentorship &amp; campus placement cell</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Crown className="h-5 w-5" />
                </div>
              </div>

              <div className="pt-2">
                <span className="text-4xl font-black text-slate-900">
                  {billingCycle === "annual" ? "₹799" : "₹999"}
                </span>
                <span className="text-xs text-slate-500 font-bold ml-1">/ month</span>
              </div>

              <ul className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span><strong>Everything in Pro Placement</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>1-on-1 Monthly Senior FAANG Mentor Review</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Direct Referral Network &amp; Job Board Handover</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Custom Salary Negotiation Playbook</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>24/7 Priority Support &amp; Review Acceleration</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setSelectedTier("elite");
                setShowUpgradeModal(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Get Elite Mentorship <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Why Top Candidates Choose SyntacHire Pro
            </h2>
            <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto font-medium">
              Purpose-built AI tools designed to replicate tier-1 company hiring standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Mic,
                color: "text-blue-600 bg-blue-50 border-blue-200",
                title: "Live Voice Speech-to-Text Mock Rounds",
                desc: "Speak directly into the microphone with live waveform visualizer and speech-to-text transcription.",
              },
              {
                icon: Brain,
                color: "text-purple-600 bg-purple-50 border-purple-200",
                title: "7-Dimension Multi-Factor Scorecards",
                desc: "Receive deep score breakdown across Technical Knowledge, Correctness, Problem Solving, Communication, Relevance, Confidence, and Time.",
              },
              {
                icon: Target,
                color: "text-emerald-600 bg-emerald-50 border-emerald-200",
                title: "Adaptive Question Engine",
                desc: "Questions adapt dynamically: score high and the AI serves tougher FAANG-level challenges; struggle and it reinforces the fundamentals.",
              },
              {
                icon: Layers,
                color: "text-indigo-600 bg-indigo-50 border-indigo-200",
                title: "10+ Role Roadmaps & Flashcards",
                desc: "Spaced-repetition flip flashcards, theory modules, and practical challenge checklists tailored for every role.",
              },
              {
                icon: ShieldCheck,
                color: "text-amber-600 bg-amber-50 border-amber-200",
                title: "Instant ATS Keyword Matcher",
                desc: "Direct parser that pinpoints missing high-impact keywords for your target role in seconds.",
              },
              {
                icon: Award,
                color: "text-rose-600 bg-rose-50 border-rose-200",
                title: "Verified Placement PDF Certificate",
                desc: "Download verified scorecards with comprehensive category graphs to attach to your recruiter portfolio.",
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm shadow-slate-900/5 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-black text-slate-900 text-base">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Student Testimonials */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80 rounded-3xl p-8 md:p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-blue-700 text-xs font-black border border-blue-200 shadow-2xs">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
              Placed Candidate Stories
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Trusted by Candidates Placed at Top Tech Companies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {[
              {
                name: "Ananya Sharma",
                role: "SDE-1 @ Amazon",
                quote: "The 7-dimension AI feedback pinpointed exactly why my behavioral STAR answers were weak. Improved my confidence score from 60% to 92% in 2 weeks.",
                score: "96% Readiness",
              },
              {
                name: "Rohan Patel",
                role: "Full Stack Engineer @ Microsoft",
                quote: "The adaptive interview questions were identical in difficulty to my actual technical rounds. The voice recording mode felt like a real hiring panel.",
                score: "94% Readiness",
              },
              {
                name: "Priya V.",
                role: "Frontend Developer @ Freshworks",
                quote: "The rapid-fire flashcards and ATS resume skill gap checker made the biggest difference in getting shortlisted for 8+ campus drives.",
                score: "98% Readiness",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-sm shadow-slate-900/5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 font-bold">{t.role}</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {t.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 space-y-6 shadow-sm shadow-slate-900/5">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs md:text-sm text-slate-600">Everything you need to know about the Top 1% Career Readiness program.</p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto pt-2">
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-10 text-white text-center space-y-4 shadow-xl shadow-blue-600/20">
          <h2 className="text-2xl md:text-3xl font-black">Ready to Crack Your Dream Tech Placement?</h2>
          <p className="text-xs md:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of students leveling up with AI mock interviews, ATS resume optimization, and curated DSA pipelines.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedTier("pro");
                setShowUpgradeModal(true);
              }}
              className="py-3 px-8 rounded-2xl bg-white text-blue-700 font-black text-xs shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Zap className="h-4 w-4 text-yellow-500 fill-current" />
              Unlock Premium Now
            </button>
            <button
              onClick={() => navigate("/roadmap")}
              className="py-3 px-6 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              Explore Role Roadmaps
            </button>
          </div>
        </section>
      </main>

      {/* Interactive Simulated Checkout / Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Crown className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  {selectedTier === "elite" ? "Elite 1-on-1 Mentorship" : "Pro Placement Suite"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Activate Top 1% Career Readiness</p>
              </div>
            </div>

            {upgradeSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Premium Activated! 🎉</h4>
                <p className="text-xs text-slate-600">
                  You now have full access to unlimited AI mock interviews, role roadmaps, and ATS resume tools.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>Plan Duration</span>
                    <span className="text-slate-900 font-black uppercase">{billingCycle} Billing</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>Plan Price</span>
                    <span className="text-slate-900 font-black">
                      {selectedTier === "elite"
                        ? billingCycle === "annual" ? "₹799 / mo (₹9,588/yr)" : "₹999 / mo"
                        : billingCycle === "annual" ? "₹349 / mo (₹4,188/yr)" : "₹499 / mo"}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex items-center justify-between font-bold text-emerald-700 pt-1 border-t border-blue-200">
                      <span>Promo Discount (CAREER100)</span>
                      <span>-100% (FREE DEMO)</span>
                    </div>
                  )}
                </div>

                {/* Promo Code Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Gift className="h-3.5 w-3.5 text-blue-600" /> Have a Coupon Code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Try 'CAREER100'"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 uppercase focus:border-blue-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSimulateUpgrade}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    {promoApplied ? "Activate Free Pro Access" : "Proceed with Instant Activation"}
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    Safe &amp; secure simulated sandbox activation. No real credit card required.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
