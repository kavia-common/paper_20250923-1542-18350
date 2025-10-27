import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authStorage.ts';

// PUBLIC_INTERFACE
export default function PrivateRoute({ children }: { children: JSX.Element }): JSX.Element {
  /**
   * Guards child route by checking localStorage flag set on login.
   * If not authenticated, redirect to /login.
   */
  const authed = isAuthenticated();
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
