# Case Studies Feature — Design Spec
**Date:** 2026-03-14
**Project:** Curiosity Inc. Website
**Status:** Approved

---

## Overview

Three behavioral design case studies (Dan Koe, Ali Abdaal, Justin Welsh) presented as:
1. A `WorkSection` homepage grid (Section 04) with portrait cards linking out
2. Individual case study pages at `/case-studies/[slug]` using the full 10-section template

Both surfaces use the established sacred geometry visual system throughout.

---

## Architecture

**Approach: Composable sections with static generation**

```
lib/
  case-studies.ts              ← typed data for all 3 creators

components/
  sections/
    WorkSection.tsx            ← homepage Section 04 grid (client, GSAP)
  case-study/
    CaseStudyHero.tsx          ← hero block with portrait + meta
    SituationSection.tsx       ← Section 1 of 10
    ChallengeSection.tsx       ← Section 2 of 10
    MovesSection.tsx           ← Section 3 of 10 (2×2 grid)
    LearningFlowSection.tsx    ← Section 4 of 10 (orbit-node SVG)
    NarrativeSection.tsx       ← Section 5 of 10
    WhatWorksSection.tsx       ← Section 6 of 10
    MissedOpsSection.tsx       ← Section 7 of 10
    CuriosityUpgradeSection.tsx ← Section 8 of 10
    TakeawaysSection.tsx       ← Section 9 of 10

app/
  case-studies/
    [slug]/
      page.tsx                 ← server component, generateStaticParams, passes data to sections
```

---

## Data Layer — `lib/case-studies.ts`

**TypeScript interface:**

```typescript
interface CaseStudy {
  slug: string
  index: string           // '01' | '02' | '03'
  name: string
  outcome: string         // 'Authority' | 'Trust' | 'Demand'
  color: string           // CSS value — tang/lav/teal per creator
  image: string           // /public/images/[slug].jpg
  audienceSize: string    // e.g. '2.1M'
  topPlatforms: string[]  // top 3 platforms

  headline: string        // "How [Name] Engineers [Outcome]"
  subhead: string
  meta: {
    platforms: string[]
    offers: string[]
    audienceType: string
    audienceSize: string
  }

  situation: string[]           // 3–5 paragraph strings
  situationQuote: string        // pull quote
  coreChallenge: string         // one paragraph
  behavioralMoves: {
    attention: string[]
    cognitiveAnchors: string[]
    knowledgePackaging: string[]
    authoritySignals: string[]
  }
  learningFlow: Array<{         // 4 transition steps
    from: string
    to: string
    how: string
  }>
  narrativeSystem: {
    stories: string[]
    description: string
    quote: string
  }
  whatWorks: string[]
  missedOpportunities: string[]
  curiosityUpgrade: string[]
  founderTakeaways: string[]
}
```

**Three entries:**

| Creator | Slug | Outcome | Color |
|---------|------|---------|-------|
| Dan Koe | `dan-koe` | Authority | `var(--tang)` / #ED773C |
| Ali Abdaal | `ali-abdaal` | Trust | `var(--lav)` / #9B8EC4 |
| Justin Welsh | `justin-welsh` | Demand | `#2EC4B6` (teal) |

**Helper:** `getCaseStudy(slug: string): CaseStudy | undefined`

---

## WorkSection — Homepage Grid

**File:** `components/sections/WorkSection.tsx`
**Placement:** Section 04, after `SystemSection`, before `AboutSection`

### Layout

```
Section header:
  "04 / Work"  eyebrow (tang)
  "Three architects of attention."  headline (t-headline)
  Brief subhead body copy

3-column card grid (gap: 24px)
```

### Card anatomy

```
┌──────────────────────────┐
│  [grayscale headshot]    │  ← CSS background-image, object-cover
│  [orbit SVG overlay]     │  ← 3 concentric rings + crosshairs + dot
│  [number top-left]       │  ← creator's accent color
│  [gradient fade bottom]  │  ← transparent → --black
├──────────────────────────┤
│  NAME (uppercase display)│
│  Engineers [Outcome]     │
│  [stat] [platforms]      │
│  Read Analysis ——→       │
└──────────────────────────┘
```

### Sacred geometry on cards

Each card photo area has an SVG orbit overlay (identical pattern to `AboutSection`):
- 3 concentric circles centered on face area (rx: 105 / 70 / 40)
- Horizontal + vertical axis lines (low opacity)
- Cross-hair markers at orbit intersections
- Center node dot
- All stroked in creator's accent color (tang / lav / teal)
- Gradient overlay fades image into card body

**Image fallback:** If headshot is missing, the orbit SVG on a dark gradient reads as intentional geometric decoration.

### Images required
```
/public/images/dan-koe.jpg
/public/images/ali-abdaal.jpg
/public/images/justin-welsh.jpg
```
Apply `filter: grayscale(100%) contrast(1.05)` via CSS.

### Animation (GSAP ScrollTrigger)
- Section header lines stagger up (`y: 24 → 0, opacity: 0 → 1`)
- Cards stagger up with delay (`y: 40 → 0, opacity: 0 → 1, stagger: 0.12s`)
- Card hover: `border-color` brightens to creator color, image scales `1.02`

---

## Case Study Pages — `/case-studies/[slug]`

**File:** `app/case-studies/[slug]/page.tsx`
Server component. Uses `generateStaticParams` to pre-render all 3 routes.
Calls `getCaseStudy(slug)`, triggers `notFound()` if slug is invalid.
Passes data as props to section components.

**Navigation:**
- `← Case Studies` back link at top
- `Next: [Name] →` at bottom (cycles through all 3)

### Page layout — Option C (full-bleed alternating sections)

Each of the 10 template sections is a distinct full-width block.
Alternating background: `var(--black)` / `rgba(0,0,0,0.15)` (subtle depth shift).
**Visual rhythm rule applied to every section:**
1. Bold pull quote — tang left-border accent (`border-left: 1.5px solid var(--tang)`)
2. Diagram — sacred geometry SVG or structured layout (see below)
3. Insight block — dark panel (`rgba(234,228,218,0.03)` bg, subtle border)

---

### Section 01 — Hero

**Layout:** 2-column (portrait left, title + meta right)

- **Left:** Headshot with orbit SVG overlay (same pattern as WorkSection cards, same accent color). Fades right into title column.
- **Right:** `← Case Studies` back link, outcome eyebrow, headline, meta strip (platforms / offers / audience type / size)

---

### Section 02 — The Situation

**Diagram:** `ThinLineSystem` `system` variant, ghosted (low opacity) top-right corner — suggests depth/layering/complexity.
**Pull quote:** `situationQuote` from data.
**Insight block:** Single-sentence market position summary.

Content: 3–5 paragraphs from `situation[]`.

---

### Section 03 — Core Challenge

**Diagram:** Friction type badge row — all 5 friction types (attention / trust / clarity / identity / decision) rendered as pill tags. The ones that apply to this creator are highlighted in creator accent color; others are dimmed.
**Pull quote:** Derived from `coreChallenge`.
**Insight block:** Which friction is the primary lever.

---

### Section 04 — Behavioral Moves

**Diagram:** 2×2 grid using the Grid symbol (thin 1px lines creating quadrants):

```
┌─────────────────┬─────────────────┐
│ ATTENTION       │ COGNITIVE       │
│ STRATEGY        │ ANCHORS         │
│ bullet bullets  │ bullet bullets  │
├─────────────────┼─────────────────┤
│ KNOWLEDGE       │ AUTHORITY       │
│ PACKAGING       │ SIGNALS         │
│ bullet bullets  │ bullet bullets  │
└─────────────────┴─────────────────┘
```

**Pull quote:** Most striking anchor phrase from `cognitiveAnchors`.
**Insight block:** The single most leveraged behavioral move.

---

### Section 05 — Learning Flow

**Diagram:** Horizontal SVG orbit-node chain — 5 nodes (Confused → Curious → Understanding → Belief → Action):
- Each node: 3 concentric circles (orbit rings) + center dot
- Nodes progressively brighten toward creator accent color as they approach ACTION
- Final node (ACTION) glows — uses the Glow = breakthrough symbol
- Connector lines between nodes with arrowheads
- Transformation mechanism label below each connector

**Pull quote:** The transition that does the most work (usually Curious → Understanding).
**Insight block:** The step most creators get wrong.

---

### Section 06 — Narrative System

**Diagram:** Story pill tags — all 6 narrative archetypes (Rebellion / Mastery / Simplicity / Wealth / Freedom / Intelligence). Active stories for this creator highlighted; dominant story largest.
**Pull quote:** `narrativeSystem.quote` from data.
**Insight block:** Why this narrative works for this specific audience.

---

### Section 07 — What Works

No custom diagram — the bullet list is the content.
Tang dot (`●`) before each bullet.
**Pull quote:** The single most transferable insight.
**Insight block:** Pattern that appears across all three creators.

---

### Section 08 — Missed Opportunities

No custom diagram.
Muted bullet list (lower opacity, analytical tone — never snarky).
**Pull quote:** The most significant gap.
**Insight block:** What fixing this gap would unlock.

---

### Section 09 — The Curiosity Upgrade

**Diagram:** Small triangle SVG (direction / forward motion symbol — mirrors `CTASection`) positioned as section accent.
Bullets prefixed with `→`.
**Pull quote:** The single highest-leverage change.
**Insight block:** Why behavioral architecture makes this upgrade possible.

---

### Section 10 — Founder Takeaways

**Diagram:** None — the numbered list IS the visual.
5 large numbered insights in display font, widely spaced.
Each takeaway is one punchy sentence.
Final element: small `Orb` component (glow = breakthrough / resolved signal).

---

## Visual System Mapping

| Symbol | Used in |
|--------|---------|
| Concentric circles (depth) | Card orbit overlays, hero portrait overlay, section backgrounds |
| Grid (architecture) | Behavioral Moves 2×2 quadrants |
| Orbit nodes brightening (noise→signal) | Learning Flow chain |
| Triangle (direction) | Curiosity Upgrade section accent |
| Glow / Orb (breakthrough) | Learning Flow ACTION node, Takeaways closing |
| Cross-hair markers (precision) | Card orbit overlays, section dividers |
| ThinLineSystem system variant (complexity) | Situation section background ghost |
| Horizontal bands (cognitive layers) | Section alternating backgrounds |

---

## Routing

| URL | Content |
|-----|---------|
| `/` | Homepage with WorkSection grid |
| `/case-studies/dan-koe` | Dan Koe full case study |
| `/case-studies/ali-abdaal` | Ali Abdaal full case study |
| `/case-studies/justin-welsh` | Justin Welsh full case study |

All routes statically generated at build time via `generateStaticParams`.

---

## page.tsx Update

Add `WorkSection` import and render between `SystemSection` and `AboutSection`:

```tsx
import { WorkSection } from '@/components/sections/WorkSection'
// ...
<SystemSection />
<WorkSection />
<AboutSection />
```

---

## Out of Scope (this spec)

- Global navigation / header
- Responsive / mobile pass
- `/case-studies` index listing page
- 4th+ case study additions
- Contact form integration on case study pages
