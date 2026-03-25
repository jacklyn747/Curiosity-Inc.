> The engineering spec for Claude Code. Every section maps to a business concept.
> Reference alongside `VISUAL_LANGUAGE.md` for design execution.

---

## The One Thing This Site Must Communicate

Curiosity Inc. helps creators turn audiences into learners.

That's it. If a visitor leaves this site without understanding that sentence, the site failed. Everything below exists to make that idea land — not intellectually, but viscerally. By the time someone finishes scrolling the homepage, they should feel the difference between an audience that consumes and an audience that transforms.

**The harder problem:** Nobody searches for this. No creator wakes up thinking "I need learning architecture." They think "my audience won't buy" or "my growth plateaued" or "I'm stuck on the content treadmill." The site must meet them in THEIR language, then walk them into OURS.

**Who visits:**
- Creators (100K–5M) who feel plateaued or algorithm-dependent
- Creators whose audience won't buy, who don't understand why
- Creator-economy operators (managers, agencies) looking for a new edge

**What they think they need:** A better funnel. More reach. A different platform.

**What they actually need:** Their content restructured from a marketing funnel into a learning experience that produces behavioral and identity change in their audience.

**The conversion:** "Request a Curiosity Audit" — a diagnostic conversation where we analyze a creator's content architecture and show them where the learning science breaks down.

---

## The Curiosity Loop: The Framework Behind Everything

The Curiosity Loop has five stages. This is the proprietary methodology. It structures the homepage, the case studies, the articles, and the service itself:

```
ATTENTION  →  DECISION  →  INTENTION  →  ACTION  →  CAPABILITY
```

**Attention:** Capture focus through resonance, not noise. Stop the scroll with something that feels different from every other creator consultant's site.

**Decision:** Present the problem so clearly that the visitor decides this is worth their time. They recognize themselves. They stop skimming and start reading.

**Intention:** Shift from "this is interesting" to "I need to do something about this." The visitor forms intent — not to buy, but to understand what their content is actually doing to their audience.

**Action:** Give them exactly one thing to do. Request a Curiosity Audit. Not a call. Not a form. A diagnostic.

**Capability:** The site itself demonstrates the capability. The design, the thinking, the case studies — they prove that Curiosity Inc. can do what it claims. The site is the first proof of work.

This loop runs at three scales:
1. **The homepage** — one scroll, five sections, each mapping to a loop stage
2. **Each case study** — the creator's transformation told through the same five stages
3. **The Curiosity Audit** — the actual service, structured as a loop

---

## Site Architecture

```
/                    → Homepage (single scroll, 5 sections + hero + footer)
/work/:slug          → Case Study (inner page, loop-structured)
/writing/:slug       → Article (inner page, long-form)
```

**Navigation:** Fixed top bar. Three links: WORK, WRITING, ABOUT. Logo left. Anchor links on homepage, route links on inner pages.

---

## Homepage: The Curiosity Loop in Five Sections

The homepage IS a Curiosity Loop. The visitor enters not knowing they need this and exits understanding why they do.

### The Hero — Before the Loop Begins
**Purpose:** Create the conditions for attention. Not attention itself — the CONDITIONS. Silence before signal.

**What the visitor should feel:** "This is not what I expected."

**Content:**
- No text on initial load. The ground is silent.
- Particle field — formless, scattered. The visitor's current state: noise.
- On scroll: particles coalesce into sacred geometry (Fibonacci → Flower of Life). Structure emerging from chaos.
- Geometry transforms into the Phönix sphere. Structure becoming living form.
- Only after the morph, one line appears:

> "Your audience is learning from you. You just haven't designed what they're learning."

This sentence does all the work. "Your audience" — personal. "Is learning" — present tense, already happening. "You just haven't designed" — the gap they didn't know existed. "What they're learning" — implies there's something to design, something they're currently leaving to accident.

**Technical:** WebGL particle system → SVG sacred geometry → iridescent sphere. Scroll-linked via GSAP ScrollTrigger.

**Palette constraint:** Phönix sphere uses ONLY Teal → Orange → Pink. No greens, yellows, cyans. The sphere is made of the brand's light.

**Component:** None. Pure atmosphere. The ground is silent (§1, Law 1).

---

### Section 1: ATTENTION — "The Pattern"
**Loop stage:** Attention. Capture focus through resonance, not noise.

**Purpose:** Name the pain so precisely that the creator thinks "that's me." Use THEIR language. Not learning science jargon — the words creators use in private when they're frustrated.

**What the visitor should feel:** "They understand exactly what's happening to me."

**Content:**
- Label: `—— THE PATTERN` (Pink)
- Headline: "You have an audience. You don't have a learning experience."
- Three statements, each a Scaffold band:
  1. "Your audience watches but doesn't change. You're producing content, not transformation."
  2. "Your monetization feels extractive because it IS extractive — the funnel model captures, it doesn't cultivate."
  3. "Your growth plateaued because algorithms reward novelty, but your audience needs depth."
- Closing line (dim): "These aren't marketing problems. They're learning architecture problems."

**Why these three statements work:** Each one reframes a common creator complaint into a structural insight. "Algorithm-dependent" becomes a learning architecture problem. "Audience won't buy" becomes a funnel vs. learning problem. "Stuck on the treadmill" becomes a depth vs. novelty problem. The visitor hasn't heard anyone diagnose their situation this way before.

**Component:** **The Scaffold** (§4.3) — three bands stacking upward. Teal border on first (foundational), Grey on second, Orange on third (the reframe). 150ms stagger. Bands expand on hover to reveal why each pattern exists.

**Layout:** Left-aligned. 40-60% void. The emptiness mirrors the missing structure in their content.

---

### Section 2: DECISION — "The Insight"
**Loop stage:** Decision. The visitor decides this is worth understanding deeply.

**Purpose:** Deliver the core intellectual insight in one visual. The visitor should grasp in 10 seconds what it takes a paragraph to explain: creators are accidentally educators using marketing tools instead of learning tools, and the funnel model is why their audience doesn't transform.

**What the visitor should feel:** "I never thought of it that way. Show me more."

**Content:**
- Label: `—— THE INSIGHT` (Pink)
- Headline: "Every creator with an audience is an accidental educator."
- Body (brief): "Your tutorials, frameworks, and 'how I did it' content — that's curriculum. Your audience is trying to learn, not just consume. But you've structured it like a marketing funnel instead of a learning experience. The funnel optimizes for the transaction. Learning architecture optimizes for the transformation. The transformation makes the transaction inevitable."
- Below: the single most important visualization on the site.

**Component:** **The Flow Pulse** (§4.4) — two parallel Sankey flows:
- Left (Teal, "Funnel Model"): Wide input → progressive narrowing → thin "Purchase" output → LARGE dropout annotated in Pink
- Right (Orange, "Learning Architecture"): Wide input → maintained width → slight expansion → "Identity Shift → Purchase" → minimal dropout
- Flows breathe (50-70% opacity, 3s cycle). This breathing communicates that these are living systems, not static diagrams.

**Why this visualization is the most important one:** It's the entire business case in a single image. A creator who understands this diagram understands what Curiosity Inc. does. The funnel LOSES people. The learning architecture KEEPS them. The visualization should be immediately legible without reading any text — the width difference tells the story.

**Layout:** Centered. Side by side (stacked on mobile).

---

### Section 3: INTENTION — "The Laboratory"
**Loop stage:** Intention. The visitor shifts from "this is interesting" to "I want to see this applied."

**Purpose:** Show the methodology applied to creators the visitor recognizes. Named creators do the heavy lifting — if you know Dan Koe or Tiago Forte, the implicit message is "we've already analyzed someone like you." The visitor forms intent: not to buy, but to see what Curiosity Inc. would find in THEIR content.

**What the visitor should feel:** "If they can see this in Dan Koe's content, what would they find in mine?"

**Content:**
- Label: `—— THE LABORATORY` (Pink)
- Headline: "Selected Experiments"
- Subtitle: "Each project applies learning science to a real creator's content architecture — diagnosing where the educational structure breaks and how restructuring it compounds every metric that matters."
- Three cards:

| # | Creator | Category | Hook |
|---|---|---|---|
| 01 | Dan Koe | BRAND ARCHITECTURE | "What if 2.3M followers were students, not subscribers?" |
| 02 | Justin Welsh | CONVERSION DESIGN | "Removing the last 1% of friction between insight and action." |
| 03 | Tiago Forte | COGNITIVE INTERFACES | "The Second Brain already has a curriculum. It just isn't built yet." |

Each card: "EXPLORE CASE STUDY →" in Pink.

**Why these hooks work:** Each one takes the creator's existing success and asks a question that implies massive untapped potential. Not "here's what's wrong" but "imagine what's possible."

**Component:** **The Grid Reveal** (§4.6) — center-outward stagger, 60ms delays.

**Layout:** 2+1 grid. Subtle 0.5px borders at 15% opacity.

---

### Section 4: INTENTION → ACTION — "Deep Readings"
**Loop stage:** Bridge between Intention and Action. For visitors who need more before acting.

**Purpose:** Prove intellectual depth. Each article teaches something immediately useful — making the site itself a Curiosity Loop. You learn something, you want more, you realize you need help applying it. These articles are not content marketing. They are intellectual instruments.

**What the visitor should feel:** "These people think at a level I haven't encountered before."

**Content:**
- Label: `—— THE LIBRARY` (Pink)
- Headline: "Deep Readings"
- Four articles:

| # | Category | Title | Description | Time |
|---|---|---|---|---|
| 01 | LEARNING SCIENCE | The Accidental Educator | Why every creator with an audience is running an unstructured classroom | 12 min |
| 02 | DESIGN THEORY | Negative Space as Active Agent | Why emptiness in content creates space for the audience to think | 8 min |
| 03 | METHODOLOGY | The Curiosity Loop Protocol | Five stages from attention to capability — the framework for identity transformation | 15 min |
| 04 | PHILOSOPHY | Eureka as Practice | Why discovery is a discipline, not a lightning bolt | 10 min |

**The first article to write:** "The Accidental Educator" — if someone reads this and understands it, they understand what Curiosity Inc. does. It IS the sales pitch in essay form. Structure: observation (creators ARE educators) → gap (they use marketing tools) → science (adult learning principles) → proof (what happens when you apply them) → implication (the creator economy is an education economy) → invitation (Request a Curiosity Audit).

**The second article to write:** "The Curiosity Loop Protocol" — names and explains the five-stage framework. This is the BCG Growth-Share Matrix play: name a framework, own a category.

**Component:** None. Clean list. The emptiness between entries signals confidence.

**Layout:** Full-width rows. Number + category left. Title + description center. Time + arrow right. 0.5px dividers at 5% opacity.

---

### Section 5: ACTION + CAPABILITY — "The Constellation"
**Loop stage:** Action (give them one thing to do) + Capability (prove we can do it).

**Purpose:** Two things at once. The Convergence Map shows the intellectual world Curiosity Inc. operates in — these aren't buzzwords, they're real disciplines (cognitive load theory, instructional design, semiotics). This IS the capability proof. Then: one clear CTA.

**What the visitor should feel:** "I want to know what they'd find in MY content."

**Content:**
- Label: `—— ABOUT` (Pink)
- Headline: "The Constellation of *Ideas*" (Ideas in Orange)
- Subtitle: "Hover to explore the relationships between disciplines that shape our practice."
- Convergence Map: nodes = Flow Theory, Cognitive Load, Curiosity Loop, Semiotics, Design Systems, Kinetic Type, Negative Space, Instructional Design, Identity Theory
- Center node: CURIOSITY INC.
- On hover: one-line description of each discipline's role

**Closing:**
> "Every creator with an audience over 50K is sitting on an unstructured curriculum. The question isn't whether to restructure — it's how much value is lying dormant."

**CTA:** "Request a Curiosity Audit" — Pink outline button.

**Component:** **The Convergence Map** (§4.1) — lines draw inward, 80ms stagger, center node last with spring bounce (stiffness: 200, damping: 20).

**Footer:**
- "STAY CURIOUS" in oversized serif
- "✦ CURIOSITY INC."
- "JOIN THE COLLECTIVE" (secondary CTA, Pink outline)
- "© 2026 Curiosity Inc. · Designed for the flow state."

---

## Case Study Inner Page: The Curiosity Loop Applied

Each `/work/:slug` page shows the Curiosity Loop applied to a specific creator. The five-stage framework structures the narrative. This is NOT a portfolio page. It's a transformation narrative.

The visitor sees the loop in action. By the end, they understand both what the methodology IS and what it DOES.

### Act 1 — ATTENTION: The Hook
**Loop stage:** Attention. Capture with one provocative question.

**Content:**
- Creator name (large serif display)
- Hook line in Pink — a question, not a description
- Metadata: Domain, Approach
- Creator photo (B&W, cinematic)
- Network Bandwidth stats (platform follower counts with Pink bar indicators)

**Example (Dan Koe):**
- "Dan Koe"
- "What if 2.3M followers were students, not subscribers?" (Pink)
- Domain: Digital Philosophy | Approach: Behavioral Systems
- Flagship Engine: Modern Mastery / Koe Letters
- Target Topology: "Creators, philosophers, and modern polymaths seeking self-actualization through leverage."
- X: 750K+ | YouTube: 1.3M+ | Instagram: 1.6M+

**Component:** None. Typography + void. The emptiness around the name IS the design.

### Act 2 — DECISION: The Current State
**Loop stage:** Decision. The visitor decides this analysis is serious by seeing how precisely we diagnose the existing structure.

**Content:**
- Label: "CURRENT STATE" (Pink)
- "What's working:" — Always acknowledge strengths first. Never lead with criticism.
- "However..." — Name the structural constraint. Not "your content is bad" but "this immense leverage is being constrained by a traditional funnel layout."
- Funnel breakdown showing current Top/Mid/Bottom structure

**Component:** **The Scaffold** (§4.3) — three bands showing the current funnel layers. Teal borders. Each band = one funnel stage. Makes the invisible structure VISIBLE.

### Act 3 — INTENTION: The Architecture
**Loop stage:** Intention. What would change and why. Demonstrate thinking, not deliverables.

**Content:**
- Label: "OUR ARCHITECTURE" (Pink)
- Named framework (Dan Koe: "Orbital Gravity Well")
- Brief intro explaining the core shift
- 5 phased interventions, each following the Curiosity Loop stages:
  1. ATTENTION / RESONANCE
  2. DECISION / CALIBRATION
  3. INTENTION / SIMULATION
  4. ACTION / EXECUTION
  5. CAPABILITY / THE CORE

Each phase has:
- "The Concept:" — what learning science principle it applies
- "The Application:" — what specifically changes in the creator's content architecture

**Component:** **The Scaffold** (§4.3) — five bands with semantic color progression. Teal → Grey → Grey → Orange → Pink. Bands expand to reveal detail. The visual encodes that the methodology BUILDS — each phase depends on the one before.

### Act 4 — ACTION: The Shift (Projected Outcomes)
**Loop stage:** Action. This is the climax. Show what the architecture targets.

**Content:**
- Label: "PROJECTED ARCHITECTURE" (Pink)
- Hero statistic in a Lens (the single most dramatic projected outcome)
- 4-6 Delta Bridge rows showing before → after across:
  - Audience Behavior (repeat engagement)
  - Business Outcome (revenue per subscriber)
  - Learning Outcome (curriculum completion)
  - Transformation Signal (identity language shift in community)
  - Conversion Velocity (time to first purchase)

**Framing:** These are projections, not claims. Honest about being a concept study. Credible because they're modeled from comparable implementations.

**Components:**
- **The Lens** (§4.7) — vesica piscis hero stat. Teal circle + Orange circle draw simultaneously. Pink insight types in at intersection.
- **The Delta Bridge** (§4.2) — arc height proportional to magnitude. Teal → Pink apex → Orange. 200ms stagger.

### Act 5 — CAPABILITY: The Reflection + Implication
**Loop stage:** Capability. What this means for the visitor.

**Content:**
- A reflective paragraph connecting this specific transformation to the broader pattern the visitor is experiencing
- The implication: what this means for creators like them
- "Request a Curiosity Audit" CTA
- Next/previous case study navigation

**Component:** **The Annotation Thread** (§4.5) — optional timeline showing the narrative arc. Pink focal line, grey context lines for industry benchmarks. Only if there's enough data to justify it.

### Concept Study Disclaimer
**Required on every case study (small, monospace, dim):**
> "This work was not commissioned, endorsed, or affiliated with [Creator Name]. All trademarks are property of their respective owners. This analysis is based on publicly available information and proprietary learning science methodology. A real engagement would involve deeper collaborative research."

---

## Article Inner Page: The Library

Each `/writing/:slug` is a long-form editorial piece.

- Title (large serif, italic)
- Category + Read time
- Body: max-width 680px, centered, 18px, line-height 1.7
- Pull quotes in Pink italic serif
- Visualization components inline where they serve the argument
- No sidebar. No clutter. The emptiness IS the reading experience.

---

## Typography (Locked)

| Role | Font | Weight | Size | Color |
|---|---|---|---|---|
| Display | Instrument Serif | 400, italic | clamp(36px, 5vw, 64px) | --color-text |
| Labels | JetBrains Mono | 400 | 11px, tracking 0.15em | --color-insight |
| Body | DM Sans | 300, 400 | 16-18px | --color-text |
| Data | JetBrains Mono | 300, 400 | 10-12px | --color-context |
| Callouts | Instrument Serif | 400 | varies | --color-insight |
| Nav | DM Sans | 400 | 12px, tracking 0.12em | --color-text |

All Google Fonts. No licensing friction.

---

## Data Model

```typescript
export interface CaseStudy {
  slug: string;
  number: string;
  category: string;
  creatorName: string;
  hookLine: string;
  domain: string;
  approach: string;
  flagshipEngine: string;
  targetTopology: string;
  corePhilosophy: string;
  heroStat: { value: string; label: string };
  networkBandwidth: { platform: string; count: string }[];
  currentState: {
    working: string;
    constraint: string;
    funnelLayers: { stage: string; description: string }[];
  };
  architecture: {
    frameworkName: string;
    intro: string;
    phases: {
      number: string;
      name: string;        // "ATTENTION / RESONANCE"
      concept: string;
      application: string;
    }[];
  };
  metrics: {
    label: string;
    category: string;     // "Audience Behavior", "Business Outcome", etc.
    before: string;
    after: string;
    delta: string;
    magnitude: number;    // 0-1, controls Delta Bridge arc height
  }[];
  reflection: string;
  implication: string;
  disclaimer: string;
}
```

---

## Build Phases

### Phase 1: Foundation
- Vite + React + TypeScript scaffold
- CSS custom properties (all tokens from VISUAL_LANGUAGE.md §2)
- Font loading (Instrument Serif, DM Sans, JetBrains Mono)
- `useSelfDraw` hook (SVG stroke-dashoffset)
- `useScrollTrigger` hook (IntersectionObserver)
- `useStagger` hook
- `prefers-reduced-motion` wrapper
- React Router

### Phase 2: Homepage Hero + Sections 1-2
- Hero (particle field → sacred geometry → Phönix)
- Section 1: ATTENTION — The Pattern (Scaffold component)
- Section 2: DECISION — The Insight (Flow Pulse component)

### Phase 3: Homepage Sections 3-5 + Nav
- Section 3: INTENTION — The Laboratory (Grid Reveal, case study cards)
- Section 4: Deep Readings (article list)
- Section 5: ACTION/CAPABILITY — Constellation (Convergence Map) + CTA
- Footer
- Sticky nav

### Phase 4: Dan Koe Case Study (complete)
- All five acts with correct loop stages
- The Lens + Delta Bridge components
- Scaffold reused for current state + architecture
- Concept study disclaimer

### Phase 5: Remaining Content
- Justin Welsh + Tiago Forte case studies
- "The Accidental Educator" article (full)
- "The Curiosity Loop Protocol" article (full)
- Remaining article stubs
- SPA routing fix (server redirect)

### Phase 6: Polish
- Constellation hover interactions
- Scroll animation refinement
- Lighthouse 95+
- Mobile pass
- WCAG 2.2 AA audit
- OG/meta tags

---

## What This Site Is Not

- Not a portfolio. Does not show deliverables.
- Not a marketing site. No urgency, scarcity, or social proof widgets.
- Not a blog. The articles are intellectual instruments.
- Not a SaaS page. No feature lists, pricing tiers, comparison tables.

It is a **Digital Sanctuary** — a museum-quality environment where a creator arrives thinking they have a marketing problem, and leaves understanding they have a learning architecture problem. The site proves that Curiosity Inc. can design that kind of shift — because the visitor just experienced one.

The only metric: does the visitor request a Curiosity Audit?