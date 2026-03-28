# Project Progress — Curiosity Inc. Digital Sanctuary

## Current Status

**Phase 11 Complete** — Phase 6 polish pass done. Lazy-load perf, mobile layouts (About + ArticlePage), SEO/meta completeness, brand favicon, duplicate meta fix. AnnotationThread confirmed built. **70 tests passing** across 12 test files.

---

## 1. Accomplishments by Phase

### Phase 1: Foundation — The Silent Ground

- **Scaffold**: Vite + React 18 + TypeScript (strict).
- **Design Tokens**: Complete CSS custom properties in [index.css](file:///Users/gingerninja/Sites/claudessetup/src/index.css).
- **Typography**: Google Fonts (Instrument Serif, DM Sans, JetBrains Mono) integrated.
- **Shared Infrastructure**:
  - `useScrollTrigger`: Single-trigger IntersectionObserver.
  - `useSelfDraw`: SVG stroke-dashoffset animation.
  - `useStagger`: Consistent rhythmic delay calculation.
  - `useReducedMotion`: Accessibility first.

### Phase 2: Typography & Navigation

- **Navigation**: [Navigation.tsx](file:///Users/gingerninja/Sites/claudessetup/src/components/navigation/Navigation.tsx) with transparent-to-blur transitions, anchor-link logic for the homepage, and active section tracking.
- **Typography Components**: `SectionLabel`, `DisplayHeading`, `BodyText`, `Labels`. All enforce the binding visual style without external UI libraries.
- **Footer**: Brand-aligned [Footer.tsx](file:///Users/gingerninja/Sites/claudessetup/src/components/footer/Footer.tsx) with "STAY CURIOUS" wordmark and "JOIN THE COLLECTIVE" CTA.
- **Page Shells**: Functional routes at `/`, `/work/:slug`, and `/writing/:slug`.

### Phase 3: The Scaffold & Flow Pulse

- **The Scaffold**: Staggered horizontal bands with self-drawing accents and progressive disclosure.
- **The Flow Pulse**: Sankey-style SVG paths with smooth cubic beziers, breathing opacity animation, and timed Pink annotations.

### Phase 4: Delta Bridge, Lens, and Grid Reveal

- **The Delta Bridge**: Before/after transformation metrics with self-drawing arcs (Teal → Pink → Orange) and magnitude-aware curvature.
- **The Lens**: Vesica Piscis diagnostic tool with intersection highlighting for hero statistics.
- **The Grid Reveal**: Case study card system with center-outward stagger animations and high-fidelity typography.

### Phase 5: The Convergence Map

- **Interactive Constellation**: Radial force-directed diagram showcasing Curiosity Inc.'s intellectual ecosystem.
- **Inward Animation**: Centripetal drawing sequence where discipline lines converge on the central node.
- **Rich Interactivity**: Hover states reveal discipline descriptions and isolate connections through semantic dimming.

### Phase 6: Homepage Assembly

- **Full narrative assembled** in `src/pages/index.tsx`.
- **Hero**: Text-based placeholder with GSAP fade-in (`PHASE 8` comment marks WebGL replacement target).
- **Section 1 — The Pattern**: Scaffold with 3 bands (Attention/Transformation, Decision/Cultivation, Intention/Depth).
- **Section 2 — The Insight**: FlowPulse comparing Funnel Model vs. Learning Architecture.
- **Section 3 — The Laboratory**: GridReveal with 3 case study cards (Dan Koe, Justin Welsh, Tiago Forte).
- **Section 4 — The Library**: Inline article list with 4 deep reading entries.
- **Section 5 — The Constellation**: ConvergenceMap with CTA ("Request a Curiosity Audit").
- **Routing**: All 3 case studies wired via `CaseStudyPage` dispatcher.

### Phase 7: Dan Koe Case Study

- **All 5 SCQA Acts complete** in `src/pages/DanKoeCaseStudy.tsx`.
  - **Act 01 — Situation / The Profile**: Creator profile card with editorial portrait placeholder, metadata bands (platform, audience size, content format, revenue model).
  - **Act 02 — Situation Continued / The Diagnosis**: Scaffold visualization showing the structural breakdown of content vs. curriculum.
  - **Act 03 — Question / The Orbital Gravity Well**: ArchitectureComparison — side-by-side SVG of Current Funnel Model vs. Proposed Orbital Gravity Well (self-drawing with staggered GSAP).
  - **Act 04 — Answer / The Shift**: Lens (Vesica Piscis with 3.2× LTV multiplier) + DeltaBridge metrics (Repeat Engagement Rate, Content-to-Purchase Velocity, LTV Multiplier).
  - **Act 05 — Answer Continued / The Reflection**: Closing narrative, back-navigation.
- **Extra Component Built**: `ArchitectureComparison` — not in original component spec, emerged from case study needs.

### Phase 8: WebGL Hero

- **Particle Field** (`src/components/hero/ParticleField.tsx`): 800 particles, 4-stage morph sequence (Cloud → Grid → Phönix → Constellation). Idle drift via sine-wave displacement, scroll-driven morphing via GSAP ScrollTrigger.
- **HeroSection** (`src/components/hero/HeroSection.tsx`): `<Canvas>` wrapped in `<Suspense>`. HeroFallback for reduced-motion and touch devices. `frameloop="demand"` for performance. `progressRef` passed to ParticleField — no React re-renders during scroll.
- **HeroFallback** (`src/components/hero/HeroFallback.tsx`): Static SVG particle simulation for accessibility.
- **Hooks**: `useHeroScroll` (GSAP ScrollTrigger scrub), `useParticleTargets` (precomputed 4-stage Float32Array positions), `useReducedMotion`.
- **Upgrade**: React 18 → React 19, `@react-three/fiber` + `@react-three/drei`, Vite 7 → Vite 8.
- **Tests**: HeroSection renders HeroFallback for reduced-motion and touch devices.

### Phase 9: Article Pages & Remaining Case Studies

- **Justin Welsh Case Study** (`src/pages/JustinWelshCaseStudy.tsx`) — Full 5-act SCQA narrative at `/work/justin-welsh-conversion-design`.
  - Act 01: The Professor (profile card, platform distribution, target topology)
  - Act 02: The Platform Audit (per-platform breakdown + Merrill's First Principles grid)
  - Act 03: The Commitment Ladder (Scaffold — 4 bands: LinkedIn → Newsletter → Courses → Community)
  - Act 04: The Architecture (Lens 5.1× + DeltaBridge: Micro-Commitment Rate, Identity Adoption, Subscriber LTV)
  - Act 05: The Framework (closing narrative, prev/next navigation)
- **Tiago Forte Case Study** (`src/pages/TiagoForteCaseStudy.tsx`) — Full 5-act SCQA narrative at `/work/tiago-forte-cognitive-interfaces`.
  - Act 01: The Architect (profile card, 4-platform distribution, target topology)
  - Act 02: The Platform Audit (6-platform grid including missing "Cognitive Interface" + Merrill's)
  - Act 03: The Cognitive Interface (Scaffold — 4 bands: Capture → Organise → Distill → Express)
  - Act 04: The Architecture (Lens 4.7× + DeltaBridge: Practice Adoption, Methodology Retention, Practitioner LTV)
  - Act 05: The Framework (closing narrative + AI pivot angle)
- **4 articles authored** in `src/data/articles.ts` with full section content and pull quotes:
  - `the-accidental-educator` (LEARNING SCIENCE, 12 min)
  - `negative-space-as-active-agent` (DESIGN THEORY, 8 min)
  - `the-curiosity-loop-protocol` (METHODOLOGY, 15 min)
  - `eureka-as-practice` (PHILOSOPHY, 10 min)
- **ArticlePage** (`src/pages/ArticlePage.tsx`): Two-column flex layout — sticky TOC sidebar + main content. React 19 native metadata tags (`<title>`, `<meta>`) for client-side navigation.
- **ArticleTOC** (`src/components/article/ArticleTOC.tsx`): Sticky sidebar with CONTENTS label (Teal), section anchor links, active-section highlighting via `IntersectionObserver`.
- **ArticleBody** (`src/components/article/ArticleBody.tsx`): Section renderer with `<h2>` headings, paragraphs, and optional `<blockquote>` pull quotes (Pink left border, Instrument Serif italic).
- **ArticleNav** (`src/components/article/ArticleNav.tsx`): Three-slot footer — `← prev title` | `Writing` (back to `/#writing`) | `next title →`.
- **Static prerendering** (`scripts/prerender.ts`): Post-build SSG using `react-dom/server` + `StaticRouter`. Generates clean HTML for **9 routes**: home, all 3 case studies, 4 article pages, About. Per-page `<title>` and `<meta>` tags + OG tags injected at build time.
- **AppRoutes** exported from `App.tsx` — routes extracted from BrowserRouter so StaticRouter can wrap them during SSR without conflicts.
- **Build script**: `tsc -b && vite build && tsx --tsconfig tsconfig.app.json scripts/prerender.ts`

### Phase 10: About Page & Curiosity Audit Intake

- **About Page** (`src/pages/About.tsx`) — Five-section manifesto at `/about`:
  - **Section 1 — Conviction**: Opening conviction statement in Instrument Serif italic, pink accent underline.
  - **Section 2 — Path**: Three-discipline path with labels (Audience, Messaging, Media) connecting to core offer.
  - **Section 3 — Portrait**: Jacklyn Miller photo reveal (`public/jacklyn-miller.webp`, 1616×1080, 85KB WebP) with name and role.
  - **Section 4 — Direct Address**: Direct address to the visitor ("People say..."), positioning Curiosity's perspective.
  - **Section 5 — CTA**: Email call-to-action ("Start the conversation") with `mailto:` link.
  - **8 tests passing**: Renders without crashing, conviction text, photo, CTA link, discipline labels, closing line, /about route.
- **Curiosity Audit Intake Form** (`src/pages/AuditRequest.tsx`) — Intake flow at `/audit`:
  - Multi-step form for audit requests with validation and submission handling.
  - Fully wired to Navigation and CTA flows.
- **Navigation Update**: ABOUT link added to `Navigation.tsx`, routes to `/about`.
- **Prerender Entry**: `/about` added to `scripts/prerender.ts` for static generation.

### Phase 11: Polish (Phase 6 from blueprint)

- **Performance**: `HeroSection` (Three.js 883KB) lazy-loaded via `React.lazy()` + `Suspense`. Three.js chunk now deferred to after initial paint. `HeroFallback` used as Suspense boundary — same designed state as reduced-motion fallback.
- **Mobile — About page**: Replaced hardcoded `48px` side padding with `clamp(20px, 6vw, 48px)` across all five sections. Portrait + text `revealInner` extracted from inline style to `.about-reveal-inner` CSS class — stacks vertically on mobile (< 640px), rows on desktop.
- **Mobile — Article pages**: `ArticlePage` `<article>` converted from inline flex style to `.article-layout` CSS class. TOC sidebar (`.article-toc`) hidden on mobile via `display: none` at < 768px. `aria-label="Table of contents"` added to `<aside>`. Side padding fixed to `clamp(20px, 5vw, 48px)`.
- **SEO**: Domain unified to `curiosityinc.co` across `index.html`, `prerender.ts`. Per-page prerender now injects `og:url` + full `twitter:card` set. Static homepage meta tags stripped from per-page output to prevent duplicates. `/audit` route added (10 routes total, was 9).
- **Favicon**: `index.html` updated to reference existing `/favicon.svg` (was broken `/vite.svg` reference).
- **AnnotationThread**: Component confirmed complete in `AnnotationThread.tsx` — progress doc corrected.
- **Tests**: 70 passing across 12 test files (was 67/11). New: `Homepage.test.tsx`, updated `About.test.tsx`, `ArticlePage.test.tsx`.

---

## 2. Component Library Status

| Component | File | Status | Spec'd |
|-----------|------|--------|--------|
| The Scaffold | `Scaffold.tsx` | ✅ Complete | ✅ |
| The Flow Pulse | `FlowPulse.tsx` | ✅ Complete | ✅ |
| The Delta Bridge | `DeltaBridge.tsx` | ✅ Complete | ✅ |
| The Lens | `Lens.tsx` | ✅ Complete | ✅ |
| The Grid Reveal | `GridReveal.tsx` | ✅ Complete | ✅ |
| The Convergence Map | `ConvergenceMap.tsx` | ✅ Complete | ✅ |
| Architecture Comparison | `ArchitectureComparison.tsx` | ✅ Complete | ❌ (emerged from Phase 7) |
| About Page | `About.tsx` | ✅ Complete | ✅ (design spec) |
| Curiosity Audit Intake | `AuditRequest.tsx` | ✅ Complete | ✅ (design spec) |
| The Annotation Thread | `AnnotationThread.tsx` | ✅ Complete | ✅ |

---

## 3. Technical Decisions & Deviations

- **Vanilla CSS**: All components use pure CSS variables and standard class names. No Tailwind in visualization components.
- **GSAP for Radial Motion**: Used for the convergence map's center node spring bounce and case study profile animations.
- **SVG Ref Management**: Multiple SVG elements managed via `useRef` arrays for performant animation without full re-renders.
- **ArchitectureComparison unspecced**: This component emerged organically during Phase 7 to show funnel vs. orbital gravity well. Should be added to `COMPONENT_SPEC.md`.
- **Annotation Thread confirmed built**: `AnnotationThread.tsx` exists and is fully implemented with GSAP animations, scroll triggers, and reduced-motion support. Was incorrectly marked as unbuilt.
- **React 19 + Vite 8**: Upgraded during Phase 8 for `@react-three/fiber` compatibility and native `<title>`/`<meta>` support in components.

---

## 4. Road Ahead — Phase 12 (TBD)

Open questions to decide the next phase:

- **og:image**: No OG social card image asset exists yet. Requires designing a 1200×630 card. High impact for social sharing — `summary_large_image` Twitter cards show blank without it.
- **Email domain**: `About.tsx` has `mailto:jacklyn@curiosityinc.online` — confirm whether this should be `@curiosityinc.co` to match the website domain.
- **COMPONENT_SPEC.md**: Add ArchitectureComparison spec (it exists, just undocumented).
- **Phase 12 Feature**: No next phase defined yet. Candidates:
  - A fourth case study
  - Lighthouse CI audit (establish baseline score, target 95+)
  - Analytics (Plausible or similar)
  - Full WCAG 2.2 AA manual keyboard pass

---

## 5. Operational Quick-Links

- **Dev Server**: `npm run dev` (localhost:5173 or 5174)
- **Component Proofing**: `/test-components`
- **Binding Specs**: [CLAUDE_CODE_PROMPT_PLAN.md](file:///Users/gingerninja/Sites/claudessetup/docs/CLAUDE_CODE_PROMPT_PLAN.md)
- **Aesthetic Laws**: [VISUAL_LANGUAGE.md](file:///Users/gingerninja/Sites/claudessetup/docs/VISUAL_LANGUAGE.md)
- **Component APIs**: [COMPONENT_SPEC.md](file:///Users/gingerninja/Sites/claudessetup/docs/COMPONENT_SPEC.md)
