/**
 * Sacred Geometry Path Data — 5-stage cinematic hero sequence.
 *
 * All shapes centered on (400, 400) in viewBox "0 0 800 800".
 * Each stage builds on the previous — additive, not replacement.
 *
 * Discipline mapping:
 *   Seed of Life       → Marketing (planting ideas)
 *   Flower of Life     → UX Design (patterns emerge)
 *   Metatron's Cube    → Instructional Design (structure crystallizes)
 *   Fibonacci Spiral   → Adoption (organic growth)
 *   Mandala            → Culture (complete system)
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate positions on a circle at equal angular intervals */
function hexRing(
  cx: number,
  cy: number,
  r: number,
  count: number
): Array<{ cx: number; cy: number }> {
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
// Extends Seed: adds outer ring at 2R + intermediate petal positions

const flowerOuter = hexRing(400, 400, SEED_R * 2, 6)

// Petal positions: midpoints between adjacent seed ring circles, pushed outward
const flowerPetals: Array<{ cx: number; cy: number }> = []
for (let i = 0; i < 6; i++) {
  const a = seedRing[i]
  const b = seedRing[(i + 1) % 6]
  // Midpoint between two adjacent seed-ring circles
  const mx = (a.cx + b.cx) / 2
  const my = (a.cy + b.cy) / 2
  // Push outward from center by seed radius
  const dx = mx - 400
  const dy = my - 400
  const dist = Math.sqrt(dx * dx + dy * dy)
  const scale = SEED_R / dist
  flowerPetals.push({
    cx: 400 + dx * (1 + scale * 0.42),
    cy: 400 + dy * (1 + scale * 0.42),
  })
}

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
  nodes: [{ cx: 400, cy: 400 }, ...metInner, ...metOuter],
  /** Lines connecting all 13 nodes (78 total) */
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
// Golden spiral using quarter-circle arcs

const PHI = 1.618033988749895

export const fibonacciSpiral = {
  id: 'fibonacci' as const,
  /** SVG path string for the golden spiral */
  path: (() => {
    let size = 8
    let x = 400
    let y = 400
    let d = `M ${x} ${y}`

    // Direction cycle for quarter-turn arcs
    const dirs: [number, number][] = [
      [1, 0],   // right
      [0, 1],   // down
      [-1, 0],  // left
      [0, -1],  // up
    ]

    for (let i = 0; i < 10; i++) {
      const [dx, dy] = dirs[i % 4]
      const endX = x + size * dx
      const endY = y + size * dy
      // sweep-flag alternates for proper spiral direction
      d += ` A ${size} ${size} 0 0 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`
      x = endX
      y = endY
      size *= PHI
    }
    return d
  })(),
}

// ─── Stage 5: Mandala ─────────────────────────────────────────────────────────
// Concentric rings + 12 radial lines — the complete system

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
