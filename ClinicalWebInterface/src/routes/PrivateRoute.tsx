import React from 'react';
import { Navigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function PrivateRoute({ children }: { children: JSX.Element }): JSX.Element {
  /**
   * Guards child route by checking localStorage flag set on login.
   * If not authenticated, redirect to /login.
   */
  let authed = false;
  try {
    authed = localStorage.getItem('auth.isAuthenticated') === 'true';
  } catch {
    authed = false;
  }
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
