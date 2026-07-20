import React, { useRef } from 'react';
import { Sidebar, Topbar, AppFooter } from '../components/Layout';
import { Icons } from '../components/Icons';
import '../styles/pages.css';

export const Resume: React.FC = () => {
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [showProgress, setShowProgress] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    setShowProgress(true);
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 200);
  };

  return (
    <div className="app-shell">
      <Sidebar active="resume" />
      <main className="main">
        <Topbar
          title="AI Resume Insights"
          subtitle="Calibrate your profile for applicant tracking systems with machine precision."
        />
        <div className="content">
          <div className="resume-grid">
            <div className="card">
              <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
                <div className="dz-icon">
                  <Icons.upload />
                </div>
                <h2>Upload Your Resume</h2>
                <p>Drag and drop your PDF or DOCX file here to begin the intelligent analysis.</p>
                <button className="btn btn-primary" type="button" onClick={() => fileInputRef.current?.click()}>
                  Select File
                </button>
                <div className="dz-max">MAX SIZE 5MB</div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileSelect}
                accept=".pdf,.docx"
              />

              {showProgress && (
                <div className="file-progress">
                  <div className="fp-row">
                    <div className="fp-icon">
                      <Icons.checkSm />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="fp-name">Senior_SDE_Resume.pdf</div>
                      <div className="fp-size">
                        {uploadProgress < 100
                          ? `2.4 MB • Analyzing… ${Math.round(uploadProgress)}%`
                          : '2.4 MB • Analysis complete — ATS Score: 85%'}
                      </div>
                    </div>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="card tip-card">
                <div className="tip-head">
                  <Icons.help /> Pro Analysis Tip
                </div>
                <p>
                  Our AI checks for "Action Verbs" like <em>Optimized</em>, <em>Engineered</em>, and{' '}
                  <em>Spearheaded</em>. Replacing generic tasks with results-driven language can
                  boost your ATS score by up to 15%.
                </p>
                <a href="#">Learn more about ATS optimization <Icons.arrowR /></a>
              </div>
              <div className="card pathing-card">
                <h4>AI Career Pathing</h4>
                <p>After your analysis, we'll suggest specific job titles that match your unique skill fingerprint.</p>
              </div>
            </div>
          </div>
        </div>
        <AppFooter />
      </main>
    </div>
  );
};

export const Interview: React.FC = () => {
  return (
    <div className="app-shell">
      <Sidebar active="interview" />
      <main className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="pill" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>
              <i className="live-dot"></i> Active Session: Technical Interview
            </span>
            <strong style={{ fontSize: '14.5px', color: 'var(--blue-600)' }}>Senior SDE Role</strong>
          </div>
          <div className="topbar-right">
            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '11px' }}>AI</div>
            <button className="icon-btn">
              <Icons.bell />
            </button>
          </div>
        </header>
        <div className="content">
          <div className="interview-grid">
            <div>
              <div className="video-frame">
                <img
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1200&auto=format&fit=crop"
                  alt="Interview room"
                />
                <div className="rec-badge">
                  <span className="reddot"></span> REC 00:12:45
                </div>
                <div className="prompt-box">
                  <div className="prompt-eyebrow">
                    <Icons.file /> AI INTERVIEWER PROMPT
                  </div>
                  <div className="q">"Tell me about a time you handled a difficult technical challenge."</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="card" style={{ flex: 1 }}>
                <div className="panel-head">
                  <h3>Session Notes</h3>
                </div>
                <div className="notes-text">
                  <p>Your communication was clear and structured. Consider adding more specific metrics next time.</p>
                </div>
              </div>
              <div className="card">
                <div className="session-controls">
                  <button className="btn btn-primary">End Session</button>
                  <button className="btn btn-secondary">Feedback Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AppFooter />
      </main>
    </div>
  );
};

export const CodingHub: React.FC = () => {
  return (
    <div className="app-shell">
      <Sidebar active="coding" />
      <main className="main">
        <Topbar
          title="Coding Practice Hub"
          subtitle="Master algorithmic challenges with AI-powered guidance"
        />
        <div className="content">
          <div className="coding-grid">
            <div className="card">
              <div className="problem-header">
                <h3>Two Sum</h3>
                <span className="difficulty easy">Easy</span>
              </div>
              <p>
                Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.
              </p>
              <div style={{ marginTop: '16px' }}>
                <button className="btn btn-primary">Start Coding</button>
              </div>
            </div>

            <div className="card">
              <div className="problem-header">
                <h3>LRU Cache</h3>
                <span className="difficulty hard">Hard</span>
              </div>
              <p>
                Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
              </p>
              <div style={{ marginTop: '16px' }}>
                <button className="btn btn-primary">Start Coding</button>
              </div>
            </div>

            <div className="card">
              <div className="problem-header">
                <h3>Median of Two Sorted Arrays</h3>
                <span className="difficulty hard">Hard</span>
              </div>
              <p>
                Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.
              </p>
              <div style={{ marginTop: '16px' }}>
                <button className="btn btn-primary">Start Coding</button>
              </div>
            </div>
          </div>
        </div>
        <AppFooter />
      </main>
    </div>
  );
};
