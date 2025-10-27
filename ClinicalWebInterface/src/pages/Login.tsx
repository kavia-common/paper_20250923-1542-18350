import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Login(): JSX.Element {
  /**
   * Simple login form:
   * - Validates non-empty email/password.
   * - Calls POST /api/login via fetch.
   * - On success, sets a flag in localStorage and navigates to /dashboard.
   * - On failure, shows inline error.
   */
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setSubmitting(true);
    try {
      // Normalize user input to avoid accidental whitespace mismatches
      const payload = {
        email: email.trim(),
        password: typeof password === 'string' ? password.trim() : password,
      };
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let message = 'Invalid credentials';
        try {
          const j = await res.json();
          if (j?.message) message = j.message;
        } catch {}
        throw new Error(message);
      }
      const data = await res.json();
      if (data?.success) {
        try {
          localStorage.setItem('auth.isAuthenticated', 'true');
          if (data?.token) {
            localStorage.setItem('auth.token', data.token);
          }
          if (data?.user) {
            localStorage.setItem('auth.user', JSON.stringify(data.user));
          }
        } catch {}
        navigate('/dashboard', { replace: true });
        return;
      }
      throw new Error('Login failed');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
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

          {error ? (
            <div role="alert" style={{ color: '#b00020', marginBottom: 10, fontSize: 14 }}>
              {error}
            </div>
          ) : null}

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
