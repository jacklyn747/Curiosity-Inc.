import React from 'react';

interface BodyTextProps {
  children: React.ReactNode;
  weight?: 'light' | 'normal';
  className?: string;
  as?: 'p' | 'div' | 'span';
}

export const BodyText: React.FC<BodyTextProps> = ({ 
  children, 
  weight = 'normal', 
  className = '', 
  as: Component = 'p' 
}) => {
  const fontWeightClass = weight === 'light' ? 'font-light' : 'font-normal';

  return (
    <Component className={`body-text ${fontWeightClass} ${className}`}>
      {children}
    </Component>
  );
};
