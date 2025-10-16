import React from 'react';
import { Alerts } from '../types';

interface AlertsIconsProps {
  alerts?: Alerts;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles: Record<NonNullable<AlertsIconsProps['size']>, React.CSSProperties> = {
  sm: { fontSize: '0.85rem' },
  md: { fontSize: '1rem' },
  lg: { fontSize: '1.15rem' },
};

// PUBLIC_INTERFACE
export const AlertsIcons: React.FC<AlertsIconsProps> = ({ alerts, size = 'md' }) => {
  const css = sizeStyles[size];
  const a = alerts || { allergy: false, precaution: false, locked: false, discharged: false };
  const muted: React.CSSProperties = { opacity: 0.35, filter: 'grayscale(100%)' };
  const itemStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 8 };

  return (
    <span aria-label="alerts" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ ...itemStyle, ...(a.allergy ? {} : muted) }} aria-label={a.allergy ? 'Allergy present' : 'No allergy'}>
        <span role="img" aria-hidden="true" style={css}>⚠️</span>
      </span>
      <span style={{ ...itemStyle, ...(a.precaution ? {} : muted) }} aria-label={a.precaution ? 'Precaution required' : 'No precaution'}>
        <span role="img" aria-hidden="true" style={css}>🛡️</span>
      </span>
      <span style={{ ...itemStyle, ...(a.locked ? {} : muted) }} aria-label={a.locked ? 'Record locked' : 'Record unlocked'}>
        <span role="img" aria-hidden="true" style={css}>🔒</span>
      </span>
      <span style={{ ...itemStyle, ...(a.discharged ? {} : muted) }} aria-label={a.discharged ? 'Discharged' : 'Not discharged'}>
        <span role="img" aria-hidden="true" style={css}>✅</span>
      </span>
    </span>
  );
};
