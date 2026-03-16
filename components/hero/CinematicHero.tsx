'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SacredGeometrySVG, type SacredGeometryRefs } from './SacredGeometrySVG'
import { NoiseCanvas, type NoiseCanvasRefs } from './NoiseCanvas'
import { CognitiveBands, type CognitiveBandsRefs } from './CognitiveBands'

export function CinematicHero() {
  const sectionRef   = useRef<HTMLElement>(null)
  const stripRef     = useRef<HTMLDivElement>(null)
  const geometryRef  = useRef<SacredGeometryRefs>(null)
  const noiseRef     = useRef<NoiseCanvasRefs>(null)
  const imageRef     = useRef<HTMLDivElement>(null)
  const headlineRef  = useRef<HTMLHeadingElement>(null)
  const eyebrowRef   = useRef<HTMLParagraphElement>(null)
  const subheadRef   = useRef<HTMLParagraphElement>(null)
  const ctasRef      = useRef<HTMLDivElement>(null)
  const lineRef      = useRef<HTMLDivElement>(null)
  const bandsRef     = useRef<CognitiveBandsRefs>(null)

  useEffect(() => {
    const section   = sectionRef.current
    const strip     = stripRef.current
    const geometry  = geometryRef.current
    const noise     = noiseRef.current
    const image     = imageRef.current
    const headline  = headlineRef.current
    const eyebrow   = eyebrowRef.current
    const subhead   = subheadRef.current
    const ctas      = ctasRef.current
    const line      = lineRef.current
    const bands     = bandsRef.current

    if (!section || !strip || !geometry || !noise || !image ||
        !headline || !eyebrow || !subhead || !ctas || !line || !bands) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      gsap.set(strip, { x: '-300vw' })
      gsap.set(eyebrow, { opacity: 0.5 })
      gsap.set(headline, { opacity: 1 })
      gsap.set(subhead, { opacity: 0.75 })
      gsap.set(ctas, { opacity: 1 })
      return
    }

    // Start night sky
    noise.startGrain()

    // ─── Prepare geometry draw-on ─────────────────────────────
    const prepareDrawPaths = (container: SVGGElement | null) => {
      if (!container) return
      container.querySelectorAll<SVGGeometryElement>('circle, path, line').forEach((el) => {
        try {
          const len = el.getTotalLength()
          el.style.strokeDasharray = `${len}`
          el.style.strokeDashoffset = `${len}`
        } catch {
          el.style.strokeDasharray = '500'
          el.style.strokeDashoffset = '500'
        }
      })
    }

    const drawOn = (
      tl: gsap.core.Timeline,
      container: SVGGElement | null,
      position: number,
      duration: number,
      stagger: number
    ) => {
      if (!container) return
      const els = container.querySelectorAll<SVGGeometryElement>('.geo-path, .geo-line')
      tl.set(container, { opacity: 1 }, position)
      tl.to(els, { strokeDashoffset: 0, duration, ease: 'none', stagger: { each: stagger } }, position)
    }

    prepareDrawPaths(geometry.seed)
    prepareDrawPaths(geometry.flower)
    prepareDrawPaths(geometry.metatron)
    prepareDrawPaths(geometry.fibonacci)
    prepareDrawPaths(geometry.mandala)

    // ─── Master horizontal scroll timeline ────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=400%',          // 4 viewports of scroll
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
      defaults: { ease: 'none' },
    })

    // Horizontal pan: strip moves from x:0 to x:-300vw
    tl.to(strip, {
      x: '-300vw',
      duration: 12,
    }, 0)

    // ── Panel 1 events (0–3): Night sky + geometry ──────────
    tl.fromTo(geometry.seed!, { opacity: 0 }, { opacity: 0.2, duration: 1.5 }, 0.3)
    drawOn(tl, geometry.seed, 1, 1.5, 0.06)
    drawOn(tl, geometry.flower, 2, 1.2, 0.04)

    // Particles converge
    tl.to(noise.particles, {
      x: 0.5, y: 0.5, duration: 2, stagger: { each: 0.02 },
    }, 1)

    // ── Panel 2 events (3–6): Geometry crystallizes ─────────
    drawOn(tl, geometry.metatron, 3.5, 1, 0.01)
    drawOn(tl, geometry.fibonacci, 4.5, 1.5, 0)
    drawOn(tl, geometry.mandala, 5, 1, 0.02)

    // Night sky canvas fades as we leave panel 1
    if (noise.canvas) {
      tl.to(noise.canvas, { opacity: 0, duration: 1.5 }, 2.5)
    }

    // Geometry fades to ghost as we approach portrait
    if (geometry.svg) {
      tl.to(geometry.svg, { opacity: 0.06, duration: 1.5 }, 5)
    }

    // ── Panel 3 events (6–9): Portrait ──────────────────────
    // Image scales subtly for life
    tl.fromTo(image,
      { scale: 1.08 },
      { scale: 1, duration: 3 },
      6
    )

    // Bands slide in over portrait
    if (bands.container) {
      tl.set(bands.container, { opacity: 1 }, 7.5)
      tl.from(
        bands.container.querySelectorAll('.band'),
        { scaleX: 0, transformOrigin: 'left center', duration: 0.6, stagger: { each: 0.08 } },
        7.5
      )
    }

    // ── Panel 4 events (9–12): Text card ────────────────────
    // Tangerine line draws
    tl.fromTo(line,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8 },
      9.5
    )

    // Eyebrow
    tl.fromTo(eyebrow,
      { opacity: 0, y: 12 },
      { opacity: 0.5, y: 0, duration: 0.6 },
      9.8
    )

    // Headline words stagger
    tl.set(headline, { opacity: 1 }, 10)
    tl.from(
      headline.querySelectorAll('.word'),
      { opacity: 0, y: 40, duration: 0.8, stagger: { each: 0.08 } },
      10
    )

    // Subhead
    tl.fromTo(subhead,
      { opacity: 0, y: 20 },
      { opacity: 0.75, y: 0, duration: 0.6 },
      11
    )

    // CTAs
    tl.fromTo(ctas,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      11.5
    )

    return () => {
      tl.kill()
      noise.stopGrain()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  const HEADLINE_WORDS = ['Strong', 'Opinions', 'Turn', 'Theory', 'into', 'Culture.']

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      aria-label="Hero"
      style={{ backgroundColor: 'var(--black)' }}
    >
      {/* Horizontal film strip — 4 panels wide */}
      <div
        ref={stripRef}
        className="flex h-full will-change-transform"
        style={{ width: '400vw' }}
      >
        {/* ═══ Panel 1: Night Sky + Geometry ═══ */}
        <div className="relative w-screen h-full flex-shrink-0">
          <NoiseCanvas ref={noiseRef} />
          <SacredGeometrySVG ref={geometryRef} />

          {/* Scroll hint */}
          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ zIndex: 10 }}
          >
            <p
              className="t-eyebrow"
              style={{ fontSize: '9px', letterSpacing: '0.4em', opacity: 0.3 }}
            >
              SCROLL
            </p>
            <div
              style={{
                width: '1px',
                height: '24px',
                background: 'linear-gradient(to bottom, rgba(234,228,218,0.3), transparent)',
              }}
            />
          </div>
        </div>

        {/* ═══ Panel 2: Geometry Crystallizes ═══ */}
        <div
          className="relative w-screen h-full flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: 'var(--black)' }}
        >
          {/* Geometry extends across panels 1+2 via the SVG positioning */}
          {/* This panel shows the geometry fully crystallized in the center */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: 0.12 }}
          >
            <svg viewBox="0 0 200 200" className="w-64 h-64" fill="none">
              <circle cx="100" cy="100" r="80" stroke="var(--tang)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="50" stroke="var(--lav)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="20" stroke="var(--tea)" strokeWidth="0.5" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="var(--shell)" strokeWidth="0.3" opacity="0.5" />
              <line x1="100" y1="20" x2="100" y2="180" stroke="var(--shell)" strokeWidth="0.3" opacity="0.5" />
            </svg>
          </div>

          {/* Transition text */}
          <p
            className="t-eyebrow relative z-10"
            style={{
              letterSpacing: '0.5em',
              fontSize: '10px',
              opacity: 0.25,
            }}
          >
            NOISE &nbsp;→&nbsp; SIGNAL
          </p>
        </div>

        {/* ═══ Panel 3: Portrait ═══ */}
        <div className="relative w-screen h-full flex-shrink-0">
          <div
            ref={imageRef}
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ transformOrigin: 'center center' }}
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
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(to right, rgba(29,29,27,0.8) 0%, rgba(29,29,27,0) 15%, rgba(29,29,27,0) 85%, rgba(29,29,27,0.8) 100%),
                  linear-gradient(to bottom, rgba(29,29,27,0.3) 0%, rgba(29,29,27,0) 30%, rgba(29,29,27,0) 60%, rgba(29,29,27,0.6) 100%)
                `,
              }}
            />
          </div>

          {/* Cognitive bands overlay on portrait */}
          <CognitiveBands ref={bandsRef} />
        </div>

        {/* ═══ Panel 4: Text Card ═══ */}
        <div
          className="relative w-screen h-full flex-shrink-0 flex items-center"
          style={{ backgroundColor: 'var(--black)' }}
        >
          {/* Left edge gradient blending from portrait */}
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: '120px',
              background: 'linear-gradient(to right, var(--black), transparent)',
              zIndex: 2,
            }}
          />

          <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-[900px]">
            {/* Tangerine accent line */}
            <div
              ref={lineRef}
              style={{
                width: '64px',
                height: '1px',
                backgroundColor: 'var(--tang)',
                transformOrigin: 'left center',
                marginBottom: '32px',
              }}
            />

            {/* Eyebrow */}
            <p
              ref={eyebrowRef}
              className="t-eyebrow mb-6"
              style={{ letterSpacing: '0.32em', opacity: 0 }}
            >
              Behavioral Design Studio
            </p>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="t-headline"
              style={{
                fontSize: 'clamp(48px, 8vw, 96px)',
                letterSpacing: '-0.02em',
                lineHeight: 0.93,
                maxWidth: '800px',
                opacity: 0,
              }}
            >
              {HEADLINE_WORDS.map((word) => (
                <span
                  key={word}
                  className="word"
                  style={{ display: 'inline-block', marginRight: '0.28em' }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Subhead */}
            <p
              ref={subheadRef}
              className="t-body mt-8"
              style={{
                fontSize: '18px',
                maxWidth: '480px',
                lineHeight: 1.6,
                opacity: 0,
              }}
            >
              Cognitive Design Systems for Intellectual Creators.
            </p>

            {/* CTAs */}
            <div
              ref={ctasRef}
              className="mt-12 flex items-center gap-8"
              style={{ opacity: 0 }}
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
        </div>
      </div>
    </section>
  )
}
