'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ease, dur } from '@/lib/motion-config'
import { HeroGeometry, type HeroGeometryRefs } from './HeroGeometry'

/**
 * ParallaxHero — Cinematic layered parallax hero
 *
 * PNG layers + SVG geometry from the cosmic woman illustration,
 * each moving at different speeds on scroll to create depth:
 *
 *   1. Stars      — slowest (0.2x), the infinite backdrop
 *   2. Lines      — SVG geometry that DRAWS on scroll (0.4x)
 *   3. Woman      — anchor point (0.9x), barely moves
 *   4. Clouds     — atmosphere (0.6x), horizontal drift
 *   5. Planets    — orbiting spheres (0.5x), float animation
 *
 * Text fades in over the composition as a final reveal.
 */

const LAYERS = [
  { src: '/images/hero-layers/stars.png',   alt: 'Starfield',         speed: 0.2, z: 1  },
  // Lines layer is now SVG (HeroGeometry) — not in this array
  { src: '/images/hero-layers/woman.png',   alt: 'Cosmic woman',      speed: 0.9, z: 3  },
  { src: '/images/hero-layers/clouds.png',  alt: 'Nebula clouds',     speed: 0.6, z: 4  },
  { src: '/images/hero-layers/planets.png', alt: 'Orbiting planets',  speed: 0.5, z: 5  },
] as const

const HEADLINE_WORDS = ['Strong', 'Opinions', 'Turn', 'Theory', 'into', 'Culture.']

export function ParallaxHero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const layerRefs   = useRef<(HTMLDivElement | null)[]>([])
  const geoRef      = useRef<HeroGeometryRefs>(null)
  const geoWrapRef  = useRef<HTMLDivElement>(null)
  const textRef     = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const subheadRef  = useRef<HTMLParagraphElement>(null)
  const ctasRef     = useRef<HTMLDivElement>(null)
  const lineRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section  = sectionRef.current
    const text     = textRef.current
    const headline = headlineRef.current
    const eyebrow  = eyebrowRef.current
    const subhead  = subheadRef.current
    const ctas     = ctasRef.current
    const line     = lineRef.current

    if (!section || !text || !headline || !eyebrow || !subhead || !ctas || !line) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      // Show everything immediately
      layerRefs.current.forEach((layer) => {
        if (layer) gsap.set(layer, { opacity: 1 })
      })
      gsap.set([eyebrow, headline, subhead, ctas, line], { opacity: 1 })
      return
    }

    const geo = geoRef.current
    const geoWrap = geoWrapRef.current

    const ctx = gsap.context(() => {
      // ─── Layer references ──────────────────────────────────────
      const [stars, woman, clouds, planets] = layerRefs.current

      // ─── Parallax: each PNG layer scrolls at its own speed ─────
      LAYERS.forEach((config, i) => {
        const layer = layerRefs.current[i]
        if (!layer) return

        const yDistance = (1 - config.speed) * 200

        gsap.to(layer, {
          y: yDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      // Geometry SVG parallax (0.4x speed)
      if (geoWrap) {
        gsap.to(geoWrap, {
          y: (1 - 0.4) * 200,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // ─── Prepare SVG stroke-dasharray for draw-on ──────────────
      if (geo) {
        geo.paths.forEach((el) => {
          const geomEl = el as unknown as SVGGeometryElement
          try {
            const len = geomEl.getTotalLength()
            geomEl.style.strokeDasharray = `${len}`
            geomEl.style.strokeDashoffset = `${len}`
          } catch {
            geomEl.style.strokeDasharray = '1000'
            geomEl.style.strokeDashoffset = '1000'
          }
        })
      }

      // ─── Entry sequence: scroll-triggered reveal ───────────────
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=60%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
        defaults: { ease: ease.out },
      })

      // Stars: already visible
      if (stars) {
        gsap.set(stars, { opacity: 1 })
      }

      // Lines: SVG paths draw on scroll
      if (geo && geo.paths.length > 0) {
        revealTl.to(geo.paths, {
          strokeDashoffset: 0,
          duration: 3,
          ease: 'none',
          stagger: { each: 0.06, from: 'center' },
        }, 0)
      }

      // Woman: fade in with subtle scale
      if (woman) {
        gsap.set(woman, { opacity: 0, scale: 0.96 })
        revealTl.to(woman, {
          opacity: 1,
          scale: 1,
          duration: 2,
        }, 0.5)
      }

      // Clouds: fade in with horizontal drift
      if (clouds) {
        gsap.set(clouds, { opacity: 0, x: -30 })
        revealTl.to(clouds, {
          opacity: 1,
          x: 0,
          duration: 2,
        }, 1)
      }

      // Planets: fade in last
      if (planets) {
        gsap.set(planets, { opacity: 0, y: 10 })
        revealTl.to(planets, {
          opacity: 1,
          y: 0,
          duration: 1.5,
        }, 1.5)
      }

      // ─── Text reveal ──────────────────────────────────────────
      // Tangerine line draws in
      gsap.set(line, { scaleX: 0 })
      revealTl.to(line, { scaleX: 1, duration: 0.8 }, 2.5)

      // Eyebrow
      gsap.set(eyebrow, { opacity: 0, y: 12 })
      revealTl.to(eyebrow, { opacity: 0.5, y: 0, duration: 0.6 }, 2.8)

      // Headline words stagger
      gsap.set(headline, { opacity: 1 })
      const words = headline.querySelectorAll('.word')
      gsap.set(words, { opacity: 0, y: 40 })
      revealTl.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: { each: 0.08 },
      }, 3)

      // Subhead
      gsap.set(subhead, { opacity: 0, y: 20 })
      revealTl.to(subhead, { opacity: 0.75, y: 0, duration: 0.6 }, 3.8)

      // CTAs
      gsap.set(ctas, { opacity: 0, y: 10 })
      revealTl.to(ctas, { opacity: 1, y: 0, duration: 0.5 }, 4.2)

      // ─── Ambient animations (loop forever) ─────────────────────
      // Planets: gentle float
      if (planets) {
        gsap.to(planets, {
          y: '+=8',
          duration: dur.breath,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      // Clouds: subtle horizontal sway
      if (clouds) {
        gsap.to(clouds, {
          x: '+=12',
          duration: dur.breath * 1.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

    }, section) // GSAP context scoped to section

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      aria-label="Hero"
      style={{ backgroundColor: 'var(--black)' }}
    >
      {/* ─── Stars layer (bottom) ─── */}
      <div
        ref={(el) => { layerRefs.current[0] = el }}
        className="absolute inset-0 will-change-transform"
        style={{ zIndex: 1, opacity: 1 }}
      >
        <Image
          src="/images/hero-layers/stars.png"
          alt="Starfield"
          fill
          priority
          quality={85}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* ─── Geometry SVG layer (draws on scroll) ─── */}
      <div
        ref={geoWrapRef}
        className="absolute inset-0 will-change-transform"
        style={{ zIndex: 2 }}
      >
        <HeroGeometry ref={geoRef} />
      </div>

      {/* ─── Remaining image layers ─── */}
      {LAYERS.slice(1).map((layer, i) => (
        <div
          key={layer.src}
          ref={(el) => { layerRefs.current[i + 1] = el }}
          className="absolute inset-0 will-change-transform"
          style={{ zIndex: layer.z, opacity: 0 }}
        >
          <Image
            src={layer.src}
            alt={layer.alt}
            fill
            priority={i === 0}
            quality={85}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* ─── Vignette overlay ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, rgba(29,29,27,0.7) 100%),
            linear-gradient(to bottom, rgba(29,29,27,0.3) 0%, transparent 15%, transparent 50%, rgba(29,29,27,0.95) 100%)
          `,
        }}
      />

      {/* ─── Text Content ─── */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-end pb-16 md:pb-20 lg:pb-24"
        style={{ zIndex: 20 }}
      >
        <div className="px-8 md:px-16 lg:px-24 max-w-[900px]">
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

      {/* ─── Scroll hint ─── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 20 }}
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
    </section>
  )
}
