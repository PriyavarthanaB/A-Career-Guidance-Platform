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

  
// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/analyzer" element={<ResumeAnalyzer />} />
        <Route path="/practice" element={<CodingEditor />} />
        <Route path="/coding-practice" element={<CodingPractice />} />
        <Route path="/module/:id/theory" element={<TheoryPage />} />
        <Route path="/module/:id/practice" element={<PracticePage />} />
        <Route path="/problem/:id" element={<CodingWorkspace />} />
        <Route path="/coding-hub" element={<CodingHub />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}