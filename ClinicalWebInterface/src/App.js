import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './styles/dashboard.css';
import './styles/header.css';
import Dashboard from './pages/Dashboard.tsx';
import LiveChartPage from './pages/LiveChartPage.tsx';
import Login from './pages/Login.tsx';
import NavBar from './components/NavBar.tsx';
import PrivateRoute from './routes/PrivateRoute.tsx';
import { isAuthenticated } from './utils/authStorage.ts';

// PUBLIC_INTERFACE
function App() {
  // Initialize from localStorage or system preference; default to light
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    // Fallback to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Helper to conditionally render NavBar (hide on /login)
  function Layout({ children }: { children: JSX.Element }): JSX.Element {
    const location = useLocation();
    const hideNav = location.pathname === '/login';
    return (
      <>
        {!hideNav && <NavBar />}
        {children}
      </>
    );
  }

  // Root redirection logic: if authenticated -> /dashboard, else -> /login
  const RootRedirect = () => {
    const authed = isAuthenticated();
    return <Navigate to={authed ? '/dashboard' : '/login'} replace />;
  };

  return (
    <div className="App cw-app">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/live-chart"
              element={
                <PrivateRoute>
                  <LiveChartPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}

export default App;
