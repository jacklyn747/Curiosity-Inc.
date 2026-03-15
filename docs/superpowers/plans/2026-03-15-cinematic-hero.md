# Cinematic Hero Animation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static HeroSection with a 5-stage cinematic animation sequence that performs the noise-to-signal transformation as a 10-second opening film using sacred geometry, canvas grain, iris reveal, and GSAP timeline orchestration.

**Architecture:** A single orchestrator component (`CinematicHero`) owns a GSAP master timeline with 5 labeled acts. Sub-components render distinct visual layers (canvas noise, SVG geometry, image with clip-path, typography). The orchestrator holds refs into each layer and wires them into the timeline. First-visit gets the full 11s sequence; return visits get a condensed 3s version. `prefers-reduced-motion` skips to final state.

**Tech Stack:** Next.js 16.1.6, React 19, GSAP 3.14.2 (ScrollTrigger, SplitText, ScrambleTextPlugin), TypeScript, Tailwind v4, Canvas API (grain), CSS clip-path (iris reveal), SVG stroke-dashoffset (geometry draw-on)

---

## File Structure

```
components/hero/
  CinematicHero.tsx        — Orchestrator: mounts layers, builds master timeline
  NoiseCanvas.tsx           — Canvas grain/static + scattered particle dots
  SacredGeometrySVG.tsx     — Single SVG containing all 5 geometry stages as <g> groups
  HeroCopy.tsx              — Eyebrow, headline, subhead, dual CTAs (pure markup, refs exposed)
  CognitiveBands.tsx        — 5-color bands at bottom edge (extracted from current hero)

lib/
  sacred-geometry-paths.ts  — Pure data: SVG path strings for Seed of Life, Flower of Life, Metatron's Cube, Fibonacci Spiral, Mandala
  hero-timeline.ts          — Builds the master GSAP timeline from refs; exports buildHeroTimeline()

components/sections/
  HeroSection.tsx           — MODIFIED: becomes a thin wrapper that renders <CinematicHero />
```

**What stays the same:**
- `lib/gsap.ts` — no changes, already registers all needed plugins
- `lib/motion-config.ts` — used for easing/duration tokens (may add a couple hero-specific durations)
- `lib/design-tokens.ts` — colors, layers, geo constants all used as-is
- `components/geo/StarField.tsx` — reused inside the noise stage

---

## Chunk 1: Sacred Geometry Data + SVG Component

### Task 1: Sacred Geometry Path Data

**Files:**
- Create: `lib/sacred-geometry-paths.ts`

The 5 sacred geometry symbols mapped to the behavioral design system:
1. **Seed of Life** (Marketing) — 7 circles, center + 6 at 60deg
2. **Flower of Life** (UX Design) — 19 circles extending Seed pattern
3. **Metatron's Cube** (Instructional Design) — 13 nodes + connecting lines
4. **Fibonacci Spiral** (Adoption) — Golden spiral arc path
5. **Mandala** (Culture) — Concentric rings + radial lines, the complete system

All geometry is centered on (400, 400) in an 800x800 viewBox, using `1px` stroke weight per `geo.lineWeight`.

- [ ] **Step 1: Create sacred geometry path data file**

```typescript
// lib/sacred-geometry-paths.ts
//
// Pure SVG geometry data for the 5-stage cinematic hero sequence.
// All shapes centered on (400, 400) in viewBox "0 0 800 800".
// Each stage builds on the previous — this is additive, not replacement.

/** Helper: generate circle positions for Seed/Flower of Life */
function hexRing(cx: number, cy: number, r: number, count: number): Array<{ cx: number; cy: number }> {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    return {
      cx: cx + r * Math.cos(angle),
      cy: cy + r * Math.sin(angle),
    }
  })
}

// ─── Stage 1: Seed of Life ────────────────────────────────────────────────────
// 7 circles: 1 center + 6 surrounding at radius R, each circle also radius R
const SEED_R = 80
const seedCenter = { cx: 400, cy: 400 }
const seedRing = hexRing(400, 400, SEED_R, 6)

export const seedOfLife = {
  id: 'seed' as const,
  circles: [seedCenter, ...seedRing].map((c) => ({
    cx: c.cx,
    cy: c.cy,
    r: SEED_R,
  })),
}

// ─── Stage 2: Flower of Life ──────────────────────────────────────────────────
// Extends Seed: adds 6 more circles at 2R distance + 6 petal intersections
const flowerOuter = hexRing(400, 400, SEED_R * 2, 6)
const flowerPetals = hexRing(400, 400, SEED_R, 6).map((c, i) => {
  const next = hexRing(400, 400, SEED_R, 6)[(i + 1) % 6]
  return {
    cx: (c.cx + next.cx) / 2 + (400 - (c.cx + next.cx) / 2) * -0.155,
    cy: (c.cy + next.cy) / 2 + (400 - (c.cy + next.cy) / 2) * -0.155,
  }
})

export const flowerOfLife = {
  id: 'flower' as const,
  /** Additional circles beyond seed — only the NEW ones */
  additionalCircles: [
    ...flowerOuter.map((c) => ({ cx: c.cx, cy: c.cy, r: SEED_R })),
    ...flowerPetals.map((c) => ({ cx: c.cx, cy: c.cy, r: SEED_R })),
  ],
}

// ─── Stage 3: Metatron's Cube ─────────────────────────────────────────────────
// 13 nodes (center + inner6 + outer6) connected by lines
const metInner = hexRing(400, 400, SEED_R, 6)
const metOuter = hexRing(400, 400, SEED_R * 2, 6)

export const metatronsCube = {
  id: 'metatron' as const,
  nodes: [
    { cx: 400, cy: 400 }, // center
    ...metInner,
    ...metOuter,
  ],
  /** Lines connecting all 13 nodes to each other (78 lines total) */
  lines: (() => {
    const allNodes = [{ cx: 400, cy: 400 }, ...metInner, ...metOuter]
    const result: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        result.push({
          x1: allNodes[i].cx,
          y1: allNodes[i].cy,
          x2: allNodes[j].cx,
          y2: allNodes[j].cy,
        })
      }
    }
    return result
  })(),
}

// ─── Stage 4: Fibonacci Spiral ────────────────────────────────────────────────
// Golden spiral using quarter-circle arcs, building outward from center
const PHI = 1.618033988749895
const FIB_SQUARES = 10 // number of quarter-turn arcs

export const fibonacciSpiral = {
  id: 'fibonacci' as const,
  /** SVG path string for the spiral */
  path: (() => {
    let size = 8
    let x = 400
    let y = 400
    let d = `M ${x} ${y}`
    // Direction cycle: right, down, left, up
    const dirs = [
      [1, 0, 0, 1],   // sweep right-down
      [0, 1, -1, 0],  // sweep down-left
      [-1, 0, 0, -1], // sweep left-up
      [0, -1, 1, 0],  // sweep up-right
    ]
    for (let i = 0; i < FIB_SQUARES; i++) {
      const [dx, dy] = [dirs[i % 4][0], dirs[i % 4][1]]
      const endX = x + size * dx
      const endY = y + size * dy
      d += ` A ${size} ${size} 0 0 1 ${endX} ${endY}`
      x = endX
      y = endY
      size *= PHI
    }
    return d
  })(),
  /** Bounding arcs for the golden rectangles (optional visual) */
  rectangleGuides: [] as Array<{ x: number; y: number; w: number; h: number }>,
}

// ─── Stage 5: Mandala ─────────────────────────────────────────────────────────
// Concentric rings + 12 radial lines — the complete system breathing
const MANDALA_RINGS = [60, 120, 180, 240, 300, 360]
const MANDALA_RADIALS = 12

export const mandala = {
  id: 'mandala' as const,
  rings: MANDALA_RINGS.map((r) => ({ cx: 400, cy: 400, r })),
  radials: Array.from({ length: MANDALA_RADIALS }, (_, i) => {
    const angle = (Math.PI * 2 * i) / MANDALA_RADIALS
    return {
      x1: 400 + 40 * Math.cos(angle),
      y1: 400 + 40 * Math.sin(angle),
      x2: 400 + 360 * Math.cos(angle),
      y2: 400 + 360 * Math.sin(angle),
    }
  }),
}

// ─── Timing ───────────────────────────────────────────────────────────────────
export const STAGE_TIMING = {
  noise:      { start: 0,   end: 2   },
  emergence:  { start: 2,   end: 4.5 },
  perception: { start: 4.5, end: 6.5 },
  signal:     { start: 6.5, end: 8.5 },
  living:     { start: 8.5, end: 11  },
} as const
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit --strict lib/sacred-geometry-paths.ts 2>&1 | head -20`
Expected: No errors (or only unrelated project errors)

- [ ] **Step 3: Commit**

```bash
git add lib/sacred-geometry-paths.ts
git commit -m "feat(hero): add sacred geometry path data for 5-stage cinematic sequence"
```

---

### Task 2: Sacred Geometry SVG Component

**Files:**
- Create: `components/hero/SacredGeometrySVG.tsx`

Renders all 5 geometry stages as `<g>` groups inside a single SVG. Each group starts hidden (opacity: 0). The parent orchestrator will animate them via refs.

- [ ] **Step 1: Create the SVG component**

```tsx
// components/hero/SacredGeometrySVG.tsx
'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { colors, shellAt } from '@/lib/design-tokens'
import {
  seedOfLife,
  flowerOfLife,
  metatronsCube,
  fibonacciSpiral,
  mandala,
} from '@/lib/sacred-geometry-paths'

export interface SacredGeometryRefs {
  svg: SVGSVGElement | null
  seed: SVGGElement | null
  flower: SVGGElement | null
  metatron: SVGGElement | null
  fibonacci: SVGGElement | null
  mandala: SVGGElement | null
}

export const SacredGeometrySVG = forwardRef<SacredGeometryRefs>(
  function SacredGeometrySVG(_, ref) {
    const svgRef       = useRef<SVGSVGElement>(null)
    const seedRef      = useRef<SVGGElement>(null)
    const flowerRef    = useRef<SVGGElement>(null)
    const metatronRef  = useRef<SVGGElement>(null)
    const fibonacciRef = useRef<SVGGElement>(null)
    const mandalaRef   = useRef<SVGGElement>(null)

    useImperativeHandle(ref, () => ({
      svg:       svgRef.current,
      seed:      seedRef.current,
      flower:    flowerRef.current,
      metatron:  metatronRef.current,
      fibonacci: fibonacciRef.current,
      mandala:   mandalaRef.current,
    }))

    const strokeBase = shellAt[20]     // geometry lines: shell @ 20%
    const strokeAccent = colors.tang   // signal accent

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ zIndex: 2 }}
      >
        {/* Stage 1+2: Seed of Life */}
        <g ref={seedRef} opacity={0}>
          {seedOfLife.circles.map((c, i) => (
            <circle
              key={`seed-${i}`}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              stroke={strokeBase}
              strokeWidth={1}
              className="geo-path"
            />
          ))}
        </g>

        {/* Stage 2: Flower of Life (additional circles) */}
        <g ref={flowerRef} opacity={0}>
          {flowerOfLife.additionalCircles.map((c, i) => (
            <circle
              key={`flower-${i}`}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              stroke={strokeBase}
              strokeWidth={1}
              className="geo-path"
            />
          ))}
        </g>

        {/* Stage 4: Metatron's Cube (lines + nodes) */}
        <g ref={metatronRef} opacity={0}>
          {metatronsCube.lines.map((l, i) => (
            <line
              key={`met-l-${i}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={shellAt[10]}
              strokeWidth={0.5}
              className="geo-line"
            />
          ))}
          {metatronsCube.nodes.map((n, i) => (
            <circle
              key={`met-n-${i}`}
              cx={n.cx}
              cy={n.cy}
              r={3}
              fill={i === 0 ? strokeAccent : strokeBase}
              className="geo-node"
            />
          ))}
        </g>

        {/* Stage 4-5: Fibonacci Spiral */}
        <g ref={fibonacciRef} opacity={0}>
          <path
            d={fibonacciSpiral.path}
            stroke={strokeAccent}
            strokeWidth={1.5}
            strokeLinecap="round"
            fill="none"
            className="geo-path"
          />
        </g>

        {/* Stage 5: Mandala (rings + radials) */}
        <g ref={mandalaRef} opacity={0}>
          {mandala.rings.map((ring, i) => (
            <circle
              key={`mandala-r-${i}`}
              cx={ring.cx}
              cy={ring.cy}
              r={ring.r}
              stroke={shellAt[6]}
              strokeWidth={0.5}
              className="geo-path"
            />
          ))}
          {mandala.radials.map((line, i) => (
            <line
              key={`mandala-l-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={shellAt[6]}
              strokeWidth={0.5}
              className="geo-line"
            />
          ))}
        </g>
      </svg>
    )
  }
)
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/hero/SacredGeometrySVG.tsx
git commit -m "feat(hero): add SacredGeometrySVG with 5-stage geometry groups"
```

---

## Chunk 2: Noise Canvas + Particle System

### Task 3: Canvas Noise/Grain Component

**Files:**
- Create: `components/hero/NoiseCanvas.tsx`

Renders a full-bleed `<canvas>` with:
1. **Film grain** — random pixel noise at `geo.grainOpacity` (4%)
2. **Scattered particles** — ~40 dots that will converge during Stage 2 (positions driven by GSAP via parent)

The canvas runs an animation loop during Stage 1, then freezes once Stage 2 starts.

- [ ] **Step 1: Create the NoiseCanvas component**

```tsx
// components/hero/NoiseCanvas.tsx
'use client'

import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react'
import { geo, colors } from '@/lib/design-tokens'

export interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  r: number
  opacity: number
}

export interface NoiseCanvasRefs {
  canvas: HTMLCanvasElement | null
  particles: Particle[]
  /** Call to start the grain animation loop */
  startGrain: () => void
  /** Call to stop the grain animation loop */
  stopGrain: () => void
}

const PARTICLE_COUNT = 40

/** Generate initial scattered particle positions */
function createParticles(): Particle[] {
  // Pre-seeded positions for deterministic SSR-safe rendering
  const seeds = [
    [0.05, 0.12], [0.92, 0.08], [0.23, 0.87], [0.78, 0.65], [0.15, 0.45],
    [0.88, 0.32], [0.42, 0.91], [0.67, 0.18], [0.31, 0.72], [0.95, 0.55],
    [0.08, 0.68], [0.55, 0.05], [0.72, 0.88], [0.18, 0.25], [0.85, 0.78],
    [0.38, 0.42], [0.62, 0.62], [0.12, 0.92], [0.48, 0.15], [0.78, 0.48],
    [0.25, 0.58], [0.92, 0.22], [0.05, 0.82], [0.68, 0.35], [0.35, 0.08],
    [0.82, 0.92], [0.52, 0.52], [0.15, 0.35], [0.72, 0.72], [0.42, 0.28],
    [0.58, 0.82], [0.28, 0.15], [0.88, 0.58], [0.08, 0.48], [0.65, 0.05],
    [0.32, 0.95], [0.95, 0.42], [0.45, 0.68], [0.18, 0.78], [0.75, 0.25],
  ]
  return seeds.slice(0, PARTICLE_COUNT).map(([sx, sy]) => ({
    x: sx,       // normalized 0-1, will be multiplied by canvas size
    y: sy,
    targetX: 0.5, // center — convergence target
    targetY: 0.5,
    r: 1 + Math.abs(sx - sy) * 2,
    opacity: 0.15 + Math.abs(sx * sy) * 0.35,
  }))
}

export const NoiseCanvas = forwardRef<NoiseCanvasRefs>(
  function NoiseCanvas(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>(createParticles())
    const frameRef = useRef<number>(0)
    const runningRef = useRef(false)

    const renderFrame = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { width, height } = canvas

      // Clear
      ctx.clearRect(0, 0, width, height)

      // Film grain
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data
      const grainAlpha = Math.round(geo.grainOpacity * 255)
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v         // R
        data[i + 1] = v     // G
        data[i + 2] = v     // B
        data[i + 3] = grainAlpha
      }
      ctx.putImageData(imageData, 0, 0)

      // Particles
      const particles = particlesRef.current
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(234, 228, 218, ${p.opacity})`
        ctx.fill()
      }

      if (runningRef.current) {
        frameRef.current = requestAnimationFrame(renderFrame)
      }
    }, [])

    const startGrain = useCallback(() => {
      // Size canvas to container
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
      runningRef.current = true
      renderFrame()
    }, [renderFrame])

    const stopGrain = useCallback(() => {
      runningRef.current = false
      cancelAnimationFrame(frameRef.current)
    }, [])

    useImperativeHandle(ref, () => ({
      canvas: canvasRef.current,
      particles: particlesRef.current,
      startGrain,
      stopGrain,
    }))

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      />
    )
  }
)
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add components/hero/NoiseCanvas.tsx
git commit -m "feat(hero): add NoiseCanvas with film grain and particle system"
```

---

## Chunk 3: Hero Copy + Iris Reveal + Cognitive Bands

### Task 4: HeroCopy Component

**Files:**
- Create: `components/hero/HeroCopy.tsx`

Pure markup layer: eyebrow, headline (word-split), subhead, dual CTAs. All refs exposed to parent for GSAP animation.

- [ ] **Step 1: Create the HeroCopy component**

```tsx
// components/hero/HeroCopy.tsx
'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import Link from 'next/link'

export interface HeroCopyRefs {
  container: HTMLDivElement | null
  eyebrow: HTMLParagraphElement | null
  headline: HTMLHeadingElement | null
  subhead: HTMLParagraphElement | null
  ctas: HTMLDivElement | null
}

const HEADLINE_WORDS = ['Strong', 'Opinions', 'Turn', 'Theory', 'into', 'Culture.']

export const HeroCopy = forwardRef<HeroCopyRefs>(
  function HeroCopy(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const eyebrowRef   = useRef<HTMLParagraphElement>(null)
    const headlineRef  = useRef<HTMLHeadingElement>(null)
    const subheadRef   = useRef<HTMLParagraphElement>(null)
    const ctasRef      = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      container: containerRef.current,
      eyebrow:   eyebrowRef.current,
      headline:  headlineRef.current,
      subhead:   subheadRef.current,
      ctas:      ctasRef.current,
    }))

    return (
      <div
        ref={containerRef}
        className="relative z-30 flex flex-col items-center justify-end flex-1 px-6 text-center"
        style={{ paddingTop: '100px', paddingBottom: '140px' }}
      >
        {/* Eyebrow — ScrambleText target */}
        <p
          ref={eyebrowRef}
          className="t-eyebrow mb-8"
          style={{ letterSpacing: '0.32em', opacity: 0 }}
        >
          Behavioral Design Studio
        </p>

        {/* Headline — word stagger */}
        <h1
          ref={headlineRef}
          className="t-headline"
          style={{
            fontSize: 'clamp(52px, 8vw, 96px)',
            letterSpacing: '-0.01em',
            lineHeight: 0.93,
            maxWidth: '900px',
            opacity: 0,
          }}
        >
          {HEADLINE_WORDS.map((word) => (
            <span
              key={word}
              className="word"
              style={{ display: 'inline-block', marginRight: '0.28em' }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subhead */}
        <p
          ref={subheadRef}
          className="t-body mt-8"
          style={{
            fontSize: '17px',
            maxWidth: '520px',
            lineHeight: 1.6,
            opacity: 0,
            textShadow: '0 1px 12px rgba(29,29,27,0.9)',
          }}
        >
          Cognitive Design Systems for Intellectual Creators.
        </p>

        {/* Dual CTAs */}
        <div
          ref={ctasRef}
          className="mt-12 flex items-center gap-8"
          style={{ opacity: 0 }}
        >
          <Link
            href="/framework"
            className="t-eyebrow inline-flex items-center gap-2"
            style={{
              color: 'var(--tang)',
              fontSize: '11px',
              textDecoration: 'none',
            }}
          >
            Explore Framework
            <span style={{ display: 'inline-block' }}>→</span>
          </Link>
          <Link
            href="/the-accidental-educator"
            className="t-eyebrow inline-flex items-center gap-2"
            style={{
              color: 'rgba(234,228,218,0.45)',
              fontSize: '11px',
              textDecoration: 'none',
            }}
          >
            See Who This Is For
            <span style={{ display: 'inline-block' }}>→</span>
          </Link>
        </div>
      </div>
    )
  }
)
```

- [ ] **Step 2: Commit**

```bash
git add components/hero/HeroCopy.tsx
git commit -m "feat(hero): add HeroCopy component with word-split headline and dual CTAs"
```

---

### Task 5: CognitiveBands Component

**Files:**
- Create: `components/hero/CognitiveBands.tsx`

Extracted from current HeroSection — the 5 cognitive bands at the bottom edge.

- [ ] **Step 1: Create CognitiveBands**

```tsx
// components/hero/CognitiveBands.tsx
'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { layers } from '@/lib/design-tokens'

export interface CognitiveBandsRefs {
  container: HTMLDivElement | null
}

export const CognitiveBands = forwardRef<CognitiveBandsRefs>(
  function CognitiveBands(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      container: containerRef.current,
    }))

    return (
      <div
        ref={containerRef}
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col"
        aria-hidden="true"
        style={{ opacity: 0 }}
      >
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className="band w-full"
            style={{
              height: '3px',
              backgroundColor: layer.color,
              opacity: 0.75,
            }}
          />
        ))}
      </div>
    )
  }
)
```

- [ ] **Step 2: Commit**

```bash
git add components/hero/CognitiveBands.tsx
git commit -m "feat(hero): extract CognitiveBands from HeroSection"
```

---

## Chunk 4: Master Timeline + Orchestrator

### Task 6: Hero Timeline Builder

**Files:**
- Create: `lib/hero-timeline.ts`

Pure function that takes all refs and returns a configured GSAP timeline. This is where the 5-act structure lives.

- [ ] **Step 1: Create the timeline builder**

```typescript
// lib/hero-timeline.ts
//
// Builds the master GSAP timeline for the cinematic hero.
// Pure function — receives refs, returns timeline.
// Does NOT import React. Does NOT touch the DOM directly.

import { gsap, ScrambleTextPlugin } from '@/lib/gsap'
import { dur, ease } from '@/lib/motion-config'
import { colors, shellAt } from '@/lib/design-tokens'
import { STAGE_TIMING } from '@/lib/sacred-geometry-paths'
import type { SacredGeometryRefs } from '@/components/hero/SacredGeometrySVG'
import type { NoiseCanvasRefs } from '@/components/hero/NoiseCanvas'
import type { HeroCopyRefs } from '@/components/hero/HeroCopy'
import type { CognitiveBandsRefs } from '@/components/hero/CognitiveBands'

// Ensure ScrambleText is available (already registered in lib/gsap.ts)
void ScrambleTextPlugin

interface TimelineRefs {
  section: HTMLElement
  image: HTMLDivElement
  geometry: SacredGeometryRefs
  noise: NoiseCanvasRefs
  copy: HeroCopyRefs
  bands: CognitiveBandsRefs
}

/**
 * Prepare SVG paths for stroke-dashoffset draw-on animation.
 * Sets dasharray = total length, dashoffset = total length (fully hidden).
 */
function prepareDrawPaths(container: SVGGElement | null) {
  if (!container) return
  const paths = container.querySelectorAll<SVGGeometryElement>('circle, path, line')
  paths.forEach((el) => {
    const len = el.getTotalLength?.() ?? 500
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
  })
}

/**
 * Animate stroke-dashoffset to 0 (draw-on).
 */
function drawOn(
  tl: GSAPTimeline,
  container: SVGGElement | null,
  position: string | number,
  duration: number = 1.5,
  stagger: number = 0.03
) {
  if (!container) return
  const elements = container.querySelectorAll<SVGGeometryElement>('circle, path, line')
  // First, show the group
  tl.set(container, { opacity: 1 }, position)
  // Then draw
  tl.to(
    elements,
    {
      strokeDashoffset: 0,
      duration,
      ease: 'none',
      stagger: { each: stagger },
    },
    position
  )
}

export function buildHeroTimeline(refs: TimelineRefs): GSAPTimeline {
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: ease.out },
  })

  // ─── Prepare all geometry for draw-on ─────────────────────────
  prepareDrawPaths(refs.geometry.seed)
  prepareDrawPaths(refs.geometry.flower)
  prepareDrawPaths(refs.geometry.metatron)
  prepareDrawPaths(refs.geometry.fibonacci)
  prepareDrawPaths(refs.geometry.mandala)

  // ══════════════════════════════════════════════════════════════
  // ACT 1 — NOISE (0s – 2s)
  // Dark field, grain running, particles scattered
  // ══════════════════════════════════════════════════════════════
  tl.addLabel('noise', 0)

  // Grain canvas starts automatically (handled in component mount)
  // Faint broken geometry fragments shimmer
  tl.fromTo(
    refs.geometry.seed,
    { opacity: 0 },
    { opacity: 0.15, duration: 1.5, ease: 'sine.inOut' },
    0.3
  )

  // ══════════════════════════════════════════════════════════════
  // ACT 2 — EMERGENCE (2s – 4.5s)
  // Seed of Life draws, Flower extends, particles converge
  // ══════════════════════════════════════════════════════════════
  tl.addLabel('emergence', 2)

  // Seed of Life: full draw-on
  drawOn(tl, refs.geometry.seed, 2, 1.5, 0.06)

  // Flower of Life extends
  drawOn(tl, refs.geometry.flower, 3, 1.2, 0.04)

  // Particles converge toward center (animate x/y on each particle)
  // This is done via the noise canvas ref — parent will animate particle positions
  tl.to(
    refs.noise.particles,
    {
      x: 0.5,
      y: 0.5,
      duration: 2,
      ease: 'power2.inOut',
      stagger: { each: 0.02 },
    },
    2
  )

  // Grain fades
  if (refs.noise.canvas) {
    tl.to(
      refs.noise.canvas,
      { opacity: 0, duration: 1.5, ease: 'power2.out' },
      3
    )
  }

  // ══════════════════════════════════════════════════════════════
  // ACT 3 — PERCEPTION (4.5s – 6.5s)
  // Image iris-reveals via clip-path, geometry sharpens
  // ══════════════════════════════════════════════════════════════
  tl.addLabel('perception', 4.5)

  // Iris reveal: clip-path circle() grows from 0% to 100%
  tl.fromTo(
    refs.image,
    { clipPath: 'circle(0% at 50% 50%)' },
    {
      clipPath: 'circle(75% at 50% 50%)',
      duration: 2,
      ease: 'power3.inOut',
    },
    4.5
  )

  // Geometry fades to background as image appears
  if (refs.geometry.svg) {
    tl.to(
      refs.geometry.svg,
      { opacity: 0.08, duration: 1.5, ease: 'power2.out' },
      5
    )
  }

  // ══════════════════════════════════════════════════════════════
  // ACT 4 — SIGNAL (6.5s – 8.5s)
  // Metatron's Cube snaps in, typography enters
  // ══════════════════════════════════════════════════════════════
  tl.addLabel('signal', 6.5)

  // Metatron's Cube: lines snap
  drawOn(tl, refs.geometry.metatron, 6.5, 0.8, 0.01)

  // Quick flash: Metatron appears then fades
  tl.to(
    refs.geometry.metatron,
    { opacity: 0.04, duration: 1, ease: 'power2.out' },
    7.5
  )

  // Eyebrow — ScrambleText
  if (refs.copy.eyebrow) {
    tl.set(refs.copy.eyebrow, { opacity: 1 }, 6.8)
    tl.to(
      refs.copy.eyebrow,
      {
        duration: 1.2,
        scrambleText: {
          text: 'Behavioral Design Studio',
          chars: 'upperCase',
          speed: 0.4,
          revealDelay: 0.3,
        },
      },
      6.8
    )
  }

  // Headline — word stagger
  if (refs.copy.headline) {
    tl.set(refs.copy.headline, { opacity: 1 }, 7.2)
    tl.from(
      refs.copy.headline.querySelectorAll('.word'),
      {
        opacity: 0,
        y: 32,
        duration: dur.slow,
        stagger: { each: 0.07, ease: ease.out },
      },
      7.2
    )
  }

  // Subhead — fade up
  if (refs.copy.subhead) {
    tl.fromTo(
      refs.copy.subhead,
      { opacity: 0, y: 16 },
      { opacity: 0.75, y: 0, duration: dur.base },
      7.8
    )
  }

  // CTAs — fade in
  if (refs.copy.ctas) {
    tl.fromTo(
      refs.copy.ctas,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: dur.fast },
      8.2
    )
  }

  // ══════════════════════════════════════════════════════════════
  // ACT 5 — LIVING SYSTEM (8.5s – 11s)
  // Fibonacci + Mandala resolve, image fully revealed, system breathes
  // ══════════════════════════════════════════════════════════════
  tl.addLabel('living', 8.5)

  // Fibonacci spiral draws
  drawOn(tl, refs.geometry.fibonacci, 8.5, 1.5, 0)

  // Image fully revealed
  tl.to(
    refs.image,
    {
      clipPath: 'circle(100% at 50% 50%)',
      duration: 1.5,
      ease: 'power2.out',
    },
    8.5
  )

  // Mandala fades in
  drawOn(tl, refs.geometry.mandala, 9, 1.5, 0.02)

  // Cognitive bands slide in
  if (refs.bands.container) {
    tl.set(refs.bands.container, { opacity: 1 }, 9.5)
    tl.from(
      refs.bands.container.querySelectorAll('.band'),
      {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: dur.base,
        stagger: { each: 0.08, ease: ease.out },
      },
      9.5
    )
  }

  // All geometry settles to very faint
  if (refs.geometry.svg) {
    tl.to(
      refs.geometry.svg,
      { opacity: 0.03, duration: 1.5, ease: 'power2.out' },
      9.5
    )
  }

  return tl
}

/**
 * Condensed version for return visits.
 * Skips to perception stage and runs the rest quickly.
 */
export function buildCondensedTimeline(refs: TimelineRefs): GSAPTimeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: ease.out } })

  // Image reveals immediately
  tl.fromTo(
    refs.image,
    { clipPath: 'circle(0% at 50% 50%)' },
    { clipPath: 'circle(100% at 50% 50%)', duration: 1.5, ease: 'power3.inOut' },
    0
  )

  // Typography enters
  if (refs.copy.eyebrow) {
    tl.fromTo(refs.copy.eyebrow, { opacity: 0 }, { opacity: 0.5, duration: 0.5 }, 0.5)
  }
  if (refs.copy.headline) {
    tl.set(refs.copy.headline, { opacity: 1 }, 0.8)
    tl.from(
      refs.copy.headline.querySelectorAll('.word'),
      { opacity: 0, y: 20, duration: 0.6, stagger: { each: 0.04 } },
      0.8
    )
  }
  if (refs.copy.subhead) {
    tl.fromTo(refs.copy.subhead, { opacity: 0, y: 10 }, { opacity: 0.75, y: 0, duration: 0.5 }, 1.2)
  }
  if (refs.copy.ctas) {
    tl.fromTo(refs.copy.ctas, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5)
  }

  // Bands
  if (refs.bands.container) {
    tl.set(refs.bands.container, { opacity: 1 }, 1.5)
    tl.from(
      refs.bands.container.querySelectorAll('.band'),
      { scaleX: 0, transformOrigin: 'left center', duration: 0.5, stagger: { each: 0.06 } },
      1.5
    )
  }

  return tl
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit 2>&1 | head -30`

- [ ] **Step 3: Commit**

```bash
git add lib/hero-timeline.ts
git commit -m "feat(hero): add master timeline builder with 5-act cinematic sequence"
```

---

### Task 7: CinematicHero Orchestrator

**Files:**
- Create: `components/hero/CinematicHero.tsx`

The main component. Mounts all layers, gathers refs, calls `buildHeroTimeline()`, handles first-visit vs return, and respects `prefers-reduced-motion`.

- [ ] **Step 1: Create the orchestrator**

```tsx
// components/hero/CinematicHero.tsx
'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { SacredGeometrySVG, type SacredGeometryRefs } from './SacredGeometrySVG'
import { NoiseCanvas, type NoiseCanvasRefs } from './NoiseCanvas'
import { HeroCopy, type HeroCopyRefs } from './HeroCopy'
import { CognitiveBands, type CognitiveBandsRefs } from './CognitiveBands'
import { buildHeroTimeline, buildCondensedTimeline } from '@/lib/hero-timeline'

const SESSION_KEY = 'curiosity-hero-seen'

export function CinematicHero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const imageRef    = useRef<HTMLDivElement>(null)
  const geometryRef = useRef<SacredGeometryRefs>(null)
  const noiseRef    = useRef<NoiseCanvasRefs>(null)
  const copyRef     = useRef<HeroCopyRefs>(null)
  const bandsRef    = useRef<CognitiveBandsRefs>(null)

  useEffect(() => {
    const section  = sectionRef.current
    const image    = imageRef.current
    const geometry = geometryRef.current
    const noise    = noiseRef.current
    const copy     = copyRef.current
    const bands    = bandsRef.current

    if (!section || !image || !geometry || !noise || !copy || !bands) return

    // ── Reduced motion: skip to final state ───────────────────
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      gsap.set(image, { clipPath: 'circle(100% at 50% 50%)' })
      if (copy.eyebrow)  gsap.set(copy.eyebrow, { opacity: 0.5 })
      if (copy.headline) gsap.set(copy.headline, { opacity: 1 })
      if (copy.subhead)  gsap.set(copy.subhead, { opacity: 0.75 })
      if (copy.ctas)     gsap.set(copy.ctas, { opacity: 1 })
      if (bands.container) gsap.set(bands.container, { opacity: 1 })
      return
    }

    // ── First visit vs return ─────────────────────────────────
    const isFirstVisit = !sessionStorage.getItem(SESSION_KEY)

    const refs = { section, image, geometry, noise, copy, bands }

    let tl: GSAPTimeline

    if (isFirstVisit) {
      // Start grain animation
      noise.startGrain()

      tl = buildHeroTimeline(refs)
      tl.play()

      // Mark as seen
      sessionStorage.setItem(SESSION_KEY, '1')

      // Stop grain when it fades out (~4s)
      tl.call(() => noise.stopGrain(), [], 4)
    } else {
      // Condensed: no grain, no geometry ceremony
      gsap.set(noise.canvas, { opacity: 0 })
      tl = buildCondensedTimeline(refs)
      tl.play()
    }

    // ── Breathing loop after timeline completes ───────────────
    tl.call(() => {
      // Slow image breathe
      gsap.to(image, {
        scale: 1.04,
        ease: 'sine.inOut',
        duration: 8,
        repeat: -1,
        yoyo: true,
      })
    }, [], tl.duration())

    return () => {
      tl.kill()
      noise.stopGrain()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero"
      style={{ backgroundColor: 'var(--black)' }}
    >
      {/* Layer 0: Canvas noise/grain */}
      <NoiseCanvas ref={noiseRef} />

      {/* Layer 1: Sacred geometry */}
      <SacredGeometrySVG ref={geometryRef} />

      {/* Layer 2: Hero image with iris reveal */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          clipPath: 'circle(0% at 50% 50%)',
          transformOrigin: 'center center',
          zIndex: 3,
        }}
      >
        <Image
          src="/images/CosmicHeroCuriosityInc.png"
          alt="Curiosity Inc — signal emerging from noise"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(29,29,27,0.60) 0%,
                rgba(29,29,27,0.05) 25%,
                rgba(29,29,27,0.30) 55%,
                rgba(29,29,27,0.85) 100%
              )
            `,
          }}
        />
      </div>

      {/* Layer 3: Typography */}
      <HeroCopy ref={copyRef} />

      {/* Layer 4: Cognitive bands */}
      <CognitiveBands ref={bandsRef} />
    </section>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit 2>&1 | head -30`

- [ ] **Step 3: Commit**

```bash
git add components/hero/CinematicHero.tsx
git commit -m "feat(hero): add CinematicHero orchestrator with 5-act timeline"
```

---

### Task 8: Wire HeroSection to CinematicHero

**Files:**
- Modify: `components/sections/HeroSection.tsx`

Replace the entire static hero implementation with a thin wrapper that renders `<CinematicHero />`.

- [ ] **Step 1: Update HeroSection**

Replace the entire file content with:

```tsx
// components/sections/HeroSection.tsx
'use client'

import { CinematicHero } from '@/components/hero/CinematicHero'

/**
 * HeroSection
 *
 * Cinematic 5-stage animation sequence:
 *   Noise → Emergence → Perception → Signal → Living System
 *
 * Full animation on first visit (11s), condensed on return (3s).
 * Respects prefers-reduced-motion.
 */
export function HeroSection() {
  return <CinematicHero />
}
```

- [ ] **Step 2: Run dev server and verify no errors**

Run: `cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit 2>&1 | head -30`

- [ ] **Step 3: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "feat(hero): wire HeroSection to CinematicHero orchestrator"
```

---

## Chunk 5: Polish, Mobile, and Testing

### Task 9: Mobile Compression

**Files:**
- Modify: `lib/hero-timeline.ts` — add mobile-aware timing
- Modify: `components/hero/CinematicHero.tsx` — pass viewport info

On mobile (< 768px), the sequence compresses to 3 stages in 7 seconds:
- Merge Noise+Emergence into 1 fast stage
- Perception + Signal combine
- Living System stays

- [ ] **Step 1: Add mobile timeline variant to hero-timeline.ts**

Add after `buildCondensedTimeline`:

```typescript
/**
 * Mobile version: 3 stages in ~7s.
 * Noise+Emergence merged, Perception+Signal merged, Living System.
 */
export function buildMobileTimeline(refs: TimelineRefs): GSAPTimeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: ease.out } })

  // Prepare geometry
  prepareDrawPaths(refs.geometry.seed)

  // Stage 1 (0–2.5s): Noise into Emergence
  tl.addLabel('noise-emergence', 0)

  // Seed draws quickly
  drawOn(tl, refs.geometry.seed, 0, 1.2, 0.04)

  // Grain fades
  if (refs.noise.canvas) {
    tl.to(refs.noise.canvas, { opacity: 0, duration: 1, ease: 'power2.out' }, 1.5)
  }

  // Stage 2 (2.5–5s): Perception + Signal
  tl.addLabel('perception-signal', 2.5)

  tl.fromTo(
    refs.image,
    { clipPath: 'circle(0% at 50% 50%)' },
    { clipPath: 'circle(100% at 50% 50%)', duration: 2, ease: 'power3.inOut' },
    2.5
  )

  // Geometry fades
  if (refs.geometry.svg) {
    tl.to(refs.geometry.svg, { opacity: 0.03, duration: 1 }, 3)
  }

  // Typography
  if (refs.copy.eyebrow) {
    tl.fromTo(refs.copy.eyebrow, { opacity: 0 }, { opacity: 0.5, duration: 0.5 }, 3.5)
  }
  if (refs.copy.headline) {
    tl.set(refs.copy.headline, { opacity: 1 }, 3.8)
    tl.from(
      refs.copy.headline.querySelectorAll('.word'),
      { opacity: 0, y: 24, duration: 0.5, stagger: { each: 0.05 } },
      3.8
    )
  }
  if (refs.copy.subhead) {
    tl.fromTo(refs.copy.subhead, { opacity: 0, y: 10 }, { opacity: 0.75, y: 0, duration: 0.4 }, 4.5)
  }
  if (refs.copy.ctas) {
    tl.fromTo(refs.copy.ctas, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 4.8)
  }

  // Stage 3 (5–7s): Living System
  tl.addLabel('living', 5)

  if (refs.bands.container) {
    tl.set(refs.bands.container, { opacity: 1 }, 5.5)
    tl.from(
      refs.bands.container.querySelectorAll('.band'),
      { scaleX: 0, transformOrigin: 'left center', duration: 0.5, stagger: { each: 0.06 } },
      5.5
    )
  }

  return tl
}
```

- [ ] **Step 2: Update CinematicHero to detect mobile**

Add mobile detection in the useEffect, after the reduced-motion check:

```typescript
const isMobile = window.innerWidth < 768

// Then in the isFirstVisit branch:
if (isMobile) {
  noise.startGrain()
  tl = buildMobileTimeline(refs)
  tl.play()
  sessionStorage.setItem(SESSION_KEY, '1')
  tl.call(() => noise.stopGrain(), [], 2.5)
} else if (isFirstVisit) {
  // ... existing full timeline
}
```

- [ ] **Step 3: Verify**

Run: `cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit 2>&1 | head -30`

- [ ] **Step 4: Commit**

```bash
git add lib/hero-timeline.ts components/hero/CinematicHero.tsx
git commit -m "feat(hero): add mobile-compressed 3-stage timeline variant"
```

---

### Task 10: Visual QA + Cleanup

- [ ] **Step 1: Start dev server and test**

```bash
cd /Users/gingerninja/Sites/curiosity-inc && npm run dev
```

Test checklist:
- Full animation plays on first visit (desktop)
- Return visit shows condensed version
- `prefers-reduced-motion` shows final state immediately
- Mobile viewport (< 768px) plays compressed 3-stage version
- No TypeScript errors
- No console errors
- Image loads with priority
- Bands appear at bottom
- Typography is legible over image
- Breathing loop starts after animation completes

- [ ] **Step 2: Clear sessionStorage to re-test first visit**

In browser console: `sessionStorage.removeItem('curiosity-hero-seen')`

- [ ] **Step 3: Fix any visual issues found**

Likely adjustments:
- Geometry opacity levels (too bright / too faint)
- Iris reveal timing (too fast / too slow)
- ScrambleText speed
- Particle convergence feel

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(hero): cinematic hero v1 — 5-stage noise-to-signal animation sequence

Implements the full cinematic hero with sacred geometry, canvas grain,
iris reveal, ScrambleText typography, and GSAP master timeline.

- First visit: 11s full sequence (Noise → Emergence → Perception → Signal → Living System)
- Return visit: 3s condensed version
- Mobile: 7s compressed 3-stage version
- prefers-reduced-motion: instant final state
- Sacred geometry: Seed of Life → Flower of Life → Metatron's Cube → Fibonacci Spiral → Mandala"
```

---

## Summary of deliverables

| # | File | Purpose |
|---|------|---------|
| 1 | `lib/sacred-geometry-paths.ts` | SVG path data for 5 sacred geometry stages |
| 2 | `components/hero/SacredGeometrySVG.tsx` | Single SVG with 5 animated geometry groups |
| 3 | `components/hero/NoiseCanvas.tsx` | Canvas grain + particle system |
| 4 | `components/hero/HeroCopy.tsx` | Typography layer with exposed refs |
| 5 | `components/hero/CognitiveBands.tsx` | 5-color bands extracted from old hero |
| 6 | `lib/hero-timeline.ts` | Master GSAP timeline builder (full + condensed + mobile) |
| 7 | `components/hero/CinematicHero.tsx` | Orchestrator component |
| 8 | `components/sections/HeroSection.tsx` | Thin wrapper (modified) |
