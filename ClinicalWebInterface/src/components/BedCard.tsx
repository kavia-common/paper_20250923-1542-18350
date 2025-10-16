import React from 'react';
import { Bed } from '../types';
import { AlertsIcons } from './AlertsIcons';

interface BedCardProps {
  bed: Bed;
  onClick?: (bedId: string) => void;
}

// PUBLIC_INTERFACE
export const BedCard: React.FC<BedCardProps> = ({ bed, onClick }) => {
  const p = bed.patient;
  const isOccupied = bed.occupancy !== 'Vacant';

  return (
    <article
      role="region"
      aria-label={`Bed ${bed.name}`}
      tabIndex={0}
      onClick={() => onClick?.(bed.id)}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(bed.id); }}
      style={{
        border: '1px solid #e1e4ea',
        borderRadius: 10,
        padding: 12,
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minWidth: 0,
        cursor: 'pointer',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, color: '#1f2937' }}>
          {bed.name}
          <span style={{ marginLeft: 8, fontSize: 12, color: '#6b7280' }}>{bed.location}</span>
        </div>
        <div style={{
          fontSize: 12,
          padding: '2px 8px',
          borderRadius: 12,
          backgroundColor: bed.occupancy === 'Vacant' ? '#e7f7ee' : bed.occupancy === 'Reserved' ? '#fff7e6' : '#e8eefc',
          color: bed.occupancy === 'Vacant' ? '#0f5132' : bed.occupancy === 'Reserved' ? '#8a6d3b' : '#1d4ed8',
          border: '1px solid #e5e7eb'
        }}>
          {bed.occupancy}
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          {isOccupied && p ? (
            <>
              <div style={{ fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.firstName} {p.lastName} · {p.gender}, {p.age}
              </div>
              <div style={{ fontSize: 12, color: '#4b5563' }}>
                HN: {p.hospitalNumber} {p.admissionNumber ? `· AN: ${p.admissionNumber}` : ''}
              </div>
              <div style={{ fontSize: 12, color: '#4b5563' }}>
                Status: {p.status} {p.caseType ? `· ${p.caseType}` : ''}
              </div>
              <div style={{ fontSize: 12, color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.surgeon ? `Surgeon: ${p.surgeon}` : ''} {p.procedure ? `· Procedure: ${p.procedure}` : ''} {p.diagnosis ? `· Dx: ${p.diagnosis}` : ''}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: '#6b7280' }}>Vacant bed</div>
          )}
        </div>
        <AlertsIcons alerts={bed.alerts || p?.alerts} size="md" />
      </div>
    </article>
  );
};
