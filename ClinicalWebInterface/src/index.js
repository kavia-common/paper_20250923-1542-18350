import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Import resolves to App.tsx; ensure no ./App.js exists to avoid shadowing
import App from './App';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}
const root = ReactDOM.createRoot(rootEl);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
