# Project Memory & Workflow Rules — Curiosity Inc
> Last updated: 2026-03-31

---

## Project Context

Curiosity Inc. is a **Learning Experience Design (LXD) consultancy** for intellectual content creators — the first to bring a 40-year-old discipline (LXD) from corporate training/academia into the creator economy.

**The site IS the proof.** It must demonstrate LXD principles by how it's experienced, not just describe them in copy. No funnel logic, no manipulative language, no corporate hedging.

**The client:** Jacklyn Miller — street smart, speaks fluent nerd. The site represents her as a person, not a pitch deck. The voice is a blend of Ash Ambirge, Harry Dry, and Shia LaBeouf's unguarded directness.

---

## Narrative Architecture

The site runs a single argument in 5 acts:

| Act | Section | Goal |
|---|---|---|
| 1 | Hero | Feel seen immediately |
| 2 | THE HONEST PART + Scaffold | Validate the frustration, name the gap |
| 3 | THE THING NOBODY TOLD YOU | Drop the curtain — reveal LXD |
| 4 | THE WORK | Proof — structural diagnoses, not case studies |
| 5 | THE DOOR | Invitation to conversation, not a funnel |

**Not a funnel. A revelation.**

---

## Guiding Principles

**Respect the viewer's time above all else.**
Not one word that doesn't earn its place. The point is the first thing. Everything else is support.

**No numbers in micro-copy.**
Sections are never `01 · 02 · 03`. Typography hierarchy does this work — size, weight, color.

**One accent color per section.**
The 9-color palette is a system, not a buffet. Each section gets one accent. No mixing.

**The site must be the example.**
The experience of visiting should feel categorically different from every marketing site they've ever seen. They should feel it before they can name it.

---

## Color System

| Color | Hex | Name | Role |
|---|---|---|---|
| ⬛ | `#1D1D1B` | Muted Black / Void | All backgrounds |
| 🟫 | `#EAE4DA` | Seashell | All primary text |
| 🟡 | `#EAC119` | Mustard | Energy — section headers, "I see you" moments |
| 🟠 | `#ED773C` | Tangerine | Urgency — CTAs, transformative statements, hero accent |
| 🟣 | `#808BC5` | Lavender | Thinking — cerebral sections, writing, constellation |
| 🟢 | `#245E55` | Tea | Method — how we work, structure, architecture |
| 🩷 | `#EAA7C7` | Pink Quartz | Human — empathy moments, testimonials |
| 🩵 | `#9ED6DF` | Sky | Clarity — used when the answer arrives |
| 🔴 | `#C63F3E` | Red Passion | Conviction — the one statement of no return per page |

**CSS tokens in `src/index.css`:**
- `--color-void`: `#1D1D1B`
- `--color-text`: `#EAE4DA`
- `--color-accent`: `#ED773C` (tangerine)
- `--color-energy`: `#EAC119` (mustard)
- `--color-intellect`: `#808BC5` (lavender)
- `--color-structure`: `#3A9EA4` (legacy teal — deprecated, being phased out)
- `--color-transformation`: `#ED773C` (mapped to tangerine)

---

## Typography Rules

| Role | Minimum | Font | Style |
|---|---|---|---|
| Body / paragraph | `20px` | DM Sans or Instrument Serif | Normal, 1.7 line-height |
| Labels / eyebrows | `12px` | JetBrains Mono | Uppercase, 0.18em tracked |
| Section headers | `52px` | Instrument Serif | Italic |
| Page headlines | `80px` | Instrument Serif | Italic |
| Hero | `clamp(64px, 9vw, 150px)` | Instrument Serif | Italic |

**The "gong" rule:** One thing on every page that is unmissably large. The hero headline is the hero's gong.

---

## Voice Rules

**Not** corporate: ~~"We leverage behavioral science frameworks..."~~
**Not** dumbed-down: ~~"Want your audience to learn? Here's a tip!"~~
**Exactly this:** *"Your audience can tell the difference between content that performs and content that changes them. Most of it just performs. Let's fix that."*

Voice principles:
1. Name the thing they already know but haven't said out loud
2. Never explain what you're about to say — just say it
3. Short sentences earn the long ones
4. Confident ≠ arrogant — confidence is specific
5. Billboard test: if it needs a footnote, rewrite it

---

## Tech Stack

**Framework:** Vite + React 19 + TypeScript (strict)
**Styling:** Tailwind utility classes + CSS custom properties (no Tailwind in visualization components)
**Animations:** GSAP + ScrollTrigger (primary), CSS transitions (micro-interactions)
**3D / particles:** Three.js + @react-three/fiber (hero only, lazy-loaded)
**Routing:** React Router v6 with SSG prerender script

**Commands:**
- Dev: `npm run dev`
- Build + prerender: `npm run build`
- Test: `npm test`

**Deployment:** Vercel (auto-deploy on push to `main`)
**Repos:** `jacklyn747/Curiosity-Inc.` (GitHub) + `jacklyn747/curiosityinc.online` (mirror)
**Live URL:** https://curiosityinc.online

---

## Component Library (current state)

| Component | File | Status |
|---|---|---|
| Scaffold | `Scaffold.tsx` | ✅ Sticky-stack bands — numbers removed, accent line+dot marker |
| FlowPulse | `FlowPulse.tsx` | ✅ Funnel vs. LXD comparison visualization |
| HorizontalGallery | `HorizontalGallery.tsx` | ✅ Pin-scroll case study cards — header embedded |
| ConvergenceMap | `ConvergenceMap.tsx` | ✅ Radial discipline constellation |
| DeltaBridge | `DeltaBridge.tsx` | ✅ Before/after metrics |
| Lens | `Lens.tsx` | ✅ Vesica Piscis callout |
| GridReveal | `GridReveal.tsx` | ✅ Comparative grid |
| ArchitectureComparison | `ArchitectureComparison.tsx` | ✅ Funnel vs. orbital gravity |
| AnnotationThread | `AnnotationThread.tsx` | ✅ Time-series narrative |
| HeroSection | `HeroSection.tsx` | ✅ Particle field + GSAP text animation |
| Navigation | `Navigation.tsx` | ✅ Anchor-link + entrance choreography |
| CustomCursor | `CustomCursor.tsx` | ✅ Magnetic + site-wide signature |
| Marquee | `Marquee.tsx` | ✅ Section divider |

---

## Open Issues (as of 2026-03-30)

### 🔴 In progress — Awwwards Phase Audit

Working through the Awwwards Playbook phase by phase:

| Phase | Status | Notes |
|---|---|---|
| Phase 0 — What Wins | ✅ Audited | Dead zone identified and fixed |
| Phase 1 — Strategic Discovery | ✅ Audited | Hero subtitle rewritten to match experience thesis |
| Phase 2 — Conceptual Direction | ✅ Completed | Signature Cursor implemented |
| Phase 3-6 — Visual Development | ✅ Completed | Grid Architectural migration done |
| Phase 7 — Motion & Interaction | ✅ Completed | Atmosphere + Magnetic interactions |
| Phase 8-10 — Systems & Layout | ✅ Completed | Refinement of Component density |
| Phase 11 — Polish & Refinement | ✅ Completed | Magnetic CTAs + Performance |
| Phase 12 — Pre-Launch Audit | 🟡 In Progress | Final SEO/Meta check |
| Phase 8-10 — Systems & Layout | ✅ Completed | Refinement of Component density |
| Phase 11 — Polish & Refinement | ✅ Completed | Magnetic CTAs + Performance |
| Phase 12 — Pre-Launch Audit | 🟡 In Progress | Final SEO/Meta check |

**Fixes applied this session:**
- `Scaffold.tsx`: Removed `01 02 03` numbers → replaced with accent line + dot marker
- `Scaffold.tsx`: `marginBottom` cut 50vh → 5vh (eliminates ~4-screen dead scroll zone)
- `HorizontalGallery.tsx`: Tightened pin scrub 3000 → 2000px; embedded section header inside pin zone
- `HeroSection.tsx`: Subtitle rewritten — "There's a name for what you should have been doing. Nobody brought it to you until now."
- `index.tsx`: Removed now-redundant THE WORK section header (moved inside gallery)

### 🟠 Pending fixes

- **Three.js bundle:** Chunk > 500kB — already lazy-loaded but worth monitoring Lighthouse.
- **Favicon:** Standard favicon.svg is 9kB, check if .ico is needed for legacy.

### 🟡 Known stale docs (prior to this update)
- `HOMEPAGE_COPY.md` — ✅ Updated this session
- `Project_Memory___Workflow_Rules.md` — ✅ Updated this session (this file)
- `Project_Progress.md` — ✅ Updated this session

---

## Operational Boundaries

- Never install dependencies without confirmation
- No numbered micro-copy anywhere on the site (no 01, 02, 03)
- No funnel language (no "convert", no "nurture sequences", no "lead magnet")
- No teal (`#3A9EA4`) in new UI — it's a legacy token being phased out
- `prefers-reduced-motion` must be respected by every animated component
- Body text floor: 20px minimum, no exceptions