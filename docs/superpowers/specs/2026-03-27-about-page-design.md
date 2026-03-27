# About Page — Design Spec
**Date:** 2026-03-27
**Route:** `/about`
**Status:** Approved for implementation

---

## Overview

A single-page introduction of Jacklyn Miller and Curiosity Inc. that functions simultaneously as a personal introduction and a company manifesto. The story IS the manifesto — they are not separated.

**Voice:** Warm, direct, conviction-first. Leo rising opens it. Aquarius sun carries the vision. Pisces moon puts the care in.
**Constraint:** The word "argument" never appears anywhere on this page.

---

## Structure — Approach A: The Inciting Observation

Conviction opens cold. Identity follows. Care closes.

### Section 01 — Opening (conviction, no name yet)

**Copy:**
> *Here's what I know:* the difference between content that moves people and content that actually changes them is not talent. It's not reach. It's structure — the kind that universities have been using quietly for decades and the creator world has never been given access to.
>
> I went and got that structure.

**Layout:** Single column, max-width 680px, centered. Generous vertical padding. "Here's what I know:" rendered in Instrument Serif italic (~40px), colored `--insight` (#F72658). Body text in DM Sans 17px. A teal horizontal rule (1px stroke, 56px wide) draws in left-to-right before text appears.

**Animation:** Rule draws left-to-right (0.9s). Pull quote fades + rises on mount. Body stagger 200ms after. No scroll trigger — plays immediately.

---

### Section 02 — The Path (three disciplines)

**Copy — three paragraphs, each labeled:**

**VISUAL ARTS**
> I spent years learning to read structure before I could name it. A frame — like a sentence, like a lesson — is always a decision about *what gets to exist and what doesn't.* The camera taught me to see that before I had the language for it.

**CREATIVE WRITING**
> A degree in creative writing taught me that sequence is a form of care. *The order you give someone information is a decision about what they're ready to hold.* Most people who are trying to teach never think about that second part.

**INSTRUCTIONAL DESIGN**
> The MA gave me the vocabulary for both. I got it specifically because I could see the creator economy heading toward education — with no structural framework following it — and I wanted to be ready when it arrived.

**Layout:** Each discipline has a JetBrains Mono label (9px, uppercase, teal) and a left border (1px, rgba teal). Labels appear first, then paragraph animates in. Stagger 150ms per discipline on ScrollTrigger.

---

### Section 03 — The Reveal (photo + name + closing line)

**Layout:** Two-column. Left: Jacklyn's photo (280px wide, ~340px tall, clip-path reveal from bottom). Right: name + title + one-liner.

**Photo source:** `visual inspo/Jacklyn Miller.HEIC` → convert to `public/jacklyn-miller.webp`

**Copy:**
- Name: *Jacklyn Miller* (Instrument Serif italic, 32px)
- Title: `FOUNDER · CURIOSITY INC.` (JetBrains Mono, 10px, teal)
- Line: "Curiosity Inc. is what I built once I had the words for what I'd been seeing. *The architecture that was missing.*"

**Animation:** Photo clips in from bottom (1s ease). Name fades in 800ms after scroll trigger. Title 1000ms. Rule grows 1100ms. Statement fades in 1200ms.

---

### Section 04 — Who This Is For (direct address)

**Copy:**
> If you're a creator whose work deserves to outlast the algorithm — if you're ready to teach on purpose, not just perform knowledge — this is what we're here for.
>
> *The difference is everything.*

**Layout:** Single column, max-width 560px (narrower — feels more personal). "The difference is everything." in Instrument Serif italic, stands alone. ScrollTrigger fade + rise.

---

### Section 05 — CTA (email only, no form)

**Copy:**
> Start with an email.
> jacklyn@curiosityinc.online

**Layout:** "Start with an email." in DM Sans 14px, muted. Email address as `<a href="mailto:...">` in Instrument Serif italic, ~32px, `--insight` (#F72658), thin underline. No button, no form, no calendar link.

**Animation:** ScrollTrigger fade + rise. Hover: underline brightens.

---

## Technical Requirements

### New files
- `src/pages/About.tsx` — page component, named export: `export const AboutPage: React.FC = ...` (consistent with `AuditRequest` and other page components)
- `src/tests/About.test.tsx` — render, heading text, photo alt, email link
- `public/jacklyn-miller.webp` — converted from HEIC

### Modified files
- `src/App.tsx` — add lazy import and route:
  ```ts
  const AboutPage = lazy(() => import('./pages/About').then(m => ({ default: m.AboutPage })));
  // inside AppRoutes():
  <Route path="/about" element={<AboutPage />} />
  ```
  Follow the exact pattern used for `AuditRequest`.
- `src/components/navigation/Navigation.tsx` — the About entry in `SECTION_LINKS` currently treats About as a hash-scroll target (`#about`). It must be separated from the scroll-based section links. The About entry should become a standalone route link (`/about`) that does **not** participate in the IntersectionObserver active-section tracking. It should always render as `<Link to="/about">` and apply the active class when `location.pathname === '/about'`.
- `scripts/prerender.ts` — add the following entry following the existing `workMeta` pattern:
  ```ts
  {
    path: '/about',
    workMeta: {
      title: 'About — Curiosity Inc.',
      description: 'Jacklyn Miller is the founder of Curiosity Inc. — building the instructional architecture the creator economy was missing.',
    },
  },
  ```

### Photo conversion
Use `ffmpeg` (not `sips` — sips cannot desaturate or output WebP reliably):
```bash
ffmpeg -i "visual inspo/Jacklyn Miller.HEIC" -vf "eq=saturation=0.9" public/jacklyn-miller.webp
```
This converts the HEIC to WebP and applies ~10% desaturation so the photo sits comfortably in the dark palette.

### Routing note
The existing `#about` section on the homepage (ConvergenceMap + quote + audit CTA) stays unchanged. Only the nav "About" link changes: `#about` → `/about`.

---

## Visual Language

Follows the Curiosity Inc. constitution:
- **Colors:** `--void` #1D1E20, `--structure` #3A9EA4, `--transformation` #FA7714, `--insight` #F72658
- **Lines:** 1px only (teal rule in Section 01, discipline borders in Section 02)
- **Motion:** Everything draws itself. Stagger. No typewriter.
- **Fonts:** Instrument Serif italic (display), DM Sans (body), JetBrains Mono (labels/metadata)

---

## Tests (About.test.tsx)

1. Page renders without crashing
2. "Here's what I know" text is present
3. Jacklyn Miller name is present
4. Photo has correct alt text (`"Jacklyn Miller"`)
5. Email link points to `mailto:jacklyn@curiosityinc.online`
6. "The difference is everything" text is present
7. Three discipline labels present (Visual Arts, Creative Writing, Instructional Design)
8. Route `/about` renders the About component — use `MemoryRouter` with `initialEntries={['/about']}` wrapping `<Route path="/about" element={<AboutPage />} />` directly (do not test through `AppRoutes` — consistent with all other page test files in this project)
