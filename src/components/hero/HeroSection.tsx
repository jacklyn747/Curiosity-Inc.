// src/components/hero/HeroSection.tsx
import { useRef, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHeroScroll } from '../../hooks/useHeroScroll';
import { ParticleField } from './ParticleField';
import { HeroFallback } from './HeroFallback';
import gsap from 'gsap';

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

  // Scroll-driven secondary text refs
  const text1Ref = useRef<HTMLParagraphElement>(null);
  const text2Ref = useRef<HTMLParagraphElement>(null);

  // Hero layout element refs for entrance + scroll fade
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaLeftRef = useRef<HTMLDivElement>(null);
  const metaRightRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  // Custom cursor refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  const handleProgress = useCallback((p: number) => {
    progressRef.current = p;
    if (text1Ref.current) text1Ref.current.style.opacity = p >= 0.85 ? '1' : '0';
    if (text2Ref.current) text2Ref.current.style.opacity = p >= 0.9 ? '0.8' : '0';

    const fadeOut = Math.max(0, 1 - p * 4);
    [headlineRef, eyebrowRef, metaLeftRef, metaRightRef, scrollHintRef, dividerRef].forEach(r => {
      if (r.current) r.current.style.opacity = String(fadeOut);
    });
  }, []);

  useHeroScroll(containerRef, handleProgress);

  // Entrance animation
  useEffect(() => {
    if (reduced) return;

    const tl = gsap.timeline({ delay: 0.2 });

    // Hairline divider draws across first
    tl.fromTo(dividerRef.current,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }
    );

    // Corner metadata fades in
    tl.fromTo(
      [eyebrowRef.current, metaLeftRef.current, metaRightRef.current],
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 },
      '-=0.6'
    );

    // Headline lines reveal one by one (clip-path wipe)
    const lines = headlineRef.current?.querySelectorAll('.hero-line');
    if (lines?.length) {
      tl.fromTo(
        lines,
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.12 },
        '-=0.4'
      );
    }

    // Scroll hint last
    tl.fromTo(scrollHintRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );
  }, [reduced]);

  // Custom cursor
  useEffect(() => {
    if (reduced || isTouchDevice()) return;

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    // Ring follows with lag
    const tick = () => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      gsap.set(cursor, { x: curX, y: curY });
      requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    const raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const useFallback = reduced || isTouchDevice() || !supportsWebGL();

  if (useFallback) {
    return <HeroFallback />;
  }

  return (
    <>
      {/* ── CUSTOM CURSOR ──────────────────────────────────────── */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '40px', height: '40px',
          borderRadius: '50%',
          border: '1px solid var(--color-transformation)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          transition: 'opacity 0.3s',
        }}
      />
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '5px', height: '5px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-transformation)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* ── HERO SECTION ───────────────────────────────────────── */}
      <div
        ref={containerRef}
        id="hero"
        style={{
          width: '100%',
          height: '100vh',
          position: 'relative',
          backgroundColor: 'var(--color-void)',
          cursor: 'none',
        }}
      >
        {/* Particle canvas — full bleed bg */}
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

        {/* ── GRID OVERLAY ─────────────────────────────────────── */}
        {/* Hairline horizontal divider at ~38% height */}
        <div
          ref={dividerRef}
          style={{
            position: 'absolute',
            top: '32%',
            left: 'max(40px, 4vw)',
            right: 'max(40px, 4vw)',
            height: '1px',
            backgroundColor: 'rgba(232, 230, 224, 0.12)',
            pointerEvents: 'none',
          }}
        />

        {/* ── EYEBROW ROW — sits just above the divider ────────── */}
        <div
          ref={eyebrowRef}
          style={{
            position: 'absolute',
            top: 'calc(32% - 2.5rem)',
            left: 'max(40px, 4vw)',
            right: 'max(40px, 4vw)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            pointerEvents: 'none',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(10px, 0.9vw, 12px)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-transformation)',
          }}>
            — Learning Architecture
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(10px, 0.9vw, 12px)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(232,230,224,0.3)',
          }}>
            Est. 2023
          </span>
        </div>

        {/* ── PRIMARY HEADLINE — below divider, left-anchored ────── */}
        <div style={{
          position: 'absolute',
          top: '34%',
          left: 'max(40px, 4vw)',
          right: 'max(40px, 4vw)',
          pointerEvents: 'none',
        }}>
          <h1
            ref={headlineRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px, 7vw, 118px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              margin: 0,
              overflow: 'hidden',
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              <span className="hero-line" style={{ display: 'block' }}>
                You've been
              </span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span className="hero-line" style={{ display: 'block' }}>
                <em style={{
                  fontStyle: 'normal',
                  color: 'var(--color-accent)',
                }}>teaching</em>
              </span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span className="hero-line" style={{ display: 'block' }}>
                this whole time.
              </span>
            </div>
          </h1>
        </div>

        {/* ── BOTTOM METADATA ROW ──────────────────────────────── */}
        <div style={{
          position: 'absolute',
          bottom: 'max(32px, 4vh)',
          left: 'max(40px, 4vw)',
          right: 'max(40px, 4vw)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}>
          {/* Left meta */}
          <div ref={metaLeftRef} style={{ maxWidth: '320px' }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(16px, 1.2vw, 18px)',
              lineHeight: 1.6,
              color: 'rgba(234,228,218,0.5)',
              margin: 0,
              fontWeight: 300,
            }}>
              Nobody told you. That's the whole problem.
              <br />We fix what nobody showed you how to build.
            </p>
          </div>

          {/* Right — scroll hint */}
          <div ref={metaRightRef} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
          }}>
            <div ref={scrollHintRef} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(232,230,224,0.35)',
              }}>Scroll</span>
              {/* Animated down arrow */}
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ color: 'var(--color-transformation)' }}>
                <line x1="8" y1="0" x2="8" y2="20" stroke="currentColor" strokeWidth="1"/>
                <polyline points="3,15 8,21 13,15" fill="none" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </div>
          </div>
        </div>

        {/* ── SCROLL-REVEALED SECONDARY COPY (existing) ──────────── */}
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
          background: 'radial-gradient(ellipse at center, rgba(23,23,22,0.95) 0%, rgba(23,23,22,0.6) 40%, transparent 70%)'
        }}>
          <p ref={text1Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontStyle: 'italic',
            color: 'var(--color-text)',
            opacity: 0,
            transition: 'opacity 600ms ease',
            marginBottom: '1rem',
          }}>
            Your audience is learning from you.
          </p>
          <p ref={text2Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontStyle: 'italic',
            color: 'var(--color-text-dim)',
            opacity: 0,
            transition: 'opacity 600ms ease',
          }}>
            You just haven't designed what they're learning.
          </p>
        </div>
      </div>
    </>
  );
}
