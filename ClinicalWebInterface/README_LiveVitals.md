Live Vitals Page

Overview
- This page demonstrates a client-side simulated live chart using Recharts.
- No backend is required.

How to use
1) Start the app (npm start).
2) Sign in with valid credentials.
3) Navigate to /live or click the "Live" link in the header.
4) Use the Start/Pause button, Speed selector (1x/2x), and Window selector to control the simulation.

Implementation
- Located at src/pages/LiveVitals.tsx
- Route registered at /live in src/App.tsx (behind ProtectedRoute)
- Uses ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
- Simulates a heart rate series and maintains a sliding window of recent points
