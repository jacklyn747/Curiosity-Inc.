# Cinematic Sacred Geometry — Case Study Sections Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform all 7 case study section components into a cinematic, scroll-driven experience where sacred geometry motion carries semantic meaning — confusion dissolves, insight synthesizes, structure crystallizes, networks illuminate, authority radiates.

**Architecture:** Each existing section component gets a full GSAP ScrollTrigger + scrub choreography rework. A new `GeometricMotif` fixed background layer cross-fades between 5 ambient shapes (Circle → Triangle → Spiral → Square → Flower) as sections change. Sticky layout via CSS `position: sticky` + GSAP scrub is used for the Insight/Vesica section. No GSAP Club plugins required — all effects use standard GSAP 3 features: `scrub`, `pin`, `strokeDashoffset`, `attr` tweening, and `clip-path`.

**Tech Stack:** GSAP 3.14 + ScrollTrigger + SplitText (all available from `@/lib/gsap` — no Club plugins needed, all ship with GSAP 3.14 standard license), `lib/motion-config.ts` (`dur`, `ease`, `preparePaths`, `drawPaths`, `orbit`), `lib/design-tokens.ts` (all colors + `geo`), inline SVG, Next.js 16 `'use client'` components.

**Import rule (MUST follow):** Every component imports GSAP and plugins from `@/lib/gsap`, never from `'gsap'` or `'gsap/ScrollTrigger'` directly. Never call `gsap.registerPlugin()` in components — `lib/gsap.ts` handles registration once, client-side.

```ts
// ✅ Correct
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'

// ❌ Wrong — do not do this
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger) // redundant + SSR risk
```

**Section → Geometry Codex:**
| Section | Symbol (progress spine) | Cinematic geometry | Emotional target |
|---|---|---|---|
| Hero | Confusion (scattered dots) | Expanding circle field | "I've stepped into a system" |
| Awareness | Awareness (open arc) | Triangle funnel builds → fragments | "This system breaks down" |
| Insight | Insight (Vesica Piscis) | Two circles slide together, sticky | "This is deeper thinking" |
| Action | Action (triangle) | Spiral draws itself on scroll | "This system grows" |
| Framework | Framework (flower) | Scattered blocks snap to square grid | "Engineered clarity" |
| System | System (cube) | Hexagon network illuminates | "Scalable thinking" |
| Authority | Authority (radiant circle) | Flower expands → line mic drop → CTA ripple | "New reality" |

**Global motion rule:** Soft organic early → tension/fragmentation mid → alignment/precision late → harmony/expansion at end.

---

## File Structure

**New files:**
- `components/case-study/GeometricMotif.tsx` — fixed full-viewport background layer, 5 shapes cross-fading

**Heavily modified files (complete rewrites of the motion layer, content preserved):**
- `components/case-study/CaseStudyHero.tsx` — add circle clip-path reveal + mousemove orbital parallax
- `components/case-study/AwarenessSection.tsx` — add triangle funnel build + broken triangle fragmentation phase
- `components/case-study/InsightSection.tsx` — full rework as sticky Vesica Piscis scroll-driven section
- `components/case-study/ActionSection.tsx` — replace node chain with Archimedean spiral draw-on-scroll
- `components/case-study/FrameworkSection.tsx` — add scattered→grid snap animation
- `components/case-study/SystemSection.tsx` — add hexagon node network build + path illumination
- `components/case-study/AuthoritySection.tsx` — add Flower of Life expansion + word-by-word mic drop + CTA ripple

**Light modification:**
- `app/case-studies/[slug]/page.tsx` — add `<GeometricMotif />` import + JSX render

---

## Chunk 1: GeometricMotif + CaseStudyHero

### Task 1: GeometricMotif — Persistent Background Shape Layer

**Files:**
- Create: `components/case-study/GeometricMotif.tsx`

**What it does:** Fixed full-viewport SVG behind all sections. Five shape groups — Circle, Triangle, Spiral, Square, Flower — each at opacity 0. GSAP ScrollTrigger watches section IDs and cross-fades between shapes as sections change. `zIndex: 0`, `pointerEvents: none`. No interference with section animations since this component only watches the outermost section wrapper IDs and uses its own isolated trigger array.

**Key constraint:** Scroll trigger start is `'top 40%'` — offset 5% below the progress spine's `'top 35%'` to avoid firing simultaneously.

- [ ] **Step 1: Create the file with shape SVGs**

```tsx
// components/case-study/GeometricMotif.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { colors, shellAt } from '@/lib/design-tokens'
import { dur, ease } from '@/lib/motion-config'

// ─── Shape index → section mapping ───────────────────────────────────────────
// Circle(0) Triangle(1) Spiral(2) Square(3) Flower(4)
const MOTIF_STAGES = [
  { id: 'cs-hero',      shape: 0 },
  { id: 'cs-awareness', shape: 1 },
  { id: 'cs-insight',   shape: 2 },
  { id: 'cs-action',    shape: 2 }, // spiral continues through action
  { id: 'cs-framework', shape: 3 },
  { id: 'cs-system',    shape: 3 }, // square continues through system
  { id: 'cs-authority', shape: 4 },
] as const

// Stroke colour: near-white at 10% — ambient, never competing
const STROKE = shellAt[10]
const BASE_OPACITY = 0.04

// ─── Archimedean spiral path generator ───────────────────────────────────────
function spiralPath(cx: number, cy: number, turns: number, maxR: number, steps = 240): string {
  const total = turns * Math.PI * 2
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t     = i / steps
    const angle = t * total - Math.PI / 2
    const r     = t * maxR
    const x     = (cx + r * Math.cos(angle)).toFixed(2)
    const y     = (cy + r * Math.sin(angle)).toFixed(2)
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
}

// ─── Hexagon point list for flat-top orientation ──────────────────────────────
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
}

// Pre-compute spiral (runs once at module load — safe)
const SPIRAL_D = spiralPath(720, 450, 3, 380)

// ─── Component ────────────────────────────────────────────────────────────────
export function GeometricMotif() {
  const shapeRefs = useRef<(SVGGElement | null)[]>([])
  const currentShape = useRef(0)

  useEffect(() => {
    // Shape 0 (circle) visible by default
    shapeRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? BASE_OPACITY : 0 })
    })

    const triggers: ScrollTrigger[] = []

    MOTIF_STAGES.forEach(({ id, shape }) => {
      const el = document.getElementById(id)
      if (!el) return
      triggers.push(
        ScrollTrigger.create({
          trigger:    el,
          start:      'top 40%',
          onEnter: () => {
            if (shape === currentShape.current) return
            const prev = currentShape.current
            currentShape.current = shape
            gsap.to(shapeRefs.current[prev],  { opacity: 0,            duration: dur.slow, ease: ease.inOut })
            gsap.to(shapeRefs.current[shape], { opacity: BASE_OPACITY,  duration: dur.slow, ease: ease.inOut, delay: 0.3 })
          },
          onLeaveBack: () => {
            // Find previous stage's shape
            const idx = MOTIF_STAGES.findIndex(s => s.id === id)
            const prevShape = idx > 0 ? MOTIF_STAGES[idx - 1].shape : 0
            if (prevShape === currentShape.current) return
            gsap.to(shapeRefs.current[currentShape.current], { opacity: 0,           duration: dur.slow, ease: ease.inOut })
            gsap.to(shapeRefs.current[prevShape],            { opacity: BASE_OPACITY, duration: dur.slow, ease: ease.inOut, delay: 0.3 })
            currentShape.current = prevShape
          },
        })
      )
    })

    return () => triggers.forEach(t => t.kill())
  }, [])

  const sw = 1 // stroke-width: thin precision lines always

  // Flower of Life: center + 6 petals, r=180, center-to-center=180
  const flowerCx = 720, flowerCy = 450, flowerR = 180
  const flowerCenters: [number, number][] = [
    [flowerCx, flowerCy],
    ...Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3
      return [flowerCx + flowerR * Math.cos(a), flowerCy + flowerR * Math.sin(a)] as [number, number]
    }),
  ]

  return (
    <svg
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100vw',
        height:        '100vh',
        pointerEvents: 'none',
        zIndex:        0,
      }}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* 0 — Circle field */}
      <g ref={el => { shapeRefs.current[0] = el }}>
        <circle cx={720} cy={450} r={380} stroke={STROKE} strokeWidth={sw} />
        <circle cx={720} cy={450} r={240} stroke={STROKE} strokeWidth={sw} opacity={0.7} />
        <circle cx={720} cy={450} r={120} stroke={STROKE} strokeWidth={sw} opacity={0.5} />
        <circle cx={720} cy={450} r={40}  stroke={STROKE} strokeWidth={sw} opacity={0.4} />
        {/* Crosshair */}
        <line x1={720} y1={70}  x2={720} y2={830} stroke={STROKE} strokeWidth={0.5} opacity={0.3} />
        <line x1={340} y1={450} x2={1100} y2={450} stroke={STROKE} strokeWidth={0.5} opacity={0.3} />
      </g>

      {/* 1 — Triangle */}
      <g ref={el => { shapeRefs.current[1] = el }}>
        <polygon points="720,70 1300,880 140,880"
          stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" />
        {/* Inner triangle at 50% */}
        <polygon points="720,275 1010,760 430,760"
          stroke={STROKE} strokeWidth={sw} strokeLinejoin="round" opacity={0.6} />
        {/* Medians */}
        <line x1={720} y1={70}  x2={720} y2={880} stroke={STROKE} strokeWidth={0.5} opacity={0.3} />
        <line x1={140} y1={880} x2={1010} y2={760} stroke={STROKE} strokeWidth={0.5} opacity={0.3} strokeDasharray="4 8" />
        <line x1={1300} y1={880} x2={430} y2={760} stroke={STROKE} strokeWidth={0.5} opacity={0.3} strokeDasharray="4 8" />
      </g>

      {/* 2 — Spiral */}
      <g ref={el => { shapeRefs.current[2] = el }}>
        <path d={SPIRAL_D} stroke={STROKE} strokeWidth={sw} />
      </g>

      {/* 3 — Square grid */}
      <g ref={el => { shapeRefs.current[3] = el }}>
        {/* Outer square */}
        <rect x={120} y={60} width={1200} height={780} stroke={STROKE} strokeWidth={sw} />
        {/* Vertical grid lines */}
        {[420, 720, 1020].map(x => (
          <line key={x} x1={x} y1={60} x2={x} y2={840} stroke={STROKE} strokeWidth={0.5} opacity={0.5} />
        ))}
        {/* Horizontal grid lines */}
        {[255, 450, 645].map(y => (
          <line key={y} x1={120} y1={y} x2={1320} y2={y} stroke={STROKE} strokeWidth={0.5} opacity={0.5} />
        ))}
        {/* Inner square at golden ratio */}
        <rect x={340} y={170} width={760} height={560} stroke={STROKE} strokeWidth={0.5} opacity={0.4} strokeDasharray="6 10" />
      </g>

      {/* 4 — Flower of Life */}
      <g ref={el => { shapeRefs.current[4] = el }}>
        {flowerCenters.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={flowerR}
            stroke={STROKE} strokeWidth={sw} opacity={i === 0 ? 1 : 0.7} />
        ))}
        {/* Outer containing circle */}
        <circle cx={flowerCx} cy={flowerCy} r={flowerR * 2}
          stroke={STROKE} strokeWidth={sw} opacity={0.3} strokeDasharray="8 12" />
      </g>
    </svg>
  )
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /Users/gingerninja/Sites/curiosity-inc && ./node_modules/.bin/tsc --noEmit 2>&1
```
Expected: no output (zero errors)

- [ ] **Step 3: Wire into page**

Modify `app/case-studies/[slug]/page.tsx` — add import and render after `<CaseStudyProgress />`:

```diff
 import { CaseStudyProgress }          from '@/components/case-study/CaseStudyProgress'
+import { GeometricMotif }             from '@/components/case-study/GeometricMotif'
 import { CaseStudyHero }              from '@/components/case-study/CaseStudyHero'
```

```diff
       <CaseStudyProgress />
+      <GeometricMotif />
       <div id="cs-hero">
```

- [ ] **Step 4: Compile check**

```bash
./node_modules/.bin/tsc --noEmit 2>&1
```
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add components/case-study/GeometricMotif.tsx app/case-studies/\[slug\]/page.tsx
git commit -m "feat: add GeometricMotif ambient background layer

Fixed full-viewport SVG that cross-fades between 5 sacred geometry
shapes (Circle → Triangle → Spiral → Square → Flower) as reader
progresses through case study sections. BASE_OPACITY=0.04 — ambient
field texture, never competing with content."
```

---

### Task 2: CaseStudyHero — Circle reveal + orbital parallax

**Files:**
- Modify: `components/case-study/CaseStudyHero.tsx`

**What it adds:**
1. **Circle clip-path reveal** — `clipPath: 'circle(0% at 50% 50%)'` on the hero section, expands to `circle(150% at 50% 50%)` on mount. Duration: `dur.xslow` (1.4s), ease: `power3.out`. Creates "stepping into a field" sensation.
2. **Orbital parallax** — `mousemove` event on the section moves portrait with `x: ±12px, y: ±8px` and headline text with opposite direction `x: ∓6px, y: ∓4px`. Strength: `0.012` multiplier. GSAP `quickTo` for smooth following.
3. **Orbit rings slow rotation** — The existing concentric circle SVG overlay gets a continuous slow rotation via `orbit()` from motion-config (outer ring: 90s, inner: 60s, counter-opposite directions).
4. **Scroll hint** — A small arrow below the hero content that oscillates with `gsap.to(rotation: 15, yoyo: true, repeat: -1, dur: 1.5)`.

- [ ] **Step 1: Rewrite CaseStudyHero.tsx with all motion layers**

```tsx
// components/case-study/CaseStudyHero.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { symbols } from '@/lib/symbols'
import { Symbol }  from '@/components/geo/Symbol'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease, orbit } from '@/lib/motion-config'

export function CaseStudyHero({ data }: { data: CaseStudy }) {
  const sym      = symbols.confusion
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const txtRef     = useRef<HTMLDivElement>(null)
  const orbitOuterRef = useRef<SVGCircleElement>(null)
  const orbitInnerRef = useRef<SVGCircleElement>(null)
  const hintRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current
      if (!section) return

      // 1 — Circle reveal (clip-path expand)
      gsap.fromTo(section,
        { clipPath: 'circle(0% at 50% 40%)' },
        { clipPath: 'circle(150% at 50% 40%)', duration: dur.xslow, ease: 'power3.out' }
      )

      // 2 — Content stagger after reveal
      const tl = gsap.timeline({ delay: 0.3 })
      tl.from(imgRef.current, { x: -24, opacity: 0, duration: dur.base, ease: ease.out })
        .from(
          txtRef.current?.querySelectorAll('.anim-line') ?? [],
          { opacity: 0, y: 18, duration: dur.base, stagger: 0.07, ease: ease.out },
          '-=0.4'
        )

      // 3 — Orbit rings continuous rotation
      if (orbitOuterRef.current) orbit(orbitOuterRef.current, { duration: dur.orbitSlow, direction: 1 })
      if (orbitInnerRef.current) orbit(orbitInnerRef.current, { duration: dur.orbitFast, direction: -1 })

      // 4 — Scroll hint oscillation
      if (hintRef.current) {
        gsap.to(hintRef.current, {
          rotation: 15,
          yoyo:     true,
          repeat:   -1,
          duration: 1.8,
          ease:     'sine.inOut',
          transformOrigin: '50% 50%',
        })
      }

      // 5 — Mousemove orbital parallax
      const imgQuickX  = gsap.quickTo(imgRef.current, 'x', { duration: 0.6, ease: 'power2.out' })
      const imgQuickY  = gsap.quickTo(imgRef.current, 'y', { duration: 0.6, ease: 'power2.out' })
      const txtQuickX  = gsap.quickTo(txtRef.current, 'x', { duration: 0.8, ease: 'power2.out' })
      const txtQuickY  = gsap.quickTo(txtRef.current, 'y', { duration: 0.8, ease: 'power2.out' })

      const onMouseMove = (e: MouseEvent) => {
        const rect   = section.getBoundingClientRect()
        const cx     = rect.left + rect.width  / 2
        const cy     = rect.top  + rect.height / 2
        const dx     = e.clientX - cx
        const dy     = e.clientY - cy
        imgQuickX( dx * 0.012)
        imgQuickY( dy * 0.008)
        txtQuickX(-dx * 0.006)
        txtQuickY(-dy * 0.004)
      }

      const onMouseLeave = () => {
        gsap.to([imgRef.current, txtRef.current], { x: 0, y: 0, duration: 0.6, ease: 'power2.out' })
      }

      section.addEventListener('mousemove', onMouseMove)
      section.addEventListener('mouseleave', onMouseLeave)

      return () => {
        section.removeEventListener('mousemove', onMouseMove)
        section.removeEventListener('mouseleave', onMouseLeave)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '64px',
        alignItems: 'start',
        padding: '80px 60px 96px',
        maxWidth: '1200px',
        margin: '0 auto',
        willChange: 'clip-path',
      }}
    >
      {/* Confusion symbol accent */}
      <div style={{ position: 'absolute', top: '40px', right: '60px', opacity: 0.18, pointerEvents: 'none' }}>
        <Symbol symbol={sym} size={40} animated />
      </div>

      {/* Left — portrait with orbit rings */}
      <div ref={imgRef} style={{ position: 'relative', willChange: 'transform' }}>
        <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#242420' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image}
            alt={data.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.05)' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, var(--black) 100%)' }} />
          {/* Orbit SVG — outer and inner ring refs for GSAP orbit() */}
          <svg
            viewBox="0 0 280 350"
            fill="none"
            stroke={data.color}
            strokeWidth={0.75}
            strokeLinecap="round"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <circle ref={orbitOuterRef} cx={140} cy={120} r={90} opacity={0.20} />
            <circle ref={orbitInnerRef} cx={140} cy={120} r={60} opacity={0.30} />
            <circle cx={140} cy={120} r={34} opacity={0.40} />
            <line x1={0}   y1={120} x2={280} y2={120} opacity={0.10} />
            <line x1={140} y1={0}   x2={140} y2={350} opacity={0.10} />
            <circle cx={140} cy={120} r={2.5} fill={data.color} opacity={0.7} />
          </svg>
        </div>
      </div>

      {/* Right — title + meta */}
      <div ref={txtRef} style={{ willChange: 'transform' }}>
        <Link
          href="/#work"
          className="anim-line"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--shell)',
            opacity: 0.35,
            textDecoration: 'none',
            marginBottom: '32px',
          }}
        >
          ← Case Studies
        </Link>

        <p className="anim-line" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: data.color,
          opacity: 0.6,
          marginBottom: '16px',
        }}>
          {data.index} / {data.outcome}
        </p>

        <h1 className="anim-line t-headline" style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, marginBottom: '12px' }}>
          {data.headline}
        </h1>

        <p className="anim-line" style={{ opacity: 0.4, fontSize: '14px', marginBottom: '40px' }}>
          {data.subhead}
        </p>

        {/* Meta grid */}
        <div className="anim-line" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          borderTop: '1px solid rgba(234,228,218,0.06)',
          paddingTop: '24px',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '6px' }}>Audience</p>
            <p style={{ fontSize: '13px', opacity: 0.75 }}>{data.meta.audienceSize}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '6px' }}>Audience Type</p>
            <p style={{ fontSize: '13px', opacity: 0.75 }}>{data.meta.audienceType}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '6px' }}>Platforms Analyzed</p>
            {data.meta.platforms.map((p, i) => (
              <p key={i} style={{ fontSize: '12px', opacity: 0.6, lineHeight: 1.6 }}>{p}</p>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.3, marginBottom: '6px' }}>Offers Analyzed</p>
            {data.meta.offers.map((o, i) => (
              <p key={i} style={{ fontSize: '12px', opacity: 0.6, lineHeight: 1.6 }}>{o}</p>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} style={{
          marginTop: '48px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.2,
        }}>
          <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
            <path d="M6 2 L6 14 M2 10 L6 14 L10 10" stroke="currentColor" strokeWidth={0.75} strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Compile check**

```bash
./node_modules/.bin/tsc --noEmit 2>&1
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/case-study/CaseStudyHero.tsx
git commit -m "feat: Hero — circle clip-path reveal + orbital parallax + orbit rings

Adds clip-path expand from point (0% → 150%), mousemove quickTo
parallax (portrait vs text move in opposite directions), GSAP orbit()
on concentric rings, and oscillating scroll hint arrow."
```

---

## Chunk 2: AwarenessSection + InsightSection

### Task 3: AwarenessSection — Triangle funnel build + broken triangle

**Files:**
- Modify: `components/case-study/AwarenessSection.tsx`

**What it adds:**
1. **Triangle funnel SVG** — Above the content, a large downward-pointing triangle that builds stroke-by-stroke using `preparePaths` + ScrollTrigger. Three sides draw in sequence (top-left → top-right → apex). Duration: stagger paths each 0.3s.
2. **Broken triangle phase** — A second SVG below the funnel showing the same triangle split into 3 separate pieces (each a separate `<polygon>`). On scroll entry: pieces drift `x: ±20, y: ±15` using GSAP stagger with `yoyo: -1, repeat: 1` — then hold in slightly-drifted position, implying fracture.
3. **Red pulse on active friction pills** — Active friction type pills get `animation: cs-friction-pulse` (red border glow, defined in style tag) when the section enters viewport.

- [ ] **Step 1: Rewrite AwarenessSection.tsx**

```tsx
// components/case-study/AwarenessSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { symbols }       from '@/lib/symbols'
import { SectionWrapper, PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease, preparePaths, drawPaths } from '@/lib/motion-config'
import { colors } from '@/lib/design-tokens'

const ALL_FRICTION = ['attention', 'trust', 'clarity', 'identity', 'decision'] as const

const AWARENESS_CSS = `
  @keyframes cs-friction-pulse {
    0%, 100% { box-shadow: 0 0 0px transparent; }
    50%       { box-shadow: 0 0 8px ${colors.red}60; }
  }
  .cs-friction-active { animation: cs-friction-pulse 2s ease-in-out infinite; }
`

export function AwarenessSection({ data }: { data: CaseStudy }) {
  const sym          = symbols.awareness
  const ref          = useRef<HTMLDivElement>(null)
  const funnelSvgRef = useRef<SVGSVGElement>(null)
  const brokenRef    = useRef<SVGSVGElement>(null)
  const piecesRef    = useRef<SVGPolygonElement[]>([])
  const pillsRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // — Content fade-up
      gsap.from(ref.current?.querySelectorAll('.anim-line') ?? [], {
        opacity: 0, y: 20, duration: dur.base, stagger: 0.07, ease: ease.out,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })

      // — Triangle funnel: draw three sides
      if (funnelSvgRef.current) {
        const paths = Array.from(funnelSvgRef.current.querySelectorAll<SVGPathElement>('path.funnel-side'))
        preparePaths(paths)
        ScrollTrigger.create({
          trigger:  funnelSvgRef.current,
          start:    'top 75%',
          onEnter:  () => drawPaths(paths, { stagger: { each: 0.28, ease: ease.out }, duration: dur.slow }),
        })
      }

      // — Broken triangle: pieces drift on scroll entry
      if (brokenRef.current) {
        const driftTargets = [
          { el: piecesRef.current[0], x:  -18, y: -12 },
          { el: piecesRef.current[1], x:   20, y: -8  },
          { el: piecesRef.current[2], x:    0, y:  16 },
        ]
        ScrollTrigger.create({
          trigger:  brokenRef.current,
          start:    'top 70%',
          onEnter:  () => {
            driftTargets.forEach(({ el, x, y }) => {
              if (!el) return
              gsap.to(el, {
                x, y,
                duration: dur.base,
                ease:     ease.out,
                // Hold in drifted state — system is broken, doesn't snap back
              })
            })
          },
        })
      }

    }, ref)
    return () => ctx.revert()
  }, [])

  // Triangle path sides (drawn separately for stagger):
  // Full triangle: top-left (100,20) → top-right (500,20) → apex (300,180) → close
  // Side 1: top edge   M 100 20 L 500 20
  // Side 2: right side M 500 20 L 300 180
  // Side 3: left side  M 300 180 L 100 20

  // Broken triangle: 3 separate pieces
  // Top-left piece: triangle top-left quadrant
  // Top-right piece: triangle top-right quadrant
  // Bottom apex piece: lower triangle

  return (
    <SectionWrapper symbol={sym} eyebrow="02 / Awareness" alt>
      <style>{AWARENESS_CSS}</style>
      <div ref={ref}>

        {/* Triangle funnel — builds on scroll */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', opacity: 0.6 }}>
          <svg
            ref={funnelSvgRef}
            viewBox="0 0 600 200"
            width="100%"
            style={{ maxWidth: '560px', display: 'block' }}
            fill="none"
            aria-label="Funnel diagram — directional logic"
          >
            {/* Three sides drawn separately for stagger */}
            <path className="funnel-side" d="M 100 20 L 500 20"   stroke={sym.color} strokeWidth={0.75} strokeLinecap="round" />
            <path className="funnel-side" d="M 500 20 L 300 185"  stroke={sym.color} strokeWidth={0.75} strokeLinecap="round" />
            <path className="funnel-side" d="M 300 185 L 100 20"  stroke={sym.color} strokeWidth={0.75} strokeLinecap="round" />
            {/* Inner funnel layers */}
            <path className="funnel-side" d="M 180 80 L 420 80"   stroke={sym.color} strokeWidth={0.5} strokeLinecap="round" opacity={0.5} />
            <path className="funnel-side" d="M 420 80 L 300 185"  stroke={sym.color} strokeWidth={0.5} strokeLinecap="round" opacity={0.5} />
            <path className="funnel-side" d="M 300 185 L 180 80"  stroke={sym.color} strokeWidth={0.5} strokeLinecap="round" opacity={0.5} />
            {/* Stage labels */}
            <text x={300} y={12} textAnchor="middle" fontFamily="var(--font-display)" fontSize={7} letterSpacing={2} fill="rgba(234,228,218,0.4)">REACH</text>
            <text x={300} y={72} textAnchor="middle" fontFamily="var(--font-display)" fontSize={7} letterSpacing={2} fill="rgba(234,228,218,0.4)">ENGAGEMENT</text>
            <text x={300} y={200} textAnchor="middle" fontFamily="var(--font-display)" fontSize={7} letterSpacing={2} fill={sym.color} opacity={0.7}>CONVERSION</text>
          </svg>
        </div>

        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          The Situation &amp; The Challenge
        </h2>

        {/* Friction pills */}
        <div ref={pillsRef} className="anim-line" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {ALL_FRICTION.map(f => {
            const active = data.frictionTypes.includes(f)
            return (
              <span key={f} className={active ? 'cs-friction-active' : ''} style={{
                fontFamily: 'var(--font-display)',
                fontSize: active ? '11px' : '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '6px 14px',
                border: `1px solid ${active ? sym.color : 'rgba(234,228,218,0.08)'}`,
                color: active ? sym.color : 'rgba(234,228,218,0.2)',
                opacity: active ? 1 : 0.5,
                background: active ? `${sym.color}08` : 'transparent',
              }}>
                {f} friction
              </span>
            )
          })}
        </div>

        {/* Situation */}
        {data.situation.map((p, i) => (
          <p key={i} className="anim-line" style={{ fontSize: '16px', lineHeight: 1.75, opacity: 0.75, marginBottom: '20px', maxWidth: '720px' }}>
            {p}
          </p>
        ))}

        <PullQuote quote={data.awarenessQuote} color={sym.color} />

        <p className="anim-line" style={{ fontSize: '16px', lineHeight: 1.75, opacity: 0.75, maxWidth: '720px' }}>
          {data.challenge}
        </p>

        {/* Broken triangle — system fracturing */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '48px 0 24px', opacity: 0.5 }}>
          <svg
            ref={brokenRef}
            viewBox="0 0 600 220"
            width="100%"
            style={{ maxWidth: '480px', display: 'block' }}
            fill="none"
            aria-label="Fragmented triangle — linear logic breaking down"
          >
            {/* Piece 1: top-left segment — drifts up-left */}
            <polygon
              ref={el => { if (el) piecesRef.current[0] = el }}
              points="100,20 300,20 200,110"
              stroke={sym.color} strokeWidth={0.75} strokeLinejoin="round"
            />
            {/* Piece 2: top-right segment — drifts up-right */}
            <polygon
              ref={el => { if (el) piecesRef.current[1] = el }}
              points="300,20 500,20 400,110"
              stroke={sym.color} strokeWidth={0.75} strokeLinejoin="round"
            />
            {/* Piece 3: apex segment — drifts down */}
            <polygon
              ref={el => { if (el) piecesRef.current[2] = el }}
              points="200,130 400,130 300,200"
              stroke={sym.color} strokeWidth={0.75} strokeLinejoin="round"
            />
            {/* Gap indicators */}
            <line x1={290} y1={20}  x2={310} y2={20}  stroke={colors.red} strokeWidth={0.5} opacity={0.6} strokeDasharray="3 3" />
            <line x1={200} y1={115} x2={220} y2={125} stroke={colors.red} strokeWidth={0.5} opacity={0.6} strokeDasharray="3 3" />
            <line x1={380} y1={115} x2={400} y2={125} stroke={colors.red} strokeWidth={0.5} opacity={0.6} strokeDasharray="3 3" />
          </svg>
        </div>

        <InsightBlock
          label="Primary friction"
          value={`${data.frictionTypes[0].charAt(0).toUpperCase() + data.frictionTypes[0].slice(1)} friction — the dominant lever in this creator's trust architecture.`}
          color={sym.color}
        />
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Compile check**

```bash
./node_modules/.bin/tsc --noEmit 2>&1
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/case-study/AwarenessSection.tsx
git commit -m "feat: Awareness — triangle funnel build + broken triangle fragmentation

Adds a stroke-draw triangle funnel (3 sides stagger-animate via
preparePaths) representing directional logic, followed by a fragmented
triangle (3 drifting polygons + red gap lines) representing system
fracture. Friction pills pulse red when active."
```

---

### Task 4: InsightSection — Vesica Piscis sticky scroll-driven section

**Files:**
- Modify: `components/case-study/InsightSection.tsx`

**What it does:** The Insight section becomes a tall `300vh` container with a `position: sticky` inner panel. Two large SVG circles start far apart (`cx: 150` and `cx: 1050`) and slide together to `cx: 450` and `cx: 750` as the user scrolls through the sticky zone. When circles reach the Vesica position: the lens-shaped intersection fills with a subtle glow, and the behavioral moves content appears within the intersection zone. Uses GSAP ScrollTrigger `scrub: 1.5` on the container.

**Vesica math (viewBox 1200×600):** Circles r=240. Centers at (450, 300) and (750, 300) in final position (distance = 300 = 1.25r — slightly wider than true Vesica for readability). Lens fill is an ellipse `cx=600 cy=300 rx=100 ry=195` approximating the intersection.

- [ ] **Step 1: Rewrite InsightSection.tsx with sticky Vesica**

```tsx
// components/case-study/InsightSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { symbols }       from '@/lib/symbols'
import { PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

const QUADRANTS = [
  { key: 'attention',          label: 'Attention Strategy',   side: 'left'  },
  { key: 'cognitiveAnchors',   label: 'Cognitive Anchors',    side: 'left'  },
  { key: 'knowledgePackaging', label: 'Knowledge Packaging',  side: 'right' },
  { key: 'authoritySignals',   label: 'Authority Signals',    side: 'right' },
] as const

export function InsightSection({ data }: { data: CaseStudy }) {
  const sym          = symbols.insight
  const containerRef = useRef<HTMLDivElement>(null)  // tall scroll container (300vh)
  const stickyRef    = useRef<HTMLDivElement>(null)  // sticky inner panel
  const leftCircRef  = useRef<SVGCircleElement>(null)
  const rightCircRef = useRef<SVGCircleElement>(null)
  const lensRef      = useRef<SVGEllipseElement>(null)
  const lensGlowRef  = useRef<SVGEllipseElement>(null)
  const contentRef   = useRef<HTMLDivElement>(null)
  const leftLabelRef = useRef<HTMLDivElement>(null)
  const rightLabelRef= useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      if (!container) return

      // Scroll-scrubbed timeline drives all Vesica motion
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   1.5,
        },
      })

      // Phase 1 (0–40%): circles slide together
      tl.to(leftCircRef.current,  { attr: { cx: 420 }, ease: 'power2.inOut' }, 0)
        .to(rightCircRef.current, { attr: { cx: 780 }, ease: 'power2.inOut' }, 0)

      // Phase 2 (30–60%): lens illuminates
        .to(lensRef.current,     { attr: { fillOpacity: 0.05 }, ease: 'power2.inOut' }, 0.3)
        .to(lensGlowRef.current, { attr: { fillOpacity: 0.03 }, ease: 'power2.inOut' }, 0.3)

      // Phase 3 (50–80%): content appears inside intersection
        .from(contentRef.current, { opacity: 0, scale: 0.93, ease: 'power2.inOut', duration: 0.3 }, 0.5)

      // Phase 4 (70–100%): side labels fade in
        .from(leftLabelRef.current,  { opacity: 0, x: -16, ease: 'power2.out' }, 0.7)
        .from(rightLabelRef.current, { opacity: 0, x:  16, ease: 'power2.out' }, 0.7)

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Eyebrow above the sticky zone */}
      <div style={{ padding: '80px 60px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: sym.color,
          opacity: 0.6,
        }}>
          03 / Insight
        </p>
      </div>

      {/* Tall scroll container — drives scrub */}
      <div ref={containerRef} style={{ height: '300vh', position: 'relative' }}>

        {/* Sticky inner panel */}
        <div ref={stickyRef} style={{
          position:   'sticky',
          top:        0,
          height:     '100vh',
          overflow:   'hidden',
          display:    'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.15)',
        }}>

          {/* Vesica SVG — full-width field */}
          <svg
            viewBox="0 0 1200 600"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            fill="none"
            aria-hidden="true"
          >
            {/* Left circle — starts far left */}
            <circle
              ref={leftCircRef}
              cx={150} cy={300} r={240}
              stroke={sym.color} strokeWidth={0.75} strokeOpacity={0.4}
            />
            {/* Right circle — starts far right */}
            <circle
              ref={rightCircRef}
              cx={1050} cy={300} r={240}
              stroke={sym.color} strokeWidth={0.75} strokeOpacity={0.4}
            />
            {/* Lens fill — ellipse approximating Vesica intersection */}
            <ellipse
              ref={lensRef}
              cx={600} cy={300} rx={105} ry={200}
              fill={sym.color} fillOpacity={0}
            />
            {/* Lens glow — wider, softer */}
            <ellipse
              ref={lensGlowRef}
              cx={600} cy={300} rx={180} ry={280}
              fill={sym.color} fillOpacity={0}
            />
            {/* Center axis */}
            <line x1={600} y1={80} x2={600} y2={520} stroke={sym.color} strokeWidth={0.5} strokeOpacity={0.12} strokeDasharray="4 8" />
          </svg>

          {/* Left side label */}
          <div ref={leftLabelRef} style={{
            position:      'absolute',
            left:          '8%',
            top:           '50%',
            transform:     'translateY(-50%)',
            textAlign:     'center',
            opacity:       0,
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: sym.color, opacity: 0.5, marginBottom: '8px' }}>
              Behavioral Design
            </p>
            <p style={{ fontSize: '13px', opacity: 0.5, maxWidth: '140px', lineHeight: 1.5 }}>
              Friction, Motivation, Decision Architecture
            </p>
          </div>

          {/* Right side label */}
          <div ref={rightLabelRef} style={{
            position:      'absolute',
            right:         '8%',
            top:           '50%',
            transform:     'translateY(-50%)',
            textAlign:     'center',
            opacity:       0,
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: sym.color, opacity: 0.5, marginBottom: '8px' }}>
              Content Architecture
            </p>
            <p style={{ fontSize: '13px', opacity: 0.5, maxWidth: '140px', lineHeight: 1.5 }}>
              Knowledge Packaging, Narrative, Credibility
            </p>
          </div>

          {/* Content inside intersection zone */}
          <div ref={contentRef} style={{
            position:  'relative',
            zIndex:    1,
            maxWidth:  '480px',
            textAlign: 'center',
            padding:   '32px 24px',
          }}>
            <h2 className="t-headline" style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', marginBottom: '32px' }}>
              Behavioral Moves
            </h2>

            {/* 2×2 grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              border: '1px solid rgba(234,228,218,0.06)',
              textAlign: 'left',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(4px)',
            }}>
              {QUADRANTS.map((q, i) => (
                <div key={q.key} style={{
                  padding: '20px',
                  borderRight:  i % 2 === 0 ? '1px solid rgba(234,228,218,0.06)' : 'none',
                  borderBottom: i < 2       ? '1px solid rgba(234,228,218,0.06)' : 'none',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '8px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: sym.color,
                    opacity: 0.7,
                    marginBottom: '10px',
                  }}>
                    {q.label}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {data.behavioralMoves[q.key].slice(0, 2).map((item, j) => (
                      <li key={j} style={{ fontSize: '11px', opacity: 0.65, lineHeight: 1.6, marginBottom: '4px', paddingLeft: '10px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: sym.color, opacity: 0.5 }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Below-sticky content: pull quote + insight block */}
      <div style={{ padding: '64px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <PullQuote quote={data.insightQuote} color={sym.color} />
        <InsightBlock
          label="Most leveraged move"
          value={data.behavioralMoves.attention[0]}
          color={sym.color}
        />
      </div>
    </>
  )
}
```

- [ ] **Step 2: Compile check**

```bash
./node_modules/.bin/tsc --noEmit 2>&1
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/case-study/InsightSection.tsx
git commit -m "feat: Insight — sticky Vesica Piscis with scroll-scrubbed circle merge

300vh scroll container + position:sticky panel. Two circles begin
separated and slide to Vesica position. Lens illuminates, behavioral
moves grid appears inside intersection as scrub progresses."
```

---

## Chunk 3: ActionSection + FrameworkSection

### Task 5: ActionSection — Archimedean Spiral draw on scroll

**Files:**
- Modify: `components/case-study/ActionSection.tsx`

**What it replaces:** The 5-node horizontal chain SVG. **What it adds:** A large Archimedean spiral SVG (2.5 turns, centered) that draws itself as the user scrolls into the section using `strokeDashoffset` scrub. Content cards (the 4 learning flow steps) appear to orbit outward from the center as the spiral expands — achieved by staggering their reveal with ScrollTrigger.

The spiral path is computed once by `generateSpiralPath()` — a utility function defined at module level.

- [ ] **Step 1: Rewrite ActionSection.tsx with spiral**

```tsx
// components/case-study/ActionSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { symbols }       from '@/lib/symbols'
import { SectionWrapper, PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

// ─── Archimedean spiral path ──────────────────────────────────────────────────
function generateSpiralPath(cx: number, cy: number, turns: number, maxR: number, steps = 240): string {
  const total = turns * Math.PI * 2
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t     = i / steps
    const angle = t * total - Math.PI / 2
    const r     = t * maxR
    const x     = (cx + r * Math.cos(angle)).toFixed(2)
    const y     = (cy + r * Math.sin(angle)).toFixed(2)
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
}

const SPIRAL_D = generateSpiralPath(400, 220, 2.5, 190)

export function ActionSection({ data }: { data: CaseStudy }) {
  const sym       = symbols.action
  const ref       = useRef<HTMLDivElement>(null)
  const spiralRef = useRef<SVGPathElement>(null)
  const cardsRef  = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Text lines fade up
      gsap.from(ref.current?.querySelectorAll('.anim-line') ?? [], {
        opacity: 0, y: 20, duration: dur.base, stagger: 0.07, ease: ease.out,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })

      // Spiral draw: strokeDashoffset scrubbed from total-length → 0
      const spiralEl = spiralRef.current
      if (spiralEl) {
        // Use a fixed large value since getTotalLength may not be available server-side
        const approxLen = 2400
        gsap.set(spiralEl, { strokeDasharray: approxLen, strokeDashoffset: approxLen })
        gsap.to(spiralEl, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger:  ref.current,
            start:    'top 70%',
            end:      'center 30%',
            scrub:    2,
          },
        })
      }

      // Cards expand outward — stagger on scroll enter
      ScrollTrigger.create({
        trigger:  ref.current,
        start:    'top 60%',
        onEnter:  () => {
          gsap.from(cardsRef.current.filter(Boolean), {
            opacity:  0,
            scale:    0.85,
            y:        24,
            duration: dur.base,
            stagger:  { each: 0.15, ease: ease.out },
            ease:     ease.out,
          })
        },
      })

    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionWrapper symbol={sym} eyebrow="04 / Action" alt>
      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          Learning Flow
        </h2>

        {/* Spiral SVG */}
        <div className="anim-line" style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          <svg
            viewBox="0 0 800 440"
            width="100%"
            style={{ maxWidth: '700px', display: 'block' }}
            fill="none"
            aria-label="Archimedean spiral — transformation arc"
          >
            {/* Background field circles */}
            <circle cx={400} cy={220} r={190} stroke={sym.color} strokeOpacity={0.06} strokeWidth={0.5} />
            <circle cx={400} cy={220} r={120} stroke={sym.color} strokeOpacity={0.06} strokeWidth={0.5} />
            <circle cx={400} cy={220} r={55}  stroke={sym.color} strokeOpacity={0.06} strokeWidth={0.5} />
            {/* The spiral — drawn via scrub */}
            <path
              ref={spiralRef}
              d={SPIRAL_D}
              stroke={sym.color}
              strokeWidth={1}
              strokeLinecap="round"
              strokeOpacity={0.7}
            />
            {/* Center node */}
            <circle cx={400} cy={220} r={4} fill={sym.color} opacity={0.6} />
            {/* Stage label at outer edge */}
            <text x={400} y={426} textAnchor="middle"
              fontFamily="var(--font-display)" fontSize={7} letterSpacing={2}
              fill="rgba(234,228,218,0.35)">
              {data.learningFlow[3].to}
            </text>
            <text x={400} y={14} textAnchor="middle"
              fontFamily="var(--font-display)" fontSize={7} letterSpacing={2}
              fill="rgba(234,228,218,0.25)">
              {data.learningFlow[0].from}
            </text>
          </svg>
        </div>

        {/* Learning flow cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '720px', marginBottom: '16px' }}>
          {data.learningFlow.map((step, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el }}
              style={{ padding: '16px', background: 'rgba(234,228,218,0.02)', border: '1px solid rgba(234,228,218,0.05)' }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: sym.color, opacity: 0.5, marginBottom: '6px' }}>
                {step.from} → {step.to}
              </p>
              <p style={{ fontSize: '12px', opacity: 0.65, lineHeight: 1.6 }}>{step.how}</p>
            </div>
          ))}
        </div>

        <PullQuote quote={data.actionQuote} color={sym.color} />

        <InsightBlock
          label="The step most creators skip"
          value={`${data.learningFlow[1].from} → ${data.learningFlow[1].to}: the transition from passive interest to active trust.`}
          color={sym.color}
        />
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Compile check**

```bash
./node_modules/.bin/tsc --noEmit 2>&1
```

- [ ] **Step 3: Commit**

```bash
git add components/case-study/ActionSection.tsx
git commit -m "feat: Action — Archimedean spiral draws on scroll

Replaces 5-node chain with 2.5-turn spiral (strokeDashoffset scrub,
ratio 2:1 scrub factor). Learning flow cards appear as spiral expands.
Spiral motion = transformation in progress — never static."
```

---

### Task 6: FrameworkSection — Scattered content snaps to square grid

**Files:**
- Modify: `components/case-study/FrameworkSection.tsx`

**What it adds:**
1. **Square grid lines** animate in (strokeDashoffset draw) when section enters. The grid is an SVG overlay on the section background.
2. **Archetype pills start scattered** (random `x`, `y` offsets set via GSAP `set`) and **snap to their natural flow positions** using a stagger tween on scroll entry. Easing: `power3.out` (sharp arrival = structural lock).
3. **Labels pulse-lock** — a brief `scaleX: 1.02 → 1.0` on each pill as it snaps, creating a "click into place" feel.

- [ ] **Step 1: Rewrite FrameworkSection.tsx**

```tsx
// components/case-study/FrameworkSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { symbols }       from '@/lib/symbols'
import { SectionWrapper, PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

const ALL_ARCHETYPES = ['Rebellion', 'Mastery', 'Simplicity', 'Wealth', 'Freedom', 'Intelligence'] as const

// Deterministic scatter offsets — seeded, not random, so SSR matches client
const SCATTER: Record<string, { x: number; y: number; rotate: number }> = {
  Rebellion:    { x: -40, y: -20, rotate: -4  },
  Mastery:      { x:  30, y: -30, rotate:  3  },
  Simplicity:   { x: -20, y:  25, rotate: -2  },
  Wealth:       { x:  50, y:  10, rotate:  5  },
  Freedom:      { x: -35, y:  30, rotate: -3  },
  Intelligence: { x:  15, y: -25, rotate:  2  },
}

export function FrameworkSection({ data }: { data: CaseStudy }) {
  const sym      = symbols.framework
  const ref      = useRef<HTMLDivElement>(null)
  const gridRef  = useRef<SVGSVGElement>(null)
  const pillRefs = useRef<(HTMLSpanElement | null)[]>([])
  const hasSnapped = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Set scatter state BEFORE content is visible — avoids flash
      pillRefs.current.forEach((el, i) => {
        if (!el) return
        const arch = ALL_ARCHETYPES[i]
        const s    = SCATTER[arch]
        gsap.set(el, { x: s.x, y: s.y, rotation: s.rotate, opacity: 0.3 })
      })

      // Grid lines draw in
      if (gridRef.current) {
        const paths = Array.from(gridRef.current.querySelectorAll<SVGLineElement>('line'))
        paths.forEach(line => {
          const len = 500 // approximate; all grid lines are similar length
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
        })
        ScrollTrigger.create({
          trigger:  gridRef.current,
          start:    'top 80%',
          onEnter: () => {
            gsap.to(gridRef.current!.querySelectorAll('line'), {
              strokeDashoffset: 0,
              duration: dur.base,
              stagger:  { each: 0.05, ease: ease.out },
              ease:     'none',
            })
          },
        })
      }

      // Pills snap into place from scatter
      ScrollTrigger.create({
        trigger:  ref.current,
        start:    'top 65%',
        onEnter: () => {
          if (hasSnapped.current) return
          hasSnapped.current = true
          pillRefs.current.forEach((el, i) => {
            if (!el) return
            gsap.to(el, {
              x:        0,
              y:        0,
              rotation: 0,
              opacity:  1,
              duration: dur.base,
              delay:    i * 0.06,
              ease:     'power3.out',
              onComplete: () => {
                // Subtle scale-pulse = "click lock"
                gsap.to(el, { scaleX: 1.03, duration: 0.1, yoyo: true, repeat: 1, ease: 'none' })
              },
            })
          })
        },
      })

      // Text lines
      gsap.from(ref.current?.querySelectorAll('.anim-line') ?? [], {
        opacity: 0, y: 20, duration: dur.base, stagger: 0.07, ease: ease.out,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })

    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionWrapper symbol={sym} eyebrow="05 / Framework">
      {/* Square grid overlay */}
      <svg
        ref={gridRef}
        viewBox="0 0 1080 300"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.07 }}
        fill="none"
        aria-hidden="true"
      >
        {/* Vertical lines */}
        {[180, 360, 540, 720, 900].map(x => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={300} stroke="var(--shell)" strokeWidth={0.5} />
        ))}
        {/* Horizontal lines */}
        {[100, 200].map(y => (
          <line key={`h${y}`} x1={0} y1={y} x2={1080} y2={y} stroke="var(--shell)" strokeWidth={0.5} />
        ))}
      </svg>

      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          Narrative System
        </h2>

        {/* Archetype pills — start scattered, snap to grid */}
        <div className="anim-line" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: '40px' }}>
          {ALL_ARCHETYPES.map((arch, i) => {
            const active   = data.narrativeSystem.stories.includes(arch)
            const dominant = data.narrativeSystem.dominant === arch
            return (
              <span
                key={arch}
                ref={el => { pillRefs.current[i] = el }}
                style={{
                  display:       'inline-block',
                  fontFamily:    'var(--font-display)',
                  fontSize:      dominant ? '15px' : active ? '11px' : '9px',
                  letterSpacing: dominant ? '0.18em' : '0.15em',
                  textTransform: 'uppercase',
                  padding:       dominant ? '8px 18px' : active ? '6px 14px' : '4px 10px',
                  border:        `1px solid ${active ? sym.color : 'rgba(234,228,218,0.06)'}`,
                  color:         active ? sym.color : 'rgba(234,228,218,0.15)',
                  opacity:       dominant ? 1 : active ? 0.8 : 0.4,
                  background:    dominant ? `${sym.color}10` : 'transparent',
                  fontWeight:    dominant ? 600 : 400,
                  willChange:    'transform',
                }}
              >
                {arch}
              </span>
            )
          })}
        </div>

        <p className="anim-line" style={{ fontSize: '16px', lineHeight: 1.75, opacity: 0.75, maxWidth: '720px', marginBottom: '16px' }}>
          {data.narrativeSystem.description}
        </p>

        <PullQuote quote={data.narrativeSystem.quote} color={sym.color} />

        <InsightBlock
          label="Dominant narrative"
          value={`${data.narrativeSystem.dominant} — supported by ${data.narrativeSystem.stories.filter(s => s !== data.narrativeSystem.dominant).join(' and ')}`}
          color={sym.color}
        />
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Compile check**

```bash
./node_modules/.bin/tsc --noEmit 2>&1
```

- [ ] **Step 3: Commit**

```bash
git add components/case-study/FrameworkSection.tsx
git commit -m "feat: Framework — scattered pills snap to square grid on scroll

Grid lines draw themselves (strokeDashoffset stagger), archetype pills
start at deterministic scatter offsets and snap to position with
power3.out + micro scale-pulse click-lock. Order from noise."
```

---

## Chunk 4: SystemSection + AuthoritySection

### Task 7: CaseStudySystemSection — Hexagon network illumination

**Files:**
- Modify: `components/case-study/SystemSection.tsx`

**What it adds:** A hexagon node network SVG (7 hexagons in flower arrangement) that builds progressively on scroll entry. Each hexagon pops in via `scale: 0 → 1` stagger. Then connection lines between nodes draw via `strokeDashoffset` stagger. Finally, a "primary path" through 4 nodes illuminates sequentially — representing the journey through the system.

**Hexagon layout (SVG 900×480):** Center hex at (450, 240) with 6 surrounding at r=140 distance, each hexagon radius=60.

- [ ] **Step 1: Rewrite SystemSection.tsx**

```tsx
// components/case-study/SystemSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { symbols }       from '@/lib/symbols'
import { SectionWrapper, PullQuote, InsightBlock } from './SectionWrapper'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'

// ─── Hexagon geometry ─────────────────────────────────────────────────────────
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
}

const HEX_R  = 58  // hexagon radius
const DIST   = 138 // center-to-center distance (≈ 2 * HEX_R * sin(60°) ≈ 138)
const CX     = 450, CY = 240

const HEX_CENTERS: [number, number][] = [
  [CX, CY],
  [CX + DIST, CY],
  [CX + DIST * 0.5, CY - DIST * 0.866],
  [CX - DIST * 0.5, CY - DIST * 0.866],
  [CX - DIST, CY],
  [CX - DIST * 0.5, CY + DIST * 0.866],
  [CX + DIST * 0.5, CY + DIST * 0.866],
]

// Connection line pairs (center → each surrounding)
const CONNECTIONS: [number, number][] = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]

// Primary path: 0→1→6→5 — highlights "the working system path"
const PRIMARY_PATH = [0, 1, 6, 5]

// Hex labels: maps to what/how content
const HEX_LABELS = ['Core', 'Content', 'Community', 'Trust', 'Offer', 'Signal', 'System']

export function CaseStudySystemSection({ data }: { data: CaseStudy }) {
  const sym     = symbols.system
  const ref     = useRef<HTMLDivElement>(null)
  const svgRef  = useRef<SVGSVGElement>(null)
  const hexRefs = useRef<(SVGPolygonElement | null)[]>([])
  const lineRefs= useRef<(SVGLineElement | null)[]>([])
  const pathDotRefs = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Text lines
      gsap.from(ref.current?.querySelectorAll('.anim-line') ?? [], {
        opacity: 0, y: 20, duration: dur.base, stagger: 0.07, ease: ease.out,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })

      // Hexagons: scale in from center stagger
      gsap.set(hexRefs.current.filter(Boolean), { scale: 0, transformOrigin: '50% 50%', opacity: 0 })
      ScrollTrigger.create({
        trigger:  svgRef.current,
        start:    'top 70%',
        onEnter: () => {
          // Phase 1: hexagons pop in
          gsap.to(hexRefs.current.filter(Boolean), {
            scale:    1,
            opacity:  1,
            duration: dur.fast,
            stagger:  { each: 0.1, ease: ease.out },
            ease:     'back.out(1.2)',
            onComplete: () => {
              // Phase 2: connection lines draw
              lineRefs.current.forEach((line) => {
                if (!line) return
                const len = 140 // approximate line length
                gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
                gsap.to(line, {
                  strokeDashoffset: 0,
                  duration: dur.fast,
                  ease: 'none',
                  delay: Math.random() * 0.3,
                })
              })
              // Phase 3: primary path illuminates sequentially
              setTimeout(() => {
                PRIMARY_PATH.forEach((nodeIdx, order) => {
                  const dot = pathDotRefs.current[order]
                  if (!dot) return
                  gsap.fromTo(dot,
                    { opacity: 0, scale: 0 },
                    { opacity: 1, scale: 1, duration: 0.4, delay: order * 0.35, ease: 'back.out(1.4)', transformOrigin: '50% 50%' }
                  )
                })
              }, 800)
            }
          })
        },
      })

    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionWrapper symbol={sym} eyebrow="06 / System" alt>
      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '48px', maxWidth: '640px' }}>
          The Architecture
        </h2>

        {/* Hexagon network SVG */}
        <div className="anim-line" style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          <svg
            ref={svgRef}
            viewBox="0 0 900 480"
            width="100%"
            style={{ maxWidth: '780px', display: 'block' }}
            fill="none"
            aria-label="Hexagon system network"
          >
            {/* Connection lines */}
            {CONNECTIONS.map(([a, b], i) => {
              const [ax, ay] = HEX_CENTERS[a]
              const [bx, by] = HEX_CENTERS[b]
              return (
                <line
                  key={`conn-${i}`}
                  ref={el => { lineRefs.current[i] = el }}
                  x1={ax} y1={ay} x2={bx} y2={by}
                  stroke={sym.color} strokeOpacity={0.25} strokeWidth={0.75}
                />
              )
            })}

            {/* Hexagons */}
            {HEX_CENTERS.map(([cx, cy], i) => (
              <g key={`hex-${i}`}>
                <polygon
                  ref={el => { hexRefs.current[i] = el }}
                  points={hexPoints(cx, cy, HEX_R)}
                  stroke={sym.color}
                  strokeOpacity={i === 0 ? 0.6 : 0.3}
                  strokeWidth={i === 0 ? 1 : 0.75}
                />
                {/* Hex label */}
                <text
                  x={cx} y={cy + 4}
                  textAnchor="middle"
                  fontFamily="var(--font-display)"
                  fontSize={7}
                  letterSpacing={1.5}
                  fill="rgba(234,228,218,0.35)"
                >
                  {HEX_LABELS[i]}
                </text>
              </g>
            ))}

            {/* Primary path illumination dots */}
            {PRIMARY_PATH.map((nodeIdx, order) => {
              const [cx, cy] = HEX_CENTERS[nodeIdx]
              return (
                <circle
                  key={`path-${order}`}
                  ref={el => { pathDotRefs.current[order] = el }}
                  cx={cx} cy={cy} r={6}
                  fill={sym.color}
                  opacity={0}
                />
              )
            })}
          </svg>
        </div>

        {/* What Works + Missed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '900px' }}>
          <div>
            <p className="anim-line" style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--tang)', opacity: 0.6, marginBottom: '20px' }}>
              What Works
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.whatWorks.map((item, i) => (
                <li key={i} className="anim-line" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span style={{ color: 'var(--tang)', fontSize: '9px', marginTop: '5px', flexShrink: 0 }}>●</span>
                  <span style={{ fontSize: '14px', opacity: 0.75, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="anim-line" style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: sym.color, opacity: 0.6, marginBottom: '20px' }}>
              Missed Opportunities
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.missedOpportunities.map((item, i) => (
                <li key={i} className="anim-line" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span style={{ color: sym.color, fontSize: '9px', marginTop: '5px', flexShrink: 0, opacity: 0.4 }}>○</span>
                  <span style={{ fontSize: '14px', opacity: 0.45, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PullQuote quote={data.systemQuote} color={sym.color} />
        <InsightBlock label="Primary gap" value={data.missedOpportunities[0]} color={sym.color} />
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Compile check**

```bash
./node_modules/.bin/tsc --noEmit 2>&1
```

- [ ] **Step 3: Commit**

```bash
git add components/case-study/SystemSection.tsx
git commit -m "feat: System — hexagon network builds then primary path illuminates

7 hexagons in flower arrangement: (1) scale-in stagger, (2) connection
lines draw, (3) primary path lights up sequentially with 350ms delays.
Network intelligence made visible."
```

---

### Task 8: AuthoritySection — Flower expansion + word-by-word mic drop + CTA ripple

**Files:**
- Modify: `components/case-study/AuthoritySection.tsx`

**What it adds:**
1. **Flower of Life expansion** — 7 circles draw in from center, each ring expanding via `scale: 0 → 1` stagger with `transformOrigin: 'center'`. Duration: `dur.xslow`, stagger each 0.2s.
2. **Word-by-word mic drop** — The section's closing quote splits into words using `gsap.utils.toArray` on `<span>` elements. Words reveal `opacity: 0 → 1` with stagger 0.08s on scroll trigger. Then the SVG line draws across screen. Then the line curves (brief scale on a circular SVG arc drawn at end). Effect: draws a line → words appear along it → line curves into a circle.
3. **CTA ripple** — The "Curiosity Upgrade" button CTA gets a `::after` ripple via GSAP — on mouseenter, a `<div>` scales from `0 → 2.5, opacity: 1 → 0`.

- [ ] **Step 1: Rewrite AuthoritySection.tsx**

```tsx
// components/case-study/AuthoritySection.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'
import { symbols }       from '@/lib/symbols'
import { Symbol }        from '@/components/geo/Symbol'
import { SectionWrapper } from './SectionWrapper'
import { getNextCaseStudy } from '@/lib/case-studies'
import type { CaseStudy } from '@/lib/case-studies'
import { dur, ease } from '@/lib/motion-config'
import { colors } from '@/lib/design-tokens'

// ─── Flower of Life geometry ──────────────────────────────────────────────────
function flowerCenters(cx: number, cy: number, r: number): [number, number][] {
  return [
    [cx, cy],
    ...Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number]
    }),
  ]
}

const FLOWER_CX = 540, FLOWER_CY = 200, FLOWER_R = 120
const FLOWER_CENTERS = flowerCenters(FLOWER_CX, FLOWER_CY, FLOWER_R)

const MIC_DROP_QUOTE = "The system is real. The question is: can you make it visible?"

export function AuthoritySection({ data }: { data: CaseStudy }) {
  const sym     = symbols.authority
  const next    = getNextCaseStudy(data.slug)
  const ref     = useRef<HTMLDivElement>(null)
  const flowerRefs   = useRef<(SVGCircleElement | null)[]>([])
  const lineRef      = useRef<SVGLineElement>(null)
  const circleArcRef = useRef<SVGCircleElement>(null)
  const quoteRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef       = useRef<HTMLAnchorElement>(null)
  const rippleRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Text fade-up
      gsap.from(ref.current?.querySelectorAll('.anim-line') ?? [], {
        opacity: 0, y: 20, duration: dur.base, stagger: 0.07, ease: ease.out,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })

      // ── Flower of Life: circles expand from center
      gsap.set(flowerRefs.current.filter(Boolean), { scale: 0, opacity: 0, transformOrigin: `${FLOWER_CX}px ${FLOWER_CY}px` })
      ScrollTrigger.create({
        trigger:  ref.current,
        start:    'top 60%',
        onEnter: () => {
          gsap.to(flowerRefs.current.filter(Boolean), {
            scale:    1,
            opacity:  1,
            duration: dur.slow,
            stagger:  { each: 0.18, ease: ease.out },
            ease:     'power3.out',
          })
        },
      })

      // ── Mic drop sequence: line draws → words appear word-by-word via SplitText → arc closes
      const quoteEl = quoteRef.current
      if (quoteEl) {
        // SplitText splits the paragraph into word spans automatically
        const split = new SplitText(quoteEl, { type: 'words', wordsClass: 'mic-word' })
        gsap.set(split.words, { opacity: 0, y: 6 })

        ScrollTrigger.create({
          trigger:  quoteEl,
          start:    'top 75%',
          onEnter: () => {
            const lineEl = lineRef.current
            if (lineEl) {
              // Step 1: line draws left to right
              gsap.set(lineEl, { strokeDasharray: 800, strokeDashoffset: 800, opacity: 1 })
              gsap.to(lineEl, {
                strokeDashoffset: 0,
                duration: dur.base,
                ease: 'none',
                onComplete: () => {
                  // Step 2: words reveal staggered
                  gsap.to(split.words, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: { each: 0.07, ease: ease.out },
                    ease: ease.out,
                    onComplete: () => {
                      // Step 3: arc draws in — line fades, circle completes
                      const arc = circleArcRef.current
                      if (arc) {
                        const len = arc.getTotalLength?.() ?? 502
                        gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len, autoAlpha: 1 })
                        gsap.to(arc, { strokeDashoffset: 0, duration: dur.slow, ease: ease.inOut })
                        gsap.to(lineEl, { autoAlpha: 0, duration: 0.4, delay: 0.3 })
                      }
                    },
                  })
                },
              })
            }
          },
        })
      }

      // ── CTA ripple on hover
      const ctaEl    = ctaRef.current
      const rippleEl = rippleRef.current
      if (ctaEl && rippleEl) {
        const onEnter = () => {
          gsap.fromTo(rippleEl,
            { scale: 0, opacity: 0.4 },
            { scale: 2.8, opacity: 0, duration: 0.7, ease: 'power2.out' }
          )
        }
        ctaEl.addEventListener('mouseenter', onEnter)
        return () => ctaEl.removeEventListener('mouseenter', onEnter)
      }

    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <SectionWrapper symbol={sym} eyebrow="07 / Authority">
      <div ref={ref}>
        <h2 className="anim-line t-headline" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          The Curiosity Upgrade
        </h2>

        {/* Flower of Life SVG — expands behind content */}
        <div style={{ position: 'absolute', top: '80px', right: '60px', opacity: 0.2, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1080 400" width="480" style={{ display: 'block' }} fill="none" aria-hidden="true">
            {FLOWER_CENTERS.map(([cx, cy], i) => (
              <circle
                key={i}
                ref={el => { flowerRefs.current[i] = el }}
                cx={cx} cy={cy} r={FLOWER_R}
                stroke={data.color}
                strokeWidth={0.75}
                opacity={i === 0 ? 0.8 : 0.5}
              />
            ))}
            {/* Outer ring */}
            <circle
              cx={FLOWER_CX} cy={FLOWER_CY} r={FLOWER_R * 2}
              stroke={data.color} strokeWidth={0.5} opacity={0.25}
              strokeDasharray="6 10"
            />
          </svg>
        </div>

        {/* Upgrade bullets */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', maxWidth: '680px' }}>
          {data.curiosityUpgrade.map((item, i) => (
            <li key={i} className="anim-line" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(234,228,218,0.04)' }}>
              <span style={{ color: data.color, fontFamily: 'var(--font-display)', fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>→</span>
              <span style={{ fontSize: '15px', opacity: 0.8, lineHeight: 1.65 }}>{item.replace('→ ', '')}</span>
            </li>
          ))}
        </ul>

        {/* Mic drop — line + word-by-word + circle arc */}
        <div style={{ margin: '64px 0', position: 'relative' }}>
          {/* Horizontal line */}
          <svg viewBox="0 0 800 8" style={{ display: 'block', width: '100%', maxWidth: '760px', marginBottom: '24px' }} aria-hidden="true">
            <line ref={lineRef} x1={0} y1={4} x2={800} y2={4} stroke={data.color} strokeWidth={0.75} />
          </svg>
          {/* Word-by-word quote — SplitText splits this into word spans automatically */}
          <blockquote style={{ maxWidth: '640px', fontStyle: 'italic', fontSize: '18px', lineHeight: 1.6 }}>
            <p ref={quoteRef} style={{ margin: 0, opacity: 0.9 }}>
              {MIC_DROP_QUOTE}
            </p>
          </blockquote>
          {/* Circle arc — hidden via GSAP autoAlpha (set in useEffect), draws after quote */}
          <svg viewBox="0 0 200 200" width="120" style={{ display: 'block', marginTop: '32px', visibility: 'hidden' }} aria-hidden="true">
            <circle
              ref={circleArcRef}
              cx={100} cy={100} r={80}
              stroke={data.color} strokeWidth={0.75} fill="none"
            />
          </svg>
        </div>

        {/* Takeaways */}
        <div className="anim-line" style={{ borderTop: '1px solid rgba(234,228,218,0.06)', paddingTop: '48px', marginBottom: '48px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: sym.color, opacity: 0.5, marginBottom: '32px' }}>
            Founder Takeaways
          </p>
          <div style={{ maxWidth: '700px' }}>
            {data.takeaways.map((t, i) => (
              <div key={i} className="anim-line" style={{ display: 'flex', gap: '28px', alignItems: 'baseline', paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(234,228,218,0.04)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: data.color, opacity: 0.4, minWidth: '28px', flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '17px', letterSpacing: '0.03em', lineHeight: 1.35, opacity: 0.9 }}>
                  {t}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing symbol */}
        <div className="anim-line" style={{ display: 'flex', justifyContent: 'center', marginBottom: '64px' }}>
          <Symbol symbol={sym} size={48} color={data.color} opacity={0.5} animated />
        </div>

        {/* CTA — open circle with ripple */}
        <div className="anim-line" style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            {/* Ripple element */}
            <div
              ref={rippleRef}
              style={{
                position:     'absolute',
                inset:        0,
                borderRadius: '50%',
                border:       `1px solid ${data.color}`,
                pointerEvents: 'none',
                scale:        0,
                opacity:      0,
              }}
            />
            {/* CTA open circle */}
            <svg viewBox="0 0 180 180" width="180" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
              <circle cx={90} cy={90} r={84} stroke={data.color} strokeWidth={0.75} fill="none" opacity={0.3} strokeDasharray="6 10" />
            </svg>
            <Link
              ref={ctaRef}
              href="/contact"
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                justifyContent: 'center',
                width:         '180px',
                height:        '180px',
                borderRadius:  '50%',
                fontFamily:    'var(--font-display)',
                fontSize:      '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color:         data.color,
                textDecoration:'none',
                border:        `1px solid ${data.color}40`,
                background:    `${data.color}06`,
                position:      'relative',
              }}
            >
              Start a Project
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="anim-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(234,228,218,0.06)', paddingTop: '32px' }}>
          <Link href="/#work" style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--shell)', opacity: 0.3, textDecoration: 'none' }}>
            ← All Case Studies
          </Link>
          <Link href={`/case-studies/${next.slug}`} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: next.color, opacity: 0.75, textDecoration: 'none' }}>
            Next: {next.name} →
          </Link>
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Compile check**

```bash
./node_modules/.bin/tsc --noEmit 2>&1
```

- [ ] **Step 3: Commit**

```bash
git add components/case-study/AuthoritySection.tsx
git commit -m "feat: Authority — Flower expansion + word-by-word mic drop + CTA ripple

Flower of Life 7 circles scale in staggered from center. Mic drop
sequence: line draws across → words appear word-by-word → line curves
into circle (line→arc animation). CTA is an open circle container with
GSAP scale ripple on hover."
```

---

## Chunk 5: Final Integration + Verification

### Task 9: Full compile, build, and visual check

- [ ] **Step 1: Full TypeScript compile**

```bash
cd /Users/gingerninja/Sites/curiosity-inc && ./node_modules/.bin/tsc --noEmit 2>&1
```
Expected: zero output (zero errors)

- [ ] **Step 2: Production build**

```bash
npm run build 2>&1
```
Expected output includes:
```
✓ Compiled successfully
● /case-studies/dan-koe
● /case-studies/ali-abdaal
● /case-studies/justin-welsh
```
All 3 static routes must generate without error.

- [ ] **Step 3: Dev server visual check**

```bash
npm run dev 2>&1 &
```

Open each URL and verify:
- `http://localhost:3000/case-studies/dan-koe`
  - [ ] Hero: circle clip-path reveals from point on load
  - [ ] Hero: mouse movement creates portrait/text parallax
  - [ ] Awareness: triangle funnel draws stroke-by-stroke on scroll entry
  - [ ] Awareness: broken triangle pieces drift on scroll
  - [ ] Insight: 300vh container scrolls, circles move toward each other, lens illuminates
  - [ ] Action: spiral draws itself as section scrolls into view
  - [ ] Framework: pills start scattered, snap to position with click-lock
  - [ ] System: hexagons pop in, lines draw, path illuminates
  - [ ] Authority: flower circles expand, mic drop sequence fires, CTA circle has ripple
  - [ ] Background: GeometricMotif shape cross-fades between sections (very subtle, 4% opacity)
  - [ ] Progress spine: labels and nodes track correctly
  - [ ] No console errors

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: cinematic sacred geometry — full case study experience

Complete implementation of scroll-driven sacred geometry motion language
across all 7 case study sections. Each section's geometry reflects its
cognitive role: confusion dissolves → insight synthesizes → structure
crystallizes → networks illuminate → authority radiates.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Notes for Executing Agent

**Import rule — non-negotiable:** All components use `import { gsap, ScrollTrigger } from '@/lib/gsap'`. Never import directly from `'gsap'` or `'gsap/ScrollTrigger'`. Never call `gsap.registerPlugin()` in a component. `lib/gsap.ts` handles registration once, client-side only.

**SplitText:** Available via `import { SplitText } from '@/lib/gsap'`. Use it in `AuthoritySection` for the mic drop word-by-word reveal. `new SplitText(el, { type: 'words' })` returns an object with `.words` array. Must be called inside `useEffect` after DOM is ready. Clean up with `split.revert()` in the context cleanup or on `ctx.revert()`.

**GSAP cleanup pattern** — every section uses either:
- `gsap.context(() => {...}, ref); return () => ctx.revert()` — for section-scoped animations
- `const triggers: ScrollTrigger[] = []; return () => triggers.forEach(t => t.kill())` — for external-ID watchers

**Never mix these patterns** in the same component.

**The `InsightSection` sticky pattern** — the outer `div` has `height: 300vh` with no `overflow: hidden`. The inner sticky panel has `height: 100vh; overflow: hidden`. The GSAP ScrollTrigger watches the outer container (`trigger: containerRef.current`, `start: 'top top'`, `end: 'bottom bottom'`). The section does NOT use `SectionWrapper` — it renders the eyebrow manually above the sticky zone.

**GeometricMotif opacity** — `BASE_OPACITY = 0.04`. This is intentionally below perception threshold for most viewers at normal reading distance. Do not increase. The motif is subconscious field, not foreground art.

**Framework scatter offsets** — must be deterministic (not `Math.random()`) since values are set during React rendering. The `SCATTER` constant with fixed values ensures SSR and client render match.

**`orbit()` from motion-config** — uses `require('./gsap')` internally (lazy import). This is intentional to avoid SSR issues. Do not refactor.
