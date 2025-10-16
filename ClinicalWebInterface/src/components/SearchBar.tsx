import React from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

// PUBLIC_INTERFACE
export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}) => {
  return (
    <form
      role="search"
      aria-label="Search patients and beds"
      onSubmit={(e) => e.preventDefault()}
      style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="searchQuery" style={{ fontSize: 12, color: '#556', marginBottom: 4 }}>Search</label>
        <input
          id="searchQuery"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search name, HN, AN, bed..."
          style={{
            padding: '8px 10px',
            border: '1px solid #ccd',
            borderRadius: 6,
            minWidth: 220,
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="statusFilter" style={{ fontSize: 12, color: '#556', marginBottom: 4 }}>Status</label>
        <select
          id="statusFilter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          style={{
            padding: '8px 10px',
            border: '1px solid #ccd',
            borderRadius: 6,
            minWidth: 160,
            backgroundColor: '#fff',
          }}
        >
          <option value="">All</option>
          <option value="Admitted">Admitted</option>
          <option value="In-OR">In-OR</option>
          <option value="ICU">ICU</option>
          <option value="Registered">Registered</option>
          <option value="Pre-Admission">Pre-Admission</option>
          <option value="Discharged">Discharged</option>
        </select>
      </div>

      <div aria-hidden="true" style={{ flex: 1 }} />
    </form>
  );
};
