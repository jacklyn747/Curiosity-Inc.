'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SacredGeometrySVG, type SacredGeometryRefs } from './SacredGeometrySVG'
import { NoiseCanvas, type NoiseCanvasRefs } from './NoiseCanvas'
import { GeometryRevealText, type GeometryRevealTextRefs } from './GeometryRevealText'
import { CognitiveBands, type CognitiveBandsRefs } from './CognitiveBands'
import { buildScrollTimeline } from '@/lib/hero-timeline'

export function CinematicHero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const imageRef    = useRef<HTMLDivElement>(null)
  const geometryRef = useRef<SacredGeometryRefs>(null)
  const noiseRef    = useRef<NoiseCanvasRefs>(null)
  const revealRef   = useRef<GeometryRevealTextRefs>(null)
  const ctasRef     = useRef<HTMLDivElement>(null)
  const bandsRef    = useRef<CognitiveBandsRefs>(null)

  useEffect(() => {
    const section  = sectionRef.current
    const image    = imageRef.current
    const geometry = geometryRef.current
    const noise    = noiseRef.current
    const reveal   = revealRef.current
    const ctas     = ctasRef.current
    const bands    = bandsRef.current

    if (!section || !image || !geometry || !noise || !reveal || !ctas || !bands) return

    // ── Reduced motion: skip to final state ───────────────────
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      gsap.set(image, { clipPath: 'circle(100% at 50% 50%)', opacity: 0.15 })
      if (reveal.maskReveal) gsap.set(reveal.maskReveal, { opacity: 1 })
      gsap.set(ctas, { opacity: 1 })
      if (bands.container) gsap.set(bands.container, { opacity: 1 })
      return
    }

    // ── Start grain animation (runs while in noise stage) ─────
    noise.startGrain()

    // ── Build scroll-driven timeline ──────────────────────────
    const refs = { section, image, geometry, noise, reveal, ctas, bands }
    const tl = buildScrollTimeline(refs)

    // ── Stop grain when we leave noise stage (scroll past ~30%) ──
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=600%',
      onUpdate: (self) => {
        if (self.progress > 0.30) {
          noise.stopGrain()
        } else if (self.progress < 0.30) {
          if (!noise.canvas?.getContext('2d')) return
          noise.startGrain()
        }
      },
    })

    // ── Breathing loop: starts after scroll completes ─────────
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=600%',
      onLeave: () => {
        gsap.to(image, {
          scale: 1.04,
          ease: 'sine.inOut',
          duration: 8,
          repeat: -1,
          yoyo: true,
        })
      },
      onEnterBack: () => {
        gsap.killTweensOf(image, 'scale')
        gsap.set(image, { scale: 1 })
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
      className="relative h-screen flex flex-col overflow-hidden"
      aria-label="Hero"
      style={{ backgroundColor: 'var(--black)' }}
    >
      {/* Layer 0: Canvas noise/grain */}
      <NoiseCanvas ref={noiseRef} />

      {/* Layer 1: Sacred geometry (visible, thin lines) */}
      <SacredGeometrySVG ref={geometryRef} />

      {/* Layer 2: Hero image with iris reveal */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          clipPath: 'circle(0% at 50% 50%)',
          transformOrigin: 'center center',
          zIndex: 3,
        }}
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
                rgba(29,29,27,0.45) 0%,
                rgba(29,29,27,0.0)  20%,
                rgba(29,29,27,0.05) 45%,
                rgba(29,29,27,0.50) 65%,
                rgba(29,29,27,0.92) 100%
              )
            `,
          }}
        />
      </div>

      {/* Layer 3: Text revealed through geometry mask */}
      <GeometryRevealText ref={revealRef} />

      {/* Layer 4: HTML CTAs (need to be clickable links) */}
      <div
        ref={ctasRef}
        className="absolute z-30 flex items-center gap-8"
        style={{
          bottom: 'clamp(80px, 12vh, 140px)',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0,
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

      {/* Layer 5: Cognitive bands */}
      <CognitiveBands ref={bandsRef} />
    </section>
  )
}
