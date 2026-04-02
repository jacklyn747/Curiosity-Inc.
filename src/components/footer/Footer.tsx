import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="grid-architectural py-40 bg-[var(--void-deep)] relative overflow-hidden border-t border-[rgba(255,255,255,0.03)] mt-auto">
      {/* Noise + Grain Overlay for specific footer texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      
      {/* Asymmetric Dithered Accent */}
      <div className="absolute top-0 left-[-10%] w-[40%] h-full bg-gradient-to-r from-[rgba(237,119,60,0.03)] to-transparent pointer-events-none" />

      <div className="col-narrow flex flex-col items-center text-center gap-12 relative z-10 w-full">
        <h2 className="font-display text-[clamp(48px,8vw,120px)] italic text-[var(--color-text)] opacity-10 m-0 leading-none select-none">
          Stay Curious.
        </h2>

        <div className="flex flex-col items-center gap-8">
          <div className="nav-logo text-[14px] tracking-[0.25em]" style={{ opacity: 0.9 }}>
            ✦ CURIOSITY INC.
          </div>
          
          <nav className="flex gap-12" aria-label="Footer navigation">
            <Link to="/" className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-500">WORK</Link>
            <a 
              href="https://read.curiosityinc.online" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-500"
            >
              WRITING
            </a>
            <Link to="/about" className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-500">ABOUT</Link>
          </nav>

          <Link 
            to="/audit" 
            className="group relative inline-flex items-center justify-center overflow-hidden border border-[rgba(237,119,60,0.2)] px-12 py-6 transition-all duration-700 ease-[var(--ease-out)] hover:border-[rgba(237,119,60,0.6)]"
            style={{ textDecoration: 'none' }}
            data-magnetic="0.4"
          >
            <div className="absolute inset-0 bg-[var(--color-accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[var(--ease-out)]" />
            <span className="relative z-10 font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-accent)] group-hover:text-[#181817] transition-colors duration-500">
              REQUEST A CURIOSITY AUDIT →
            </span>
          </Link>
        </div>

        <div className="mt-20 pt-12 border-t border-[rgba(255,255,255,0.03)] w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[9px] uppercase tracking-widest opacity-20">© 2026 Curiosity Inc. · NYC / REMOTE</p>
          <p className="font-mono text-[9px] uppercase tracking-widest opacity-20">Designed for the flow state.</p>
        </div>
      </div>
    </footer>
  );
};
