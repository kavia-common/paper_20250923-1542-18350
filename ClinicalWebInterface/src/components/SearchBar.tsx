import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  /** Current value shown in the input (optional, for controlled use) */
  value?: string;
  /** Called with the debounced value after ~300ms of inactivity */
  onChange: (value: string) => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Debounce delay in ms (defaults to 300) */
  delayMs?: number;
};

// PUBLIC_INTERFACE
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search by patient or bed name…',
  delayMs = 300,
}: Props): JSX.Element {
  // Keep an internal input state to enable debouncing
  const [innerValue, setInnerValue] = useState<string>(value ?? '');

  // Keep inner state in sync if parent changes provided value
  useEffect(() => {
    if (value !== undefined && value !== innerValue) {
      setInnerValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Debounce handler
  useEffect(() => {
    const handle = setTimeout(() => {
      onChange(innerValue);
    }, delayMs);
    return () => clearTimeout(handle);
  }, [innerValue, delayMs, onChange]);

  const placeholderText = useMemo(
    () => placeholder || 'Search by patient or bed name…',
    [placeholder]
  );

  // Trigger an immediate search using current innerValue
  const runSearch = () => {
    onChange(innerValue);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearch();
    }
  };

  return (
    <div className="cw-search cw-search--single" role="search" aria-label="Unified search">
      <div className="cw-search-row">
        <div className="cw-field cw-search-row__input">
          <label className="cw-label" htmlFor="unified-search">
            Search
          </label>
          <input
            id="unified-search"
            className="cw-input"
            type="text"
            inputMode="search"
            value={innerValue}
            onChange={(e) => setInnerValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholderText}
            aria-label="Search by patient or bed name"
          />
        </div>
        <div className="cw-field cw-field--actions cw-search-row__button" aria-hidden="false">
          <button
            type="button"
            className="cw-btn cw-btn--primary"
            onClick={runSearch}
            aria-label="Run search"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
