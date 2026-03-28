import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="footer-root">
      <div className="footer-inner">
        <p className="footer-heading" aria-hidden="true">STAY CURIOUS</p>

        <div className="flex flex-col items-center gap-6">
          <div className="nav-logo" style={{ opacity: 0.9 }}>
            ✦ CURIOSITY INC.
          </div>
          
          <Link to="/audit" className="footer-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            REQUEST A CURIOSITY AUDIT
          </Link>
        </div>

        <div className="footer-credits">
          <p>© 2026 Curiosity Inc. · Designed for the flow state.</p>
        </div>
      </div>
    </footer>
  );
};
