import React, { useState } from 'react';

export interface SearchFilters {
  query: string; // name / HN / AN
  bed: string;
  status: string;
  surgeon: string;
  caseType: string;
}

// PUBLIC_INTERFACE
export function SearchBar({
  onSearch,
}: {
  /** Callback when search is triggered with current filters */
  onSearch: (filters: SearchFilters) => void;
}): JSX.Element {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    bed: '',
    status: '',
    surgeon: '',
    caseType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form className="cw-search" onSubmit={handleSearch}>
      <div className="cw-search__row">
        <div className="cw-field">
          <label className="cw-label" htmlFor="query">Name / HN / AN</label>
          <input
            id="query"
            name="query"
            className="cw-input"
            value={filters.query}
            onChange={handleChange}
          />
        </div>

        <div className="cw-field">
          <label className="cw-label" htmlFor="bed">Bed</label>
          <input
            id="bed"
            name="bed"
            className="cw-input"
            value={filters.bed}
            onChange={handleChange}
          />
        </div>

        <div className="cw-field">
          <label className="cw-label" htmlFor="status">Status</label>
          <select id="status" name="status" className="cw-select" value={filters.status} onChange={handleChange}>
            <option value="">Any</option>
            <option>Admitted</option>
            <option>Pre-admission</option>
            <option>Discharged</option>
            <option>In-OR</option>
            <option>Post-Op</option>
          </select>
        </div>

        <div className="cw-field">
          <label className="cw-label" htmlFor="surgeon">Surgeon</label>
          <input
            id="surgeon"
            name="surgeon"
            className="cw-input"
            value={filters.surgeon}
            onChange={handleChange}
          />
        </div>

        <div className="cw-field">
          <label className="cw-label" htmlFor="caseType">Case Type</label>
          <select id="caseType" name="caseType" className="cw-select" value={filters.caseType} onChange={handleChange}>
            <option value="">Any</option>
            <option>Elective</option>
            <option>Emergency</option>
          </select>
        </div>

        <div className="cw-field cw-field--actions">
          <button className="cw-btn" type="submit">Search</button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
