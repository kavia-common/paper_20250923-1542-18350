import React from 'react';
import { Bed } from '../types/patient';

function Icon({ label, symbol }: { label: string; symbol: string }) {
  return (
    <span className="cw-icon" role="img" aria-label={label} title={label}>
      {symbol}
    </span>
  );
}

// PUBLIC_INTERFACE
export function BedCard({ bed }: { bed: Bed }): JSX.Element {
  /**
   * Vertical content layout:
   * - Header: Bed name + status icons
   * - Body: stacked patient details (name, identifiers, status, clinical summary)
   * - No inline action buttons (Pre-admission / Register Patient removed)
   */
  const p = bed.patient;
  const hasAllergy = !!p?.allergies && p.allergies.length > 0;
  const hasPrecaution = !!p?.precautions && p.precautions.length > 0;

  return (
    <div className={`cw-bed ${bed.occupied ? 'is-occupied' : 'is-empty'}`} role="button" tabIndex={0}>
      <div className="cw-bed__header">
        <span className="cw-bed__name">{bed.name}</span>
        <div className="cw-bed__icons">
          {hasAllergy && <Icon label="Allergy alert" symbol="⚠️" />}
          {hasPrecaution && <Icon label="Precaution" symbol="🛡️" />}
          {bed.locked && <Icon label="Locked" symbol="🔒" />}
          {bed.dischargePlanned && <Icon label="Discharge planned" symbol="🏥" />}
        </div>
      </div>

      {bed.occupied && p ? (
        <div className="cw-bed__body cw-bed__body--vertical">
          <div className="cw-stack">
            <div className="kv-row kv-row--indent">
              <span className="kv-label">Patient</span>
              <span className="kv-value">
                {p.name} <span className="cw-mute">({p.gender}, {p.age})</span>
              </span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Identifiers</span>
              <span className="kv-value">
                HN {p.hn}{' '}
                {p.an ? <span className="cw-mute">• AN {p.an}</span> : null}
              </span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Status</span>
              <span className="kv-value">{p.status}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Summary</span>
              <span className="kv-value">
                {(p.caseType || '-')}{p.surgeon ? ` • ${p.surgeon}` : ''}{p.procedure ? ` • ${p.procedure}` : ''}{p.diagnosis ? ` • ${p.diagnosis}` : ''}
              </span>
            </div>

            {(p.allergies && p.allergies.length > 0) || (p.precautions && p.precautions.length > 0) ? (
              <div className="kv-row kv-row--indent">
                <span className="kv-label">Notes</span>
                <span className="kv-value">
                  {p.allergies && p.allergies.length ? `Allergies: ${p.allergies.join(', ')}` : ''}
                  {p.allergies && p.allergies.length && p.precautions && p.precautions.length ? ' • ' : ''}
                  {p.precautions && p.precautions.length ? `Precautions: ${p.precautions.join(', ')}` : ''}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="cw-bed__empty">Empty bed</div>
      )}
      {/* Footer removed per requirement: no Pre-admission/Register Patient buttons on the card */}
    </div>
  );
}

export default BedCard;
