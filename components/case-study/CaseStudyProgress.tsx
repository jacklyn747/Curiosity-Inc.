'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap }          from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { colors, shellAt } from '@/lib/design-tokens'

// ─── Stage map ────────────────────────────────────────────────────────────────
// One entry per behavioral section — cold → warm temperature arc
const STAGES = [
  { id: 'cs-hero',      symbol: 'confusion',  label: 'Attention Leak Identified', color: colors.sky  },
  { id: 'cs-awareness', symbol: 'awareness',  label: 'Friction Located',           color: colors.pink },
  { id: 'cs-insight',   symbol: 'insight',    label: 'Meaning Emerges',            color: colors.must },
  { id: 'cs-action',    symbol: 'action',     label: 'Behavior Path Designed',     color: colors.tea  },
  { id: 'cs-framework', symbol: 'framework',  label: 'System Encoded',             color: colors.lav  },
  { id: 'cs-system',    symbol: 'system',     label: 'Architecture Mapped',        color: shellAt[75] },
  { id: 'cs-authority', symbol: 'authority',  label: 'Signal Achieved',            color: colors.tang },
] as const

// ─── Symbol motion language CSS ───────────────────────────────────────────────
// Applied to SVG child elements — GSAP controls the wrapper div.
// Different elements = zero transform conflict.
const SPINE_CSS = `
  @keyframes cs-flicker {
    0%, 100% { opacity: 1; }
    30%       { opacity: 0.4; }
    60%       { opacity: 0.75; }
  }
  @keyframes cs-overlap-glow {
    0%, 100% { opacity: 0.85; }
    50%       { opacity: 0.55; }
  }
  @keyframes cs-slide-up {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-2px); }
  }
  @keyframes cs-radial-bloom {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.08); }
  }
  @keyframes cs-slow-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.65; }
  }
  @keyframes cs-halo-ring {
    0%        { transform: scale(0.9); opacity: 0.5; }
    100%      { transform: scale(2.4); opacity: 0; }
  }

  .cs-anim-confusion  svg { animation: cs-flicker      2.5s ease-in-out infinite; }
  .cs-anim-insight    svg { animation: cs-overlap-glow 3s   ease-in-out infinite; }
  .cs-anim-action     svg { animation: cs-slide-up     2.2s ease-in-out infinite; }
  .cs-anim-framework  svg { animation: cs-radial-bloom 3.5s ease-in-out infinite; }
  .cs-anim-authority  svg { animation: cs-slow-pulse   1.8s ease-in-out infinite; }

  /* Hide on viewports too narrow to show the spine */
  @media (max-width: 1100px) { .cs-progress-spine { display: none !important; } }
`

// ─── Mini node SVGs ───────────────────────────────────────────────────────────
function NodeSVG({ symbol, color }: { symbol: string; color: string }) {
  const S = 20, C = 10, sw = 1

  if (symbol === 'confusion') {
    return (
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none">
        <circle cx="4"  cy="7"  r="1.5" fill={color} />
        <circle cx="13" cy="5"  r="1"   fill={color} />
        <circle cx="9"  cy="14" r="1.5" fill={color} />
        <circle cx="15" cy="12" r="1"   fill={color} />
        <circle cx="7"  cy="10" r="1"   fill={color} />
      </svg>
    )
  }

  if (symbol === 'awareness') {
    // 270° open arc — gap at bottom-right
    return (
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none">
        <path d="M 10 2 A 8 8 0 1 1 18 10"
          stroke={color} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    )
  }

  if (symbol === 'insight') {
    return (
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none">
        <circle cx="7.5"  cy={C} r="6" stroke={color} strokeWidth={sw} />
        <circle cx="12.5" cy={C} r="6" stroke={color} strokeWidth={sw} />
      </svg>
    )
  }

  if (symbol === 'action') {
    return (
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none">
        <polygon points="10,2 18,17 2,17"
          stroke={color} strokeWidth={sw} strokeLinejoin="round" fill="none" />
      </svg>
    )
  }

  if (symbol === 'framework') {
    const r = 5.5, dr = 2
    const dots: [number, number][] = [
      [C,           C],
      [C + r,       C],
      [C + r * 0.5, C - r * 0.866],
      [C - r * 0.5, C - r * 0.866],
      [C - r,       C],
      [C - r * 0.5, C + r * 0.866],
      [C + r * 0.5, C + r * 0.866],
    ]
    return (
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none">
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === 0 ? dr : dr * 0.7}
            stroke={color} strokeWidth={0.75} fill="none" />
        ))}
      </svg>
    )
  }

  if (symbol === 'system') {
    return (
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none">
        <polygon points="10,2 18,7 10,12 2,7"    stroke={color} strokeWidth={sw} strokeLinejoin="round" fill="none" />
        <polygon points="10,12 18,7 18,14 10,18"  stroke={color} strokeWidth={sw} strokeLinejoin="round" fill="none" />
        <polygon points="2,7 10,12 10,18 2,14"    stroke={color} strokeWidth={sw} strokeLinejoin="round" fill="none" />
      </svg>
    )
  }

  if (symbol === 'authority') {
    const rays = Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4
      return { x1: C + 5.5 * Math.cos(a), y1: C + 5.5 * Math.sin(a),
               x2: C + 8   * Math.cos(a), y2: C + 8   * Math.sin(a) }
    })
    return (
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none">
        <circle cx={C} cy={C} r="4" stroke={color} strokeWidth={sw} />
        {rays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
            stroke={color} strokeWidth={0.75} />
        ))}
      </svg>
    )
  }

  return null
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CaseStudyProgress() {
  const [activeIndex,  setActiveIndex]  = useState(-1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [skimming,     setSkimming]     = useState(false)
  const [complete,     setComplete]     = useState(false)

  const nodeRefs      = useRef<(HTMLDivElement | null)[]>([])
  const lineRef       = useRef<HTMLDivElement>(null)
  const connRefs      = useRef<(HTMLDivElement | null)[]>([])
  const skimTimer     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollTrack   = useRef({ y: 0, t: Date.now() })

  // ── Velocity → skimming feedback
  useEffect(() => {
    const onScroll = () => {
      const now = Date.now()
      const dt  = now - scrollTrack.current.t
      if (dt > 0) {
        const vel = Math.abs(window.scrollY - scrollTrack.current.y) / dt * 1000
        if (vel > 850) {
          setSkimming(true)
          if (skimTimer.current) clearTimeout(skimTimer.current)
          skimTimer.current = setTimeout(() => setSkimming(false), 1500)
        }
      }
      scrollTrack.current = { y: window.scrollY, t: now }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (skimTimer.current) clearTimeout(skimTimer.current)
    }
  }, [])

  // ── ScrollTrigger: one per section, fires at 35% viewport
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const triggers: ScrollTrigger[] = []

    STAGES.forEach((stage, i) => {
      const el = document.getElementById(stage.id)
      if (!el) return
      triggers.push(
        ScrollTrigger.create({
          trigger:   el,
          start:     'top 35%',
          onEnter:    () => { setActiveIndex(i);     if (i === STAGES.length - 1) setComplete(true)  },
          onLeaveBack: () => { setActiveIndex(i - 1); if (i === STAGES.length - 1) setComplete(false) },
        })
      )
    })

    return () => triggers.forEach((t) => t.kill())
  }, [])

  // ── GSAP animates node wrappers when active index changes
  useEffect(() => {
    nodeRefs.current.forEach((node, i) => {
      if (!node) return
      const { color } = STAGES[i]
      if (i === activeIndex) {
        gsap.to(node, {
          scale:    1.45,
          opacity:  1,
          filter:   `drop-shadow(0 0 6px ${color})`,
          duration: 0.45,
          ease:     'power2.out',
        })
      } else if (i < activeIndex) {
        gsap.to(node, { scale: 1, opacity: 0.5, filter: 'none', duration: 0.35, ease: 'power2.out' })
      } else {
        gsap.to(node, { scale: 0.85, opacity: 0.35, filter: 'none', duration: 0.35, ease: 'power2.out' })
      }
    })

    // Connectors between past nodes brighten
    connRefs.current.forEach((c, i) => {
      if (!c) return
      gsap.to(c, {
        opacity:  i < activeIndex ? 0.55 : 0.18,
        duration: 0.4,
        ease:     'power2.out',
      })
    })
  }, [activeIndex])

  // ── Completion: entire spine brightens
  useEffect(() => {
    if (lineRef.current) {
      gsap.to(lineRef.current, { opacity: complete ? 0.65 : 0.18, duration: 1.2, ease: 'power2.inOut' })
    }
    if (complete) {
      connRefs.current.forEach((c) => {
        if (!c) return
        gsap.to(c, { opacity: 0.65, duration: 1.2, ease: 'power2.inOut' })
      })
    }
  }, [complete])

  return (
    <>
      <style>{SPINE_CSS}</style>

      {/* Skimming nudge */}
      <div
        role="status"
        aria-live="polite"
        style={{
          position:      'fixed',
          bottom:        28,
          right:         72,
          fontSize:      10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         shellAt[50],
          opacity:       skimming ? 1 : 0,
          transition:    'opacity 0.5s ease',
          pointerEvents: 'none',
          zIndex:        100,
          fontFamily:    "'Satoshi', sans-serif",
          userSelect:    'none',
        }}
      >
        Skimming reduces clarity.
      </div>

      {/* ── Progress spine ── */}
      <div
        className="cs-progress-spine"
        style={{
          position:       'fixed',
          right:          40,
          top:            '50%',
          transform:      'translateY(-50%)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          zIndex:         50,
          pointerEvents:  'none',
        }}
      >
        {/* Continuous background line */}
        <div
          ref={lineRef}
          style={{
            position:   'absolute',
            left:       '50%',
            top:        10,
            bottom:     10,
            width:      1,
            transform:  'translateX(-50%)',
            background: shellAt[20],
            opacity:    0.18,
            zIndex:     0,
          }}
        />

        {STAGES.map((stage, i) => (
          <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Node row: label floats left, node sits on the line */}
            <div
              style={{ position: 'relative', display: 'flex', alignItems: 'center', zIndex: 1, pointerEvents: 'auto' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Symbol node wrapper — GSAP controls scale / opacity / filter here */}
              <div
                ref={(el) => { nodeRefs.current[i] = el }}
                className={activeIndex === i ? `cs-anim-${stage.symbol}` : ''}
                style={{
                  width:       20,
                  height:      20,
                  display:     'flex',
                  alignItems:  'center',
                  justifyContent: 'center',
                  opacity:     0.35,
                  willChange:  'transform, opacity, filter',
                  cursor:      'default',
                }}
              >
                <NodeSVG symbol={stage.symbol} color={stage.color} />
              </div>

              {/* Halo ring — authority node only, on completion */}
              {stage.symbol === 'authority' && complete && (
                <div
                  style={{
                    position:     'absolute',
                    inset:        -6,
                    borderRadius: '50%',
                    border:       `1px solid ${stage.color}`,
                    opacity:      0,
                    animation:    'cs-halo-ring 2s ease-out infinite',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Label — left of node, appears on hover or active */}
              <div
                style={{
                  position:      'absolute',
                  right:         '100%',
                  paddingRight:  10,
                  whiteSpace:    'nowrap',
                  fontSize:      10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         stage.color,
                  opacity:       hoveredIndex === i || activeIndex === i ? 1 : 0,
                  transition:    'opacity 0.35s ease',
                  pointerEvents: 'none',
                  fontFamily:    "'Satoshi', sans-serif",
                  userSelect:    'none',
                }}
              >
                {stage.label}
              </div>
            </div>

            {/* Connector between nodes */}
            {i < STAGES.length - 1 && (
              <div
                ref={(el) => { connRefs.current[i] = el }}
                style={{
                  width:      1,
                  height:     32,
                  background: shellAt[15],
                  opacity:    0.18,
                  margin:     '0 auto',
                  zIndex:     0,
                }}
              />
            )}

          </div>
        ))}
      </div>
    </>
  )
}
