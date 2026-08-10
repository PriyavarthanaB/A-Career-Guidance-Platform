import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CodingPractice from './pages/CodingPractice';
import CodingEditor from './pages/CodingEditor';
import CodingHub from './pages/CodingHub';
import TheoryPage from './pages/TheoryPage';
import PracticePage from './pages/PracticePage';
import CodingWorkspace from './pages/CodingWorkspace';
import MockInterview from './pages/MockInterview';
import InterviewSession from './pages/InterviewSession';
import Settings from './pages/Settings';

// Protected Route Guard
const isValidToken = (token) => {
  return (
    typeof token === 'string' &&
    token.trim().length > 0 &&
    token !== 'undefined' &&
    token !== 'null'
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!isValidToken(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App routes protected by auth */}
        <Route
          path="/analyzer"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <CodingEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coding-practice"
          element={
            <ProtectedRoute>
              <CodingPractice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/module/:id/theory"
          element={
            <ProtectedRoute>
              <TheoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/module/:id/practice"
          element={
            <ProtectedRoute>
              <PracticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problem/:id"
          element={
            <ProtectedRoute>
              <CodingWorkspace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coding-hub"
          element={
            <ProtectedRoute>
              <CodingHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <MockInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-interview/session"
          element={
            <ProtectedRoute>
              <InterviewSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}