# Awwwards Polish — Design Spec
**Date:** 2026-03-28
**Status:** Approved (post-review)

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

## 1. Shared Infrastructure

### `src/context/PageTransitionContext.tsx`

Required to wire the curtain panel (in `App.tsx`) with the navigation hook (in `Navigation.tsx`) without prop drilling.

```ts
interface PageTransitionContextValue {
  triggerTransition: (path: string) => void
}
export const PageTransitionContext = createContext<PageTransitionContextValue>({
  triggerTransition: () => {}
})
```

`<PageTransition />` provides this context. Any component can call `triggerTransition(path)` to start the animation and navigate.

### Lenis instance exposure

Lenis is initialized in `App.tsx` and stored in a module-level ref (not state) so Navigation can call `lenis.scrollTo()` without a React context dependency:

```ts
// src/lib/lenis.ts
export let lenisInstance: Lenis | null = null
export function setLenis(l: Lenis | null) { lenisInstance = l }
```

`App.tsx` calls `setLenis(lenis)` on init and `setLenis(null)` on cleanup.
`Navigation.tsx` replaces `scrollIntoView` / `window.scrollTo` calls with `lenisInstance?.scrollTo(...)`.

---

## 2. New Files

### `src/components/cursor/Cursor.tsx`

A single global cursor component mounted once in `Layout.tsx`.

- Renders two `position: fixed; pointer-events: none; z-index: 9999` divs:
  - `.cursor-dot` — 6px, filled `var(--color-structure)`, moves exactly with pointer via `requestAnimationFrame` + `left/top`
  - `.cursor-ring` — 28px, `1px solid rgba(58,158,164,0.6)`, follows with `transition: left 0.12s ease, top 0.12s ease`
- Hover state: single `mouseover`/`mouseout` listener on `document` checking `e.target.closest('a, button, [role="button"]')`. Adds `.cursor-ring--hover` class which expands ring to 44px and raises opacity to 0.9.
- **Media query guard:** entire component renders `null` when `window.matchMedia('(pointer: coarse)').matches`. Check runs once on mount inside `useState` initializer. This is intentionally static — hybrid pointer devices (e.g. Surface) that switch input types mid-session are not supported and do not need to be.
- `body { cursor: none }` scoped to `@media (pointer: fine)` in `index.css`. Windows High Contrast mode will override this back to system defaults — that is the correct behaviour, no action needed.

### `src/components/preloader/Preloader.tsx`

Full-screen overlay shown once per session.

Props: `onComplete: () => void`

Structure:
```
<div role="status" aria-label="Loading Curiosity Inc." style="position:fixed;inset:0;z-index:2000;background:#1D1E20">
  <svg aria-hidden="true">  ← constellation </svg>
  <span>✦ CURIOSITY INC.</span>
</div>
```

Animation sequence (CSS keyframes + inline `animationDelay`):
- 0.3s — center node (10px, `var(--color-structure)`, glow rings) pops in
- 0.9s–2.5s — 6 outer nodes stagger in (`cubic-bezier(0.34,1.56,0.64,1)` pop)
- Each node's connecting line traces immediately after via `stroke-dasharray` animation
- 0.5s — `✦ CURIOSITY INC.` fades in at bottom
- 3.2s — entire overlay fades out + scales to 1.08 over 0.8s

On animation end: call `onComplete()` via `onAnimationEnd` on the fade-out element (the named keyframe `preloaderFadeOut` applied to the root div at 3.2s). Do NOT use `setTimeout` — it throttles under tab-switching. The `onAnimationEnd` handler checks `e.animationName === 'preloaderFadeOut'` to ignore earlier child animation events bubbling up.

**Reduced motion:** if `prefers-reduced-motion: reduce`, skip all animation and call `onComplete()` in a `useEffect` with 0ms delay.

**Session guard:** `Layout.tsx` is the sole authority on whether to mount `<Preloader>` — it reads `sessionStorage` once and only mounts the component if the session is fresh (see Layout section). `Preloader.tsx` itself has no `sessionStorage` logic. It always renders and always calls `onComplete` when its animation finishes.

`sessionStorage.setItem('preloader_shown', '1')` is called inside `onComplete` in `Layout.tsx` (not inside the Preloader component) to keep concerns separate.

### `src/components/transitions/PageTransition.tsx`

Void curtain component. Provides `PageTransitionContext`.

State:
- `curtainRef` — ref to the panel div
- `timelineRef` — ref to current GSAP timeline (enables kill-on-interrupt)
- Internal `navigate = useNavigate()`

`triggerTransition(path)`:
1. Kill any in-progress timeline: `timelineRef.current?.kill()`
2. Reset curtain to `translateX(-100%)` immediately
3. Create new GSAP timeline:
   - `to(curtain, { x: '0%', duration: 0.55, ease: 'power3.inOut' })` — curtain IN
   - At 0.5s: show `✦` mark with opacity flash
   - At 0.5s: call `navigate(path)` (page loads under curtain)
4. Curtain OUT fires **only when `navigation.state === 'idle'`** (React Router v7):
   ```ts
   // In a useEffect watching navigation.state:
   if (navigation.state === 'idle' && curtainIsIn) {
     gsap.to(curtain, { x: '100%', duration: 0.55, ease: 'power3.inOut',
       onComplete: () => { resetCurtain(); setIsMidTransition(false) }
     })
   }
   ```
   This prevents the curtain from revealing a `PageFallback` skeleton on slow connections.

Panel HTML:
```
<div ref={curtainRef} style="position:fixed;inset:0;z-index:1000;background:#1D1E20;transform:translateX(-100%)">
  <span className="transition-mark">✦</span>  ← centered, teal, opacity toggled
</div>
```

**Navigation hook usage — which links get it:**
- `Navigation.tsx` logo link (when not on homepage) — YES, use `triggerTransition('/')`
- `Navigation.tsx` section anchors (`#work`, `#writing`, `#contact`) — NO, these scroll within the page, leave as `<a href="#">` + lenis.scrollTo()
- `Navigation.tsx` `/about` link — YES, use `triggerTransition('/about')`
- All case study `<Link>` components in `GridReveal.tsx` — YES, replace with `onClick={() => triggerTransition(item.link)}`
- Article `<Link>` components — YES

---

## 3. Modified Files

### `src/App.tsx`

Install Lenis with captured ticker ref for correct cleanup:
```ts
useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const lenis = new Lenis({ lerp: 0.08, duration: 1.2 })
  setLenis(lenis)  // module-level ref
  const tickerFn = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)
  return () => {
    lenis.destroy()
    setLenis(null)
    gsap.ticker.remove(tickerFn)  // same ref captured above
  }
}, [])
```

Mount `<PageTransition />` inside `<Router>` wrapping `<AppRoutes />`.

### `src/components/layout/Layout.tsx`

```tsx
const [preloaderDone, setPreloaderDone] = useState(() => {
  try { return !!sessionStorage.getItem('preloader_shown') }
  catch { return true }
})

function handlePreloaderComplete() {
  try { sessionStorage.setItem('preloader_shown', '1') } catch {}
  setPreloaderDone(true)
}

return (
  <div className="layout-root">
    <Cursor />
    {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
    <a href="#main-content" className="skip-link">Skip to content</a>
    <Navigation />
    <main id="main-content" style={!preloaderDone ? { visibility: 'hidden' } : undefined}>
      {children}
    </main>
    <Footer />
  </div>
)
```

`Layout.tsx` is the sole authority on `sessionStorage` for the preloader. `Preloader.tsx` has no `sessionStorage` logic — it always renders and always fires `onComplete` when done.

### `src/components/visualizations/GridReveal.tsx`

Add to each card `<div>`:
- `onMouseMove`: calculate normalised cursor position within card, apply `perspective(500px) rotateX() rotateY()` (max ±10° / ±12°), update `--sheen-x` and `--sheen-y` CSS custom properties
- `onMouseLeave`: GSAP `to(el, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power2.out' })`
- Add `.card-sheen` child: `position: absolute; inset: 0; background: radial-gradient(circle at var(--sheen-x,50%) var(--sheen-y,50%), rgba(58,158,164,0.08), transparent 60%); opacity: 0; transition: opacity 0.3s; pointer-events: none`
- `onMouseEnter`: set sheen opacity to 1
- Guard: `if (window.matchMedia('(pointer: coarse)').matches) return` before attaching handlers

### `src/index.css`

Changes:
1. Remove `scroll-behavior: smooth` from the `html:focus-within` rule (conflicts with Lenis)
2. Add `@media (pointer: fine) { body { cursor: none; } }`
3. Add `.cursor-dot`, `.cursor-ring`, `.cursor-ring--hover` styles
4. Add `.card-sheen` base styles
5. Add `.transition-mark` styles (centered ✦, teal, hidden by default)

### `src/components/navigation/Navigation.tsx`

- Replace `el.scrollIntoView({ behavior: 'smooth' })` with `lenisInstance?.scrollTo(el)`
- Replace `window.scrollTo({ top: 0, behavior: 'smooth' })` with `lenisInstance?.scrollTo(0)`
- Logo link: if on homepage, scrolls to top via Lenis; if not on homepage, calls `triggerTransition('/')`
- Section anchor links: call `lenisInstance?.scrollTo('#work')` etc. — do NOT use `triggerTransition`
- `/about` link: call `triggerTransition('/about')` via context

---

## 4. Dependency

```bash
npm install lenis
```

Lenis ~3KB gzipped. No other new dependencies.

---

## 5. Testing

### New test files

**`src/tests/Cursor.test.tsx`**
- Renders without crashing
- Returns null when `window.matchMedia('(pointer: coarse)').matches` is true
  - Requires `window.matchMedia` mock: `vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })`

**`src/tests/Preloader.test.tsx`**
- Renders without crashing
- Calls `onComplete` immediately when `prefers-reduced-motion: reduce` is active
- Does NOT call `onComplete` synchronously on first render without reduced motion
- `sessionStorage` is mocked in tests via `vi.stubGlobal`

**`src/tests/PageTransition.test.tsx`**
- Curtain div is present in DOM
- `triggerTransition` does not fire when called with a hash-only path (`#work`)
- Lenis ticker callback is a captured ref (verifiable by checking `gsap.ticker.remove` is called with the same function ref on unmount — mock `gsap.ticker`)

**`src/tests/LenisSetup.test.tsx`**
- `lenis.destroy()` is called when App component unmounts (mock Lenis constructor)
- Lenis is NOT initialised when `prefers-reduced-motion: reduce` is set

---

## 6. Out of Scope

- Scroll-linked parallax effects
- Custom scrollbar styling
- Any changes to page content or copy
- Safari-specific WebGL fixes (separate concern)
- Swipe gesture navigation on mobile
