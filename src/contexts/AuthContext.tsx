<<<<<<< HEAD
import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 
=======

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  setAuthenticated: (value: boolean) => void;
  setNeedsOnboarding: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsOnboarding, setNeedsOnboardingState] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const onboardingStatus = localStorage.getItem("needsOnboarding") === "true";
    setIsAuthenticated(authStatus);
    setNeedsOnboardingState(onboardingStatus);
  }, []);

  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
    localStorage.setItem("isAuthenticated", value.toString());
  };

  const setNeedsOnboarding = (value: boolean) => {
    setNeedsOnboardingState(value);
    localStorage.setItem("needsOnboarding", value.toString());
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("needsOnboarding");
    localStorage.removeItem("userProfile");
    setIsAuthenticated(false);
    setNeedsOnboardingState(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      needsOnboarding,
      setAuthenticated,
      setNeedsOnboarding,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
>>>>>>> 42215a582c93fd0758f4a7f6f44b362e409eea4c
