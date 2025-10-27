import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout as clientLogout } from '../utils/authStorage.ts';

/**
 * PUBLIC_INTERFACE
 * Simple top navigation bar with links to Dashboard and Live Chart.
 */
export default function NavBar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path: string) =>
    `cw-navlink${location.pathname === path ? ' is-active' : ''}`;

  const handleLogout = () => {
    // Clear client auth and navigate to login
    try {
      clientLogout();
    } catch {}
    navigate('/login', { replace: true });
  };

  const authed = isAuthenticated();

  return (
    <nav
      className="cw-navbar"
      aria-label="Primary Navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
        Clinical System
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link className={linkClass('/dashboard')} to="/dashboard">Dashboard</Link>
        <Link className={linkClass('/live-chart')} to="/live-chart">Live Chart</Link>
        {authed && (
          <button
            type="button"
            onClick={handleLogout}
            className="cw-btn cw-btn--secondary"
            style={{ padding: '6px 10px' }}
            aria-label="Logout"
            title="Logout"
          >
            Logout
          </button>
        )}
      </div>
      <style>{`
        .cw-navbar a {
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 600;
          padding: 6px 8px;
          border-radius: 6px;
        }
        .cw-navbar a:hover {
          text-decoration: underline;
        }
        .cw-navbar a.is-active {
          background: var(--button-bg);
          color: var(--button-text);
          text-decoration: none;
        }
      `}</style>
    </nav>
  );
}
