'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { SacredGeometrySVG, type SacredGeometryRefs } from './SacredGeometrySVG'
import { NoiseCanvas, type NoiseCanvasRefs } from './NoiseCanvas'
import { HeroCopy, type HeroCopyRefs } from './HeroCopy'
import { CognitiveBands, type CognitiveBandsRefs } from './CognitiveBands'
import {
  buildHeroTimeline,
  buildCondensedTimeline,
  buildMobileTimeline,
} from '@/lib/hero-timeline'

const SESSION_KEY = 'curiosity-hero-seen'

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

    // ── Determine variant ─────────────────────────────────────
    const isMobile     = window.innerWidth < 768
    const isFirstVisit = !sessionStorage.getItem(SESSION_KEY)

    const refs = { section, image, geometry, noise, copy, bands }

    let tl: gsap.core.Timeline

    if (!isFirstVisit) {
      // Return visit — condensed
      gsap.set(noise.canvas, { opacity: 0 })
      tl = buildCondensedTimeline(refs)
      tl.play()
    } else if (isMobile) {
      // Mobile first visit — compressed
      noise.startGrain()
      tl = buildMobileTimeline(refs)
      tl.play()
      sessionStorage.setItem(SESSION_KEY, '1')
      tl.call(() => noise.stopGrain(), [], 2.5)
    } else {
      // Desktop first visit — full cinematic
      noise.startGrain()
      tl = buildHeroTimeline(refs)
      tl.play()
      sessionStorage.setItem(SESSION_KEY, '1')
      tl.call(() => noise.stopGrain(), [], 4)
    }

    // ── Breathing loop after timeline completes ───────────────
    tl.call(
      () => {
        gsap.to(image, {
          scale: 1.04,
          ease: 'sine.inOut',
          duration: 8,
          repeat: -1,
          yoyo: true,
        })
      },
      [],
      tl.duration()
    )

    return () => {
      tl.kill()
      noise.stopGrain()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
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
                rgba(29,29,27,0.60) 0%,
                rgba(29,29,27,0.05) 25%,
                rgba(29,29,27,0.30) 55%,
                rgba(29,29,27,0.85) 100%
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
