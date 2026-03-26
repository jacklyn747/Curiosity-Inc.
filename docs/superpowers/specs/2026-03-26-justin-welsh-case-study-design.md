# Justin Welsh Case Study — Design Spec
**Date:** 2026-03-26
**Route:** `/work/justin-welsh-conversion-design`
**Phase:** 10
**File:** `src/pages/JustinWelshCaseStudy.tsx`

---

## 1. The Curiosity Inc. Frame

This case study — and every case study on this site — operates on two simultaneous levels:

**Level 1 — The business argument:** Aligning instructional design (ID) principles with the marketing funnel produces superior retention, identity shift, and downstream conversion. The funnel is not the enemy. Misalignment is.

**Level 2 — The civilisational argument:** Justin Welsh is not a content creator with a conversion problem. He is a professor of solopreneurship operating without a curriculum. The ideas he teaches — about autonomy, independent work, and building a life around your values — are more important than any single transaction. Structured correctly, they outlast him. They become the standard against which a generation of independent workers measures its understanding of what's possible.

The marketing funnel alone cheapens this. ID principles alone don't pay for the work. The named, licensed framework — the final deliverable of Curiosity Inc.'s engagement — is what makes the ideas immortal.

**The full value chain:**
1. Recognise the creator as professor
2. Audit the curriculum against ID principles
3. Align the funnel with those principles (retention → identity shift → conversion, in that order)
4. Name and formalise the methodology as licensable IP

This is the argument the case study makes. Act 05 is where it lands.

---

## 2. Profile Card Template (Established)

All three case studies share this exact structure. Do not deviate.

| Element | Value |
|---|---|
| Identifier | `✦ Curiosity Inc. / Case Study 02` |
| Category | `CONVERSION DESIGN` |
| Name | `Justin Welsh` |
| Hook | *"What if the ideas Justin Welsh teaches outlive the platforms he teaches them on?"* |
| Portrait | `JW` initials, Teal at 22% opacity, editorial placeholder (identical structure to DK) |
| Metadata col 1 | Domain → Solopreneurship |
| Metadata col 2 | Approach → Conversion Design |
| Metadata col 3 | Flagship → The Operating System |
| Metadata col 4 | Est. → 2019 |
| Metadata col 5 | Reach → 500K+ Followers |

The hook is a "What if" question that poses the case study's central thesis. This pattern holds for all three case studies:
- Dan Koe: *"What if 2.3M followers were students, not subscribers?"*
- Justin Welsh: *"What if the ideas Justin Welsh teaches outlive the platforms he teaches them on?"*
- Tiago Forte: *"What if the Second Brain already had a curriculum — and nobody had built it yet?"*

**Profile card bottom band — Network Bandwidth + Target Topology** (identical structure to DK, different data):

Left panel — "Network Bandwidth":
```
LinkedIn     500,000   pct: 0.76
Newsletter   150,000   pct: 0.23
X (Twitter)   35,000   pct: 0.05
```

Right panel — "Target Topology":
> *"The corporate professional who wants to build a one-person business and escape the nine-to-five permanently."*
> — Justin Welsh's own description of his audience

Concept study disclaimer (identical to DK):
> ✦ Concept study — All projections are analytical estimates. Curiosity Inc. has no affiliation with Justin Welsh.

**EditorialPortrait note:** Copy the `EditorialPortrait` component from `DanKoeCaseStudy.tsx`. Change the SVG `<text>` content from `DK` to `JW`. The gradient ID `portrait-bg` should be renamed to `portrait-bg-jw` to avoid SVG gradient ID collision when both case studies exist in the DOM simultaneously.

---

## 3. Five-Act SCQA Structure

### Act 01 — Situation / The Professor
**SCQA Stage:** Situation
**Purpose:** Establish Justin Welsh as a professor with a world-class delivery mechanism and a body of ideas worth preserving. Plant the question before the complication arrives.

**Components:** Profile card (template above) + narrative text band.

**Narrative band copy direction:**
- Opens with the scale: 500K+ LinkedIn followers, 150K+ newsletter subscribers, $5M+ in revenue, two courses with thousands of students.
- The craft observation: every post delivers one clean insight. One lesson. One clear takeaway. The delivery is exceptional.
- The seed of the complication: the ideas land. They inspire. The tab closes. Most of the audience does not change how they work.
- Close with the diagnostic frame: this is not a reach problem. Not a content problem. Not a marketing problem. It is a curriculum problem.

**Tone:** Respectful, precise, not critical. The framing is recognition, not diagnosis. He built something remarkable. The question is what it becomes.

---

### Act 02 — Situation Continued / The Curriculum Audit
**SCQA Stage:** Situation (deepening)
**Purpose:** Map Justin's current content structure against Merrill's First Principles of Instruction. Make the ID gap visible and concrete. Establish Curiosity Inc.'s analytical frame.

**Component:** Custom ID Audit Grid (inline JSX — not a reused component). A structured five-row table that feels like a clinical audit document, distinct from the Scaffold used in Act 03.

**Why not FlowPulse or Scaffold here:** FlowPulse shows behavioral flow, not structural diagnosis. Using Scaffold in both Acts 02 and 03 would blur the visual distinction between diagnosis and solution.

**Animation:** Row stagger using `useScrollTrigger` hook. Import from `'../hooks/useScrollTrigger'`. The hook handles its own IntersectionObserver internally — no module-level ScrollTrigger registration needed. Use a `useEffect` with GSAP `fromTo` on `.id-audit-row` class names, triggered when `inView` becomes true. Pattern identical to the profile band stagger in `DanKoeCaseStudy.tsx` but scroll-triggered rather than mount-triggered.

**ID Audit Grid structure:**

| Merrill's Principle | What it requires | Justin's current content | Status |
|---|---|---|---|
| **Activation** | Connect new knowledge to existing experience and goals | Consistent — relatable solopreneur scenarios anchor every post | ✅ Present |
| **Demonstration** | Show how the concept works in context with worked examples | Consistent — tactical before/after examples in every post | ✅ Present |
| **Application** | Prompt the learner to use the knowledge immediately | Almost entirely absent — insight is delivered, practice is never designed | ❌ Absent |
| **Feedback** | Mechanism for the learner to check and correct understanding | Absent — no designed feedback loop exists in the content architecture | ❌ Absent |
| **Integration** | Help the learner connect the new skill to their existing world and identity | Absent — no transfer prompts, no "now apply this to your situation" | ❌ Absent |

**Visual styling of the grid:**
- Each row renders as a styled band with a left accent (same 4px border pattern as Scaffold)
- Teal accent = present, Orange accent = partial, muted (#555) accent = absent
- Status indicator: small monospace label at right (`PRESENT` in Teal, `ABSENT` in Pink at low opacity)
- The grid enters with staggered row animation (GSAP, same pattern as profile bands)
- No hover expand needed — the table is self-contained

**Narrative above the grid:**
- Introduce Merrill's First Principles as the framework used
- One sentence on why it's the right lens: it isolates the phases of instruction that produce durable learning, not just momentary inspiration
- Frame the audit as recognition, not criticism: "here is the intellectual architecture beneath your content, and here is what's missing for it to endure"

**Narrative below the grid:**
- The diagnosis in plain language: Justin Welsh has built a world-class lecture. There is no lab. No practicum. No transfer design.
- The consequence: his audience feels changed after consuming his content. Most of them are not changed. Inspiration without application does not produce behavioral or identity shift.
- The question this raises: what would his content architecture look like if the missing phases were designed?

---

### Act 03 — Question / The Commitment Ladder
**SCQA Stage:** Question
**Purpose:** Show what a designed ID-aligned content architecture looks like for Justin Welsh specifically. The Commitment Ladder bridges the ID framework (Act 02) and the business funnel — demonstrating that alignment, not replacement, is the answer.

**Component:** `Scaffold` — four bands, `direction="up"` (bottom to top, foundational first).

**The Commitment Ladder:**

| Band | Level | `accentColor` prop | ID Principle mapped | Current state | Designed state |
|---|---|---|---|---|---|
| ATTENTION | `foundational` | `'structure'` (Teal) | Activation — content resonates with who the audience wants to become | ✅ Abundant. Posts consistently name and celebrate the solopreneur identity. | Formalised as the entry point. Every piece of content is an activation event. |
| MICRO-ACT | `intermediate` | `'context'` (Grey) | Demonstration → Application bridge — small acts of alignment that build toward larger commitment | ⚠️ Accidental. Saves, replies, DMs happen but aren't designed as commitment steps. | Each post ends with a designed micro-commitment: a prompt to act as a solopreneur before believing it fully. |
| INTENT | `advanced` | `'transformation'` (Orange) | Feedback — the learner creates productive dissonance, recognises the gap between where they are and where the identity requires them to be | ❌ Absent. No designed "I'm seriously considering this" moment exists. | A structured intent signal: a quiz, a self-audit, a diagnostic that makes the audience confront the gap explicitly. |
| IDENTITY / ACTION | `mastery` | `'insight'` (Pink) | Integration — the learner adopts the identity because the architecture made it feel inevitable, not aspirational | ❌ Absent as designed destination. Purchase happens when someone happens to be in the right mood. | Purchase is the natural confirmation of an identity already in formation. The commitment ladder makes the purchase feel like the next logical step, not a decision. |

The `Scaffold` component's `ScaffoldBand` interface accepts `accentColor` as `'structure' | 'transformation' | 'insight' | 'context'`. The `level` prop drives the label only; `accentColor` drives the visual border. Use the `accentColor` values above — do NOT pass `'grey'` or any other string.

**expandedContent per band:** Each band expands to show a concrete example of what the designed rung looks like in Justin's context — a specific post format, a specific prompt, a specific mechanic.

**Narrative above the Scaffold:**
- The bridge sentence: "The marketing funnel doesn't disappear. It gets a curriculum."
- Frame the ladder as the point where ID principles and the funnel stop working against each other and start reinforcing each other.

**Narrative below the Scaffold:**
- The insight: conversion is not the problem. The absence of designed steps before conversion is the problem.
- The implication: when each rung is intentional, the audience doesn't decide to buy. They arrive at purchase having already made a hundred smaller commitments that made it inevitable.

---

### Act 04 — Answer / The Architecture
**SCQA Stage:** Answer
**Purpose:** Show the measurable outcome of aligning the funnel with ID principles. The hero metric carries the business argument. The DeltaBridge shows the mechanism.

**Component 1: `Lens`**

```typescript
<Lens
  value="5.1×"
  sublabel="SUBSCRIBER LTV MULTIPLIER"
  beforeLabel={["CURRENT", "ARCHITECTURE"]}
  afterLabel={["COMMITMENT", "CURRICULUM"]}
/>
```

Left circle = Current Architecture (content → inspiration → accidental conversion).
Right circle = Commitment Curriculum (activation → micro-act → intent → identity/action).
Intersection = the overlap: great content that now has a designed path through it.

**Why LTV, not conversion rate:** LTV captures all three conversion modes simultaneously — initial purchase (lower friction), repeat purchase (identity-consistent behaviour), and advocacy (identity adopters recruit their network). Conversion rate only captures the first. LTV is the argument that ID alignment improves the business at every level, not just the checkout.

**Component 2: `DeltaBridge`**

```typescript
<DeltaBridge
  metrics={[
    {
      label: "Micro-Commitment Rate",
      category: "Learning Behaviour",
      before: "4%",
      after: "41%",
      delta: "+925%",
      magnitude: 0.95,
    },
    {
      label: "Identity Adoption Rate",
      category: "Learning Outcome",
      before: "2%",
      after: "17%",
      delta: "+750%",
      magnitude: 0.90,
    },
    {
      label: "Subscriber LTV",
      category: "Business Outcome",
      before: "$28",
      after: "$143",
      delta: "+411%",
      magnitude: 0.85,
    },
  ]}
/>
```

**Deliberate category labelling and order:** Learning Behaviour first, Learning Outcome second, Business Outcome last. The eye reads the mechanism (learning metrics) before arriving at the result (LTV). This makes the ID argument visually: the business outcome improved *because* the learning outcomes improved. The DeltaBridge renders rows in array order — the array order above is the final render order.

**Narrative between Lens and DeltaBridge:**
- The mechanism: when the ladder is designed, conversion stops being a cliff and becomes a gradient.
- Not because the CTA changed. Not because the marketing improved. Because everything before the CTA was built to make the purchase feel inevitable.

**Narrative below DeltaBridge:**
- Note the category labels explicitly: a learning behaviour metric improved by 925% and a learning outcome metric improved by 750%. The business metric is the downstream effect of those.
- This is the ID argument in numbers.

---

### Act 05 — Answer Continued / The Framework
**SCQA Stage:** Answer (resolution)
**Purpose:** Land the legacy argument. Name what Justin Welsh's work becomes when properly structured. Close not on metrics but on meaning.

**No visualisation component.** This act is pure editorial — typography, spacing, and restraint. The visual language of Act 05 is silence after signal.

**Narrative structure:**

**Opening — The reframe:**
Justin Welsh did not build a content business. He built a curriculum for a generation of people rethinking how they work and live. The distinction matters because the first is measured by transactions. The second is measured by transformation.

**The framework naming:**
When the ID principles are applied and the funnel is aligned, what emerges is a formalised methodology that can be named, documented, and licensed. For Justin Welsh, this methodology — the structured progression from autonomous aspiration to practised solopreneurship — has a name. It is his most valuable asset. Not the courses. Not the newsletter. The framework those courses and newsletters deliver.

*[Note to implementer: The framework name is intentionally left to be discovered in collaboration with the creator. The spec names the shape of it: a progression framework for independent work, structured as a four-phase curriculum, licensable to business schools, corporate L&D, and entrepreneurship programs.]*

**The legacy statement:**
Future practitioners of independent work will not cite a LinkedIn post. They will cite the framework. The methodology will outlive the platform, the algorithm, and the content calendar. It will be taught by others under licence. It will be built upon. This is what Curiosity Inc. builds: not better marketing, but intellectual infrastructure that endures.

**The implicit CTA (no button, no form):**
The case study closes with one line. Typography spec:
- Font: `var(--font-display)`, italic
- Size: `clamp(16px, 2vw, 20px)`
- Colour: `var(--color-text)` at 35% opacity
- Alignment: centred
- Margin top: `120px`
- No border, no background, no button chrome

> *"If your work deserves to outlast you — it probably needs a curriculum."*

**Back navigation** (three-slot layout, identical to DK):

Left slot — previous case study link:
```tsx
<Link to="/work/dan-koe-brand-architecture"
  style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
    letterSpacing: '0.1em', color: 'var(--color-context)',
    opacity: 0.35, textDecoration: 'none' }}
  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
  onMouseLeave={e => e.currentTarget.style.opacity = '0.35'}
>
  ← Previous: Dan Koe
</Link>
```

Centre slot — back to work section:
```tsx
<Link to="/#work"
  style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--color-structure)', textDecoration: 'none' }}
>
  Back to The Laboratory
</Link>
```

Right slot — next case study (Tiago Forte not yet built — render as muted span, not Link):
```tsx
<span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
  letterSpacing: '0.1em', color: 'var(--color-context)',
  opacity: 0.3 }}>
  Next: Tiago Forte →
</span>
```
When Tiago Forte is built, replace `<span>` with `<Link to="/work/tiago-forte-cognitive-interfaces">` and add the same hover opacity pattern as the left slot.

---

## 4. Technical Requirements

### Routing
- New file: `src/pages/JustinWelshCaseStudy.tsx`
- Route already exists in `src/App.tsx`: `<Route path="/work/:slug" element={<CaseStudyPage />} />`
- `CaseStudyPage` in `src/pages/index.tsx` needs a new slug branch: `case 'justin-welsh-conversion-design': return <JustinWelshCaseStudy />`

### Static Prerendering
The prerender script currently only injects custom head tags for article routes. Work routes need the same treatment. Extend `scripts/prerender.ts` as follows:

**1. Add a `WorkMeta` type and `buildWorkHeadTags` function alongside the existing `buildHeadTags`:**
```typescript
type WorkMeta = { title: string; description: string; slug: string };

function buildWorkHeadTags(meta: WorkMeta): string {
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<link rel="canonical" href="https://curiosityinc.co/work/${meta.slug}" />`,
  ].join('\n    ');
}
```

**2. Extend the `Route` type:**
```typescript
type Route = { path: string; article?: Article; workMeta?: WorkMeta };
```

**3. Add Justin Welsh to the routes array:**
```typescript
const routes: Route[] = [
  { path: '/' },
  {
    path: '/work/dan-koe-brand-architecture',
    workMeta: {
      title: 'Dan Koe — Brand Architecture | Curiosity Inc.',
      description: 'What if 2.3M followers were students, not subscribers? A learning architecture case study.',
      slug: 'dan-koe-brand-architecture',
    }
  },
  {
    path: '/work/justin-welsh-conversion-design',
    workMeta: {
      title: 'Justin Welsh — Conversion Design | Curiosity Inc.',
      description: 'How aligning instructional design principles with the marketing funnel transforms an audience into a learning community — and a creator into a discipline founder.',
      slug: 'justin-welsh-conversion-design',
    }
  },
  ...articles.map(a => ({ path: `/writing/${a.slug}`, article: a })),
];
```

**4. Update the render loop** to handle `workMeta` the same way it handles `article`:
```typescript
const headTags = article
  ? buildHeadTags(article)
  : workMeta
    ? buildWorkHeadTags(workMeta)
    : '';

let output = template
  .replace('<!-- HEAD_INJECT -->', headTags)
  .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);

if (article || workMeta) {
  output = output.replace('<title>Curiosity Inc. — Digital Sanctuary</title>', '');
}
```

Note: also backfill the Dan Koe route with its `workMeta` at the same time so both work routes have proper SSG head tags.

### React 19 Metadata
```tsx
<title>Justin Welsh — Conversion Design | Curiosity Inc.</title>
<meta name="description" content="How aligning instructional design principles with the marketing funnel transforms an audience into a learning community — and a creator into a discipline founder." />
```

### GSAP
- Profile card bands stagger in on mount (identical pattern to `DanKoeCaseStudy.tsx`)
- ID Audit Grid rows stagger in via `useScrollTrigger` (not on mount — triggered when section enters viewport)
- All other components handle their own animation internally

### SSG Safety
- All GSAP calls inside `useEffect` or `useScrollTrigger`
- No browser APIs at module scope

### Tests
- `JustinWelshCaseStudy` renders without crashing
- Profile card renders creator name and hook question
- ID Audit Grid renders all five Merrill's principle rows
- Scaffold renders four commitment ladder bands
- Lens renders hero metric value
- DeltaBridge renders three metric rows
- Back navigation link renders with correct href

---

## 5. Component Reuse Summary

| Act | Component | Props source |
|---|---|---|
| Act 01 | Profile card (inline JSX) | Hardcoded in component |
| Act 02 | ID Audit Grid (inline JSX) | Hardcoded in component |
| Act 03 | `<Scaffold>` | 4 bands, direction="up" |
| Act 04 | `<Lens>` | value, sublabel, before/afterLabel |
| Act 04 | `<DeltaBridge>` | 3 metrics with category labels |
| Act 05 | Typography only | No component |

---

## 6. Case Study Template Registry

This spec establishes the confirmed template for all three case studies. Tiago Forte will follow the same structure with:
- Act 02: ID audit of BASB/PARA content architecture (Activation/Demonstration present; Application/Feedback/Integration absent)
- Act 03: The Knowledge Progression Scaffold (four rungs from capture → organise → distil → express, mapped to ID phases)
- Act 04: Lens + DeltaBridge with knowledge-retention and behaviour-change metrics
- Act 05: The PARA Framework as licensable IP — what Tiago's methodology becomes as a formal cognitive architecture curriculum

---

## 7. Philosophical Consistency Checklist

Before implementation is considered complete, the case study must answer yes to all of the following:

- [ ] Does the case study clearly position Justin Welsh as a professor, not a marketer?
- [ ] Does Act 02 make the ID gap visible without reading as a critique of his work?
- [ ] Does Act 03 make the alignment argument — funnel + ID, not funnel vs. ID?
- [ ] Does Act 04 show learning outcome metrics alongside business metrics, in that order?
- [ ] Does Act 05 name the legacy dimension — what his framework becomes, not just what the business achieves?
- [ ] Is the implicit CTA ("if your work deserves to outlast you") present and unforced?
- [ ] Does the case study feel like it was written by a learning architecture firm, not a marketing consultancy?
