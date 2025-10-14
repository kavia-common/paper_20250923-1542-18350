import React from 'react';
import './ForgotPassword.css';

// PUBLIC_INTERFACE
const ForgotPassword: React.FC = () => {
  return (
    <div className="forgot-page">
      <main className="forgot-card" role="main" aria-labelledby="forgot-title">
        <h1 id="forgot-title" className="forgot-title">Forgot Password</h1>
        <p className="forgot-text">
          This is a placeholder. Please contact your administrator to reset your password,
          or implement the password reset workflow integrated with your backend.
        </p>
      </main>
    </div>
  );
};

export default ForgotPassword;
