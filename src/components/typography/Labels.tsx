import React from 'react';

interface DataLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const DataLabel: React.FC<DataLabelProps> = ({ children, className = '' }) => {
  return (
    <span className={`data-label ${className}`}>
      {children}
    </span>
  );
};

interface InsightCalloutProps {
  children: React.ReactNode;
  as?: 'span' | 'p' | 'div';
  className?: string;
}

export const InsightCallout: React.FC<InsightCalloutProps> = ({ 
  children, 
  as: Component = 'span', 
  className = '' 
}) => {
  return (
    <Component className={`insight-callout ${className}`}>
      {children}
    </Component>
  );
};
