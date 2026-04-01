import React from 'react';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, className = '', id }) => {
  const { ref, inView } = useScrollTrigger({ threshold: 0.05 });

  return (
    <div 
      ref={ref as any}
      id={id}
      className={`section-label flex items-center gap-4 ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.8s var(--ease-out)',
      }}
    >
      <span 
        className="h-[1px] bg-[rgba(234,228,218,0.2)] transition-all duration-1000 ease-[var(--ease-out)]"
        style={{ width: inView ? '40px' : '0px' }}
        aria-hidden="true" 
      />
      <span 
        className="font-mono text-[11px] uppercase transition-all duration-1000"
        style={{ 
          color: 'var(--color-text-dim)',
          letterSpacing: inView ? '0.12em' : '0.3em',
          filter: inView ? 'blur(0)' : 'blur(2px)',
        }}
      >
        {children}
      </span>
    </div>
  );
};
