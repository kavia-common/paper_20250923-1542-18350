import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AppHeader.css';

/**
 * PUBLIC_INTERFACE
 * AppHeader renders the brand link and user controls (Sign In/Logout).
 * It adapts to authentication state and routes users to login or dashboard.
 */
const AppHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="brand" aria-label="Clinical Interface home">
          Clinical Interface
        </Link>

        <nav aria-label="Primary">
          {isAuthenticated ? (
            <div className="user-controls">
              <span className="user-name" aria-live="polite">Hello, {user?.name || 'User'}</span>
              {/* Logout triggers backend best-effort POST /auth/logout then clears client session */}
              <button className="btn-logout" onClick={() => logout()} aria-label="Logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="user-controls">
              <Link to="/login" className="btn-login">Sign In</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
