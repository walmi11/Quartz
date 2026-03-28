"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    // Validation
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }
    if (password.length < 6) {
      throw new Error('Le mot de passe doit faire au minimum 6 caractères');
    }
    if (!email.includes('@')) {
      throw new Error('Email invalide');
    }
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setUser(result.user);
  };

  const signIn = async (email: string, password: string) => {
    // Validation
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
