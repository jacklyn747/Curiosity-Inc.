/**
 * Design Tokens — JS mirror of globals.css custom properties.
 *
 * Use these anywhere CSS vars can't reach:
 *   - GSAP tween targets
 *   - Dynamic inline styles
 *   - Canvas / WebGL
 *   - Unit tests
 *
 * Rule: globals.css is the source of truth.
 * If you change a value there, change it here too.
 */

// ─── Colors ───────────────────────────────────────────────────────────────────

export const colors = {
  black:  '#1D1D1B',   // bg / noise / ground
  shell:  '#EAE4DA',   // primary text
  tang:   '#ED773C',   // signal / human behavior  → SIGNAL layer
  lav:    '#808BC5',   // system / structure        → SYSTEM layer
  tea:    '#245E55',   // synthesis / cognition     → BEHAVIOR layer
  must:   '#EAC119',   // decision / behavior       → COGNITION layer
  pink:   '#EAA7C7',   // input signal              → STIMULUS layer
  sky:    '#9ED6DF',   // perception / reach
  red:    '#C63F3E',   // alert / contrast accent
} as const

/** Opacity ramp for --shell (primary text color) */
export const shellAt = {
  75: 'rgba(234,228,218,0.75)',
  50: 'rgba(234,228,218,0.50)',
  35: 'rgba(234,228,218,0.35)',
  20: 'rgba(234,228,218,0.20)',
  15: 'rgba(234,228,218,0.15)',
  10: 'rgba(234,228,218,0.10)',
  6:  'rgba(234,228,218,0.06)',
} as const

// ─── The Five Cognitive Layers ─────────────────────────────────────────────────
// Maps the Curiosity System layers to their brand color.
// Use this anywhere the 5-layer sequence is rendered.

export const layers = [
  { id: 'stimulus',  label: 'Stimulus',  color: colors.pink,  index: 0 },
  { id: 'cognition', label: 'Cognition', color: colors.must,  index: 1 },
  { id: 'behavior',  label: 'Behavior',  color: colors.tea,   index: 2 },
  { id: 'system',    label: 'System',    color: colors.lav,   index: 3 },
  { id: 'signal',    label: 'Signal',    color: colors.tang,  index: 4 },
] as const

export type LayerId = typeof layers[number]['id']

// ─── Typography ────────────────────────────────────────────────────────────────

export const fonts = {
  display: "'Josefin Sans', sans-serif",
  body:    "'Satoshi', sans-serif",
} as const

export const tracking = {
  eyebrow: '0.32em',
  label:   '0.22em',
  nav:     '0.20em',
  wide:    '0.28em',
} as const

// ─── Spacing (4px base) ────────────────────────────────────────────────────────

export const space = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const

// ─── Geometry ──────────────────────────────────────────────────────────────────

export const geo = {
  lineWeight:    1,    // px — all SVG strokes
  glowRadius:    40,   // px — signal node glow only
  grainOpacity:  0.04, // 4% paper texture
  nodeRadius:    {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 36,
    signal: 100, // the focal CTA circle (px)
  },
} as const

// ─── Easing ────────────────────────────────────────────────────────────────────
// CSS string format for inline style / non-GSAP use.
// For GSAP, use motion.ease from lib/motion-config.ts.

export const ease = {
  out:   'cubic-bezier(0.16, 1, 0.3, 1)',
  inout: 'cubic-bezier(0.65, 0, 0.35, 1)',
} as const
