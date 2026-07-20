import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar, Topbar, AppFooter } from '../components/Layout';
import { Icons } from '../components/Icons';
import '../styles/dashboard.css';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar active="dashboard" />
      <main className="main">
        <Topbar
          title={`Welcome back, ${currentUser?.name.split(' ')[0]}`}
          subtitle={new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        />
        <div className="content">
          <div className="dash-grid">
            <div className="card hero-insight">
              <div className="insight-eyebrow">
                <Icons.sparkle /> AI RESUME INSIGHTS
              </div>
              <h2>ATS Resume Score</h2>
              <p>
                Your resume is currently outperforming 85% of applicants in your field. Apply AI
                suggestions to reach 95%.
              </p>
              <div className="score-row">
                <div>
                  <div className="score-big">
                    85<span>%</span>
                  </div>
                  <div className="score-delta">
                    <Icons.trend /> +12% since last month
                  </div>
                </div>
                <button className="btn btn-primary">
                  Full Analysis <Icons.arrowR />
                </button>
              </div>
            </div>

            <div className="quick-links">
              <div className="card quick-link">
                <div className="qi">
                  <Icons.file />
                </div>
                <div>
                  <div className="qt">Resume Check</div>
                  <div className="qd">Optimize for keywords</div>
                </div>
              </div>
              <div className="card quick-link">
                <div className="qi">
                  <Icons.mic />
                </div>
                <div>
                  <div className="qt">Start Mock Interview</div>
                  <div className="qd">Practice with AI Coach</div>
                </div>
              </div>
              <div className="card quick-link">
                <div className="qi">
                  <Icons.code />
                </div>
                <div>
                  <div className="qt">Practice Coding</div>
                  <div className="qd">450+ LeetCode style tasks</div>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-row">
            <div className="card stat-card">
              <div className="st-head">
                <span className="st-label">Interviews Completed</span>
                <span className="st-icon">
                  <Icons.video />
                </span>
              </div>
              <div className="st-num">12</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '60%' }}></div>
              </div>
              <div className="st-foot">60% target</div>
            </div>

            <div className="card stat-card">
              <div className="st-head">
                <span className="st-label">Problems Solved</span>
                <span className="st-icon">
                  <Icons.terminal />
                </span>
              </div>
              <div className="st-num">48</div>
              <div className="bar-track">
                <div className="bar-fill green" style={{ width: '80%' }}></div>
              </div>
              <div className="st-foot">80% target</div>
            </div>

            <div className="card stat-card">
              <div className="st-head">
                <span className="st-label">Skill Matrix</span>
                <span className="st-icon">
                  <Icons.help />
                </span>
              </div>
              <div className="st-num">76</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '76%' }}></div>
              </div>
              <div className="st-foot">Overall score</div>
            </div>
          </div>

          <div className="bottom-grid">
            <div className="card">
              <div className="panel-head">
                <h3>Recent Activity</h3>
                <a href="#">View History</a>
              </div>
              <div className="activity-list">
                <div className="activity-row">
                  <div className="act-icon">
                    <Icons.file />
                  </div>
                  <div className="act-body">
                    <div className="act-title">Resume Uploaded</div>
                    <div className="act-sub">Senior_SDE_V3.pdf • 2.4 MB</div>
                  </div>
                  <div className="act-right">
                    <div className="act-time">2 hours ago</div>
                    <div className="act-status good">Analyzed</div>
                  </div>
                </div>
                <div className="activity-row">
                  <div className="act-icon">
                    <Icons.brain />
                  </div>
                  <div className="act-body">
                    <div className="act-title">Mock Test Performance</div>
                    <div className="act-sub">Backend System Design • Score: 78%</div>
                  </div>
                  <div className="act-right">
                    <div className="act-time">Yesterday</div>
                    <div className="act-status good">Good</div>
                  </div>
                </div>
                <div className="activity-row">
                  <div className="act-icon">
                    <Icons.code />
                  </div>
                  <div className="act-body">
                    <div className="act-title">Problem Solved</div>
                    <div className="act-sub">LRU Cache Implementation (Hard)</div>
                  </div>
                  <div className="act-right">
                    <div className="act-time">Oct 12</div>
                    <div className="act-status good">Success</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="card coach-card">
                <div className="coach-head">
                  <Icons.brain /> AI COACH TIP
                </div>
                <h4>Focus on Behavioral questions today.</h4>
                <p>
                  Your technical scores are soaring, but your communication score in the last mock
                  test dipped. We've prepared a "STAR Method" refresher for you.
                </p>
                <button className="btn btn-secondary btn-block">Start Behavioral Practice</button>
              </div>
              <div className="card report-card">
                <div className="ricon">
                  <Icons.file />
                </div>
                <div>
                  <div className="rt">Weekly Career Report</div>
                  <div className="rd">Your tailored insights for Week 42 are ready to download.</div>
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
