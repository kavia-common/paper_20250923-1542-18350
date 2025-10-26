import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '../types/auth';
import { login as apiLogin, getMe as apiGetMe, logout as apiLogout, clearStoredToken } from './api';

// Simple event emitter to notify auth changes across app without external deps
type Listener<T> = (payload: T) => void;
class SimpleEmitter<T> {
  private listeners: Set<Listener<T>> = new Set();
  on(listener: Listener<T>) {
    this.listeners.add(listener);
    return () => this.off(listener);
  }
  off(listener: Listener<T>) {
    this.listeners.delete(listener);
  }
  emit(payload: T) {
    this.listeners.forEach((l) => {
      try { l(payload); } catch { /* ignore */ }
    });
  }
}

const authEmitter = new SimpleEmitter<{ user: User | null }>();

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export type AuthContextType = AuthState & {
  // PUBLIC_INTERFACE
  login: (email: string, password: string) => Promise<User>;
  // PUBLIC_INTERFACE
  logout: () => Promise<void>;
  // PUBLIC_INTERFACE
  refreshMe: () => Promise<User | null>;
  // PUBLIC_INTERFACE
  subscribe: (listener: (user: User | null) => void) => () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  /**
   * AuthProvider manages user session in a cookie-first manner
   * with a token fallback (Authorization header) if present in localStorage.
   * - On mount, it calls getMe() to hydrate the session if valid.
   * - Exposes login, logout, and refreshMe methods.
   * - Emits auth changes via a lightweight event emitter.
   */
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  const hydrate = useCallback(async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const me = await apiGetMe();
      setUser(me);
      authEmitter.emit({ user: me });
      return me;
    } catch (e: any) {
      // Not logged in or failed
      setUser(null);
      authEmitter.emit({ user: null });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    // Attempt to hydrate an existing session via cookie or token
    hydrate();
  }, [hydrate]);

  const doLogin = useCallback(async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const me = await apiLogin(email, password);
      setUser(me);
      authEmitter.emit({ user: me });
      return me;
    } catch (e: any) {
      const message = e?.message || 'Login failed';
      setError(message);
      setUser(null);
      authEmitter.emit({ user: null });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const doLogout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiLogout();
    } catch {
      // ignore
    } finally {
      // Ensure local cleanup
      clearStoredToken();
      setUser(null);
      authEmitter.emit({ user: null });
      setLoading(false);
    }
  }, []);

  const refreshMe = useCallback(async (): Promise<User | null> => {
    try {
      const me = await apiGetMe();
      setUser(me);
      authEmitter.emit({ user: me });
      return me;
    } catch {
      setUser(null);
      authEmitter.emit({ user: null });
      return null;
    }
  }, []);

  const subscribe = useCallback((listener: (user: User | null) => void) => {
    return authEmitter.on(({ user }) => listener(user));
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    error,
    login: doLogin,
    logout: doLogout,
    refreshMe,
    subscribe,
  }), [user, loading, error, doLogin, doLogout, refreshMe, subscribe]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextType {
  /** Hook to access authentication state and methods. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
