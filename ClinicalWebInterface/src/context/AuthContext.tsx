import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { login as loginApi, logout as logoutApi, getMe } from '../services/authService';
import { User } from '../types/auth';
import { keys, local, session } from '../utils/storage';

interface AuthState {
  token: string | null;
  user: User | null;
}

interface LoginOptions {
  remember?: boolean;
}

interface AuthContextValue extends AuthState {
  // PUBLIC_INTERFACE
  /** Attempt to login with identifier (email/username) and password */
  login: (identifier: string, password: string, options?: LoginOptions) => Promise<{ ok: boolean; error?: string }>;
  // PUBLIC_INTERFACE
  /** Logout best-effort server call and clear client session */
  logout: () => Promise<void>;
  // PUBLIC_INTERFACE
  /** True when both token and user are present */
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readPersistedAuth(): AuthState {
  const token = (local.get<string>(keys.TOKEN) || session.get<string>(keys.TOKEN)) ?? null;
  const user = (local.get<User>(keys.USER) || session.get<User>(keys.USER)) ?? null;
  return { token, user };
}

function clearAllStorage() {
  local.remove(keys.TOKEN);
  local.remove(keys.USER);
  session.remove(keys.TOKEN);
  session.remove(keys.USER);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => readPersistedAuth());
  const rememberRef = useRef<boolean>(false);

  // On mount, if token exists but no user, try to refresh session via /auth/me
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      if (auth.token && !auth.user) {
        try {
          const me = await getMe();
          if (!cancelled && me) {
            const next = { token: auth.token, user: me };
            setAuth(next);
            // Don't change remember store on hydration; keep where token was found
            const store = local.get<string>(keys.TOKEN) ? local : session;
            store.set(keys.USER, me);
          }
        } catch (e: any) {
          // On 401, clear auth so ProtectedRoute redirects to login
          if (e?.status === 401) {
            setAuth({ token: null, user: null });
            clearAllStorage();
          }
        }
      }
    };
    void init();
    return () => {
      cancelled = true;
    };
  }, []); // run once

  const persist = useCallback((next: AuthState) => {
    // Choose storage based on remember flag
    const store = rememberRef.current ? local : session;
    // Clear both to avoid stale data in the other
    clearAllStorage();
    if (next.token) {
      store.set(keys.TOKEN, next.token);
    }
    if (next.user) {
      store.set(keys.USER, next.user);
    }
  }, []);

  const login = useCallback<AuthContextValue['login']>(async (identifier, password, options) => {
    rememberRef.current = Boolean(options?.remember);
    const res = await loginApi({ identifier, password });
    if (res.token && res.user) {
      const next = { token: res.token, user: res.user };
      setAuth(next);
      persist(next);
      return { ok: true };
    }
    return { ok: false, error: res.error || 'Invalid credentials' };
  }, [persist]);

  const logout = useCallback(async () => {
    await logoutApi();
    setAuth({ token: null, user: null });
    clearAllStorage();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: auth.token,
      user: auth.user,
      login,
      logout,
      isAuthenticated: Boolean(auth.token && auth.user),
    }),
    [auth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PUBLIC_INTERFACE
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
