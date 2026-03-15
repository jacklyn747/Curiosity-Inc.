'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'

// Inline ThinLineSystem ghost — system variant, top-right corner
function SystemGhost({ color }: { color: string }) {
  return (
    <div style={{
      position: 'absolute',
      top: -40,
      right: -40,
      width: 280,
      height: 280,
      opacity: 0.06,
      pointerEvents: 'none',
    }}>
      <svg viewBox="0 0 280 280" fill="none" style={{ width: '100%', height: '100%' }}>
        {/* Simplified system diagram ghost — concentric rectangles + spine */}
        <rect x={20} y={20} width={240} height={240} stroke={color} strokeWidth={0.5} />
        <rect x={50} y={50} width={180} height={180} stroke={color} strokeWidth={0.4} />
        <rect x={80} y={80} width={120} height={120} stroke={color} strokeWidth={0.3} />
        <line x1={140} y1={20} x2={140} y2={260} stroke={color} strokeWidth={0.4} />
        <line x1={20} y1={140} x2={260} y2={140} stroke={color} strokeWidth={0.4} />
        <circle cx={140} cy={140} r={8} stroke={color} strokeWidth={0.8} />
        <circle cx={140} cy={140} r={3} fill={color} />
      </svg>
    </div>
  )
}

export function SituationSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = ref.current?.querySelectorAll('.animate-line')
      if (lines?.length) {
        gsap.from(lines, {
          opacity: 0, y: 20,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        })
      }
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell alt>
      <div ref={ref} style={{ position: 'relative' }}>
        <SystemGhost color={data.color} />

        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '20px',
        }}>
          01 / The Situation
        </p>

        {data.situation.map((para, i) => (
          <p
            key={i}
            className="animate-line"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--shell)',
              opacity: 0.65,
              lineHeight: 1.75,
              marginBottom: '18px',
              maxWidth: '720px',
            }}
          >
            {para}
          </p>
        ))}

        <PullQuote text={data.situationQuote} color={data.color} />
        <InsightBlock
          label="Market position"
          text={`${data.name} is positioned as the ${data.outcome.toLowerCase()} architect for ${data.meta.audienceType.toLowerCase()}.`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
