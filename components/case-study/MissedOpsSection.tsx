// components/case-study/MissedOpsSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'

export function MissedOpsSection({ data }: { data: CaseStudy }) {
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
          07 / Missed Opportunities
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', maxWidth: '680px' }}>
          {data.missedOpportunities.map((item, i) => (
            <li key={i} className="animate-line" style={{
              paddingBottom: '14px',
              borderBottom: '1px solid rgba(234,228,218,0.04)',
              marginBottom: '14px',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--shell)',
                opacity: 0.38,
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item}
              </p>
            </li>
          ))}
        </ul>

        <PullQuote text={data.missedOpportunities[0]} color={data.color} />
        <InsightBlock
          label="What fixing this unlocks"
          text={`A clearer architecture between content and product would accelerate the ${data.learningFlow[2].from.toLowerCase()} → ${data.learningFlow[2].to.toLowerCase()} transition significantly.`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
