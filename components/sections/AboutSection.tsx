'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { dur, ease } from '@/lib/motion-config'

/**
 * AboutSection — Section 05 / Signal Source
 *
 * Visual system rules applied:
 *   Geometry (mind) + Human perception = intellectual glamour
 *   Thin orbit lines overlay the portrait — the system maps onto the human.
 *   Color is withheld here; the B&W photo + tang orbit = maximum contrast.
 */
export function AboutSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const imageRef    = useRef<HTMLDivElement>(null)
  const orbitsRef   = useRef<SVGSVGElement>(null)
  const textRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 68%',
          toggleActions: 'play none none none',
        },
      })

      // 1 — Image slides in from left
      tl.from(imageRef.current, {
        opacity:  0,
        x:        -40,
        duration: dur.slow,
        ease:     ease.out,
      })

      // 2 — Orbit lines draw in
      const orbitEls = orbitsRef.current?.querySelectorAll('.orbit-draw')
      if (orbitEls?.length) {
        orbitEls.forEach(el => {
          const len = (el as SVGGeometryElement).getTotalLength?.() ?? 400
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        })
        tl.to(
          orbitEls,
          {
            strokeDashoffset: 0,
            duration: dur.slow,
            stagger:  { each: 0.2, ease: ease.out },
            ease:     ease.draw,
          },
          '-=0.5'
        )
      }

      // 3 — Text content staggers in
      tl.from(
        textRef.current!.querySelectorAll('.about-line'),
        {
          opacity:  0,
          y:        20,
          duration: dur.base,
          stagger:  { each: 0.1, ease: ease.out },
          ease:     ease.out,
        },
        '-=0.6'
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'var(--black)',
        padding:    '120px 0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin:   '0 auto',
          padding:  '0 60px',
          display:  'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:      '80px',
          alignItems: 'center',
        }}
      >
        {/* ── Portrait + Orbit Overlay ──────────────────────── */}
        <div style={{ position: 'relative' }}>
          <div
            ref={imageRef}
            style={{
              position:     'relative',
              aspectRatio:  '4/5',
              overflow:     'hidden',
            }}
          >
            <Image
              src="/images/founder-portrait.jpg"
              alt="Zacklyn Barnes — Founder, Curiosity Inc."
              fill
              quality={90}
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ filter: 'grayscale(100%) contrast(1.05)' }}
            />

            {/* Dark vignette — softens edges so orbit lines read clearly */}
            <div
              style={{
                position:   'absolute',
                inset:      0,
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(29,29,27,0.45) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Orbit SVG overlay — positioned over the portrait */}
          <svg
            ref={orbitsRef}
            viewBox="0 0 500 625"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position:      'absolute',
              inset:         0,
              width:         '100%',
              height:        '100%',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            {/* Outer concentric circle — centered on face area */}
            <circle
              className="orbit-draw"
              cx="250" cy="210"
              r="175"
              stroke="var(--tang)"
              strokeWidth="0.75"
              strokeOpacity="0.28"
            />
            {/* Mid circle */}
            <circle
              className="orbit-draw"
              cx="250" cy="210"
              r="118"
              stroke="var(--tang)"
              strokeWidth="0.75"
              strokeOpacity="0.38"
            />
            {/* Tight inner circle */}
            <circle
              className="orbit-draw"
              cx="250" cy="210"
              r="68"
              stroke="var(--tang)"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
            {/* Horizontal axis line */}
            <line
              className="orbit-draw"
              x1="0" y1="210" x2="500" y2="210"
              stroke="var(--tang)"
              strokeWidth="0.5"
              strokeOpacity="0.15"
            />
            {/* Vertical axis line */}
            <line
              className="orbit-draw"
              x1="250" y1="0" x2="250" y2="625"
              stroke="var(--tang)"
              strokeWidth="0.5"
              strokeOpacity="0.12"
            />
            {/* Cross-hair markers at orbit intersections */}
            {[[250, 35], [250, 385], [75, 210], [425, 210]].map(([cx, cy], i) => (
              <g key={i}>
                <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy}
                  stroke="var(--tang)" strokeWidth="0.75" strokeOpacity="0.4" />
                <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8}
                  stroke="var(--tang)" strokeWidth="0.75" strokeOpacity="0.4" />
              </g>
            ))}
            {/* Node dot at face center */}
            <circle cx="250" cy="210" r="3.5" fill="var(--tang)" fillOpacity="0.7" />
          </svg>
        </div>

        {/* ── Text Content ──────────────────────────────────── */}
        <div ref={textRef}>
          <p
            className="about-line t-eyebrow"
            style={{ color: 'var(--tang)', opacity: 0.6, marginBottom: '28px' }}
          >
            05 &nbsp;/&nbsp; Signal Source
          </p>

          <h2
            className="about-line t-headline"
            style={{
              fontSize:     'clamp(34px, 4vw, 52px)',
              lineHeight:   0.95,
              marginBottom: '36px',
            }}
          >
            I study why people
            <br />
            do what they do —
            <br />
            <span style={{ color: 'var(--shell)', opacity: 0.38 }}>
              then build systems
              <br />
              that work with it.
            </span>
          </h2>

          <div
            className="about-line"
            style={{
              width:           '32px',
              height:          '1px',
              background:      'var(--tang)',
              opacity:         0.5,
              marginBottom:    '32px',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p
              className="about-line t-body"
              style={{ fontSize: '16px', maxWidth: '440px' }}
            >
              Zacklyn Barnes is a behavioral designer at the intersection of marketing,
              instructional design, and UX — helping organizations close the gap between
              what people say and what they actually do.
            </p>
            <p
              className="about-line t-body"
              style={{ fontSize: '16px', maxWidth: '440px' }}
            >
              Curiosity Inc. exists because most interventions are designed for the
              behavior we wish people had. The work here is designed for the behavior
              they actually have.
            </p>
          </div>

          {/* Credentials / meta */}
          <div
            className="about-line"
            style={{
              marginTop:   '48px',
              display:     'flex',
              gap:         '32px',
              flexWrap:    'wrap',
            }}
          >
            {[
              { label: 'Discipline', value: 'Behavioral Design' },
              { label: 'Focus',      value: 'Cognition → Action' },
              { label: 'Based in',   value: 'Houston, TX' },
            ].map(item => (
              <div key={item.label}>
                <p className="t-eyebrow" style={{ marginBottom: '6px', opacity: 0.35 }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      '12px',
                  letterSpacing: '0.12em',
                  color:         'var(--shell)',
                  opacity:       0.8,
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
