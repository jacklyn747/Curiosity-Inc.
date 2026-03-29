import React from 'react';

interface DisplayHeadingProps {
  children: React.ReactNode;
  accent?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const DisplayHeading: React.FC<DisplayHeadingProps> = ({ 
  children, 
  accent, 
  className = '', 
  as: Component = 'h2' 
}) => {
  if (!accent || typeof children !== 'string') {
    return (
      <Component className={`display-heading ${className}`}>
        {children}
      </Component>
    );
  }

  const parts = children.split(new RegExp(`(${accent})`, 'gi'));

  return (
    <Component className={`display-heading ${className}`}>
      {parts.map((part, i) => 
        part.toLowerCase() === accent.toLowerCase() ? (
          <span key={i} style={{ color: 'var(--color-transformation)' }}>{part}</span>
        ) : (
          part
        )
      )}
    </Component>
  );
};
