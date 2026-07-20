/* ============================================================
   SyntacHire AI — Prototype interaction layer
   Single-file SPA-style page switcher with mock data & icons.
   ============================================================ */

const svg = (inner, size=20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const ic = {
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>', 16),
  bell: svg('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
  settings: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
  sparkle: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>', 14),
  arrowR: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 15),
  checkSm: svg('<path d="M20 6 9 17l-5-5"/>', 15),
  doc: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'),
  chart: svg('<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>'),
  mic: svg('<path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/>'),
  code: svg('<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'),
  upload: svg('<path d="M12 3v12m0-12 4 4m-4-4-4 4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>'),
  target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  award: svg('<circle cx="12" cy="8" r="6"/><path d="M9.5 13.5 7 22l5-3 5 3-2.5-8.5"/>'),
  globe: svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10Z"/>', 15),
  share: svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5"/>', 15),
  grid: svg('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>', 18),
  file: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>', 18),
  mic2: svg('<path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/>', 18),
  codeBrack: svg('<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>', 18),
  gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>', 18),
  help: svg('<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>', 18),
  logout: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>', 18),
  lightbulb: svg('<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/>', 18),
  sparkleLg: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>', 18),
  video: svg('<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4V8Z"/>', 18),
  terminal: svg('<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>', 18),
  clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', 14),
  info: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', 15),
  send: svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>', 15),
  skip: svg('<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>', 15),
  x: svg('<path d="M18 6 6 18M6 6l12 12"/>', 15),
  trend: svg('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>', 14),
  brain: svg('<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.5A2.5 2.5 0 0 1 4 17.5v-1.05A2.5 2.5 0 0 1 2.5 14v-2a2.5 2.5 0 0 1 1-2A2.5 2.5 0 0 1 4 7.5V6.5A2.5 2.5 0 0 1 6.5 4 2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.5A2.5 2.5 0 0 0 20 17.5v-1.05A2.5 2.5 0 0 0 21.5 14v-2a2.5 2.5 0 0 0-1-2A2.5 2.5 0 0 0 20 7.5V6.5A2.5 2.5 0 0 0 17.5 4 2.5 2.5 0 0 0 14.5 2Z"/>', 15),
  filecheck: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>', 18),
  qr: svg('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z"/>', 20),
  chevL: svg('<polyline points="15 18 9 12 15 6"/>', 14),
  chevR: svg('<polyline points="9 18 15 12 9 6"/>', 14),
  bolt: svg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', 15),
  mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 4-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 4"/>', 18),
  lock: svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 18),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>', 18),
};
const navIcon = {
  dashboard: ic.grid, resume: ic.file, interview: ic.mic2, coding: ic.codeBrack, settings: ic.gear
};

let currentPage = 'landing';

function goTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.proto-switcher button').forEach(b=>b.classList.toggle('active', b.dataset.page===page));
  currentPage = page;
  window.scrollTo({top:0, behavior:'instant'});
  renderPage(page);
}

document.querySelectorAll('.proto-switcher button').forEach(b=>{
  b.addEventListener('click', ()=>goTo(b.dataset.page));
});

function renderPage(page){
  const el = document.getElementById('page-'+page);
  if(el.dataset.rendered) { afterRender(page); return; }
  el.innerHTML = TEMPLATES[page]();
  el.dataset.rendered = '1';
  afterRender(page);
}


/* ============ shared app-shell builders ============ */
function sidebar(active){
  const items = [
    {key:'dashboard', label:'Dashboard'},
    {key:'resume', label:'Resume Analyzer'},
    {key:'interview', label:'Mock Interview'},
    {key:'coding', label:'Coding Hub'},
  ];
  return `
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-mark">${ic.qr}</div>
      <div class="brand-text"><div class="name">SyntacHire AI</div><div class="tag">Intelligent Calibration</div></div>
    </div>
    <nav class="nav-group">
      ${items.map(i=>`<a href="#" class="nav-item ${i.key===active?'active':''}" onclick="goTo('${i.key}');return false;">${navIcon[i.key]}<span>${i.label}</span></a>`).join('')}
    </nav>
    <a href="#" class="nav-item" style="margin-top:2px;">${ic.gear}<span>Settings</span></a>
    <div class="sidebar-spacer"></div>
    <div class="upgrade-card">
      <div class="t">Upgrade to Pro</div>
      <div class="d">Unlock unlimited AI mock sessions and advanced ATS hacks.</div>
      <button class="btn btn-primary btn-block">Upgrade</button>
    </div>
    <div class="sidebar-foot">
      <a href="#" class="nav-item">${ic.help}<span>Help Center</span></a>
      <a href="#" class="nav-item" onclick="logout();return false;">${ic.logout}<span>Logout</span></a>
    </div>
  </aside>`;
}

function appFooter(){
  return `
  <footer class="app-footer">
    <div>
      <div class="brand">SyntacHire AI</div>
      <div>© 2024 SyntacHire AI. Calibrating careers with precision.</div>
    </div>
    <nav><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Careers</a><a href="#">Support</a></nav>
  </footer>`;
}

function topbar(title, sub, opts={}){
  const userInitial = currentUser ? currentUser.name.charAt(0).toUpperCase() : 'A';
  return `
  <header class="topbar">
    <div>
      <h1>${title}</h1>
      ${sub ? `<div class="sub">${sub}</div>` : ''}
    </div>
    <div class="topbar-right">
      ${opts.extra || ''}
      <button class="icon-btn">${ic.bell}</button>
      <div class="avatar" title="${currentUser ? currentUser.name : 'User'}">${userInitial}</div>
    </div>
  </header>`;
}

/* ============ TEMPLATES ============ */
const TEMPLATES = {};

TEMPLATES.login = () => `
<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <div class="auth-logo">${ic.qr}SyntacHire AI</div>
      <h1>Welcome Back</h1>
      <p>Sign in to access your career calibration dashboard</p>
    </div>
    <form onsubmit="handleLogin(event)">
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" id="login-email" placeholder="you@example.com" required>
        <div class="form-error" id="email-error"></div>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="login-password" placeholder="••••••••" required>
        <div class="form-error" id="password-error"></div>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="remember-me">
        <label for="remember-me">Remember me</label>
        <a href="#" onclick="goTo('forgot');return false;">Forgot password?</a>
      </div>
      <button type="submit" class="auth-submit">Sign In</button>
    </form>
    <div class="auth-divider">or continue with</div>
    <div class="auth-socials">
      <button type="button" class="social-btn" onclick="handleSocialLogin('google')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Google
      </button>
      <button type="button" class="social-btn" onclick="handleSocialLogin('github')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </button>
    </div>
    <div class="auth-footer">
      Don't have an account? <a href="#" onclick="goTo('signup');return false;">Sign up</a>
    </div>
  </div>
</div>
`;

TEMPLATES.signup = () => `
<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <div class="auth-logo">${ic.qr}SyntacHire AI</div>
      <h1>Join SyntacHire</h1>
      <p>Start your journey to landing your dream tech job</p>
    </div>
    <form onsubmit="handleSignup(event)">
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" id="signup-name" placeholder="Alex Johnson" required>
        <div class="form-error" id="name-error"></div>
      </div>
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" id="signup-email" placeholder="you@example.com" required>
        <div class="form-error" id="signup-email-error"></div>
      </div>
      <div class="form-group two-col">
        <div>
          <label>Experience Level</label>
          <select id="experience" required>
            <option value="">Select level</option>
            <option value="junior">Junior (0-2 years)</option>
            <option value="mid">Mid-level (2-5 years)</option>
            <option value="senior">Senior (5+ years)</option>
          </select>
        </div>
        <div>
          <label>Target Role</label>
          <input type="text" id="target-role" placeholder="e.g. Backend Engineer" required>
        </div>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="signup-password" placeholder="••••••••" required>
        <div class="form-error" id="signup-password-error"></div>
      </div>
      <div class="form-group">
        <label>Confirm Password</label>
        <input type="password" id="signup-confirm" placeholder="••••••••" required>
        <div class="form-error" id="confirm-error"></div>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="terms" required>
        <label for="terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
      </div>
      <button type="submit" class="auth-submit">Create Account</button>
    </form>
    <div class="auth-divider">or sign up with</div>
    <div class="auth-socials">
      <button type="button" class="social-btn" onclick="handleSocialLogin('google')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Google
      </button>
      <button type="button" class="social-btn" onclick="handleSocialLogin('github')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </button>
    </div>
    <div class="auth-footer">
      Already have an account? <a href="#" onclick="goTo('login');return false;">Sign in</a>
    </div>
  </div>
</div>
`;

TEMPLATES.landing = () => `
<nav class="lp-nav">
    <div class="lp-logo">SyntacHire AI</div>
    <div class="lp-links">
      <a href="#" class="active" onclick="goTo('dashboard');return false;">Dashboard</a>
      <a href="#" onclick="goTo('resume');return false;">Resume</a>
      <a href="#" onclick="goTo('interview');return false;">Interview</a>
      <a href="#" onclick="goTo('coding');return false;">Coding</a>
    </div>
    <div class="lp-nav-right">
      <div class="search-box">${ic.search}<span>Search...</span></div>
      <button class="icon-btn">${ic.bell}</button>
      <button class="icon-btn">${ic.settings}</button>
      <div class="avatar">A</div>
    </div>
  </nav>

  <header class="hero">
    <div class="hero-grid">
      <div>
        <span class="hero-eyebrow">${ic.sparkle} AI-Powered Career Intelligence</span>
        <h1>Calibrate Your Career with <span class="accent">AI Precision</span></h1>
        <p>SyntacHire AI transforms your job search into a data-driven journey. Optimize your resume for ATS, simulate high-stakes interviews, and bridge your skill gaps with intelligent precision.</p>
        <div class="hero-ctas">
          <button class="btn btn-primary" onclick="goTo('dashboard')">Get Started for Free ${ic.arrowR}</button>
          <button class="btn btn-secondary" onclick="goTo('interview')">View Demo</button>
        </div>
        <div class="hero-social">
          <div class="avatar-stack"><span></span><span></span><span></span></div>
          <small>Joined by 10k+ professionals this month</small>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-shot">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" alt="Dashboard preview on laptop">
        </div>
        <div class="floating-card">
          <div class="dot">${ic.checkSm}</div>
          <div>
            <div class="ft">ATS Score: 94%</div>
            <div class="fd">"Highly optimized for Senior Engineer roles at Tier 1 firms."</div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <section class="section">
    <div class="section-head">
      <h2>Master Every Stage of the Process</h2>
      <p>Our intelligent engine analyzes every data point to give you the competitive edge in today's ruthless job market.</p>
    </div>
    <div class="feature-grid">
      <div class="card feature-card light">
        <div class="feature-icon">${ic.doc}</div>
        <h3>AI Resume Scoring</h3>
        <p>Real-time ATS optimization that analyzes your content against industry-specific keywords and semantic relevance.</p>
        <div class="tag-row"><span>Keyword Density</span><span>Format Check</span></div>
      </div>
      <div class="card feature-card dark">
        <div class="feature-icon">${ic.chart}</div>
        <h3>Skill Gap Analysis</h3>
        <p>We map your skills against millions of job descriptions to find what you're missing.</p>
      </div>
      <div class="card feature-card tint">
        <div class="feature-icon">${ic.mic}</div>
        <h3>Mock Interviews</h3>
        <p>Practice HR and Technical rounds with AI avatars that provide instant behavioral feedback.</p>
        <a href="#" class="feature-link" onclick="goTo('interview');return false;">Launch Room ${ic.arrowR}</a>
      </div>
      <div class="card feature-card light">
        <div class="feature-icon">${ic.code}</div>
        <h3>Coding Practice</h3>
        <p>Tackle algorithmic challenges in an integrated AI-powered IDE with real-time code optimization hints.</p>
        <div class="code-preview">
          <div class="dots"><span></span><span></span><span></span></div>
          <div><span class="kw">function</span> <span class="fn">optimizeCareer</span>() {</div>
          <div>&nbsp;&nbsp;const skills = AI.analyze(resume);</div>
          <div>&nbsp;&nbsp;<span class="kw">return</span> skills.prepare();</div>
          <div>}</div>
          <div class="cm">// AI Suggestion: Use Map for O(1) lookups</div>
        </div>
      </div>
    </div>
  </section>

  <section class="process-band">
    <div class="section-head">
      <h2>Your Path to the Offer</h2>
    </div>
    <div class="process-steps">
      <div class="process-step">
        <div class="num-circle">${ic.upload}</div>
        <h4>Upload</h4>
        <p>Drop your resume or LinkedIn profile into our engine.</p>
      </div>
      <div class="process-step">
        <div class="num-circle">${ic.target}</div>
        <h4>Analyze</h4>
        <p>AI identifies gaps and optimizes your pitch for ATS.</p>
      </div>
      <div class="process-step">
        <div class="num-circle">${ic.mic}</div>
        <h4>Practice</h4>
        <p>Simulate realistic interviews and coding challenges.</p>
      </div>
      <div class="process-step">
        <div class="num-circle">${ic.award}</div>
        <h4>Get Hired</h4>
        <p>Walk into your dream job with total confidence.</p>
      </div>
    </div>
    <div class="process-cta">
      <button class="btn btn-primary" onclick="goTo('dashboard')">Start Your Calibration Now</button>
    </div>
  </section>

  <section class="stats-band">
    <div class="stats-grid">
      <div><div class="num">94%</div><div class="lbl">ATS Success Rate</div></div>
      <div><div class="num">12M+</div><div class="lbl">Resumes Scanned</div></div>
      <div><div class="num">45k</div><div class="lbl">Job Offers Secured</div></div>
      <div><div class="num">3.5x</div><div class="lbl">Average Salary Increase</div></div>
    </div>
  </section>

  <footer class="lp-footer">
    <div>
      <div class="brand">SyntacHire AI</div>
      <p>© 2024 SyntacHire AI. Calibrating careers with precision.</p>
    </div>
    <nav><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Careers</a><a href="#">Support</a></nav>
    <div class="lp-footer-icons"><span>${ic.globe}</span><span>${ic.share}</span></div>
  </footer>
`;

TEMPLATES.dashboard = () => `
<div class="app-shell">
  ${sidebar('dashboard')}
  <main class="main">
    ${topbar(`Welcome back, ${currentUser ? currentUser.name.split(' ')[0] : 'Alex'}`, new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))}
    <div class="content">

      <div class="dash-grid">
        <div class="card hero-insight">
          <div class="insight-eyebrow">${ic.sparkleLg} AI RESUME INSIGHTS</div>
          <h2>ATS Resume Score</h2>
          <p>Your resume is currently outperforming 85% of applicants in your field. Apply AI suggestions to reach 95%.</p>
          <div class="score-row">
            <div>
              <div class="score-big">85<span>%</span></div>
              <div class="score-delta">${ic.trend} +12% since last month</div>
            </div>
            <button class="btn btn-primary" onclick="goTo('resume')">Full Analysis ${ic.arrowR}</button>
          </div>
        </div>
        <div class="quick-links">
          <div class="card quick-link" onclick="goTo('resume')">
            <div class="qi">${ic.file}</div>
            <div><div class="qt">Resume Check</div><div class="qd">Optimize for keywords</div></div>
          </div>
          <div class="card quick-link" onclick="goTo('interview')">
            <div class="qi">${ic.mic2}</div>
            <div><div class="qt">Start Mock Interview</div><div class="qd">Practice with AI Coach</div></div>
          </div>
          <div class="card quick-link" onclick="goTo('coding')">
            <div class="qi">${ic.codeBrack}</div>
            <div><div class="qt">Practice Coding</div><div class="qd">450+ LeetCode style tasks</div></div>
          </div>
        </div>
      </div>

      <div class="stat-row">
        <div class="card stat-card">
          <div class="st-head"><span class="st-label">Interviews Completed</span><span class="st-icon">${ic.video}</span></div>
          <div class="st-num">12</div>
          <div class="bar-track"><div class="bar-fill" style="width:60%"></div></div>
          <div class="st-foot">60% target</div>
        </div>
        <div class="card stat-card">
          <div class="st-head"><span class="st-label">Problems Solved</span><span class="st-icon">${ic.terminal}</span></div>
          <div class="st-num">48</div>
          <div class="bar-track"><div class="bar-fill green" style="width:80%"></div></div>
          <div class="st-foot">80% target</div>
        </div>
        <div class="card stat-card">
          <div class="st-head"><span class="st-label">Skill Matrix</span><span class="st-icon">${ic.info}</span></div>
          <div class="radar-wrap">
            ${radarSVG()}
            <div class="radar-legend">
              <span><i class="dotlg" style="background:var(--blue-600)"></i>Technical: 88</span>
              <span><i class="dotlg" style="background:var(--blue-100)"></i>HR: 64</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-grid">
        <div class="card">
          <div class="panel-head"><h3>Recent Activity</h3><a href="#">View History</a></div>
          <div class="activity-list">
            <div class="activity-row">
              <div class="act-icon">${ic.file}</div>
              <div class="act-body"><div class="act-title">Resume Uploaded</div><div class="act-sub">Senior_SDE_V3.pdf • 2.4 MB</div></div>
              <div class="act-right"><div class="act-time">2 hours ago</div><div class="act-status good">Analyzed</div></div>
            </div>
            <div class="activity-row">
              <div class="act-icon">${ic.award}</div>
              <div class="act-body"><div class="act-title">Mock Test Performance</div><div class="act-sub">Backend System Design • Score: 78%</div></div>
              <div class="act-right"><div class="act-time">Yesterday</div><div class="act-status good">Good</div></div>
            </div>
            <div class="activity-row">
              <div class="act-icon">${ic.codeBrack}</div>
              <div class="act-body"><div class="act-title">Problem Solved</div><div class="act-sub">LRU Cache Implementation (Hard)</div></div>
              <div class="act-right"><div class="act-time">Oct 12</div><div class="act-status good">Success</div></div>
            </div>
          </div>
        </div>
        <div>
          <div class="card coach-card">
            <div class="coach-head">${ic.brain} AI COACH TIP</div>
            <h4>Focus on Behavioral questions today.</h4>
            <p>Your technical scores are soaring, but your communication score in the last mock test dipped. We've prepared a "STAR Method" refresher for you.</p>
            <button class="btn btn-secondary btn-block" onclick="goTo('interview')">Start Behavioral Practice</button>
          </div>
          <div class="card report-card">
            <div class="ricon">${ic.doc}</div>
            <div><div class="rt">Weekly Career Report</div><div class="rd">Your tailored insights for Week 42 are ready to download.</div></div>
          </div>
        </div>
      </div>

    </div>
    ${appFooter()}
  </main>
</div>`;

function radarSVG(){
  // 7-sided radar mimicking screenshot: outer ring + inner filled polygon
  const cx=90, cy=80, rOuter=64, rMid=42, rInner=20;
  const pts = (r)=>{
    const n=7, arr=[];
    for(let i=0;i<n;i++){
      const a = -Math.PI/2 + i*(2*Math.PI/n);
      arr.push([cx+r*Math.cos(a), cy+r*Math.sin(a)]);
    }
    return arr.map(p=>p.join(',')).join(' ');
  };
  return `
  <svg width="180" height="150" viewBox="0 0 180 150">
    <polygon points="${pts(rOuter)}" fill="none" stroke="#e4e7f2" stroke-width="1.5"/>
    <polygon points="${pts(rMid)}" fill="none" stroke="#e4e7f2" stroke-width="1.5"/>
    <polygon points="${pts(rInner)}" fill="none" stroke="#e4e7f2" stroke-width="1.5"/>
    <polygon points="${pts(56)}" fill="#2648d6" fill-opacity="0.18" stroke="#2648d6" stroke-width="2"/>
    <text x="90" y="10" text-anchor="middle" font-size="10.5" fill="#6b7086" font-family="Inter">Technical</text>
    <text x="90" y="145" text-anchor="middle" font-size="10.5" fill="#6b7086" font-family="Inter">HR / Soft Skills</text>
  </svg>`;
}

TEMPLATES.resume = () => `
<div class="app-shell">
  ${sidebar('resume')}
  <main class="main">
    ${topbar('AI Resume Insights', 'Calibrate your profile for applicant tracking systems with machine precision.', {extra:`
      <div class="avatar-stack" style="margin-right:6px;"><span></span><span></span></div>
    `})}
    <div class="content">
      <div class="resume-grid">
        <div class="card">
          <div id="dropzone" class="dropzone">
            <div class="dz-icon">${ic.upload}</div>
            <h2>Upload Your Resume</h2>
            <p>Drag and drop your PDF or DOCX file here to begin the intelligent analysis.</p>
            <button class="btn btn-primary" id="selectFileBtn">Select File</button>
            <div class="dz-max">MAX SIZE 5MB</div>
          </div>
          <div class="file-progress" id="fileProgress">
            <div class="fp-row">
              <div class="fp-icon">${ic.filecheck}</div>
              <div style="flex:1;">
                <div class="fp-name">Senior_SDE_Resume.pdf</div>
                <div class="fp-size">2.4 MB • Analyzing…</div>
              </div>
            </div>
            <div class="bar-track"><div class="bar-fill" id="fpBar" style="width:0%"></div></div>
          </div>
        </div>
        <div>
          <div class="card tip-card">
            <div class="tip-head">${ic.lightbulb} Pro Analysis Tip</div>
            <p>Our AI checks for "Action Verbs" like <em>Optimized</em>, <em>Engineered</em>, and <em>Spearheaded</em>. Replacing generic tasks with results-driven language can boost your ATS score by up to 15%.</p>
            <a href="#">Learn more about ATS optimization ${ic.arrowR}</a>
          </div>
          <div class="card pathing-card">
            <h4>AI Career Pathing</h4>
            <p>After your analysis, we'll suggest specific job titles that match your unique skill fingerprint.</p>
          </div>
        </div>
      </div>
    </div>
    ${appFooter()}
  </main>
</div>`;

function initResumePage(){
  const dz = document.getElementById('dropzone');
  const btn = document.getElementById('selectFileBtn');
  const fp = document.getElementById('fileProgress');
  const bar = document.getElementById('fpBar');
  if(!dz) return;
  const simulate = () => {
    fp.classList.add('show');
    bar.style.width='0%';
    requestAnimationFrame(()=>{ bar.style.transition='width 1.6s ease'; bar.style.width='100%'; });
    setTimeout(()=>{
      const sub = fp.querySelector('.fp-size');
      if(sub) sub.textContent = '2.4 MB • Analysis complete — ATS Score: 85%';
    }, 1700);
  };
  btn.addEventListener('click', simulate);
  ['dragenter','dragover'].forEach(evt=>dz.addEventListener(evt, e=>{e.preventDefault(); dz.classList.add('drag');}));
  ['dragleave','drop'].forEach(evt=>dz.addEventListener(evt, e=>{e.preventDefault(); dz.classList.remove('drag');}));
  dz.addEventListener('drop', simulate);
}

TEMPLATES.interview = () => `
<div class="app-shell">
  ${sidebar('interview')}
  <main class="main">
    <header class="topbar">
      <div style="display:flex; align-items:center; gap:12px;">
        <span class="pill" style="background:var(--green-bg); color:var(--green);"><i class="live-dot"></i> Active Session: Technical Interview</span>
        <strong style="font-size:14.5px; color:var(--blue-600);">Senior SDE Role</strong>
      </div>
      <div class="topbar-right">
        <div class="avatar" style="width:32px;height:32px;font-size:11px;">AI</div>
        <button class="icon-btn">${ic.bell}</button>
      </div>
    </header>
    <div class="content">

      <div class="interview-grid">
        <div>
          <div class="video-frame">
            <img src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1200&auto=format&fit=crop" alt="Interview room">
            <div class="rec-badge"><span class="reddot"></span> REC 00:12:45</div>
            <div class="prompt-box">
              <div class="prompt-eyebrow">${ic.doc} AI INTERVIEWER PROMPT</div>
              <div class="q">"Tell me about a time you handled a difficult technical challenge."</div>
            </div>
          </div>

          <div class="card response-card">
            <div class="resp-head">
              <div class="rl">${ic.doc} Your Response</div>
              <div class="rmeta">Word count: <span id="wcount">0</span> &nbsp;|&nbsp; <span id="saveStatus">Idle</span></div>
            </div>
            <textarea class="response-input" id="responseInput" placeholder="Type your response here using the STAR method for best results..."></textarea>
            <div class="resp-foot">
              <button class="btn btn-secondary">${ic.skip} Skip</button>
              <button class="btn btn-primary" id="submitAnswerBtn">Submit Answer ${ic.send}</button>
            </div>
          </div>
        </div>

        <div>
          <div class="card progress-card">
            <div class="progress-top">
              <div><div class="l">Session Progress</div><div class="v">3 <span>of 10</span></div></div>
              <div style="text-align:right;"><div class="l">Time Elapsed</div><div class="v">14:32</div></div>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:30%"></div></div>
            <div class="stage-row">
              <span class="done">${ic.checkSm} Intro (Done)</span>
              <span class="cur">${ic.info} Technical</span>
            </div>
          </div>

          <div class="card insights-card">
            <div class="insights-head">${ic.sparkleLg} REAL-TIME INSIGHTS</div>
            <div class="metric-row">
              <div class="metric-top"><span>Sentiment Tone</span><span class="chip pos">Positive</span></div>
              <div class="bar-track"><div class="bar-fill green" style="width:78%"></div></div>
            </div>
            <div class="metric-row">
              <div class="metric-top"><span>Answer Clarity</span><span class="chip good">Good</span></div>
              <div class="bar-track"><div class="bar-fill" style="width:68%"></div></div>
            </div>
            <div class="hint-box">
              <div style="color:var(--blue-600); flex-shrink:0;">${ic.lightbulb}</div>
              <p><strong>AI Hint:</strong> "You're doing great! Try to quantify your impact in this answer. For example, use percentages or time saved to make the 'Results' part of your STAR response more concrete."</p>
            </div>
            <div class="score-ring-wrap">
              <div class="lbl">Estimated Current Score</div>
              ${ringSVG(80)}
            </div>
          </div>

          <button class="btn btn-outline-red btn-block" style="margin-top:20px;">${ic.x} End Session</button>
        </div>
      </div>
    </div>
    ${appFooter()}
  </main>
</div>`;

function ringSVG(pct){
  const r=46, c=2*Math.PI*r, off=c*(1-pct/100);
  return `
  <svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="#e4e7f2" stroke-width="10"/>
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="#2648d6" stroke-width="10" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 60 60)"/>
    <text x="60" y="67" text-anchor="middle" font-size="24" font-weight="800" fill="#0e1220" font-family="Inter">${pct}%</text>
  </svg>`;
}

function initInterviewPage(){
  const input = document.getElementById('responseInput');
  const wcount = document.getElementById('wcount');
  const save = document.getElementById('saveStatus');
  const submitBtn = document.getElementById('submitAnswerBtn');
  if(!input) return;
  let saveTimer;
  input.addEventListener('input', ()=>{
    const words = input.value.trim().split(/\s+/).filter(Boolean).length;
    wcount.textContent = words;
    save.textContent = 'Saving…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(()=>{ save.textContent = 'Auto-saved'; }, 700);
  });
  submitBtn.addEventListener('click', ()=>{
    submitBtn.textContent = 'Submitted ✓';
    submitBtn.disabled = true;
    setTimeout(()=>{ submitBtn.textContent = 'Submit Answer'; submitBtn.disabled=false; }, 1400);
  });
}

const PROBLEMS = [
  {status:'done', name:'Reversing a Linked List', desc:'Classic pointer manipulation task.', cat:'Data Structures', diff:'easy', rate:'88.4%'},
  {status:'todo', name:'Rate Limiter Design', desc:'Sliding window vs Token Bucket.', cat:'System Design', diff:'medium', rate:'32.1%'},
  {status:'todo', name:'Optimizing Database Sharding', desc:'Scalability & Partitioning strategies.', cat:'System Design', diff:'hard', rate:'12.5%'},
  {status:'done', name:'N-Queens Problem', desc:'Recursive backtracking challenge.', cat:'Algorithms', diff:'medium', rate:'45.0%'},
];

function problemRow(p){
  const statusIcon = p.status==='done'
    ? `<span class="status-check done">${ic.checkSm}</span>`
    : `<span class="status-check todo"></span>`;
  const actionBtn = p.status==='done'
    ? `<button class="btn btn-secondary" style="padding:8px 16px;">Re-solve</button>`
    : `<button class="btn btn-primary" style="padding:8px 16px;">Solve</button>`;
  return `
  <tr>
    <td>${statusIcon}</td>
    <td><div class="prob-name">${p.name}</div><div class="prob-desc">${p.desc}</div></td>
    <td style="font-size:13.5px;color:var(--ink-700);">${p.cat}</td>
    <td><span class="diff-badge ${p.diff}">${p.diff.charAt(0).toUpperCase()+p.diff.slice(1)}</span></td>
    <td style="font-size:13.5px;color:var(--ink-700);">${p.rate}</td>
    <td style="text-align:right;">${actionBtn}</td>
  </tr>`;
}

TEMPLATES.coding = () => `
<div class="app-shell">
  ${sidebar('coding')}
  <main class="main">
    ${topbar('Coding Skills Calibration', 'Master high-stakes technical interviews with AI-driven problem selection tailored to your specific career trajectory.', {extra:`
      <div class="seg" id="tabSeg">
        <button class="active" data-tab="list">Problem List</button>
        <button data-tab="board">Leaderboard</button>
      </div>
    `})}
    <div class="content">

      <div class="coding-stat-grid">
        <div class="card solved-card">
          <div class="lbl">TOTAL SOLVED</div>
          <div class="num">142</div>
          <div class="delta">${ic.trend} +12 this week</div>
        </div>
        <div class="card breakdown-card">
          <div class="lbl">BREAKDOWN BY CATEGORY</div>
          <div class="bd-row"><div class="bd-top"><span>Algorithms</span><span>64/100</span></div><div class="bar-track"><div class="bar-fill" style="width:64%"></div></div></div>
          <div class="bd-row"><div class="bd-top"><span>Data Structures</span><span>48/80</span></div><div class="bar-track"><div class="bar-fill green" style="width:60%"></div></div></div>
          <div class="bd-row" style="margin-bottom:0;"><div class="bd-top"><span>System Design</span><span>30/120</span></div><div class="bar-track"><div class="bar-fill" style="width:25%;background:var(--ink-300);"></div></div></div>
        </div>
        <div class="card pick-card">
          <div class="pick-eyebrow">${ic.sparkleLg} AI Calibration Pick</div>
          <p>Based on your recent resume analysis, we found a gap in <em>Concurrency Patterns</em>. Solve this to improve your score.</p>
          <div class="pick-problem">
            <div class="pr-top"><span class="diff-badge hard">HARD</span><span style="font-size:12px;color:var(--ink-500);">Rate: 18%</span></div>
            <div class="pt">Thread-Safe LRU Cache</div>
            <div class="ps">Commonly asked at Stripe & Meta</div>
          </div>
          <button class="btn btn-primary btn-block" onclick="goTo('interview')">Start Challenge ${ic.arrowR}</button>
        </div>
      </div>

      <div class="card filter-card">
        <div class="filter-group">
          <span class="fl">Problem Type</span>
          <button class="chip-btn active">All</button>
          <button class="chip-btn">Algorithms</button>
          <button class="chip-btn">Data Structures</button>
          <button class="chip-btn">System Design</button>
        </div>
        <div class="filter-group">
          <span class="fl">Difficulty</span>
          <button class="chip-btn"><i class="sdot" style="background:var(--green)"></i>Easy</button>
          <button class="chip-btn"><i class="sdot" style="background:var(--amber)"></i>Medium</button>
          <button class="chip-btn"><i class="sdot" style="background:var(--red)"></i>Hard</button>
        </div>
        <div class="search-input">${ic.search}<input type="text" placeholder="Search problems..."></div>
      </div>

      <div class="card" style="overflow:hidden;">
        <table class="problems-table">
          <thead><tr><th>STATUS</th><th>PROBLEM NAME</th><th>CATEGORY</th><th>DIFFICULTY</th><th>SUCCESS RATE</th><th></th></tr></thead>
          <tbody>${PROBLEMS.map(problemRow).join('')}</tbody>
        </table>
        <div class="table-foot">
          <div class="tf-l">Showing 4 of 248 problems</div>
          <div class="pager">
            <button>${ic.chevL}</button>
            <button class="active">1</button>
            <button>2</button>
            <button>${ic.chevR}</button>
          </div>
        </div>
      </div>

      <div class="promo-grid">
        <div class="streak-card">
          <span class="streak-tag">DAILY STREAK: 12 DAYS</span>
          <h4>Keep the momentum.</h4>
          <p>Complete just one more problem today to earn the "Precision Coder" badge.</p>
          <div class="streak-foot">
            <button class="btn btn-secondary">Claim Daily Bonus</button>
            <small>Expires in 4h 12m</small>
          </div>
        </div>
        <div class="session-card">
          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop" alt="Live coding session">
          <div class="sc-body">
            <div class="sc-tag">TECHNICAL MOCK LIVE</div>
            <h4>Join a peer-to-peer session and calibrate your real-time coding speed.</h4>
            <a href="#">Explore Sessions ${ic.arrowR}</a>
          </div>
        </div>
      </div>

    </div>
    ${appFooter()}
  </main>
</div>`;

function initCodingPage(){
  document.querySelectorAll('.filter-card .filter-group:first-child .chip-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-card .filter-group:first-child .chip-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
    });
  });
  document.querySelectorAll('.filter-card .filter-group:last-child .chip-btn').forEach(b=>{
    b.addEventListener('click', ()=> b.classList.toggle('active'));
  });
  const seg = document.getElementById('tabSeg');
  if(seg){
    seg.querySelectorAll('button').forEach(b=>{
      b.addEventListener('click', ()=>{
        seg.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
      });
    });
  }
}

function afterRender(page){
  if(page==='resume') initResumePage();
  if(page==='interview') initInterviewPage();
  if(page==='coding') initCodingPage();
}

/* ============ Authentication Logic ============ */
let currentUser = null;

// Simple in-memory storage (replace with real backend)
const users = {
  'alex@example.com': { password: 'demo123', name: 'Alex Johnson', experience: 'mid', role: 'Full Stack Engineer' },
  'demo@demo.com': { password: 'demo123', name: 'Demo User', experience: 'senior', role: 'Backend Engineer' }
};

function handleLogin(e){
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  clearErrors();
  
  if(!email || !password){
    showError('email-error', 'Please enter your email and password');
    return;
  }
  
  if(email in users && users[email].password === password){
    currentUser = { email, ...users[email] };
    localStorage.setItem('user', JSON.stringify(currentUser));
    goTo('dashboard');
  } else {
    showError('email-error', 'Invalid email or password');
  }
}

function handleSignup(e){
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const experience = document.getElementById('experience').value;
  const targetRole = document.getElementById('target-role').value;
  
  clearErrors();
  
  if(!name || !email || !password || !confirm || !experience || !targetRole){
    showError('name-error', 'Please fill in all fields');
    return;
  }
  
  if(password !== confirm){
    showError('confirm-error', 'Passwords do not match');
    return;
  }
  
  if(password.length < 6){
    showError('signup-password-error', 'Password must be at least 6 characters');
    return;
  }
  
  if(email in users){
    showError('signup-email-error', 'Email already registered');
    return;
  }
  
  // Register user
  users[email] = { password, name, experience, role: targetRole };
  currentUser = { email, ...users[email] };
  localStorage.setItem('user', JSON.stringify(currentUser));
  goTo('dashboard');
}

function handleSocialLogin(provider){
  // Mock social login
  const mockEmail = provider === 'google' ? 'user@gmail.com' : 'user@github.com';
  currentUser = {
    email: mockEmail,
    name: 'Social User',
    experience: 'mid',
    role: 'Software Engineer',
    provider: provider
  };
  localStorage.setItem('user', JSON.stringify(currentUser));
  goTo('dashboard');
}

function showError(elementId, message){
  const el = document.getElementById(elementId);
  if(el){
    el.textContent = message;
    el.classList.add('show');
  }
}

function clearErrors(){
  document.querySelectorAll('.form-error').forEach(e => {
    e.classList.remove('show');
    e.textContent = '';
  });
}

function logout(){
  currentUser = null;
  localStorage.removeItem('user');
  goTo('login');
}

// Check if user is logged in on page load
function checkAuth(){
  const stored = localStorage.getItem('user');
  if(stored){
    currentUser = JSON.parse(stored);
    goTo('dashboard');
  } else {
    goTo('login');
  }
}

/* initial paint */
checkAuth();
