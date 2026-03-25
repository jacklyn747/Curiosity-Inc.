import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, className = '' }) => {
  return (
    <div className={`section-label ${className}`}>
      <span style={{ color: 'var(--color-context-dim)' }} aria-hidden="true">——</span>
      <span>{children}</span>
    </div>
  );
};
