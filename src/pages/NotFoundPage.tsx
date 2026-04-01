import React from 'react';
import { Link } from 'react-router-dom';
import { DisplayHeading } from '../components/typography/DisplayHeading';

export const NotFoundPage: React.FC = () => {
  return (
    <main 
      className="min-h-screen relative flex items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: 'var(--color-void)' }}
    >
      <div className="relative z-10 flex flex-col items-center gap-12 text-center max-w-[800px]">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-accent)] uppercase opacity-60">
            Error 404
          </span>
          <DisplayHeading as="h1" className="text-white">
            This architecture<br />does not exist.
          </DisplayHeading>
          <p className="font-body text-[16px] text-[var(--color-text-dim)] italic max-w-[480px] mx-auto mt-4">
            A deviation from the path. The information you seeking has drifted beyond the laboratory's current reach.
          </p>
        </div>

        <Link 
          to="/" 
          className="group relative inline-flex items-center gap-4 px-10 py-4 border border-[var(--color-accent)] rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-all"
        >
          <span className="relative font-mono text-[10px] tracking-[0.15em] text-[var(--color-accent)] uppercase font-bold">
            Return Home
          </span>
          <span className="relative text-[var(--color-accent)]">
            →
          </span>
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
