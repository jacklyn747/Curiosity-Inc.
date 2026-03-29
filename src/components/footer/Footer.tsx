import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="footer-root">
      <div className="footer-inner">
        <p className="footer-heading" aria-hidden="true">STAY CURIOUS</p>

        <div className="flex flex-col items-center gap-10">
          <div className="nav-logo" style={{ opacity: 0.9 }}>
            ✦ CURIOSITY INC.
          </div>
          
          <div className="flex gap-10">
            <Link to="/" className="nav-link" style={{ opacity: 0.6 }}>WORK</Link>
            <Link to="/" className="nav-link" style={{ opacity: 0.6 }}>WRITING</Link>
            <Link to="/about" className="nav-link" style={{ opacity: 0.6 }}>ABOUT</Link>
          </div>

          <Link to="/audit" className="footer-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            REQUEST A CURIOSITY AUDIT
          </Link>
        </div>

        <div className="footer-credits" style={{ marginTop: '2rem' }}>
          <p className="font-mono text-[9px] uppercase tracking-widest opacity-30">© 2026 Curiosity Inc. · Designed for the flow state.</p>
        </div>
      </div>
    </footer>
  );
};
