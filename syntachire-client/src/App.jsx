import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Signup from './pages/Signup';

// Simple Protected Route check
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;

};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/analyzer" 
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

