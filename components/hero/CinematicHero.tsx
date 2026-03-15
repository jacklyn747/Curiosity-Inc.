'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SacredGeometrySVG, type SacredGeometryRefs } from './SacredGeometrySVG'
import { NoiseCanvas, type NoiseCanvasRefs } from './NoiseCanvas'
import { HeroCopy, type HeroCopyRefs } from './HeroCopy'
import { CognitiveBands, type CognitiveBandsRefs } from './CognitiveBands'
import { buildScrollTimeline } from '@/lib/hero-timeline'

export function CinematicHero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const imageRef    = useRef<HTMLDivElement>(null)
  const geometryRef = useRef<SacredGeometryRefs>(null)
  const noiseRef    = useRef<NoiseCanvasRefs>(null)
  const copyRef     = useRef<HeroCopyRefs>(null)
  const bandsRef    = useRef<CognitiveBandsRefs>(null)

  useEffect(() => {
    const section  = sectionRef.current
    const image    = imageRef.current
    const geometry = geometryRef.current
    const noise    = noiseRef.current
    const copy     = copyRef.current
    const bands    = bandsRef.current

    if (!section || !image || !geometry || !noise || !copy || !bands) return

    // ── Reduced motion: skip to final state ───────────────────
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      gsap.set(image, { clipPath: 'circle(100% at 50% 50%)' })
      if (copy.eyebrow)    gsap.set(copy.eyebrow, { opacity: 0.5 })
      if (copy.headline)   gsap.set(copy.headline, { opacity: 1 })
      if (copy.subhead)    gsap.set(copy.subhead, { opacity: 0.75 })
      if (copy.ctas)       gsap.set(copy.ctas, { opacity: 1 })
      if (bands.container) gsap.set(bands.container, { opacity: 1 })
      return
    }

    // ── Start grain animation (runs while in noise stage) ─────
    noise.startGrain()

    // ── Build scroll-driven timeline ──────────────────────────
    const refs = { section, image, geometry, noise, copy, bands }
    const tl = buildScrollTimeline(refs)

    // ── Stop grain when we leave noise stage (scroll past ~40%) ──
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=500%',
      onUpdate: (self) => {
        // Grain runs during first ~35% of scroll (Acts 1+2)
        if (self.progress > 0.35) {
          noise.stopGrain()
        } else if (self.progress < 0.35) {
          // Restart if scrolling back up into noise zone
          if (!noise.canvas?.getContext('2d')) return
          noise.startGrain()
        }
      },
    })

    // ── Breathing loop: starts after scroll completes ─────────
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=500%',
      onLeave: () => {
        // User has scrolled past the hero — start breathing
        gsap.to(image, {
          scale: 1.04,
          ease: 'sine.inOut',
          duration: 8,
          repeat: -1,
          yoyo: true,
        })
      },
      onEnterBack: () => {
        // User scrolled back — kill breathing, reset scale
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

      {/* Layer 1: Sacred geometry */}
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

      {/* Layer 3: Typography */}
      <HeroCopy ref={copyRef} />

      {/* Layer 4: Cognitive bands */}
      <CognitiveBands ref={bandsRef} />
    </section>
  )
}
