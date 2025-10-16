import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import AppHeader from './components/Header/AppHeader';
import Dashboard from './pages/Dashboard';
import LiveVitals from './pages/LiveVitals';

/**
 * PUBLIC_INTERFACE
 * App is the SPA shell with AuthProvider and Router.
 * Unauthenticated users are redirected to /login by ProtectedRoute.
 *
 * Routes:
 * - /dashboard (protected)
 * - /live (protected, simulated chart)
 * - /login, /forgot-password (public)
 */
function App(): React.ReactElement {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <LiveVitals />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
