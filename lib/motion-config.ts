/**
 * Motion Config — GSAP animation presets for Curiosity Inc.
 *
 * Rule: every animation must feel inevitable, intelligent, calm, precise.
 * No bounce. No spring. No playful easing.
 *
 * Import gsap from lib/gsap (not directly) so plugins stay registered.
 */

import type { gsap } from 'gsap'
type GsapTweenTarget = Parameters<typeof gsap.to>[0]

// ─── Easing ────────────────────────────────────────────────────────────────────

export const ease = {
  /** Standard reveal: fast-in, slow settle */
  out:      'power3.out',
  /** Smooth bidirectional: enters and exits with weight */
  inOut:    'power2.inOut',
  /** Geometry draw: linear feels mechanical, correct for lines */
  draw:     'none',
  /** Signal pulse: sine gives a natural breath */
  pulse:    'sine.inOut',
  /** Orbit rotation: perfectly even */
  orbit:    'none',
} as const

// ─── Durations (seconds) ───────────────────────────────────────────────────────

export const dur = {
  instant:   0.15,  // hover states, micro feedback
  fast:      0.35,  // UI transitions
  base:      0.6,   // standard section reveal
  slow:      0.9,   // headline stagger, geometry draw
  xslow:     1.4,   // complex multi-element sequences
  breath:    4.0,   // pulse / orbit loops
  orbitSlow: 90,    // full 360° rotation, outer ring
  orbitFast: 60,    // full 360° rotation, inner ring
} as const

// ─── Stagger Configs ───────────────────────────────────────────────────────────

export const stagger = {
  /** Line-by-line headline reveal */
  headline: { each: 0.08, ease: ease.out },
  /** List / grid items */
  items:    { each: 0.06, ease: ease.out },
  /** Layer nodes bottom → top */
  layers:   { each: 0.15, from: 'end' as const, ease: ease.out },
  /** Geometry paths */
  paths:    { each: 0.12, ease: ease.out },
} as const

// ─── From/To Presets ───────────────────────────────────────────────────────────
// Use as: gsap.from(el, { ...motion.fadeUp, duration: dur.base })

export const motion = {
  /** Standard element entry: rise + fade */
  fadeUp: {
    opacity: 0,
    y: 24,
    ease: ease.out,
    duration: dur.base,
  },

  /** Subtle: fade only, no movement */
  fade: {
    opacity: 0,
    ease: ease.out,
    duration: dur.base,
  },

  /** SVG stroke draw: requires strokeDasharray/strokeDashoffset set up */
  drawLine: {
    strokeDashoffset: '100%',
    ease: ease.draw,
    duration: dur.slow,
  },

  /** Node pop: scale from center */
  nodeIn: {
    scale: 0,
    opacity: 0,
    transformOrigin: '50% 50%',
    ease: ease.out,
    duration: dur.fast,
  },

  /** Signal pulse loop — apply with repeat: -1, yoyo: true */
  pulse: {
    scale: 1.04,
    opacity: 0.85,
    ease: ease.pulse,
    duration: dur.breath,
    repeat: -1,
    yoyo: true,
  },

  /** Glow expansion on hover */
  glowExpand: {
    filter: 'blur(60px)',
    opacity: 1,
    ease: ease.out,
    duration: dur.instant,
  },
} as const

// ─── ScrollTrigger Defaults ────────────────────────────────────────────────────
// Use as: ScrollTrigger.create({ ...scrollDefaults, trigger: el, ... })

export const scrollDefaults = {
  start:   'top 82%',   // trigger when element top crosses 82% viewport
  end:     'top 20%',
  toggleActions: 'play none none none' as const,
} as const

/** Tighter trigger for small components */
export const scrollTight = {
  ...scrollDefaults,
  start: 'top 90%',
} as const

// ─── Orbital Animation Helper ──────────────────────────────────────────────────
/**
 * Spins an SVG group around its own center.
 * Usage: orbit(myGroupEl, { duration: dur.orbitSlow })
 */
export function orbit(
  target: GsapTweenTarget,
  options: { duration?: number; direction?: 1 | -1 } = {}
) {
  const { gsap } = require('./gsap') // lazy import avoids SSR issues
  const { duration = dur.orbitSlow, direction = 1 } = options

  return gsap.to(target, {
    rotation:       360 * direction,
    transformOrigin: '50% 50%',
    ease:           ease.orbit,
    duration,
    repeat:         -1,
  })
}

// ─── Geometry Draw Helper ──────────────────────────────────────────────────────
/**
 * Animates SVG paths using stroke-dashoffset technique.
 * Call after setting strokeDasharray = el.getTotalLength() on each path.
 *
 * Usage:
 *   const paths = gsap.utils.toArray<SVGPathElement>('path.draw')
 *   preparePaths(paths)
 *   drawPaths(paths, { stagger: stagger.paths })
 */
export function preparePaths(paths: SVGPathElement[]) {
  paths.forEach(path => {
    const len = path.getTotalLength()
    path.style.strokeDasharray  = `${len}`
    path.style.strokeDashoffset = `${len}`
  })
}

export function drawPaths(
  paths: SVGPathElement[],
  options: { stagger?: object; duration?: number } = {}
) {
  const { gsap } = require('./gsap')
  const { stagger: staggerConfig = stagger.paths, duration = dur.slow } = options

  return gsap.to(paths, {
    strokeDashoffset: 0,
    ease:             ease.draw,
    duration,
    stagger:          staggerConfig,
  })
}
