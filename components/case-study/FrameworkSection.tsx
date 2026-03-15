'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { symbols } from '@/lib/symbols'
import { SectionWrapper, PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

gsap.registerPlugin(ScrollTrigger)

const ALL_ARCHETYPES = ['Rebellion', 'Mastery', 'Simplicity', 'Wealth', 'Freedom', 'Intelligence'] as const

export function FrameworkSection({ data }: { data: CaseStudy }) {
  const sym = symbols.framework
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
    <SectionWrapper id="cs-framework" symbol={sym} eyebrow="05 / Framework">
      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          Narrative System
        </h2>

        {/* Archetype pills */}
        <div className="anim-line" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: '40px' }}>
          {ALL_ARCHETYPES.map(arch => {
            const active   = data.narrativeSystem.stories.includes(arch)
            const dominant = data.narrativeSystem.dominant === arch
            return (
              <span key={arch} style={{
                fontFamily: 'var(--font-display)',
                fontSize:   dominant ? '15px' : active ? '11px' : '9px',
                letterSpacing: dominant ? '0.18em' : '0.15em',
                textTransform: 'uppercase',
                padding:    dominant ? '8px 18px' : active ? '6px 14px' : '4px 10px',
                border:     `1px solid ${active ? sym.color : 'rgba(234,228,218,0.06)'}`,
                color:      active ? sym.color : 'rgba(234,228,218,0.15)',
                opacity:    dominant ? 1 : active ? 0.8 : 0.4,
                background: dominant ? `${sym.color}10` : 'transparent',
                fontWeight: dominant ? 600 : 400,
              }}>
                {arch}
              </span>
            )
          })}
        </div>

        <p className="anim-line" style={{ fontSize: '16px', lineHeight: 1.75, opacity: 0.75, maxWidth: '720px', marginBottom: '16px' }}>
          {data.narrativeSystem.description}
        </p>

        <PullQuote quote={data.narrativeSystem.quote} color={sym.color} />

        <InsightBlock
          label="Dominant narrative"
          value={`${data.narrativeSystem.dominant} — supported by ${data.narrativeSystem.stories.filter(s => s !== data.narrativeSystem.dominant).join(' and ')}`}
          color={sym.color}
        />
      </div>
    </SectionWrapper>
  )
}
