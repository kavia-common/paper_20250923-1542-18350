import React, { useMemo, useState } from 'react';
import Header from '../components/Header.tsx';
import SearchBar, { SearchFilters } from '../components/SearchBar.tsx';
import BedCard from '../components/BedCard.tsx';
import RegisteredPatientsTable from '../components/RegisteredPatientsTable.tsx';
import { beds as bedsData, registeredPatients as patientsData } from '../data/mock.ts';
import { Bed, Patient } from '../types/patient.ts';

// PUBLIC_INTERFACE
export default function Dashboard(): JSX.Element {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    bed: '',
    status: '',
    surgeon: '',
    caseType: '',
  });

  const onSearch = (f: SearchFilters) => {
    setFilters(f);
    // Placeholder: integrate backend search later
    // For now, state update filters the mock lists below
  };

  const filteredBeds: Bed[] = useMemo(() => {
    const q = filters.query.toLowerCase();
    return bedsData.filter(b => {
      const matchBed = filters.bed ? b.name.toLowerCase().includes(filters.bed.toLowerCase()) : true;
      const p = b.patient;
      const matchStatus = filters.status ? (p?.status === filters.status) : true;
      const matchSurgeon = filters.surgeon ? (p?.surgeon?.toLowerCase().includes(filters.surgeon.toLowerCase()) ?? false) : true;
      const matchCase = filters.caseType ? (p?.caseType === filters.caseType) : true;
      const matchQuery = q
        ? [
            p?.name?.toLowerCase().includes(q),
            p?.hn?.toLowerCase().includes(q),
            (p?.an || '').toLowerCase().includes(q),
            b.name.toLowerCase().includes(q),
          ].some(Boolean)
        : true;
      return matchBed && matchStatus && matchSurgeon && matchCase && matchQuery;
    });
  }, [filters]);

  const filteredPatients: Patient[] = useMemo(() => {
    const q = filters.query.toLowerCase();
    return patientsData.filter(p => {
      const matchStatus = filters.status ? (p.status === filters.status) : true;
      const matchSurgeon = filters.surgeon ? (p.surgeon?.toLowerCase().includes(filters.surgeon.toLowerCase()) ?? false) : true;
      const matchCase = filters.caseType ? (p.caseType === filters.caseType) : true;
      const matchQuery = q
        ? [
            p.name.toLowerCase().includes(q),
            p.hn.toLowerCase().includes(q),
            (p.an || '').toLowerCase().includes(q),
          ].some(Boolean)
        : true;
      return matchStatus && matchSurgeon && matchCase && matchQuery;
    });
  }, [filters]);

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
          <SearchBar onSearch={onSearch} />
        </section>

        <section className="cw-bedgrid">
          {filteredBeds.map(bed => (
            <BedCard key={bed.id} bed={bed} />
          ))}
        </section>

        <section className="cw-table-section">
          <h2 className="cw-sectiontitle">Registered Patients</h2>
          <RegisteredPatientsTable patients={filteredPatients} />
        </section>
      </main>
    </div>
  );
}
