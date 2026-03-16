/**
 * Hero Timeline Builder — GSAP scroll-driven timeline for the cinematic hero.
 *
 * 6-act scroll sequence pinned to the viewport.
 * Sacred geometry draws on screen AND simultaneously reveals the headline
 * through an SVG mask — structure literally makes meaning visible.
 *
 * Scroll distance: 600vh (6 viewport heights).
 * Acts 1–5 = visual sequence + progressive text reveal
 * Act 6 = full mask release + image dissolve + CTAs
 */

import { gsap, ScrollTrigger, ScrambleTextPlugin } from '@/lib/gsap'
import type { SacredGeometryRefs } from '@/components/hero/SacredGeometrySVG'
import type { NoiseCanvasRefs } from '@/components/hero/NoiseCanvas'
import type { GeometryRevealTextRefs } from '@/components/hero/GeometryRevealText'
import type { CognitiveBandsRefs } from '@/components/hero/CognitiveBands'

// Ensure plugins are registered
void ScrambleTextPlugin
void ScrollTrigger

export interface TimelineRefs {
  section: HTMLElement
  image: HTMLDivElement
  geometry: SacredGeometryRefs
  noise: NoiseCanvasRefs
  reveal: GeometryRevealTextRefs
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

/** Draw on BOTH the visible geometry AND its mask twin simultaneously */
function drawOnPair(
  tl: gsap.core.Timeline,
  visible: SVGGElement | null,
  mask: SVGGElement | null,
  position: string | number,
  duration: number = 1.5,
  stagger: number = 0.03
) {
  drawOn(tl, visible, position, duration, stagger)
  drawOn(tl, mask, position, duration, stagger)
}

// ─── Scroll-Driven Timeline ──────────────────────────────────────────────────

export function buildScrollTimeline(refs: TimelineRefs): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: refs.section,
      start: 'top top',
      end: '+=600%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
    defaults: { ease: 'none' },
  })

  // Prepare all visible geometry for draw-on
  prepareDrawPaths(refs.geometry.seed)
  prepareDrawPaths(refs.geometry.flower)
  prepareDrawPaths(refs.geometry.metatron)
  prepareDrawPaths(refs.geometry.fibonacci)
  prepareDrawPaths(refs.geometry.mandala)

  // Prepare all mask geometry for draw-on (mirrors visible geometry)
  prepareDrawPaths(refs.reveal.maskSeed)
  prepareDrawPaths(refs.reveal.maskFlower)
  prepareDrawPaths(refs.reveal.maskMetatron)
  prepareDrawPaths(refs.reveal.maskFibonacci)
  prepareDrawPaths(refs.reveal.maskMandala)

  // ═══════════════════════════════════════════════════════════════
  // ACT 1 — NOISE (0 – 2)
  // Dark field, grain visible, faint geometry shimmer
  // Text is present but invisible (mask is black)
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('noise', 0)

  // Faint geometry shimmer — visible geometry only (mask stays hidden)
  tl.fromTo(
    refs.geometry.seed!,
    { opacity: 0 },
    { opacity: 0.15, duration: 1.5 },
    0.3
  )

  // ═══════════════════════════════════════════════════════════════
  // ACT 2 — EMERGENCE (2 – 4.5)
  // Seed + Flower draw on. Text begins to appear through geometry.
  // "Structure starts to form — meaning starts to show."
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('emergence', 2)

  // Draw Seed on both visible + mask (text peeks through seed circles)
  drawOnPair(tl, refs.geometry.seed, refs.reveal.maskSeed, 2, 1.5, 0.06)

  // Draw Flower on both (more text reveals)
  drawOnPair(tl, refs.geometry.flower, refs.reveal.maskFlower, 3, 1.2, 0.04)

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
  // Image iris-reveals behind the geometry+text layers
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('perception', 4.5)

  tl.fromTo(
    refs.image,
    { clipPath: 'circle(0% at 50% 50%)' },
    { clipPath: 'circle(75% at 50% 50%)', duration: 2 },
    4.5
  )

  // Visible geometry recedes as image comes in
  if (refs.geometry.svg) {
    tl.to(refs.geometry.svg, { opacity: 0.08, duration: 1.5 }, 5)
  }

  // ═══════════════════════════════════════════════════════════════
  // ACT 4 — SIGNAL (6.5 – 8.5)
  // Metatron's Cube snaps — more text revealed through the grid
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('signal', 6.5)

  drawOnPair(tl, refs.geometry.metatron, refs.reveal.maskMetatron, 6.5, 0.8, 0.01)

  // Visible Metatron fades to ghost
  tl.to(refs.geometry.metatron!, { opacity: 0.04, duration: 1 }, 7.5)

  // ═══════════════════════════════════════════════════════════════
  // ACT 5 — LIVING SYSTEM (8.5 – 11)
  // Fibonacci + Mandala draw, full image, bands
  // Text now almost fully visible through accumulated geometry
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('living', 8.5)

  drawOnPair(tl, refs.geometry.fibonacci, refs.reveal.maskFibonacci, 8.5, 1.5, 0)

  tl.to(
    refs.image,
    { clipPath: 'circle(100% at 50% 50%)', duration: 1.5 },
    8.5
  )

  drawOnPair(tl, refs.geometry.mandala, refs.reveal.maskMandala, 9, 1.5, 0.02)

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

  // Visible geometry settles to very faint
  if (refs.geometry.svg) {
    tl.to(refs.geometry.svg, { opacity: 0.03, duration: 1.5 }, 9.5)
  }

  // ═══════════════════════════════════════════════════════════════
  // ACT 6 — FULL REVEAL (11 – 14)
  // Mask opens completely. Image dissolves. Text owns the frame.
  // "She was the signal. Now the signal is named."
  // ═══════════════════════════════════════════════════════════════
  tl.addLabel('reveal', 11)

  // Image dissolves to ghost
  tl.to(refs.image, { opacity: 0.12, duration: 1.5 }, 11)

  // Bands fade
  if (refs.bands.container) {
    tl.to(refs.bands.container, { opacity: 0, duration: 1 }, 11)
  }

  // Visible geometry fades out
  if (refs.geometry.svg) {
    tl.to(refs.geometry.svg, { opacity: 0, duration: 1 }, 11)
  }

  // THE MOMENT: mask opens to full white — text fully revealed
  if (refs.reveal.maskReveal) {
    tl.to(
      refs.reveal.maskReveal,
      { opacity: 1, duration: 1.5 },
      11.5
    )
  }

  // CTAs fade in (HTML links)
  tl.fromTo(
    refs.ctas,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.8 },
    12.5
  )

  return tl
}
