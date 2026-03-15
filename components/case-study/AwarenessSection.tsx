'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { symbols } from '@/lib/symbols'
import { SectionWrapper, PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

gsap.registerPlugin(ScrollTrigger)

const ALL_FRICTION = ['attention', 'trust', 'clarity', 'identity', 'decision'] as const

export function AwarenessSection({ data }: { data: CaseStudy }) {
  const sym = symbols.awareness
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
    <SectionWrapper id="cs-awareness" symbol={sym} eyebrow="02 / Awareness" alt>
      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          The Situation &amp; The Challenge
        </h2>

        {/* Friction type pills */}
        <div className="anim-line" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {ALL_FRICTION.map(f => {
            const active = data.frictionTypes.includes(f)
            return (
              <span key={f} style={{
                fontFamily: 'var(--font-display)',
                fontSize: active ? '11px' : '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '6px 14px',
                border: `1px solid ${active ? sym.color : 'rgba(234,228,218,0.08)'}`,
                color: active ? sym.color : 'rgba(234,228,218,0.2)',
                opacity: active ? 1 : 0.5,
                background: active ? `${sym.color}08` : 'transparent',
              }}>
                {f} friction
              </span>
            )
          })}
        </div>

        {/* Situation paragraphs */}
        {data.situation.map((p, i) => (
          <p key={i} className="anim-line" style={{ fontSize: '16px', lineHeight: 1.75, opacity: 0.75, marginBottom: '20px', maxWidth: '720px' }}>
            {p}
          </p>
        ))}

        <PullQuote quote={data.awarenessQuote} color={sym.color} />

        <p className="anim-line" style={{ fontSize: '16px', lineHeight: 1.75, opacity: 0.75, maxWidth: '720px' }}>
          {data.challenge}
        </p>

        <InsightBlock
          label="Primary friction"
          value={`${data.frictionTypes[0].charAt(0).toUpperCase() + data.frictionTypes[0].slice(1)} friction — the dominant lever in this creator's trust architecture.`}
          color={sym.color}
        />
      </div>
    </SectionWrapper>
  )
}
