import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SelfDrawOptions {
  delay?: number;
  duration?: number;
  easing?: string;
  triggerOnce?: boolean;
}

/**
 * useSelfDraw — SVG stroke-dashoffset animation triggered by IntersectionObserver.
 * 
 * @param {SelfDrawOptions} config — { delay, duration (default 1200ms), easing }.
 * @returns {React.RefObject<any>} Ref for SVG elements (paths, lines, etc.)
 */
export function useSelfDraw(config?: SelfDrawOptions) {
  const ref = useRef<SVGPathElement | SVGLineElement | SVGCircleElement | any>(null);
  const { delay = 0, duration = 1.2, easing = 'circ.out', triggerOnce = true } = config || {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial stroke-dasharray and dashoffset
    let len: number;
    try {
      len = el.getTotalLength();
    } catch (e) {
      // Fallback for non-path elements or cases where getTotalLength fails
      len = 1000; 
    }

    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(el, {
          strokeDashoffset: 0,
          duration,
          delay: delay / 1000,
          ease: easing,
        });
        
        if (triggerOnce) observer.unobserve(el);
      }
    }, { threshold: 0.1 });

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [delay, duration, easing, triggerOnce]);

  return ref;
}
