'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { symbols } from '@/lib/symbols'
import { SectionWrapper, PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

gsap.registerPlugin(ScrollTrigger)

const NODE_X = [50, 170, 290, 410, 530]
const NODE_Y = 55

export function ActionSection({ data }: { data: CaseStudy }) {
  const sym    = symbols.action
  const ref    = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const stageLabels = [
    data.learningFlow[0].from,
    data.learningFlow[0].to,
    data.learningFlow[1].to,
    data.learningFlow[2].to,
    data.learningFlow[3].to,
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.anim-line') ?? [], {
        opacity: 0, y: 20, duration: dur.base, stagger: 0.07, ease: ease.out,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
      if (svgRef.current) {
        const lines = svgRef.current.querySelectorAll<SVGLineElement>('line.connector')
        lines.forEach(line => {
          const len = line.getTotalLength?.() ?? 120
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
          gsap.to(line, {
            strokeDashoffset: 0, duration: 0.5, ease: 'none',
            scrollTrigger: { trigger: svgRef.current, start: 'top 80%' },
          })
        })
        gsap.from(svgRef.current.querySelectorAll('circle.node-outer'), {
          scale: 0, opacity: 0, duration: 0.4, stagger: 0.1,
          transformOrigin: '50% 50%', ease: 'back.out(1.4)',
          scrollTrigger: { trigger: svgRef.current, start: 'top 80%' },
        })
      }
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionWrapper id="cs-action" symbol={sym} eyebrow="04 / Action" alt>
      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          Learning Flow
        </h2>

        {/* SVG orbit-node chain */}
        <div className="anim-line" style={{ overflowX: 'auto', marginBottom: '40px' }}>
          <svg
            ref={svgRef}
            viewBox="0 0 580 130"
            width="100%"
            style={{ minWidth: '480px', display: 'block' }}
            fill="none"
            strokeLinecap="round"
            aria-label="Learning flow diagram"
          >
            {/* Connector lines */}
            {data.learningFlow.map((_, i) => (
              <line
                key={`conn-${i}`}
                className="connector"
                x1={NODE_X[i] + 24}
                y1={NODE_Y}
                x2={NODE_X[i + 1] - 24}
                y2={NODE_Y}
                stroke={sym.color}
                strokeOpacity={0.3}
                strokeWidth={0.75}
              />
            ))}

            {/* Nodes */}
            {NODE_X.map((x, i) => {
              const progress = i / (NODE_X.length - 1)
              const isLast   = i === NODE_X.length - 1
              const nOpacity = 0.15 + progress * 0.85
              return (
                <g key={`node-${i}`}>
                  <circle className="node-outer" cx={x} cy={NODE_Y} r={22} stroke={sym.color} strokeOpacity={nOpacity * 0.4} strokeWidth={0.75} />
                  <circle cx={x} cy={NODE_Y} r={14} stroke={sym.color} strokeOpacity={nOpacity * 0.6} strokeWidth={0.75} />
                  <circle cx={x} cy={NODE_Y} r={4}  fill={sym.color}   fillOpacity={nOpacity} />
                  {isLast && <circle cx={x} cy={NODE_Y} r={30} stroke={sym.color} strokeOpacity={0.12} strokeWidth={2} />}
                  <text x={x} y={NODE_Y + 38} textAnchor="middle" fontFamily="var(--font-display)" fontSize={8} letterSpacing={1.5} fill="rgba(234,228,218,0.5)">
                    {stageLabels[i]}
                  </text>
                </g>
              )
            })}

            {/* "How" labels */}
            {data.learningFlow.map((step, i) => (
              <text key={`how-${i}`} x={(NODE_X[i] + NODE_X[i + 1]) / 2} y={NODE_Y + 56} textAnchor="middle" fontFamily="var(--font-body, sans-serif)" fontSize={9} fill="rgba(234,228,218,0.3)">
                {step.how.length > 28 ? step.how.slice(0, 26) + '…' : step.how}
              </text>
            ))}
          </svg>
        </div>

        {/* Steps prose */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '720px', marginBottom: '16px' }}>
          {data.learningFlow.map((step, i) => (
            <div key={i} className="anim-line" style={{ padding: '16px', background: 'rgba(234,228,218,0.02)', border: '1px solid rgba(234,228,218,0.05)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: sym.color, opacity: 0.5, marginBottom: '6px' }}>
                {step.from} → {step.to}
              </p>
              <p style={{ fontSize: '12px', opacity: 0.65, lineHeight: 1.6 }}>{step.how}</p>
            </div>
          ))}
        </div>

        <PullQuote quote={data.actionQuote} color={sym.color} />

        <InsightBlock
          label="The step most creators skip"
          value={`${data.learningFlow[1].from} → ${data.learningFlow[1].to}: the transition from passive interest to active trust.`}
          color={sym.color}
        />
      </div>
    </SectionWrapper>
  )
}
