import React from 'react';
import { Patient } from '../types/patient';

// PUBLIC_INTERFACE
export function RegisteredPatientsTable({
  patients,
}: {
  /** Array of registered patients to display */
  patients: Patient[];
}): JSX.Element {
  return (
    <div className="cw-tablewrap">
      <table className="cw-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>HN</th>
            <th>AN</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Status</th>
            <th>Surgeon</th>
            <th>Case Type</th>
            <th>Procedure</th>
            <th>Diagnosis</th>
            <th>Allergies</th>
            <th>Precautions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.hn}>
              <td>{p.name}</td>
              <td>{p.hn}</td>
              <td>{p.an || '-'}</td>
              <td>{p.gender}</td>
              <td>{p.age}</td>
              <td>{p.status}</td>
              <td>{p.surgeon || '-'}</td>
              <td>{p.caseType || '-'}</td>
              <td>{p.procedure || '-'}</td>
              <td>{p.diagnosis || '-'}</td>
              <td>{(p.allergies && p.allergies.length) ? p.allergies.join(', ') : '-'}</td>
              <td>{(p.precautions && p.precautions.length) ? p.precautions.join(', ') : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegisteredPatientsTable;
