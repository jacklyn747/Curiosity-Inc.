import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function isTouchDevice() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
}

export const CustomCursor: React.FC = () => {
  const reduced = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || isTouchDevice()) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    let dotX = 0, dotY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      // Kinetic Damping: Dot is reactive, Ring is lazy
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      gsap.set(cursor, { x: curX, y: curY });
      gsap.set(dot, { x: dotX, y: dotY });

      // MAGNETIC LOGIC
      if (typeof window !== 'undefined' && 'magneticTargetCache' in window) {
        (window as any).magneticTargetCache.forEach((target: HTMLElement) => {
          const rect = target.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
          const threshold = 120; // Slightly larger for better feedback

          if (dist < threshold) {
            const attr = target.getAttribute('data-magnetic');
            const strength = attr && !isNaN(parseFloat(attr)) ? parseFloat(attr) : 0.35;
            
            const deltaX = (mouseX - centerX) * strength;
            const deltaY = (mouseY - centerY) * strength;
            gsap.to(target, { 
              x: deltaX, 
              y: deltaY, 
              duration: 0.4, 
              overwrite: true, 
              ease: 'power2.out' 
            });
          } else {
            gsap.to(target, { 
              x: 0, 
              y: 0, 
              duration: 0.8, 
              overwrite: true, 
              ease: 'elastic.out(1, 0.4)' 
            });
          }
        });
      }

      requestAnimationFrame(tick);
    };

    const onMouseEnter = () => {
      cursorRef.current?.classList.add('is-hovering');
    };

    const onMouseLeave = () => {
      cursorRef.current?.classList.remove('is-hovering');
    };

    window.addEventListener('mousemove', onMouseMove);
    
    const refreshListeners = () => {
      const elements = document.querySelectorAll('a, button, [role="button"], [data-magnetic]');
      elements.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
      
      (window as any).magneticTargetCache = Array.from(document.querySelectorAll('[data-magnetic]'));
    };

    refreshListeners();
    const raf = requestAnimationFrame(tick);

    const observer = new MutationObserver(refreshListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [reduced]);

  if (reduced || isTouchDevice()) return null;

  return (
    <>
      <div 
        ref={cursorRef} 
        className="custom-cursor-container fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="cursor-ring w-10 h-10 rounded-full border border-[var(--color-text)] opacity-20 transition-all duration-500 transform-gpu" />
      </div>
      <div 
        ref={dotRef} 
        className="cursor-dot fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full pointer-events-none z-[10001] -translate-x-1/2 -translate-y-1/2 mix-blend-difference" 
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-cursor-container.is-hovering .cursor-ring {
          transform: scale(2.2);
          border-color: var(--color-accent);
          opacity: 0.4;
          background: rgba(237, 119, 60, 0.03);
        }
        
        /* Kinetic Feedback for the Dot */
        .custom-cursor-container.is-hovering ~ .cursor-dot {
          transform: translate(-50%, -50%) scale(2.5);
          background: #fff; /* High contrast for blend difference */
        }
        
        /* Hide native cursor sitewide */
        body, a, button, [role="button"], [style*="cursor: pointer"] {
          cursor: none !important;
        }
        
        @media (hover: none) {
          body, a, button, [role="button"] {
            cursor: auto !important;
          }
        }
      `}} />
    </>
  );
};

