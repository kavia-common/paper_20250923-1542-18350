import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import AppHeader from './components/Header/AppHeader';

/**
 * After a successful login, users are redirected to "/" which is protected by ProtectedRoute.
 * Adjust the path to your dashboard as needed (e.g., '/dashboard').
 */
// Simple placeholder dashboard component
const Dashboard: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <p>Welcome to the Clinical Dashboard</p>
    </header>
  </div>
);

/**
 * PUBLIC_INTERFACE
 * App is the SPA shell with AuthProvider and Router.
 * Unauthenticated users are redirected to /login by ProtectedRoute.
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
