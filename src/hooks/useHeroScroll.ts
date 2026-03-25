// src/hooks/useHeroScroll.ts
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the hero section and calls onProgress(0–1) on each scroll tick.
 * Uses a callback (not state) so scroll does not trigger React re-renders.
 * CRITICAL: kills the ScrollTrigger instance on unmount to prevent
 * pinned spacer from corrupting scroll positions for sections below.
 */
export function useHeroScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void
) {
  // Stable ref for the callback — avoids recreating the ScrollTrigger when
  // the callback identity changes (e.g. on parent re-render).
  const onProgressRef = useRef(onProgress);
  useEffect(() => { onProgressRef.current = onProgress; });

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        onProgressRef.current(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [containerRef]);
}
