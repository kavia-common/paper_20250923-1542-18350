import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Simple top navigation bar with links to Dashboard and Live Chart.
 */
export default function NavBar(): JSX.Element {
  const location = useLocation();

  const linkClass = (path: string) =>
    `cw-navlink${location.pathname === path ? ' is-active' : ''}`;

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
      <div style={{ display: 'flex', gap: 12 }}>
        <Link className={linkClass('/dashboard')} to="/dashboard">Dashboard</Link>
        <Link className={linkClass('/live-chart')} to="/live-chart">Live Chart</Link>
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
