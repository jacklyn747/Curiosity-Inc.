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

  const handleProgress = useCallback((p: number) => {
    progressRef.current = p;
    if (text1Ref.current) text1Ref.current.style.opacity = p >= 0.85 ? '1' : '0';
    if (text2Ref.current) text2Ref.current.style.opacity = p >= 0.9 ? '0.8' : '0';

    const fadeOut = Math.max(0, 1 - p * 1.6); // slower fade out (finishes at ~0.6 instead of 0.25)
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

    // Headline lines reveal one by one
    const lines = headlineRef.current?.querySelectorAll('.hero-line');
    if (lines?.length) {
      tl.fromTo(
        lines,
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.12 },
        '-=0.4'
      );
    }

    // Navigation revealing alongside the headline
    tl.fromTo(
      '.nav-logo',
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
      '-=1.2'
    );

    tl.fromTo(
      '.nav-links .nav-reveal',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05 },
      '-=0.8'
    );

    // Scroll hint last
    tl.fromTo(scrollHintRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );
  }, [reduced]);

  const useFallback = reduced || isTouchDevice() || !supportsWebGL();


  if (useFallback) {
    return <HeroFallback />;
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className="w-full min-h-screen relative bg-[var(--color-void)] overflow-hidden cursor-none"
    >
      {/* ── BACKGROUND LAYER ────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
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
      </div>

      {/* ── INTERACTIVE GRID CONTENT ───────────────────────────── */}
      <div className="grid-architectural relative z-10 w-full min-h-screen pt-[30vh]">
        
        {/* Hairline horizontal divider */}
        <div
          ref={dividerRef}
          className="col-full h-[1px] bg-[rgba(232,230,224,0.12)] pointer-events-none mb-12"
        />

        {/* Eyebrow Row */}
        <div
          ref={eyebrowRef}
          className="col-narrow flex justify-between items-end pointer-events-none mb-8"
        >
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-transformation)]">
            — Learning Architecture
          </span>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[rgba(232,230,224,0.3)]">
            Est. 2023
          </span>
        </div>

        {/* Primary Headline */}
        <div className="col-narrow md:col-wide pointer-events-none">
          <h1
            ref={headlineRef}
            className="font-display text-[clamp(52px,7vw,118px)] font-normal italic leading-[0.95] tracking-tight text-[var(--color-text)] m-0 overflow-hidden"
          >
            <div className="overflow-hidden">
              <span className="hero-line block">You've been</span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-line block">
                <em className="font-normal text-[var(--color-accent)] not-italic">teaching</em>
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-line block">this whole time.</span>
            </div>
          </h1>
        </div>

        {/* Bottom Metadata Row */}
        <div className="col-narrow flex justify-between items-end pointer-events-none mt-auto pb-20">
          <div ref={metaLeftRef} className="max-w-[320px]">
            <p className="font-body text-[18px] leading-relaxed text-[rgba(234,228,218,0.5)] m-0 font-light">
              There's a name for what you should have been doing.
              <br />Nobody brought it to you until now.
            </p>
          </div>

          <div ref={metaRightRef} className="hidden md:flex flex-col items-end gap-6 h-full justify-end">
            {/* The Signature Invitation — Subtle, Magnetic, High-Intent */}
            <button 
              className="group relative flex items-center gap-4 py-3 px-6 border border-[rgba(237,119,60,0.15)] bg-transparent focus:outline-none"
              data-magnetic="0.4"
              onClick={() => window.location.hash = '#reveal'}
            >
              <div className="absolute inset-0 bg-[var(--color-accent)] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-accent)] flex items-center gap-3">
                Curiosity Audit
                <span className="transform group-hover:translate-x-1 transition-transform duration-500">→</span>
              </span>
            </button>

            <div ref={scrollHintRef} className="flex items-center gap-3 pr-2">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[rgba(232,230,224,0.35)]">Scroll</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-[var(--color-transformation)]">
                <line x1="8" y1="0" x2="8" y2="20" stroke="currentColor" strokeWidth="1"/>
                <polyline points="3,15 8,21 13,15" fill="none" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll-Revealed Center Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center z-20">
          <div className="max-w-[800px] py-20 bg-gradient-to-b from-transparent via-[#171716]/90 to-transparent">
            <p ref={text1Ref} className="font-display text-[clamp(24px,4vw,48px)] italic text-[var(--color-text)] opacity-0 transition-opacity duration-700 mb-4">
              Your audience is learning from you.
            </p>
            <p ref={text2Ref} className="font-display text-[clamp(24px,4vw,48px)] italic text-[var(--color-text-dim)] opacity-0 transition-opacity duration-700">
              You just haven't designed what they're learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
