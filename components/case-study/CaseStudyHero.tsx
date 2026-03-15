// components/case-study/CaseStudyHero.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { OrbitOverlay } from '@/components/ui/OrbitOverlay'
import { ease, dur } from '@/lib/motion-config'
import type { CaseStudy } from '@/lib/case-studies'

export function CaseStudyHero({ data }: { data: CaseStudy }) {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = heroRef.current?.querySelectorAll('.animate-line')
      if (lines?.length) {
        gsap.from(lines, {
          opacity: 0, y: 20,
          duration: dur.base,
          stagger: 0.08,
          ease: ease.out,
          delay: 0.2,
        })
      }
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={heroRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '60px',
        padding: '80px 60px 60px',
        maxWidth: '1200px',
        margin: '0 auto',
        alignItems: 'start',
      }}
    >
      {/* Portrait column */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#111' }}>
          <Image
            src={data.image}
            alt={data.name}
            fill
            priority
            sizes="280px"
            style={{
              objectFit: 'cover',
              filter: 'grayscale(100%) contrast(1.05)',
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <OrbitOverlay color={data.color} />
          {/* Fade right into text column */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, transparent 60%, var(--black) 100%)',
          }} />
        </div>
      </div>

      {/* Title column */}
      <div style={{ paddingTop: '8px' }}>
        <Link
          href="/#work"
          className="animate-line"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--shell)',
            opacity: 0.35,
            textDecoration: 'none',
            marginBottom: '32px',
          }}
        >
          ← Case Studies
        </Link>

        <p
          className="animate-line"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: data.color,
            opacity: 0.7,
            marginBottom: '12px',
          }}
        >
          {data.index} / {data.outcome}
        </p>

        <h1
          className="animate-line"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3.5vw, 42px)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--shell)',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}
        >
          {data.headline}
        </h1>

        <p
          className="animate-line"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--shell)',
            opacity: 0.4,
            marginBottom: '36px',
            letterSpacing: '0.04em',
          }}
        >
          {data.subhead}
        </p>

        {/* Meta strip */}
        <div
          className="animate-line"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px 40px',
            borderTop: '1px solid rgba(234,228,218,0.06)',
            paddingTop: '24px',
          }}
        >
          <MetaItem label="Platforms analyzed" value={data.meta.platforms.join(' · ')} color={data.color} />
          <MetaItem label="Audience type" value={data.meta.audienceType} color={data.color} />
          <MetaItem label="Offers analyzed" value={data.meta.offers.join(' · ')} color={data.color} />
          <MetaItem label="Audience size" value={data.meta.audienceSize} color={data.color} />
        </div>
      </div>
    </div>
  )
}

function MetaItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color,
        opacity: 0.5,
        marginBottom: '4px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        color: 'var(--shell)',
        opacity: 0.55,
        lineHeight: 1.5,
      }}>
        {value}
      </p>
    </div>
  )
}
