import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../styles/dashboard.css';
import { PageHeader } from '../components/Header';
import { useAuth } from '../context/AuthContext';
// Recharts for responsive charting
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// PUBLIC_INTERFACE
export interface LiveVitalsPoint {
  t: number; // seconds since start
  hr: number; // heart rate
}

type Speed = 1 | 2;

/**
 * PUBLIC_INTERFACE
 * LiveVitals renders a live-updating line chart that simulates streaming vitals data
 * on the client. Use /live route to access it. No backend required.
 *
 * Controls:
 * - Start / Stop: begin or pause the simulation
 * - Speed: 1x or 2x (how fast time progresses in the simulation)
 *
 * Accessibility:
 * - aria labels on controls
 * - focusable buttons and select
 *
 * Usage:
 *   - Navigate to /live after logging in (protected by auth)
 *   - Or use the "Live" link in the top header once authenticated
 *
 * Implementation notes:
 *   - Data generation happens via setInterval
 *   - Sliding window of the latest N points (default 60)
 */
const LiveVitals: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [running, setRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<Speed>(1);
  const [windowSize, setWindowSize] = useState<number>(60);
  const [points, setPoints] = useState<LiveVitalsPoint[]>([]);
  const tRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  // Sinusoidal + noise generator for heart rate
  const generateNext = useCallback((): LiveVitalsPoint => {
    const nextT = tRef.current + 1;
    // Base heart rate ~75 bpm with subtle oscillation and noise
    const hr =
      75 +
      5 * Math.sin(nextT / 6) + // slow drift
      2 * Math.sin(nextT / 2) + // faster micro-variation
      (Math.random() * 4 - 2); // random noise in [-2, 2]
    tRef.current = nextT;
    return { t: nextT, hr: Math.round(hr * 10) / 10 };
  }, []);

  // Interval management
  useEffect(() => {
    if (!running) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const intervalMs = speed === 1 ? 1000 : 500; // 1x -> 1s per tick, 2x -> 0.5s per tick
    timerRef.current = window.setInterval(() => {
      setPoints((prev) => {
        const next = [...prev, generateNext()];
        // maintain sliding window of last windowSize points
        if (next.length > windowSize) {
          return next.slice(next.length - windowSize);
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running, speed, windowSize, generateNext]);

  // Seed initial points once on mount for nicer first render
  useEffect(() => {
    const seed: LiveVitalsPoint[] = [];
    tRef.current = 0;
    for (let i = 0; i < 20; i += 1) {
      const p = generateNext();
      seed.push(p);
    }
    setPoints(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () =>
      points.map((p) => ({
        time: p.t,
        heartRate: p.hr,
      })),
    [points]
  );

  const toggle = () => setRunning((r) => !r);

  const onSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value) as Speed;
    setSpeed(val === 2 ? 2 : 1);
  };

  const onWindowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setWindowSize([30, 60, 90, 120].includes(val) ? val : 60);
  };

  return (
    <main className="dashboard-container" aria-label="Live Vitals Page">
      <PageHeader
        title="Live Vitals"
        subtitle="Simulated real-time heart rate feed (client-side)"
        actions={
          <div className="actions-group" role="group" aria-label="Simulation controls">
            <button
              type="button"
              className="btn-primary"
              onClick={toggle}
              aria-pressed={running}
              aria-label={running ? 'Pause simulation' : 'Start simulation'}
            >
              {running ? 'Pause' : 'Start'}
            </button>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#374151' }}>Speed</span>
              <select
                aria-label="Simulation speed"
                value={speed}
                onChange={onSpeedChange}
                style={{
                  padding: '6px 8px',
                  border: '1px solid #ccd',
                  borderRadius: 6,
                  background: '#fff',
                }}
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
              </select>
            </label>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#374151' }}>Window</span>
              <select
                aria-label="Sliding window size"
                value={windowSize}
                onChange={onWindowChange}
                style={{
                  padding: '6px 8px',
                  border: '1px solid #ccd',
                  borderRadius: 6,
                  background: '#fff',
                }}
              >
                <option value={30}>30</option>
                <option value={60}>60</option>
                <option value={90}>90</option>
                <option value={120}>120</option>
              </select>
            </label>
          </div>
        }
      />

      <section className="section-card" aria-label="Live chart section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 16, color: '#111827' }}>Heart Rate</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            Live preview of simulated heart rate data (bpm). This is a client-only demo.
          </p>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
                label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -4 }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                domain={[50, 110]}
                label={{ value: 'BPM', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend verticalAlign="top" height={30} />
              <Line
                type="monotone"
                dataKey="heartRate"
                name="Heart Rate"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section aria-label="Legend and notes" className="section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            aria-hidden="true"
            style={{
              width: 12,
              height: 12,
              backgroundColor: '#ef4444',
              borderRadius: 2,
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 13, color: '#111827' }}>Heart Rate</span>
        </div>
        <p style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
          Tip: Use Start/Pause and Speed to control the live simulation. The window selector controls how many recent points are displayed (sliding view).
        </p>
      </section>

      {/* Developer note:
        Readme snippet: After starting the app, log in and navigate to /live
        or click the "Live" link in the top navigation.
      */}
      {!isAuthenticated && (
        <p style={{ fontSize: 12, color: '#9ca3af' }}>
          Note: This page is best accessed after signing in.
        </p>
      )}
    </main>
  );
};

export default LiveVitals;
