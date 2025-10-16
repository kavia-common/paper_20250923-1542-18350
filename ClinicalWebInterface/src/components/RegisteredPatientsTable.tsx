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
        <thead className="table-header">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">HN</th>
            <th scope="col">AN</th>
            <th scope="col">Gender</th>
            <th scope="col">Age</th>
            <th scope="col">Status</th>
            <th scope="col">Surgeon</th>
            <th scope="col">Case Type</th>
            <th scope="col">Procedure</th>
            <th scope="col">Diagnosis</th>
            <th scope="col">Allergies</th>
            <th scope="col">Precautions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.hn}>
              <td className="patient-name">{p.name}</td>
              <td>{p.hn}</td>
              <td>{p.an || '-'}</td>
              <td>{p.gender}</td>
              <td>{p.age}</td>
              <td>{p.status}</td>
              <td>{p.surgeon || '-'}</td>
              <td>{p.caseType || '-'}</td>
              <td>{p.procedure || '-'}</td>
              <td>{p.diagnosis || '-'}</td>
              <td>{p.allergies && p.allergies.length ? p.allergies.join(', ') : '-'}</td>
              <td>{p.precautions && p.precautions.length ? p.precautions.join(', ') : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegisteredPatientsTable;
