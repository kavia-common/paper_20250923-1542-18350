import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../utils/authStorage.ts';

// PUBLIC_INTERFACE
export default function Login(): JSX.Element {
  /**
   * Paper+ branded login (frontend-only):
   * - No backend call. On submit, immediately sets auth flag and navigates to /dashboard.
   * - Modern, responsive card with subtle depth, gradient backdrop, and a stylized "Paper+" wordmark.
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

  // Accent color aligns with brand variables when present
  const accent = 'var(--button-bg)';

  return (
    <div
      className="cw-page"
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        padding: '24px 16px',
        background:
          'radial-gradient(1200px 600px at 10% 10%, rgba(25,118,210,0.10), transparent 60%), radial-gradient(1200px 600px at 90% 90%, rgba(0,123,255,0.10), transparent 60%), var(--bg-primary)',
      }}
    >
      <main
        className="cw-card"
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'linear-gradient(180deg, var(--bg-secondary), rgba(0,0,0,0.02))',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: 20,
          boxShadow:
            '0 10px 30px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
        }}
        aria-label="Paper+ Sign In"
      >
        {/* Wordmark / brand mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
            justifyContent: 'center',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `conic-gradient(from 210deg at 50% 50%, ${'rgba(25,118,210,0.85)'} 0deg, ${'rgba(0,123,255,0.85)'} 120deg, ${'rgba(25,118,210,0.85)'} 360deg)`,
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              fontSize: 18,
            }}
            title="Paper+"
          >
            +
          </div>
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
              }}
            >
              Paper<span style={{ color: accent }}>+</span>
            </div>
            <div
              style={{
                fontSize: 12,
                opacity: 0.7,
                marginTop: 2,
              }}
            >
              Sign in to continue
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 8 }}>
          <div className="cw-field" style={{ marginBottom: 12 }}>
            <label className="cw-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="cw-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="you@domain.com"
              style={{ borderRadius: 10 }}
            />
          </div>
          <div className="cw-field" style={{ marginBottom: 16 }}>
            <label className="cw-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="cw-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              style={{ borderRadius: 10 }}
            />
          </div>

          <button
            type="submit"
            className="cw-btn cw-btn--primary"
            disabled={submitting}
            aria-busy={submitting}
            style={{
              width: '100%',
              borderRadius: 10,
              background: `linear-gradient(180deg, ${'var(--button-bg)'} 0%, ${'rgba(0,0,0,0.0)'} 120%), var(--button-bg)`,
              color: 'var(--button-text)',
              boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
            }}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div
          aria-hidden="true"
          style={{
            marginTop: 14,
            fontSize: 12,
            textAlign: 'center',
            opacity: 0.65,
          }}
        >
          Secure client session • No credentials stored
        </div>
      </main>

      {/* Responsive tuning */}
      <style>{`
        @media (max-width: 480px) {
          main[aria-label="Paper+ Sign In"] {
            padding: 16px;
            border-radius: 12px;
          }
        }
      `}</style>
    </div>
  );
}
