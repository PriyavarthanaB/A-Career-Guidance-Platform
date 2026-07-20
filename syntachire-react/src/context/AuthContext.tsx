import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const MOCK_USERS: Record<string, User> = {
  'alex@example.com': {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'demo123',
    experience: 'mid',
    role: 'Full Stack Engineer',
  },
  'demo@demo.com': {
    name: 'Demo User',
    email: 'demo@demo.com',
    password: 'demo123',
    experience: 'senior',
    role: 'Backend Engineer',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = MOCK_USERS[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword as User);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const signup = async (userData: Omit<User, 'password'> & { password: string; confirmPassword: string }) => {
    const { password, confirmPassword, ...user } = userData;
    
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    if (MOCK_USERS[user.email]) {
      throw new Error('Email already registered');
    }
    
    const newUser: User = { ...user, password };
    MOCK_USERS[user.email] = newUser;
    
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword as User);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
