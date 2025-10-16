import React from 'react';
import '../styles/header.css';

// PUBLIC_INTERFACE
export function Header(): JSX.Element {
  /**
   * Top application header with:
   * - Left: hamburger menu and "Clinical System" title
   * - Right: Admin name and circular avatar
   */
  const handleMenuActivate = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Placeholder: In a future iteration this can open a sidebar/drawer
    if ('key' in e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
    }
    alert('Menu clicked');
  };

  const initials = 'AD'; // Placeholder initials for "Admin"

  return (
    <header className="cw-top-header" role="banner" aria-label="Application Header">
      <div className="cw-top-header__left">
        <button
          type="button"
          className="cw-top-header__menu"
          aria-label="Open navigation menu"
          onClick={handleMenuActivate}
          onKeyDown={handleMenuActivate}
        >
          <span className="cw-top-header__menu-icon" aria-hidden="true">
            <span />
          </span>
        </button>
        <div className="cw-top-header__brand">
          <h1 className="cw-top-header__title">Clinical System</h1>
        </div>
      </div>

      <div className="cw-top-header__right">
        <div className="cw-top-header__user" aria-label="Current user">
          <span className="cw-top-header__user-name">Admin</span>
          <span className="cw-top-header__avatar" aria-hidden="true" title="Admin profile">
            {initials}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
