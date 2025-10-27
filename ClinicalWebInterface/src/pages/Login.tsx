import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../utils/authStorage.ts';

// PUBLIC_INTERFACE
export default function Login(): JSX.Element {
  /**
   * Simple login form (frontend-only):
   * - No backend call. On submit, immediately sets auth flag and navigates to /dashboard.
   * - Keeps basic input handling for UI consistency.
   * - PrivateRoute relies on localStorage flag 'auth.isAuthenticated' === 'true'.
   *
   * Note: Demo credentials text intentionally not shown in UI.
   */
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Option A (hardcoded check): keep for future toggling if validation desired
    // const isValid = email.trim() === 'login@papaer.com' && password.trim() === 'Pass@123';
    // For current requirement, we always proceed regardless of validation:
    try {
      // set auth flag via utility and store minimal user info (optional)
      setAuthenticated(true);
      const demoUser = { id: 'demo-user-1', email: email.trim() || 'login@example.com', name: 'User' };
      try {
        localStorage.setItem('auth.user', JSON.stringify(demoUser));
      } catch {}
    } catch {
      // ignore storage failures; PrivateRoute will treat as not authed if storage is unavailable
    } finally {
      setSubmitting(false);
    }

    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="cw-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <main className="cw-card" style={{ width: 360, padding: 16, border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--bg-secondary)' }}>
        <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 20, color: 'var(--text-primary)' }}>Login</h1>
        <form onSubmit={onSubmit}>
          <div className="cw-field" style={{ marginBottom: 10 }}>
            <label className="cw-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="cw-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="you@example.com"
            />
          </div>
          <div className="cw-field" style={{ marginBottom: 10 }}>
            <label className="cw-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="cw-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          {/* Error display removed for clean UI since login no longer fails */}
          <button
            type="submit"
            className="cw-btn cw-btn--primary"
            disabled={submitting}
            aria-busy={submitting}
            style={{ width: '100%' }}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </main>
    </div>
  );
}
