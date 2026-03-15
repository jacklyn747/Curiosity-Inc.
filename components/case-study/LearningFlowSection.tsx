'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'

const NODE_X = [60, 180, 300, 420, 540]
const NODE_Y = 60
const SVG_W = 600
const SVG_H = 120

export function LearningFlowSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Build stage labels from learningFlow
  const stages = [
    data.learningFlow[0].from,
    data.learningFlow[0].to,
    data.learningFlow[1].to,
    data.learningFlow[2].to,
    data.learningFlow[3].to,
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate node circles from scale 0
      const nodes = svgRef.current?.querySelectorAll('.flow-node')
      const connectors = svgRef.current?.querySelectorAll('.flow-connector')
      const labels = svgRef.current?.querySelectorAll('.flow-label')

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })

      if (connectors?.length) {
        tl.from(connectors, { opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
      }
      if (nodes?.length) {
        tl.from(nodes, { scale: 0, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)', transformOrigin: 'center' }, '-=0.3')
      }
      if (labels?.length) {
        tl.from(labels, { opacity: 0, y: 6, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.2')
      }

      // Text lines
      const lines = ref.current?.querySelectorAll('.animate-line')
      if (lines?.length) {
        tl.from(lines, { opacity: 0, y: 16, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, '-=0.2')
      }
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
          04 / Learning Flow
        </p>

        {/* SVG orbit-node chain */}
        <div style={{ width: '100%', overflowX: 'auto', marginBottom: '32px' }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ width: '100%', minWidth: '400px', maxWidth: '700px' }}
            fill="none"
          >
            {/* Connector lines between nodes */}
            {NODE_X.slice(0, -1).map((x, i) => (
              <g key={i} className="flow-connector">
                <line
                  x1={x + 28} y1={NODE_Y}
                  x2={NODE_X[i + 1] - 28} y2={NODE_Y}
                  stroke={data.color}
                  strokeWidth={0.6}
                  opacity={0.3}
                />
                {/* Arrowhead at midpoint */}
                <polygon
                  points={`${(x + NODE_X[i + 1]) / 2 + 4},${NODE_Y} ${(x + NODE_X[i + 1]) / 2 - 2},${NODE_Y - 3} ${(x + NODE_X[i + 1]) / 2 - 2},${NODE_Y + 3}`}
                  fill={data.color}
                  opacity={0.3}
                />
              </g>
            ))}

            {/* Nodes */}
            {NODE_X.map((cx, i) => {
              const isFinal = i === 4
              const progress = i / 4  // 0 to 1
              const opacity = 0.1 + progress * 0.9

              return (
                <g key={i} className="flow-node">
                  {/* Glow halo on final node — breakthrough symbol */}
                  {isFinal && (
                    <circle cx={cx} cy={NODE_Y} r={32} fill={data.color} opacity={0.06} />
                  )}
                  {/* Outer ring */}
                  <circle cx={cx} cy={NODE_Y} r={24} stroke={data.color} strokeWidth={0.5} opacity={opacity * 0.4} />
                  {/* Middle ring */}
                  <circle cx={cx} cy={NODE_Y} r={16} stroke={data.color} strokeWidth={0.5} opacity={opacity * 0.6} />
                  {/* Inner ring */}
                  <circle cx={cx} cy={NODE_Y} r={8} stroke={data.color} strokeWidth={0.6} opacity={opacity * 0.8} />
                  {/* Center dot */}
                  <circle cx={cx} cy={NODE_Y} r={isFinal ? 4 : 2.5} fill={data.color} opacity={opacity} />
                </g>
              )
            })}

            {/* Stage labels */}
            {stages.map((label, i) => (
              <text
                key={i}
                className="flow-label"
                x={NODE_X[i]}
                y={NODE_Y + 42}
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontSize="8"
                letterSpacing="0.15em"
                fill="rgba(234,228,218,0.4)"
              >
                {label.toUpperCase()}
              </text>
            ))}
          </svg>
        </div>

        {/* How labels below SVG */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {data.learningFlow.map((step, i) => (
            <div key={i} style={{ paddingLeft: '12px', borderLeft: `1px solid rgba(234,228,218,0.06)` }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'var(--shell)',
                opacity: 0.45,
                lineHeight: 1.5,
              }}>
                {step.how}
              </p>
            </div>
          ))}
        </div>

        <PullQuote text={data.learningFlow[1].how} color={data.color} />
        <InsightBlock
          label="The step most creators skip"
          text={`${data.learningFlow[2].from} → ${data.learningFlow[2].to}: ${data.learningFlow[2].how}`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
