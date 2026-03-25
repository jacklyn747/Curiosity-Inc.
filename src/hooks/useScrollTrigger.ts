import { useState, useEffect, useRef } from 'react';

/**
 * useScrollTrigger — IntersectionObserver wrapper for scroll-triggered entry.
 * Once inView is true, it stays true (no re-trigger).
 *
 * @param {IntersectionObserverInit} options — standard IO options
 * @returns {Object} { ref: React.RefObject, inView: boolean }
 */
export function useScrollTrigger(options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el); // Kill observer after first trigger
      }
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [inView, options]);

  return { ref, inView };
}
