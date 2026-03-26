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

**Profile card bottom band — Platform Distribution + Target Topology**

This band is functionally identical in structure to Dan Koe's "Network Bandwidth + Target Topology" band, but the left panel carries richer semantic content: each platform is labelled with its funnel position AND its current ID principle, making the audit argument visible from the profile card itself.

Left panel — "Platform Distribution":

| Platform | Followers | Funnel Position | Current ID Role |
|---|---|---|---|
| LinkedIn | 500,000 | TOFU | Activation + Demonstration |
| Newsletter | 150,000 | MOFU | Demonstration only |
| Courses | — | BOFU | Partial Application |

Bar chart proportions (for visual rendering, same bar component as DK):
```
LinkedIn     500,000   pct: 0.76
Newsletter   150,000   pct: 0.23
Courses      —         pct: 0.05  (represented symbolically)
```

Each platform row gains a small secondary label beneath the bar showing its ID role in monospace, context grey, 8px. This is unique to Justin Welsh's card — it makes the platform audit argument legible from Act 01.

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

### Act 02 — Situation Continued / The Platform Audit
**SCQA Stage:** Situation (deepening)
**Purpose:** Map Justin's platform distribution model against Merrill's First Principles — platform by platform. Show not just what ID principles are missing, but *which platform* carries (or fails to carry) each one. This is the clinical audit that makes the case for structural change, not cosmetic improvement.

**Component:** Custom Platform Audit Grid (inline JSX — not a reused component). Two-section layout: first a per-platform breakdown, then a principles summary. Feels like a formal audit document.

**Animation:** Row stagger using `useScrollTrigger`. Import from `'../hooks/useScrollTrigger'`. Use a `useEffect` with GSAP `fromTo` on `.platform-audit-row` class names, triggered when `inView` becomes true.

**Section A — Per-Platform Breakdown:**

| Platform | Funnel Stage | Current Content Format | ID Principle Served | Gap |
|---|---|---|---|---|
| **LinkedIn** | TOFU | Hook → Insight → Takeaway. Self-contained. Nothing asked of the reader. | Activation ✅, Demonstration ✅ | Application ❌ — insight delivered, practice never designed |
| **Newsletter** | MOFU | One insight expanded. Deep, well-written, passive. No assignment, no reply mechanism. | Demonstration ✅ | Application ❌, Feedback ❌ — no designed practice, no outcome measurement |
| **Courses** | BOFU | Video library. Self-paced. No checkpoints, no cohort, no peer review. | Partial Application ⚠️ | Feedback ❌, Integration ❌ — no outcome documentation, zero data flows back |
| **— MISSING —** | Post-conversion | Nothing. The learning ends at the transaction. | — | Integration ❌, Outcome Documentation ❌ — no community, no feedback loop, no IP foundation |

**Section B — Merrill's Principles Summary** (the same five-row grid as originally specced, now explicitly connected to the platform above it):

| Merrill's Principle | Platform that should carry it | Current state |
|---|---|---|
| **Activation** | LinkedIn | ✅ Present — resonance is high |
| **Demonstration** | LinkedIn + Newsletter | ✅ Present — tactical examples throughout |
| **Application** | Newsletter (ideal) | ❌ Absent — no designed practice anywhere |
| **Feedback** | Courses | ❌ Absent — no outcome measurement, no correction mechanism |
| **Integration** | Practitioner Community (missing) | ❌ Absent — no platform exists for this phase |

**Visual styling:**
- Section A rows: each platform gets a card-style row with left accent bar. Teal = present, Orange = partial, muted = absent/missing. Missing platform row uses dashed border and Pink accent.
- Section B rows: compact five-row summary grid, same left accent pattern
- Both sections enter with staggered GSAP animation on scroll trigger

**Narrative above:**
- Frame as a platform-by-platform audit, not a content quality critique
- "The question is not whether the content is good. The content is exceptional. The question is whether the platform architecture supports the full learning journey."

**Narrative between sections A and B:**
- Bridge sentence: "The pattern across every platform is the same. Activation and demonstration are excellent. Application, feedback, and integration don't exist anywhere in the architecture."

**Narrative below:**
- The diagnosis: Justin Welsh has built a world-class broadcast infrastructure. Every platform delivers content. None of them ask anything back. The learning journey ends at inspiration.
- The critical consequence: without a feedback loop, there is no outcome data. Without outcome data, there is no framework. Without a framework, there is no licensable IP. The platform architecture isn't just a learning problem — it is what stands between Justin Welsh's ideas and their permanent contribution to the field.

---

### Act 03 — Question / The Commitment Ladder
**SCQA Stage:** Question
**Purpose:** Show what the redesigned platform architecture looks like when each platform carries its correct ID purpose. Each rung of the ladder maps to a specific platform and a specific content redesign — and critically, each rung creates the demand that makes the next rung inevitable. This answers the implicit question: "if you give away activation and application for free, why would anyone buy the course?"

**Component:** `Scaffold` — four bands, `direction="up"` (bottom to top, foundational first).

**The Commitment Ladder — platform-mapped:**

| Band | Level | `accentColor` | Platform | Content redesign | ID Principle | Why it creates demand for the next rung |
|---|---|---|---|---|---|---|
| ATTENTION | `foundational` | `'structure'` | LinkedIn | Hook → Insight → **Micro-commitment prompt.** "Map your skills to a market this week. Drop what you found below." | Activation | Creates partial success. The reader acts as a solopreneur before believing it. Partial success reveals the gap: "this works — but I don't know what to do next." |
| MICRO-ACT | `intermediate` | `'context'` | Newsletter | Concept → Worked example → **Weekly assignment.** "Apply it this week and reply with what you found." | Demonstration → Application | One technique per week in isolation creates momentum and exposes the absence of a coherent system. "I'm applying individual ideas but I have no architecture." The course becomes the obvious answer. |
| INTENT | `advanced` | `'transformation'` | Courses | Lesson → **Exercise → Peer review.** Cohort rhythm. Progress milestones. Outcome documentation begins. | Application + Feedback | The course isn't more content. It's the designed progression that connects all the isolated techniques into a system. Completion produces documented outcomes — the first data points of the framework. |
| IDENTITY / ACTION | `mastery` | `'insight'` | Practitioner Community *(new)* | **Weekly challenges. Case study submissions. Peer review cycles.** Justin shifts from publisher to curator and validator. | Integration + Outcome Documentation | The community is where the identity is reinforced through practice with peers — and where the methodology is tested, refined, and validated. This is the feedback loop. This is the IP engine. |

**The `Scaffold` `accentColor` prop values:** `'structure' | 'transformation' | 'insight' | 'context'`. Do NOT pass `'grey'`. MICRO-ACT uses `'context'`.

**expandedContent per band:** Each band expands to show the specific content redesign for that platform — the before/after of what the creator publishes.

**Critical narrative point — the course question:**
The case study must address directly: if activation and application are free, why buy the course?

The answer is the ladder itself: **each free rung creates the problem the next rung solves.**

- LinkedIn gives one prompt → partial success → "I need more structure"
- Newsletter gives one technique per week in isolation → momentum without architecture → "I need a system"
- The course sells the system: designed progression, scaffolded curriculum, accountability, community access. Not more content. The *structure* that connects the content.

The course buyer is not a cold lead. They have already proved to themselves — through ten newsletter assignments and ten LinkedIn prompts — that the methodology works for them. They are buying certainty, not taking a risk. This is why conversion improves when the ladder is designed: the leap disappears.

**Narrative above the Scaffold:**
- "The marketing funnel doesn't disappear. It gets a curriculum."
- Each platform now has a purpose. Each purpose creates the demand for the next.

**Narrative below the Scaffold:**
- When the ladder is designed, conversion stops being a cliff. The audience doesn't decide to buy. They arrive at purchase having already made a hundred smaller commitments that made it inevitable.
- And for the first time: every step is measured. The outcome data accumulates. The methodology improves. The framework becomes real.

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
- [ ] Does the profile card bottom band show platform distribution with ID role labels — not just follower counts?
- [ ] Does Act 02 audit the platform architecture specifically — not just "content" generically?
- [ ] Does Act 02 make the ID gap visible without reading as a critique of his work?
- [ ] Does Act 03 map each rung of the ladder to a specific platform and a specific content redesign?
- [ ] Does Act 03 explain why each free rung creates demand for the next paid rung?
- [ ] Does Act 03 answer the implicit question: "if activation and application are free, why buy the course?"
- [ ] Does Act 03 make the alignment argument — funnel + ID, not funnel vs. ID?
- [ ] Does Act 04 show learning outcome metrics alongside business metrics, in that order?
- [ ] Does Act 05 name the Practitioner Community as the feedback loop that makes the IP real?
- [ ] Does Act 05 name the legacy dimension — what his framework becomes, not just what the business achieves?
- [ ] Is the implicit CTA ("if your work deserves to outlast you") present and unforced?
- [ ] Does the case study feel like it was written by a learning architecture firm, not a marketing consultancy?

---

## 8. The Core Argument in One Paragraph

Justin Welsh is a professor of solopreneurship who has built a world-class broadcast infrastructure with no curriculum beneath it. His platforms deliver activation and demonstration exceptionally — and nothing else. The absence of application, feedback, and integration phases means his audience consumes without changing, and his methodology accumulates no outcome data. Without outcome data there is no framework. Without a framework there is no licensable IP. The solution is not a better funnel. It is a platform architecture where each channel carries a specific ID purpose, each purpose creates the demand for the next, and the whole system generates the documented outcomes that transform great content into an enduring methodology. That methodology — properly named, structured, and licensed — is the most valuable asset Justin Welsh will ever build. Not the courses. Not the newsletter. The framework those platforms, together, are capable of producing.
