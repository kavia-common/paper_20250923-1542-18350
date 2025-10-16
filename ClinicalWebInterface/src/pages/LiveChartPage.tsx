import React from 'react';
import LiveVitalsChart from '../components/LiveChart/LiveVitalsChart.tsx';

/**
 * PUBLIC_INTERFACE
 * LiveChartPage
 *
 * Usage:
 * - Navigate to /live-chart via the nav bar or URL.
 * - Use the Start/Pause and Reset buttons to control the mock stream.
 * - Toggle series visibility from the color-coded legend; use "Show true scales" to enable dual-axis for pressures.
 */
export default function LiveChartPage(): JSX.Element {
  return (
    <div className="cw-page">
      <main className="cw-main" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <section style={{ marginBottom: 12 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 20 }}>Live Multi‑Vital Chart (Mock)</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            The chart streams multiple vitals every ~750ms in a rolling window. Use the legend to toggle series and the switch to
            view normalized overlay or true scales (pressures on right axis).
          </p>
        </section>
        <section>
          <LiveVitalsChart width={960} height={320} windowSec={90} intervalMs={750} />
        </section>
      </main>
    </div>
  );
}
