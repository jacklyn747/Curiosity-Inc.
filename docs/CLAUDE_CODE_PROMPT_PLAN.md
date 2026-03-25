# Curiosity Inc. — Claude Code Prompt Plan
## A Phased Build Strategy for the Digital Sanctuary

> **How to use this document:** Each phase is a Claude Code session. Copy the prompt for that phase, paste it into Claude Code, and let it work. After each phase, review what was built before moving to the next. Phases are designed so each one produces a working, reviewable artifact — you never end a session with broken code.

> **Critical setup:** Before Phase 1, place all project files in a `/docs` folder at the root of your repo. Claude Code needs to read them. Tell it: "Read all files in /docs before starting. These are your binding specifications."

---

## PHASE 1: Foundation — The Silent Ground
**Session goal:** A running Vite + React + TypeScript app with the complete design system wired in. No visible content yet — just the infrastructure that makes everything else possible.
**Estimated time:** 30-45 min
**What you'll review:** A blank #1D1E20 screen with fonts loaded and dev tools showing all CSS variables active.

### Prompt:

```
Read all files in /docs. These are binding specifications — especially VISUAL_LANGUAGE.md,
SITE_BLUEPRINT_v2.md, COMPONENT_SPEC.md, and Project_Memory___Workflow_Rules.md.

Initialize a Vite + React + TypeScript project. Then build Phase 1: Foundation.

1. SCAFFOLD:
   - Vite + React 18 + TypeScript (strict mode)
   - React Router v6 with these routes:
     /                    → Homepage
     /work/:slug          → CaseStudy
     /writing/:slug       → Article
   - GSAP + ScrollTrigger installed
   - Three.js installed (used later, but install now)

2. DESIGN TOKENS as CSS custom properties in a global stylesheet:
   --color-void: #1D1E20
   --color-structure: #3A9EA4
   --color-transformation: #FA7714
   --color-insight: #F72658
   --color-context: #888
   --color-context-dim: #555
   --color-text: #E8E6E0
   --color-text-dim: rgba(240, 237, 230, 0.55)
   --font-display: 'Instrument Serif', Georgia, serif
   --font-body: 'DM Sans', system-ui, sans-serif
   --font-mono: 'JetBrains Mono', monospace
   --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94)
   --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1)
   --spring-stiffness: 200
   --spring-damping: 20
   --stagger-base: 80ms
   --opacity-substrate: 0.10
   --opacity-structural: 0.40
   --opacity-active: 0.80
   --opacity-focal: 1.0

3. FONT LOADING:
   - Google Fonts: Instrument Serif (400, 400i), DM Sans (300, 400), JetBrains Mono (300, 400)
   - Use font-display: swap
   - Preconnect to Google Fonts

4. GLOBAL STYLES:
   - html, body background: var(--color-void)
   - Default text color: var(--color-text)
   - Body font: var(--font-body) at 16px, line-height 1.6
   - Box-sizing: border-box globally
   - Smooth scrolling
   - Selection color: var(--color-insight) at 30% opacity background

5. SHARED HOOKS (in src/hooks/):
   - useSelfDraw: SVG stroke-dashoffset animation triggered by IntersectionObserver.
     Accepts { delay, duration (default 1200ms), easing }. Returns a ref for SVG elements.
   - useScrollTrigger: IntersectionObserver wrapper. Returns { ref, inView }.
     Once inView is true, it stays true (no re-trigger).
   - useStagger: Returns delay in ms for a given index. useStagger(index, base = 80).
   - useReducedMotion: Returns boolean from prefers-reduced-motion media query.

6. LAYOUT SHELL:
   - A Layout component wrapping all routes
   - Fixed top nav placeholder (just the bar, no content yet)
   - Main content area
   - Footer placeholder

Do NOT add any visible content, hero sections, or page text yet. This phase is pure
infrastructure. The result should be a running app showing a dark #1D1E20 void with
the correct fonts loading. That emptiness IS the design — the ground is silent.
```

---

## PHASE 2: Typography & Navigation — The Information Architecture
**Session goal:** The nav bar works, page shells exist, and the typographic system is locked.
**Estimated time:** 20-30 min
**What you'll review:** Navigate between pages, see the nav highlight correctly, confirm type hierarchy on a test page.

### Prompt:

```
Read /docs/SITE_BLUEPRINT_v2.md and /docs/VISUAL_LANGUAGE.md for reference.

Build Phase 2: Navigation and Typography System.

1. NAVIGATION (fixed top bar):
   - Logo left: "✦ CURIOSITY INC." in DM Sans, 12px, tracking 0.12em, white
   - Three links right: WORK, WRITING, ABOUT — DM Sans 400, 12px, tracking 0.12em
   - On homepage: these are anchor links (#work, #writing, #about)
   - On inner pages: these are route links (/, /, /)
   - Active section detection via IntersectionObserver for homepage scroll
   - No hamburger menu on mobile — links stack horizontally, reduce spacing
   - Nav background: transparent, gains subtle backdrop-blur on scroll (8px blur,
     var(--color-void) at 80% opacity)
   - Height: 64px desktop, 56px mobile
   - Z-index: 100

2. TYPOGRAPHY COMPONENTS (src/components/typography/):
   Create reusable components that enforce the type system:
   - SectionLabel: JetBrains Mono, 11px, tracking 0.15em, uppercase,
     var(--color-insight). Renders as: "—— THE PATTERN"
     (two em dashes, space, text). The dashes are var(--color-context-dim).
   - DisplayHeading: Instrument Serif 400, clamp(36px, 5vw, 64px), var(--color-text).
     Accepts an optional `accent` prop for words in var(--color-transformation).
   - BodyText: DM Sans 300/400, 16-18px, var(--color-text), max-width 680px,
     line-height 1.7.
   - DataLabel: JetBrains Mono 400, 11px, var(--color-context), tracking 0.08em.
   - InsightCallout: Instrument Serif 400, var(--color-insight). Used in The Lens
     and Delta Bridge components.

3. PAGE SHELLS:
   - Homepage: empty sections with correct IDs for anchor nav
     (hero, work, writing, about, footer)
   - CaseStudyPage: shell that reads slug from params
   - ArticlePage: shell that reads slug from params
   - 404 page: "Lost in the void." in display font, centered

4. FOOTER:
   - "STAY CURIOUS" in Instrument Serif italic, clamp(48px, 8vw, 96px),
     var(--color-text) at 20% opacity
   - "✦ CURIOSITY INC." below in DM Sans 12px
   - "JOIN THE COLLECTIVE" — Pink outline button (1px border var(--color-insight),
     transparent fill, DM Sans 11px tracking 0.15em)
   - "© 2026 Curiosity Inc. · Designed for the flow state." in JetBrains Mono 10px,
     var(--color-context-dim)
   - Generous padding: 120px top, 80px bottom
```

---

## PHASE 3: The Scaffold & Flow Pulse — First Two Visualization Components
**Session goal:** Two of the seven proprietary visualization components are built and working with test data.
**Estimated time:** 45-60 min
**What you'll review:** Scroll-triggered self-drawing animations on both components.

### Prompt:

```
Read /docs/VISUAL_LANGUAGE.md §4.3 and §4.4, and /docs/COMPONENT_SPEC.md for
The Scaffold and The Flow Pulse specifications.

Build these two visualization components with full animation.

1. THE SCAFFOLD (src/components/visualizations/Scaffold.tsx):
   Props interface from COMPONENT_SPEC.md:
   - bands: array of { label, sublabel?, content, detail?, accentColor }
   - accentColor options: 'structure' | 'transformation' | 'insight' | 'context'

   Behavior:
   - Horizontal bands stacking upward
   - Left-border accent (3px) in semantic color: Teal=foundational, Grey=intermediate,
     Orange=advanced, Pink=mastery
   - Bands enter bottom-to-top with translateY: 20px → 0, opacity 0 → 1, 150ms stagger
   - Left-border accent draws downward (stroke-dashoffset technique on a vertical line)
   - Click/hover on a band expands to reveal detail content (height transition 400ms ease-out)
   - All animation triggered by useScrollTrigger (only plays once)
   - prefers-reduced-motion: all bands visible immediately, expanded by default
   - Background: var(--color-void). Band background: rgba(255,255,255, 0.03)
   - Border between bands: 0.5px, var(--color-context) at 10% opacity

2. THE FLOW PULSE (src/components/visualizations/FlowPulse.tsx):
   Props interface from COMPONENT_SPEC.md:
   - flows: array with id, label, color, stages[], dropoffs[], outputLabel

   Behavior:
   - Sankey-style SVG paths. Width at each stage from the width value (0-1).
   - Smooth bezier connections between stages (trapezoid shapes).
   - Paths clip-reveal left-to-right, 800ms per flow, staggered between flows.
   - After reveal: breathing animation — opacity oscillates 50% to 70%, 3s ease-in-out
     infinite cycle. This signals "living system."
   - Dropout annotations: Pink leader lines with labels. Appear 400ms AFTER flow completes.
   - Teal for funnel flow paths, Orange for learning architecture paths.
   - Pink for dropout annotations.
   - Desktop: side by side. Mobile: stacked with "vs." divider.
   - prefers-reduced-motion: static at 60% opacity, no breathing, all annotations visible.
   - SVG viewBox scaled to fit, full component width.

3. TEST DISPLAY:
   Create a temporary /test-components route that shows both components with the
   exact data from the homepage:
   - Scaffold with 3 bands (the "current funnel" from Section 1)
   - Flow Pulse with the two flows from Section 2 (Funnel vs Learning Architecture)
   Use the copy from /docs/HOMEPAGE_COPY.md for labels and text.

Important constraints from VISUAL_LANGUAGE.md:
- All strokes: 0.5-1.5px only. No exceptions.
- Lines self-draw via stroke-dashoffset. No element appears instantaneously.
- Ease-out timing (fast start, gradual reveal).
- Color is earned — Pink only at the point of insight.
```

---

## PHASE 4: Delta Bridge, Lens, and Grid Reveal — Three More Components
**Session goal:** Three more visualization components built. The full case study visualization toolkit is nearly complete.
**Estimated time:** 45-60 min
**What you'll review:** Self-drawing arcs, vesica piscis geometry, and staggered grid animations.

### Prompt:

```
Read /docs/VISUAL_LANGUAGE.md §4.2, §4.6, §4.7 and /docs/COMPONENT_SPEC.md.

Build three more visualization components.

1. THE DELTA BRIDGE (src/components/visualizations/DeltaBridge.tsx):
   - Dumbbell chart variant. Each row: Teal dot → self-drawing arc → Pink delta at
     apex → Orange dot.
   - Arc height proportional to magnitude (0-1 scale).
   - Animation per row: Teal dot fades in → arc draws left-to-right via stroke-dashoffset
     (1200ms ease-in-out) → Pink delta value fades in at apex → Orange dot settles.
   - Total ~2s per row, 200ms stagger between rows.
   - Before label left, After label right, Delta label at arc apex.
   - Category label in JetBrains Mono 10px above each row.
   - prefers-reduced-motion: all elements visible immediately, arcs fully drawn.

2. THE LENS (src/components/visualizations/Lens.tsx):
   - Vesica piscis geometry for hero statistics.
   - Two overlapping circles: Teal (left, "before") + Orange (right, "after").
   - Circles draw simultaneously via stroke-dashoffset.
   - Intersection area fills with a Teal-to-Orange gradient.
   - The insight value (Pink, Instrument Serif) types in character-by-character at the
     intersection center AFTER geometry completes.
   - Below: sublabel in JetBrains Mono 10px.
   - Before/After labels outside the circles.
   - Circle stroke: 1px. No fill on circles themselves, only the intersection.
   - prefers-reduced-motion: fully drawn, value visible.

3. THE GRID REVEAL (src/components/visualizations/GridReveal.tsx):
   - Small-multiples grid for case study cards.
   - Center-outward ripple stagger: center cell first, adjacent cells next, 60ms delays.
   - Each cell: opacity 0 → 1, translateY: 12px → 0, scale 0.97 → 1.
   - Interior sparklines (if provided) draw via stroke-dashoffset AFTER cell entrance.
   - Cell border: 0.5px, var(--color-context) at 15% opacity.
   - No background fills heavier than 5% opacity.
   - Accepts children as render prop for flexible card content.

4. Add all three to the /test-components route with data from /docs/CASE_STUDY_DAN_KOE.md:
   - Delta Bridge: use the 5 metrics from Act 4 (repeat engagement, revenue per sub, etc.)
   - Lens: value "3.2×", sublabel "PROJECTED LTV MULTIPLIER"
   - Grid Reveal: 3 cards with Dan Koe, Justin Welsh, Tiago Forte data from HOMEPAGE_COPY.md

Constraints:
- Strokes: 0.5–2px max. The 2px is ONLY for the Pink insight line.
- Everything self-draws. No instant appearance.
- The vesica piscis intersection in The Lens should reference the Prism image
  (converging forms creating a central revelation).
```

---

## PHASE 5: The Convergence Map — The Interactive Constellation
**Session goal:** The force-directed node graph that represents Curiosity Inc.'s intellectual ecosystem.
**Estimated time:** 30-45 min
**What you'll review:** An interactive radial diagram that draws itself inward, with hover states.

### Prompt:

```
Read /docs/VISUAL_LANGUAGE.md §4.1, /docs/COMPONENT_SPEC.md (Convergence Map section),
and /docs/HOMEPAGE_COPY.md (Section 5 node descriptions).

Build The Convergence Map.

1. THE CONVERGENCE MAP (src/components/visualizations/ConvergenceMap.tsx):
   - Radial force-directed layout. Nodes on an invisible circle. Center node at origin.
   - Connection lines draw INWARD from periphery to center (centripetal, not centrifugal).
   - Animation sequence:
     a. Connection lines draw inward via stroke-dashoffset (grey, 0.5px, 30% opacity)
     b. 80ms stagger between each line
     c. Peripheral nodes fade in (opacity 0→1, 400ms) as their lines arrive
     d. Center node appears LAST — spring scale from 0.6→1.0
        (use GSAP with stiffness: 200, damping: 20 equivalent)
   - On hover of peripheral node:
     a. Connected edges brighten to 80% opacity
     b. One-line description appears below node (12px, DM Sans, fades in 200ms)
     c. Non-connected elements dim to 15% opacity
   - Center node: "CURIOSITY INC." in DM Sans 11px, var(--color-insight)
   - Peripheral nodes: discipline names in JetBrains Mono 10px, var(--color-text) at 70%

2. DATA (from HOMEPAGE_COPY.md):
   Nodes: Flow Theory, Cognitive Load, Curiosity Loop, Semiotics, Design Systems,
   Kinetic Type, Negative Space, Instructional Design, Identity Theory
   Center: CURIOSITY INC.

   Hover descriptions:
   - Flow Theory: "Csíkszentmihályi's conditions for total absorption in a task"
   - Cognitive Load: "Why your audience forgets — and how to fix it"
   - Curiosity Loop: "Five stages from attention to capability"
   - Semiotics: "How signs, symbols, and visuals carry meaning without words"
   - Design Systems: "Repeatable visual patterns that scale without losing coherence"
   - Kinetic Type: "Typography that moves to teach — timing as a pedagogical tool"
   - Negative Space: "What you leave out creates space for the audience to think"
   - Instructional Design: "The science of structuring information for permanent behavior change"
   - Identity Theory: "People don't buy products. They buy the person they're becoming."

3. LAYOUT:
   - SVG-based, responsive (scales with container)
   - Desktop: 600px diameter. Mobile: full-width with proportional scaling.
   - Generous padding around the constellation — the void around it matters.

4. ACCESSIBILITY:
   - Each node is a button with aria-label including the description
   - SVG has a descriptive title element
   - Keyboard navigable: Tab between nodes, Enter/Space to show description

Add to /test-components route.
```

---

## PHASE 6: Homepage Assembly — The Curiosity Loop in Five Sections
**Session goal:** The complete homepage with all sections wired together and real copy.
**Estimated time:** 60-90 min
**What you'll review:** A scrollable homepage that takes you through the full Curiosity Loop narrative.

### Prompt:

```
Read /docs/SITE_BLUEPRINT_v2.md (full homepage spec) and /docs/HOMEPAGE_COPY.md (all copy).

Assemble the complete homepage. Use every component built in previous phases.
The homepage is a single scroll through five sections plus hero and footer.

IMPORTANT: The homepage IS a Curiosity Loop. Each section maps to a stage:
Hero (before the loop) → The Pattern (Attention) → The Insight (Decision) →
The Laboratory (Intention) → Deep Readings (Intention→Action bridge) →
The Constellation (Action + Capability)

1. HERO SECTION (placeholder for now — WebGL comes in Phase 8):
   - Full viewport height, centered
   - For now: a static dark void with the text appearing on scroll:
     "Your audience is learning from you."
     "You just haven't designed what they're learning."
   - Text in Instrument Serif italic, clamp(28px, 4vw, 48px), var(--color-text)
   - Second line slightly dimmer (80% opacity)
   - Text fades in with translateY: 20px → 0 when scrolled to
   - Leave a clear comment: // PHASE 8: Replace with WebGL particle → geometry → Phönix morph

2. SECTION 1 — THE PATTERN (Attention):
   - SectionLabel: "THE PATTERN"
   - DisplayHeading: "You have an audience. You don't have a learning experience."
   - Three Scaffold bands with the problem statements from HOMEPAGE_COPY.md:
     Band 1 (Teal): audience watches but doesn't change
     Band 2 (Grey): monetization feels extractive
     Band 3 (Orange): growth plateaued
   - Each band expandable to show the full paragraph text
   - Closing line below in var(--color-text-dim): "These aren't marketing problems.
     They're architecture problems."
   - Layout: left-aligned, 40-60% of composition is void on the right

3. SECTION 2 — THE INSIGHT (Decision):
   - SectionLabel: "THE INSIGHT"
   - DisplayHeading: "Every creator with an audience is an accidental educator."
   - Body text from HOMEPAGE_COPY.md (the curriculum paragraph)
   - Flow Pulse component with two flows:
     Left (Teal, "The Funnel"): progressively narrowing, "Purchase" output,
       dropout annotation "72% exit before converting"
     Right (Orange, "Learning Architecture"): maintained/expanding width,
       "Identity Shift → Purchase" output, annotation "3.2× longer engagement"
   - Layout: centered, generous vertical spacing

4. SECTION 3 — THE LABORATORY (Intention):
   - id="work" for anchor nav
   - SectionLabel: "THE LABORATORY"
   - DisplayHeading: "Selected Experiments"
   - Subtitle text from HOMEPAGE_COPY.md
   - Grid Reveal with 3 case study cards (2+1 layout):
     Card structure: Number (Orange) | Category (JetBrains Mono, grey) |
     Creator name (Instrument Serif, large) | Hook line | "EXPLORE CASE STUDY →" (Pink)
   - Cards link to /work/dan-koe-brand-architecture, etc.
   - Card border: 0.5px, var(--color-context) at 15% opacity

5. SECTION 4 — DEEP READINGS (Intention→Action bridge):
   - id="writing" for anchor nav
   - SectionLabel: "THE LIBRARY"
   - DisplayHeading: "Deep Readings"
   - 4 article rows from HOMEPAGE_COPY.md
   - Each row: Number | Category (Teal, JetBrains Mono) | Title (Instrument Serif italic) |
     Description | Read time | Arrow →
   - Thin dividers: 0.5px, var(--color-context) at 5% opacity
   - Full-width rows, clean typography, generous line spacing

6. SECTION 5 — THE CONSTELLATION (Action + Capability):
   - id="about" for anchor nav
   - SectionLabel: "ABOUT"
   - DisplayHeading: "The Constellation of" with "Ideas" in var(--color-transformation)
   - Subtitle: "Hover to explore the relationships between disciplines..."
   - Convergence Map component with all 9 nodes
   - Closing statement from HOMEPAGE_COPY.md (the "unstructured curriculum" paragraph)
   - CTA button: "Request a Curiosity Audit"
     Style: Pink outline (1px border var(--color-insight)), transparent fill,
     DM Sans 11px, tracking 0.15em, padding 16px 32px, hover fills with Pink at 10%

7. SPACING RHYTHM:
   - Between sections: 160px desktop, 120px mobile
   - Section padding: 80px horizontal desktop, 24px mobile
   - Max content width: 1200px, centered
   - The void between sections is intentional — don't compress it

Remove the /test-components route. All components now live in the homepage.
```

---

## PHASE 7: Dan Koe Case Study — The Complete Inner Page
**Session goal:** A fully functional case study page with all five acts of the Curiosity Loop.
**Estimated time:** 60-90 min
**What you'll review:** The complete Dan Koe transformation narrative with all visualization components active.

### Prompt:

```
Read /docs/CASE_STUDY_DAN_KOE.md (complete content), /docs/SITE_BLUEPRINT_v2.md
(case study inner page spec), and /docs/HOMEPAGE_COPY.md.

Build the complete Dan Koe case study at /work/dan-koe-brand-architecture.
This page demonstrates the Curiosity Loop applied to a specific creator.
It's a transformation narrative in five acts.

1. ACT 1 — ATTENTION: The Hook
   - "Dan Koe" in Instrument Serif, clamp(48px, 8vw, 96px)
   - Hook line in Pink: "What if 2.3M followers were students, not subscribers?"
   - Metadata row: Domain: Digital Philosophy | Approach: Behavioral Systems
   - Flagship Engine: Modern Mastery / Koe Letters
   - Target Topology paragraph
   - Network Bandwidth: three platform stats (X: 750K+, YouTube: 1.3M+, Instagram: 1.6M+)
     with Pink bar indicators proportional to count
   - Layout: typography + void. No component. Emptiness around the name IS the design.
   - Generous vertical spacing. The name should breathe.

2. ACT 2 — DECISION: The Current State
   - SectionLabel: "CURRENT STATE"
   - "What's working:" paragraph (acknowledge strengths — from CASE_STUDY_DAN_KOE.md)
   - "The constraint:" paragraph
   - Scaffold component with 3 bands showing current funnel:
     Band 1 (Teal): "Top of Funnel" — high-volume philosophical tweets
     Band 2 (Grey): "Mid Funnel" — YouTube essays and newsletters
     Band 3 (Orange): "Bottom Funnel" — Cohort sales for Modern Mastery

3. ACT 3 — INTENTION: The Architecture
   - SectionLabel: "OUR ARCHITECTURE"
   - Intro paragraph about the Orbital Gravity Well
   - Framework name displayed prominently: "Orbital Gravity Well"
   - Scaffold component with 5 bands (ascending complexity):
     Phase 01 (Teal): ATTENTION / RESONANCE — concept + application
     Phase 02 (Grey): DECISION / CALIBRATION — concept + application
     Phase 03 (Grey): INTENTION / SIMULATION — concept + application
     Phase 04 (Orange): ACTION / EXECUTION — concept + application
     Phase 05 (Pink): CAPABILITY / THE CORE — concept + application
   - Each band expandable to reveal full concept and application text
   - Color progression Teal→Grey→Grey→Orange→Pink encodes methodology building

4. ACT 4 — ACTION: The Shift (Projected Outcomes)
   - SectionLabel: "PROJECTED ARCHITECTURE"
   - Subtitle explaining these are projections, not guarantees
   - The Lens component: value "3.2×", sublabel "PROJECTED LTV MULTIPLIER",
     before label "CURRENT / MODEL", after label "ORBITAL / MODEL"
   - Delta Bridge with 5 metrics:
     | Repeat Engagement Rate | Audience Behavior | 12% → 38% | +217% | magnitude 0.65 |
     | Revenue per Subscriber | Business Outcome | $0.82 → $2.62 | +220% | magnitude 0.70 |
     | Curriculum Completion | Learning Outcome | 18% → 67% | +272% | magnitude 0.55 |
     | Identity Language in Community | Transformation Signal | 4% → 31% | +675% | magnitude 0.90 |
     | Time to First Purchase | Conversion Velocity | 47 days → 28 days | −40% | magnitude 0.35 |
   - Explanatory note about "Identity Language in Community" metric

5. ACT 5 — CAPABILITY: The Reflection + Implication
   - SectionLabel: "THE IMPLICATION"
   - Reflection paragraphs from CASE_STUDY_DAN_KOE.md
   - Implication paragraph (the "what's the multiplier for YOUR content?" question)
   - CTA: "Request a Curiosity Audit" (same style as homepage)
   - Next case study link: "Justin Welsh — Conversion Design →"

6. CONCEPT STUDY DISCLAIMER (required):
   - Small, JetBrains Mono 10px, var(--color-context-dim)
   - Full disclaimer text from CASE_STUDY_DAN_KOE.md
   - Position: bottom of page, before footer

7. SCROLL BEHAVIOR:
   - Each act scroll-triggered independently
   - Smooth transitions between acts with generous spacing (120px between acts)
   - Visualization components animate when they enter viewport, not on page load

8. DATA ARCHITECTURE:
   - Create a /src/data/caseStudies.ts file with a typed CaseStudy interface
     matching the data model from SITE_BLUEPRINT_v2.md
   - Populate with Dan Koe data
   - Leave stub entries for Justin Welsh and Tiago Forte (title + hook only)
   - The CaseStudy page component should read from this data by slug
```

---

## PHASE 8: The Hero — WebGL Particle Field to Sacred Geometry
**Session goal:** The signature hero experience — particles coalescing into geometry on scroll.
**Estimated time:** 90-120 min (most complex phase)
**What you'll review:** A scroll-driven particle animation that transforms from chaos to structure.

### Prompt:

```
Read /docs/SITE_BLUEPRINT_v2.md (Hero section spec) and /docs/VISUAL_LANGUAGE.md
(§1 Laws, §2 Palette, reference images description).

Build the homepage hero: a WebGL particle field that morphs into sacred geometry on scroll.
This is the most technically ambitious element. Build it in stages.

STAGE A — Static particle field:
- Three.js canvas, full viewport
- 800-1200 particles, randomly distributed in a sphere volume
- Particle color: var(--color-text) at 30% opacity
- Particle size: 1-2px
- Subtle ambient drift (random velocity, very slow — almost imperceptible)
- Dark background matches var(--color-void)
- Canvas behind all content (z-index: 0)

STAGE B — Scroll-linked coalescence:
- Use GSAP ScrollTrigger to map scroll position (0% to 50% of hero height) to a morph
- At 0% scroll: random particle positions (chaos/noise state)
- At 25% scroll: particles begin migrating toward Fibonacci spiral positions
- At 50% scroll: particles settle into a Flower of Life sacred geometry pattern
  (overlapping circles forming the classic seed-of-life / flower-of-life)
- The geometry should be centered in viewport
- Particle color shifts: white → begins picking up Teal tints as structure forms

STAGE C — Geometry to Phönix sphere morph:
- From 50% to 80% scroll: the flat sacred geometry inflates into a 3D sphere
- The sphere surface has an iridescent quality:
  ONLY use the brand palette gradient: Teal (#3A9EA4) → Orange (#FA7714) → Pink (#F72658)
  No greens, yellows, cyans.
- The sphere should feel like "liquid glass" — smooth, slightly reflective,
  the colors shifting as if light is refracting through a prism
- Subtle rotation on the sphere (very slow, continuous)
- Use a custom shader for the iridescent effect:
  - Base: dark, nearly black
  - Fresnel effect at edges showing the Teal→Orange→Pink gradient
  - Slight noise distortion on the surface for organic feel

STAGE D — Text reveal:
- At 80-100% scroll: text fades in below/overlapping the sphere
- "Your audience is learning from you." — Instrument Serif italic
- "You just haven't designed what they're learning." — slightly dimmer
- Text appears with a gentle translateY and opacity animation
- The sphere continues its slow rotation behind the text

PERFORMANCE:
- Lazy-load Three.js (dynamic import)
- Use requestAnimationFrame efficiently
- Dispose of geometry/materials on unmount
- Test that it runs at 60fps on mid-range hardware
- If performance is poor, reduce particle count

FALLBACK (prefers-reduced-motion):
- Skip all particle animation
- Show the Flower of Life as a static SVG drawing (self-draw via stroke-dashoffset)
- Show text immediately
- No Three.js loaded at all

CRITICAL: This hero should feel like "emerging from chaos into clarity" —
the visitor's current state (noise/overwhelm) transforming into structure (the Prism)
and then into living form (the Phönix). The morph IS the metaphor.
```

---

## PHASE 9: Article Pages & Remaining Content
**Session goal:** Article page template working, stub case studies created, all routes functional.
**Estimated time:** 45-60 min
**What you'll review:** Navigate to every route without errors. Article layout is clean and readable.

### Prompt:

```
Read /docs/SITE_BLUEPRINT_v2.md (Article Inner Page spec) and /docs/HOMEPAGE_COPY.md.

1. ARTICLE PAGE TEMPLATE (/writing/:slug):
   - Title in Instrument Serif italic, clamp(36px, 5vw, 56px)
   - Category (Teal, JetBrains Mono 11px, tracking 0.15em) + Read time
   - Body: max-width 680px, centered, DM Sans 18px, line-height 1.7
   - Pull quotes: Instrument Serif italic, var(--color-insight), left-border 2px Pink,
     padding-left 24px, margin 48px 0
   - No sidebar. No clutter. The emptiness IS the reading experience.
   - Back link to homepage at top: "← Back" in DM Sans 12px

2. ARTICLE DATA (src/data/articles.ts):
   Create typed Article interface and populate:
   - "The Accidental Educator" — write 3-4 substantive paragraphs that establish
     the core concept (creators are educators who don't know it). Include at least
     one pull quote. This is the most important article — it IS the sales pitch in essay form.
   - "The Curiosity Loop Protocol" — write 2-3 paragraphs introducing the five-stage framework.
     Include the stage names: Attention → Decision → Intention → Action → Capability.
   - "Negative Space as Active Agent" — stub with title + 1 paragraph placeholder
   - "Eureka as Practice" — stub with title + 1 paragraph placeholder

3. STUB CASE STUDIES:
   - Justin Welsh (/work/justin-welsh-conversion-design):
     Act 1 only: name, hook ("Removing the last 1% of friction between insight and action."),
     category CONVERSION DESIGN, basic metadata.
     Acts 2-5: "Coming soon" placeholder styled in var(--color-context-dim)
   - Tiago Forte (/work/tiago-forte-cognitive-interfaces):
     Act 1 only: name, hook ("The Second Brain already has a curriculum. It just isn't built yet."),
     category COGNITIVE INTERFACES, basic metadata.
     Acts 2-5: "Coming soon" placeholder

4. CASE STUDY NAVIGATION:
   - At bottom of each case study: "Next: [Name] — [Category] →"
   - Links cycle: Dan Koe → Justin Welsh → Tiago Forte → Dan Koe

5. 404 HANDLING:
   - Catch-all route shows the 404 page
   - Include a "Return to sanctuary →" link
```

---

## PHASE 10: Polish — Performance, Accessibility, Responsive
**Session goal:** Production-ready quality. Lighthouse 95+. WCAG 2.2 AA. Mobile-perfect.
**Estimated time:** 60-90 min
**What you'll review:** Lighthouse audit, keyboard navigation, mobile layout on multiple breakpoints.

### Prompt:

```
Read /docs/Project_Memory___Workflow_Rules.md and /docs/VISUAL_LANGUAGE.md §9.

Final polish pass. This is the difference between "a website" and "a Digital Sanctuary."

1. PERFORMANCE (target: Lighthouse 95+):
   - Code-split routes with React.lazy + Suspense
   - Lazy-load Three.js (hero section only, dynamic import)
   - Lazy-load GSAP ScrollTrigger (only when first scroll-triggered component mounts)
   - Optimize font loading: preconnect, font-display: swap, subset if possible
   - Add loading="lazy" to any images
   - Minimize main bundle — check that Three.js doesn't end up in the main chunk
   - Add proper meta tags: viewport, description, charset
   - Compress assets in build

2. ACCESSIBILITY (WCAG 2.2 AA):
   - All Pink (#F72658) text on #1D1E20: 4.8:1 ratio — passes AA for large text only.
     Verify no small body text is set in Pink.
   - White (#E8E6E0) on #1D1E20: 12.6:1 — passes AAA. Good.
   - Teal (#3A9EA4) on #1D1E20: 4.2:1 — passes AA for large text only.
     Verify no small body text is set in Teal.
   - All SVG visualizations: add aria-label or <title> describing the data
   - Scaffold expand/collapse: aria-expanded, aria-controls
   - Convergence Map nodes: keyboard navigable (Tab, Enter/Space)
   - Skip-to-content link (hidden until focused)
   - Focus indicators: 2px Pink outline, 2px offset
   - All animations respect prefers-reduced-motion: provide static fully-drawn fallbacks

3. RESPONSIVE ("One Thumb, One Eyeball" test):
   - 320px: everything readable, no horizontal scroll
   - 375px (iPhone SE): comfortable reading, proper spacing
   - 768px (iPad): two-column grids become single column
   - 1024px: full layout begins
   - 1440px+: content maxes out at 1200px, centered
   - Nav: links stay horizontal but tighten on mobile. No hamburger.
   - Flow Pulse: stacks vertically on mobile with "vs." divider
   - Grid Reveal cards: single column on mobile
   - Convergence Map: scales proportionally, touch-friendly node targets (44px minimum)
   - Case study acts: full-width on mobile with reduced spacing

4. SCROLL ANIMATIONS REFINEMENT:
   - Audit every scroll-triggered animation — does it serve narrative or comprehension?
   - If not, remove it (per VISUAL_LANGUAGE.md §10: "Every element serves the intellectual
     message or it is removed")
   - Ensure no animation plays twice (useScrollTrigger's once-and-done behavior)
   - Verify stagger timing feels natural, not mechanical

5. META & SEO:
   - Page titles: "Curiosity Inc. — [Page Name]"
   - Meta description for homepage: "Curiosity Inc. helps creators turn audiences into
     learners. Design-led instructional architecture for the creator economy."
   - Open Graph tags: title, description, type (website), image (placeholder for now)
   - Canonical URLs
   - Structured data (Organization schema)

6. SPA ROUTING:
   - Add _redirects file (for Netlify) or equivalent for your hosting:
     /*    /index.html   200
   - This prevents 404 on direct URL access to inner pages
```

---

## OPTIONAL PHASE 11: The Annotation Thread — Final Visualization Component
**Session goal:** The seventh visualization component, used optionally in case studies.
**Estimated time:** 30 min

### Prompt:

```
Read /docs/VISUAL_LANGUAGE.md §4.5 and /docs/COMPONENT_SPEC.md (Annotation Thread).

Build The Annotation Thread — a time-series narrative component.

- Single Pink focal line (2px) against grey context lines (0.5px, 30% opacity)
- Grey context lines = industry benchmarks. Pink focal line = the subject's trajectory.
- Annotations: small Pink circles (4px radius) on focal line with thin leader lines
  (0.5px dashed, grey) drawing to text labels (JetBrains Mono 10px, 75% opacity)
- Animation: grey lines fade in 400ms → Pink focal line draws left-to-right via
  stroke-dashoffset (scroll-linked: line draws as user scrolls) → annotation circles
  spring-scale in as line passes → leader lines draw with 200ms delay
- SVG, viewBox scaled to data, full component width
- Title appears before data (BLUF principle)
- prefers-reduced-motion: fully drawn, all annotations visible
- This component is optional in case studies — only add it to Dan Koe if there's
  enough narrative data to justify it. Otherwise, leave it available but unused.
```

---

## Quick Reference: File Priority for Claude Code

When Claude Code encounters conflicting information, these files win in this order:

1. **VISUAL_LANGUAGE.md** — Binding design spec. The three laws, the seven components, color semantics, stroke grammar, motion system. This is the constitution.
2. **SITE_BLUEPRINT_v2.md** — Architecture and structural decisions. Use v2 over v1 if both are present.
3. **COMPONENT_SPEC.md** — React component APIs and props interfaces.
4. **HOMEPAGE_COPY.md** — Every word on the homepage. Use verbatim.
5. **CASE_STUDY_DAN_KOE.md** — Complete Dan Koe case study content.
6. **Project_Memory___Workflow_Rules.md** — Operational boundaries and code style.

---

## Troubleshooting Common Issues

**"The animations feel mechanical"** → Check stagger timing. The spec calls for ease-out (fast start, slow reveal). Linear timing always feels robotic. Add 50-100ms more stagger between elements.

**"Three.js destroys Lighthouse score"** → Dynamic import it. The hero should only load Three.js when the component mounts, and dispose everything on unmount. The fallback SVG path for reduced-motion users loads zero WebGL.

**"Colors look wrong"** → Verify you're using the exact hex values. #F72658 is Eureka Pink, not #FF0000. The palette is extremely specific — even close approximations break the system.

**"The Scaffold bands won't expand"** → Check that aria-expanded is toggling, and that the height transition targets max-height (not height) for smooth animation from 0 to auto.

**"Flow Pulse SVG paths look jagged"** → Increase bezier control point distances. The Sankey paths need smooth curves, not sharp angles. Each trapezoid stage should flow into the next with generous curve radii.

**"Convergence Map nodes overlap on mobile"** → Scale the entire SVG viewBox proportionally rather than trying to reposition nodes. The radial layout should shrink as a unit.
