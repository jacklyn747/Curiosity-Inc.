# WebGL Hero — Design Spec
**Date:** 2026-03-25
**Phase:** 8
**Status:** Approved for implementation

---

## Overview

Replace the placeholder hero text in `src/pages/index.tsx` with a full WebGL particle animation sequence. The hero is the entry point to the Curiosity Loop — it must create the conditions for attention before a single word is read.

**The experience:** Visitor arrives to a dark void with 800 particles drifting slowly. As they scroll, particles coalesce through sacred geometry stages into a radial sphere cluster. Only after the morph completes do the two text lines appear.

---

## Prerequisites (must complete before writing any code)

```bash
# React Three Fiber v9+ is required — v8 declares peer deps on React 16–18 and will fail silently on React 19.2.4
npm install three @react-three/fiber@9 @react-three/drei
```

`three` is already installed (0.183.2). Only r3f v9 and drei need to be added.

Note: r3f v9 uses its own renderer and does NOT call `react-dom/client.createRoot`. This is expected — do not attempt to reconcile with the existing React root.

---

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Renderer | React Three Fiber v9 (r3f) | Fits existing Vite + React 19 stack; component-based; no custom shaders needed |
| Morph technique | GSAP proxy object → manual Float32Array lerp | GSAP cannot tween Float32Arrays directly; proxy pattern is correct approach |
| Trigger behavior | Idle drift on load → scroll-driven morph | Matches blueprint ("ground is silent"); user agency over the reveal |
| Sphere treatment | Implied sphere (radial cluster) | Avoids tech-demo feel; geometry convergence carries the emotional weight |
| Mobile strategy | SVG fallback (touch devices, WebGL failure, reduced motion) | Degraded WebGL worse than intentional fallback; SVG matches existing animation vocabulary |

---

## Component Architecture

### New files — `src/components/hero/`

**`HeroSection.tsx`**
Top-level component. Renders the r3f `<Canvas>` with `<ParticleField>` inside, plus the text overlay as a DOM element positioned over the canvas. Owns the ScrollTrigger setup via `useHeroScroll`. Renders `<HeroFallback>` instead of the canvas when:
- `window.matchMedia('(pointer: coarse)').matches` is true (touch device)
- WebGL context creation fails (caught in r3f's `onCreated` callback)
- `useReducedMotion()` returns true

Unmounts the r3f canvas via IntersectionObserver once the hero section is fully scrolled out of view.

**`ParticleField.tsx`**
The r3f scene. Contains: `<ambientLight>` and a `<points>` mesh. Camera is configured via the `camera` prop on `<Canvas>` in `HeroSection` — no `<PerspectiveCamera>` element inside this component. The `<Canvas>` parent uses `frameloop="demand"` — renders only when `invalidate()` is called. The idle drift `useFrame` callback must call `invalidate()` on every tick to produce visible output under `frameloop="demand"`. Accepts a `progress` prop (0–1) from `HeroSection`.

**`useParticleTargets.ts`**
Hook. Called once on mount. Pre-computes 4 `Float32Array`s of 800×3 positions:
- **Stage 0 (scattered):** Random positions within a sphere of radius 4, seeded for consistency
- **Stage 1 (Fibonacci spiral):** Golden angle distribution across a flat disc
- **Stage 2 (Flower of Life):** 7 overlapping circles, particles distributed on circumferences, radius 2
- **Stage 3 (sphere cluster):** Evenly distributed on a sphere surface, radius 1.8

Also pre-computes a single `colors` Float32Array (800×3 RGB). Index 0 = Teal (#3A9EA4), index 400 = Orange (#FA7714), index 799 = Pink (#F72658), with linear interpolation between. Returns `{ targets: Float32Array[], colors: Float32Array }` (note: `colors` is a single array, not an array of arrays — there is one color gradient shared across all stages). Memoized — never re-calculated.

**`useHeroScroll.ts`**
Hook. Registers a GSAP ScrollTrigger on the hero section with `scrub: 1`, `pin: true`, `end: "+=300%"` (300vh scroll distance). Returns `progress` (0–1).

**Critical:** Must return a cleanup function. The calling `useEffect` must call `trigger.kill()` on unmount to remove the pinned spacer element from the DOM — failure to do so corrupts scroll positions for all sections below (Scaffold, FlowPulse, ConvergenceMap).

**`HeroFallback.tsx`**
Static SVG: 7-circle Flower of Life, Teal strokes, 0.5px, 30% opacity. Draw animation via `stroke-dashoffset`, 1200ms, `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (matches project easing standard from VISUAL_LANGUAGE.md). If `useReducedMotion()` returns true, render SVG fully visible immediately — no draw animation. Text lines appear after draw completes (600ms delay), same copy as desktop.

### Modified files

**`src/pages/index.tsx`** — Two changes required:
1. Remove the `useEffect` hero animation block at lines ~22–38 (targets `.hero-line-1` and `.hero-line-2` class names — these classes will no longer exist after the hero replacement, leaving orphaned GSAP calls that could cause unexpected behavior if those class names are reused inside `HeroSection`).
2. Replace the `<section id="hero">` block (lines ~43–77) with `<HeroSection />`.

The existing `gsap.registerPlugin(ScrollTrigger)` call at line 13 is idempotent and remains unchanged.

---

## Animation Sequence

```
Scroll progress:  0%          30%          60%          85%       100%
                  │            │            │            │           │
Particles:    [drift]──[fibonacci]──[flower-of-life]──[sphere]      │
Colors:                                          [teal→orange→pink] │
Text:                                                         [fade in]
```

**Idle drift (pre-scroll):** Each particle applies a slow sine-wave displacement in `useFrame`:
```
offset.x = sin(time * 0.3 + phase) * 0.3
offset.y = cos(time * 0.2 + phase) * 0.3
```
`phase` is unique per particle (random 0–2π). `useFrame` must call `invalidate()` (from `useThree`) on each tick — required because the canvas runs `frameloop="demand"`.

**Morph — GSAP proxy pattern:**
```
// Correct approach — do NOT tween Float32Array directly
const proxy = { progress: 0 };
gsap.to(proxy, {
  progress: 1,
  onUpdate: () => {
    // manually lerp between stage Float32Arrays
    lerpPositions(geometry, stageA, stageB, proxy.progress);
    geometry.attributes.position.needsUpdate = true;
    invalidate(); // trigger r3f render
  }
});
```
Each stage transition (0→1, 1→2, 2→3) uses its own proxy. The `lerpPositions` helper linearly interpolates the full position array between two Float32Array targets.

**Color transition:** Particles use white (#E8E6E0) by default (progress < 0.6). At progress 0.6–1.0, each particle's color lerps from its index-mapped base color (index 0 = Teal, index 400 = Orange, index 799 = Pink — pre-computed in `useParticleTargets`) toward full saturation. This creates a spatial iridescent sweep across the cluster as it converges. `geometry.attributes.color.needsUpdate = true` must be set alongside position updates.

**Text reveal:** Two `<p>` elements absolutely positioned over the canvas. At scroll progress 85%, line 1 opacity transitions 0→1 (600ms CSS transition). At 90%, line 2 transitions. No GSAP needed — CSS transitions suffice.

---

## Particle System Spec

| Property | Value |
|---|---|
| Count | 800 (desktop) |
| Geometry | `THREE.BufferGeometry` with `position` (Float32Array, 800×3) and `color` (Float32Array, 800×3) |
| Material | `THREE.PointsMaterial`, size: 1.5, vertexColors: true |
| Default color | White (#E8E6E0) — progress < 0.6 |
| Convergence color | Index-mapped Teal→Orange→Pink, lerped in at progress 0.6–1.0 |

---

## Reduced Motion Handling

`useReducedMotion()` (already at `src/hooks/useReducedMotion.ts`) must be checked in `HeroSection.tsx` before mounting the canvas.

- If `true`: render `<HeroFallback />` regardless of device type or WebGL capability
- In `HeroFallback`, if `useReducedMotion()` is true: render SVG fully drawn (no `stroke-dashoffset` animation), text lines fully visible immediately

**Known behavior:** `useReducedMotion()` initializes to `false` on first render and updates to the correct value after the hook's `useEffect` fires. This means a reduced-motion user will see the r3f canvas mount for one tick before `HeroSection` re-renders to `<HeroFallback>`. The WebGL context is created and immediately destroyed. This is acceptable — no content is visible to the user in that window and there is no flash. Do not attempt to mitigate by reading `window.matchMedia` before mount; the existing hook pattern is correct for this project.

---

## Performance Guardrails

- `frameloop="demand"` on `<Canvas>` — renders only when `invalidate()` is explicitly called
- `<AdaptiveDpr>` from `@react-three/drei` — auto-scales pixel ratio if FPS < 30
- Geometry targets pre-computed once on mount (not per frame)
- Canvas unmounted via IntersectionObserver after hero exits viewport
- GSAP ScrollTrigger killed on unmount (`trigger.kill()` in useEffect cleanup)

---

## Mobile Fallback

**Trigger conditions (any one sufficient):**
1. `window.matchMedia('(pointer: coarse)').matches`
2. WebGL context creation fails in r3f's `onCreated` callback
3. `useReducedMotion()` returns true

**Fallback (`HeroFallback.tsx`):**
- 7-circle Flower of Life SVG, Teal strokes, 0.5px, 30% opacity
- `stroke-dashoffset` draw animation: 1200ms, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- If reduced motion: SVG fully visible immediately, no animation
- Text lines appear after draw (600ms delay), opacity transition only
- Max-width 480px, centered

---

## Integration Checklist

- [ ] `npm install @react-three/fiber@9 @react-three/drei` (three already installed)
- [ ] Verify r3f v9 installs without peer dependency warnings against React 19.2.4
- [ ] Remove orphaned GSAP hero animation block from `src/pages/index.tsx` (lines ~22–38)
- [ ] Replace hero section in `src/pages/index.tsx` (lines ~43–77) with `<HeroSection />`
- [ ] Call `ScrollTrigger.refresh()` inside `HeroSection`'s r3f `onCreated` callback (after canvas dimensions are known) — not before, or the pinned spacer height will be calculated incorrectly
- [ ] Confirm `trigger.kill()` called on `HeroSection` unmount
- [ ] Test WebGL fallback: disable hardware acceleration in Chrome DevTools → verify `HeroFallback` renders
- [ ] Test reduced motion: enable in OS accessibility settings → verify static fallback, no animation
- [ ] Test on iOS Safari (WebGL + scroll behavior differs from Chrome)
- [ ] Add `.superpowers/` to `.gitignore`

---

## Out of Scope

- Sound design
- Click/tap interactivity on particles
- Any changes to Navigation, Layout, or sections below the hero
- Custom GLSL shaders
- 3D sphere rotation (implied sphere via radial cluster only)
