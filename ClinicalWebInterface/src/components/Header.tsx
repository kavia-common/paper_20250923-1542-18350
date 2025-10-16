import React from 'react';

// PUBLIC_INTERFACE
export function Header(): JSX.Element {
  /** Simple header with app title and a placeholder for role/user */
  return (
    <header className="cw-header">
      <div className="cw-header__brand">
        <span className="cw-header__logo" aria-hidden>🩺</span>
        <h1 className="cw-header__title">Clinical Dashboard</h1>
      </div>
      <div className="cw-header__user">
        <span className="cw-header__role">Role: Anesthesiologist</span>
        <span className="cw-header__userbadge" title="Logged in user">Dr. A</span>
      </div>
    </header>
  );
}

export default Header;
