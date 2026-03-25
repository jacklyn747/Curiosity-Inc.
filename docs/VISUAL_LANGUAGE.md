# Curiosity Inc. — Visual Language Design Brief
> Insert into project as `VISUAL_LANGUAGE.md`. Reference alongside `SPEC.md` for all design decisions.

---

## 1. The Aesthetic Contract

**One sentence:** Hard geometry meets fluid motion on a dark ground, where complexity emerges from the patient repetition of simple rules.

This is not a style guide. It is a grammar. Every visual element must be derivable from a small set of primitives — the same way sacred geometry derives the Flower of Life from a single circle intersection, and the same way zentangle produces intricate patterns from a single repeated stroke. If a visual element cannot be explained by these primitives, it does not belong.

**The three laws:**
1. **The ground is silent.** Curiosity Black (#1D1E20) is not a background color. It is the absence of noise from which signal emerges. Nothing decorates it.
2. **Color is earned.** Eureka Pink (#F72658) appears only at the point of insight. If it appears twice on a screen, one instance is wrong.
3. **Everything draws itself.** No element appears instantaneously. Lines arrive. Nodes coalesce. Data builds. The animation IS the meaning.

---

## 2. Color Semantic System

Color encodes meaning, not aesthetics. Viewers must be able to read the diagram before reading the labels.

| Token | Hex | Semantic role | Max presence |
|---|---|---|---|
| `--color-void` | `#1D1E20` | The ground. Silence. Pre-insight. | Dominant |
| `--color-structure` | `#3A9EA4` | The before-state. System. Architecture. Current reality. | Secondary |
| `--color-transformation` | `#FA7714` | The after-state. Energy. Growth. What becomes possible. | Secondary |
| `--color-insight` | `#F72658` | The eureka moment. The inflection point. The CTA. | 10–15% max |
| `--color-context` | `#666–#999` | All supporting data, axes, labels, secondary information. | As needed |
| `--color-structure-dim` | `#3A9EA4` at 30% opacity | Structural lines in background / substrate layer | Texture only |

**The iridescent exception:** Teal → Orange → Pink as a spectral gradient is permitted only at moments of maximum transformation — never as decoration. Reference: Image 4 (the convergence hourglass), Image 8 (Ouïe radial lines). The gradient encodes the journey from structure through energy to insight.

**Forbidden:** Full-spectrum rainbow palettes. Gradients as backgrounds. Color used for visual interest without semantic assignment.

---

## 3. Stroke Grammar

All lines are 0.5–1.5px. No exceptions. This is non-negotiable.

| Stroke weight | Role |
|---|---|
| `0.5px` | Structural scaffolding, grid lines, axis lines, container outlines |
| `1px` | Primary data lines, connection paths, the Annotation Thread focal line |
| `1.5px` | Emphasis lines only — the single most important path in a composition |
| `2px` | Reserved for the Pink insight line against grey context only (Annotation Thread) |

**Stroke opacity by layer:**
- Substrate / zentangle texture: 8–12% opacity
- Structural / before-state lines: 30–50% opacity
- Active data lines: 70–90% opacity
- Insight / focal line: 100% opacity

---

## 4. The Seven Components

Each component has a fixed semantic purpose. Use the right component for the right data type. Never use a component for data it was not designed to communicate.

### 4.1 The Convergence Map
**Communicates:** Content architecture, ecosystem maps, how everything relates  
**Visual logic:** Radial force-directed node-link diagram. Lines draw inward from periphery to center. Centripetal, not centrifugal.  
**Inspiration references:** Image 12 (radial vanishing point geometry), Image 8 (Ouïe focal lines), Image 15 (radial text/pay attention)  
**Color:** Grey connection lines → Teal/Orange category nodes → Pink central node  
**Motion:** Lines draw inward via `stroke-dashoffset`, 80ms stagger. Center node appears last with spring scale-bounce. `stiffness: 200, damping: 20`

### 4.2 The Delta Bridge
**Communicates:** Before/after transformation metrics, proof points, ROI  
**Visual logic:** Dumbbell chart variant. Teal dot (before) connects to Orange dot (after) via an arc whose height is proportional to magnitude of change. Vesica piscis intersection at apex where Pink delta value appears.  
**Inspiration references:** Image 7 (arc calendar, radius encodes magnitude), Image 4 (hourglass convergence, color shift through pinch point)  
**Color:** Teal left endpoint → arc rises through Pink apex annotation → Orange right endpoint  
**Motion:** Teal dot appears (fade + leftward settle) → arc draws left-to-right `stroke-dashoffset` 1200ms ease-in-out → Pink delta fades in at apex → Orange dot settles. Total: ~2s per row, 200ms stagger between rows.

### 4.3 The Scaffold
**Communicates:** Learning progression, methodology stages, complexity curves, mastery building  
**Visual logic:** Horizontal bands stacking upward. Left-border accent in semantic color encodes stage level. Progressive disclosure: bands expand on scroll/click to reveal detail.  
**Inspiration references:** Image 14 (Knowing/Experimentation cone — mastery concentrates as complexity resolves), Image 6 (Experience Architecture — density of internal lines encodes depth of experience)  
**Color:** Teal border = foundational, Grey = intermediate, Orange = advanced, Pink = mastery/insight  
**Motion:** Bands enter bottom-to-top, `translateY: 20px → 0`, 150ms stagger. Left-border accent draws downward. Expand: height transition 400ms ease-out.

### 4.4 The Flow Pulse
**Communicates:** Audience behavior, engagement flows, attention distribution, conversion paths  
**Visual logic:** Sankey-style diagram. Path widths encode volume. Paths breathe with subtle opacity oscillation (50%→70%, 3s cycle) to signal live data.  
**Inspiration references:** Image 2 (cycling data viz — color encodes intensity along journey path, drop-off annotated with leader lines), Image 9 (Toucher — organic concentric contours as contained flow)  
**Color:** Teal input flows → Orange output/conversion flows → Pink at critical bottleneck/drop-off  
**Motion:** Paths clip-reveal left-to-right 800ms staggered → enter breathing animation `animation: pulse 3s ease-in-out infinite`. Drop-off annotations in Pink fade in after flow drawing completes.

### 4.5 The Annotation Thread
**Communicates:** Time-series narratives, performance over time, growth stories, "what happened and why"  
**Visual logic:** Single Pink focal line (2px) against field of grey context lines (0.5px, 30% opacity). Annotations: small circles on the focal line with thin leader lines drawing to text labels. Title appears before data (BLUF principle).  
**Inspiration references:** Image 3 (Tufte cover — white lines on black, density and curvature encode everything, zero decoration), Image 2 (thermal journey — path traces story, annotations float with leader lines)  
**Color:** Grey context lines first → Pink focal line draws left-to-right → Pink annotation circles scale in as line passes → leader lines draw to white labels  
**Motion:** Grey lines fade in 400ms → Pink focal line draws via `stroke-dashoffset` scroll-linked (line draws as user scrolls) → annotation circles spring-scale, leader lines draw with 200ms delay.

### 4.6 The Grid Reveal
**Communicates:** Comparative analysis, portfolio/case study presentations, multi-variable comparison  
**Visual logic:** Small-multiples grid. Identical cell structure, varying data. Center-outward ripple stagger — center cell first, adjacent cells ripple outward in concentric rings.  
**Inspiration references:** Image 16 (orbital spiral — nodes at irregular intervals on concentric rings, size encodes magnitude), Image 17 (vertical planetary circles — varying-scale circles threaded on a spine)  
**Color:** Cells enter at 95%→100% scale, grey border. Interior sparklines draw themselves post-entrance. Hover: subtle border intensification.  
**Motion:** GSAP stagger `from: 'center'`, `grid: 'auto'`, 60ms ring delay. Interior sparklines draw via `stroke-dashoffset` with 200ms delay after cell entrance.

### 4.7 The Lens
**Communicates:** Hero statistics, singular insight callouts, transformation proof points, "the one thing to know"  
**Visual logic:** Vesica piscis (two overlapping circles). Left circle = before/input context (Teal border). Right circle = after/output context (Orange border). Intersection = insight (Pink content, iridescent gradient fill at 15% opacity).  
**Inspiration references:** Image 20 (lemniscate/Lissajous — ellipses expanding from glowing white intersection point), Image 17 (overlapping circles on vertical axis, intersection as focal node)  
**Color:** Teal left circle + Orange right circle draw simultaneously → intersection fills with Teal→Orange gradient at 15% opacity → Pink insight text types in  
**Motion:** Both circles draw simultaneously via `stroke-dashoffset` 800ms ease-in-out from outer edges toward intersection → gradient fill appears → Pink text types in with 400ms delay. Optional: iridescent glow via `filter: drop-shadow` with multiple color stops on dark backgrounds.

---

## 5. The Substrate Layer — Zentangle Integration

All seven components may carry a substrate texture beneath the data layer. This texture is inspired by zentangle and sacred geometry: structured repetition of simple geometric marks producing emergent depth.

**Rules:**
- Substrate opacity: 8–12% only. It must whisper, not speak.
- Stroke weight: 0.3–0.5px
- Color: White or near-white (#E8E6E0) only — never colored texture
- Patterns permitted: Concentric arcs (Image 16/17), radial hatching (Image 12), contour lines (Image 19), dot fields (Image 10), fine parallel lines (Image 3/Tufte)
- Never: Organic shapes, representational forms, or textures that compete with data

**Deployment:** Substrate appears only within contained regions (inside a Lens intersection, behind a Scaffold band, as a node halo in the Convergence Map). It does not cover full-bleed backgrounds.

**Sacred geometry motifs permitted as structural underlay:**
- Vesica piscis intersection circles (at 5% opacity)
- Fibonacci spiral guides (at 3% opacity, structural positioning only)
- Concentric circle spacing following golden ratio intervals

---

## 6. Motion System

All animation follows one unified philosophy: **ideas arrive, they do not pop.**

| Property | Value | Rationale |
|---|---|---|
| Primary easing | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out) | Fast start, gentle landing. Feels like thought completing. |
| Stagger base unit | 80ms | Mimics the rhythm of a hand drawing sequentially |
| Spring stiffness | 200 | Responsive without bouncing |
| Spring damping | 20 | Settles quickly — not playful, purposeful |
| Scroll-link | GSAP ScrollTrigger | Line drawing progress tied to scroll position |
| Reduced motion | Static fully-drawn fallback | Required for all components |

**The self-drawing rule:** Every line is drawn, never placed. SVG `stroke-dasharray` set to total path length. `stroke-dashoffset` animates from full length to 0. No exceptions for primary data elements.

**What never animates:** Text content, layout shifts, background color. Only strokes, nodes, and opacity transitions.

---

## 7. Inspiration Reference Map

Direct reference images from the inspiration set, tagged to components:

| Image | What it contributes | Component(s) |
|---|---|---|
| Image 3 — Tufte cover | The master reference. White lines on black. Data = form. Zero decoration. | Annotation Thread, all components |
| Image 4 — Future/Past hourglass | Convergence at vanishing point. Iridescent color through pinch = insight moment. | Convergence Map, The Lens, Delta Bridge |
| Image 7 — Arc calendar | Arc height encodes magnitude. Dark ground, white arcs, yellow focal nodes = Pink insight nodes. | Delta Bridge |
| Image 12 — Radial vanishing points | Multiple lines from single focal point + rectangular frame fragments = geometry + structure. | Convergence Map, Scaffold |
| Image 14 — Knowing/Experimentation | Mastery as 3D cone: concentrates at apex, expands at base. Rings = Scaffold bands. | Scaffold |
| Image 20 — Lemniscate | Ellipses expanding from glowing intersection. The Lens in motion. | The Lens |
| Image 17 — Vertical planetary circles | Circles of varying scale on dotted spine. Sacred geometry as data. | Grid Reveal, Convergence Map |
| Image 2 — Cycling journey | Thermal color encoding intensity along path. Annotations with leader lines. | Flow Pulse, Annotation Thread |
| Image 6 — Experience Architecture | Line density inside cylinders encodes depth of experience. Three states = before/during/after. | Scaffold, Flow Pulse |
| Image 16 — Orbital spiral | Nodes at irregular intervals on concentric rings. Grid Reveal logic in orbital form. | Grid Reveal |
| Image 10 — Dot field vesica | Vesica piscis form assembled from particle density. Substrate reference. | The Lens substrate, all backgrounds |
| Image 19 — Dense contour lines | Zentangle-density contour texture. Background substrate reference at 8–12% opacity only. | All substrate layers |
| Image 8 — Ouïe radial lines | Spectral color on converging lines. Color encoding = insight gradient reference. | Convergence Map color, Delta Bridge arc |
| Image 15 — Pay attention radial text | Words placed at radial line endpoints. Typography as convergence map node labels. | Convergence Map labels |
| Image 5 — Wireframe terrain | Dot grid + wire mesh = substrate + data rising from it. Two-layer visual logic. | Substrate system |

**Images not in scope:** Image 1 (light background, full-spectrum — wrong ground), Image 13 (Constructivist, different territory), Image 18 (developer tooling aesthetic).

---

## 8. Typography Rules

These extend the existing SPEC.md typographic decisions with visualization-specific constraints.

- **Interpretive titles** (BLUF labels above every visualization): Brand headline typeface, full weight, white, always present before data appears
- **Data labels / axis labels**: Geometric monospace, 11–12px, `#888` grey, never bold
- **Annotation text** (floating labels with leader lines): Body typeface, reduced weight, 12px, `rgba(240,237,230,0.75)`
- **Insight callouts** (The Lens center text, Delta Bridge delta values): Brand headline typeface, Eureka Pink, types in after geometry completes
- **Never:** Data labels in Eureka Pink. Labels compete with the insight color signal.

---

## 9. WCAG Compliance Notes

- All Eureka Pink (#F72658) text on `#1D1E20` background: contrast ratio 4.8:1 — passes AA for large text
- White `#E8E6E0` on `#1D1E20`: contrast ratio 12.6:1 — passes AAA
- Teal `#3A9EA4` on `#1D1E20`: contrast ratio 4.2:1 — passes AA for large text only; do not use for small body text
- All animated components must respect `prefers-reduced-motion: reduce` with fully-drawn static fallback states
- All data visualizations must carry an accessible text description via `aria-label` or `<title>` within the SVG

---

## 10. What This System Is Not

- It is not decorative. Every element serves the intellectual message or it is removed.
- It is not maximalist. Negative space is as important as mark-making.
- It is not a template system. Each visualization is composed from primitives, not assembled from pre-built charts.
- It is not full-spectrum. The four-color palette is a hard constraint, not a starting point.
- It is not fast. The self-drawing motion takes time. That time is the experience, not a loading state.