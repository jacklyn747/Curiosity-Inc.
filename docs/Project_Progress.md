# Project Progress — Curiosity Inc. Digital Sanctuary

## Current Status

**Phase 7 Complete** — Dan Koe Case Study is fully built. All 5 SCQA acts live. Next up: Phase 8 (WebGL Hero).

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
- **Section 4 — The Library**: Inline article list with 4 deep reading entries; placeholder routes.
- **Section 5 — The Constellation**: ConvergenceMap with CTA ("Request a Curiosity Audit").
- **Routing**: Dan Koe case study live at `/work/dan-koe-brand-architecture`. Other case studies and articles route to placeholder shells.

### Phase 7: Dan Koe Case Study

- **All 5 SCQA Acts complete** in `src/pages/DanKoeCaseStudy.tsx` (976 lines).
  - **Act 01 — Situation / The Profile**: Creator profile card with editorial portrait placeholder, metadata bands (platform, audience size, content format, revenue model).
  - **Act 02 — Situation Continued / The Diagnosis**: Scaffold visualization showing the structural breakdown of content vs. curriculum.
  - **Act 03 — Question / The Orbital Gravity Well**: ArchitectureComparison — side-by-side SVG of Current Funnel Model vs. Proposed Orbital Gravity Well (self-drawing with staggered GSAP).
  - **Act 04 — Answer / The Shift**: Lens (Vesica Piscis with 3.2× LTV multiplier) + DeltaBridge metrics (Repeat Engagement Rate, Content-to-Purchase Velocity, LTV Multiplier).
  - **Act 05 — Answer Continued / The Reflection**: Closing narrative, back-navigation.
- **Extra Component Built**: `ArchitectureComparison` — not in original component spec, emerged from case study needs.

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
| The Annotation Thread | *(not built)* | ❌ Not started | ✅ (in COMPONENT_SPEC.md) |

---

## 3. Technical Decisions & Deviations

- **Vanilla CSS**: All components use pure CSS variables and standard class names. No Tailwind in visualization components.
- **GSAP for Radial Motion**: Used for the convergence map's center node spring bounce and case study profile animations.
- **SVG Ref Management**: Multiple SVG elements managed via `useRef` arrays for performant animation without full re-renders.
- **ArchitectureComparison unspecced**: This component emerged organically during Phase 7 to show funnel vs. orbital gravity well. Should be added to `COMPONENT_SPEC.md`.
- **Annotation Thread unbuilt**: Listed in `COMPONENT_SPEC.md` as Component 5. Never built. Evaluate whether needed for remaining case studies.

---

## 4. Road Ahead

- **Phase 8 — The Hero (WebGL)**
  - Replace placeholder hero text with WebGL particle field → geometry → Phönix morph.
  - Target: `src/pages/index.tsx` hero section (marked with `PHASE 8` comment).
- **Remaining Case Studies**
  - Justin Welsh (`/work/justin-welsh-conversion-design`) — placeholder shell only.
  - Tiago Forte (`/work/tiago-forte-cognitive-interfaces`) — placeholder shell only.
- **Article Pages**
  - All 4 deep reading routes (`/writing/*`) — placeholder shells only.
- **COMPONENT_SPEC.md**
  - Add ArchitectureComparison spec.
  - Decide fate of Annotation Thread.

---

## 5. Operational Quick-Links

- **Dev Server**: `npm run dev` (localhost:5173 or 5174)
- **Component Proofing**: `/test-components`
- **Binding Specs**: [CLAUDE_CODE_PROMPT_PLAN.md](file:///Users/gingerninja/Sites/claudessetup/docs/CLAUDE_CODE_PROMPT_PLAN.md)
- **Aesthetic Laws**: [VISUAL_LANGUAGE.md](file:///Users/gingerninja/Sites/claudessetup/docs/VISUAL_LANGUAGE.md)
- **Component APIs**: [COMPONENT_SPEC.md](file:///Users/gingerninja/Sites/claudessetup/docs/COMPONENT_SPEC.md)
