// components/case-study/WhatWorksSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'

export function WhatWorksSection({ data }: { data: CaseStudy }) {
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
    <SectionShell>
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
          06 / What Works
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', maxWidth: '680px' }}>
          {data.whatWorks.map((item, i) => (
            <li key={i} className="animate-line" style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              paddingBottom: '14px',
              borderBottom: '1px solid rgba(234,228,218,0.04)',
              marginBottom: '14px',
            }}>
              <span style={{ color: data.color, fontSize: '9px', marginTop: '5px', flexShrink: 0 }}>●</span>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--shell)',
                opacity: 0.6,
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item}
              </p>
            </li>
          ))}
        </ul>

        <PullQuote text={data.whatWorks[0]} color={data.color} />
        <InsightBlock
          label="Transferable pattern"
          text={data.whatWorks[0]}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
