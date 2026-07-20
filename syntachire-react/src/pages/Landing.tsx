import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import '../styles/landing.css';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="lp-nav">
        <div className="lp-logo">
          <Icons.qr />
          SyntacHire AI
        </div>
        <div className="lp-nav-right">
          <button
            className="btn btn-ghost"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-eyebrow">
              <Icons.sparkle /> AI-Powered Career Intelligence
            </span>
            <h1>Calibrate Your Career with <span className="accent">AI Precision</span></h1>
            <p>
              SyntacHire AI transforms your job search into a data-driven journey. Optimize your
              resume for ATS, simulate high-stakes interviews, and bridge your skill gaps with
              intelligent precision.
            </p>
            <div className="hero-ctas">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/signup')}
              >
                Get Started for Free <Icons.arrowR />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>
            <div className="hero-social">
              <div className="avatar-stack">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <small>Joined by 10k+ professionals this month</small>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
              alt="Dashboard preview"
              className="hero-image"
            />
            <div className="floating-card">
              <div className="dot">
                <Icons.checkSm />
              </div>
              <div>
                <div className="ft">ATS Score: 94%</div>
                <div className="fd">"Highly optimized for Senior Engineer roles at Tier 1 firms."</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-head">
          <h2>Master Every Stage of the Process</h2>
          <p>
            Our intelligent engine analyzes every data point to give you the competitive edge in
            today's ruthless job market.
          </p>
        </div>
        <div className="feature-grid">
          <div className="card feature-card light">
            <div className="feature-icon">
              <Icons.file />
            </div>
            <h3>AI Resume Scoring</h3>
            <p>
              Real-time ATS optimization that analyzes your content against industry-specific
              keywords and semantic relevance.
            </p>
            <div className="tag-row">
              <span>Keyword Density</span>
              <span>Format Check</span>
            </div>
          </div>

          <div className="card feature-card dark">
            <div className="feature-icon">
              <Icons.brain />
            </div>
            <h3>Skill Gap Analysis</h3>
            <p>
              We map your skills against millions of job descriptions to find what you're missing.
            </p>
          </div>

          <div className="card feature-card tint">
            <div className="feature-icon">
              <Icons.mic />
            </div>
            <h3>Mock Interviews</h3>
            <p>
              Practice HR and Technical rounds with AI avatars that provide instant behavioral
              feedback.
            </p>
            <a href="#" className="feature-link" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
              Launch Room <Icons.arrowR />
            </a>
          </div>

          <div className="card feature-card light">
            <div className="feature-icon">
              <Icons.code />
            </div>
            <h3>Coding Practice</h3>
            <p>
              Tackle algorithmic challenges in an integrated AI-powered IDE with real-time code
              optimization hints.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="section-head">
          <h2>Your Path to the Offer</h2>
        </div>
        <div className="process-steps">
          <div className="process-step">
            <div className="num-circle">
              <Icons.upload />
            </div>
            <h4>Upload</h4>
            <p>Drop your resume or LinkedIn profile into our engine.</p>
          </div>
          <div className="process-step">
            <div className="num-circle">
              <Icons.target />
            </div>
            <h4>Analyze</h4>
            <p>AI identifies gaps and optimizes your pitch for ATS.</p>
          </div>
          <div className="process-step">
            <div className="num-circle">
              <Icons.mic />
            </div>
            <h4>Practice</h4>
            <p>Simulate realistic interviews and coding challenges.</p>
          </div>
          <div className="process-step">
            <div className="num-circle">
              <Icons.award />
            </div>
            <h4>Get Hired</h4>
            <p>Walk into your dream job with total confidence.</p>
          </div>
        </div>
        <div className="process-cta">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/signup')}
          >
            Start Your Calibration Now
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div>
            <div className="num">94%</div>
            <div className="lbl">ATS Success Rate</div>
          </div>
          <div>
            <div className="num">12M+</div>
            <div className="lbl">Resumes Scanned</div>
          </div>
          <div>
            <div className="num">45k</div>
            <div className="lbl">Job Offers Secured</div>
          </div>
          <div>
            <div className="num">3.5x</div>
            <div className="lbl">Average Salary Increase</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Career?</h2>
          <p>Join thousands of professionals who've landed their dream jobs with SyntacHire AI.</p>
          <div className="cta-buttons">
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate('/signup')}
            >
              Create Free Account
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="footer-content">
          <div>
            <div className="brand">SyntacHire AI</div>
            <p>© 2024 SyntacHire AI. Calibrating careers with precision.</p>
          </div>
          <nav>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="lp-footer-icons">
            <span>
              <Icons.globe />
            </span>
            <span>
              <Icons.share />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
