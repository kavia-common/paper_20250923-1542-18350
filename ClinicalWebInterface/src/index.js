import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Import TSX App (CRA supports TS files alongside JS)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
