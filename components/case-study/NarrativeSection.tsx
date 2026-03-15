'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'

const ALL_ARCHETYPES = ['Rebellion', 'Mastery', 'Simplicity', 'Wealth', 'Freedom', 'Intelligence']

export function NarrativeSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.animate-line') ?? [], {
        opacity: 0, y: 16,
        duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell alt>
      <div ref={ref}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '24px',
        }}>
          05 / Narrative System
        </p>

        {/* Archetype pills */}
        <div className="animate-line" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px', alignItems: 'baseline' }}>
          {ALL_ARCHETYPES.map(a => {
            const isActive = (data.narrativeSystem.stories as string[]).includes(a)
            const isDominant = a === data.narrativeSystem.dominant
            return (
              <span
                key={a}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isDominant ? '14px' : isActive ? '11px' : '10px',
                  letterSpacing: isDominant ? '0.18em' : '0.12em',
                  textTransform: 'uppercase',
                  padding: isDominant ? '8px 16px' : '5px 12px',
                  border: `1px solid ${isActive ? data.color : 'rgba(234,228,218,0.06)'}`,
                  color: isActive ? data.color : 'var(--shell)',
                  opacity: isDominant ? 1 : isActive ? 0.8 : 0.12,
                }}
              >
                {a}
              </span>
            )
          })}
        </div>

        <p className="animate-line" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--shell)',
          opacity: 0.65,
          lineHeight: 1.75,
          maxWidth: '720px',
          marginBottom: '24px',
        }}>
          {data.narrativeSystem.description}
        </p>

        <PullQuote text={data.narrativeSystem.quote} color={data.color} />
        <InsightBlock
          label="Why this narrative works"
          text={`The ${data.narrativeSystem.dominant.toLowerCase()} narrative maps directly onto the emotional state of ${data.meta.audienceType.toLowerCase()} — it resolves the tension they feel before they know how to name it.`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
