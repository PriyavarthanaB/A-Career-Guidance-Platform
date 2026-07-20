# SyntacHire React Frontend

A modern, production-ready React implementation of the SyntacHire AI career platform. This version features a complete rewrite using React, TypeScript, and Vite with React Router for navigation.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

```bash
cd syntachire-react
npm install
```

### Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
syntachire-react/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Icons.tsx        # SVG icon components
│   │   └── Layout.tsx       # Sidebar, Topbar, Footer
│   ├── context/             # React Context for state management
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Pages.tsx        # Resume, Interview, CodingHub
│   │   └── Logout.tsx
│   ├── styles/              # CSS modules
│   │   ├── globals.css
│   │   ├── auth.css
│   │   ├── layout.css
│   │   ├── dashboard.css
│   │   └── pages.css
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🔑 Key Features

### Authentication
- **Login Page**: Email/password authentication with "Remember me" option
- **Signup Page**: Full registration with experience level selection
- **Session Management**: Persistent localStorage sessions
- **Protected Routes**: Automatic redirection for unauthenticated users

### Pages
1. **Dashboard**: Main hub with ATS score, quick links, stats, and activity
2. **Resume Analyzer**: File upload and ATS optimization analysis
3. **Mock Interview**: Interactive interview practice simulation
4. **Coding Hub**: LeetCode-style coding challenges

### UI Components
- **Sidebar Navigation**: Quick access to all major sections
- **Topbar**: Page title and notifications
- **Cards**: Reusable card components with various styles
- **Forms**: Full validation and error handling
- **Icons**: 25+ inline SVG icons

## 🎨 Design System

### Color Palette
- **Blue**: `#2648d6` (Primary), `#2f5be0`, `#5b7cf0`, `#e7ecfd`, `#f1f4fe`
- **Green**: `#1a9c62` (Success)
- **Red**: `#d64545` (Error)
- **Amber**: `#c98a1a` (Warning)
- **Gray**: `#3a3f52` to `#9aa0b4` (Text), `#e4e7f2` (Border)

### Responsive Breakpoints
- **Desktop**: 1024px+ (Full sidebar)
- **Tablet**: 768px - 1023px (Adjusted layouts)
- **Mobile**: < 768px (Horizontal sidebar, simplified)

## 🔐 Authentication

### Test Accounts
```
Email: alex@example.com
Password: demo123

Email: demo@demo.com
Password: demo123
```

### Authentication Flow
1. User enters credentials
2. Validated against mock user database
3. User stored in Context and localStorage
4. Session persists across browser refresh
5. Protected routes automatically redirect unauthenticated users

## 📦 Dependencies

- **react-router-dom**: Client-side routing
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **react**: UI library

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run TypeScript compiler check
```

### Code Style
- TypeScript for type safety
- Functional components with hooks
- CSS modules for styling
- Semantic HTML5

## 🔄 State Management

State is managed using React Context API:
- `AuthContext`: Handles authentication state and operations
- `useAuth()` hook: Access auth state from any component

```typescript
const { currentUser, login, signup, logout } = useAuth();
```

## 📱 Responsive Design

All components are fully responsive:
- Flexbox and CSS Grid layouts
- Mobile-first approach
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Netlify
```bash
netlify deploy --prod --dir dist
```

### Deploy to Vercel
```bash
vercel --prod
```

## 📝 Environment Variables

Create a `.env` file if needed for API endpoints:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🐛 Debugging

### Browser DevTools
- React DevTools extension recommended
- Redux DevTools for state inspection
- Network tab for API debugging

### Console Logging
The app logs to browser console for debugging:
```typescript
console.log('Current user:', currentUser);
```

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Email verification
- [ ] 2FA authentication
- [ ] Password reset flow
- [ ] User profile customization
- [ ] Real mock interview with AI
- [ ] Coding IDE with real-time compilation
- [ ] Resume PDF parsing
- [ ] Payment integration for Pro tier

## 📄 License

Proprietary - SyntacHire AI 2024

## 🤝 Support

For issues or questions, contact the development team.

---

**Last Updated**: July 20, 2024
**Version**: 1.0.0
