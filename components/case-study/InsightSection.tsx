'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { symbols } from '@/lib/symbols'
import { SectionWrapper, PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

gsap.registerPlugin(ScrollTrigger)

const QUADRANTS = [
  { key: 'attention',          label: 'Attention Strategy' },
  { key: 'cognitiveAnchors',   label: 'Cognitive Anchors' },
  { key: 'knowledgePackaging', label: 'Knowledge Packaging' },
  { key: 'authoritySignals',   label: 'Authority Signals' },
] as const

export function InsightSection({ data }: { data: CaseStudy }) {
  const sym = symbols.insight
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
    <SectionWrapper symbol={sym} eyebrow="03 / Insight">
      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          Behavioral Moves
        </h2>

        {/* 2×2 grid — the Grid symbol made structural */}
        <div className="anim-line" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid rgba(234,228,218,0.06)',
          marginBottom: '40px',
        }}>
          {QUADRANTS.map((q, i) => (
            <div key={q.key} style={{
              padding: '28px',
              borderRight: i % 2 === 0 ? '1px solid rgba(234,228,218,0.06)' : 'none',
              borderBottom: i < 2 ? '1px solid rgba(234,228,218,0.06)' : 'none',
            }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: sym.color,
                opacity: 0.7,
                marginBottom: '16px',
              }}>
                {q.label}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.behavioralMoves[q.key].map((item, j) => (
                  <li key={j} style={{ fontSize: '13px', opacity: 0.7, lineHeight: 1.6, marginBottom: '6px', paddingLeft: '12px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: sym.color, opacity: 0.5 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <PullQuote quote={data.insightQuote} color={sym.color} />

        <InsightBlock
          label="Most leveraged move"
          value={data.behavioralMoves.attention[0]}
          color={sym.color}
        />
      </div>
    </SectionWrapper>
  )
}
