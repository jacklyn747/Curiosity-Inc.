# Component Spec
> React component API for every visualization. Reference with `VISUAL_LANGUAGE.md` for aesthetic rules.

---

## Shared Infrastructure

### Design Tokens (CSS Custom Properties)

```css
:root {
  /* Semantic Colors */
  --color-void: #1D1E20;
  --color-structure: #3A9EA4;
  --color-transformation: #FA7714;
  --color-insight: #F72658;
  --color-context: #888;
  --color-context-dim: #555;
  --color-text: #E8E6E0;
  --color-text-dim: rgba(240, 237, 230, 0.55);

  /* Typography */
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Motion */
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
  --spring-stiffness: 200;
  --spring-damping: 20;
  --stagger-base: 80ms;

  /* Stroke Opacity Layers */
  --opacity-substrate: 0.10;
  --opacity-structural: 0.40;
  --opacity-active: 0.80;
  --opacity-focal: 1.0;
}
```

### Shared Hooks

```typescript
// useSelfDraw — SVG stroke-dashoffset animation
// Triggers when element enters viewport
// Returns ref to attach to SVG path/circle
useSelfDraw(options: {
  delay?: number;      // ms before animation starts (default: 0)
  duration?: number;   // ms for draw animation (default: 1200)
  easing?: string;     // CSS easing (default: var(--ease-in-out))
}) => RefObject<SVGPathElement | SVGCircleElement>

// useScrollTrigger — IntersectionObserver wrapper
// Returns { ref, inView: boolean }
// Once true, stays true (no re-triggering)
useScrollTrigger(threshold?: number) => { ref, inView }

// useStagger — calculates delay for staggered children
// Returns delay in ms for child at given index
useStagger(index: number, base?: number) => number

// useReducedMotion — respects prefers-reduced-motion
// Returns true if user prefers reduced motion
useReducedMotion() => boolean
```

---

## Component 1: The Convergence Map

**Purpose:** Shows how disciplines relate. Used in the About/Constellation section.

```typescript
interface ConvergenceMapProps {
  nodes: {
    id: string;
    label: string;
    description: string;   // shown on hover
    category?: 'structure' | 'transformation' | 'insight';
  }[];
  edges: {
    source: string;        // node id
    target: string;        // node id
  }[];
  centerNode: {
    label: string;         // "CURIOSITY INC."
  };
}
```

**Layout:** Force-directed radial. Nodes distributed on an invisible circle. Center node at origin. Lines connect nodes through center.

**Animation sequence:**
1. Connection lines draw inward via stroke-dashoffset (grey, 0.5px, 30% opacity)
2. 80ms stagger between each line
3. Peripheral nodes fade in (opacity 0→1, 400ms) as their lines arrive
4. Center node appears LAST — spring scale from 0.6→1.0 (stiffness: 200, damping: 20)
5. Center node: Pink dot, 6px radius

**Interaction:**
- Hover peripheral node → connected edges brighten to 80% opacity, description text fades in below node label
- Hover center node → ALL edges brighten
- Touch devices: tap to toggle hover state

**Node styling:**
- Peripheral: white dot (4px), label below in monospace 10px, context grey
- Center: Pink dot (6px), label below in monospace 11px, Pink
- Connection lines: grey (#888) at 30% opacity, 0.5px stroke

**Responsive:**
- Desktop (>768px): full radial layout, ~500px diameter
- Mobile (<768px): vertical list with connection indicators instead of radial graph

**Reduced motion fallback:** All elements visible, fully drawn, no animation. Static state.

**Accessibility:** `<title>` on SVG: "Constellation of disciplines that inform Curiosity Inc.'s practice." Each node has `role="button"` with `aria-label` containing node label + description.

---

## Component 2: The Delta Bridge

**Purpose:** Before/after transformation metrics. Used in case study Act 4.

```typescript
interface DeltaBridgeProps {
  metrics: {
    label: string;         // "Repeat Engagement Rate"
    category: string;      // "Audience Behavior"
    before: string;        // "12%"
    after: string;         // "38%"
    delta: string;         // "+217%"
    magnitude: number;     // 0-1, controls arc height
  }[];
  stagger?: number;        // ms between rows (default: 200)
}
```

**Layout:** Each row is a grid: `200px 1fr 80px` (label | SVG bridge | delta value).

**SVG bridge per row (viewBox 0 0 600 56):**
- Teal dot at left position (x determined by magnitude — lower magnitude = further right = shorter arc)
- Arc path: quadratic bezier from teal dot to orange dot, peak height proportional to magnitude
- Orange dot at right position
- Delta value text at arc apex in Pink

**Arc gradient:** `linearGradient` from Teal → Pink (midpoint) → Orange.

**Arc stroke width:** 1px default. 1.5px when magnitude > 0.7.

**Animation sequence per row (triggered by scroll):**
1. Row fades in (opacity + translateY: 16px → 0)
2. Teal dot appears (fade + scale from 0.6)
3. Arc draws left-to-right via stroke-dashoffset, 1200ms, ease-in-out
4. Pink delta text fades in at apex as arc passes midpoint
5. Orange dot appears (fade + scale from 0.6)
6. Each row staggers by 200ms from the previous

**Responsive:**
- Desktop (>768px): 3-column grid as described
- Tablet (480-768px): `140px 1fr 60px`
- Mobile (<480px): single column — label, then SVG bridge (full width), then delta value

**Reduced motion:** All dots, arcs, and text visible immediately. No draw animation.

**Accessibility:** Each row has `aria-label`: "[label]: [before] to [after], change of [delta]".

---

## Component 3: The Scaffold

**Purpose:** Shows methodology stages, learning progression. Used in homepage Section 1 and case study Acts 2+3.

```typescript
interface ScaffoldProps {
  bands: {
    level: 'foundational' | 'intermediate' | 'advanced' | 'mastery';
    title: string;
    body: string;
    expandedContent?: string;  // revealed on click/scroll
  }[];
  direction?: 'up' | 'down';  // stack direction (default: 'up')
}
```

**Layout:** Full-width horizontal bands stacking vertically. Left-border accent (4px) color-coded by level:
- `foundational` → Teal (#3A9EA4)
- `intermediate` → Grey (#888)
- `advanced` → Orange (#FA7714)
- `mastery` → Pink (#F72658)

**Band styling:**
- Background: transparent (void shows through)
- Border-bottom: 1px solid rgba(232,230,224,0.05)
- Left accent: 4px solid, color per level
- Padding: 24px 0 24px 24px
- Title: DM Sans 16px, weight 400, color-text
- Body: DM Sans 14px, weight 300, color-text-dim

**Progressive disclosure:** If `expandedContent` exists:
- Band shows title + body initially
- On click (or scroll-into-deeper-view): band height transitions 400ms ease-out, expandedContent fades in
- Chevron indicator (tiny, context grey) rotates 90° on expand

**Animation sequence:**
1. Bands enter bottom-to-top (if direction='up'), translateY: 20px → 0
2. 150ms stagger between bands
3. Left-border accent draws downward (stroke-dashoffset on a vertical line) after band enters

**Responsive:**
- All breakpoints: full width, same structure
- Mobile: slightly reduced padding (16px)

**Reduced motion:** All bands visible, expanded content accessible via click without transition.

**Accessibility:** Each band is a `<section>` with heading. Expandable content uses `aria-expanded` and `aria-controls`.

---

## Component 4: The Flow Pulse

**Purpose:** Shows audience behavior flows — funnel vs learning architecture comparison. Used in homepage Section 2 and case study Act 3.

```typescript
interface FlowPulseProps {
  flows: {
    id: string;
    label: string;           // "Funnel Model" or "Learning Architecture"
    color: 'structure' | 'transformation';
    stages: {
      label: string;
      width: number;         // 0-1, relative width at this stage
    }[];
    dropoffs?: {
      afterStage: number;    // index
      label: string;         // "72% drop-off"
      severity: number;      // 0-1, controls Pink intensity
    }[];
    outputLabel: string;     // "Purchase" or "Identity Shift → Purchase"
  }[];
}
```

**Layout:** Flows rendered as Sankey-style paths side by side (stacked on mobile). Each flow is an SVG.

**Path rendering:** Connected trapezoids. Width at each stage determined by `width` value. Smooth bezier connections between stages.

**Breathing animation:** After paths fully draw, they oscillate opacity between 50% and 70% on a 3s ease-in-out cycle. This signals "living system."

**Dropout annotations:** Pink leader lines with labels at dropout points. Appear AFTER flow drawing completes.

**Animation sequence:**
1. Paths clip-reveal left-to-right, 800ms per flow, staggered
2. Breathing animation begins after reveal
3. Dropout annotations fade in 400ms after flow completes

**Color:**
- Funnel flow: Teal paths
- Learning architecture flow: Orange paths
- Dropout annotations: Pink labels + leader lines

**Responsive:**
- Desktop: side-by-side flows
- Mobile: stacked vertically with "vs." divider

**Reduced motion:** Paths fully visible, no breathing animation (static at 60% opacity), dropout annotations visible.

**Accessibility:** `aria-label` on each flow SVG describing the flow pattern and dropout rates.

---

## Component 5: The Annotation Thread

**Purpose:** Timeline narrative. Used optionally in case study Act 5.

```typescript
interface AnnotationThreadProps {
  contextLines: {
    label: string;           // "Industry average"
    values: number[];        // data points
  }[];
  focalLine: {
    label: string;           // "This architecture"
    values: number[];
  };
  annotations: {
    atIndex: number;         // which data point
    label: string;           // "Restructured content architecture"
  }[];
  xLabels: string[];         // "Month 1", "Month 2", etc.
}
```

**Layout:** SVG, viewBox scaled to data. Full component width.

**Rendering order (visual layers):**
1. Grey context lines (0.5px, 30% opacity) — industry benchmarks
2. Pink focal line (2px, 100% opacity) — the subject's trajectory
3. Annotation circles (Pink, 4px radius) on focal line at annotation points
4. Leader lines (0.5px dashed, grey) from circles to text labels
5. Text labels (monospace 10px, 75% opacity white)

**Animation:**
1. Grey context lines fade in, 400ms
2. Pink focal line draws left-to-right via stroke-dashoffset, scroll-linked (line draws as user scrolls)
3. Annotation circles spring-scale as line passes their position
4. Leader lines draw with 200ms delay after their circle appears

**Responsive:** Full width at all breakpoints. Labels may truncate on mobile.

**Reduced motion:** All lines and annotations visible immediately.

---

## Component 6: The Grid Reveal

**Purpose:** Case study cards on homepage. Comparative display.

```typescript
interface GridRevealProps {
  items: {
    id: string;
    number: string;          // "01"
    category: string;        // "BRAND ARCHITECTURE"
    title: string;           // "Dan Koe"
    subtitle: string;        // hook line
    link: string;            // route
  }[];
  columns?: number;          // default: 2
}
```

**Layout:** CSS Grid. Desktop: 2 columns. Third item spans first column of second row.

**Card styling:**
- Background: rgba(232,230,224,0.03) — barely visible against void
- Border: 0.5px solid rgba(232,230,224,0.10)
- Border-radius: 8px (not more)
- Padding: 32px
- Number: monospace 12px, Orange
- Category: monospace 10px, context grey, tracking 0.12em
- Title: display font, 28px
- Subtitle: body font, 14px, weight 300, color-text-dim
- CTA: monospace 11px, Pink, tracking 0.1em, with arrow →

**Animation:** Center-outward stagger (GSAP `from: 'center'`). 60ms between cards. Each card: opacity 0→1, scale 0.95→1.0.

**Responsive:**
- Desktop (>768px): 2-column grid
- Mobile (<768px): single column, full width

---

## Component 7: The Lens

**Purpose:** Hero statistic. The single most important number. Used in case study Act 4.

```typescript
interface LensProps {
  value: string;              // "3.2×"
  sublabel: string;           // "PROJECTED LTV MULTIPLIER"
  beforeLabel: [string, string]; // ["CURRENT", "MODEL"]
  afterLabel: [string, string];  // ["ORBITAL", "MODEL"]
}
```

**Layout:** Centered. Max-width 480px. Two overlapping circles forming vesica piscis.

**SVG structure (viewBox 0 0 480 220):**
- Left circle: cx=200, cy=110, r=90, Teal stroke, 1px, 60% opacity
- Right circle: cx=280, cy=110, r=90, Orange stroke, 1px, 60% opacity
- Intersection ellipse: cx=240, cy=110, rx=40, ry=82, Teal→Orange gradient fill at 15% opacity
- Labels: monospace 9px at circle centers (avoiding intersection)
- Value: display font 28px, Pink, centered in intersection
- Sublabel: monospace 9px, white at 60% opacity, below value

**Animation sequence:**
1. Both circles draw simultaneously via stroke-dashoffset, 800ms, ease-in-out
2. Intersection gradient fill fades in, 600ms, after circles complete (delay: 1400ms)
3. Pink value types in (opacity 0→1), delay: 1600ms
4. Sublabel fades in, delay: 1800ms

**Reduced motion:** All elements visible. No draw animation.

**Accessibility:** `aria-label`: "[value] — [sublabel]. Comparing [beforeLabel] to [afterLabel]."

---

## Section Label Component

Used throughout the site for section headers.

```typescript
interface SectionLabelProps {
  text: string;               // "THE PATTERN"
}
```

**Rendering:**
- Pink dash (24px wide, 1px, inline-block) followed by 12px gap
- Text: monospace 11px, Pink (#F72658), tracking 0.15em, uppercase
- Always left-aligned

---

## CTA Button Component

```typescript
interface CTAProps {
  label: string;              // "Request a Curiosity Audit"
  href?: string;
  variant?: 'primary' | 'secondary';
}
```

**Primary:** Pink outline border (1px), Pink text, transparent background. Border-radius: 24px (pill). Padding: 14px 32px. Monospace 11px, tracking 0.1em, uppercase.

**Hover:** Background fills to Pink at 10% opacity. Transition 200ms.

**Secondary:** Same but smaller padding (10px 24px), 10px font.

---

## Component 8: Architecture Comparison

**Purpose:** Side-by-side visual comparison of two architectural models. Used in Dan Koe case study Act 02 to contrast the current funnel model with the proposed orbital gravity well.

**Note:** This component emerged organically during Phase 7 and was not in the original spec.

```typescript
// No props — renders a fixed comparison between funnel and orbital models.
const ArchitectureComparison: React.FC = () => { ... }
```

**Layout:** Two-column grid on desktop (1fr 1px 1fr), stacks vertically on mobile. Each column contains a label, an SVG diagram, and a caption.

**Left column — Funnel Model (SVG viewBox 0 0 300 310):**
- Three trapezoidal layers: Free Content (Teal) → Newsletter (Orange) → Course/Product (Pink)
- Drop-off annotations between layers (−92% exit, −96% exit) in Pink mono 8px

**Right column — Orbital Gravity Well (SVG viewBox 0 0 300 310):**
- Four concentric circles: Awareness (r=112, Teal 22%) → Engagement (r=80, Teal 48%) → Learning (r=50, Orange 70%) → Identity (r=22, Pink fill + 1.5px stroke)
- Inward arrows at compass points between outer rings
- Ring labels at 12 o'clock positions in mono 8px

**Animation sequence (GSAP timeline, delay 0.3s):**
1. Funnel layers stagger top-to-bottom (opacity 0→1, y −8→0, 550ms each, stagger 200ms)
2. Drop-off annotations fade in (400ms)
3. Rings draw simultaneously outside-in via stroke-dashoffset (900ms each, stagger 70ms)
4. Arrows and ring labels fade in (500ms, stagger 120ms)

**Reduced motion:** All elements visible at full opacity. No draw animation.

**Responsive:** Stacks vertically on mobile (<768px). Divider hidden on mobile.

---

## Global Rules

1. **Every SVG element** uses `stroke-dasharray` + `stroke-dashoffset` for self-drawing. No exceptions for primary data elements.
2. **Text never animates** — no typewriter effects, no letter-by-letter reveals. Opacity transitions only.
3. **No layout shifts** — components reserve their full height before animation begins.
4. **prefers-reduced-motion: reduce** → all elements render in their final state, no animation, no breathing.
5. **All SVG text** carries `aria-label` or lives inside a `<title>` element.
6. **Touch devices** get tap-to-toggle instead of hover states.
7. **No component renders without data** — if a prop array is empty, render nothing (not an empty container).
