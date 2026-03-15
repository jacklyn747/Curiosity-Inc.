'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { symbols } from '@/lib/symbols'
import { Symbol } from '@/components/geo/Symbol'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

export function CaseStudyHero({ data }: { data: CaseStudy }) {
  const sym    = symbols.confusion
  const ref    = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const txtRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from(imgRef.current, { x: -30, opacity: 0, duration: dur.base, ease: ease.out })
        .from(
          txtRef.current?.querySelectorAll('.anim-line') ?? [],
          { opacity: 0, y: 20, duration: dur.base, stagger: 0.08, ease: ease.out },
          '-=0.4',
        )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '64px',
        alignItems: 'start',
        padding: '80px 60px 96px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Confusion symbol accent */}
      <div style={{ position: 'absolute', top: '40px', right: '60px', opacity: 0.18, pointerEvents: 'none' }}>
        <Symbol symbol={sym} size={40} animated />
      </div>

      {/* Left — portrait */}
      <div ref={imgRef} style={{ position: 'relative' }}>
        <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#242420' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image}
            alt={data.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.05)' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          {/* Gradient fades right edge */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, var(--black) 100%)' }} />
          {/* Orbit overlay in creator color */}
          <svg
            viewBox="0 0 280 350"
            fill="none"
            stroke={data.color}
            strokeWidth={0.75}
            strokeLinecap="round"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <circle cx={140} cy={120} r={90}  opacity={0.20} />
            <circle cx={140} cy={120} r={60}  opacity={0.30} />
            <circle cx={140} cy={120} r={34}  opacity={0.40} />
            <line x1={0}   y1={120} x2={280} y2={120} opacity={0.10} />
            <line x1={140} y1={0}   x2={140} y2={350} opacity={0.10} />
            <circle cx={140} cy={120} r={2.5} fill={data.color} opacity={0.7} />
          </svg>
        </div>
      </div>

      {/* Right — title + meta */}
      <div ref={txtRef}>
        <Link
          href="/#work"
          className="anim-line"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--shell)',
            opacity: 0.35,
            textDecoration: 'none',
            marginBottom: '32px',
          }}
        >
          ← Case Studies
        </Link>

        <p className="anim-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.6,
          marginBottom: '16px',
        }}>
          {data.index} / {data.outcome}
        </p>

        <h1 className="anim-line t-headline" style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, marginBottom: '12px' }}>
          {data.headline}
        </h1>

        <p className="anim-line" style={{ opacity: 0.4, fontSize: '14px', marginBottom: '40px' }}>
          {data.subhead}
        </p>

        {/* Meta grid */}
        <div className="anim-line" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          borderTop: '1px solid rgba(234,228,218,0.06)',
          paddingTop: '24px',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '6px' }}>Audience</p>
            <p style={{ fontSize: '13px', opacity: 0.75 }}>{data.meta.audienceSize}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '6px' }}>Audience Type</p>
            <p style={{ fontSize: '13px', opacity: 0.75 }}>{data.meta.audienceType}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '6px' }}>Platforms Analyzed</p>
            {data.meta.platforms.map((p, i) => (
              <p key={i} style={{ fontSize: '12px', opacity: 0.6, lineHeight: 1.6 }}>{p}</p>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '6px' }}>Offers Analyzed</p>
            {data.meta.offers.map((o, i) => (
              <p key={i} style={{ fontSize: '12px', opacity: 0.6, lineHeight: 1.6 }}>{o}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
