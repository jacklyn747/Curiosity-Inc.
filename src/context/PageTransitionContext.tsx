// src/context/PageTransitionContext.tsx
import { createContext, useContext } from 'react';

interface PageTransitionContextValue {
  triggerTransition: (path: string) => void;
}

export const PageTransitionContext = createContext<PageTransitionContextValue>({
  triggerTransition: () => {},
});

export function usePageTransition(): PageTransitionContextValue {
  return useContext(PageTransitionContext);
}
