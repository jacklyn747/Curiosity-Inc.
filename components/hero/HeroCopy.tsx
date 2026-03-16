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
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: 0 }}
      >
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="t-eyebrow mb-6"
          style={{ letterSpacing: '0.32em', opacity: 0 }}
        >
          Behavioral Design Studio
        </p>

        {/* Headline — centered, large, takes over the frame */}
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
    )
  }
)
