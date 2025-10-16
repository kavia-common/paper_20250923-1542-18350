import React, { useMemo, useState } from 'react';
import '../styles/dashboard.css';
import { PageHeader } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { BedCard } from '../components/BedCard';
import { PatientsTable } from '../components/PatientsTable';
import { mockBeds } from '../data/mockBeds';
import { mockPatients } from '../data/mockPatients';
import { Bed, Patient } from '../types';

// PUBLIC_INTERFACE
const Dashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Filter logic for the bed cards (client-side mock)
  const filteredBeds: Bed[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockBeds.filter((b) => {
      const p = b.patient;
      const statusOk = !statusFilter || (p?.status === statusFilter);
      if (!q) return statusOk;
      const text = [
        b.name,
        b.location,
        p?.firstName,
        p?.lastName,
        p?.hospitalNumber,
        p?.admissionNumber,
        p?.surgeon,
        p?.procedure,
        p?.diagnosis,
      ].filter(Boolean).join(' ').toLowerCase();
      return statusOk && text.includes(q);
    });
  }, [query, statusFilter]);

  // Filter for patients table
  const filteredPatients: Patient[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockPatients.filter((p) => {
      const statusOk = !statusFilter || p.status === statusFilter;
      if (!q) return statusOk;
      const text = [
        p.firstName, p.lastName, p.hospitalNumber, p.admissionNumber,
        p.surgeon, p.procedure, p.diagnosis, p.status, p.caseType
      ].filter(Boolean).join(' ').toLowerCase();
        return statusOk && text.includes(q);
    });
  }, [query, statusFilter]);

  const handlePreAdmission = () => {
    // Placeholder handler; integrate navigation or modal in future
    // TODO: Integrate with backend pre-admission flow
    // eslint-disable-next-line no-alert
    alert('Pre-Admission flow coming soon.');
  };

  const handleRegisterPatient = () => {
    // Placeholder handler; integrate navigation in future
    // TODO: Route to registration page when available
    // eslint-disable-next-line no-alert
    alert('Register Patient flow coming soon.');
  };

  const handleBedClick = (bedId: string) => {
    // Placeholder interaction; could navigate to patient/bed details
    // eslint-disable-next-line no-alert
    alert(`Bed clicked: ${bedId}`);
  };

  return (
    <main className="dashboard-container" aria-label="Clinical Dashboard">
      <PageHeader
        title="Clinical Dashboard"
        subtitle="Overview of beds and registered patients"
        actions={
          <div className="actions-group">
            <button type="button" className="btn-primary" onClick={handlePreAdmission} aria-label="Start Pre-Admission">
              Pre-Admission
            </button>
            <button type="button" className="btn-secondary" onClick={handleRegisterPatient} aria-label="Register new patient">
              Register Patient
            </button>
          </div>
        }
      />

      <section className="section-card" aria-label="Search and Filters">
        <div className="controls-row">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            filter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </div>
      </section>

      <section aria-labelledby="beds-title">
        <h2 id="beds-title" style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '8px 0' }}>Beds</h2>
        <div className="bed-grid">
          {filteredBeds.map((b) => (
            <BedCard key={b.id} bed={b} onClick={handleBedClick} />
          ))}
        </div>
      </section>

      <section aria-label="Registered Patients" className="section-card">
        <PatientsTable patients={filteredPatients} />
      </section>
    </main>
  );
};

export default Dashboard;
