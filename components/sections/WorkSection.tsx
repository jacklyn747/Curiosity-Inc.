'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { caseStudies, type CaseStudy } from '@/lib/case-studies'
import { OrbitOverlay } from '@/components/ui/OrbitOverlay'
import { ease, dur } from '@/lib/motion-config'

function CaseStudyCard({ cs, index }: { cs: CaseStudy; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        border: `1px solid rgba(234,228,218,${hovered ? 0.12 : 0.04})`,
        transition: 'border-color 0.4s ease',
        background: 'rgba(234,228,218,0.02)',
      }}
    >
      {/* Photo area */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
        <Image
          src={cs.image}
          alt={cs.name}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{
            objectFit: 'cover',
            filter: 'grayscale(100%) contrast(1.05)',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />

        {/* Sacred geometry overlay */}
        <OrbitOverlay color={cs.color} />

        {/* Gradient fade into card body */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, transparent 45%, var(--black) 100%)`,
        }} />

        {/* Index number — top left */}
        <span style={{
          position: 'absolute',
          top: 16,
          left: 20,
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: cs.color,
          opacity: 0.7,
        }}>
          {cs.index}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '20px 24px 28px' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px',
          color: 'var(--shell)',
        }}>
          {cs.name}
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--shell)',
          opacity: 0.4,
          marginBottom: '16px',
          letterSpacing: '0.04em',
        }}>
          Engineers {cs.outcome}
        </p>

        {/* Audience stat */}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          color: cs.color,
          marginBottom: '4px',
        }}>
          {cs.meta.audienceSize}
        </p>

        {/* Top platform */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          color: 'var(--shell)',
          opacity: 0.25,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          {cs.meta.platforms[0]}
        </p>

        {/* CTA */}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: cs.color,
          opacity: hovered ? 1 : 0.6,
          transition: 'opacity 0.3s ease',
        }}>
          Read Analysis ——→
        </p>
      </div>
    </Link>
  )
}

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerLines = headerRef.current?.querySelectorAll('.animate-line')
      const cards = cardsRef.current?.querySelectorAll('.animate-card')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      if (headerLines?.length) {
        tl.from(headerLines, {
          opacity: 0,
          y: 24,
          duration: dur.base,
          stagger: 0.1,
          ease: ease.out,
        })
      }

      if (cards?.length) {
        tl.from(cards, {
          opacity: 0,
          y: 40,
          duration: dur.slow,
          stagger: 0.12,
          ease: ease.out,
        }, '-=0.4')
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{
        padding: '120px 60px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Section header */}
      <div ref={headerRef} style={{ marginBottom: '64px' }}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--tang)',
          opacity: 0.6,
          marginBottom: '16px',
        }}>
          04 / Work
        </p>
        <h2 className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--shell)',
          marginBottom: '12px',
        }}>
          Three architects of attention.
        </h2>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--shell)',
          opacity: 0.4,
          maxWidth: '400px',
          lineHeight: 1.6,
        }}>
          Behavioral design and knowledge-architecture analysis of creators who have engineered authority at scale.
        </p>
      </div>

      {/* 3-column grid */}
      <div
        ref={cardsRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        {caseStudies.map((cs, i) => (
          <div key={cs.slug} className="animate-card">
            <CaseStudyCard cs={cs} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
