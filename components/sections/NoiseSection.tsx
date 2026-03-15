'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { dur, ease } from '@/lib/motion-config'
import { ThinLineSystem } from '@/components/geo/ThinLineSystem'

// ─── Word field data ───────────────────────────────────────────────────────────
// 40 words, 8 cols × 5 rows. Represents the vocabulary of noise.

const WORDS = [
  'INPUT',    'TRIGGER',  'DATA',     'FRICTION', 'CONTEXT',   'BEHAVIOR', 'SYSTEM',  'SIGNAL',
  'NOISE',    'PATTERN',  'BIAS',     'CHOICE',   'BELIEF',    'ATTENTION','HABIT',   'FEEDBACK',
  'CUE',      'REWARD',   'MODEL',    'FRAME',    'DECISION',  'RESPONSE', 'MEASURE', 'CLICK',
  'CONVERT',  'METRIC',   'REACH',    'OPTIMIZE', 'AWARENESS', 'ACTION',   'NUDGE',   'DEFAULT',
  'STIMULUS', 'COGNITION','SALIENCE', 'ANCHOR',   'MEMORY',    'IDENTITY', 'NORM',    'TRUST',
] as const

// Pre-computed scatter offsets — deterministic, no Math.random() in render
const SCATTER_X = [
  -42,  18, -80,  35, -20,  60, -15,  48,
   25, -68,  10, -35,  72, -50,  30, -22,
   55, -38,  15, -72,  40, -12,  65, -45,
   20, -60,  38, -28,  52, -18,  42, -55,
   28, -38,  62, -22,  35, -48,  18, -65,
]
const SCATTER_Y = [
  -28, -52,  14,  40, -18, -35,  25, -10,
   55, -40, -65,  18,  30,   8, -45,  62,
  -20,  35,  48, -15, -58,  28,  12, -48,
   38,  22, -32,  55, -42,  18,  32, -25,
  -48,  42,   8, -38,  52,  15, -22,  35,
]

// SVG grid constants
const W      = 1200
const H      = 480
const COLS   = 8
const ROWS   = 5
const COL_W  = W / COLS  // 150
const ROW_H  = H / ROWS  // 96

// ─── Component ─────────────────────────────────────────────────────────────────

export function NoiseSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const wordRefs    = useRef<(SVGTextElement | null)[]>([])

  useEffect(() => {
    const words = wordRefs.current.filter(Boolean) as SVGTextElement[]
    if (!words.length) return

    const ctx = gsap.context(() => {
      // Set words to scattered positions, invisible
      words.forEach((el, i) => {
        gsap.set(el, {
          x:       SCATTER_X[i] ?? 0,
          y:       SCATTER_Y[i] ?? 0,
          opacity: 0,
        })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 72%',
          toggleActions: 'play none none none',
        },
      })

      // 1 — Words assemble from scatter into grid
      tl.to(words, {
        x:        0,
        y:        0,
        opacity:  0.055,
        duration: 1.2,
        stagger:  { each: 0.016, from: 'random' as const, ease: ease.out },
        ease:     ease.out,
      })

      // 2 — Headline lines stagger up
      tl.from(
        sectionRef.current!.querySelectorAll('.noise-headline-line'),
        {
          opacity:  0,
          y:        30,
          duration: dur.slow,
          stagger:  { each: 0.14, ease: ease.out },
          ease:     ease.out,
        },
        '-=0.9'
      )

      // 3 — Body lines
      tl.from(
        sectionRef.current!.querySelectorAll('.noise-body-line'),
        {
          opacity:  0,
          y:        16,
          duration: dur.base,
          stagger:  { each: 0.1, ease: ease.out },
          ease:     ease.out,
        },
        '-=0.4'
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'var(--black)',
        minHeight:  '100vh',
        display:    'flex',
        alignItems: 'center',
      }}
    >
      {/* ── Word field ────────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        fill="none"
      >
        {WORDS.map((word, i) => {
          const col = i % COLS
          const row = Math.floor(i / COLS)
          const x   = col * COL_W + COL_W / 2
          const y   = row * ROW_H + ROW_H / 2

          return (
            <text
              key={word}
              ref={el => { wordRefs.current[i] = el }}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Josefin Sans', sans-serif"
              fontSize="10"
              letterSpacing="3"
              fill="rgba(234,228,218,1)"
            >
              {word}
            </text>
          )
        })}
      </svg>

      {/* ── Radial grid overlay ───────────────────────────────── */}
      <ThinLineSystem
        variant="minimal"
        color="var(--lav)"
        opacity={0.8}
        className="z-0"
      />

      {/* ── Content ───────────────────────────────────────────── */}
      <div
        className="relative z-10"
        style={{ maxWidth: '840px', margin: '0 auto', padding: '140px 60px' }}
      >
        {/* Eyebrow */}
        <p
          className="t-eyebrow"
          style={{ marginBottom: '36px', color: 'var(--lav)', opacity: 0.55 }}
        >
          02 &nbsp;/&nbsp; Noise
        </p>

        {/* Headline */}
        <h2
          className="t-headline"
          style={{
            fontSize:     'clamp(40px, 5.5vw, 68px)',
            marginBottom: '52px',
            lineHeight:   0.95,
          }}
        >
          <span className="noise-headline-line" style={{ display: 'block' }}>
            Most organizations
          </span>
          <span className="noise-headline-line" style={{ display: 'block' }}>
            are optimizing
          </span>
          <span
            className="noise-headline-line"
            style={{ display: 'block', color: 'var(--tang)' }}
          >
            the wrong thing.
          </span>
        </h2>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            'They measure clicks, not cognition.',
            'Conversions, not comprehension.',
            "They're fluent in noise.",
          ].map(line => (
            <p
              key={line}
              className="noise-body-line t-body"
              style={{ fontSize: '17px', lineHeight: 1.7 }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* ── Vertical divider hint ─────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '1px', background: 'rgba(234,228,218,0.04)' }}
        aria-hidden="true"
      />
    </section>
  )
}
