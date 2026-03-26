// src/components/hero/HeroSection.tsx
import { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
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

  // Progress lives in a ref — no React state, no re-renders from scroll.
  const progressRef = useRef(0);

  // Text elements updated directly via DOM refs to avoid React re-renders.
  const text1Ref = useRef<HTMLParagraphElement>(null);
  const text2Ref = useRef<HTMLParagraphElement>(null);

  const handleProgress = useCallback((p: number) => {
    progressRef.current = p;
    if (text1Ref.current) text1Ref.current.style.opacity = p >= 0.85 ? '1' : '0';
    if (text2Ref.current) text2Ref.current.style.opacity = p >= 0.9 ? '0.8' : '0';
  }, []);

  // useHeroScroll is called unconditionally (hooks must not be conditional).
  // On the fallback path, containerRef.current is null and the hook safely no-ops.
  useHeroScroll(containerRef, handleProgress);

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
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ position: 'absolute', inset: 0 }}
        onCreated={() => {
          // Refresh ScrollTrigger AFTER canvas has committed dimensions to DOM.
          // Must be here (onCreated), not before mount — premature refresh produces
          // wrong pinned-spacer height and corrupts scroll positions for sections below.
          import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
        }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        {/* Explicit dark background prevents white clear-color flash between frames */}
        <color attach="background" args={['#1D1E20']} />
        <ParticleField progressRef={progressRef} />
      </Canvas>

      {/* Text overlay — opacity driven imperatively via text1Ref/text2Ref, not React state */}
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
        <p
          ref={text1Ref}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontStyle: 'italic',
            color: 'var(--color-text)',
            opacity: 0,
            transition: 'opacity 600ms ease',
            marginBottom: '1rem',
          }}
        >
          Your audience is learning from you.
        </p>
        <p
          ref={text2Ref}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontStyle: 'italic',
            color: 'var(--color-text-dim)',
            opacity: 0,
            transition: 'opacity 600ms ease',
          }}
        >
          You just haven't designed what they're learning.
        </p>
      </div>
    </div>
  );
}
