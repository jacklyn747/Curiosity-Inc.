'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'

const ALL_FRICTION = ['attention', 'trust', 'clarity', 'identity', 'decision'] as const

export function ChallengeSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.animate-line') ?? [], {
        opacity: 0, y: 16,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
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
          marginBottom: '20px',
        }}>
          02 / Core Challenge
        </p>

        {/* Friction pills */}
        <div className="animate-line" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {ALL_FRICTION.map(f => {
            const isActive = (data.frictionTypes as readonly string[]).includes(f)
            return (
              <span
                key={f}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isActive ? '11px' : '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  border: `1px solid ${isActive ? data.color : 'rgba(234,228,218,0.08)'}`,
                  color: isActive ? data.color : 'var(--shell)',
                  opacity: isActive ? 0.9 : 0.15,
                  transition: 'all 0.3s ease',
                }}
              >
                {f}
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
          {data.coreChallenge}
        </p>

        <PullQuote text={data.coreChallenge.split('.')[0] + '.'} color={data.color} />
        <InsightBlock
          label="Primary lever"
          text={`${data.frictionTypes[0].charAt(0).toUpperCase() + data.frictionTypes[0].slice(1)} friction is the dominant barrier — the system must resolve this before any other layer.`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
