import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import AppHeader from './components/Header/AppHeader';
import Dashboard from './pages/Dashboard'; // CRA/TS resolves .tsx, but ensure file exists at src/pages/Dashboard.tsx

/**
 * PUBLIC_INTERFACE
 * App is the SPA shell with AuthProvider and Router.
 * - /dashboard is protected and renders the Clinical Dashboard.
 * - / redirects users to /login; after login, app navigates to /dashboard.
 */
function App(): React.ReactElement {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppHeader />
        <div style={{ background: '#f3f4f6', minHeight: '100vh' }}>
          <div style={{ padding: 12 }}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
