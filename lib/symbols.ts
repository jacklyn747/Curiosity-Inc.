/**
 * Curiosity Inc. — Behavioral Design Symbol Language
 *
 * The 7-stage transformation model, expressed as sacred geometry.
 * Each stage of the user/audience journey has a corresponding symbol,
 * color, semantic meaning, and SVG geometry.
 *
 * Journey arc: Confusion → Awareness → Insight → Action → Framework → System → Authority
 *
 * These symbols govern:
 *  - Case study section decorators
 *  - Section transition markers
 *  - Diagram accents throughout the site
 *  - Any place the Curiosity method is visualized
 *
 * Source of truth for SVG geometry. All paths use viewBox "0 0 80 80".
 */

import { colors } from './design-tokens'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SymbolId =
  | 'confusion'
  | 'awareness'
  | 'insight'
  | 'action'
  | 'framework'
  | 'system'
  | 'authority'

export interface BehavioralSymbol {
  id:          SymbolId
  stage:       number       // 1–7
  name:        string       // display label
  concept:     string       // one-word summary
  description: string       // what it means in context
  color:       string       // brand color token (CSS value)
  geometry:    string       // sacred geometry name
  viewBox:     string       // always "0 0 80 80"
  svgData:     SymbolSVGData
}

export interface SymbolSVGData {
  type: 'dots' | 'arc' | 'vesica' | 'triangle' | 'flower' | 'cube' | 'radiant'
  elements: SymbolElement[]
}

export type SymbolElement =
  | { kind: 'circle'; cx: number; cy: number; r: number; opacity?: number }
  | { kind: 'path';   d: string; opacity?: number }
  | { kind: 'line';   x1: number; y1: number; x2: number; y2: number; opacity?: number }
  | { kind: 'polygon'; points: string; opacity?: number }


// ─── Symbol Definitions ───────────────────────────────────────────────────────

export const symbols: Record<SymbolId, BehavioralSymbol> = {

  // Stage 1 — CONFUSION
  // Where every audience starts. Scattered, noisy, no clear signal.
  // Symbol: scattered dots at irregular positions — pure noise.
  confusion: {
    id:          'confusion',
    stage:       1,
    name:        'Confusion',
    concept:     'Noise',
    description: 'The scattered state — fragmented inputs, no organizing principle. Where every audience begins.',
    color:       'rgba(234,228,218,0.20)',  // shell at 20% — dimmed, no signal yet
    geometry:    'Scattered Dots',
    viewBox:     '0 0 80 80',
    svgData: {
      type: 'dots',
      elements: [
        { kind: 'circle', cx: 12,   cy: 20,   r: 2.5, opacity: 0.60 },
        { kind: 'circle', cx: 34,   cy: 8,    r: 1.5, opacity: 0.40 },
        { kind: 'circle', cx: 58,   cy: 18,   r: 2.0, opacity: 0.55 },
        { kind: 'circle', cx: 22,   cy: 42,   r: 1.5, opacity: 0.35 },
        { kind: 'circle', cx: 48,   cy: 35,   r: 3.0, opacity: 0.70 },
        { kind: 'circle', cx: 68,   cy: 52,   r: 1.5, opacity: 0.45 },
        { kind: 'circle', cx: 15,   cy: 62,   r: 2.0, opacity: 0.50 },
        { kind: 'circle', cx: 40,   cy: 68,   r: 1.5, opacity: 0.35 },
        { kind: 'circle', cx: 62,   cy: 72,   r: 2.0, opacity: 0.55 },
        { kind: 'circle', cx: 75,   cy: 28,   r: 1.5, opacity: 0.40 },
        { kind: 'circle', cx: 30,   cy: 55,   r: 2.5, opacity: 0.60 },
        { kind: 'circle', cx: 72,   cy: 42,   r: 1.5, opacity: 0.35 },
      ]
    }
  },

  // Stage 2 — AWARENESS
  // The moment something is recognized as incomplete. The gap is visible.
  // Symbol: 270° arc — almost complete, deliberately open. The gap IS the awareness.
  awareness: {
    id:          'awareness',
    stage:       2,
    name:        'Awareness',
    concept:     'Recognition',
    description: 'The incomplete circle — seeing the gap. Recognition that something is missing, that the current frame is insufficient.',
    color:       colors.pink,  // stimulus layer — first input signal arrives
    geometry:    'Incomplete Circle',
    viewBox:     '0 0 80 80',
    svgData: {
      type: 'arc',
      elements: [
        // 270° arc: starts at 3-o'clock (70,40), sweeps clockwise through bottom/left to 12-o'clock (40,10)
        // Gap runs from 12 o'clock back to 3 o'clock — the open quadrant
        { kind: 'path', d: 'M 70 40 A 30 30 0 1 1 40 10', opacity: 1.0 },
        // Small dot at arc start — the entry point
        { kind: 'circle', cx: 70, cy: 40, r: 2, opacity: 0.6 },
      ]
    }
  },

  // Stage 3 — INSIGHT
  // Two worlds overlap. The intersection reveals something neither could see alone.
  // Symbol: Vesica Piscis — two circles each passing through the other's center.
  insight: {
    id:          'insight',
    stage:       3,
    name:        'Insight',
    concept:     'Intersection',
    description: 'The Vesica Piscis — where two frames of reference overlap and something new becomes visible. The overlap IS the breakthrough.',
    color:       colors.must,  // cognition layer — understanding forms
    geometry:    'Vesica Piscis',
    viewBox:     '0 0 80 80',
    svgData: {
      type: 'vesica',
      elements: [
        // Left circle: center (27.5, 40), r=25 — passes through right center
        { kind: 'circle', cx: 27.5, cy: 40, r: 25, opacity: 0.8 },
        // Right circle: center (52.5, 40), r=25 — passes through left center
        { kind: 'circle', cx: 52.5, cy: 40, r: 25, opacity: 0.8 },
        // Center point of the vesica
        { kind: 'circle', cx: 40,   cy: 40, r: 2,  opacity: 1.0 },
      ]
    }
  },

  // Stage 4 — ACTION
  // Direction is clear. The path is chosen. Movement begins.
  // Symbol: Triangle pointing up — direction, momentum, decision crystallized.
  action: {
    id:          'action',
    stage:       4,
    name:        'Action',
    concept:     'Direction',
    description: 'The triangle — direction chosen, momentum engaged. The point shows where to go. Behavior follows cognition.',
    color:       colors.tea,   // behavior layer — the doing
    geometry:    'Triangle',
    viewBox:     '0 0 80 80',
    svgData: {
      type: 'triangle',
      elements: [
        // Equilateral triangle pointing up, centered in viewBox
        { kind: 'polygon', points: '40,12 68,68 12,68', opacity: 1.0 },
        // Center node — the decision point
        { kind: 'circle', cx: 40, cy: 49, r: 2.5, opacity: 0.7 },
      ]
    }
  },

  // Stage 5 — FRAMEWORK
  // The pattern beneath everything becomes visible. Structure emerges from repetition.
  // Symbol: Flower of Life — 7 overlapping circles. The generative pattern.
  framework: {
    id:          'framework',
    stage:       5,
    name:        'Framework',
    concept:     'Pattern',
    description: 'The Flower of Life — the repeating pattern beneath all structure. When the framework is seen, everything becomes teachable, transferable, scalable.',
    color:       colors.lav,   // system layer — pattern recognition
    geometry:    'Flower of Life',
    viewBox:     '0 0 80 80',
    svgData: {
      type: 'flower',
      elements: [
        // 7 circles: center + 6 surrounding at 60° intervals, r=14, center-to-center = 14
        // Center
        { kind: 'circle', cx: 40,    cy: 40,    r: 14, opacity: 0.65 },
        // 0° — right
        { kind: 'circle', cx: 54,    cy: 40,    r: 14, opacity: 0.65 },
        // 60° — bottom-right
        { kind: 'circle', cx: 47,    cy: 52.1,  r: 14, opacity: 0.65 },
        // 120° — bottom-left
        { kind: 'circle', cx: 33,    cy: 52.1,  r: 14, opacity: 0.65 },
        // 180° — left
        { kind: 'circle', cx: 26,    cy: 40,    r: 14, opacity: 0.65 },
        // 240° — top-left
        { kind: 'circle', cx: 33,    cy: 27.9,  r: 14, opacity: 0.65 },
        // 300° — top-right
        { kind: 'circle', cx: 47,    cy: 27.9,  r: 14, opacity: 0.65 },
      ]
    }
  },

  // Stage 6 — SYSTEM
  // The structure is solid. Repeatable. Three-dimensional. Architectural.
  // Symbol: Isometric cube — 3D structure made from 2D understanding.
  system: {
    id:          'system',
    stage:       6,
    name:        'System',
    concept:     'Structure',
    description: 'The cube — solid, repeatable, architectural. Three faces: what you see, what you build, what sustains it. The system holds weight.',
    color:       colors.lav,   // system layer
    geometry:    'Isometric Cube',
    viewBox:     '0 0 80 80',
    svgData: {
      type: 'cube',
      elements: [
        // Top face (rhombus): top(40,14) right(65,28) bottom(40,42) left(15,28)
        { kind: 'path', d: 'M 40 14 L 65 28 L 40 42 L 15 28 Z', opacity: 1.0 },
        // Right face: top-left(65,28) top-right(65,56) bottom-right(40,70) bottom-left(40,42)
        { kind: 'path', d: 'M 65 28 L 65 56 L 40 70 L 40 42 Z', opacity: 0.75 },
        // Left face: top-left(15,28) top-right(40,42) bottom-right(40,70) bottom-left(15,56)
        { kind: 'path', d: 'M 15 28 L 40 42 L 40 70 L 15 56 Z', opacity: 0.55 },
        // Center vertical spine
        { kind: 'line', x1: 40, y1: 42, x2: 40, y2: 70, opacity: 0.3 },
      ]
    }
  },

  // Stage 7 — AUTHORITY
  // The signal radiates outward. Others orient to it. True authority is transmitted.
  // Symbol: Radiant Circle — center + 12 rays. The signal that organizes everything around it.
  authority: {
    id:          'authority',
    stage:       7,
    name:        'Authority',
    concept:     'Signal',
    description: 'The radiant circle — signal transmitted outward. Authority is not claimed; it radiates. Others orient to it automatically.',
    color:       colors.tang,  // signal layer — the final output
    geometry:    'Radiant Circle',
    viewBox:     '0 0 80 80',
    svgData: {
      type: 'radiant',
      elements: [
        // Center circle
        { kind: 'circle', cx: 40, cy: 40, r: 14, opacity: 1.0 },
        // Inner glow ring
        { kind: 'circle', cx: 40, cy: 40, r: 20, opacity: 0.25 },
        // 12 rays at 30° intervals — from r=22 to r=32
        // 0°   (right):        (62, 40) → (72, 40)
        { kind: 'line', x1: 62, y1: 40,    x2: 72, y2: 40,    opacity: 0.8 },
        // 30°:  (59, 50) → (67, 55)
        { kind: 'line', x1: 59, y1: 50,    x2: 67, y2: 55,    opacity: 0.8 },
        // 60°:  (51, 59) → (56, 68)
        { kind: 'line', x1: 51, y1: 59,    x2: 56, y2: 68,    opacity: 0.8 },
        // 90°  (bottom):       (40, 62) → (40, 72)
        { kind: 'line', x1: 40, y1: 62,    x2: 40, y2: 72,    opacity: 0.8 },
        // 120°: (29, 59) → (24, 68)
        { kind: 'line', x1: 29, y1: 59,    x2: 24, y2: 68,    opacity: 0.8 },
        // 150°: (21, 50) → (13, 55)
        { kind: 'line', x1: 21, y1: 50,    x2: 13, y2: 55,    opacity: 0.8 },
        // 180° (left):         (18, 40) → (8, 40)
        { kind: 'line', x1: 18, y1: 40,    x2: 8,  y2: 40,    opacity: 0.8 },
        // 210°: (21, 30) → (13, 25)
        { kind: 'line', x1: 21, y1: 30,    x2: 13, y2: 25,    opacity: 0.8 },
        // 240°: (29, 21) → (24, 12)
        { kind: 'line', x1: 29, y1: 21,    x2: 24, y2: 12,    opacity: 0.8 },
        // 270° (top):          (40, 18) → (40, 8)
        { kind: 'line', x1: 40, y1: 18,    x2: 40, y2: 8,     opacity: 0.8 },
        // 300°: (51, 21) → (56, 12)
        { kind: 'line', x1: 51, y1: 21,    x2: 56, y2: 12,    opacity: 0.8 },
        // 330°: (59, 30) → (67, 25)
        { kind: 'line', x1: 59, y1: 30,    x2: 67, y2: 25,    opacity: 0.8 },
      ]
    }
  },

}

// ─── Ordered array (use this for sequential rendering) ───────────────────────

export const symbolSequence: BehavioralSymbol[] = [
  symbols.confusion,
  symbols.awareness,
  symbols.insight,
  symbols.action,
  symbols.framework,
  symbols.system,
  symbols.authority,
]


// ─── Case Study Section → Symbol Mapping ────────────────────────────────────
//
// Each of the 10 case study template sections maps to a symbol.
// The reader is guided from Confusion (where audiences start) to Authority
// (where the creator operates). The progression is the argument.
//
// Sections 07 (Missed Ops) intentionally returns to Awareness — the gap
// shows where they lost signal. Section 09 (Upgrade) shows the leap.

export const caseStudySectionSymbols: Record<string, SymbolId> = {
  hero:            'authority',    // S01 — Where this creator operates now
  situation:       'confusion',    // S02 — The noisy landscape they navigated
  challenge:       'awareness',    // S03 — Recognizing the friction
  moves:           'insight',      // S04 — Behavior × design overlap (Vesica)
  learningFlow:    'action',       // S05 — Direction of the journey (Triangle)
  narrative:       'framework',    // S06 — The repeating pattern beneath everything
  whatWorks:       'system',       // S07 — Solid, crystallized, repeatable
  missed:          'awareness',    // S08 — Where signal breaks down (back to gap)
  upgrade:         'framework',    // S09 — The pattern they could unlock (→ System)
  takeaways:       'authority',    // S10 — The signal the reader carries away
}


// ─── Helper: get symbol for a case study section ─────────────────────────────

export function getSectionSymbol(sectionKey: keyof typeof caseStudySectionSymbols): BehavioralSymbol {
  const id = caseStudySectionSymbols[sectionKey]
  return symbols[id]
}


// ─── Rendering helper: build inline SVG props from a symbol ──────────────────
//
// Usage:
//   const sym = symbols.insight
//   <svg viewBox={sym.viewBox} fill="none" stroke={sym.color} strokeWidth={1}>
//     {renderSymbolElements(sym)}
//   </svg>
//
// NOTE: This is a data-only helper — it returns the element descriptor array.
// The actual JSX is rendered in the Symbol component at components/geo/Symbol.tsx.

export function getSymbolElements(id: SymbolId): SymbolSVGData['elements'] {
  return symbols[id].svgData.elements
}
