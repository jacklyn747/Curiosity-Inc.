'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { symbols } from '@/lib/symbols'
import { Symbol } from '@/components/geo/Symbol'
import { SectionWrapper, PullQuote } from './SectionWrapper'
import { getNextCaseStudy } from '@/lib/case-studies'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

gsap.registerPlugin(ScrollTrigger)

export function AuthoritySection({ data }: { data: CaseStudy }) {
  const sym  = symbols.authority
  const next = getNextCaseStudy(data.slug)
  const ref  = useRef<HTMLDivElement>(null)

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
    <SectionWrapper id="cs-authority" symbol={sym} eyebrow="07 / Authority">
      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          The Curiosity Upgrade
        </h2>

        {/* Upgrade bullets */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', maxWidth: '680px' }}>
          {data.curiosityUpgrade.map((item, i) => (
            <li key={i} className="anim-line" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(234,228,218,0.04)' }}>
              <span style={{ color: data.color, fontFamily: 'var(--font-display)', fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>→</span>
              <span style={{ fontSize: '15px', opacity: 0.8, lineHeight: 1.65 }}>{item.replace('→ ', '')}</span>
            </li>
          ))}
        </ul>

        {/* Pull quote from first upgrade item concept */}
        <PullQuote
          quote={`"The system is real. The question is: can you make it visible?"`}
          color={sym.color}
        />

        {/* Takeaways */}
        <div className="anim-line" style={{ borderTop: '1px solid rgba(234,228,218,0.06)', paddingTop: '48px', marginBottom: '48px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: sym.color, opacity: 0.5, marginBottom: '32px' }}>
            Founder Takeaways
          </p>
          <div style={{ maxWidth: '700px' }}>
            {data.takeaways.map((t, i) => (
              <div key={i} className="anim-line" style={{ display: 'flex', gap: '28px', alignItems: 'baseline', paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(234,228,218,0.04)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: data.color, opacity: 0.4, minWidth: '28px', flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '17px', letterSpacing: '0.03em', lineHeight: 1.35, opacity: 0.9 }}>
                  {t}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing symbol */}
        <div className="anim-line" style={{ display: 'flex', justifyContent: 'center', marginBottom: '64px' }}>
          <Symbol symbol={sym} size={48} color={data.color} opacity={0.5} animated />
        </div>

        {/* Navigation */}
        <div className="anim-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(234,228,218,0.06)', paddingTop: '32px' }}>
          <Link href="/#work" style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--shell)', opacity: 0.3, textDecoration: 'none' }}>
            ← All Case Studies
          </Link>
          <Link href={`/case-studies/${next.slug}`} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: next.color, opacity: 0.75, textDecoration: 'none' }}>
            Next: {next.name} →
          </Link>
        </div>
      </div>
    </SectionWrapper>
  )
}
