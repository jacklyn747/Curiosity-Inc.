import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="footer-root">
      <div className="footer-inner">
        <p className="footer-heading" aria-hidden="true">STAY CURIOUS</p>

        <div className="flex flex-col items-center gap-6">
          <div className="nav-logo" style={{ opacity: 0.9 }}>
            ✦ CURIOSITY INC.
          </div>
          
          <button className="footer-btn">
            JOIN THE COLLECTIVE
          </button>
        </div>

        <div className="footer-credits">
          <p>© 2026 Curiosity Inc. · Designed for the flow state.</p>
        </div>
      </div>
    </footer>
  );
};
