/**
 * Hero Timeline Builder — GSAP master timeline for the cinematic hero.
 *
 * Pure function: receives refs, returns timeline.
 * Does NOT import React. Does NOT touch the DOM directly.
 *
 * Three variants:
 *   buildHeroTimeline()     — Full 11s sequence (first visit, desktop)
 *   buildCondensedTimeline() — 3s quick version (return visit)
 *   buildMobileTimeline()   — 7s compressed version (mobile first visit)
 */

import { gsap, ScrambleTextPlugin } from '@/lib/gsap'
import { dur, ease } from '@/lib/motion-config'
import type { SacredGeometryRefs } from '@/components/hero/SacredGeometrySVG'
import type { NoiseCanvasRefs } from '@/components/hero/NoiseCanvas'
import type { HeroCopyRefs } from '@/components/hero/HeroCopy'
import type { CognitiveBandsRefs } from '@/components/hero/CognitiveBands'

// Ensure ScrambleText is registered (imported from lib/gsap.ts)
void ScrambleTextPlugin

export interface TimelineRefs {
  section: HTMLElement
  image: HTMLDivElement
  geometry: SacredGeometryRefs
  noise: NoiseCanvasRefs
  copy: HeroCopyRefs
  bands: CognitiveBandsRefs
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Prepare SVG elements for stroke-dashoffset draw-on animation.
 */
function prepareDrawPaths(container: SVGGElement | null) {
  if (!container) return
  const elements = container.querySelectorAll<SVGGeometryElement>('circle, path, line')
  elements.forEach((el) => {
    try {
      const len = el.getTotalLength()
      el.style.strokeDasharray = `${len}`
      el.style.strokeDashoffset = `${len}`
    } catch {
      // Some elements (filled circles used as nodes) don't support getTotalLength
      el.style.strokeDasharray = '500'
      el.style.strokeDashoffset = '500'
    }
  })
}

/**
 * Animate stroke-dashoffset to 0 (draw-on) within a timeline.
 */
function drawOn(
  tl: gsap.core.Timeline,
  container: SVGGElement | null,
  position: string | number,
  duration: number = 1.5,
  stagger: number = 0.03
) {
  if (!container) return
  const elements = container.querySelectorAll<SVGGeometryElement>('.geo-path, .geo-line')
  // Show the group
  tl.set(container, { opacity: 1 }, position)
  // Draw elements in
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

// ─── Full Timeline (Desktop, First Visit) ─────────────────────────────────────

export function buildHeroTimeline(refs: TimelineRefs): gsap.core.Timeline {
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: ease.out },
  })

  // Prepare all geometry for draw-on
  prepareDrawPaths(refs.geometry.seed)
  prepareDrawPaths(refs.geometry.flower)
  prepareDrawPaths(refs.geometry.metatron)
  prepareDrawPaths(refs.geometry.fibonacci)
  prepareDrawPaths(refs.geometry.mandala)

  // ═══════════════════════════════════════════════════════════════
  // ACT 1 — NOISE (0s – 2s)
  // Dark field, grain running, particles scattered, faint geometry
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('noise', 0)

  // Faint geometry shimmer
  tl.fromTo(
    refs.geometry.seed!,
    { opacity: 0 },
    { opacity: 0.15, duration: 1.5, ease: 'sine.inOut' },
    0.3
  )

  // ═══════════════════════════════════════════════════════════════
  // ACT 2 — EMERGENCE (2s – 4.5s)
  // Seed of Life draws, Flower extends, particles converge
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('emergence', 2)

  // Seed of Life: full draw-on
  drawOn(tl, refs.geometry.seed, 2, 1.5, 0.06)

  // Flower of Life extends
  drawOn(tl, refs.geometry.flower, 3, 1.2, 0.04)

  // Particles converge toward center
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

  // ═══════════════════════════════════════════════════════════════
  // ACT 3 — PERCEPTION (4.5s – 6.5s)
  // Image iris-reveals, geometry recedes
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('perception', 4.5)

  // Iris reveal: clip-path circle() grows
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

  // Geometry fades to background
  if (refs.geometry.svg) {
    tl.to(
      refs.geometry.svg,
      { opacity: 0.08, duration: 1.5, ease: 'power2.out' },
      5
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // ACT 4 — SIGNAL (6.5s – 8.5s)
  // Metatron's Cube snaps, typography enters
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('signal', 6.5)

  // Metatron's Cube lines snap in fast
  drawOn(tl, refs.geometry.metatron, 6.5, 0.8, 0.01)

  // Quick flash then fade
  tl.to(
    refs.geometry.metatron!,
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

  // ═══════════════════════════════════════════════════════════════
  // ACT 5 — LIVING SYSTEM (8.5s – 11s)
  // Fibonacci + Mandala resolve, full reveal, system breathes
  // ═══════════════════════════════════════════════════════════════
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

// ─── Condensed Timeline (Return Visit) ────────────────────────────────────────

export function buildCondensedTimeline(refs: TimelineRefs): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: ease.out } })

  // Image reveals immediately
  tl.fromTo(
    refs.image,
    { clipPath: 'circle(0% at 50% 50%)' },
    { clipPath: 'circle(100% at 50% 50%)', duration: 1.5, ease: 'power3.inOut' },
    0
  )

  // Typography
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
    tl.fromTo(
      refs.copy.subhead,
      { opacity: 0, y: 10 },
      { opacity: 0.75, y: 0, duration: 0.5 },
      1.2
    )
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

// ─── Mobile Timeline (First Visit, < 768px) ──────────────────────────────────

export function buildMobileTimeline(refs: TimelineRefs): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: ease.out } })

  // Prepare geometry
  prepareDrawPaths(refs.geometry.seed)

  // Stage 1 (0–2.5s): Noise into Emergence
  tl.addLabel('noise-emergence', 0)
  drawOn(tl, refs.geometry.seed, 0, 1.2, 0.04)

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
    tl.fromTo(
      refs.copy.subhead,
      { opacity: 0, y: 10 },
      { opacity: 0.75, y: 0, duration: 0.4 },
      4.5
    )
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
