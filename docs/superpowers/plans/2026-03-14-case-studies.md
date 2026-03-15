# Case Studies Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a WorkSection homepage grid (Section 04) and three `/case-studies/[slug]` pages using the 7-stage behavioral symbol system (Confusion → Authority), with color-coded sacred geometry accents per section.

**Architecture:** Data in `lib/case-studies.ts`. Symbol renderer in `components/geo/Symbol.tsx`. Case study pages have exactly 7 sections — one per symbol, no repeats. Server component page with `generateStaticParams` for SSG.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, GSAP 3.14 + ScrollTrigger, Tailwind v4

**Spec:** `docs/superpowers/specs/2026-03-14-case-studies-design.md`
**Symbol source:** `lib/symbols.ts` — geometry, colors, semantic definitions
**Design tokens:** `lib/design-tokens.ts`, `lib/motion-config.ts`
**Headshots:** `/public/images/dan-koe.jpg`, `ali-abdaal.jpg`, `justin-welsh.jpg` (confirmed present)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/symbols.ts` | Modify | Fix `caseStudySectionSymbols` to 7 entries, no duplicates |
| `lib/case-studies.ts` | Create | Typed data for all 3 creators |
| `components/geo/Symbol.tsx` | Create | SVG renderer for behavioral symbols — `'use client'` |
| `components/sections/WorkSection.tsx` | Create | Homepage Section 04 grid — `'use client'`, GSAP |
| `app/page.tsx` | Modify | Add `<WorkSection />` between SystemSection and AboutSection |
| `app/case-studies/[slug]/page.tsx` | Create | Server component, `generateStaticParams` |
| `components/case-study/SectionWrapper.tsx` | Create | Shared layout: symbol accent, eyebrow, PullQuote, InsightBlock |
| `components/case-study/CaseStudyHero.tsx` | Create | Section 01 — Confusion (sky) |
| `components/case-study/AwarenessSection.tsx` | Create | Section 02 — Awareness (pink) |
| `components/case-study/InsightSection.tsx` | Create | Section 03 — Insight (must) |
| `components/case-study/ActionSection.tsx` | Create | Section 04 — Action (tea) |
| `components/case-study/FrameworkSection.tsx` | Create | Section 05 — Framework (lav) |
| `components/case-study/SystemSection.tsx` | Create | Section 06 — System (shell 75%) |
| `components/case-study/AuthoritySection.tsx` | Create | Section 07 — Authority (tang) |

All `components/case-study/*.tsx` are `'use client'` — they use GSAP useEffect/useRef.

---

## Chunk 1: Foundation

### Task 1: Fix symbol section map to 7 entries

**Files:** Modify `lib/symbols.ts`

- [ ] Replace `caseStudySectionSymbols` with exactly 7 entries:

```typescript
export const caseStudySectionSymbols = {
  hero:       'confusion',
  awareness:  'awareness',
  insight:    'insight',
  action:     'action',
  framework:  'framework',
  system:     'system',
  authority:  'authority',
} as const satisfies Record<string, SymbolId>

export type CaseStudySectionKey = keyof typeof caseStudySectionSymbols

export function getSectionSymbol(key: CaseStudySectionKey): BehavioralSymbol {
  return symbols[caseStudySectionSymbols[key]]
}
```

- [ ] Compile check: `npx tsc --noEmit` — expect 0 errors
- [ ] Commit: `git commit -m "fix: collapse caseStudySectionSymbols to 7 unique entries"`

---

### Task 2: Build `lib/case-studies.ts`

**Files:** Create `lib/case-studies.ts`

- [ ] Create file with typed interface + 3 creator entries:

```typescript
import type { CaseStudySectionKey } from './symbols'

export interface LearningStep { from: string; to: string; how: string }

export interface CaseStudy {
  slug: string; index: string; name: string; outcome: string
  color: string; image: string
  headline: string; subhead: string
  meta: { platforms: string[]; offers: string[]; audienceType: string; audienceSize: string }
  situation: string[]; challenge: string; frictionTypes: string[]; awarenessQuote: string
  behavioralMoves: { attention: string[]; cognitiveAnchors: string[]; knowledgePackaging: string[]; authoritySignals: string[] }
  insightQuote: string
  learningFlow: [LearningStep, LearningStep, LearningStep, LearningStep]
  actionQuote: string
  narrativeSystem: { stories: string[]; dominant: string; description: string; quote: string }
  whatWorks: string[]; missedOpportunities: string[]; systemQuote: string
  curiosityUpgrade: string[]
  takeaways: [string, string, string, string, string]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'dan-koe', index: '01', name: 'Dan Koe', outcome: 'Authority',
    color: 'var(--tang)', image: '/images/dan-koe.jpg',
    headline: 'How Dan Koe Engineers Authority',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['X / Twitter (~1.2M)', 'YouTube (~650K)', 'Newsletter (~350K+)'],
      offers: ['The 2-Hour Writer', 'Modern Mastery (community)', '1-on-1 consulting'],
      audienceType: 'Ambitious generalists building a 1-person business',
      audienceSize: '2.4M+ across platforms',
    },
    situation: [
      'Dan Koe operates in one of the noisiest categories online: self-improvement. Thousands of creators compete for the same searcher — someone who feels stuck, wants more freedom, and is open to new frameworks.',
      'What sets Koe apart is that he doesn\'t position himself inside the self-improvement category. He positions himself against it. His brand is built on the premise that conventional productivity advice is a distraction from building real leverage.',
      'His audience is not looking for morning routines. They\'re looking for a philosophy. Koe gives them one — and then sells them the tools to act on it.',
      'The sophistication of his market position is unusual for a solo creator: he operates at the level of worldview architecture, not tactical advice.',
    ],
    challenge: 'The core friction is trust. Why would a young man with no conventional credentials be worth listening to on life philosophy? Koe solves this not with credentials but with epistemological positioning — he makes the reader feel smarter for agreeing with him, which creates instant identity alignment.',
    frictionTypes: ['trust', 'identity'],
    awarenessQuote: 'He doesn\'t sell information. He sells a way of seeing.',
    behavioralMoves: {
      attention: ['Contrarian hook: "Most advice is wrong"', 'Philosophy framing over tactical framing', 'Long-form threads that reward careful reading', 'Visual identity of solitude and focus'],
      cognitiveAnchors: ['"The 1-person business"', '"Modern Mastery"', '"Generalist advantage"', '"Work less, earn more"'],
      knowledgePackaging: ['Thread → email → essay → product pipeline', 'Single idea expressed across 5 formats', 'Books and philosophy cited as credibility proxies', 'Paid community as idea laboratory'],
      authoritySignals: ['Revenue transparency (income reports)', 'Longevity (5+ years consistent)', 'Refusal to follow platform conventions', 'Philosophical depth as differentiator'],
    },
    insightQuote: '"The generalist advantage" — three words that reframe a perceived weakness as a competitive moat.',
    learningFlow: [
      { from: 'Skeptical', to: 'Intrigued', how: 'Contrarian hook challenges their current belief system' },
      { from: 'Intrigued', to: 'Aligned', how: 'Philosophy content creates identity resonance' },
      { from: 'Aligned', to: 'Trusting', how: 'Consistent depth signals genuine expertise, not performance' },
      { from: 'Trusting', to: 'Buying', how: 'Product offer feels like a natural extension of the worldview adopted' },
    ],
    actionQuote: 'The identity alignment happens before the pitch. By the time the offer appears, the reader already sees themselves inside it.',
    narrativeSystem: {
      stories: ['Mastery', 'Freedom', 'Intelligence'],
      dominant: 'Freedom',
      description: 'The dominant narrative is freedom — not hustle, not wealth as an end, but the philosophical freedom to design your own life. This narrative pre-selects for an audience that will resonate deeply and filter out people who want tactics.',
      quote: '"Freedom is the goal. Everything else is a metric."',
    },
    whatWorks: [
      'Idea repetition — same core concepts expressed across years and formats without exhaustion',
      'Identity-first positioning — sells a self-image before any product',
      'Long-form tolerance — audience is self-selected for patience and depth',
      'Philosophy as moat — hard to copy because it requires genuine worldview, not just content',
      'Pipeline clarity — thread → email → community → consulting is a clean behavioral funnel',
    ],
    missedOpportunities: [
      'No visual system — the philosophy is advanced but the design language is generic',
      'Framework visualization lacking — ideas expressed in prose but never diagrammed',
      'Offer stack requires effort to understand from content alone',
      'Cross-platform experience inconsistent in depth and format',
    ],
    systemQuote: 'The content system is sophisticated. The visual and structural system hasn\'t caught up.',
    curiosityUpgrade: [
      '→ Map the "Modern Mastery" framework visually — make the philosophy legible as a system diagram',
      '→ Create a visual identity layer that signals intellectual sophistication at first glance',
      '→ Build a clearer offer hierarchy that mirrors the audience journey: philosophy → tools → access',
      '→ Use knowledge architecture to make the funnel feel inevitable, not discovered accidentally',
    ],
    takeaways: [
      'Identity before offer — people buy who they want to become, not what they want to know.',
      'Philosophy builds authority faster than tactics because it\'s harder to fake.',
      'Consistent language compounds — saying the same true thing many ways is a strategy.',
      'The contrarian position only works if the depth is real.',
      'Sell the worldview. The product is just the vehicle.',
    ],
  },
  {
    slug: 'ali-abdaal', index: '02', name: 'Ali Abdaal', outcome: 'Trust',
    color: 'var(--lav)', image: '/images/ali-abdaal.jpg',
    headline: 'How Ali Abdaal Engineers Trust',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['YouTube (~5.8M)', 'Newsletter (~500K+)', 'Podcast (~200K)'],
      offers: ['Feel-Good Productivity (book)', 'Part-Time YouTuber Academy', 'Productivity Lab (community)'],
      audienceType: 'Students and young professionals seeking sustainable high performance',
      audienceSize: '6M+ across platforms',
    },
    situation: [
      'Ali Abdaal is the most-subscribed productivity creator on YouTube. He built his audience during medical school at Cambridge — a credential that does extraordinary work before he says a single word.',
      'His market position is "evidence-based productivity that doesn\'t burn you out." This is a precise and intelligent positioning move: it acknowledges the failure mode of the category and promises to solve it.',
      'His audience skews student and early career — people in high-pressure environments who are anxious about performance and receptive to systems that promise to make work feel better, not just more efficient.',
      'The brand promise — "feel-good productivity" — is a behavioral design masterstroke. It pre-empts the primary objection to productivity content: that it makes life feel like a relentless optimization.',
    ],
    challenge: 'The core friction is attention — YouTube is crowded with productivity content, and most of it is interchangeable. Abdaal solves this with production quality, credential signaling, and a distinct emotional brand ("feel-good") that differentiates at the emotional level rather than the tactical one.',
    frictionTypes: ['attention', 'decision'],
    awarenessQuote: 'The Cambridge credential is doing more conversion work than any CTA he\'s ever written.',
    behavioralMoves: {
      attention: ['Medical school credential as instant authority signal', 'Thumbnail + title optimized for search intent', '"Feel-good" as emotional differentiator in a fear-based category', 'High production quality signals investment and permanence'],
      cognitiveAnchors: ['"Feel-good productivity"', '"Evidence-based"', '"Part-time YouTuber"', '"Working smarter, not harder"'],
      knowledgePackaging: ['Research → accessible summary → actionable takeaway pipeline', 'Book recommendations as credibility proxies', 'Personal experiments as relatable case studies', 'Tiered offer: free video → book → community → course'],
      authoritySignals: ['Cambridge / doctor credential', 'Book deal with major publisher', 'Interview format with other authorities', 'Transparent business updates'],
    },
    insightQuote: '"Feel-Good Productivity" — two words that invalidate every competitor\'s fear-based framing with a single phrase.',
    learningFlow: [
      { from: 'Searching', to: 'Watching', how: 'SEO-optimized title captures existing intent, thumbnail confirms quality' },
      { from: 'Watching', to: 'Trusting', how: 'Credential + research backing + relatable personal story builds layered credibility' },
      { from: 'Trusting', to: 'Subscribing', how: 'Consistent value across multiple videos creates dependency and reciprocity' },
      { from: 'Subscribing', to: 'Buying', how: 'Email nurture + book launch + community invitation converts fans to customers' },
    ],
    actionQuote: 'Trust is built in layers, not moments. Every video is a micro-deposit into the credibility account.',
    narrativeSystem: {
      stories: ['Mastery', 'Simplicity', 'Freedom'],
      dominant: 'Simplicity',
      description: 'The dominant narrative is simplicity — complex ideas made accessible, high performance made sustainable. This narrative is inclusive (anyone can do this) and aspirational (you can be like the Cambridge doctor), which maximizes audience breadth.',
      quote: '"You don\'t have to suffer to succeed."',
    },
    whatWorks: [
      'Credential leverage — the doctor positioning does the trust-building before the content has to',
      'Emotional brand differentiation — "feel-good" separates from the fear-based productivity mainstream',
      'Volume of value — years of free content creates deep reciprocity in the audience',
      'Searchable content strategy — videos rank for years, compounding audience acquisition',
      'Email as conversion layer — newsletter bridges YouTube audience to paid products',
    ],
    missedOpportunities: [
      'Offer stack complexity — too many products at different price points without clear journey mapping',
      'Brand coherence across products could be stronger — book, course, and community feel slightly disconnected',
      'Conversion clarity at scale — a 5.8M subscriber audience deserves a more architecturally clear path to purchase',
      'Visual framework for the productivity system — "feel-good productivity" is a concept, not yet a diagram',
    ],
    systemQuote: 'At this scale, unclear architecture leaves significant conversion on the table.',
    curiosityUpgrade: [
      '→ Map the "Feel-Good Productivity" system as a visual behavioral framework — make the philosophy a diagram',
      '→ Clarify the offer journey: free → book → community → course with explicit behavioral triggers at each gate',
      '→ Create stronger visual coherence across book, course, and community design systems',
      '→ Use cognitive load reduction at the decision point — fewer, clearer choices with better-framed value propositions',
    ],
    takeaways: [
      'Trust is built in layers — no single moment creates it, many consistent moments accumulate it.',
      'Emotional positioning beats tactical positioning in crowded markets.',
      'Education is the best conversion tool — teach generously, sell naturally.',
      'Volume creates reciprocity — people who have learned from you feel obligated to support you.',
      'Credentials do conversion work that content alone cannot replicate.',
    ],
  },
  {
    slug: 'justin-welsh', index: '03', name: 'Justin Welsh', outcome: 'Demand',
    color: 'var(--must)', image: '/images/justin-welsh.jpg',
    headline: 'How Justin Welsh Engineers Demand',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['LinkedIn (~550K)', 'X / Twitter (~230K)', 'Newsletter (~210K+)'],
      offers: ['The LinkedIn OS', 'The Content OS', 'Saturday Solopreneur (newsletter)'],
      audienceType: 'Mid-career professionals building a solo business from existing expertise',
      audienceSize: '850K+ across platforms',
    },
    situation: [
      'Justin Welsh is the premier case study in LinkedIn-native audience building. A former SaaS VP who burned out at scale, he turned his exit into a brand — and his brand into a $5M+ solo business.',
      'His market position is hyper-specific: the solopreneur operating system. He doesn\'t serve generalists or beginners. He serves mid-career professionals who have expertise and want to monetize it without building a team.',
      'This specificity is the signal. In a creator space crowded with "build an audience" advice, Welsh goes deeper: he teaches the exact system, with exact numbers, with his own results as the case study.',
      'The transparency is the product. He shows his revenue. He shows his process. This is not just content — it is behavioral proof that the system works.',
    ],
    challenge: 'The primary friction is identity — "is this for someone like me?" Welsh solves this with radical specificity. Every piece of content is written for a very particular person: mid-career, expertise-rich, wants freedom, skeptical of hype.',
    frictionTypes: ['identity', 'clarity'],
    awarenessQuote: 'Specificity is his biggest distribution strategy. The narrower the target, the stronger the pull.',
    behavioralMoves: {
      attention: ['Revenue transparency as credibility ("I made $X with this system")', 'Short-form LinkedIn posts optimized for scroll-stopping first lines', 'Repeatable post formats that train audience expectations', 'Personal transformation story as origin myth'],
      cognitiveAnchors: ['"The Solopreneur"', '"LinkedIn OS"', '"Content OS"', '"Saturday Solopreneur"', '"$5M solo business"'],
      knowledgePackaging: ['Operating system metaphor — makes the system feel comprehensive and learnable', 'Case study format in every post (before → after)', 'Newsletter as weekly system demonstration', 'Productized courses as system documentation'],
      authoritySignals: ['Revenue numbers shared publicly', 'SaaS VP background as expertise signal', 'Longevity — years of daily LinkedIn posting', 'Specific outcomes promised and demonstrated'],
    },
    insightQuote: '"The LinkedIn OS" — not a course, not a community — a system. The language implies that everything else is chaos.',
    learningFlow: [
      { from: 'Scrolling', to: 'Pausing', how: 'Specific first line of LinkedIn post speaks directly to their situation' },
      { from: 'Pausing', to: 'Believing', how: 'Revenue proof + case study format makes the claim credible, not aspirational' },
      { from: 'Believing', to: 'Following', how: 'Consistent format across posts makes the system feel learnable, not lucky' },
      { from: 'Following', to: 'Buying', how: 'Newsletter deepens the relationship; product appears as the next logical step' },
    ],
    actionQuote: 'Every post is a micro case study. By the time the product launches, the audience has already been shown 200 proofs of concept.',
    narrativeSystem: {
      stories: ['Freedom', 'Mastery', 'Wealth'],
      dominant: 'Freedom',
      description: 'The dominant narrative is freedom — specifically, freedom from corporate dependency. Welsh\'s burnout story is the origin, and the solopreneur system is the solution. Every piece of content reinforces that the system enables this freedom.',
      quote: '"You don\'t need a team. You need a system."',
    },
    whatWorks: [
      'Extreme specificity — the narrow targeting makes every piece of content feel personally written',
      'Proof over promise — revenue numbers and case studies do the persuasion that copy alone cannot',
      'Consistency of format — audiences know what to expect, reducing cognitive load and building ritual',
      'Operating system framing — positions the product as infrastructure, not information',
      'Transparency as differentiation — showing the numbers is rare enough to be a competitive advantage',
    ],
    missedOpportunities: [
      'Visual differentiation is low — text-heavy content blends into LinkedIn aesthetics without a distinct visual signature',
      'Framework visualization lacking — "The LinkedIn OS" could be far more powerful as a visible system diagram',
      'Cross-platform experience is inconsistent — LinkedIn-native posts don\'t translate cleanly to X or newsletter',
      'No visual identity layer that signals the system sophistication of the brand',
    ],
    systemQuote: 'The system is real. It just hasn\'t been made visible enough to do its full conversion work.',
    curiosityUpgrade: [
      '→ Visualize "The LinkedIn OS" and "Content OS" as behavioral architecture diagrams — the system should be seeable',
      '→ Build a distinct visual identity that travels across platforms and reinforces the system brand',
      '→ Create a cross-platform content architecture so the audience journey doesn\'t reset on each channel',
      '→ Map the decision triggers more explicitly — what makes someone go from follower to buyer, diagrammed',
    ],
    takeaways: [
      'Specificity creates demand — the narrower the audience, the stronger the pull on the right person.',
      'Proof beats persuasion at every stage of the funnel.',
      'Consistency of format reduces cognitive load and builds audience ritual.',
      'Transparency is a competitive advantage in a space full of vague promises.',
      'A system that isn\'t visible isn\'t fully doing its conversion work.',
    ],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug)
}

export function getNextCaseStudy(currentSlug: string): CaseStudy {
  const idx = caseStudies.findIndex(cs => cs.slug === currentSlug)
  return caseStudies[(idx + 1) % caseStudies.length]
}
```

- [ ] Compile check: `npx tsc --noEmit`
- [ ] Commit: `git commit -m "feat: add case study data — Dan Koe, Ali Abdaal, Justin Welsh"`

---

### Task 3: Build `components/geo/Symbol.tsx`

**Files:** Create `components/geo/Symbol.tsx`

- [ ] Create SVG renderer component:

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import type { BehavioralSymbol, SymbolElement } from '@/lib/symbols'

interface SymbolProps {
  symbol: BehavioralSymbol; size?: number; color?: string
  opacity?: number; animated?: boolean; className?: string; style?: React.CSSProperties
}

function renderEl(el: SymbolElement, key: number): React.ReactNode {
  switch (el.kind) {
    case 'circle':  return <circle  key={key} cx={el.cx} cy={el.cy} r={el.r} opacity={el.opacity ?? 1} />
    case 'path':    return <path    key={key} d={el.d} opacity={el.opacity ?? 1} />
    case 'line':    return <line    key={key} x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} opacity={el.opacity ?? 1} />
    case 'polygon': return <polygon key={key} points={el.points} opacity={el.opacity ?? 1} />
  }
}

export function Symbol({ symbol, size = 40, color, opacity = 1, animated = false, className, style }: SymbolProps) {
  const ref = useRef<SVGSVGElement>(null)
  const stroke = color ?? symbol.color

  useEffect(() => {
    if (!animated || !ref.current) return
    const ctx = gsap.context(() => {
      const svg = ref.current!
      const paths   = [...svg.querySelectorAll<SVGPathElement>('path')]
      const lines   = [...svg.querySelectorAll<SVGLineElement>('line')]
      const circles = [...svg.querySelectorAll<SVGCircleElement>('circle')]
      const polys   = [...svg.querySelectorAll<SVGPolygonElement>('polygon')]
      ;[...paths, ...lines].forEach(el => {
        const len = (el as SVGGeometryElement).getTotalLength?.() ?? 60
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(el, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' })
      })
      gsap.from([...circles, ...polys], { scale: 0, opacity: 0, duration: 0.4, stagger: 0.04, transformOrigin: '50% 50%', ease: 'back.out(1.4)', delay: 0.1 })
    }, ref)
    return () => ctx.revert()
  }, [animated])

  return (
    <svg ref={ref} viewBox={symbol.viewBox} width={size} height={size}
      fill="none" stroke={stroke} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round"
      style={{ opacity, flexShrink: 0, ...style }} className={className} aria-hidden="true">
      {symbol.svgData.elements.map((el, i) => renderEl(el, i))}
    </svg>
  )
}
```

- [ ] Compile check: `npx tsc --noEmit`
- [ ] Commit: `git commit -m "feat: add Symbol SVG renderer for behavioral symbol language"`

---

## Chunk 2: WorkSection + Page Shell

### Task 4: Build `components/sections/WorkSection.tsx`

**Files:** Create `components/sections/WorkSection.tsx`

- [ ] Create 3-column card grid with orbit SVG overlays, GSAP scroll entrance, CSS hover:

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { caseStudies } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'
gsap.registerPlugin(ScrollTrigger)

function OrbitOverlay({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 375" fill="none" stroke={color} strokeWidth={0.75} strokeLinecap="round"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
      <circle cx={150} cy={130} r={105} opacity={0.18} />
      <circle cx={150} cy={130} r={70}  opacity={0.28} />
      <circle cx={150} cy={130} r={40}  opacity={0.38} />
      <line x1={0}   y1={130} x2={300} y2={130} opacity={0.10} />
      <line x1={150} y1={0}   x2={150} y2={375} opacity={0.10} />
      <line x1={37}  y1={130} x2={53}  y2={130} opacity={0.45} />
      <line x1={247} y1={130} x2={263} y2={130} opacity={0.45} />
      <line x1={150} y1={17}  x2={150} y2={33}  opacity={0.45} />
      <circle cx={150} cy={130} r={2.5} fill={color} opacity={0.6} />
    </svg>
  )
}

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.querySelectorAll('.anim') ?? [], {
        opacity: 0, y: 24, duration: dur.base, stagger: 0.1, ease: ease.out,
        scrollTrigger: { trigger: headerRef.current, start: 'top 80%' },
      })
      gsap.from(cardsRef.current?.querySelectorAll('.cs-card') ?? [], {
        opacity: 0, y: 40, duration: dur.slow, stagger: 0.12, ease: ease.out,
        scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={sectionRef} style={{ background: 'var(--black)', padding: '120px 60px', maxWidth: '1200px', margin: '0 auto' }}>
      <div ref={headerRef} style={{ marginBottom: '64px' }}>
        <p className="anim t-eyebrow" style={{ color: 'var(--tang)', opacity: 0.6, marginBottom: '16px' }}>04 / Work</p>
        <h2 className="anim t-headline" style={{ fontSize: 'clamp(36px, 5vw, 60px)', marginBottom: '16px' }}>Three architects of attention.</h2>
        <p className="anim t-body" style={{ opacity: 0.45, maxWidth: '480px' }}>Behavioral design and knowledge-architecture analysis of creators who engineer outcomes at scale.</p>
      </div>

      <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {caseStudies.map((cs, i) => {
          const isH = hovered === i
          return (
            <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="cs-card"
              style={{ textDecoration: 'none', display: 'block' }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden',
                border: `1px solid ${isH ? cs.color : 'rgba(234,228,218,0.06)'}`,
                transition: 'border-color 0.3s ease', marginBottom: '20px', background: '#242420' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cs.image} alt={cs.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.05)',
                    transform: isH ? 'scale(1.02)' : 'scale(1)', transition: 'transform 0.4s ease' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 45%, var(--black) 100%)' }} />
                <OrbitOverlay color={cs.color} />
                <span style={{ position: 'absolute', top: '16px', left: '16px', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.22em', color: cs.color, opacity: 0.7 }}>{cs.index}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '6px' }}>{cs.name}</p>
              <p style={{ fontSize: '13px', opacity: 0.4, marginBottom: '14px' }}>Engineers {cs.outcome}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: cs.color, marginBottom: '4px' }}>{cs.meta.audienceSize}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.22, marginBottom: '16px' }}>{cs.meta.platforms.slice(0, 2).join(' · ')}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: cs.color, opacity: isH ? 1 : 0.65, transition: 'opacity 0.2s ease' }}>Read Analysis ——→</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] Compile check: `npx tsc --noEmit`
- [ ] Commit: `git commit -m "feat: add WorkSection homepage grid with orbit overlays"`

---

### Task 5: Wire WorkSection + page shell

**Files:** Modify `app/page.tsx`, Create `app/case-studies/[slug]/page.tsx`

- [ ] Add to `app/page.tsx`:

```tsx
import { WorkSection } from '@/components/sections/WorkSection'
// Between <SystemSection /> and <AboutSection />:
<WorkSection />
```

- [ ] Create `app/case-studies/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { caseStudies, getCaseStudy } from '@/lib/case-studies'
import { CaseStudyHero }            from '@/components/case-study/CaseStudyHero'
import { AwarenessSection }         from '@/components/case-study/AwarenessSection'
import { InsightSection }           from '@/components/case-study/InsightSection'
import { ActionSection }            from '@/components/case-study/ActionSection'
import { FrameworkSection }         from '@/components/case-study/FrameworkSection'
import { CaseStudySystemSection }   from '@/components/case-study/SystemSection'
import { AuthoritySection }         from '@/components/case-study/AuthoritySection'

export async function generateStaticParams() {
  return caseStudies.map(cs => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}
  return { title: `${cs.name} — Curiosity Inc.`, description: cs.subhead }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()
  return (
    <main style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <CaseStudyHero    data={cs} />
      <AwarenessSection data={cs} />
      <InsightSection   data={cs} />
      <ActionSection    data={cs} />
      <FrameworkSection data={cs} />
      <CaseStudySystemSection data={cs} />
      <AuthoritySection data={cs} />
    </main>
  )
}
```

- [ ] Compile check: `npx tsc --noEmit`
- [ ] Commit: `git commit -m "feat: wire WorkSection into homepage + case study page shell"`

---

## Chunk 3: Case Study Section Components

### Task 6: Shared `SectionWrapper.tsx`

**Files:** Create `components/case-study/SectionWrapper.tsx`

- [ ] Create wrapper with symbol accent, eyebrow, PullQuote, InsightBlock:

```tsx
'use client'
import { Symbol } from '@/components/geo/Symbol'
import type { BehavioralSymbol } from '@/lib/symbols'

export function SectionWrapper({ symbol, eyebrow, children, alt = false, style }: {
  symbol: BehavioralSymbol; eyebrow: string; children: React.ReactNode; alt?: boolean; style?: React.CSSProperties
}) {
  return (
    <section style={{ position: 'relative', padding: '96px 60px', maxWidth: '1200px', margin: '0 auto', background: alt ? 'rgba(0,0,0,0.15)' : 'transparent', ...style }}>
      <div style={{ position: 'absolute', top: '40px', right: '60px', opacity: 0.18, pointerEvents: 'none' }}>
        <Symbol symbol={symbol} size={40} animated />
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase', color: symbol.color, opacity: 0.6, marginBottom: '32px' }}>
        {eyebrow}
      </p>
      {children}
    </section>
  )
}

export function PullQuote({ quote, color }: { quote: string; color: string }) {
  return (
    <blockquote style={{ borderLeft: `1.5px solid ${color}`, paddingLeft: '20px', margin: '40px 0', background: `${color}08`, paddingTop: '16px', paddingBottom: '16px', paddingRight: '20px', fontStyle: 'italic', fontSize: '16px', lineHeight: 1.6, opacity: 0.85 }}>
      {quote}
    </blockquote>
  )
}

export function InsightBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(234,228,218,0.03)', border: '1px solid rgba(234,228,218,0.07)', padding: '20px 24px', marginTop: '40px' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color, opacity: 0.5, marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.5 }}>{value}</p>
    </div>
  )
}
```

- [ ] Commit: `git commit -m "feat: add shared SectionWrapper, PullQuote, InsightBlock"`

---

### Task 7: `CaseStudyHero.tsx` — Section 01 Confusion (sky)

**Files:** Create `components/case-study/CaseStudyHero.tsx`

- [ ] Create 2-column hero with portrait + orbit overlay + title/meta. Symbol: confusion (sky). Orbit overlay in creator color. Back link `← Case Studies` → `/#work`.

Full code pattern: `useRef` + `useEffect` GSAP timeline — image slides from left, text lines stagger up. See spec Section 01 for layout details.

Key styles: `gridTemplateColumns: '280px 1fr'`, image `filter: grayscale(100%) contrast(1.05)`, orbit SVG with 3 concentric circles at creator color, meta 2-column grid.

- [ ] Compile check + commit: `git commit -m "feat: add CaseStudyHero — Section 01 Confusion"`

---

### Task 8–12: Remaining 5 sections

Build each section in order. Each follows the same pattern:
1. `'use client'`
2. Import `symbols.[id]`, `SectionWrapper`, `PullQuote`, `InsightBlock`, GSAP
3. `useRef` + `useEffect` with `ScrollTrigger` — animate `.anim-line` elements
4. `SectionWrapper` with correct `eyebrow` and `alt` (alternate sections)
5. Section-specific diagram + content + PullQuote + InsightBlock

| File | Section | Symbol | eyebrow | alt | Diagram |
|------|---------|--------|---------|-----|---------|
| `AwarenessSection.tsx` | 02 | awareness (pink) | `"02 / Awareness"` | true | Friction type pills |
| `InsightSection.tsx` | 03 | insight (must) | `"03 / Insight"` | false | 2×2 behavioral moves grid |
| `ActionSection.tsx` | 04 | action (tea) | `"04 / Action"` | true | SVG orbit-node chain, 5 nodes |
| `FrameworkSection.tsx` | 05 | framework (lav) | `"05 / Framework"` | false | Archetype pills (dominant = largest) |
| `SystemSection.tsx` | 06 | system (shell 75%) | `"06 / System"` | true | 2-col: What Works (tang dots) + Missed (muted circles) |
| `AuthoritySection.tsx` | 07 | authority (tang) | `"07 / Authority"` | false | → bullets + numbered takeaways + closing Symbol + next nav |

Commit each section individually:
- `git commit -m "feat: add AwarenessSection — Section 02 Awareness"`
- `git commit -m "feat: add InsightSection — Section 03 Insight"`
- `git commit -m "feat: add ActionSection — Section 04 Action"`
- `git commit -m "feat: add FrameworkSection — Section 05 Framework"`
- `git commit -m "feat: add CaseStudySystemSection — Section 06 System"`
- `git commit -m "feat: add AuthoritySection — Section 07 Authority"`

---

## Final Verification

- [ ] `npx tsc --noEmit` — 0 errors
- [ ] `npm run build` — succeeds, 3 static routes confirmed
- [ ] Visual check all 3 case study URLs:
  - `/case-studies/dan-koe` — tang accent, sky confusion symbol in hero
  - `/case-studies/ali-abdaal` — lav accent, all 7 symbols progress correctly
  - `/case-studies/justin-welsh` — must accent, Authority section closes the arc
- [ ] Confirm `/#work` WorkSection shows all 3 cards with orbit overlays
- [ ] Final commit: `git commit -m "feat: complete case studies — symbol arc Confusion→Authority, 3 creators"`
