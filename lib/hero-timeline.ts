/**
 * Hero Timeline Builder — GSAP scroll-driven timeline for the cinematic hero.
 *
 * The hero section pins to the viewport while the user scrolls through
 * the 5-stage sequence. ScrollTrigger scrubs the timeline based on
 * scroll position — no auto-play, the user controls the pace.
 *
 * Scroll distance: 600vh (6 viewport heights of scroll room).
 * Acts 1–5 are the visual sequence, Act 6 is the dissolve → text takeover.
 */

import { gsap, ScrollTrigger, ScrambleTextPlugin } from '@/lib/gsap'
import { dur, ease } from '@/lib/motion-config'
import type { SacredGeometryRefs } from '@/components/hero/SacredGeometrySVG'
import type { NoiseCanvasRefs } from '@/components/hero/NoiseCanvas'
import type { HeroCopyRefs } from '@/components/hero/HeroCopy'
import type { CognitiveBandsRefs } from '@/components/hero/CognitiveBands'

// Ensure plugins are registered
void ScrambleTextPlugin
void ScrollTrigger

export interface TimelineRefs {
  section: HTMLElement
  image: HTMLDivElement
  geometry: SacredGeometryRefs
  noise: NoiseCanvasRefs
  copy: HeroCopyRefs
  bands: CognitiveBandsRefs
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function prepareDrawPaths(container: SVGGElement | null) {
  if (!container) return
  const elements = container.querySelectorAll<SVGGeometryElement>('circle, path, line')
  elements.forEach((el) => {
    try {
      const len = el.getTotalLength()
      el.style.strokeDasharray = `${len}`
      el.style.strokeDashoffset = `${len}`
    } catch {
      el.style.strokeDasharray = '500'
      el.style.strokeDashoffset = '500'
    }
  })
}

function drawOn(
  tl: gsap.core.Timeline,
  container: SVGGElement | null,
  position: string | number,
  duration: number = 1.5,
  stagger: number = 0.03
) {
  if (!container) return
  const elements = container.querySelectorAll<SVGGeometryElement>('.geo-path, .geo-line')
  tl.set(container, { opacity: 1 }, position)
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

// ─── Scroll-Driven Timeline ──────────────────────────────────────────────────
//
// Timeline uses abstract "seconds" as scroll-proportional units.
// Total duration = 14 units → mapped across the full scroll distance.
// Acts 1-5 = visual sequence (11 units), Act 6 = dissolve + text (3 units).

export function buildScrollTimeline(refs: TimelineRefs): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: refs.section,
      start: 'top top',
      end: '+=600%',           // 6 viewport heights of scroll
      pin: true,               // pin the section while scrolling
      scrub: 1,                // smooth scrub with 1s lag
      anticipatePin: 1,        // prevent jump on pin
    },
    defaults: { ease: 'none' }, // linear for scroll — easing fights scrub
  })

  // Prepare all geometry for draw-on
  prepareDrawPaths(refs.geometry.seed)
  prepareDrawPaths(refs.geometry.flower)
  prepareDrawPaths(refs.geometry.metatron)
  prepareDrawPaths(refs.geometry.fibonacci)
  prepareDrawPaths(refs.geometry.mandala)

  // ═══════════════════════════════════════════════════════════════
  // ACT 1 — NOISE (0 – 2)
  // Dark field, grain visible, particles scattered, faint geometry
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('noise', 0)

  // Faint geometry shimmer
  tl.fromTo(
    refs.geometry.seed!,
    { opacity: 0 },
    { opacity: 0.15, duration: 1.5 },
    0.3
  )

  // ═══════════════════════════════════════════════════════════════
  // ACT 2 — EMERGENCE (2 – 4.5)
  // Seed of Life draws, Flower extends, particles converge
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('emergence', 2)

  drawOn(tl, refs.geometry.seed, 2, 1.5, 0.06)
  drawOn(tl, refs.geometry.flower, 3, 1.2, 0.04)

  // Particles converge toward center
  tl.to(
    refs.noise.particles,
    {
      x: 0.5,
      y: 0.5,
      duration: 2,
      stagger: { each: 0.02 },
    },
    2
  )

  // Grain fades
  if (refs.noise.canvas) {
    tl.to(refs.noise.canvas, { opacity: 0, duration: 1.5 }, 3)
  }

  // ═══════════════════════════════════════════════════════════════
  // ACT 3 — PERCEPTION (4.5 – 6.5)
  // Image iris-reveals, geometry recedes
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('perception', 4.5)

  tl.fromTo(
    refs.image,
    { clipPath: 'circle(0% at 50% 50%)' },
    { clipPath: 'circle(75% at 50% 50%)', duration: 2 },
    4.5
  )

  if (refs.geometry.svg) {
    tl.to(refs.geometry.svg, { opacity: 0.08, duration: 1.5 }, 5)
  }

  // ═══════════════════════════════════════════════════════════════
  // ACT 4 — SIGNAL (6.5 – 8.5)
  // Metatron's Cube snaps, typography enters
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('signal', 6.5)

  drawOn(tl, refs.geometry.metatron, 6.5, 0.8, 0.01)

  tl.to(refs.geometry.metatron!, { opacity: 0.04, duration: 1 }, 7.5)

  // ═══════════════════════════════════════════════════════════════
  // ACT 5 — LIVING SYSTEM (8.5 – 11)
  // Fibonacci + Mandala resolve, full reveal, bands
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('living', 8.5)

  drawOn(tl, refs.geometry.fibonacci, 8.5, 1.5, 0)

  tl.to(
    refs.image,
    { clipPath: 'circle(100% at 50% 50%)', duration: 1.5 },
    8.5
  )

  drawOn(tl, refs.geometry.mandala, 9, 1.5, 0.02)

  // Cognitive bands slide in
  if (refs.bands.container) {
    tl.set(refs.bands.container, { opacity: 1 }, 9.5)
    tl.from(
      refs.bands.container.querySelectorAll('.band'),
      {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        stagger: { each: 0.08 },
      },
      9.5
    )
  }

  // All geometry settles to very faint
  if (refs.geometry.svg) {
    tl.to(refs.geometry.svg, { opacity: 0.03, duration: 1.5 }, 9.5)
  }

  // ═══════════════════════════════════════════════════════════════
  // ACT 6 — DISSOLVE / TEXT TAKEOVER (11 – 14)
  // She was the signal. Now the signal is named.
  // Portrait fades to ghost, text rises to take her place.
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('dissolve', 11)

  // Image dissolves to a faint ghost
  tl.to(
    refs.image,
    { opacity: 0.12, duration: 1.5 },
    11
  )

  // Bands fade with the image
  if (refs.bands.container) {
    tl.to(refs.bands.container, { opacity: 0, duration: 1 }, 11)
  }

  // Geometry fades out completely
  if (refs.geometry.svg) {
    tl.to(refs.geometry.svg, { opacity: 0, duration: 1 }, 11)
  }

  // Copy container fades in
  if (refs.copy.container) {
    tl.to(refs.copy.container, { opacity: 1, duration: 0.8 }, 11.5)
  }

  // Eyebrow
  if (refs.copy.eyebrow) {
    tl.fromTo(
      refs.copy.eyebrow,
      { opacity: 0, y: 12 },
      { opacity: 0.5, y: 0, duration: 0.6 },
      11.8
    )
  }

  // Headline — word stagger, rising up
  if (refs.copy.headline) {
    tl.set(refs.copy.headline, { opacity: 1 }, 12)
    tl.from(
      refs.copy.headline.querySelectorAll('.word'),
      {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: { each: 0.08 },
      },
      12
    )
  }

  // Subhead
  if (refs.copy.subhead) {
    tl.fromTo(
      refs.copy.subhead,
      { opacity: 0, y: 20 },
      { opacity: 0.75, y: 0, duration: 0.6 },
      13
    )
  }

  // CTAs
  if (refs.copy.ctas) {
    tl.fromTo(
      refs.copy.ctas,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      13.4
    )
  }

  return tl
}
