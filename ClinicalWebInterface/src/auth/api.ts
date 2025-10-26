//
// Authentication API client for ClinicalWebInterface
// Cookie-first strategy with token fallback via Authorization header.
// Uses base URL from REACT_APP_API_BASE or defaults to http://localhost:4000
//

import type { User } from '../types/auth';

// Derive base URL from environment with a sensible default for local development
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

// LocalStorage key used when a token-based flow is employed (fallback)
const TOKEN_KEY = 'auth.token';

// Helper to read a stored token, if any
function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// Helper to clear a stored token
export function clearStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export async function login(email: string, password: string): Promise<User> {
  /**
   * Perform login against backend.
   * - Cookie-first: sends credentials: 'include' to receive httpOnly session cookie if backend issues one.
   * - Token fallback: if backend returns an access token in JSON, store it and use Authorization header for subsequent calls.
   *
   * Expected backend responses:
   * - 200 OK with JSON: { user: User, token?: string }
   * - Non-200 -> throws with message
   */
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include', // enable cookie-based session if server sets httpOnly cookie
    headers: {
      'Content-Type': 'application/json',
      ...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let message = 'Login failed';
    try {
      const err = await res.json();
      if (err?.message) message = err.message;
    } catch {}
    throw new Error(message);
  }

  // Parse response; if token present, store it as fallback
  const data = (await res.json()) as { user?: User; token?: string };
  if (data?.token) {
    try {
      localStorage.setItem(TOKEN_KEY, data.token);
    } catch {
      // ignore storage failures
    }
  }

  // If backend returns user info
  if (data?.user) return data.user;

  // No user in response; call getMe to fetch profile (uses cookie or token)
  const me = await getMe();
  return me;
}

// PUBLIC_INTERFACE
export async function getMe(): Promise<User> {
  /**
   * Retrieve current authenticated user.
   * - Attempts cookie-based session first (credentials: 'include').
   * - Adds Authorization header if token fallback is available.
   * Returns User on success or throws on error/unauthorized.
   */
  const token = getStoredToken();

  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    let message = 'Failed to load session';
    try {
      const err = await res.json();
      if (err?.message) message = err.message;
    } catch {}
    throw new Error(message);
  }

  const data = (await res.json()) as { user?: User } | User;
  // Support both shapes: { user } or direct user
  const user = (data as any).user ? (data as any).user as User : (data as User);
  return user;
}

// PUBLIC_INTERFACE
export async function logout(): Promise<void> {
  /**
   * Logout the current session.
   * - Calls backend logout endpoint if available.
   * - Clears any locally stored token.
   */
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        ...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
      },
    });
  } catch {
    // network errors ignored; still proceed to clear token
  } finally {
    clearStoredToken();
  }
}

// Re-export helpers for consumers if needed
export const AuthApi = {
  login,
  getMe,
  logout,
  clearStoredToken,
  API_BASE,
  TOKEN_KEY,
};
