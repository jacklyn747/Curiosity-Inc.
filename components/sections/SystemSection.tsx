'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { layers } from '@/lib/design-tokens'
import { dur, ease } from '@/lib/motion-config'

// ─── SVG constants ─────────────────────────────────────────────────────────────

const W  = 1200
const H  = 700
const CX = W / 2   // 600 — horizontal spine center

// Node Y positions: SIGNAL at top (y=80), STIMULUS at bottom (y=620)
const Y_TOP    = 80
const Y_BOTTOM = 620
const Y_STEP   = (Y_BOTTOM - Y_TOP) / (layers.length - 1)  // 135

/** Returns the Y position for a layer by its index (0=STIMULUS at bottom) */
const nodeY = (index: number) => Y_BOTTOM - index * Y_STEP

// Spine total length (vertical line, x fixed)
const SPINE_LEN = Y_BOTTOM - Y_TOP  // 540

// Per-node orbit geometry
const ORBIT = {
  outerRx: 160, outerRy: 20,   // flat outer ellipse
  innerRx: 95,  innerRy: 13,   // tight inner ellipse
  ring1R:  46,                  // concentric circle
  ring2R:  27,                  // tight concentric
  nodeR:   9,                   // the dot
  glowR:   3.5,                 // inner highlight
}

// Layer descriptions (shown on hover)
const DESCRIPTIONS: Record<string, string> = {
  stimulus:  'Environmental inputs that initiate a cognitive response',
  cognition: 'Mental models that filter and interpret incoming stimuli',
  behavior:  'Observable actions driven by underlying cognitive models',
  system:    'Structural conditions that constrain and enable behavior',
  signal:    'Resolved clarity — the designed, intentional outcome',
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function SystemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef     = useRef<SVGSVGElement>(null)
  const spineRef   = useRef<SVGLineElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    if (!svgRef.current || !spineRef.current) return

    // Prepare spine for draw animation
    gsap.set(spineRef.current, {
      strokeDasharray:  SPINE_LEN,
      strokeDashoffset: SPINE_LEN,
    })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      })

      // 1 — Spine draws upward (bottom → top)
      tl.to(spineRef.current, {
        strokeDashoffset: 0,
        duration: dur.slow,
        ease: ease.draw,
      })

      // 2 — Orbit groups: fade + scale in, bottom → top stagger
      tl.from(
        svgRef.current!.querySelectorAll('.orbit-group'),
        {
          opacity: 0,
          scale: 0.6,
          transformOrigin: '50% 50%',
          duration: dur.base,
          stagger: { each: 0.1, from: 'end', ease: ease.out },
          ease: ease.out,
        },
        '-=0.55'
      )

      // 3 — Node dots: pop in bottom → top
      tl.from(
        svgRef.current!.querySelectorAll('.node-dot'),
        {
          scale: 0,
          transformOrigin: '50% 50%',
          duration: dur.fast,
          stagger: { each: 0.12, from: 'end', ease: ease.out },
          ease: ease.out,
        },
        '-=0.6'
      )

      // 4 — Labels slide in from right, bottom → top
      tl.from(
        svgRef.current!.querySelectorAll('.layer-label-group'),
        {
          opacity: 0,
          x: 18,
          duration: dur.fast,
          stagger: { each: 0.09, from: 'end', ease: ease.out },
          ease: ease.out,
        },
        '-=0.5'
      )

      // 5 — Index numbers fade in
      tl.from(
        svgRef.current!.querySelectorAll('.layer-index'),
        {
          opacity: 0,
          duration: dur.fast,
          stagger: { each: 0.09, from: 'end' },
        },
        '-=0.5'
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: 'var(--black)', paddingTop: '120px', paddingBottom: '120px' }}
    >
      {/* ── Section Header ────────────────────────────────────── */}
      <div style={{ maxWidth: '860px', margin: '0 auto 72px', padding: '0 48px' }}>
        <p className="t-eyebrow" style={{ marginBottom: '24px', color: 'var(--tang)', opacity: 0.7 }}>
          The Curiosity System
        </p>
        <h2
          className="t-headline"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 0.95 }}
        >
          Signal doesn't emerge.
          <br />
          <span style={{ color: 'var(--shell)', opacity: 0.45 }}>It's engineered.</span>
        </h2>
      </div>

      {/* ── SVG Diagram ───────────────────────────────────────── */}
      <div style={{ maxWidth: `${W}px`, margin: '0 auto', padding: '0 24px' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          aria-label="The Curiosity System — five cognitive layers from Stimulus to Signal"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Spine gradient: pink (stimulus/bottom) → tang (signal/top) */}
            <linearGradient id="spineGrad" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#EAA7C7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ED773C" stopOpacity="0.9" />
            </linearGradient>

            {/* Per-layer glow filters */}
            {layers.map(layer => (
              <filter key={`glow-${layer.id}`} id={`glow-${layer.id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          {/* ── Background radial grid ─────────────────────── */}
          <g aria-hidden="true" opacity="1">
            {[120, 200, 290, 390].map(r => (
              <circle
                key={r}
                cx={CX} cy={H / 2}
                r={r}
                stroke="rgba(234,228,218,0.025)"
                strokeWidth="0.75"
              />
            ))}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
              const rad = (deg * Math.PI) / 180
              return (
                <line
                  key={deg}
                  x1={CX} y1={H / 2}
                  x2={CX + Math.cos(rad) * 420}
                  y2={H / 2 + Math.sin(rad) * 420}
                  stroke="rgba(234,228,218,0.02)"
                  strokeWidth="0.75"
                />
              )
            })}
          </g>

          {/* ── Spine ─────────────────────────────────────── */}
          <line
            ref={spineRef}
            x1={CX} y1={Y_BOTTOM}
            x2={CX} y2={Y_TOP}
            stroke="url(#spineGrad)"
            strokeWidth="1"
          />

          {/* ── Layers ────────────────────────────────────── */}
          {layers.map((layer, i) => {
            const y        = nodeY(i)
            const isActive = hovered === layer.id
            const col      = layer.color

            return (
              <g
                key={layer.id}
                onMouseEnter={() => setHovered(layer.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }}
              >
                {/* Invisible hit area — full row height, full width */}
                <rect
                  x={0} y={y - 55}
                  width={W} height={110}
                  fill="transparent"
                  style={{ pointerEvents: 'all' }}
                />
                {/* Horizontal band at this layer's level */}
                <line
                  x1={0} y1={y} x2={W} y2={y}
                  stroke={col}
                  strokeWidth="0.5"
                  strokeOpacity={isActive ? 0.14 : 0.06}
                  style={{ transition: 'stroke-opacity 0.3s' }}
                />

                {/* Tick mark on the left connecting to index */}
                <line
                  x1={CX - ORBIT.outerRx - 8} y1={y}
                  x2={CX - ORBIT.outerRx - 32} y2={y}
                  stroke={col}
                  strokeWidth="0.75"
                  strokeOpacity={isActive ? 0.5 : 0.2}
                  style={{ transition: 'stroke-opacity 0.3s' }}
                />

                {/* Tick mark on the right connecting to label */}
                <line
                  x1={CX + ORBIT.outerRx + 8} y1={y}
                  x2={CX + ORBIT.outerRx + 32} y2={y}
                  stroke={col}
                  strokeWidth="0.75"
                  strokeOpacity={isActive ? 0.5 : 0.2}
                  style={{ transition: 'stroke-opacity 0.3s' }}
                />

                {/* Orbit rings */}
                <g
                  className="orbit-group"
                  style={{ transformOrigin: `${CX}px ${y}px` }}
                >
                  {/* Outer flat ellipse */}
                  <ellipse
                    cx={CX} cy={y}
                    rx={ORBIT.outerRx} ry={ORBIT.outerRy}
                    stroke={col}
                    strokeWidth="0.75"
                    strokeOpacity={isActive ? 0.28 : 0.10}
                    style={{ transition: 'stroke-opacity 0.3s' }}
                  />
                  {/* Inner flat ellipse */}
                  <ellipse
                    cx={CX} cy={y}
                    rx={ORBIT.innerRx} ry={ORBIT.innerRy}
                    stroke={col}
                    strokeWidth="0.75"
                    strokeOpacity={isActive ? 0.38 : 0.16}
                    style={{ transition: 'stroke-opacity 0.3s' }}
                  />
                  {/* Concentric circle 1 */}
                  <circle
                    cx={CX} cy={y} r={ORBIT.ring1R}
                    stroke={col}
                    strokeWidth="1"
                    strokeOpacity={isActive ? 0.50 : 0.20}
                    style={{ transition: 'stroke-opacity 0.3s' }}
                  />
                  {/* Concentric circle 2 */}
                  <circle
                    cx={CX} cy={y} r={ORBIT.ring2R}
                    stroke={col}
                    strokeWidth="1"
                    strokeOpacity={isActive ? 0.60 : 0.28}
                    style={{ transition: 'stroke-opacity 0.3s' }}
                  />
                </g>

                {/* Node dot */}
                <g
                  className="node-dot"
                  style={{ transformOrigin: `${CX}px ${y}px` }}
                  filter={isActive ? `url(#glow-${layer.id})` : undefined}
                >
                  {/* Glow halo on hover */}
                  {isActive && (
                    <circle cx={CX} cy={y} r={18} fill={col} fillOpacity={0.15} />
                  )}
                  <circle cx={CX} cy={y} r={ORBIT.nodeR} fill={col} />
                  <circle cx={CX} cy={y} r={ORBIT.glowR} fill="rgba(234,228,218,0.88)" />
                </g>

                {/* Index (left side) */}
                <text
                  className="layer-index"
                  x={CX - ORBIT.outerRx - 44}
                  y={y + 4}
                  textAnchor="end"
                  fontFamily="'Josefin Sans', sans-serif"
                  fontSize="10"
                  fill={col}
                  fillOpacity={isActive ? 0.7 : 0.35}
                  letterSpacing="0.2em"
                  style={{ transition: 'fill-opacity 0.3s' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </text>

                {/* Label group (right side) */}
                <g className="layer-label-group">
                  {/* Layer name */}
                  <text
                    x={CX + ORBIT.outerRx + 44}
                    y={y + 5}
                    textAnchor="start"
                    fontFamily="'Josefin Sans', sans-serif"
                    fontSize="11"
                    fontWeight="400"
                    fill={col}
                    fillOpacity={isActive ? 1 : 0.65}
                    letterSpacing="0.22em"
                    style={{ transition: 'fill-opacity 0.3s' }}
                  >
                    {layer.label.toUpperCase()}
                  </text>

                  {/* Description — visible on hover */}
                  <text
                    x={CX + ORBIT.outerRx + 44}
                    y={y + 20}
                    textAnchor="start"
                    fontFamily="'Satoshi', sans-serif"
                    fontSize="11"
                    fill="rgba(234,228,218,0.5)"
                    opacity={isActive ? 1 : 0}
                    style={{ transition: 'opacity 0.25s' }}
                  >
                    {DESCRIPTIONS[layer.id]}
                  </text>
                </g>
              </g>
            )
          })}

          {/* ── Top/bottom terminus marks ─────────────────── */}
          {/* Signal top mark */}
          <line
            x1={CX - 20} y1={Y_TOP} x2={CX + 20} y2={Y_TOP}
            stroke="var(--tang)" strokeWidth="1" strokeOpacity="0.4"
          />
          {/* Stimulus bottom mark */}
          <line
            x1={CX - 20} y1={Y_BOTTOM} x2={CX + 20} y2={Y_BOTTOM}
            stroke="#EAA7C7" strokeWidth="1" strokeOpacity="0.4"
          />
        </svg>
      </div>

      {/* ── Bottom label ──────────────────────────────────────── */}
      <div
        style={{
          maxWidth: `${W}px`,
          margin: '40px auto 0',
          padding: '0 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p className="t-caption" style={{ color: 'rgba(234,228,218,0.2)', letterSpacing: '0.28em' }}>
          STIMULUS
        </p>
        <p className="t-caption" style={{ color: 'rgba(234,228,218,0.2)', letterSpacing: '0.28em', fontSize: '9px' }}>
          NOISE → SIGNAL
        </p>
        <p className="t-caption" style={{ color: 'rgba(234,228,218,0.2)', letterSpacing: '0.28em' }}>
          SIGNAL
        </p>
      </div>
    </section>
  )
}
