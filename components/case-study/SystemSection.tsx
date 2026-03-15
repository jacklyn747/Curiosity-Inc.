'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { symbols } from '@/lib/symbols'
import { SectionWrapper, PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

gsap.registerPlugin(ScrollTrigger)

export function CaseStudySystemSection({ data }: { data: CaseStudy }) {
  const sym = symbols.system
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.anim-line') ?? [], {
        opacity: 0, y: 20, duration: dur.base, stagger: 0.07, ease: ease.out,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionWrapper id="cs-system" symbol={sym} eyebrow="06 / System" alt>
      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '48px', maxWidth: '640px' }}>
          The Architecture
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '900px' }}>
          {/* What Works */}
          <div>
            <p className="anim-line" style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--tang)', opacity: 0.6, marginBottom: '20px' }}>
              What Works
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.whatWorks.map((item, i) => (
                <li key={i} className="anim-line" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span style={{ color: 'var(--tang)', fontSize: '9px', marginTop: '5px', flexShrink: 0 }}>●</span>
                  <span style={{ fontSize: '14px', opacity: 0.75, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missed Opportunities */}
          <div>
            <p className="anim-line" style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: sym.color, opacity: 0.6, marginBottom: '20px' }}>
              Missed Opportunities
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.missedOpportunities.map((item, i) => (
                <li key={i} className="anim-line" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span style={{ color: sym.color, fontSize: '9px', marginTop: '5px', flexShrink: 0, opacity: 0.4 }}>○</span>
                  <span style={{ fontSize: '14px', opacity: 0.45, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PullQuote quote={data.systemQuote} color={sym.color} />

        <InsightBlock
          label="Primary gap"
          value={data.missedOpportunities[0]}
          color={sym.color}
        />
      </div>
    </SectionWrapper>
  )
}
