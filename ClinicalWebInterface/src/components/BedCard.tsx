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
  const p = bed.patient;
  const hasAllergy = !!p?.allergies && p.allergies.length > 0;
  const hasPrecaution = !!p?.precautions && p.precautions.length > 0;

  return (
    <div className={`cw-bed ${bed.occupied ? 'is-occupied' : 'is-empty'}`}>
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
        <div className="cw-bed__body">
          <div className="cw-row"><strong>Patient:</strong> {p.name} ({p.gender}, {p.age})</div>
          <div className="cw-row"><strong>HN/AN:</strong> {p.hn} {p.an ? ` / ${p.an}` : ''}</div>
          <div className="cw-row"><strong>Status:</strong> {p.status}</div>
          <div className="cw-row"><strong>Case:</strong> {p.caseType || '-'}</div>
          <div className="cw-row"><strong>Surgeon:</strong> {p.surgeon || '-'}</div>
          <div className="cw-row"><strong>Procedure:</strong> {p.procedure || '-'}</div>
          <div className="cw-row"><strong>Diagnosis:</strong> {p.diagnosis || '-'}</div>
        </div>
      ) : (
        <div className="cw-bed__empty">Empty bed</div>
      )}
      <div className="cw-bed__footer">
        <button className="cw-btn cw-btn--secondary" onClick={() => alert(`Pre-admission for ${bed.name}`)}>
          Pre-admission
        </button>
        <button className="cw-btn cw-btn--primary" onClick={() => alert(`Register patient to ${bed.name}`)}>
          Register Patient
        </button>
      </div>
    </div>
  );
}

export default BedCard;
