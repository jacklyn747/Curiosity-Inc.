'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'

// Triangle SVG — direction / forward motion symbol (mirrors CTASection)
function TriangleAccent({ color }: { color: string }) {
  return (
    <svg width="28" height="26" viewBox="0 0 28 26" fill="none" style={{ display: 'block', marginBottom: '20px' }}>
      <polygon
        points="14,2 26,24 2,24"
        stroke={color}
        strokeWidth={1}
        fill="none"
        opacity={0.5}
      />
    </svg>
  )
}

export function CuriosityUpgradeSection({ data }: { data: CaseStudy }) {
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
          marginBottom: '16px',
        }}>
          08 / The Curiosity Upgrade
        </p>

        <TriangleAccent color={data.color} />

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', maxWidth: '680px' }}>
          {data.curiosityUpgrade.map((item, i) => (
            <li key={i} className="animate-line" style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
              paddingBottom: '16px',
              marginBottom: '4px',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                color: data.color,
                marginTop: '3px',
                flexShrink: 0,
                letterSpacing: '0.1em',
              }}>
                →
              </span>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--shell)',
                opacity: 0.65,
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item}
              </p>
            </li>
          ))}
        </ul>

        <PullQuote text={data.curiosityUpgrade[0]} color={data.color} />
        <InsightBlock
          label="Why behavioral architecture enables this"
          text="Cognitive architecture isn't a rebrand — it's a structural change to how information moves through the system. The upgrade isn't cosmetic; it's functional."
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
