# Project Memory & Workflow Rules

## Project Context
Building the Curiosity Inc. "Digital Sanctuary" for intellectual creators. High-end, modernist, and Awwwards-ready. Curiosity Inc. is a design-led instructional agency for the creator economy — applying adult learning principles to help "accidental educator" creators restructure their content from marketing funnels to identity-shifting learning experiences.

## Guiding Principles

**Spec-Driven Development:** This project is spec-anchored. Refer to `SPEC.md` for architectural decisions and `VISUAL_LANGUAGE.md` for all design and visualization decisions.

**Plan-Act-Reflect:** Propose a modular plan in Plan Mode before executing code. Reflect after each Act to summarize success and blockers.

**Museum Standard:** If an element doesn't serve the intellectual message, it doesn't belong. Prioritize negative space and typographic clarity. 40–60% of any composition should be Curiosity Black (#1D1E20) — silence before signal.

**Accessibility:** WCAG 2.2 AA is a baseline requirement, not an afterthought. See VISUAL_LANGUAGE.md §9 for contrast ratios per color token.

## Visual Design System

All visual decisions are governed by `VISUAL_LANGUAGE.md`. The canonical sources in priority order:

1. `VISUAL_LANGUAGE.md` — The binding design spec. Seven named components, color semantic system, stroke grammar, motion system, substrate layer, typography rules.
2. `SPEC.md` — Architectural and structural decisions.
3. `Curiosity_Inc__Visual_Language__A_Research-Backed_System_in_Seven_Components.md` — Background research. Do not implement directly; use VISUAL_LANGUAGE.md as the implementation source.

**The three laws (from VISUAL_LANGUAGE.md §1):**
1. The ground is silent. #1D1E20 is not a background. It is the absence of noise.
2. Color is earned. Eureka Pink (#F72658) appears only at the point of insight.
3. Everything draws itself. No element appears instantaneously.

**Color tokens:**
- `--color-void`: #1D1E20 — dominant ground
- `--color-structure`: #3A9EA4 — before-state, architecture
- `--color-transformation`: #FA7714 — after-state, energy
- `--color-insight`: #F72658 — eureka moment, CTA (10–15% max)
- `--color-context`: #666–#999 — supporting data, labels

**Seven visualization components** (full specs in VISUAL_LANGUAGE.md §4):
- The Convergence Map — content architecture, system maps
- The Delta Bridge — before/after transformation metrics
- The Scaffold — learning progression, methodology stages
- The Flow Pulse — audience behavior, engagement flows
- The Annotation Thread — time-series narratives
- The Grid Reveal — comparative analysis
- The Lens — hero statistics, singular insight callouts

**Visual verification standard:** Audit all UI against VISUAL_LANGUAGE.md and the 20-image inspiration set (images numbered in §7 reference map). Primary references: Image 3 (Tufte — master aesthetic standard), Image 4 (convergence hourglass — color + geometry), Image 14 (Scaffold cone — mastery visualization), Image 20 (Lemniscate — The Lens in motion).

## Tech Stack & Commands

**Framework:** Vite + React + TypeScript  
**Dev:** `npm run dev` | **Build:** `npm run build` | **Test:** `npm test`

**Animation stack:** GSAP + ScrollTrigger (primary), D3.js transitions (data-driven), Framer Motion / Motion (React layer), CSS scroll-driven animations (native, simple cases), WebGL/Three.js (hero section only)

**Self-drawing lines:** SVG `stroke-dasharray` / `stroke-dashoffset` pattern throughout. All primary data elements draw themselves — no exceptions.

## Code Style

**Structure:** Functional components with CSS Variables mapped directly to design tokens from VISUAL_LANGUAGE.md §2.

**Types:** Strict TypeScript; no `any` types.

**Animation rule:** Every animation serves narrative or comprehension. If it cannot be justified against VISUAL_LANGUAGE.md §6, remove it.

**Motion values:**
- Primary easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Stagger base: 80ms
- Spring: stiffness 200, damping 20
- `prefers-reduced-motion`: static fully-drawn fallback required on all components

## Operational Boundaries

- Keep `CLAUDE.md` and `SPEC.md` under 200 lines to maintain context accuracy.
- Use the "One Thumb, One Eyeball" test for all mobile implementations.
- Never install dependencies without confirmation.
- Substrate textures (zentangle/sacred geometry): 8–12% opacity maximum, 0.3–0.5px stroke, #E8E6E0 only. See VISUAL_LANGUAGE.md §5.