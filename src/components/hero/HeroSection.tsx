// src/components/hero/HeroSection.tsx
import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHeroScroll } from '../../hooks/useHeroScroll';
import { ParticleField } from './ParticleField';
import { HeroFallback } from './HeroFallback';

/**
 * Check WebGL support synchronously before mounting the canvas.
 * More reliable than detecting failure inside r3f's onCreated,
 * which only fires on success.
 */
function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function isTouchDevice() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
}

export function HeroSection() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useHeroScroll(containerRef);
  // Note: useHeroScroll is called unconditionally (hooks must not be conditional).
  // On the fallback path, containerRef.current is null and the hook safely no-ops.
  const [isVisible, setIsVisible] = useState(true);

  // Unmount canvas once hero scrolls fully out of view
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const useFallback = reduced || isTouchDevice() || !supportsWebGL();

  if (useFallback) {
    return <HeroFallback />;
  }

  return (
    <div
      ref={containerRef}
      id="hero"
      style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: 'var(--color-void)' }}
    >
      {isVisible && (
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 0, 6], fov: 60 }}
          style={{ position: 'absolute', inset: 0 }}
          onCreated={() => {
            // Refresh ScrollTrigger AFTER canvas has committed dimensions to DOM.
            // Must be here (onCreated), not before mount — premature refresh produces
            // wrong pinned-spacer height and corrupts scroll positions for sections below.
            // ScrollTrigger is statically imported above — no dynamic import needed.
            ScrollTrigger.refresh();
          }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <ParticleField progress={progress} />
        </Canvas>
      )}

      {/* Text overlay — fades in at progress 0.85+ */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        padding: '0 24px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        left: 0, right: 0,
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 4vw, 48px)',
          fontStyle: 'italic',
          color: 'var(--color-text)',
          opacity: progress >= 0.85 ? 1 : 0,
          transition: 'opacity 600ms ease',
          marginBottom: '1rem',
        }}>
          Your audience is learning from you.
        </p>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 4vw, 48px)',
          fontStyle: 'italic',
          color: 'var(--color-text-dim)',
          opacity: progress >= 0.9 ? 0.8 : 0,
          transition: 'opacity 600ms ease',
        }}>
          You just haven't designed what they're learning.
        </p>
      </div>
    </div>
  );
}
