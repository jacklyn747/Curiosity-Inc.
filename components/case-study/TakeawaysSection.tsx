// components/case-study/TakeawaysSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { SectionShell } from './SectionShell'
import { Orb } from '@/components/ui/Orb'
import { caseStudies, type CaseStudy } from '@/lib/case-studies'

export function TakeawaysSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  const currentIndex = caseStudies.findIndex(cs => cs.slug === data.slug)
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = ref.current?.querySelectorAll('.animate-item')
      if (items?.length) {
        gsap.from(items, {
          opacity: 0, y: 24,
          duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        })
      }
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell alt>
      <div ref={ref}>
        <p className="animate-item" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '48px',
        }}>
          09 / Founder Takeaways
        </p>

        {/* 5 large numbered insights */}
        <div style={{ maxWidth: '800px' }}>
          {data.takeaways.map((takeaway, i) => (
            <div
              key={i}
              className="animate-item"
              style={{
                display: 'flex',
                gap: '28px',
                alignItems: 'baseline',
                paddingBottom: '32px',
                borderBottom: '1px solid rgba(234,228,218,0.05)',
                marginBottom: '32px',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                color: data.color,
                opacity: 0.45,
                letterSpacing: '0.2em',
                minWidth: '28px',
                flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(16px, 2vw, 22px)',
                letterSpacing: '0.03em',
                lineHeight: 1.3,
                color: 'var(--shell)',
                margin: 0,
              }}>
                {takeaway}
              </p>
            </div>
          ))}
        </div>

        {/* Orb — glow = breakthrough / resolved signal */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <Orb size={12} />
        </div>

        {/* Next case study navigation */}
        <div style={{
          marginTop: '64px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(234,228,218,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Link
            href="/#work"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--shell)',
              opacity: 0.3,
              textDecoration: 'none',
            }}
          >
            ← Case Studies
          </Link>
          <Link
            href={`/case-studies/${nextStudy.slug}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: nextStudy.color,
              opacity: 0.7,
              textDecoration: 'none',
            }}
          >
            Next: {nextStudy.name} →
          </Link>
        </div>
      </div>
    </SectionShell>
  )
}
