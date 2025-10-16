import React from 'react';

// PUBLIC_INTERFACE
export const PageHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({ title, subtitle, actions }) => {
  return (
    <div
      role="banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '8px 0',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ margin: 0, fontSize: 20, color: '#111827' }}>{title}</h1>
        {subtitle && <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {actions}
      </div>
    </div>
  );
};
