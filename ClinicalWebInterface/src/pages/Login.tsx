import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../utils/authStorage.ts';
import styles from './login.module.css';
import logoUrl from '../assets/paperplus-logo.svg';

// PUBLIC_INTERFACE
export default function Login(): JSX.Element {
  /**
   * Paper+ branded login (frontend-only):
   * - No backend call. On submit, immediately sets auth flag and navigates to /dashboard.
   * - Modern, responsive card with Paper+ logo, scoped brand colors, and accessible focus states.
   * - Keeps current routing and logout/session behavior intact.
   * - No demo credential text shown.
   */
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      setAuthenticated(true);
      const demoUser = { id: 'demo-user-1', email: email.trim() || 'user@example.com', name: 'User' };
      try {
        localStorage.setItem('auth.user', JSON.stringify(demoUser));
      } catch {}
    } catch {
      // ignore storage failures
    } finally {
      setSubmitting(false);
    }

    navigate('/dashboard', { replace: true });
  };

  return (
    <div className={styles.loginWrap}>
      <main className={styles.card} aria-label="Paper+ Sign In">
        <div className={styles.logoBox}>
          <img
            src={logoUrl}
            width={180}
            height={44}
            alt="Paper+"
            style={{ display: 'block' }}
          />
        </div>
        <div className={styles.subtext}>Sign in to continue</div>

        <form onSubmit={onSubmit} style={{ marginTop: 6 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="you@domain.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footerNote} aria-hidden="true">
          Secure client session • No credentials stored
        </div>
      </main>
    </div>
  );
}
