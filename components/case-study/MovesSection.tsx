'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'

const QUADRANTS = [
  { key: 'attention' as const, label: 'Attention Strategy' },
  { key: 'cognitiveAnchors' as const, label: 'Cognitive Anchors' },
  { key: 'knowledgePackaging' as const, label: 'Knowledge Packaging' },
  { key: 'authoritySignals' as const, label: 'Authority Signals' },
]

export function MovesSection({ data }: { data: CaseStudy }) {
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
          03 / Behavioral Moves
        </p>

        {/* 2×2 Grid — the Grid (architecture) sacred geometry symbol */}
        <div className="animate-line" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid rgba(234,228,218,0.06)',
          marginBottom: '32px',
        }}>
          {QUADRANTS.map((q, i) => (
            <div
              key={q.key}
              style={{
                padding: '24px',
                borderRight: i % 2 === 0 ? '1px solid rgba(234,228,218,0.06)' : 'none',
                borderBottom: i < 2 ? '1px solid rgba(234,228,218,0.06)' : 'none',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: data.color,
                opacity: 0.6,
                marginBottom: '12px',
              }}>
                {q.label}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.behavioralMoves[q.key].map((item, j) => (
                  <li key={j} style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--shell)',
                    opacity: 0.55,
                    lineHeight: 1.6,
                    paddingBottom: '6px',
                    paddingLeft: '12px',
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: data.color,
                      opacity: 0.5,
                      fontSize: '8px',
                      top: '4px',
                    }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <PullQuote text={data.behavioralMoves.cognitiveAnchors[0]} color={data.color} />
        <InsightBlock
          label="Most leveraged move"
          text={data.behavioralMoves.attention[0]}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
