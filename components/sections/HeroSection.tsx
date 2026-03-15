'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { dur, ease, motion } from '@/lib/motion-config'
import { layers } from '@/lib/design-tokens'

/**
 * HeroSection
 *
 * Full-bleed hero with the locked image direction.
 * Typography loads in on mount via GSAP timeline.
 * Image breathes with a slow 8s scale loop.
 * 5 cognitive bands run along the bottom edge.
 */
export function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const imageRef    = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const bandsRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: ease.out } })

      // 1 — Eyebrow
      tl.from(eyebrowRef.current, {
        opacity: 0,
        y: 10,
        duration: dur.fast,
      })

      // 2 — Headline: each word staggers in
      tl.from(
        headlineRef.current!.querySelectorAll('.word'),
        {
          opacity: 0,
          y: 32,
          duration: dur.slow,
          stagger: { each: 0.07, ease: ease.out },
        },
        '-=0.1'
      )

      // 3 — Subhead
      tl.from(subRef.current, {
        ...motion.fadeUp,
        duration: dur.base,
      }, '-=0.4')

      // 4 — CTA
      tl.from(ctaRef.current, {
        opacity: 0,
        y: 12,
        duration: dur.fast,
      }, '-=0.3')

      // 5 — Bands slide in from left, staggered
      tl.from(
        bandsRef.current!.querySelectorAll('.band'),
        {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: dur.base,
          stagger: { each: 0.08, ease: ease.out },
        },
        '-=0.3'
      )

      // 6 — Image slow breathe (starts immediately, runs forever)
      gsap.to(imageRef.current, {
        scale: 1.04,
        ease: 'sine.inOut',
        duration: 8,
        repeat: -1,
        yoyo: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Image ─────────────────────────────────────────────── */}
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
        {/* Gradient vignette — ensures text legibility over the image */}
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

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-end flex-1 px-6 text-center"
           style={{ paddingTop: '100px', paddingBottom: '140px' }}>

        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="t-eyebrow mb-8"
          style={{ letterSpacing: '0.32em', opacity: 0.5 }}
        >
          Behavioral Design Studio
        </p>

        {/* Headline — split into spans for stagger */}
        <h1
          ref={headlineRef}
          className="t-headline"
          style={{
            fontSize: 'clamp(52px, 8vw, 96px)',
            letterSpacing: '-0.01em',
            lineHeight: 0.93,
            maxWidth: '900px',
          }}
        >
          {['Strong', 'Opinions', 'Turn', 'Theory', 'into', 'Culture.'].map((word) => (
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
          ref={subRef}
          className="t-body mt-8"
          style={{
            fontSize: '17px',
            maxWidth: '520px',
            lineHeight: 1.6,
            opacity: 0.75,
            textShadow: '0 1px 12px rgba(29,29,27,0.9)',
          }}
        >
          Cognitive Design Systems for Intellectual Creators.
        </p>

        {/* Dual CTAs */}
        <div
          ref={ctaRef}
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

      {/* ── Cognitive Bands ───────────────────────────────────── */}
      {/*
        The 5 layers rendered as thin horizontal stripes at the bottom edge.
        Each band = one layer. Scaleх animates in from left on mount.
        This is the ONLY place all 5 colors appear together.
      */}
      <div
        ref={bandsRef}
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col"
        aria-hidden="true"
      >
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className="band w-full"
            style={{
              height: '3px',
              backgroundColor: layer.color,
              opacity: 0.75,
            }}
          />
        ))}
      </div>
    </section>
  )
}
