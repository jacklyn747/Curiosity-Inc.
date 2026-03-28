import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { lenisInstance } from '../../lib/lenis';

/**
 * ScrollToTop ensures that whenever the route changes, the window is scrolled
 * back to the top (0, 0). Essential for SPAs where navigation might otherwise 
 * maintain the previous page's scroll position.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Standard window scroll for baseline browser Behavior
    window.scrollTo(0, 0);

    // 2. Lenis reset to ensure smooth scroll engine is in sync
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
};
