'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { caseStudies } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

gsap.registerPlugin(ScrollTrigger)

function OrbitOverlay({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 300 375"
      fill="none"
      stroke={color}
      strokeWidth={0.75}
      strokeLinecap="round"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <circle cx={150} cy={130} r={105} opacity={0.18} />
      <circle cx={150} cy={130} r={70}  opacity={0.28} />
      <circle cx={150} cy={130} r={40}  opacity={0.38} />
      <line x1={0}   y1={130} x2={300} y2={130} opacity={0.10} />
      <line x1={150} y1={0}   x2={150} y2={375} opacity={0.10} />
      <line x1={37}  y1={130} x2={53}  y2={130} opacity={0.45} />
      <line x1={247} y1={130} x2={263} y2={130} opacity={0.45} />
      <line x1={150} y1={17}  x2={150} y2={33}  opacity={0.45} />
      <circle cx={150} cy={130} r={2.5} fill={color} opacity={0.6} />
    </svg>
  )
}

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.querySelectorAll('.anim') ?? [], {
        opacity: 0, y: 24, duration: dur.base, stagger: 0.1, ease: ease.out,
        scrollTrigger: { trigger: headerRef.current, start: 'top 80%' },
      })
      gsap.from(cardsRef.current?.querySelectorAll('.cs-card') ?? [], {
        opacity: 0, y: 40, duration: dur.slow, stagger: 0.12, ease: ease.out,
        scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={sectionRef} style={{ background: 'var(--black)', padding: '120px 60px', maxWidth: '1200px', margin: '0 auto' }}>
      <div ref={headerRef} style={{ marginBottom: '64px' }}>
        <p className="anim t-eyebrow" style={{ color: 'var(--tang)', opacity: 0.6, marginBottom: '16px' }}>04 / Work</p>
        <h2 className="anim t-headline" style={{ fontSize: 'clamp(36px, 5vw, 60px)', marginBottom: '16px' }}>Three architects of attention.</h2>
        <p className="anim t-body" style={{ opacity: 0.45, maxWidth: '480px' }}>Behavioral design and knowledge-architecture analysis of creators who engineer outcomes at scale.</p>
      </div>

      <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {caseStudies.map((cs, i) => {
          const isH = hovered === i
          return (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="cs-card"
              style={{ textDecoration: 'none', display: 'block' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{
                position: 'relative', aspectRatio: '4/5', overflow: 'hidden',
                border: `1px solid ${isH ? cs.color : 'rgba(234,228,218,0.06)'}`,
                transition: 'border-color 0.3s ease', marginBottom: '20px', background: '#242420',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cs.image}
                  alt={cs.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'grayscale(100%) contrast(1.05)',
                    transform: isH ? 'scale(1.02)' : 'scale(1)',
                    transition: 'transform 0.4s ease',
                  }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 45%, var(--black) 100%)' }} />
                <OrbitOverlay color={cs.color} />
                <span style={{ position: 'absolute', top: '16px', left: '16px', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.22em', color: cs.color, opacity: 0.7 }}>
                  {cs.index}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '6px' }}>{cs.name}</p>
              <p style={{ fontSize: '13px', opacity: 0.4, marginBottom: '14px' }}>Engineers {cs.outcome}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: cs.color, marginBottom: '4px' }}>{cs.meta.audienceSize}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.22, marginBottom: '16px' }}>
                {cs.meta.platforms.slice(0, 2).join(' · ')}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: cs.color, opacity: isH ? 1 : 0.65, transition: 'opacity 0.2s ease' }}>
                Read Analysis ——→
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
