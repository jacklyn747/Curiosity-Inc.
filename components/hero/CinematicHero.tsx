'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SacredGeometrySVG, type SacredGeometryRefs } from './SacredGeometrySVG'
import { NoiseCanvas, type NoiseCanvasRefs } from './NoiseCanvas'
import { CognitiveBands, type CognitiveBandsRefs } from './CognitiveBands'
import { buildScrollTimeline } from '@/lib/hero-timeline'

export function CinematicHero() {
  const sectionRef    = useRef<HTMLElement>(null)
  const fullImageRef  = useRef<HTMLDivElement>(null)
  const textMaskRef   = useRef<HTMLDivElement>(null)
  const geometryRef   = useRef<SacredGeometryRefs>(null)
  const noiseRef      = useRef<NoiseCanvasRefs>(null)
  const eyebrowRef    = useRef<HTMLParagraphElement>(null)
  const subheadRef    = useRef<HTMLParagraphElement>(null)
  const ctasRef       = useRef<HTMLDivElement>(null)
  const bandsRef      = useRef<CognitiveBandsRefs>(null)

  useEffect(() => {
    const section   = sectionRef.current
    const fullImage = fullImageRef.current
    const textMask  = textMaskRef.current
    const geometry  = geometryRef.current
    const noise     = noiseRef.current
    const eyebrow   = eyebrowRef.current
    const subhead   = subheadRef.current
    const ctas      = ctasRef.current
    const bands     = bandsRef.current

    if (!section || !fullImage || !textMask || !geometry || !noise ||
        !eyebrow || !subhead || !ctas || !bands) return

    // ── Reduced motion: skip to final state ───────────────────
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      gsap.set(fullImage, { opacity: 1 })
      gsap.set(textMask, { scale: 1, color: 'var(--shell)', backgroundImage: 'none' })
      gsap.set(eyebrow, { opacity: 0.5 })
      gsap.set(subhead, { opacity: 0.75 })
      gsap.set(ctas, { opacity: 1 })
      if (bands.container) gsap.set(bands.container, { opacity: 1 })
      return
    }

    // ── Start grain animation ───────────────────────────────
    noise.startGrain()

    // ── Build scroll-driven timeline ────────────────────────
    const refs = {
      section, fullImage, textMask, geometry, noise,
      eyebrow, subhead, ctas, bands,
    }
    const tl = buildScrollTimeline(refs)

    // ── Stop grain when past noise stage ────────────────────
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=500%',
      onUpdate: (self) => {
        if (self.progress > 0.25) {
          noise.stopGrain()
        } else {
          if (!noise.canvas?.getContext('2d')) return
          noise.startGrain()
        }
      },
    })

    return () => {
      tl.kill()
      noise.stopGrain()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      aria-label="Hero"
      style={{ backgroundColor: 'var(--black)' }}
    >
      {/* Layer 0: Night sky canvas */}
      <NoiseCanvas ref={noiseRef} />

      {/* Layer 1: Sacred geometry */}
      <SacredGeometrySVG ref={geometryRef} />

      {/* Layer 2: Full image (fades in during Act 3) */}
      <div
        ref={fullImageRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 3, opacity: 0 }}
      >
        <Image
          src="/images/CosmicHeroCuriosityInc.png"
          alt="Curiosity Inc — signal emerging from noise"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(29,29,27,0.35) 0%,
                rgba(29,29,27,0.0)  25%,
                rgba(29,29,27,0.0)  50%,
                rgba(29,29,27,0.4)  70%,
                rgba(29,29,27,0.95) 100%
              )
            `,
          }}
        />
      </div>

      {/* Layer 3: TEXT MASK — image visible through letterforms */}
      <div
        ref={textMaskRef}
        className="absolute inset-0 z-10 flex items-center justify-center will-change-transform"
        style={{
          backgroundImage: 'url(/images/CosmicHeroCuriosityInc.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          // Start scaled up — letters so big they're abstract shapes
          transform: 'scale(5)',
          transformOrigin: 'center center',
        }}
      >
        <h1
          className="t-headline text-center select-none"
          style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            maxWidth: '800px',
            fontWeight: 700,
            padding: '0 24px',
          }}
        >
          Strong Opinions
          <br />
          Turn Theory
          <br />
          into Culture.
        </h1>
      </div>

      {/* Layer 4: Eyebrow + Subhead + CTAs (fade in at end) */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
        style={{ paddingTop: '220px' }}
      >
        <p
          ref={eyebrowRef}
          className="t-eyebrow pointer-events-auto"
          style={{
            letterSpacing: '0.32em',
            opacity: 0,
            position: 'absolute',
            top: 'clamp(120px, 22vh, 260px)',
          }}
        >
          Behavioral Design Studio
        </p>

        <p
          ref={subheadRef}
          className="t-body text-center pointer-events-auto"
          style={{
            fontSize: '18px',
            maxWidth: '480px',
            lineHeight: 1.6,
            opacity: 0,
            position: 'absolute',
            bottom: 'clamp(140px, 18vh, 220px)',
          }}
        >
          Cognitive Design Systems for Intellectual Creators.
        </p>

        <div
          ref={ctasRef}
          className="flex items-center gap-8 pointer-events-auto"
          style={{
            opacity: 0,
            position: 'absolute',
            bottom: 'clamp(80px, 10vh, 140px)',
          }}
        >
          <Link
            href="/framework"
            className="t-eyebrow inline-flex items-center gap-2"
            style={{
              color: 'var(--tang)',
              fontSize: '11px',
              textDecoration: 'none',
            }}
          >
            Explore Framework
            <span style={{ display: 'inline-block' }}>→</span>
          </Link>
          <Link
            href="/the-accidental-educator"
            className="t-eyebrow inline-flex items-center gap-2"
            style={{
              color: 'rgba(234,228,218,0.45)',
              fontSize: '11px',
              textDecoration: 'none',
            }}
          >
            See Who This Is For
            <span style={{ display: 'inline-block' }}>→</span>
          </Link>
        </div>
      </div>

      {/* Layer 5: Cognitive bands */}
      <CognitiveBands ref={bandsRef} />
    </section>
  )
}
