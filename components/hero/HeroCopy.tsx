'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import Link from 'next/link'

export interface HeroCopyRefs {
  container: HTMLDivElement | null
  eyebrow: HTMLParagraphElement | null
  headline: HTMLHeadingElement | null
  subhead: HTMLParagraphElement | null
  ctas: HTMLDivElement | null
}

const HEADLINE_WORDS = ['Strong', 'Opinions', 'Turn', 'Theory', 'into', 'Culture.']

export const HeroCopy = forwardRef<HeroCopyRefs>(
  function HeroCopy(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const eyebrowRef   = useRef<HTMLParagraphElement>(null)
    const headlineRef  = useRef<HTMLHeadingElement>(null)
    const subheadRef   = useRef<HTMLParagraphElement>(null)
    const ctasRef      = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      container: containerRef.current,
      eyebrow:   eyebrowRef.current,
      headline:  headlineRef.current,
      subhead:   subheadRef.current,
      ctas:      ctasRef.current,
    }))

    return (
      <div
        ref={containerRef}
        className="relative z-30 flex flex-col justify-end flex-1 px-6"
        style={{ paddingBottom: 'clamp(48px, 8vh, 100px)' }}
      >
        {/* Eyebrow — ScrambleText target */}
        <p
          ref={eyebrowRef}
          className="t-eyebrow mb-4"
          style={{ letterSpacing: '0.32em', opacity: 0 }}
        >
          Behavioral Design Studio
        </p>

        {/* Headline — word stagger, left-aligned to clear face */}
        <h1
          ref={headlineRef}
          className="t-headline"
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            letterSpacing: '-0.01em',
            lineHeight: 0.95,
            maxWidth: '700px',
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
          className="t-body mt-5"
          style={{
            fontSize: '16px',
            maxWidth: '420px',
            lineHeight: 1.55,
            opacity: 0,
            textShadow: '0 1px 12px rgba(29,29,27,0.9)',
          }}
        >
          Cognitive Design Systems for Intellectual Creators.
        </p>

        {/* Dual CTAs */}
        <div
          ref={ctasRef}
          className="mt-8 flex items-center gap-8"
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
    )
  }
)
