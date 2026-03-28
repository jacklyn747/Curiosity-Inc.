# Awwwards Polish — Design Spec
**Date:** 2026-03-28
**Status:** Approved

## Overview

Six presentation-layer features that bring the site to Awwwards submission quality. All features are additive — no existing components are deleted or restructured. One new dependency: `lenis` (~3KB gzipped). GSAP is already installed.

## Decisions Made

| Feature | Choice |
|---|---|
| Page transitions | Void curtain — panel wipes L→R with ✦ center |
| Custom cursor | Dot (6px) + lagging ring (28px), teal |
| Smooth scroll | Lenis, lerp 0.08 |
| Preloader | Constellation draws in over ~3.2s, dissolves |
| Card hover | 3D tilt + teal sheen follows mouse |
| Mobile | All features degrade gracefully on touch/reduced-motion |

---

## 1. New Files

### `src/components/cursor/Cursor.tsx`

A single global cursor component mounted once in `Layout.tsx`.

- Renders two absolutely-positioned divs: `.cursor-dot` (6px, filled `#3A9EA4`) and `.cursor-ring` (28px, `1px solid rgba(58,158,164,0.6)`)
- Both use `position: fixed`, `pointer-events: none`, `z-index: 9999`
- `.cursor-dot` follows `mousemove` exactly via `left/top` style updates in a `requestAnimationFrame` loop
- `.cursor-ring` follows with `transition: left 0.12s ease, top 0.12s ease`
- On hover over any `a`, `button`, `[role="button"]`: ring expands to 44px, lightens to `rgba(58,158,164,0.9)` via a CSS class `.cursor-ring--hover`
- Hover detection: single `mouseover`/`mouseout` listener on `document` checking `e.target.closest('a, button, [role="button"]')`
- Hidden entirely on `@media (pointer: coarse)` — CSS only, no JS check needed
- `body { cursor: none }` added inside a `@media (pointer: fine)` block in `index.css`

### `src/components/preloader/Preloader.tsx`

Full-screen overlay shown once per session.

- `position: fixed; inset: 0; z-index: 2000; background: #1D1E20`
- Props: `onComplete: () => void`
- Renders an SVG constellation matching the ConvergenceMap visual language:
  - Center node (10px, teal, with outer glow rings) appears at 0.3s
  - 6 outer nodes (6px, alternating teal/orange/pink) stagger in from 0.9s–2.5s with `cubic-bezier(0.34,1.56,0.64,1)` pop
  - SVG lines trace from center to each node immediately after each node appears (stroke-dasharray animation)
- `✦ CURIOSITY INC.` in JetBrains Mono 10px, centered at bottom, fades in at 0.5s
- At 3.2s: entire overlay fades out + scales to 1.08 over 800ms, then `onComplete()` fires and component unmounts
- `sessionStorage.setItem('preloader_shown', '1')` written before `onComplete()`
- Respects `prefers-reduced-motion`: if set, skips straight to `onComplete()` after 0ms

### `src/components/transitions/PageTransition.tsx`

Wraps route changes with the void curtain animation.

- Renders a `position: fixed; inset: 0; z-index: 1000; background: #1D1E20` panel, initially `translateX(-100%)`
- Exports a `usePageTransition()` hook that wraps `useNavigate()`:
  - On call: plays curtain IN (GSAP `to({ x: '0%' }, { duration: 0.55, ease: 'power3.inOut' })`)
  - At 50% (0.275s): shows `✦` at center with a quick opacity flash
  - Calls actual `navigate(path)` at 0.5s (page loads underneath)
  - Plays curtain OUT at 0.6s (`to({ x: '100%' }, { duration: 0.55, ease: 'power3.inOut' })`)
  - Resets to `translateX(-100%)` after animation completes
- `Navigation.tsx` links updated to use `usePageTransition()` hook instead of `<Link>` where appropriate
- Back/forward browser navigation does NOT trigger the curtain (only interceptable clicks do)

---

## 2. Modified Files

### `src/App.tsx`

- Install Lenis in a `useEffect` inside `App()`:
  ```ts
  const lenis = new Lenis({ lerp: 0.08, duration: 1.2 })
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return () => { lenis.destroy(); gsap.ticker.remove(...) }
  ```
- Disable Lenis when `prefers-reduced-motion: reduce` is set
- Mount `<PageTransition />` inside `<Router>` but outside `<AppRoutes />`

### `src/components/layout/Layout.tsx`

- Mount `<Cursor />` as first child of `layout-root`
- Mount `<Preloader onComplete={() => setLoaded(true)} />` when `!sessionStorage.getItem('preloader_shown')` and `!loaded`
- When preloader is active, `<main>` has `visibility: hidden` (prevents FOUC, layout is still calculated)

### `src/components/visualizations/GridReveal.tsx`

- Add `onMouseMove` handler to each card `<div>`:
  ```ts
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.transform = `perspective(500px) rotateX(${(y-0.5)*-10}deg) rotateY(${(x-0.5)*12}deg)`
  el.style.setProperty('--sheen-x', `${x*100}%`)
  el.style.setProperty('--sheen-y', `${y*100}%`)
  ```
- Add `onMouseLeave`: reset transform to identity over 400ms (GSAP `to`)
- Add `.card-sheen` child div: `position: absolute; inset: 0; background: radial-gradient(circle at var(--sheen-x) var(--sheen-y), rgba(58,158,164,0.08), transparent 60%); opacity: 0; transition: opacity 0.3s; pointer-events: none`
- On `mouseenter`: set `.card-sheen { opacity: 1 }`
- Guard entire tilt logic with `window.matchMedia('(pointer: coarse)').matches` check — skip on touch

### `src/index.css`

- Add `@media (pointer: fine) { body { cursor: none; } }`
- Add `.cursor-dot` and `.cursor-ring` base styles
- Add `.cursor-ring--hover` expanded state styles
- Add `.card-sheen` base styles

---

## 3. Dependency

```bash
npm install lenis
```

Lenis is a smooth scroll library (~3KB gzipped). No other new dependencies.

---

## 4. Testing

Three new smoke tests in `src/tests/`:

- `Cursor.test.tsx` — renders without crashing; cursor elements not present when `pointer: coarse` media query active
- `Preloader.test.tsx` — renders without crashing; calls `onComplete` immediately when `prefers-reduced-motion: reduce`
- `PageTransition.test.tsx` — renders without crashing; curtain div present in DOM

Existing 70 tests remain unchanged.

---

## 5. Out of Scope

- Scroll-linked parallax effects
- Custom scrollbar styling
- Any changes to page content or copy
- Safari-specific WebGL fixes (separate concern)
