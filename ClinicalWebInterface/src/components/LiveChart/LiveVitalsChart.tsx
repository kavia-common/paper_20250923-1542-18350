import React, { useEffect, useMemo, useRef, useState } from 'react';
import './LiveVitalsChart.css';

export type DataPoint = { t: number; value: number };

// Vital keys to render as multiple series
type VitalKey = 'hr' | 'spo2' | 'rr' | 'etco2' | 'nibp_sys' | 'nibp_dia' | 'nibp_mean' | 'temp';

type VitalConfig = {
  name: string;
  unit: string;
  color: string;
  // preferred realistic baseline (center) and noise level
  baseline: number;
  noise: number;
  // hard clamps
  min: number;
  max: number;
  // true-scale axis group (for optional dual axis)
  axis: 'default' | 'pressure';
};

type SeriesState = {
  points: DataPoint[];
  last?: number;
  visible: boolean;
  cfg: VitalConfig;
};

const VITALS: Record<VitalKey, VitalConfig> = {
  hr: { name: 'Heart Rate', unit: 'bpm', color: '#e53935', baseline: 75, noise: 5, min: 40, max: 160, axis: 'default' },
  spo2: { name: 'SpO2', unit: '%', color: '#1e88e5', baseline: 97, noise: 1.2, min: 85, max: 100, axis: 'default' },
  rr: { name: 'Resp Rate', unit: 'brpm', color: '#43a047', baseline: 14, noise: 2.2, min: 6, max: 40, axis: 'default' },
  etco2: { name: 'EtCO2', unit: 'mmHg', color: '#8e24aa', baseline: 35, noise: 3.0, min: 20, max: 55, axis: 'default' },
  nibp_sys: { name: 'NIBP Sys', unit: 'mmHg', color: '#fb8c00', baseline: 120, noise: 6, min: 80, max: 200, axis: 'pressure' },
  nibp_dia: { name: 'NIBP Dia', unit: 'mmHg', color: '#fdd835', baseline: 75, noise: 5, min: 40, max: 120, axis: 'pressure' },
  nibp_mean: { name: 'NIBP Mean', unit: 'mmHg', color: '#6d4c41', baseline: 90, noise: 5, min: 50, max: 150, axis: 'pressure' },
  temp: { name: 'Temp', unit: '°C', color: '#00acc1', baseline: 36.8, noise: 0.08, min: 34.5, max: 40.5, axis: 'default' },
};

export interface LiveVitalsChartProps {
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
 * LiveVitalsChart renders multiple vital series on a single SVG chart with shared time axis.
 * - Normalized overlay (0–100%) is default to allow mixed magnitude.
 * - Optional "Show true scales" toggles a secondary right Y axis for pressure series; others remain on left.
 * - Legend provides color chips and toggles to show/hide individual series.
 * - Mock data streams every 500–1000ms with realistic ranges and occasional noise/spikes.
 */
export default function LiveVitalsChart({
  width = 900,
  height = 300,
  windowSec = 90,
  intervalMs = 750,
}: LiveVitalsChartProps): JSX.Element {
  // per-series state
  const [series, setSeries] = useState<Record<VitalKey, SeriesState>>(() => {
    const now = Date.now();
    const initial: Record<VitalKey, SeriesState> = {} as any;
    (Object.keys(VITALS) as VitalKey[]).forEach((k) => {
      initial[k] = {
        points: [{ t: now, value: VITALS[k].baseline }],
        last: VITALS[k].baseline,
        visible: true,
        cfg: VITALS[k],
      };
    });
    return initial;
  });
  const [running, setRunning] = useState(true);
  const [normalized, setNormalized] = useState(true); // normalized overlay (0–100%) by default
  const [windowSeconds, setWindowSeconds] = useState(windowSec);
  const intervalRef = useRef<number | null>(null);

  // helper to step a signal with random walk, occasional spike, and return clamped value
  const stepValue = (cfg: VitalConfig, prev?: number): number => {
    const base = cfg.baseline;
    const noise = cfg.noise;
    const pv = prev ?? base;
    let val = pv + (Math.random() - 0.5) * noise * 2; // small random step
    // pull towards baseline
    val = val + (base - val) * 0.06;
    // occasional spike or drop
    if (Math.random() < 0.03) {
      val += (Math.random() < 0.5 ? 1 : -1) * noise * (2.5 + Math.random() * 2.5);
    }
    // tiny measurement jitter
    val += (Math.random() - 0.5) * noise * 0.2;
    // clamp
    val = Math.max(cfg.min, Math.min(cfg.max, val));
    // rounding by unit magnitude
    const decimals = cfg.unit === '°C' ? 2 : cfg.unit === '%' ? 1 : 0;
    return Number(val.toFixed(decimals));
  };

  // streaming loop
  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!running) return;

    const tick = () => {
      const now = Date.now();
      setSeries((prev) => {
        const next: typeof prev = { ...prev };
        (Object.keys(next) as VitalKey[]).forEach((k) => {
          const s = next[k];
          const nxt = stepValue(s.cfg, s.last);
          const newPts = [...s.points, { t: now, value: nxt }];

          // rolling window prune
          const cutoff = now - windowSeconds * 1000;
          const pruned = newPts.filter((p) => p.t >= cutoff);

          next[k] = { ...s, points: pruned, last: nxt };
        });
        return next;
      });
    };

    const handle = window.setInterval(tick, Math.max(500, Math.min(1000, intervalMs))) as unknown as number;
    intervalRef.current = handle;

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, windowSeconds, intervalMs]);

  // axes geometry
  const padding = { left: 50, right: 54, top: 12, bottom: 28 }; // extra right space for secondary axis
  const innerW = Math.max(10, width - padding.left - padding.right);
  const innerH = Math.max(10, height - padding.top - padding.bottom);

  // time domain (shared)
  const now = Date.now();
  const tMin = now - windowSeconds * 1000;
  const tMax = now;
  const xScale = (t: number) => {
    if (tMax === tMin) return padding.left;
    return padding.left + ((t - tMin) / (tMax - tMin)) * innerW;
  };

  // compute per-series min/max from config and current points to enable adaptive scaling
  const seriesRanges = useMemo(() => {
    const ranges: Record<VitalKey, { min: number; max: number }> = {} as any;
    (Object.keys(series) as VitalKey[]).forEach((k) => {
      const s = series[k];
      const cfg = s.cfg;
      let min = cfg.min;
      let max = cfg.max;
      if (s.points.length) {
        const dmin = Math.min(...s.points.map((p) => p.value));
        const dmax = Math.max(...s.points.map((p) => p.value));
        // pad slightly
        const pad = Math.max(0.02 * (cfg.max - cfg.min), cfg.noise * 0.5);
        min = Math.max(cfg.min, Math.min(min, dmin) - pad);
        max = Math.min(cfg.max, Math.max(max, dmax) + pad);
      }
      // avoid zero range
      if (max - min < 1e-3) {
        max = min + 1;
      }
      ranges[k] = { min, max };
    });
    return ranges;
  }, [series]);

  // normalization: map each series value to 0..1 using its own min/max
  const yNorm = (k: VitalKey, value: number) => {
    const r = seriesRanges[k];
    return (value - r.min) / (r.max - r.min);
  };
  const yFromNorm = (norm: number) => padding.top + (1 - norm) * innerH;

  // non-normalized axes: left for default group, right for pressure group
  const groupDomain = useMemo(() => {
    // compute group min/max using all visible series in group
    const make = (axis: 'default' | 'pressure') => {
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      (Object.keys(series) as VitalKey[]).forEach((k) => {
        const s = series[k];
        if (!s.visible || s.cfg.axis !== axis) return;
        const r = seriesRanges[k];
        min = Math.min(min, r.min);
        max = Math.max(max, r.max);
      });
      if (!isFinite(min) || !isFinite(max)) {
        // fallback sensible default ranges
        if (axis === 'pressure') return { min: 40, max: 200, unit: 'mmHg' as string };
        return { min: 0, max: 100, unit: '' as string };
      }
      // pad slightly
      const pad = (max - min) * 0.06;
      return { min: min - pad, max: max + pad, unit: axis === 'pressure' ? 'mmHg' : '' as string };
    };
    return { left: make('default'), right: make('pressure') };
  }, [series, seriesRanges]);

  const yLeft = (v: number) => {
    const d = groupDomain.left;
    const min = d.min;
    const max = d.max;
    return yFromNorm((v - min) / Math.max(1e-6, max - min));
  };
  const yRight = (v: number) => {
    const d = groupDomain.right;
    const min = d.min;
    const max = d.max;
    return yFromNorm((v - min) / Math.max(1e-6, max - min));
  };

  // build SVG paths for each series
  const pathFor = (k: VitalKey) => {
    const s = series[k];
    const pts = s.points;
    if (!pts.length) return '';
    const toY = normalized
      ? (value: number) => yFromNorm(yNorm(k, value))
      : (value: number) => (s.cfg.axis === 'pressure' ? yRight(value) : yLeft(value));
    const parts: string[] = [];
    pts.forEach((p, i) => {
      const x = xScale(p.t);
      const y = toY(p.value);
      parts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    });
    return parts.join(' ');
  };

  const gridX = useMemo(() => {
    const ticks = 5;
    const step = innerW / (ticks - 1);
    return new Array(ticks).fill(0).map((_, i) => padding.left + i * step);
  }, [innerW]);

  const gridY = useMemo(() => {
    const ticks = 5;
    const values = new Array(ticks).fill(0).map((_, i) => i / (ticks - 1)); // 0..1
    return values.map((n) => ({ y: yFromNorm(n), n }));
  }, [innerH]);

  const formatTimeLabel = (t: number) => {
    const secAgo = Math.max(0, Math.round((tMax - t) / 1000));
    return `-${secAgo}s`;
  };

  const toggleRun = () => setRunning((r) => !r);
  const handleReset = () => {
    const now = Date.now();
    setSeries((prev) => {
      const next: typeof prev = { ...prev };
      (Object.keys(next) as VitalKey[]).forEach((k) => {
        const s = next[k];
        next[k] = { ...s, points: [{ t: now, value: s.cfg.baseline }], last: s.cfg.baseline };
      });
      return next;
    });
  };
  const toggleSeries = (k: VitalKey) => {
    setSeries((prev) => ({ ...prev, [k]: { ...prev[k], visible: !prev[k].visible } }));
  };

  // current display values (last point)
  const currentValues = (Object.keys(series) as VitalKey[]).reduce<Record<VitalKey, number>>((acc, k) => {
    const s = series[k];
    acc[k] = s.points.length ? s.points[s.points.length - 1].value : s.cfg.baseline;
    return acc;
  }, {} as any);

  return (
    <div className="cw-card live-chart">
      <div className="live-chart__header">
        <div className="live-chart__titles">
          <div className="live-chart__title">Live Vitals (Mock)</div>
          <div className="live-chart__subtitle">
            Last {windowSeconds}s • Interval {Math.max(500, Math.min(1000, intervalMs))}ms • {normalized ? 'Normalized overlay (0–100%)' : 'True scales (dual axis for pressures)'}
          </div>
        </div>
        <div className="live-chart__controls">
          <button className="cw-btn cw-btn--primary" onClick={toggleRun} aria-pressed={running}>
            {running ? 'Pause' : 'Start'}
          </button>
          <button className="cw-btn cw-btn--secondary" onClick={handleReset}>Reset</button>
          <label className="live-chart__toggle">
            <input type="checkbox" checked={!normalized} onChange={() => setNormalized((v) => !v)} />
            <span>Show true scales</span>
          </label>
        </div>
      </div>

      <div className="live-chart__legend" role="group" aria-label="Vitals legend and toggles">
        {(Object.keys(series) as VitalKey[]).map((k) => {
          const s = series[k];
          return (
            <button
              key={k}
              className={`legend-item ${s.visible ? '' : 'is-off'}`}
              onClick={() => toggleSeries(k)}
              aria-pressed={s.visible}
              title={`${s.cfg.name} (${s.cfg.unit})`}
            >
              <span className="legend-chip" style={{ backgroundColor: s.cfg.color }} aria-hidden />
              <span className="legend-label">{s.cfg.name}</span>
              <span className="legend-value">{currentValues[k]} {s.cfg.unit}</span>
            </button>
          );
        })}
      </div>

      <div className="live-chart__svgwrap">
        <svg width={width} height={height} role="img" aria-label="Multi-vital live chart">
          {/* Plot backdrop */}
          <rect x={padding.left} y={padding.top} width={innerW} height={innerH} fill="var(--bg-primary)" stroke="var(--border-color)" />

          {/* Grid */}
          {gridX.map((x, i) => (
            <line key={`gx-${i}`} x1={x} y1={padding.top} x2={x} y2={padding.top + innerH} stroke="var(--border-color)" strokeDasharray="3,3" />
          ))}
          {gridY.map(({ y }, i) => (
            <line key={`gy-${i}`} x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} stroke="var(--border-color)" strokeDasharray="3,3" />
          ))}

          {/* X axis labels (start, middle, end) */}
          {[tMin, tMin + (tMax - tMin) / 2, tMax].map((t, i) => (
            <text key={`xl-${i}`} x={xScale(t)} y={padding.top + innerH + 18} textAnchor="middle" fontSize="11" fill="var(--text-primary)">{formatTimeLabel(t)}</text>
          ))}
          <text x={padding.left + innerW / 2} y={padding.top + innerH + 26} textAnchor="middle" fontSize="11" fill="var(--text-primary)">Time</text>

          {/* Y axes labels */}
          {normalized ? (
            <>
              {/* Normalized axis on left 0..100% */}
              {[0, 0.25, 0.5, 0.75, 1].map((n, i) => {
                const y = yFromNorm(n);
                const label = Math.round(n * 100);
                return (
                  <text key={`yl-${i}`} x={padding.left - 6} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="var(--text-primary)">{label}%</text>
                );
              })}
            </>
          ) : (
            <>
              {/* True scale: left axis (default group) */}
              {[0, 0.25, 0.5, 0.75, 1].map((n, i) => {
                const d = groupDomain.left;
                const val = d.min + n * (d.max - d.min);
                const y = yLeft(val);
                return (
                  <text key={`yl-${i}`} x={padding.left - 6} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="var(--text-primary)">
                    {Math.round(val)}
                  </text>
                );
              })}
              {/* Right axis for pressure group */}
              {[0, 0.25, 0.5, 0.75, 1].map((n, i) => {
                const d = groupDomain.right;
                const val = d.min + n * (d.max - d.min);
                const y = yRight(val);
                return (
                  <text key={`yr-${i}`} x={padding.left + innerW + 6} y={y} textAnchor="start" dominantBaseline="middle" fontSize="11" fill="var(--text-primary)">
                    {Math.round(val)}
                  </text>
                );
              })}
              {/* Axis unit labels */}
              <text transform={`translate(14, ${padding.top + innerH / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fill="var(--text-primary)">Default</text>
              <text transform={`translate(${padding.left + innerW + 40}, ${padding.top + innerH / 2}) rotate(90)`} textAnchor="middle" fontSize="11" fill="var(--text-primary)">mmHg</text>
            </>
          )}

          {/* Series paths */}
          {(Object.keys(series) as VitalKey[]).map((k) => {
            const s = series[k];
            if (!s.visible) return null;
            const d = pathFor(k);
            return <path key={k} d={d} fill="none" stroke={s.cfg.color} strokeWidth={2} />;
          })}
        </svg>
      </div>

      <div className="live-chart__footer">
        <label className="cw-label" htmlFor="win">Window (s)</label>
        <input
          id="win"
          className="cw-input live-chart__win"
          type="number"
          min={30}
          max={300}
          step={10}
          value={windowSeconds}
          onChange={(e) => setWindowSeconds(Math.max(30, Math.min(300, Number(e.target.value) || windowSeconds)))}
        />
        <span className="live-chart__hint">Keep between 30–300s for performance</span>
      </div>
    </div>
  );
}
