// src/hooks/useHeroScroll.ts
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the hero section and returns scroll progress 0–1 across 300vh.
 * CRITICAL: kills the ScrollTrigger instance on unmount to prevent
 * pinned spacer from corrupting scroll positions for sections below.
 */
export function useHeroScroll(containerRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    triggerRef.current = trigger;

    return () => {
      trigger.kill();
      triggerRef.current = null;
    };
  }, [containerRef]);

  return progress;
}
