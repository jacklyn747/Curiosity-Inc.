'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { dur, ease } from '@/lib/motion-config'

/**
 * CTASection — Section 06 / Signal
 *
 * The focal circle closes here. Pure silence.
 * No geometry, no grain, no noise — just the signal point and the ask.
 *
 * Symbol key used:
 *   ● Focal Circle  → clarity / resolved signal (the dominant element)
 *   △ Triangle      → direction / forward motion (inside the circle)
 */
export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const circleRef  = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [btnHovered, setBtnHovered] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance: circle scales up + content fades in
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 60%',
          toggleActions: 'play none none none',
        },
      })

      tl.from(circleRef.current, {
        scale:    0.65,
        opacity:  0,
        duration: dur.slow,
        ease:     ease.out,
      })

      tl.from(
        contentRef.current!.querySelectorAll('.cta-line'),
        {
          opacity:  0,
          y:        20,
          duration: dur.base,
          stagger:  { each: 0.12, ease: ease.out },
          ease:     ease.out,
        },
        '-=0.3'
      )

      // Continuous breath — starts after entrance settles
      gsap.to(circleRef.current, {
        scale:    1.035,
        duration: dur.breath,
        ease:     'sine.inOut',
        repeat:   -1,
        yoyo:     true,
        delay:    0.9,
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'var(--black)',
        minHeight:  '100vh',
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px',
      }}
    >
      {/* ── Focal Circle ──────────────────────────────────────── */}
      <div
        ref={circleRef}
        aria-hidden="true"
        style={{
          width:        '240px',
          height:       '240px',
          borderRadius: '50%',
          background:   'radial-gradient(circle at 42% 38%, #F7C948 0%, #ED773C 48%, #C63F3E 100%)',
          boxShadow:    btnHovered
            ? '0 0 80px rgba(237,119,60,0.55), 0 0 160px rgba(237,119,60,0.18)'
            : '0 0 48px rgba(237,119,60,0.38), 0 0 100px rgba(237,119,60,0.12)',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          marginBottom:  '72px',
          transition:    'box-shadow 0.4s ease',
          flexShrink:    0,
        }}
      >
        {/* Triangle — direction / strategy (pointing up) */}
        <svg
          width="28" height="26"
          viewBox="0 0 28 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <polygon
            points="14,2 26,24 2,24"
            stroke="rgba(29,29,27,0.55)"
            strokeWidth="1.5"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div
        ref={contentRef}
        style={{
          textAlign:    'center',
          maxWidth:     '560px',
          display:      'flex',
          flexDirection:'column',
          alignItems:   'center',
          gap:          '32px',
        }}
      >
        {/* Eyebrow */}
        <p
          className="cta-line t-eyebrow"
          style={{ color: 'var(--tang)', opacity: 0.6 }}
        >
          06 &nbsp;/&nbsp; Signal
        </p>

        {/* Headline */}
        <h2
          className="cta-line t-headline"
          style={{
            fontSize:      'clamp(44px, 5vw, 64px)',
            lineHeight:    0.93,
            letterSpacing: '-0.01em',
          }}
        >
          Let's work.
        </h2>

        {/* Email */}
        <a
          className="cta-line"
          href="mailto:hello@curiosity.inc"
          style={{
            fontFamily:     'var(--font-body)',
            fontSize:       '18px',
            fontWeight:     '300',
            color:          'var(--tang)',
            textDecoration: 'none',
            letterSpacing:  '0.02em',
            borderBottom:   '1px solid rgba(237,119,60,0.3)',
            paddingBottom:  '2px',
            transition:     'border-color 0.2s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.borderColor = 'rgba(237,119,60,0.9)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.borderColor = 'rgba(237,119,60,0.3)'
          }}
        >
          hello@curiosity.inc
        </a>

        {/* Divider */}
        <p
          className="cta-line t-caption"
          style={{ color: 'rgba(234,228,218,0.18)', letterSpacing: '0.28em' }}
        >
          — or —
        </p>

        {/* Button */}
        <Link
          href="/contact"
          className="cta-line"
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            fontFamily:     'var(--font-display)',
            fontSize:       '11px',
            fontWeight:     '400',
            letterSpacing:  '0.24em',
            textTransform:  'uppercase',
            color:          btnHovered ? 'var(--black)' : 'var(--tang)',
            background:     btnHovered ? 'var(--tang)' : 'transparent',
            border:         '1px solid rgba(237,119,60,0.4)',
            padding:        '14px 36px',
            textDecoration: 'none',
            display:        'inline-block',
            transition:     'background 0.25s, color 0.25s, border-color 0.25s',
            borderColor:    btnHovered ? 'var(--tang)' : 'rgba(237,119,60,0.4)',
          }}
        >
          Book a Call &nbsp;→
        </Link>
      </div>

      {/* ── Subtle corner marks — the only geometry ───────────── */}
      {[
        { top: '48px',  left:  '48px',  rotate: '0deg'   },
        { top: '48px',  right: '48px',  rotate: '90deg'  },
        { bottom: '48px', right: '48px', rotate: '180deg' },
        { bottom: '48px', left:  '48px', rotate: '270deg' },
      ].map((pos, i) => (
        <svg
          key={i}
          width="16" height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            position: 'absolute',
            ...pos,
            transform: `rotate(${pos.rotate})`,
            opacity: 0.15,
          }}
          aria-hidden="true"
        >
          <path d="M0 8 L0 0 L8 0" stroke="rgba(234,228,218,1)" strokeWidth="0.75" />
        </svg>
      ))}
    </section>
  )
}
