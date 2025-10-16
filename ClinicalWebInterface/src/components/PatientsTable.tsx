import React from 'react';
import { Patient } from '../types';
import { AlertsIcons } from './AlertsIcons';

interface PatientsTableProps {
  patients: Patient[];
  title?: string;
}

// PUBLIC_INTERFACE
export const PatientsTable: React.FC<PatientsTableProps> = ({ patients, title = 'Registered Patients' }) => {
  return (
    <section aria-labelledby="patients-table-title">
      <h2 id="patients-table-title" style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '16px 0 8px' }}>
        {title}
      </h2>
      <div style={{ overflowX: 'auto' }}>
        <table role="table" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8 }}>
          <thead>
            <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
              <th scope="col" style={thStyle}>Name</th>
              <th scope="col" style={thStyle}>HN</th>
              <th scope="col" style={thStyle}>AN</th>
              <th scope="col" style={thStyle}>Gender</th>
              <th scope="col" style={thStyle}>Age</th>
              <th scope="col" style={thStyle}>Status</th>
              <th scope="col" style={thStyle}>Case Type</th>
              <th scope="col" style={thStyle}>Surgeon</th>
              <th scope="col" style={thStyle}>Procedure</th>
              <th scope="col" style={thStyle}>Diagnosis</th>
              <th scope="col" style={thStyle}>Alerts</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={tdStyle}>{p.firstName} {p.lastName}</td>
                <td style={tdStyle}>{p.hospitalNumber}</td>
                <td style={tdStyle}>{p.admissionNumber || '-'}</td>
                <td style={tdStyle}>{p.gender}</td>
                <td style={tdStyle}>{p.age}</td>
                <td style={tdStyle}>{p.status}</td>
                <td style={tdStyle}>{p.caseType || '-'}</td>
                <td style={tdStyle}>{p.surgeon || '-'}</td>
                <td style={tdStyle}>{p.procedure || '-'}</td>
                <td style={tdStyle}>{p.diagnosis || '-'}</td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                  <AlertsIcons alerts={p.alerts} size="sm" />
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={11} style={{ ...tdStyle, textAlign: 'center', color: '#6b7280' }}>
                  No registered patients
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const thStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#374151',
  padding: '10px 12px',
  borderBottom: '1px solid #e5e7eb',
};

const tdStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#111827',
  padding: '10px 12px',
};
