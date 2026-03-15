# Case Studies — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a WorkSection homepage grid (Section 04) and three individual `/case-studies/[slug]` pages for Dan Koe, Ali Abdaal, and Justin Welsh using the Curiosity Inc sacred geometry visual system.

**Architecture:** A typed data layer (`lib/case-studies.ts`) feeds a homepage portrait card grid (`WorkSection`) and 10-section static pages. The page component is a server component using `generateStaticParams`. All 10 case-study section components live in `components/case-study/` as `'use client'` components using GSAP ScrollTrigger — identical pattern to every existing section.

**Tech Stack:** Next.js 16.1.6 App Router, React 19, TypeScript, Tailwind v4, GSAP 3.14 (ScrollTrigger via `lib/gsap.ts`), CSS custom properties (`var(--tang)` etc.)

**Spec:** `docs/superpowers/specs/2026-03-14-case-studies-design.md`

**Verification:** No formal test suite. Use `npx tsc --noEmit` for type correctness, `npm run build` for integration, and the dev server (port 3002) + browser for visual verification.

---

## File Map

| File | Created/Modified | Responsibility |
|------|-----------------|---------------|
| `lib/case-studies.ts` | Create | `CaseStudy` interface, 3 creator objects, `getCaseStudy()` |
| `components/ui/OrbitOverlay.tsx` | Create | Reusable concentric-circle SVG (cards + hero portrait) |
| `components/sections/WorkSection.tsx` | Create | Section 04 homepage grid, GSAP entrance, card hover |
| `app/case-studies/[slug]/page.tsx` | Create | Server component, `generateStaticParams`, section composition |
| `components/case-study/CaseStudyHero.tsx` | Create | 2-col hero: portrait + title + meta |
| `components/case-study/SituationSection.tsx` | Create | Paragraphs + ThinLineSystem ghost + pull quote |
| `components/case-study/ChallengeSection.tsx` | Create | Friction pills + paragraph + insight block |
| `components/case-study/MovesSection.tsx` | Create | 2×2 behavioral moves grid |
| `components/case-study/LearningFlowSection.tsx` | Create | SVG orbit-node chain (5 nodes, 4 transitions) |
| `components/case-study/NarrativeSection.tsx` | Create | Narrative archetype pills (dominant highlighted) |
| `components/case-study/WhatWorksSection.tsx` | Create | Tang-dot bullet list |
| `components/case-study/MissedOpsSection.tsx` | Create | Muted bullet list |
| `components/case-study/CuriosityUpgradeSection.tsx` | Create | Arrow-prefix bullets + triangle SVG |
| `components/case-study/TakeawaysSection.tsx` | Create | Numbered insights + Orb + next-case link |
| `app/page.tsx` | Modify | Add `<WorkSection />` between `<SystemSection />` and `<AboutSection />` |

---

## Chunk 1: Data Layer + Shared Component

### Task 1: `lib/case-studies.ts`

**Files:**
- Create: `lib/case-studies.ts`

- [ ] **Step 1.1: Create the file with types and full data**

```typescript
// lib/case-studies.ts

export interface LearningStep {
  from: string
  to: string
  how: string
}

export interface CaseStudy {
  slug: string
  index: string
  name: string
  outcome: string
  color: string
  image: string
  headline: string
  subhead: string
  meta: {
    platforms: string[]
    offers: string[]
    audienceType: string
    audienceSize: string
  }
  situation: string[]
  situationQuote: string
  coreChallenge: string
  frictionTypes: string[]
  behavioralMoves: {
    attention: string[]
    cognitiveAnchors: string[]
    knowledgePackaging: string[]
    authoritySignals: string[]
  }
  learningFlow: [LearningStep, LearningStep, LearningStep, LearningStep]
  narrativeSystem: {
    stories: string[]
    dominant: string
    description: string
    quote: string
  }
  whatWorks: string[]
  missedOpportunities: string[]
  curiosityUpgrade: string[]
  founderTakeaways: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'dan-koe',
    index: '01',
    name: 'Dan Koe',
    outcome: 'Authority',
    color: 'var(--tang)',
    image: '/images/dan-koe.jpg',
    headline: 'How Dan Koe Engineers Authority',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['X / Twitter (~800K)', 'YouTube (~1M)', 'Newsletter (~200K)'],
      offers: ['The 2-Hour Writer', 'Modern Mastery', 'Digital Economics'],
      audienceType: 'Creators, solopreneurs, builders seeking depth',
      audienceSize: '2M+ across platforms',
    },
    situation: [
      'Dan Koe operates in the most crowded vertical on the internet — self-improvement for aspiring creators. Yet he has carved a distinct position by refusing to compete on tactics.',
      'His market play is philosophical authority. While competitors optimize for hooks and hacks, Koe packages complex ideas about work, identity, and economics into a coherent worldview. The result: audiences don\'t follow him for tips. They follow him for a framework for living.',
      'His product ecosystem reflects this. The 2-Hour Writer teaches output systems. Digital Economics maps the opportunity. Modern Mastery is the integrating container. Each product trains a specific cognitive skill while reinforcing the same core belief: one focused person can outperform a team.',
      'The sophistication of his audience is high. They have already consumed Atomic Habits and The 4-Hour Workweek. Koe\'s authority comes from being the person who can synthesize what all of that means — and where to go next.',
    ],
    situationQuote: 'He doesn\'t sell productivity. He sells a philosophy of self-directed evolution — and then teaches you the craft to execute it.',
    coreChallenge: 'The core friction for Koe\'s audience is clarity — specifically, the gap between inspiration and action. His ideas are dense and require active engagement. A reader can feel illuminated after a thread and have no idea what to do differently on Monday. The cognitive load of synthesis is high, and the conversion path from idea-consumer to course-buyer depends entirely on the audience resolving that gap themselves.',
    frictionTypes: ['clarity', 'identity'],
    behavioralMoves: {
      attention: [
        '"Most people will never..." — opens by naming the failure state',
        'Long-form threads that reward patience — filter for high-attention audience',
        'Philosophical provocation as hook: "Work is the new meditation"',
        'Consistent aesthetic: minimal design, no thumbnails, no noise',
      ],
      cognitiveAnchors: [
        '"The 1-person business" — makes solo operation feel architectural',
        '"Infinite leverage" — reframes digital output as asymmetric asset',
        '"Deep work is a spiritual practice" — elevates productivity to identity',
        '"Most people are optimizing for the wrong thing" — creates in-group',
      ],
      knowledgePackaging: [
        'Thread → newsletter essay → course — each layer adds depth to the same idea',
        'Ideas presented as frameworks with named components (leverage, depth, craft)',
        'Products teach skills that make the philosophy executable',
        'Free content is indistinguishable in quality from paid — trust driver',
      ],
      authoritySignals: [
        'Transparent revenue milestones ($1M, $2M) — proof the model works',
        'Long-form thinking published daily — signals genuine intellectual depth',
        'Zero paid ads — organic authority signals independence',
        'Building in public: shares the system, not just the outcome',
      ],
    },
    learningFlow: [
      { from: 'Skeptical', to: 'Curious', how: 'A thread challenges a belief they already hold — low risk, high novelty' },
      { from: 'Curious', to: 'Aligned', how: 'Newsletter essay gives them a framework that explains something confusing about their own life' },
      { from: 'Aligned', to: 'Convinced', how: 'Multiple touchpoints confirm: this person\'s worldview is consistent and earns results' },
      { from: 'Convinced', to: 'Committed', how: 'Product solves the specific execution gap the content revealed' },
    ],
    narrativeSystem: {
      stories: ['Mastery', 'Intelligence', 'Freedom'],
      dominant: 'Mastery',
      description: 'Koe\'s primary narrative is mastery — specifically, the idea that depth of skill and clarity of thought compound into extraordinary leverage over time. Freedom is the promised outcome, but mastery is the path. Intelligence is the social signal that makes both legible.',
      quote: 'The person who reads one book deeply outperforms the person who reads fifty books shallowly.',
    },
    whatWorks: [
      'Idea repetition across formats (thread → essay → product) builds deep cognitive imprints',
      'Philosophical positioning removes him from commodity comparison',
      'Product ladder maps cleanly to audience sophistication tiers',
      'Long-form signals high IQ to a high-IQ audience — filters perfectly',
      'Revenue transparency converts authority into social proof without bragging',
    ],
    missedOpportunities: [
      'Framework visualization is largely absent — his ideas are dense and would benefit from diagrams',
      'The journey from free content to first purchase has no explicit bridge — relies on audience self-motivation',
      'No community infrastructure — audience loyalty is high but untethered',
      'Concept naming is strong but inconsistent — some core ideas lack persistent labels across products',
    ],
    curiosityUpgrade: [
      'Visualize the frameworks — give each mental model a diagram that makes the architecture visible at a glance',
      'Add an explicit conversion sequence: after each long-form essay, a 3-sentence "what to do with this" bridge',
      'Map the product ladder visually on the site — show audience exactly where they are and what\'s next',
      'Build a concept glossary — one place where all named ideas live, cross-referenced across products',
    ],
    founderTakeaways: [
      'A coherent worldview is a moat — it\'s harder to copy than tactics',
      'Filtering for a high-attention audience creates smaller but far more loyal cohorts',
      'Revenue transparency is an authority signal when the product delivers',
      'Free content at product quality removes the trust barrier entirely',
      'Ideas need visual architecture — prose alone leaves comprehension to chance',
    ],
  },
  {
    slug: 'ali-abdaal',
    index: '02',
    name: 'Ali Abdaal',
    outcome: 'Trust',
    color: 'var(--lav)',
    image: '/images/ali-abdaal.jpg',
    headline: 'How Ali Abdaal Engineers Trust',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['YouTube (~5.5M)', 'Newsletter (~500K)', 'Podcast (Top 50)'],
      offers: ['Part-Time YouTuber Academy', 'Feel-Good Productivity (book)', 'Productivity Lab'],
      audienceType: 'Students, aspiring creators, professionals optimizing their lives',
      audienceSize: '6M+ across platforms',
    },
    situation: [
      'Ali Abdaal built the largest productivity creator brand in the world by treating trust as the primary product. His background as a Cambridge-trained doctor gives him a credibility baseline that no amount of marketing can manufacture.',
      'His market position is evidence-based self-improvement — the reasonable, kind, science-adjacent alternative to the hustle-culture playbook. Where others demand sacrifice, Abdaal offers permission: to enjoy the process, to go at your pace, to feel good doing the work.',
      'His business model is a masterclass in top-of-funnel generosity. YouTube videos average 15–25 minutes of substantive value. The newsletter deepens the relationship. The book scales trust globally. The course monetizes the most committed learners.',
      'Audience sophistication is deliberately broad — he meets students, early professionals, and career-changers where they are, speaking in plain language even about complex cognitive science.',
    ],
    situationQuote: 'Trust at scale requires being consistently, demonstrably right about things that matter to your audience\'s daily life.',
    coreChallenge: 'Abdaal\'s central friction is trust maintenance across a massive and heterogeneous audience. With 5M+ subscribers, every piece of advice must survive scrutiny from millions of people with wildly different contexts. The risk of misalignment — advice that doesn\'t transfer — is high. He manages this by anchoring to evidence, framing everything as experiments, and being transparent about what he doesn\'t know.',
    frictionTypes: ['trust', 'clarity'],
    behavioralMoves: {
      attention: [
        '"I\'m a doctor, and here\'s what I found..." — credibility hook before the insight',
        'Question-based titles that mirror audience\'s own inner dialogue',
        'Thumbnail: direct eye contact + single clear claim — trust before click',
        'Video intros that prove value in the first 90 seconds before the premise',
      ],
      cognitiveAnchors: [
        '"Feel-good productivity" — reframes effort as enjoyable, not punishing',
        '"Evidence-based" — signals rigor without requiring the audience to verify',
        '"Second brain" — makes knowledge management feel architectural and prestigious',
        '"You don\'t have to be miserable to be productive" — permission structure',
      ],
      knowledgePackaging: [
        'YouTube: long-form, structured like a lecture with clear sections and summaries',
        'Book: synthesizes YouTube content into a single, gift-able, shareable object',
        'Course: live cohort with accountability — converts knowledge to behavior',
        'Newsletter: personal, reflective, lower production — builds intimacy at scale',
      ],
      authoritySignals: [
        'Medical degree mentioned organically, not performatively',
        'Academic citations and book references in every video',
        'Transparent income reports — shows the model working',
        'Publicly updated "what I use" lists — shows ongoing practice, not theory',
      ],
    },
    learningFlow: [
      { from: 'Curious', to: 'Engaged', how: 'Thumbnail + title resolves to a video that over-delivers on the premise' },
      { from: 'Engaged', to: 'Trusting', how: 'Advice is tested in real life — it works — credibility is earned through experience' },
      { from: 'Trusting', to: 'Loyal', how: 'Newsletter creates parasocial intimacy — audience feels they know him, not just his content' },
      { from: 'Loyal', to: 'Buyer', how: 'Course offer arrives at the natural next-step moment — audience was already looking for more' },
    ],
    narrativeSystem: {
      stories: ['Mastery', 'Simplicity', 'Freedom'],
      dominant: 'Simplicity',
      description: 'Abdaal\'s master narrative is that productivity doesn\'t have to be hard — and that simplicity, applied with evidence, produces better results than complexity applied with discipline. The Simplicity narrative is the emotional permission structure that makes everything else land.',
      quote: 'The most effective system is the one you\'ll actually use.',
    },
    whatWorks: [
      'Medical credential creates an asymmetric trust baseline competitors can\'t replicate',
      'Permission-based framing ("you don\'t have to be miserable") removes identity resistance',
      'Long-form YouTube trains high-attention habits — audience learns to spend time with him',
      'Book creates an artifact that audiences gift — extends trust network organically',
      'Consistent visual identity (thumbnail style, warm palette) builds pattern recognition at scale',
    ],
    missedOpportunities: [
      'Framework visualization is underused — most ideas are prose-only with no visual architecture',
      'The product ladder could be made more explicit — many audience members don\'t know what\'s available beyond YouTube',
      'Newsletter and YouTube feel siloed — cross-content references would deepen engagement',
      'Cognitive overload risk in long-form videos — section navigation tools rarely used',
    ],
    curiosityUpgrade: [
      'Build a visual "system map" — show how YouTube → newsletter → book → course connect as a learning journey',
      'Add visual summaries to each video: a single diagram capturing the core framework',
      'Create explicit onramp pathways by audience type (student / professional / creator) — removes decision friction',
      'Use the newsletter as a lab report for YouTube ideas — creates feedback loop and deepens both channels',
    ],
    founderTakeaways: [
      'An un-fakeable credential is a permanent moat — develop yours and make it visible',
      'Permission structures ("you\'re allowed to enjoy this") remove the biggest hidden resistance',
      'Trust compounds — each piece of advice that works in someone\'s life earns the next',
      'Physical products (books) extend your reach into networks you\'ll never directly touch',
      'Breadth is a moat when paired with depth — but you need systems to maintain both',
    ],
  },
  {
    slug: 'justin-welsh',
    index: '03',
    name: 'Justin Welsh',
    outcome: 'Demand',
    color: 'var(--must)',
    image: '/images/justin-welsh.jpg',
    headline: 'How Justin Welsh Engineers Demand',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['LinkedIn (~600K)', 'Newsletter (~220K)', 'X / Twitter (~180K)'],
      offers: ['LinkedIn OS', 'Content OS', 'The Operating System'],
      audienceType: 'Aspiring solopreneurs, corporate professionals planning an exit',
      audienceSize: '1M+ across platforms',
    },
    situation: [
      'Justin Welsh is the most visible architect of the solopreneur content stack on LinkedIn. He built a $5M+ one-person business by making the mechanics of that build radically visible — and then selling the system he used.',
      'His position is operational transparency. While most creators teach what to do, Welsh teaches exactly how: which tools, which sequences, which posts, which offers. The specificity is the product.',
      'His audience is predominantly corporate professionals who feel trapped and are actively planning an exit. They don\'t need to be convinced the solopreneur path is possible. Welsh\'s job is to remove the perceived skill gap between their current self and the person who can execute that path.',
      'His content machine is notable for its efficiency. He writes every weekday, maintains a strict format, and achieves extraordinary consistency — modeling the very operating discipline he sells.',
    ],
    situationQuote: 'Welsh doesn\'t sell inspiration. He sells the specific operational knowledge that turns aspiration into execution.',
    coreChallenge: 'The dominant friction Welsh faces is decision friction — his audience knows they want to leave, knows they want to build online, but is paralyzed by the number of decisions between here and there. He resolves this with extreme specificity: exact post formats, exact posting frequencies, exact tool stacks. The system removes decisions by making each choice obvious.',
    frictionTypes: ['attention', 'decision'],
    behavioralMoves: {
      attention: [
        'Specific numbers in the hook: "$5M one-person business" cuts through vague success claims',
        'Problem-first opening: names the frustration before offering the frame',
        'Consistent post format (hook / insight / lesson) trains audience to expect value',
        'LinkedIn algorithm mastery — optimal post timing, format, and engagement hooks',
      ],
      cognitiveAnchors: [
        '"LinkedIn OS" — turns content strategy into an operating system (prestigious, architectural)',
        '"Solopreneur" — creates a distinct identity category that audience self-selects into',
        '"One-person business" — normalizes solo scale, makes it feel achievable not lonely',
        '"$5M" — the specific number is the anchor, not the round number',
      ],
      knowledgePackaging: [
        'Daily LinkedIn posts: single insight, tight format — trains fast consumption',
        'Newsletter: goes deeper on the same ideas — extends relationship beyond feed',
        'Products are pure how-to: step-by-step, tool-specific, format-specific',
        'Free content IS the product preview — posts are chapters; course is the book',
      ],
      authoritySignals: [
        'Specific revenue figures cited consistently ($5M, not "millions")',
        'Process transparency: shows the actual workflow, not just the results',
        'Track record with named clients — makes success feel reproducible',
        'LinkedIn follower count visible and growing — social proof compounds daily',
      ],
    },
    learningFlow: [
      { from: 'Scrolling', to: 'Stopped', how: 'A specific number or named pain point matches their exact internal frustration' },
      { from: 'Stopped', to: 'Following', how: 'Three posts in a row deliver a useful, specific insight — pattern recognition triggers follow' },
      { from: 'Following', to: 'Trusting', how: 'Newsletter deepens the relationship — more context, more vulnerability, more specificity' },
      { from: 'Trusting', to: 'Buying', how: 'Product offer arrives as the logical next step to a system they\'ve already started building mentally' },
    ],
    narrativeSystem: {
      stories: ['Freedom', 'Mastery', 'Wealth'],
      dominant: 'Freedom',
      description: 'Welsh\'s dominant narrative is escape and freedom — the specific, operational freedom of building a business that doesn\'t require a team, an office, or a boss. Wealth is the evidence that freedom is real. Mastery is the path. But freedom is the emotional engine.',
      quote: 'The most dangerous thing you can do is build someone else\'s dream with your best hours.',
    },
    whatWorks: [
      'Extreme format consistency trains audience attention — they know exactly what they\'re getting',
      'Specificity (exact numbers, exact tools) removes the ambiguity that kills execution',
      'Daily posting compounds reach while modeling the discipline he sells',
      'Product names (LinkedIn OS, Content OS) make abstract skills feel like concrete systems',
      'The solopreneur identity category creates strong community cohesion without a community platform',
    ],
    missedOpportunities: [
      'Visual system is minimal — the "OS" framing would benefit enormously from a visible architecture diagram',
      'No explicit learning path visible on site — buyers have to infer which product to start with',
      'Narrative is freedom-focused but rarely explores the psychological transition from employee to owner',
      'Newsletter content and LinkedIn content are largely parallel, not compounding — a sequential design would deepen each',
    ],
    curiosityUpgrade: [
      'Build a visual "Operating System" diagram — make the architecture of his method visible, not just described',
      'Create an explicit decision tree for new visitors: "Which OS do you need?" — eliminates purchase friction',
      'Develop a "Transition Map" — visual journey from corporate employee to solopreneur, with his products as waypoints',
      'Design the newsletter as a layer beneath LinkedIn, not a mirror — each deepens the other\'s ideas',
    ],
    founderTakeaways: [
      'Specificity is the premium — "exactly $5M" converts better than "millions"',
      'Naming your system (OS, Method, Framework) elevates it from advice to architecture',
      'Daily repetition is a trust-building machine — consistency at scale is its own authority signal',
      'Freedom is the most powerful emotional hook for an audience that feels trapped',
      'Decision removal is a product feature — the less your buyer has to figure out, the faster they act',
    ],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug)
}
```

- [ ] **Step 1.2: Type-check the file**

```bash
cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit
```

Expected: No errors related to `lib/case-studies.ts`. If tuple type errors appear on `learningFlow`, verify all three objects have exactly 4 `LearningStep` entries.

- [ ] **Step 1.3: Commit**

```bash
cd /Users/gingerninja/Sites/curiosity-inc
git add lib/case-studies.ts
git commit -m "feat: add case study data layer with typed interface and 3 creator entries"
```

---

### Task 2: `components/ui/OrbitOverlay.tsx`

**Files:**
- Create: `components/ui/OrbitOverlay.tsx`

This is a reusable SVG concentric-circle overlay — the concentric circles (depth) sacred geometry symbol. Used on WorkSection cards and CaseStudyHero portrait. Extracted to avoid duplication.

- [ ] **Step 2.1: Create the component**

```tsx
// components/ui/OrbitOverlay.tsx
'use client'

interface OrbitOverlayProps {
  color: string           // e.g. 'var(--tang)' or '#ED773C'
  cx?: number             // center x within viewBox (default 150)
  cy?: number             // center y within viewBox (default 130)
  viewBoxWidth?: number   // default 300
  viewBoxHeight?: number  // default 375
}

export function OrbitOverlay({
  color,
  cx = 150,
  cy = 130,
  viewBoxWidth = 300,
  viewBoxHeight = 375,
}: OrbitOverlayProps) {
  const crosshairSize = 12

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      fill="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Outer orbit ring */}
      <circle cx={cx} cy={cy} r={105} stroke={color} strokeWidth={0.6} opacity={0.18} />
      {/* Middle orbit ring */}
      <circle cx={cx} cy={cy} r={70} stroke={color} strokeWidth={0.5} opacity={0.25} />
      {/* Inner orbit ring */}
      <circle cx={cx} cy={cy} r={40} stroke={color} strokeWidth={0.5} opacity={0.32} />

      {/* Horizontal axis */}
      <line
        x1={cx - 120} y1={cy}
        x2={cx + 120} y2={cy}
        stroke={color} strokeWidth={0.4} opacity={0.12}
      />
      {/* Vertical axis */}
      <line
        x1={cx} y1={cy - 140}
        x2={cx} y2={cy + 140}
        stroke={color} strokeWidth={0.4} opacity={0.12}
      />

      {/* Cross-hair at left orbit intersection */}
      <line
        x1={cx - 105 - crosshairSize / 2} y1={cy}
        x2={cx - 105 + crosshairSize / 2} y2={cy}
        stroke={color} strokeWidth={0.8} opacity={0.38}
      />
      {/* Cross-hair at right orbit intersection */}
      <line
        x1={cx + 105 - crosshairSize / 2} y1={cy}
        x2={cx + 105 + crosshairSize / 2} y2={cy}
        stroke={color} strokeWidth={0.8} opacity={0.38}
      />
      {/* Cross-hair at top orbit intersection */}
      <line
        x1={cx} y1={cy - 105 - crosshairSize / 2}
        x2={cx} y2={cy - 105 + crosshairSize / 2}
        stroke={color} strokeWidth={0.8} opacity={0.38}
      />
      {/* Cross-hair at bottom orbit intersection */}
      <line
        x1={cx} y1={cy + 105 - crosshairSize / 2}
        x2={cx} y2={cy + 105 + crosshairSize / 2}
        stroke={color} strokeWidth={0.8} opacity={0.38}
      />

      {/* Center node dot */}
      <circle cx={cx} cy={cy} r={2.5} fill={color} opacity={0.5} />
    </svg>
  )
}
```

- [ ] **Step 2.2: Type-check**

```bash
cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit
```

- [ ] **Step 2.3: Commit**

```bash
git add components/ui/OrbitOverlay.tsx
git commit -m "feat: add reusable OrbitOverlay SVG component (concentric circles symbol)"
```

---

## Chunk 2: WorkSection + Routing Shell

### Task 3: `components/sections/WorkSection.tsx`

**Files:**
- Create: `components/sections/WorkSection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 3.1: Create WorkSection**

```tsx
// components/sections/WorkSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { caseStudies, type CaseStudy } from '@/lib/case-studies'
import { OrbitOverlay } from '@/components/ui/OrbitOverlay'
import { ease, dur } from '@/lib/motion-config'


function CaseStudyCard({ cs, index }: { cs: CaseStudy; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        border: `1px solid rgba(234,228,218,${hovered ? 0.12 : 0.04})`,
        transition: 'border-color 0.4s ease',
        background: 'rgba(234,228,218,0.02)',
      }}
    >
      {/* Photo area */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
        <Image
          src={cs.image}
          alt={cs.name}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{
            objectFit: 'cover',
            filter: 'grayscale(100%) contrast(1.05)',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />

        {/* Sacred geometry overlay */}
        <OrbitOverlay color={cs.color} />

        {/* Gradient fade into card body */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, transparent 45%, var(--black) 100%)`,
        }} />

        {/* Index number — top left */}
        <span style={{
          position: 'absolute',
          top: 16,
          left: 20,
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: cs.color,
          opacity: 0.7,
        }}>
          {cs.index}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '20px 24px 28px' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px',
          color: 'var(--shell)',
        }}>
          {cs.name}
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--shell)',
          opacity: 0.4,
          marginBottom: '16px',
          letterSpacing: '0.04em',
        }}>
          Engineers {cs.outcome}
        </p>

        {/* Audience stat */}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          color: cs.color,
          marginBottom: '4px',
        }}>
          {cs.meta.audienceSize}
        </p>

        {/* Top platform */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          color: 'var(--shell)',
          opacity: 0.25,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          {cs.meta.platforms[0]}
        </p>

        {/* CTA */}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: cs.color,
          opacity: hovered ? 1 : 0.6,
          transition: 'opacity 0.3s ease',
        }}>
          Read Analysis ——→
        </p>
      </div>
    </Link>
  )
}

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerLines = headerRef.current?.querySelectorAll('.animate-line')
      const cards = cardsRef.current?.querySelectorAll('.animate-card')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      if (headerLines?.length) {
        tl.from(headerLines, {
          opacity: 0,
          y: 24,
          duration: dur.base,
          stagger: 0.1,
          ease: ease.out,
        })
      }

      if (cards?.length) {
        tl.from(cards, {
          opacity: 0,
          y: 40,
          duration: dur.slow,
          stagger: 0.12,
          ease: ease.out,
        }, '-=0.4')
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{
        padding: '120px 60px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Section header */}
      <div ref={headerRef} style={{ marginBottom: '64px' }}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--tang)',
          opacity: 0.6,
          marginBottom: '16px',
        }}>
          04 / Work
        </p>
        <h2 className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--shell)',
          marginBottom: '12px',
        }}>
          Three architects of attention.
        </h2>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--shell)',
          opacity: 0.4,
          maxWidth: '400px',
          lineHeight: 1.6,
        }}>
          Behavioral design and knowledge-architecture analysis of creators who have engineered authority at scale.
        </p>
      </div>

      {/* 3-column grid */}
      <div
        ref={cardsRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        {caseStudies.map((cs, i) => (
          <div key={cs.slug} className="animate-card">
            <CaseStudyCard cs={cs} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3.2: Add WorkSection to `app/page.tsx`**

Open `app/page.tsx`. Add the import and component:

```tsx
// Add import:
import { WorkSection } from '@/components/sections/WorkSection'

// In the JSX, add between SystemSection and AboutSection:
<SystemSection />
<WorkSection />
<AboutSection />
```

- [ ] **Step 3.3: Type-check**

```bash
cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit
```

- [ ] **Step 3.4: Visual check on dev server**

```bash
# Dev server should already be running on port 3002
# Open: http://localhost:3002
# Scroll to Section 04
# Verify: 3 cards render, orbit SVGs visible, hover state works
# If images are missing, cards should show dark bg + orbit overlay gracefully
```

- [ ] **Step 3.5: Commit**

```bash
git add components/sections/WorkSection.tsx app/page.tsx
git commit -m "feat: add WorkSection homepage grid (Section 04) with portrait cards"
```

---

### Task 4: Case study routing shell

**Files:**
- Create: `app/case-studies/[slug]/page.tsx`

This is a server component. It imports and renders client section components. The section components will be added incrementally in Tasks 5–13.

- [ ] **Step 4.1: Create the directory and page**

```tsx
// app/case-studies/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { caseStudies, getCaseStudy } from '@/lib/case-studies'

// Uncomment imports as each section component is created:
// import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
// import { SituationSection } from '@/components/case-study/SituationSection'
// ... etc

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return caseStudies.map(cs => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}
  return {
    title: `${cs.name} — Curiosity Inc`,
    description: cs.subhead,
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  return (
    <main style={{ background: 'var(--black)', minHeight: '100vh' }}>
      {/* Section components render here — add as built */}
      <div style={{ padding: '120px 60px', color: 'var(--shell)', fontFamily: 'var(--font-display)' }}>
        <p style={{ opacity: 0.4, fontSize: '12px', letterSpacing: '0.2em' }}>
          {cs.index} / {cs.outcome}
        </p>
        <h1 style={{ fontSize: '48px', marginTop: '16px' }}>{cs.headline}</h1>
        <p style={{ marginTop: '12px', opacity: 0.4 }}>Sections loading...</p>
      </div>
    </main>
  )
}
```

Note: `params` is a `Promise` in Next.js 15+. Always `await params` before destructuring.

- [ ] **Step 4.2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4.3: Test routes in browser**

Navigate to:
- `http://localhost:3002/case-studies/dan-koe`
- `http://localhost:3002/case-studies/ali-abdaal`
- `http://localhost:3002/case-studies/justin-welsh`

Each should show the placeholder headline. A bad slug (e.g. `/case-studies/nobody`) should show Next.js 404.

- [ ] **Step 4.4: Commit**

```bash
mkdir -p app/case-studies/\[slug\]
git add app/case-studies/
git commit -m "feat: add case study routing shell with generateStaticParams"
```

---

## Chunk 3: Case Study Sections 1–5

### Task 5: `CaseStudyHero.tsx`

**Files:**
- Create: `components/case-study/CaseStudyHero.tsx`

- [ ] **Step 5.1: Create the component**

```tsx
// components/case-study/CaseStudyHero.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { OrbitOverlay } from '@/components/ui/OrbitOverlay'
import { ease, dur } from '@/lib/motion-config'
import type { CaseStudy } from '@/lib/case-studies'

export function CaseStudyHero({ data }: { data: CaseStudy }) {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = heroRef.current?.querySelectorAll('.animate-line')
      if (lines?.length) {
        gsap.from(lines, {
          opacity: 0, y: 20,
          duration: dur.base,
          stagger: 0.08,
          ease: ease.out,
          delay: 0.2,
        })
      }
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={heroRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '60px',
        padding: '80px 60px 60px',
        maxWidth: '1200px',
        margin: '0 auto',
        alignItems: 'start',
      }}
    >
      {/* Portrait column */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#111' }}>
          <Image
            src={data.image}
            alt={data.name}
            fill
            priority
            sizes="280px"
            style={{
              objectFit: 'cover',
              filter: 'grayscale(100%) contrast(1.05)',
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <OrbitOverlay color={data.color} />
          {/* Fade right into text column */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, transparent 60%, var(--black) 100%)',
          }} />
        </div>
      </div>

      {/* Title column */}
      <div style={{ paddingTop: '8px' }}>
        <Link
          href="/#work"
          className="animate-line"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--shell)',
            opacity: 0.35,
            textDecoration: 'none',
            marginBottom: '32px',
          }}
        >
          ← Case Studies
        </Link>

        <p
          className="animate-line"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: data.color,
            opacity: 0.7,
            marginBottom: '12px',
          }}
        >
          {data.index} / {data.outcome}
        </p>

        <h1
          className="animate-line"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3.5vw, 42px)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--shell)',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}
        >
          {data.headline}
        </h1>

        <p
          className="animate-line"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--shell)',
            opacity: 0.4,
            marginBottom: '36px',
            letterSpacing: '0.04em',
          }}
        >
          {data.subhead}
        </p>

        {/* Meta strip */}
        <div
          className="animate-line"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px 40px',
            borderTop: '1px solid rgba(234,228,218,0.06)',
            paddingTop: '24px',
          }}
        >
          <MetaItem label="Platforms analyzed" value={data.meta.platforms.join(' · ')} color={data.color} />
          <MetaItem label="Audience type" value={data.meta.audienceType} color={data.color} />
          <MetaItem label="Offers analyzed" value={data.meta.offers.join(' · ')} color={data.color} />
          <MetaItem label="Audience size" value={data.meta.audienceSize} color={data.color} />
        </div>
      </div>
    </div>
  )
}

function MetaItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color,
        opacity: 0.5,
        marginBottom: '4px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        color: 'var(--shell)',
        opacity: 0.55,
        lineHeight: 1.5,
      }}>
        {value}
      </p>
    </div>
  )
}
```

- [ ] **Step 5.2: Wire into `app/case-studies/[slug]/page.tsx`**

Uncomment the `CaseStudyHero` import and add `<CaseStudyHero data={cs} />` as the first child of `<main>`. Remove the placeholder div.

- [ ] **Step 5.3: Type-check + visual verify**

```bash
npx tsc --noEmit
# Then check http://localhost:3002/case-studies/dan-koe
```

- [ ] **Step 5.4: Commit**

```bash
git add components/case-study/CaseStudyHero.tsx app/case-studies/
git commit -m "feat: add CaseStudyHero section (portrait + title + meta)"
```

---

### Task 6: Shared section layout utilities

Before building content sections, create a shared section wrapper to avoid repeating border/padding/layout code.

**Files:**
- Create: `components/case-study/SectionShell.tsx`

- [ ] **Step 6.1: Create SectionShell**

```tsx
// components/case-study/SectionShell.tsx

import type { ReactNode, CSSProperties } from 'react'

interface SectionShellProps {
  children: ReactNode
  alt?: boolean  // alternating background
  style?: CSSProperties
}

export function SectionShell({ children, alt = false, style }: SectionShellProps) {
  return (
    <section
      style={{
        background: alt ? 'rgba(255,255,255,0.02)' : 'transparent',
        padding: '80px 60px',
        ...style,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {children}
      </div>
    </section>
  )
}

interface PullQuoteProps {
  text: string
  color: string
}

export function PullQuote({ text, color }: PullQuoteProps) {
  return (
    <blockquote
      style={{
        borderLeft: `1.5px solid ${color}`,
        background: `rgba(100,100,100,0.04)`,
        padding: '16px 20px',
        margin: '32px 0',
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        fontStyle: 'italic',
        color: 'var(--shell)',
        opacity: 0.75,
        lineHeight: 1.6,
      }}
    >
      "{text}"
    </blockquote>
  )
}

interface InsightBlockProps {
  label: string
  text: string
  color: string
}

export function InsightBlock({ label, text, color }: InsightBlockProps) {
  return (
    <div
      style={{
        background: 'rgba(234,228,218,0.03)',
        border: '1px solid rgba(234,228,218,0.07)',
        padding: '16px 20px',
        marginTop: '32px',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color,
        opacity: 0.6,
        marginBottom: '6px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--shell)',
        opacity: 0.6,
        lineHeight: 1.5,
      }}>
        {text}
      </p>
    </div>
  )
}
```

- [ ] **Step 6.2: Commit**

```bash
git add components/case-study/SectionShell.tsx
git commit -m "feat: add shared section shell utilities (SectionShell, PullQuote, InsightBlock)"
```

---

### Task 7: `SituationSection.tsx`

**Files:**
- Create: `components/case-study/SituationSection.tsx`

- [ ] **Step 7.1: Create the component**

```tsx
// components/case-study/SituationSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'


// Inline ThinLineSystem ghost — system variant, top-right corner
function SystemGhost({ color }: { color: string }) {
  return (
    <div style={{
      position: 'absolute',
      top: -40,
      right: -40,
      width: 280,
      height: 280,
      opacity: 0.06,
      pointerEvents: 'none',
    }}>
      <svg viewBox="0 0 280 280" fill="none" style={{ width: '100%', height: '100%' }}>
        {/* Simplified system diagram ghost — concentric rectangles + spine */}
        <rect x={20} y={20} width={240} height={240} stroke={color} strokeWidth={0.5} />
        <rect x={50} y={50} width={180} height={180} stroke={color} strokeWidth={0.4} />
        <rect x={80} y={80} width={120} height={120} stroke={color} strokeWidth={0.3} />
        <line x1={140} y1={20} x2={140} y2={260} stroke={color} strokeWidth={0.4} />
        <line x1={20} y1={140} x2={260} y2={140} stroke={color} strokeWidth={0.4} />
        <circle cx={140} cy={140} r={8} stroke={color} strokeWidth={0.8} />
        <circle cx={140} cy={140} r={3} fill={color} />
      </svg>
    </div>
  )
}

export function SituationSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = ref.current?.querySelectorAll('.animate-line')
      if (lines?.length) {
        gsap.from(lines, {
          opacity: 0, y: 20,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        })
      }
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell alt>
      <div ref={ref} style={{ position: 'relative' }}>
        <SystemGhost color={data.color} />

        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '20px',
        }}>
          01 / The Situation
        </p>

        {data.situation.map((para, i) => (
          <p
            key={i}
            className="animate-line"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--shell)',
              opacity: 0.65,
              lineHeight: 1.75,
              marginBottom: '18px',
              maxWidth: '720px',
            }}
          >
            {para}
          </p>
        ))}

        <PullQuote text={data.situationQuote} color={data.color} />
        <InsightBlock
          label="Market position"
          text={`${data.name} is positioned as the ${data.outcome.toLowerCase()} architect for ${data.meta.audienceType.toLowerCase()}.`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
```

- [ ] **Step 7.2: Wire into page.tsx**

Add import + `<SituationSection data={cs} />` after `<CaseStudyHero />`.

- [ ] **Step 7.3: Type-check + visual verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 7.4: Commit**

```bash
git add components/case-study/SituationSection.tsx app/case-studies/
git commit -m "feat: add SituationSection with ThinLineSystem ghost"
```

---

### Task 8: `ChallengeSection.tsx`

**Files:**
- Create: `components/case-study/ChallengeSection.tsx`

- [ ] **Step 8.1: Create the component**

```tsx
// components/case-study/ChallengeSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'


const ALL_FRICTION = ['attention', 'trust', 'clarity', 'identity', 'decision'] as const

export function ChallengeSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.animate-line') ?? [], {
        opacity: 0, y: 16,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell>
      <div ref={ref}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '20px',
        }}>
          02 / Core Challenge
        </p>

        {/* Friction pills */}
        <div className="animate-line" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {ALL_FRICTION.map(f => {
            const isActive = data.frictionTypes.includes(f)
            return (
              <span
                key={f}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isActive ? '11px' : '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  border: `1px solid ${isActive ? data.color : 'rgba(234,228,218,0.08)'}`,
                  color: isActive ? data.color : 'var(--shell)',
                  opacity: isActive ? 0.9 : 0.15,
                  transition: 'all 0.3s ease',
                }}
              >
                {f}
              </span>
            )
          })}
        </div>

        <p className="animate-line" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--shell)',
          opacity: 0.65,
          lineHeight: 1.75,
          maxWidth: '720px',
          marginBottom: '24px',
        }}>
          {data.coreChallenge}
        </p>

        <PullQuote text={data.coreChallenge.split('.')[0] + '.'} color={data.color} />
        <InsightBlock
          label="Primary lever"
          text={`${data.frictionTypes[0].charAt(0).toUpperCase() + data.frictionTypes[0].slice(1)} friction is the dominant barrier — the system must resolve this before any other layer.`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
```

- [ ] **Step 8.2: Wire + type-check + commit**

```bash
# Wire into page.tsx: add import + <ChallengeSection data={cs} />
npx tsc --noEmit
git add components/case-study/ChallengeSection.tsx app/case-studies/
git commit -m "feat: add ChallengeSection with friction type pills"
```

---

### Task 9: `MovesSection.tsx`

**Files:**
- Create: `components/case-study/MovesSection.tsx`

- [ ] **Step 9.1: Create the component**

```tsx
// components/case-study/MovesSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'


const QUADRANTS = [
  { key: 'attention' as const, label: 'Attention Strategy' },
  { key: 'cognitiveAnchors' as const, label: 'Cognitive Anchors' },
  { key: 'knowledgePackaging' as const, label: 'Knowledge Packaging' },
  { key: 'authoritySignals' as const, label: 'Authority Signals' },
]

export function MovesSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.animate-line') ?? [], {
        opacity: 0, y: 16,
        duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell alt>
      <div ref={ref}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '24px',
        }}>
          03 / Behavioral Moves
        </p>

        {/* 2×2 Grid — the Grid (architecture) sacred geometry symbol */}
        <div className="animate-line" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid rgba(234,228,218,0.06)',
          marginBottom: '32px',
        }}>
          {QUADRANTS.map((q, i) => (
            <div
              key={q.key}
              style={{
                padding: '24px',
                borderRight: i % 2 === 0 ? '1px solid rgba(234,228,218,0.06)' : 'none',
                borderBottom: i < 2 ? '1px solid rgba(234,228,218,0.06)' : 'none',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: data.color,
                opacity: 0.6,
                marginBottom: '12px',
              }}>
                {q.label}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.behavioralMoves[q.key].map((item, j) => (
                  <li key={j} style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--shell)',
                    opacity: 0.55,
                    lineHeight: 1.6,
                    paddingBottom: '6px',
                    paddingLeft: '12px',
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: data.color,
                      opacity: 0.5,
                      fontSize: '8px',
                      top: '4px',
                    }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <PullQuote text={data.behavioralMoves.cognitiveAnchors[0]} color={data.color} />
        <InsightBlock
          label="Most leveraged move"
          text={data.behavioralMoves.attention[0]}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
```

- [ ] **Step 9.2: Wire + type-check + commit**

```bash
npx tsc --noEmit
git add components/case-study/MovesSection.tsx app/case-studies/
git commit -m "feat: add MovesSection with 2x2 behavioral moves grid"
```

---

### Task 10: `LearningFlowSection.tsx`

**Files:**
- Create: `components/case-study/LearningFlowSection.tsx`

This is the most complex diagram — a horizontal SVG orbit-node chain with 5 nodes. Each node uses concentric circles (depth symbol); the final node gets a glow ring (breakthrough symbol).

- [ ] **Step 10.1: Create the component**

```tsx
// components/case-study/LearningFlowSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'


const NODE_X = [60, 180, 300, 420, 540]
const NODE_Y = 60
const SVG_W = 600
const SVG_H = 120

export function LearningFlowSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Build stage labels from learningFlow
  const stages = [
    data.learningFlow[0].from,
    data.learningFlow[0].to,
    data.learningFlow[1].to,
    data.learningFlow[2].to,
    data.learningFlow[3].to,
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate node circles from scale 0
      const nodes = svgRef.current?.querySelectorAll('.flow-node')
      const connectors = svgRef.current?.querySelectorAll('.flow-connector')
      const labels = svgRef.current?.querySelectorAll('.flow-label')

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })

      if (connectors?.length) {
        tl.from(connectors, { opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
      }
      if (nodes?.length) {
        tl.from(nodes, { scale: 0, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)', transformOrigin: 'center' }, '-=0.3')
      }
      if (labels?.length) {
        tl.from(labels, { opacity: 0, y: 6, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.2')
      }

      // Text lines
      const lines = ref.current?.querySelectorAll('.animate-line')
      if (lines?.length) {
        tl.from(lines, { opacity: 0, y: 16, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, '-=0.2')
      }
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell>
      <div ref={ref}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '24px',
        }}>
          04 / Learning Flow
        </p>

        {/* SVG orbit-node chain */}
        <div style={{ width: '100%', overflowX: 'auto', marginBottom: '32px' }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ width: '100%', minWidth: '400px', maxWidth: '700px' }}
            fill="none"
          >
            {/* Connector lines between nodes */}
            {NODE_X.slice(0, -1).map((x, i) => (
              <g key={i} className="flow-connector">
                <line
                  x1={x + 28} y1={NODE_Y}
                  x2={NODE_X[i + 1] - 28} y2={NODE_Y}
                  stroke={data.color}
                  strokeWidth={0.6}
                  opacity={0.3}
                />
                {/* Arrowhead at midpoint */}
                <polygon
                  points={`${(x + NODE_X[i + 1]) / 2 + 4},${NODE_Y} ${(x + NODE_X[i + 1]) / 2 - 2},${NODE_Y - 3} ${(x + NODE_X[i + 1]) / 2 - 2},${NODE_Y + 3}`}
                  fill={data.color}
                  opacity={0.3}
                />
              </g>
            ))}

            {/* Nodes */}
            {NODE_X.map((cx, i) => {
              const isFinal = i === 4
              const progress = i / 4  // 0 to 1
              const opacity = 0.1 + progress * 0.9

              return (
                <g key={i} className="flow-node">
                  {/* Glow halo on final node — breakthrough symbol */}
                  {isFinal && (
                    <circle cx={cx} cy={NODE_Y} r={32} fill={data.color} opacity={0.06} />
                  )}
                  {/* Outer ring */}
                  <circle cx={cx} cy={NODE_Y} r={24} stroke={data.color} strokeWidth={0.5} opacity={opacity * 0.4} />
                  {/* Middle ring */}
                  <circle cx={cx} cy={NODE_Y} r={16} stroke={data.color} strokeWidth={0.5} opacity={opacity * 0.6} />
                  {/* Inner ring */}
                  <circle cx={cx} cy={NODE_Y} r={8} stroke={data.color} strokeWidth={0.6} opacity={opacity * 0.8} />
                  {/* Center dot */}
                  <circle cx={cx} cy={NODE_Y} r={isFinal ? 4 : 2.5} fill={data.color} opacity={opacity} />
                </g>
              )
            })}

            {/* Stage labels */}
            {stages.map((label, i) => (
              <text
                key={i}
                className="flow-label"
                x={NODE_X[i]}
                y={NODE_Y + 42}
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontSize="8"
                letterSpacing="0.15em"
                fill="rgba(234,228,218,0.4)"
              >
                {label.toUpperCase()}
              </text>
            ))}
          </svg>
        </div>

        {/* How labels below SVG */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {data.learningFlow.map((step, i) => (
            <div key={i} style={{ paddingLeft: '12px', borderLeft: `1px solid rgba(234,228,218,0.06)` }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'var(--shell)',
                opacity: 0.45,
                lineHeight: 1.5,
              }}>
                {step.how}
              </p>
            </div>
          ))}
        </div>

        <PullQuote text={data.learningFlow[1].how} color={data.color} />
        <InsightBlock
          label="The step most creators skip"
          text={`${data.learningFlow[2].from} → ${data.learningFlow[2].to}: ${data.learningFlow[2].how}`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
```

- [ ] **Step 10.2: Wire + type-check + commit**

```bash
npx tsc --noEmit
git add components/case-study/LearningFlowSection.tsx app/case-studies/
git commit -m "feat: add LearningFlowSection with SVG orbit-node chain"
```

---

## Chunk 4: Case Study Sections 6–10 + Final Wiring

### Task 11: `NarrativeSection.tsx`

**Files:**
- Create: `components/case-study/NarrativeSection.tsx`

- [ ] **Step 11.1: Create the component**

```tsx
// components/case-study/NarrativeSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'


const ALL_ARCHETYPES = ['Rebellion', 'Mastery', 'Simplicity', 'Wealth', 'Freedom', 'Intelligence']

export function NarrativeSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.animate-line') ?? [], {
        opacity: 0, y: 16,
        duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell alt>
      <div ref={ref}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '24px',
        }}>
          05 / Narrative System
        </p>

        {/* Archetype pills */}
        <div className="animate-line" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px', alignItems: 'baseline' }}>
          {ALL_ARCHETYPES.map(a => {
            const isActive = data.narrativeSystem.stories.includes(a)
            const isDominant = a === data.narrativeSystem.dominant
            return (
              <span
                key={a}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isDominant ? '14px' : isActive ? '11px' : '10px',
                  letterSpacing: isDominant ? '0.18em' : '0.12em',
                  textTransform: 'uppercase',
                  padding: isDominant ? '8px 16px' : '5px 12px',
                  border: `1px solid ${isActive ? data.color : 'rgba(234,228,218,0.06)'}`,
                  color: isActive ? data.color : 'var(--shell)',
                  opacity: isDominant ? 1 : isActive ? 0.8 : 0.12,
                }}
              >
                {a}
              </span>
            )
          })}
        </div>

        <p className="animate-line" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--shell)',
          opacity: 0.65,
          lineHeight: 1.75,
          maxWidth: '720px',
          marginBottom: '24px',
        }}>
          {data.narrativeSystem.description}
        </p>

        <PullQuote text={data.narrativeSystem.quote} color={data.color} />
        <InsightBlock
          label="Why this narrative works"
          text={`The ${data.narrativeSystem.dominant.toLowerCase()} narrative maps directly onto the emotional state of ${data.meta.audienceType.toLowerCase()} — it resolves the tension they feel before they know how to name it.`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
```

- [ ] **Step 11.2: Wire + type-check + commit**

```bash
npx tsc --noEmit
git add components/case-study/NarrativeSection.tsx app/case-studies/
git commit -m "feat: add NarrativeSection with dominant archetype pills"
```

---

### Task 12: `WhatWorksSection.tsx` + `MissedOpsSection.tsx`

**Files:**
- Create: `components/case-study/WhatWorksSection.tsx`
- Create: `components/case-study/MissedOpsSection.tsx`

- [ ] **Step 12.1: Create WhatWorksSection**

```tsx
// components/case-study/WhatWorksSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'


export function WhatWorksSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.animate-line') ?? [], {
        opacity: 0, y: 16,
        duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell>
      <div ref={ref}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '24px',
        }}>
          06 / What Works
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', maxWidth: '680px' }}>
          {data.whatWorks.map((item, i) => (
            <li key={i} className="animate-line" style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              paddingBottom: '14px',
              borderBottom: '1px solid rgba(234,228,218,0.04)',
              marginBottom: '14px',
            }}>
              <span style={{ color: data.color, fontSize: '9px', marginTop: '5px', flexShrink: 0 }}>●</span>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--shell)',
                opacity: 0.6,
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item}
              </p>
            </li>
          ))}
        </ul>

        <PullQuote text={data.whatWorks[0]} color={data.color} />
        <InsightBlock
          label="Transferable pattern"
          text={data.whatWorks[0]}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
```

- [ ] **Step 12.2: Create MissedOpsSection**

```tsx
// components/case-study/MissedOpsSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'


export function MissedOpsSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.animate-line') ?? [], {
        opacity: 0, y: 16,
        duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell alt>
      <div ref={ref}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '24px',
        }}>
          07 / Missed Opportunities
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', maxWidth: '680px' }}>
          {data.missedOpportunities.map((item, i) => (
            <li key={i} className="animate-line" style={{
              paddingBottom: '14px',
              borderBottom: '1px solid rgba(234,228,218,0.04)',
              marginBottom: '14px',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--shell)',
                opacity: 0.38,   // intentionally quieter
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item}
              </p>
            </li>
          ))}
        </ul>

        <PullQuote text={data.missedOpportunities[0]} color={data.color} />
        <InsightBlock
          label="What fixing this unlocks"
          text={`A clearer architecture between content and product would accelerate the ${data.learningFlow[2].from.toLowerCase()} → ${data.learningFlow[2].to.toLowerCase()} transition significantly.`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
```

- [ ] **Step 12.3: Wire both + type-check + commit**

```bash
npx tsc --noEmit
git add components/case-study/WhatWorksSection.tsx components/case-study/MissedOpsSection.tsx app/case-studies/
git commit -m "feat: add WhatWorksSection and MissedOpsSection"
```

---

### Task 13: `CuriosityUpgradeSection.tsx`

**Files:**
- Create: `components/case-study/CuriosityUpgradeSection.tsx`

- [ ] **Step 13.1: Create the component**

```tsx
// components/case-study/CuriosityUpgradeSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell, PullQuote, InsightBlock } from './SectionShell'
import type { CaseStudy } from '@/lib/case-studies'


// Triangle SVG — direction / forward motion symbol (mirrors CTASection)
function TriangleAccent({ color }: { color: string }) {
  return (
    <svg width="28" height="26" viewBox="0 0 28 26" fill="none" style={{ display: 'block', marginBottom: '20px' }}>
      <polygon
        points="14,2 26,24 2,24"
        stroke={color}
        strokeWidth={1}
        fill="none"
        opacity={0.5}
      />
    </svg>
  )
}

export function CuriosityUpgradeSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll('.animate-line') ?? [], {
        opacity: 0, y: 16,
        duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell>
      <div ref={ref}>
        <p className="animate-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '16px',
        }}>
          08 / The Curiosity Upgrade
        </p>

        <TriangleAccent color={data.color} />

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', maxWidth: '680px' }}>
          {data.curiosityUpgrade.map((item, i) => (
            <li key={i} className="animate-line" style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
              paddingBottom: '16px',
              marginBottom: '4px',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                color: data.color,
                marginTop: '3px',
                flexShrink: 0,
                letterSpacing: '0.1em',
              }}>
                →
              </span>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--shell)',
                opacity: 0.65,
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item}
              </p>
            </li>
          ))}
        </ul>

        <PullQuote text={data.curiosityUpgrade[0]} color={data.color} />
        <InsightBlock
          label="Why behavioral architecture enables this"
          text={`Cognitive architecture isn't a rebrand — it's a structural change to how information moves through the system. The upgrade isn't cosmetic; it's functional.`}
          color={data.color}
        />
      </div>
    </SectionShell>
  )
}
```

- [ ] **Step 13.2: Wire + type-check + commit**

```bash
npx tsc --noEmit
git add components/case-study/CuriosityUpgradeSection.tsx app/case-studies/
git commit -m "feat: add CuriosityUpgradeSection with triangle symbol and arrow bullets"
```

---

### Task 14: `TakeawaysSection.tsx`

**Files:**
- Create: `components/case-study/TakeawaysSection.tsx`

- [ ] **Step 14.1: Create the component**

```tsx
// components/case-study/TakeawaysSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { SectionShell } from './SectionShell'
import { Orb } from '@/components/ui/Orb'
import { caseStudies, type CaseStudy } from '@/lib/case-studies'


// Orb: existing component — glow = breakthrough / resolved signal
// Import from '@/components/ui/Orb' — do not redefine inline

export function TakeawaysSection({ data }: { data: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)

  const currentIndex = caseStudies.findIndex(cs => cs.slug === data.slug)
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = ref.current?.querySelectorAll('.animate-item')
      if (items?.length) {
        gsap.from(items, {
          opacity: 0, y: 24,
          duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        })
      }
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionShell alt>
      <div ref={ref}>
        <p className="animate-item" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.5,
          marginBottom: '48px',
        }}>
          09 / Founder Takeaways
        </p>

        {/* 5 large numbered insights */}
        <div style={{ maxWidth: '800px' }}>
          {data.founderTakeaways.map((takeaway, i) => (
            <div
              key={i}
              className="animate-item"
              style={{
                display: 'flex',
                gap: '28px',
                alignItems: 'baseline',
                paddingBottom: '32px',
                borderBottom: '1px solid rgba(234,228,218,0.05)',
                marginBottom: '32px',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                color: data.color,
                opacity: 0.45,
                letterSpacing: '0.2em',
                minWidth: '28px',
                flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(16px, 2vw, 22px)',
                letterSpacing: '0.03em',
                lineHeight: 1.3,
                color: 'var(--shell)',
                margin: 0,
              }}>
                {takeaway}
              </p>
            </div>
          ))}
        </div>

        {/* Orb — glow = breakthrough / resolved signal */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <Orb size={12} />
        </div>

        {/* Next case study navigation */}
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(234,228,218,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href="/#work"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--shell)',
              opacity: 0.3,
              textDecoration: 'none',
            }}
          >
            ← Case Studies
          </Link>
          <Link
            href={`/case-studies/${nextStudy.slug}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: nextStudy.color,
              opacity: 0.7,
              textDecoration: 'none',
            }}
          >
            Next: {nextStudy.name} →
          </Link>
        </div>
      </div>
    </SectionShell>
  )
}
```

- [ ] **Step 14.2: Wire all remaining sections into `app/case-studies/[slug]/page.tsx`**

The final `page.tsx` should import and render all 10 sections in order:

```tsx
import { notFound } from 'next/navigation'
import { caseStudies, getCaseStudy } from '@/lib/case-studies'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { SituationSection } from '@/components/case-study/SituationSection'
import { ChallengeSection } from '@/components/case-study/ChallengeSection'
import { MovesSection } from '@/components/case-study/MovesSection'
import { LearningFlowSection } from '@/components/case-study/LearningFlowSection'
import { NarrativeSection } from '@/components/case-study/NarrativeSection'
import { WhatWorksSection } from '@/components/case-study/WhatWorksSection'
import { MissedOpsSection } from '@/components/case-study/MissedOpsSection'
import { CuriosityUpgradeSection } from '@/components/case-study/CuriosityUpgradeSection'
import { TakeawaysSection } from '@/components/case-study/TakeawaysSection'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return caseStudies.map(cs => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}
  return {
    title: `${cs.name} — Curiosity Inc`,
    description: cs.subhead,
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  return (
    <main style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <CaseStudyHero data={cs} />
      <SituationSection data={cs} />
      <ChallengeSection data={cs} />
      <MovesSection data={cs} />
      <LearningFlowSection data={cs} />
      <NarrativeSection data={cs} />
      <WhatWorksSection data={cs} />
      <MissedOpsSection data={cs} />
      <CuriosityUpgradeSection data={cs} />
      <TakeawaysSection data={cs} />
    </main>
  )
}
```

- [ ] **Step 14.3: Type-check**

```bash
cd /Users/gingerninja/Sites/curiosity-inc && npx tsc --noEmit
```

Expected: Zero errors. Common failure modes:
- `params` not awaited → `Property 'slug' does not exist on type 'Promise<...>'` — ensure `await params`
- Missing `'use client'` on any section component that uses hooks → runtime error
- Tuple type mismatch on `learningFlow` → verify exactly 4 entries per creator

- [ ] **Step 14.4: Build check**

```bash
npm run build
```

Expected: All 3 case study routes pre-rendered at build time. Watch for any hydration warnings.

- [ ] **Step 14.5: Full visual review in browser**

Visit each route and verify:
- `http://localhost:3002/` — WorkSection grid visible at Section 04
- `http://localhost:3002/case-studies/dan-koe` — all 10 sections, tang accent color
- `http://localhost:3002/case-studies/ali-abdaal` — all 10 sections, lav accent color
- `http://localhost:3002/case-studies/justin-welsh` — all 10 sections, must accent color
- GSAP scroll animations trigger correctly on each section
- "Next" link cycles correctly (Welsh → Koe, etc.)
- Bad slug → `/case-studies/nobody` shows 404

- [ ] **Step 14.6: Final commit**

```bash
git add components/case-study/TakeawaysSection.tsx app/case-studies/
git commit -m "feat: complete case studies feature — all 10 sections wired"
```

---

## Image Checklist (user action required)

Place these files before visual review. Cards and hero sections degrade gracefully if missing (orbit SVG over dark gradient), but the design is best with real portraits:

```
/public/images/dan-koe.jpg        ← square or portrait crop, min 600px wide
/public/images/ali-abdaal.jpg     ← same
/public/images/justin-welsh.jpg   ← same
```

CSS applies `grayscale(100%) contrast(1.05)` automatically.
