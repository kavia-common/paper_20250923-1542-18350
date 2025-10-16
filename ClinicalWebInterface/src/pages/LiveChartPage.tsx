import React from 'react';
import LiveVitalsChart from '../components/LiveChart/LiveVitalsChart.tsx';

/**
 * PUBLIC_INTERFACE
 * LiveChartPage
 *
 * Usage instructions:
 * - Navigate to /live-chart via the nav bar or URL.
 * - Use the Start/Pause and Reset buttons to control the mock stream.
 * - Pick a signal (Heart Rate, SpO2, BP) from the Signal selector.
 */
export default function LiveChartPage(): JSX.Element {
  return (
    <div className="cw-page">
      <main className="cw-main" style={{ maxWidth: 960, margin: '0 auto' }}>
        <section style={{ marginBottom: 12 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 20 }}>Live Vitals Chart (Mock)</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            This chart streams hardcoded data every ~750ms within a rolling 90s window.
            Switch signals to see different baselines and noise.
          </p>
        </section>
        <section>
          <LiveVitalsChart signal="hr" width={900} height={280} windowSec={90} intervalMs={750} />
        </section>
      </main>
    </div>
  );
}
