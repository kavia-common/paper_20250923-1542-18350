import React, { useEffect, useMemo, useRef, useState } from 'react';

export type DataPoint = { t: number; value: number };

type SignalKey = 'hr' | 'spo2' | 'bp';

type SignalConfig = {
  name: string;
  unit: string;
  baseline: number;
  noise: number;
  min?: number;
  max?: number;
};

const SIGNALS: Record<SignalKey, SignalConfig> = {
  hr: { name: 'Heart Rate', unit: 'bpm', baseline: 75, noise: 5, min: 40, max: 160 },
  spo2: { name: 'SpO₂', unit: '%', baseline: 97, noise: 1.2, min: 85, max: 100 },
  bp: { name: 'Systolic BP', unit: 'mmHg', baseline: 120, noise: 6, min: 80, max: 200 },
};

export interface LiveVitalsChartProps {
  /** Signal to display */
  signal?: SignalKey;
  /** Width of chart drawing area */
  width?: number;
  /** Height of chart drawing area */
  height?: number;
  /** Rolling window in seconds to keep */
  windowSec?: number;
  /** Interval ms to push new data point */
  intervalMs?: number;
}

/**
 * PUBLIC_INTERFACE
 * LiveVitalsChart renders a time-series line chart that updates with mocked data.
 *
 * Usage:
 * <LiveVitalsChart signal="hr" width={700} height={260} windowSec={90} intervalMs={750} />
 *
 * - Start/Stop toggles mock streaming
 * - Reset clears history
 * - You can change the 'signal' prop to switch the displayed signal
 */
export default function LiveVitalsChart({
  signal = 'hr',
  width = 720,
  height = 260,
  windowSec = 90,
  intervalMs = 750,
}: LiveVitalsChartProps): JSX.Element {
  const [data, setData] = useState<DataPoint[]>([]);
  const [running, setRunning] = useState<boolean>(true);
  const [activeSignal, setActiveSignal] = useState<SignalKey>(signal);
  const intervalRef = useRef<number | null>(null);

  // Update active signal if prop changes
  useEffect(() => {
    setActiveSignal(signal);
  }, [signal]);

  // Helper to generate next value with noise and occasional spike
  const nextValue = (prev?: number): number => {
    const cfg = SIGNALS[activeSignal];
    const base = cfg.baseline;
    const noise = cfg.noise;
    const prevVal = prev ?? base;
    // small random walk
    let val = prevVal + (Math.random() - 0.5) * noise * 2;
    // pull toward baseline to avoid drift
    val = val + (base - val) * 0.05;
    // occasional spike
    if (Math.random() < 0.03) {
      val += (Math.random() < 0.5 ? 1 : -1) * noise * (3 + Math.random() * 2);
    }
    if (typeof cfg.min === 'number') val = Math.max(cfg.min, val);
    if (typeof cfg.max === 'number') val = Math.min(cfg.max, val);
    return Number(val.toFixed(2));
  };

  // Start/Stop streaming
  useEffect(() => {
    // Clear any existing
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setData((prev) => {
        const now = Date.now();
        const lastVal = prev.length ? prev[prev.length - 1].value : undefined;
        const val = nextValue(lastVal);
        const updated = [...prev, { t: now, value: val }];

        // prune outside window
        const cutoff = now - windowSec * 1000;
        const pruned = updated.filter((d) => d.t >= cutoff);
        return pruned;
      });
    }, Math.max(500, Math.min(1000, intervalMs))) as unknown as number;

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, activeSignal, windowSec, intervalMs]);

  // Reset when switching signal
  useEffect(() => {
    setData([]);
  }, [activeSignal]);

  // Derived values for axes
  const now = Date.now();
  const tMin = now - windowSec * 1000;
  const tMax = now;

  const yDomain = useMemo(() => {
    const cfg = SIGNALS[activeSignal];
    // pad domain for visuals
    const pad = Math.max(4, cfg.noise * 2);
    const min = typeof cfg.min === 'number' ? Math.max(cfg.min, cfg.baseline - 5 * cfg.noise) : cfg.baseline - 5 * cfg.noise;
    const max = typeof cfg.max === 'number' ? Math.min(cfg.max, cfg.baseline + 5 * cfg.noise) : cfg.baseline + 5 * cfg.noise;

    // also consider current data range
    if (data.length) {
      const dmin = Math.min(...data.map((d) => d.value));
      const dmax = Math.max(...data.map((d) => d.value));
      return [Math.min(min, dmin) - pad, Math.max(max, dmax) + pad];
    }
    return [min - pad, max + pad];
  }, [activeSignal, data]);

  const cfg = SIGNALS[activeSignal];
  const currentValue = data.length ? data[data.length - 1].value : cfg.baseline;

  // Map data to SVG coordinates
  const padding = { left: 46, right: 12, top: 12, bottom: 28 };
  const innerW = Math.max(10, width - padding.left - padding.right);
  const innerH = Math.max(10, height - padding.top - padding.bottom);

  const xScale = (t: number) => {
    if (tMax === tMin) return padding.left;
    return padding.left + ((t - tMin) / (tMax - tMin)) * innerW;
  };
  const yScale = (v: number) => {
    const [yMin, yMax] = yDomain;
    if (yMax === yMin) return padding.top + innerH;
    // invert y for SVG coordinate system
    return padding.top + (1 - (v - yMin) / (yMax - yMin)) * innerH;
  };

  const pathD = useMemo(() => {
    if (data.length === 0) return '';
    const parts: string[] = [];
    data.forEach((d, i) => {
      const x = xScale(d.t);
      const y = yScale(d.value);
      parts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    });
    return parts.join(' ');
  }, [data]); // xScale,yScale depend on state and will be picked up implicitly

  const gridX = useMemo(() => {
    // 5 vertical grid lines including start/end
    const ticks = 5;
    const step = innerW / (ticks - 1);
    return new Array(ticks).fill(0).map((_, i) => padding.left + i * step);
  }, [innerW]);

  const gridY = useMemo(() => {
    // 5 horizontal grid lines including min/max
    const ticks = 5;
    const [yMin, yMax] = yDomain;
    return new Array(ticks).fill(0).map((_, i) => {
      const v = yMin + (i / (ticks - 1)) * (yMax - yMin);
      return { y: yScale(v), v: Number(v.toFixed(0)) };
    });
  }, [yDomain]);

  const formatTimeLabel = (t: number) => {
    const secAgo = Math.max(0, Math.round((tMax - t) / 1000));
    return `-${secAgo}s`;
  };

  const handleReset = () => setData([]);
  const toggleRun = () => setRunning((r) => !r);

  return (
    <div
      className="cw-card"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        padding: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
            {cfg.name}
          </div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>
            Time-series (last {windowSec}s) • Interval {Math.max(500, Math.min(1000, intervalMs))}ms
          </div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          {currentValue} {cfg.unit}
        </div>
      </div>

      <div style={{ overflowX: 'hidden' }}>
        <svg width={width} height={height} role="img" aria-label={`${cfg.name} live chart`}>
          {/* Axes background */}
          <rect x={padding.left} y={padding.top} width={innerW} height={innerH} fill="var(--bg-primary)" stroke="var(--border-color)" />

          {/* Grid lines */}
          {gridX.map((x, i) => (
            <line key={`gx-${i}`} x1={x} y1={padding.top} x2={x} y2={padding.top + innerH} stroke="var(--border-color)" strokeDasharray="3,3" />
          ))}
          {gridY.map(({ y }, i) => (
            <line key={`gy-${i}`} x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} stroke="var(--border-color)" strokeDasharray="3,3" />
          ))}

          {/* Axis labels */}
          {/* Y labels */}
          {gridY.map(({ y, v }, i) => (
            <text key={`yl-${i}`} x={padding.left - 6} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="var(--text-primary)">
              {v}
            </text>
          ))}
          {/* X labels: start, mid, end */}
          {[tMin, tMin + (tMax - tMin) / 2, tMax].map((t, i) => (
            <text key={`xl-${i}`} x={xScale(t)} y={padding.top + innerH + 18} textAnchor="middle" fontSize="11" fill="var(--text-primary)">
              {formatTimeLabel(t)}
            </text>
          ))}
          <text x={padding.left + innerW / 2} y={padding.top + innerH + 26} textAnchor="middle" fontSize="11" fill="var(--text-primary)">
            Time
          </text>
          <text transform={`translate(12, ${padding.top + innerH / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fill="var(--text-primary)">
            Value ({cfg.unit})
          </text>

          {/* Data path */}
          <path d={pathD} fill="none" stroke="var(--text-secondary)" strokeWidth={2} />
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="cw-btn cw-btn--primary" onClick={toggleRun} aria-pressed={running} aria-label={running ? 'Pause updates' : 'Resume updates'}>
            {running ? 'Pause' : 'Start'}
          </button>
          <button className="cw-btn cw-btn--secondary" onClick={handleReset} aria-label="Reset data">
            Reset
          </button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <label className="cw-label" htmlFor="signal-select" style={{ alignSelf: 'center' }}>Signal:</label>
          <select
            id="signal-select"
            className="cw-select"
            value={activeSignal}
            onChange={(e) => setActiveSignal(e.target.value as SignalKey)}
          >
            <option value="hr">Heart Rate</option>
            <option value="spo2">SpO₂</option>
            <option value="bp">Systolic BP</option>
          </select>
        </div>
      </div>
    </div>
  );
}
