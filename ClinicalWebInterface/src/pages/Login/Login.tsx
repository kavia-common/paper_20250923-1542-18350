import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

type LocationState = { from?: Location };

function isEmailLike(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

// PUBLIC_INTERFACE
const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname || '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = useMemo(
    () => identifier.trim().length > 0 && password.trim().length >= 1,
    [identifier, password]
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError('Please fill in all required fields.');
      return;
    }
    if (identifier.includes('@') && !isEmailLike(identifier)) {
      setError('Please enter a valid email address or username.');
      return;
    }

    setSubmitting(true);
    const res = await login(identifier.trim(), password, { remember });
    setSubmitting(false);
    if (res.ok) {
      navigate(from || '/', { replace: true });
    } else {
      // Surface backend-provided message if available
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <main className="login-card" role="main" aria-labelledby="login-title">
        <h1 id="login-title" className="login-title">Sign in to Clinical Interface</h1>
        <p className="login-subtitle">Secure access for clinical staff</p>

        {error && (
          <div className="alert" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              aria-invalid={Boolean(error) && identifier.trim().length === 0}
              aria-describedby="identifier-help"
              placeholder="name@example.com or username"
              disabled={submitting}
            />
            <small id="identifier-help" className="help-text">
              Use your registered email or username
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-row">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={submitting}
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="link" aria-label="Forgot password">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!canSubmit || submitting}
            aria-busy={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
