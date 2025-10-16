import React, { useMemo, useState } from 'react';
import Header from '../components/Header.tsx';
import SearchBar from '../components/SearchBar.tsx';
import BedCard from '../components/BedCard.tsx';
import RegisteredPatientsTable from '../components/RegisteredPatientsTable.tsx';
import { beds as bedsData, registeredPatients as patientsData } from '../data/mock.ts';
import { Bed, Patient } from '../types/patient.ts';

// PUBLIC_INTERFACE
export default function Dashboard(): JSX.Element {
  // Single unified search term
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Case-insensitive match helper
  const includesCI = (source: string | undefined | null, q: string) => {
    if (!source) return false;
    return source.toLowerCase().includes(q.toLowerCase());
  };

  // Filter beds by bed name or patient name
  const filteredBeds: Bed[] = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return bedsData;
    return bedsData.filter((b) => {
      const patientName = b.patient?.name || '';
      return includesCI(b.name, q) || includesCI(patientName, q);
    });
  }, [searchTerm]);

  // Filter patients by patient name (primary for table)
  const filteredPatients: Patient[] = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return patientsData;
    return patientsData.filter((p) => includesCI(p.name, q));
  }, [searchTerm]);

  const noBeds = filteredBeds.length === 0;
  const noPatients = filteredPatients.length === 0;

  return (
    <div className="cw-page">
      <Header />
      <main className="cw-main container">
        <section className="cw-actions">
          <button className="cw-btn cw-btn--primary" onClick={() => alert('Pre-admission action')}>
            Pre-admission
          </button>
          <button className="cw-btn cw-btn--secondary" onClick={() => alert('Register Patient action')}>
            Register Patient
          </button>
        </section>

        <section className="cw-searchwrap">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by patient or bed name…"
          />
        </section>

        <section className="cw-bedgrid">
          {noBeds ? (
            <div style={{ gridColumn: '1 / -1', opacity: 0.8, fontStyle: 'italic', padding: '8px 4px' }}>
              No results for beds.
            </div>
          ) : (
            filteredBeds.map((bed) => <BedCard key={bed.id} bed={bed} />)
          )}
        </section>

        <section className="cw-table-section">
          <h2 className="cw-sectiontitle">Registered Patients</h2>
          {noPatients ? (
            <div style={{ opacity: 0.8, fontStyle: 'italic', padding: '8px 4px' }}>No results for patients.</div>
          ) : (
            <RegisteredPatientsTable patients={filteredPatients} />
          )}
        </section>
      </main>
    </div>
  );
}
