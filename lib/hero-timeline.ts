/**
 * Hero Timeline — "Image Through Text" scroll sequence.
 *
 * The headline starts massive (scale 5) — letters so large they're
 * abstract shapes. The hero image is only visible THROUGH the
 * letterforms (background-clip: text). As the user scrolls, the text
 * scales down to readable size, the full image breaks free behind it,
 * and the composition resolves.
 *
 * 4 acts across 500vh of scroll:
 *   1. ABSTRACT  — Giant text on night sky, geometry shimmers
 *   2. FORMATION — Text scales down, image bleeds through letters, geometry draws
 *   3. BREAKOUT  — Image breaks free of text, full reveal, text settles
 *   4. RESOLVE   — Copy completes, bands, system breathes
 */

import { gsap, ScrollTrigger, ScrambleTextPlugin } from '@/lib/gsap'
import type { SacredGeometryRefs } from '@/components/hero/SacredGeometrySVG'
import type { NoiseCanvasRefs } from '@/components/hero/NoiseCanvas'
import type { CognitiveBandsRefs } from '@/components/hero/CognitiveBands'

void ScrambleTextPlugin
void ScrollTrigger

export interface TimelineRefs {
  section: HTMLElement
  fullImage: HTMLDivElement
  textMask: HTMLDivElement
  geometry: SacredGeometryRefs
  noise: NoiseCanvasRefs
  eyebrow: HTMLParagraphElement
  subhead: HTMLParagraphElement
  ctas: HTMLDivElement
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

export function buildScrollTimeline(refs: TimelineRefs): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: refs.section,
      start: 'top top',
      end: '+=500%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
    defaults: { ease: 'none' },
  })

  // Prepare geometry
  prepareDrawPaths(refs.geometry.seed)
  prepareDrawPaths(refs.geometry.flower)
  prepareDrawPaths(refs.geometry.metatron)
  prepareDrawPaths(refs.geometry.fibonacci)
  prepareDrawPaths(refs.geometry.mandala)

  // ═══════════════════════════════════════════════════════════════
  // ACT 1 — ABSTRACT (0 – 3)
  // Giant text (scale 5), night sky behind, faint geometry shimmer
  // Letters are so large they're landscape — abstract shapes
  // The image is already there, but only through the text
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('abstract', 0)

  // Faint geometry shimmer
  tl.fromTo(
    refs.geometry.seed!,
    { opacity: 0 },
    { opacity: 0.15, duration: 2 },
    0.5
  )

  // Text begins scaling down (5 → 3) — letters start resolving
  tl.to(
    refs.textMask,
    { scale: 3, duration: 3 },
    0
  )

  // ═══════════════════════════════════════════════════════════════
  // ACT 2 — FORMATION (3 – 6.5)
  // Text scales 3 → 1.2, geometry draws, image richens in letters
  // You can start reading the text — her face in the letterforms
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('formation', 3)

  // Text continues scaling down
  tl.to(
    refs.textMask,
    { scale: 1.2, duration: 3.5 },
    3
  )

  // Geometry draws on
  drawOn(tl, refs.geometry.seed, 3, 1.5, 0.06)
  drawOn(tl, refs.geometry.flower, 4, 1.2, 0.04)

  // Particles converge
  tl.to(
    refs.noise.particles,
    {
      x: 0.5,
      y: 0.5,
      duration: 2,
      stagger: { each: 0.02 },
    },
    3
  )

  // Night sky fades
  if (refs.noise.canvas) {
    tl.to(refs.noise.canvas, { opacity: 0, duration: 1.5 }, 4.5)
  }

  // Metatron draws late in this act
  drawOn(tl, refs.geometry.metatron, 5, 1, 0.01)

  // ═══════════════════════════════════════════════════════════════
  // ACT 3 — BREAKOUT (6.5 – 9)
  // Image breaks free of the text — full image fades in behind
  // Text settles to scale(1), transitions to solid color
  // The text WAS the window; now the window is the whole viewport
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('breakout', 6.5)

  // Text reaches final scale
  tl.to(
    refs.textMask,
    { scale: 1, duration: 1.5 },
    6.5
  )

  // Full image fades in behind the text
  tl.to(
    refs.fullImage,
    { opacity: 1, duration: 2 },
    6.5
  )

  // Text transitions from image-fill to solid color
  // (the image is now fully visible behind, so text becomes readable overlay)
  tl.to(
    refs.textMask,
    {
      color: 'var(--shell)',
      duration: 1.5,
    },
    7.5
  )

  // Geometry fades as image takes over
  if (refs.geometry.svg) {
    tl.to(refs.geometry.svg, { opacity: 0.04, duration: 1.5 }, 7)
  }

  // Fibonacci draws during breakout
  drawOn(tl, refs.geometry.fibonacci, 7, 1.5, 0)

  // ═══════════════════════════════════════════════════════════════
  // ACT 4 — RESOLVE (9 – 12)
  // Everything settles. Eyebrow, subhead, CTAs fade in.
  // Bands slide. System breathes.
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('resolve', 9)

  // Mandala draws faintly
  drawOn(tl, refs.geometry.mandala, 9, 1.5, 0.02)

  // Geometry settles to ghost
  if (refs.geometry.svg) {
    tl.to(refs.geometry.svg, { opacity: 0.02, duration: 1 }, 10)
  }

  // Eyebrow
  tl.fromTo(
    refs.eyebrow,
    { opacity: 0, y: -8 },
    { opacity: 0.5, y: 0, duration: 0.6 },
    9.2
  )

  // Subhead
  tl.fromTo(
    refs.subhead,
    { opacity: 0, y: 16 },
    { opacity: 0.75, y: 0, duration: 0.6 },
    9.8
  )

  // CTAs
  tl.fromTo(
    refs.ctas,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.5 },
    10.4
  )

  // Cognitive bands
  if (refs.bands.container) {
    tl.set(refs.bands.container, { opacity: 1 }, 10)
    tl.from(
      refs.bands.container.querySelectorAll('.band'),
      {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        stagger: { each: 0.08 },
      },
      10
    )
  }

  return tl
}
