import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from './Icons';
import '../styles/layout.css';

export const Sidebar: React.FC<{ active: string }> = ({ active }) => {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Icons.grid },
    { key: 'resume', label: 'Resume Analyzer', icon: Icons.file },
    { key: 'interview', label: 'Mock Interview', icon: Icons.mic },
    { key: 'coding', label: 'Coding Hub', icon: Icons.code },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark"><Icons.qr /></div>
        <div className="brand-text">
          <div className="name">SyntacHire AI</div>
          <div className="tag">Intelligent Calibration</div>
        </div>
      </div>

      <nav className="nav-group">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={`/${item.key}`}
            className={`nav-item ${item.key === active ? 'active' : ''}`}
          >
            <item.icon />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link to="/settings" className="nav-item" style={{ marginTop: '2px' }}>
        <Icons.settings />
        <span>Settings</span>
      </Link>

      <div className="sidebar-spacer"></div>

      <div className="upgrade-card">
        <div className="t">Upgrade to Pro</div>
        <div className="d">Unlock unlimited AI mock sessions and advanced ATS hacks.</div>
        <button className="btn btn-primary btn-block">Upgrade</button>
      </div>

      <div className="sidebar-foot">
        <Link to="/help" className="nav-item">
          <Icons.help />
          <span>Help Center</span>
        </Link>
        <Link to="/logout" className="nav-item">
          <Icons.logout />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export const Topbar: React.FC<{
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
}> = ({ title, subtitle, extra }) => {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && <div className="sub">{subtitle}</div>}
      </div>
      <div className="topbar-right">
        {extra}
        <button className="icon-btn">
          <Icons.bell />
        </button>
        <div className="avatar">A</div>
      </div>
    </header>
  );
};

export const AppFooter: React.FC = () => {
  return (
    <footer className="app-footer">
      <div>
        <div className="brand">SyntacHire AI</div>
        <div>© 2024 SyntacHire AI. Calibrating careers with precision.</div>
      </div>
      <nav>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Careers</a>
        <a href="#">Support</a>
      </nav>
    </footer>
  );
};
