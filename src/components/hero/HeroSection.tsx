// src/components/hero/HeroSection.tsx
import { useRef, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHeroScroll } from '../../hooks/useHeroScroll';
import { ParticleField } from './ParticleField';
import { HeroFallback } from './HeroFallback';
import gsap from 'gsap';

/**
 * Check WebGL support synchronously before mounting the canvas.
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
  const progressRef = useRef(0);

  // Refs for scroll-driven secondary text
  const text1Ref = useRef<HTMLParagraphElement>(null);
  const text2Ref = useRef<HTMLParagraphElement>(null);

  // Refs for the always-visible hero content
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const handleProgress = useCallback((p: number) => {
    progressRef.current = p;
    if (text1Ref.current) text1Ref.current.style.opacity = p >= 0.85 ? '1' : '0';
    if (text2Ref.current) text2Ref.current.style.opacity = p >= 0.9 ? '0.8' : '0';
    // Fade out the hero headline as particles take over
    if (headlineRef.current) {
      headlineRef.current.style.opacity = String(Math.max(0, 1 - p * 3));
    }
    if (eyebrowRef.current) {
      eyebrowRef.current.style.opacity = String(Math.max(0, 1 - p * 3));
    }
    if (scrollHintRef.current) {
      scrollHintRef.current.style.opacity = String(Math.max(0, 1 - p * 5));
    }
  }, []);

  useHeroScroll(containerRef, handleProgress);

  // Entrance animation — staggered reveal on mount
  useEffect(() => {
    if (reduced) return;
    const els = [eyebrowRef.current, headlineRef.current, scrollHintRef.current].filter(Boolean);
    gsap.fromTo(
      els,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.18, delay: 0.3 }
    );
  }, [reduced]);

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
          import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
        }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#171716']} />
        <ParticleField progressRef={progressRef} />
      </Canvas>

      {/* ── ALWAYS-VISIBLE HERO STATEMENT ──────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
        padding: 'clamp(40px, 6vw, 80px)',
        paddingBottom: 'clamp(60px, 8vh, 100px)',
      }}>
        {/* Eyebrow */}
        <span
          ref={eyebrowRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(11px, 1vw, 13px)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-transformation)',
            opacity: 0, // animated in on mount
            display: 'block',
            marginBottom: '1.5rem',
          }}
        >
          — Learning Architecture Studio
        </span>

        {/* Primary Headline */}
        <h1
          ref={headlineRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(52px, 7.5vw, 120px)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.05,
            color: 'var(--color-text)',
            margin: 0,
            maxWidth: '14ch',
            opacity: 0, // animated in on mount
          }}
        >
          Your audience can't learn what they can't{' '}
          <em style={{ color: 'var(--color-transformation)', fontStyle: 'normal' }}>retain.</em>
        </h1>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          style={{
            marginTop: '3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0,
          }}
        >
          <div style={{
            width: '32px',
            height: '1px',
            backgroundColor: 'var(--color-transformation)',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(232,230,224,0.4)',
          }}>Scroll to explore</span>
        </div>
      </div>

      {/* ── SCROLL-REVEALED SECONDARY COPY ─────────────────────── */}
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
        background: 'radial-gradient(ellipse at center, rgba(23, 23, 22, 0.95) 0%, rgba(23, 23, 22, 0.6) 40%, transparent 70%)'
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
