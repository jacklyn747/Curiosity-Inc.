// src/components/transitions/PageTransition.tsx
// STUB — replaced with full implementation in Chunk 5
import React from 'react';
import { PageTransitionContext } from '../../context/PageTransitionContext';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <PageTransitionContext.Provider value={{ triggerTransition: () => {} }}>
      {children}
    </PageTransitionContext.Provider>
  );
}
