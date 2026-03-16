'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * HeroTextPanel
 *
 * Sits directly below the pinned CinematicHero. When the hero unpins
 * and the user keeps scrolling, this dark panel scrolls into view
 * with the headline, subhead, and CTAs animating in on entry.
 *
 * This is "Act 6" of the hero sequence — the text gets its own moment,
 * completely separate from the portrait.
 */

const HEADLINE_WORDS = ['Strong', 'Opinions', 'Turn', 'Theory', 'into', 'Culture.']

export function HeroTextPanel() {
  const sectionRef  = useRef<HTMLElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadRef  = useRef<HTMLParagraphElement>(null)
  const ctasRef     = useRef<HTMLDivElement>(null)
  const lineRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section  = sectionRef.current
    const eyebrow  = eyebrowRef.current
    const headline = headlineRef.current
    const subhead  = subheadRef.current
    const ctas     = ctasRef.current
    const line     = lineRef.current

    if (!section || !eyebrow || !headline || !subhead || !ctas || !line) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      gsap.set([eyebrow, headline, subhead, ctas, line], { opacity: 1, y: 0 })
      return
    }

    // Thin tangerine line draws across
    gsap.fromTo(
      line,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )

    // Eyebrow
    gsap.fromTo(
      eyebrow,
      { opacity: 0, y: 12 },
      {
        opacity: 0.5,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    // Headline words stagger
    gsap.set(headline, { opacity: 1 })
    gsap.from(
      headline.querySelectorAll('.word'),
      {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: { each: 0.08 },
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    )

    // Subhead
    gsap.fromTo(
      subhead,
      { opacity: 0, y: 20 },
      {
        opacity: 0.75,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      }
    )

    // CTAs
    gsap.fromTo(
      ctas,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.5,
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.vars?.trigger === section) {
          st.kill()
        }
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        backgroundColor: 'var(--black)',
        paddingTop: 'clamp(80px, 12vh, 160px)',
        paddingBottom: 'clamp(80px, 12vh, 160px)',
      }}
    >
      {/* Subtle top gradient blending from hero image into dark */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(29,29,27,0.6), var(--black))',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-[1100px]">
        {/* Thin tangerine line — structural, not decorative */}
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
            fontSize: 'clamp(44px, 7vw, 88px)',
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
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
            color: 'var(--shell)',
          }}
        >
          Cognitive Design Systems for Intellectual Creators.
        </p>

        {/* Dual CTAs */}
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
    </section>
  )
}
