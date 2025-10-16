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

  return (
    <div className="cw-search cw-search--single">
      <div className="cw-field" style={{ gridColumn: '1 / -1' }}>
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
          placeholder={placeholderText}
          aria-label="Search by patient or bed name"
        />
      </div>
    </div>
  );
}

export default SearchBar;
