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
    <div
      className={`cw-bed ${bed.occupied ? 'is-occupied' : 'is-empty'}`}
      role="button"
      tabIndex={0}
      aria-label={`${bed.name}${bed.occupied && p ? `, occupied by ${p.name}` : ', empty'}`}
    >
      <div className="cw-bed__header card-header">
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
              <span className="kv-label">Patient Name</span>
              <span className="kv-value">{p.name ?? 'NA'}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">HN</span>
              <span className="kv-value">{p.hn ?? 'NA'}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">AN</span>
              <span className="kv-value">{p.an ?? 'NA'}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Gender</span>
              <span className="kv-value">{p.gender ?? 'NA'}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Age</span>
              <span className="kv-value">{(p.age ?? 'NA')}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Patient Status</span>
              <span className="kv-value">{p.status ?? 'NA'}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Case Type</span>
              <span className="kv-value">{p.caseType ?? 'NA'}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Surgeon</span>
              <span className="kv-value">{p.surgeon ?? 'NA'}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Procedure</span>
              <span className="kv-value">{p.procedure ?? 'Null'}</span>
            </div>

            <div className="kv-row kv-row--indent">
              <span className="kv-label">Diagnosis</span>
              <span className="kv-value">{p.diagnosis ?? 'NA'}</span>
            </div>

            {(p?.allergies && p.allergies.length > 0) || (p?.precautions && p.precautions.length > 0) ? (
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
