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
  case-studies.ts                    ← typed data for all 3 creators

components/
  sections/
    WorkSection.tsx                  ← homepage Section 04 grid (client, GSAP)
  case-study/                        ← ALL files here are 'use client'
    CaseStudyHero.tsx
    SituationSection.tsx
    ChallengeSection.tsx
    MovesSection.tsx
    LearningFlowSection.tsx
    NarrativeSection.tsx
    WhatWorksSection.tsx
    MissedOpsSection.tsx
    CuriosityUpgradeSection.tsx
    TakeawaysSection.tsx

app/
  case-studies/
    [slug]/
      page.tsx                       ← server component only; imports CaseStudy* client components
```

**Client/Server boundary:** `app/case-studies/[slug]/page.tsx` is a server component. Every file in `components/case-study/` must have `'use client'` at the top, as they all use `useEffect` + `useRef` for GSAP ScrollTrigger animations — consistent with every existing section component.

---

## Data Layer — `lib/case-studies.ts`

**TypeScript interface:**

```typescript
interface LearningStep {
  from: string   // e.g. 'Confused'
  to: string     // e.g. 'Curious'
  how: string    // the mechanism sentence
}

interface CaseStudy {
  slug: string
  index: string           // '01' | '02' | '03'
  name: string
  outcome: string         // 'Authority' | 'Trust' | 'Demand'
  color: string           // CSS var — must be a token from the brand palette
  image: string           // path under /public — e.g. '/images/dan-koe.jpg'

  headline: string        // "How [Name] Engineers [Outcome]"
  subhead: string
  meta: {
    platforms: string[]   // e.g. ['X / Twitter (~800K)', 'YouTube (~450K)']
    offers: string[]
    audienceType: string
    audienceSize: string  // e.g. '2.1M+ across platforms'
  }

  // Section 02
  situation: string[]           // 3–5 paragraph strings
  situationQuote: string

  // Section 03
  coreChallenge: string         // one paragraph
  frictionTypes: string[]       // subset of: ['attention','trust','clarity','identity','decision']
                                // these are highlighted; others are dimmed

  // Section 04
  behavioralMoves: {
    attention: string[]
    cognitiveAnchors: string[]
    knowledgePackaging: string[]
    authoritySignals: string[]
  }

  // Section 05 — exactly 4 entries (4 transitions = 5 nodes)
  learningFlow: [LearningStep, LearningStep, LearningStep, LearningStep]

  // Section 06
  narrativeSystem: {
    stories: string[]     // all active story archetypes
    dominant: string      // must match one entry in stories[] — rendered largest
    description: string
    quote: string
  }

  // Sections 07–10
  whatWorks: string[]
  missedOpportunities: string[]
  curiosityUpgrade: string[]
  founderTakeaways: string[]    // exactly 5 entries
}
```

**Three entries — color assignments use brand palette tokens only:**

| Creator | Slug | Outcome | Color token | Hex |
|---------|------|---------|-------------|-----|
| Dan Koe | `dan-koe` | Authority | `var(--tang)` | `#ED773C` |
| Ali Abdaal | `ali-abdaal` | Trust | `var(--lav)` | `#808BC5` |
| Justin Welsh | `justin-welsh` | Demand | `var(--must)` | `#EAC119` |

Note: No bright teal exists in the brand token system. `--tea` (`#245E55`) is a dark muted green unsuitable as a card accent on dark backgrounds. Mustard (`--must`) is the correct third choice — it's distinct, readable, and semantically maps to "structure/cognition" in the layer system.

**Helper:** `getCaseStudy(slug: string): CaseStudy | undefined`

---

## WorkSection — Homepage Grid

**File:** `components/sections/WorkSection.tsx` — `'use client'`
**Placement:** Section 04, after `SystemSection`, before `AboutSection` in `app/page.tsx`

### Layout

```
Section header:
  "04 / Work"  eyebrow (tang, opacity 0.6)
  "Three architects of attention."  headline (t-headline)
  One-line subhead in t-body

3-column card grid (gap: 24px, maxWidth: 1200px, margin: 0 auto, padding: 0 60px)
```

### Card anatomy

```
┌──────────────────────────┐
│  [grayscale headshot]    │  ← CSS background-image + object-fit:cover
│  [orbit SVG overlay]     │  ← 3 concentric rings + crosshairs + center dot
│  [num top-left]          │  ← '01' in creator's color
│  [gradient fade bottom]  │  ← transparent → var(--black)
├──────────────────────────┤
│  NAME (t-headline caps)  │
│  Engineers [Outcome]     │  ← t-body, opacity 0.45
│  [2.1M stat]             │  ← 26px display font, creator color
│  [platform string]       │  ← t-eyebrow, opacity 0.25
│  Read Analysis ——→       │  ← t-eyebrow, creator color, opacity 0.7
└──────────────────────────┘
```

### Sacred geometry — orbit overlay on each card photo

Inline SVG absolutely positioned over the photo area (`viewBox="0 0 300 375"`, `fill="none"`, `pointer-events:none`):
- 3 concentric circles centered at `cx=150 cy=130` with `r=105/70/40`
- Horizontal axis line `y1=130 y2=130`
- Vertical axis line `x1=150 x2=150`
- Cross-hair markers at 4 orbit intersections (left/right/top, 12px wide)
- Center node dot `r=2.5`
- All elements stroked in creator's accent color at low opacity (0.18–0.38)
- Gradient overlay div fades photo into card body: `linear-gradient(to bottom, transparent 45%, var(--black) 100%)`

**Headshot treatment:** `filter: grayscale(100%) contrast(1.05)` via inline style on the `<img>` element.

**Image fallback:** If `src` 404s (`onError`), hide the `<img>` — the orbit SVG on the dark gradient reads as intentional geometric art. No broken image state.

### Images required (user must source and place)

```
/public/images/dan-koe.jpg
/public/images/ali-abdaal.jpg
/public/images/justin-welsh.jpg
```

### Hover behavior — CSS transitions (not GSAP)

Use inline `style` objects driven by a `hoveredIndex: number | null` React state:
- Card border: `1px solid rgba(creator-color, 0.08)` → `1px solid rgba(creator-color, 0.35)` on hover
- Image: `transform: scale(1)` → `transform: scale(1.02)` on hover (`transition: transform 0.4s ease`)
- `Read Analysis` link opacity: `0.7` → `1.0`

GSAP is used only for the scroll-entrance animation (cards stagger up), not for hover states.

### Animation — GSAP ScrollTrigger (scroll entrance only)

```typescript
// Section header lines stagger in
tl.from(headerLines, { opacity: 0, y: 24, duration: dur.base, stagger: 0.1, ease: ease.out })

// Cards stagger up
tl.from(cards, { opacity: 0, y: 40, duration: dur.slow, stagger: 0.12, ease: ease.out }, '-=0.4')
```

---

## Case Study Pages — `/case-studies/[slug]`

### `app/case-studies/[slug]/page.tsx` — server component

```typescript
import { notFound } from 'next/navigation'
import { caseStudies, getCaseStudy } from '@/lib/case-studies'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
// ... other section imports

export async function generateStaticParams() {
  return caseStudies.map(cs => ({ slug: cs.slug }))
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug)
  if (!cs) notFound()
  return (
    <>
      <CaseStudyHero data={cs} />
      {/* ... remaining sections */}
    </>
  )
}
```

**Layout inheritance:** The root `app/layout.tsx` wraps this route. The existing `Nav` and `Footer` components will appear — this is acceptable for now. A case-study-specific layout is out of scope for this spec.

**Navigation within page:**
- `← Case Studies` link at top of `CaseStudyHero` — links to `/` (homepage WorkSection anchor)
- `Next: [Name] →` at bottom of `TakeawaysSection` — cycles to next case study slug

---

### Page layout — Option C (full-bleed alternating sections)

10 sections as distinct full-width blocks. Alternating backgrounds:
- Odd sections: `var(--black)` (`#1D1D1B`)
- Even sections: `rgba(0,0,0,0.15)` over `var(--black)`

**Visual rhythm rule — every section must have all three:**
1. **Pull quote** — `border-left: 1.5px solid [creator-color]`, `background: rgba(creator-color, 0.03)`, italic, 16–18px
2. **Diagram** — sacred geometry SVG or structured layout (specified per section below)
3. **Insight block** — `background: rgba(234,228,218,0.03)`, `border: 1px solid rgba(234,228,218,0.07)`, with a `[creator-color]` highlighted key term

All section components receive `data: CaseStudy` as prop.

---

### Section 01 — Hero (`CaseStudyHero`)

**Layout:** 2-column grid (`280px 1fr`), `minHeight: 480px`

**Left column:** Portrait image with orbit SVG overlay
- Same orbit pattern as WorkSection card (3 concentric rings + crosshairs + center dot in creator color)
- Image: `object-fit: cover`, `filter: grayscale(100%) contrast(1.05)`
- Gradient fades right edge: `linear-gradient(to right, transparent 60%, var(--black) 100%)`
- **Fallback:** If image missing, orbit SVG over dark gradient (`linear-gradient(135deg, #2a2928, #1a1918)`) — section still renders correctly

**Right column:** `← Case Studies` back link, `"[index] / [Outcome]"` eyebrow in creator color, headline in `t-headline`, meta strip (platforms / offers / audience type + size)

---

### Section 02 — Situation (`SituationSection`)

**Diagram:** `ThinLineSystem` `system` variant, positioned top-right:
```tsx
<div style={{ position: 'absolute', top: -40, right: -40, width: 280, height: 280, opacity: 0.06, pointerEvents: 'none' }}>
  <ThinLineSystem variant="system" color={data.color} opacity={1} />
</div>
```
The 280×280 size and `-40px` offset makes it read as a corner accent rather than full-bleed overlay.

**Pull quote:** `data.situationQuote`
**Insight block:** Single-sentence market position summary (hardcoded per creator in component)

Content: Paragraphs from `data.situation[]`

---

### Section 03 — Core Challenge (`ChallengeSection`)

**Diagram:** Friction type pill row. All 5 types rendered; `data.frictionTypes[]` determines which are highlighted:

```tsx
const ALL_FRICTION = ['attention', 'trust', 'clarity', 'identity', 'decision']
// Pills: active ones → creator color, 90% opacity
//        inactive ones → shell color, 15% opacity
```

**Pull quote:** First sentence of `data.coreChallenge`
**Insight block:** "Primary lever: [first item in frictionTypes]"

Content: `data.coreChallenge` paragraph

---

### Section 04 — Behavioral Moves (`MovesSection`)

**Diagram:** 2×2 grid — the Grid symbol (thin 1px lines creating quadrants):

```
┌─────────────────┬─────────────────┐
│ ATTENTION       │ COGNITIVE       │
│ STRATEGY        │ ANCHORS         │
│ · bullets       │ · bullets       │
├─────────────────┼─────────────────┤
│ KNOWLEDGE       │ AUTHORITY       │
│ PACKAGING       │ SIGNALS         │
│ · bullets       │ · bullets       │
└─────────────────┴─────────────────┘
```
Grid lines: `1px solid rgba(234,228,218,0.06)`. Each cell: `padding: 20px 24px`. Quadrant label in `t-eyebrow` at creator color.

**Pull quote:** Most striking item from `data.behavioralMoves.cognitiveAnchors`
**Insight block:** "Most leveraged move: [first item in attention array]"

---

### Section 05 — Learning Flow (`LearningFlowSection`)

**Diagram:** Horizontal SVG orbit-node chain. `viewBox="0 0 640 100"`, `width: 100%`.

5 nodes at x positions `[40, 160, 280, 400, 520]`, all at `y=50`.

Per node:
- 3 concentric circles (`r=24/16/7`) — stroke opacity increases with progression
- Center dot (`r=3`)
- Nodes 1–5 progressively shift stroke/fill from `rgba(234,228,218,0.08)` → full creator color
- Final node (ACTION) gets glow halo circle (`r=14`, `fill: creator-color, opacity:0.08`) — the Glow = breakthrough symbol

Connectors:
- `<line>` between each node pair, `stroke: creator-color, opacity:0.25, strokeWidth:0.75`
- Small arrowhead polygon at midpoint of each connector
- `how` text from `learningFlow[i]` as `<text>` label centered below each connector

Stage labels below nodes (y=88): `from` of step[0], then `to` of each step.

**Pull quote:** `learningFlow[1].how` (Curious → Understanding — the deepest transition)
**Insight block:** "The step most creators skip: [learningFlow[2].from → learningFlow[2].to]"

---

### Section 06 — Narrative System (`NarrativeSection`)

**Diagram:** All 6 archetype pills (`Rebellion / Mastery / Simplicity / Wealth / Freedom / Intelligence`):
- Active (`data.narrativeSystem.stories[]`): creator color, 80% opacity, `font-size: 11px`
- Dominant (`data.narrativeSystem.dominant`): creator color, 100% opacity, `font-size: 14px`, `letter-spacing: 0.18em`
- Inactive: shell color, 12% opacity, `font-size: 10px`

**Pull quote:** `data.narrativeSystem.quote`
**Insight block:** Why this narrative works for this specific audience (hardcoded per creator)

Content: `data.narrativeSystem.description`

---

### Section 07 — What Works (`WhatWorksSection`)

No custom diagram — bullet list is the primary content.
- Tang dot `●` prefix before each bullet, `font-size: 9px`
- Bullets from `data.whatWorks[]`

**Pull quote:** Most transferable insight (first item in `whatWorks`)
**Insight block:** "Transferable pattern: [first item]"

---

### Section 08 — Missed Opportunities (`MissedOpsSection`)

- Bullets from `data.missedOpportunities[]`
- Muted styling: shell color at 40% opacity, analytical not snarky
- No colored prefix — intentionally quieter than Section 07

**Pull quote:** Most significant gap (first item)
**Insight block:** "What fixing this unlocks: [contextual, hardcoded per creator]"

---

### Section 09 — Curiosity Upgrade (`CuriosityUpgradeSection`)

**Diagram:** Small triangle SVG (`width: 28px, height: 26px`) as section accent, identical to the one inside `CTASection`'s focal circle — the direction/forward motion symbol. Positioned after the eyebrow, before bullet list.

- Bullets from `data.curiosityUpgrade[]`, each prefixed with `→`
- Prefix in creator color

**Pull quote:** First item in `curiosityUpgrade`
**Insight block:** "Why behavioral architecture enables this: [hardcoded per creator]"

---

### Section 10 — Takeaways (`TakeawaysSection`)

**Layout:** 5 numbered insights, widely spaced, in display font.

```tsx
{data.founderTakeaways.map((t, i) => (
  <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'baseline', paddingBottom: '28px', borderBottom: '1px solid rgba(234,228,218,0.05)' }}>
    <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: data.color, opacity: 0.5, letterSpacing: '0.2em', minWidth: '24px' }}>
      {String(i + 1).padStart(2, '0')}
    </span>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.05em', lineHeight: 1.3 }}>{t}</p>
  </div>
))}
```

Closing element: `<Orb size={10} />` centered below list — the Glow = breakthrough / resolved signal.

**"Next" navigation:**
```tsx
<Link href={`/case-studies/${nextStudy.slug}`}>Next: {nextStudy.name} →</Link>
```

---

## Behavioral Symbol Progression

**Source of truth:** `lib/symbols.ts` — all SVG geometry, colors, and semantic definitions live there.

Every case study section renders its assigned symbol as a section accent (top-right corner, `width: 40px`, `opacity: 0.18`). On scroll entry, the symbol draws in via `strokeDashoffset` animation (0.6s, `ease.inOut`). The symbol brightens to `opacity: 0.55` while the section is in view, dims back on exit.

The reader experiences a complete arc from Confusion → Authority across 10 sections:

| Section | Symbol | Geometry | Accent color |
|---------|--------|----------|-------------|
| 01 Hero | Confusion | Scattered Dots | shell @ 20% — reader arrives in the noise |
| 02 Situation | Awareness | Incomplete Circle | `--pink` — the gap becomes visible |
| 03 Challenge | Awareness | Incomplete Circle | `--pink` deeper — friction named precisely |
| 04 Behavioral Moves | Insight | Vesica Piscis | `--must` — behavior × design intersect |
| 05 Learning Flow | Action | Triangle | `--tea` — direction chosen, movement begins |
| 06 Narrative System | Framework | Flower of Life | `--lav` — the repeating pattern beneath everything |
| 07 What Works | System | Isometric Cube | `--lav` — crystallized, solid, repeatable |
| 08 Missed Opportunities | Awareness | Incomplete Circle | `--pink` @ 40% — where signal breaks down |
| 09 Curiosity Upgrade | System | Isometric Cube | creator color — the structure they could build |
| 10 Takeaways | Authority | Radiant Circle | creator color, full opacity — signal transmitted |

**Implementation note:** Use `getSectionSymbol(sectionKey)` from `lib/symbols.ts` to retrieve the correct symbol for each section. Pass `symbol.color` and `symbol.svgData.elements` to the `<Symbol />` component at `components/geo/Symbol.tsx` (to be built).

---

## Visual System Mapping (complete)

| Symbol | Used in |
|--------|---------|
| Concentric circles (depth) | WorkSection card orbit overlays, hero portrait overlay |
| Grid (architecture) | Behavioral Moves 2×2 quadrants |
| Orbit nodes brightening (noise→signal) | Learning Flow chain, ACTION node glow |
| Triangle (direction) | Curiosity Upgrade section accent |
| Glow / Orb (breakthrough) | Learning Flow ACTION node, Takeaways closing |
| Cross-hair markers (precision) | Card and hero orbit overlays |
| ThinLineSystem system variant (complexity) | Situation section background ghost |
| Horizontal bands (cognitive layers) | Section alternating backgrounds |

---

## Routing

| URL | Render |
|-----|--------|
| `/` | Homepage with WorkSection grid (Section 04) |
| `/case-studies/dan-koe` | Dan Koe full case study — static |
| `/case-studies/ali-abdaal` | Ali Abdaal full case study — static |
| `/case-studies/justin-welsh` | Justin Welsh full case study — static |

All three routes pre-rendered at build time via `generateStaticParams`.

---

## `app/page.tsx` update

```tsx
import { WorkSection } from '@/components/sections/WorkSection'
// Add between SystemSection and AboutSection:
<SystemSection />
<WorkSection />
<AboutSection />
```

---

## Out of Scope

- Global navigation / header
- Responsive / mobile pass
- `/case-studies` index listing page
- 4th+ case study additions
- Case-study-specific layout.tsx
