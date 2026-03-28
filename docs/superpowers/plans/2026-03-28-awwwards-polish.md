# Awwwards Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six presentation-layer features — Lenis smooth scroll, custom cursor, constellation preloader, void-curtain page transitions, 3D card hover, and mobile graceful degradation — to bring the site to Awwwards submission quality.

**Architecture:** Lenis is initialised once in App.tsx via a module-level singleton (`src/lib/lenis.ts`) so any component can access the scroll instance without React context. Page transitions use a React context (`PageTransitionContext`) provided by a `PageTransition` wrapper component that renders the curtain panel and exposes `triggerTransition(path)`. Cursor and Preloader are mounted once in Layout.tsx, with Layout as the sole sessionStorage authority for the preloader once-per-session guard.

**Tech Stack:** React 19, GSAP 3.14 (already installed), Lenis (new ~3KB dep), React Router v7, CSS keyframes for preloader animation, Vitest + React Testing Library for tests.

---

## Chunk 1: Foundation — Lenis Singleton + App.tsx Wiring

### Task 1: Install Lenis

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install the package**

```bash
cd /Users/gingerninja/Sites/claudessetup
npm install lenis
```

Expected: `added 1 package` with no errors. `lenis` appears in `package.json` dependencies.

- [ ] **Step 2: Verify install**

```bash
node -e "import('lenis').then(m => console.log('ok', typeof m.default))"
```

Expected output: `ok function`

---

### Task 2: Create the Lenis singleton module

**Files:**
- Create: `src/lib/lenis.ts`

- [ ] **Step 1: Write the module**

Create `src/lib/lenis.ts` with this exact content:

```ts
// src/lib/lenis.ts
// Module-level singleton — no React context needed for scroll calls.
// App.tsx calls setLenis(instance) on init and setLenis(null) on cleanup.
import type Lenis from 'lenis';

export let lenisInstance: Lenis | null = null;

export function setLenis(l: Lenis | null): void {
  lenisInstance = l;
}
```

---

### Task 3: Write the LenisSetup tests (failing first)

**Files:**
- Create: `src/tests/LenisSetup.test.tsx`

- [ ] **Step 1: Write the test file**

Create `src/tests/LenisSetup.test.tsx`:

```tsx
// src/tests/LenisSetup.test.tsx
import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// ---------- mocks (declared before any imports of tested modules) ----------

const destroyMock = vi.fn();
const rafMock = vi.fn();
const LenisMock = vi.fn().mockImplementation(() => ({
  destroy: destroyMock,
  raf: rafMock,
}));

vi.mock('lenis', () => ({ default: LenisMock }));

const tickerAddMock = vi.fn();
const tickerRemoveMock = vi.fn();
const tickerLagMock = vi.fn();

vi.mock('gsap', () => ({
  default: {
    ticker: {
      add: tickerAddMock,
      remove: tickerRemoveMock,
      lagSmoothing: tickerLagMock,
    },
  },
}));

// Mock all heavy child components so the App tree renders in jsdom
vi.mock('../components/hero/HeroSection', () => ({
  HeroSection: () => <div />,
}));
vi.mock('../components/hero/ParticleField', () => ({
  ParticleField: () => <div />,
}));

// Import App AFTER mocks are in place
import App from '../App';

// ---------- tests ----------

describe('LenisSetup', () => {
  beforeEach(() => {
    destroyMock.mockClear();
    LenisMock.mockClear();
    tickerAddMock.mockClear();
    tickerRemoveMock.mockClear();
    // Default: reduced-motion OFF
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  it('calls lenis.destroy() when App unmounts', async () => {
    let unmount!: () => void;
    await act(async () => {
      const result = render(<App />);
      unmount = result.unmount;
    });
    await act(async () => { unmount(); });
    expect(destroyMock).toHaveBeenCalledOnce();
  });

  it('does not initialise Lenis when prefers-reduced-motion is set', async () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    await act(async () => { render(<App />); });
    expect(LenisMock).not.toHaveBeenCalled();
  });

  it('passes the same function ref to gsap.ticker.add and .remove', async () => {
    let unmount!: () => void;
    await act(async () => {
      const result = render(<App />);
      unmount = result.unmount;
    });
    await act(async () => { unmount(); });
    expect(tickerAddMock).toHaveBeenCalledOnce();
    expect(tickerRemoveMock).toHaveBeenCalledOnce();
    // Critical: remove must receive the exact same ref that was passed to add
    const addedFn = tickerAddMock.mock.calls[0][0];
    const removedFn = tickerRemoveMock.mock.calls[0][0];
    expect(addedFn).toBe(removedFn);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (App.tsx not yet updated)**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/LenisSetup.test.tsx
```

Expected: tests fail because App.tsx has no Lenis setup yet.

---

### Task 4: Update App.tsx — add Lenis init + PageTransition mount

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Read current App.tsx (already done in plan prep)**

- [ ] **Step 2: Replace App.tsx with Lenis + PageTransition wiring**

Replace the full contents of `src/App.tsx`:

```tsx
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { setLenis } from './lib/lenis';
import { Layout } from './components/layout/Layout';
import { PageTransition } from './components/transitions/PageTransition';

// Code-split all routes — Three.js and heavy case studies stay out of the main bundle
const HomePage        = lazy(() => import('./pages/index').then(m => ({ default: m.HomePage })));
const CaseStudyPage   = lazy(() => import('./pages/index').then(m => ({ default: m.CaseStudyPage })));
const ArticlePage     = lazy(() => import('./pages/ArticlePage').then(m => ({ default: m.ArticlePage })));
const NotFoundPage    = lazy(() => import('./pages/index').then(m => ({ default: m.NotFoundPage })));
const TestComponents  = lazy(() => import('./pages/TestComponents').then(m => ({ default: m.TestComponents })));
const AuditRequest    = lazy(() => import('./pages/AuditRequest').then(m => ({ default: m.AuditRequest })));
const AboutPage       = lazy(() => import('./pages/About').then(m => ({ default: m.AboutPage })));

// Minimal loading fallback — void screen, no flash
function PageFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-void)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Loading"
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          color: 'var(--color-context-dim)',
          textTransform: 'uppercase',
        }}
      >
        ✦
      </span>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/"                element={<HomePage />} />
          <Route path="/audit"           element={<AuditRequest />} />
          <Route path="/about"           element={<AboutPage />} />
          <Route path="/test-components" element={<TestComponents />} />
          <Route path="/work/:slug"      element={<CaseStudyPage />} />
          <Route path="/writing/:slug"   element={<ArticlePage />} />
          <Route path="*"               element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.08, duration: 1.2 });
    setLenis(lenis);

    // Capture tickerFn in a const so the SAME ref is passed to both add and remove
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      setLenis(null);
      gsap.ticker.remove(tickerFn);
    };
  }, []);

  return (
    <Router>
      {/* PageTransition wraps AppRoutes so its context is available to all children */}
      <PageTransition>
        <AppRoutes />
      </PageTransition>
    </Router>
  );
}

export default App;
```

- [ ] **Step 3: Run the Lenis tests — expect PASS (or fail only on missing PageTransition import)**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/LenisSetup.test.tsx
```

At this point the test may fail because `PageTransition` doesn't exist yet. That is expected — we'll create it in Chunk 5. The Lenis logic itself is correct.

- [ ] **Step 4: Commit the foundation**

```bash
cd /Users/gingerninja/Sites/claudessetup
git add src/lib/lenis.ts src/App.tsx src/tests/LenisSetup.test.tsx
git commit -m "feat: add Lenis singleton and App.tsx wiring for smooth scroll"
```

---

## Chunk 2: CSS Infrastructure

### Task 5: Update src/index.css

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Remove `scroll-behavior: smooth` from the `html:focus-within` rule**

Find this block in `src/index.css`:
```css
html:focus-within {
  scroll-behavior: smooth;
}
```

Replace with:
```css
html:focus-within {
  /* scroll-behavior removed — Lenis handles smooth scroll globally */
}
```

- [ ] **Step 2: Add cursor suppression for fine-pointer devices**

After the `body { ... }` block, add:

```css
/* Hide native cursor on fine-pointer (mouse) devices — custom cursor replaces it */
@media (pointer: fine) {
  body {
    cursor: none;
  }
}
```

- [ ] **Step 3: Add cursor component styles**

Append to the end of `src/index.css`:

```css
/* ── Custom Cursor ─────────────────────────────────────────────────────── */

.cursor-dot {
  position: fixed;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-structure);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  will-change: left, top;
}

.cursor-ring {
  position: fixed;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(58, 158, 164, 0.6);
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: left 0.12s ease, top 0.12s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
  will-change: left, top;
}

.cursor-ring--hover {
  width: 44px;
  height: 44px;
  border-color: rgba(58, 158, 164, 0.9);
}

/* ── Card Sheen ─────────────────────────────────────────────────────────── */

.card-sheen {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--sheen-x, 50%) var(--sheen-y, 50%),
    rgba(58, 158, 164, 0.08),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  border-radius: inherit;
}

/* ── Page Transition Mark ───────────────────────────────────────────────── */

.transition-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-mono);
  font-size: 24px;
  color: var(--color-structure);
  opacity: 0;
  pointer-events: none;
  user-select: none;
}

.transition-mark--visible {
  opacity: 1;
}

/* ── Skip Link ──────────────────────────────────────────────────────────── */

.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: var(--color-structure);
  color: var(--color-void);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
  z-index: 10000;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 1rem;
}
```

- [ ] **Step 4: Verify the site still compiles**

```bash
cd /Users/gingerninja/Sites/claudessetup && npm run build 2>&1 | tail -20
```

Expected: build succeeds (may show bundle size info, no errors).

- [ ] **Step 5: Commit CSS changes**

```bash
cd /Users/gingerninja/Sites/claudessetup
git add src/index.css
git commit -m "feat: add cursor, card sheen, and transition-mark CSS; remove scroll-behavior"
```

---

## Chunk 3: Cursor Component

### Task 6: Write Cursor tests (failing first)

**Files:**
- Create: `src/tests/Cursor.test.tsx`

- [ ] **Step 1: Write the test file**

Create `src/tests/Cursor.test.tsx`:

```tsx
// src/tests/Cursor.test.tsx
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Cursor', () => {
  beforeEach(() => {
    // Default: fine pointer (mouse) — component should render
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  it('renders dot and ring elements on fine-pointer devices', async () => {
    const { Cursor } = await import('../components/cursor/Cursor');
    const { container } = render(<Cursor />);
    expect(container.querySelector('.cursor-dot')).toBeInTheDocument();
    expect(container.querySelector('.cursor-ring')).toBeInTheDocument();
  });

  it('returns null on coarse-pointer (touch) devices', async () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true, // coarse pointer
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    const { Cursor } = await import('../components/cursor/Cursor');
    const { container } = render(<Cursor />);
    expect(container.querySelector('.cursor-dot')).not.toBeInTheDocument();
    expect(container.querySelector('.cursor-ring')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL (component doesn't exist yet)**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/Cursor.test.tsx
```

Expected: FAIL with "Cannot find module '../components/cursor/Cursor'".

---

### Task 7: Create Cursor.tsx

**Files:**
- Create: `src/components/cursor/Cursor.tsx`

- [ ] **Step 1: Create the directory and component**

Create `src/components/cursor/Cursor.tsx`:

```tsx
// src/components/cursor/Cursor.tsx
// Global custom cursor — dot that tracks exactly, ring that lags behind.
// Renders null on coarse-pointer (touch) devices. Check is static on mount —
// hybrid devices that switch input mid-session are not supported by design.
import { useState, useEffect, useRef } from 'react';

export function Cursor() {
  // Static check on mount — no re-render needed if pointer type changes
  const [isCoarse] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse)').matches
      : true
  );

  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCoarse) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        dot.style.left  = e.clientX + 'px';
        dot.style.top   = e.clientY + 'px';
        ring.style.left = e.clientX + 'px';
        ring.style.top  = e.clientY + 'px';
      });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, [role="button"]')) {
        ring.classList.add('cursor-ring--hover');
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, [role="button"]')) {
        ring.classList.remove('cursor-ring--hover');
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [isCoarse]);

  if (isCoarse) return null;

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
```

- [ ] **Step 2: Run Cursor tests — expect PASS**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/Cursor.test.tsx
```

Expected: 2 tests pass.

---

### Task 8: Mount Cursor in Layout.tsx (partial update — preloader wired in Task 11)

**Files:**
- Modify: `src/components/layout/Layout.tsx`

- [ ] **Step 1: Add Cursor import and mount**

Replace the full contents of `src/components/layout/Layout.tsx`:

```tsx
import React from 'react';
import { Navigation } from '../navigation/Navigation';
import { Footer } from '../footer/Footer';
import { Cursor } from '../cursor/Cursor';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-root">
      {/* Global custom cursor — renders null on touch devices */}
      <Cursor />

      {/* Skip-to-content — hidden until focused */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Navigation Layer */}
      <Navigation />

      {/* Main content */}
      <main id="main-content">
        {children}
      </main>

      {/* Footer Layer */}
      <Footer />
    </div>
  );
}
```

> **Note:** Preloader state and sessionStorage guard are added in Task 11 once `Preloader.tsx` exists. Keeping them out here avoids unused-variable TypeScript errors.

- [ ] **Step 2: Run full test suite to confirm nothing broken**

```bash
cd /Users/gingerninja/Sites/claudessetup && npm test 2>&1 | tail -20
```

Expected: all previously-passing tests still pass, 2 new Cursor tests pass.

- [ ] **Step 3: Commit**

```bash
cd /Users/gingerninja/Sites/claudessetup
git add src/components/cursor/Cursor.tsx src/components/layout/Layout.tsx src/tests/Cursor.test.tsx
git commit -m "feat: add custom cursor component and mount in Layout"
```

---

## Chunk 4: Preloader Component

### Task 9: Write Preloader tests (failing first)

**Files:**
- Create: `src/tests/Preloader.test.tsx`

- [ ] **Step 1: Write the test file**

Create `src/tests/Preloader.test.tsx`:

```tsx
// src/tests/Preloader.test.tsx
import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Preloader', () => {
  beforeEach(() => {
    // Default: no reduced motion
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  it('renders the loading overlay with correct role', async () => {
    const { Preloader } = await import('../components/preloader/Preloader');
    const { getByRole } = render(<Preloader onComplete={vi.fn()} />);
    expect(getByRole('status')).toBeInTheDocument();
  });

  it('renders the constellation SVG', async () => {
    const { Preloader } = await import('../components/preloader/Preloader');
    const { container } = render(<Preloader onComplete={vi.fn()} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('calls onComplete immediately (in next tick) when prefers-reduced-motion is set', async () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true, // reduced motion
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    const { Preloader } = await import('../components/preloader/Preloader');
    const onComplete = vi.fn();
    await act(async () => {
      render(<Preloader onComplete={onComplete} />);
    });
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('does NOT call onComplete synchronously on first render without reduced motion', async () => {
    const { Preloader } = await import('../components/preloader/Preloader');
    const onComplete = vi.fn();
    render(<Preloader onComplete={onComplete} />);
    expect(onComplete).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/Preloader.test.tsx
```

Expected: FAIL with "Cannot find module '../components/preloader/Preloader'".

---

### Task 10: Create Preloader.tsx

**Files:**
- Create: `src/components/preloader/Preloader.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/preloader/Preloader.tsx`:

```tsx
// src/components/preloader/Preloader.tsx
// Full-screen constellation preloader. Shown once per session (Layout decides whether to mount).
// This component has NO sessionStorage logic — it always renders and always calls onComplete.
// Animation: CSS keyframes. Completion: onAnimationEnd on named keyframe 'preloaderFadeOut'.
// Reduced motion: calls onComplete immediately via useEffect with 0ms delay.
import { useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Reduced motion: skip animation, complete immediately
  useEffect(() => {
    if (!prefersReducedMotion) return;
    const id = setTimeout(onComplete, 0);
    return () => clearTimeout(id);
  }, [prefersReducedMotion, onComplete]);

  // Fires on each animationend event that bubbles to the root div.
  // Only act when the final fadeout keyframe completes.
  function handleAnimationEnd(e: React.AnimationEvent<HTMLDivElement>) {
    if (e.animationName === 'preloaderFadeOut') {
      onComplete();
    }
  }

  return (
    <div
      role="status"
      aria-label="Loading Curiosity Inc."
      onAnimationEnd={handleAnimationEnd}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'var(--color-void)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: prefersReducedMotion ? 'none' : 'preloaderFadeOut 0.8s 3.2s ease forwards',
      }}
    >
      {/* Constellation SVG — lines draw via stroke-dasharray animation */}
      <svg
        aria-hidden="true"
        viewBox="0 0 180 180"
        width="180"
        height="180"
        style={{ position: 'absolute', overflow: 'visible' }}
      >
        <style>{`
          .c-line {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
          }
          .l1 { animation: lIn 0.7s 1.1s ease forwards; }
          .l2 { animation: lIn 0.7s 1.5s ease forwards; }
          .l3 { animation: lIn 0.7s 1.8s ease forwards; }
          .l4 { animation: lIn 0.7s 2.1s ease forwards; }
          .l5 { animation: lIn 0.7s 2.4s ease forwards; }
          .l6 { animation: lIn 0.7s 2.7s ease forwards; }
          @keyframes lIn { to { stroke-dashoffset: 0; } }

          .c-node {
            opacity: 0;
          }
          .n-center { animation: nIn 0.6s 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          .n1 { animation: nIn 0.5s 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          .n2 { animation: nIn 0.5s 1.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          .n3 { animation: nIn 0.5s 1.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          .n4 { animation: nIn 0.5s 1.9s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          .n5 { animation: nIn 0.5s 2.2s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          .n6 { animation: nIn 0.5s 2.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          @keyframes nIn {
            from { opacity: 0; transform: translate(-50%,-50%) scale(0); }
            to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          }
        `}</style>

        {/* Lines — center to each outer node */}
        <line x1="90" y1="90" x2="140" y2="27"  stroke="rgba(250,119,20,0.45)"  strokeWidth="0.8" className="c-line l1"/>
        <line x1="90" y1="90" x2="166" y2="104" stroke="rgba(247,38,88,0.45)"   strokeWidth="0.8" className="c-line l2"/>
        <line x1="90" y1="90" x2="112" y2="166" stroke="rgba(58,158,164,0.45)"  strokeWidth="0.8" className="c-line l3"/>
        <line x1="90" y1="90" x2="40"  y2="148" stroke="rgba(250,119,20,0.45)"  strokeWidth="0.8" className="c-line l4"/>
        <line x1="90" y1="90" x2="14"  y2="76"  stroke="rgba(247,38,88,0.45)"   strokeWidth="0.8" className="c-line l5"/>
        <line x1="90" y1="90" x2="58"  y2="18"  stroke="rgba(58,158,164,0.45)"  strokeWidth="0.8" className="c-line l6"/>

        {/* Nodes — rendered as SVG circles with CSS animation */}
        <circle cx="90"  cy="90"  r="5"  fill="#3A9EA4" filter="url(#glow)" className="c-node n-center" style={{ transformOrigin: '90px 90px' }} />
        <circle cx="140" cy="27"  r="3"  fill="#FA7714" className="c-node n1" style={{ transformOrigin: '140px 27px' }}  />
        <circle cx="166" cy="104" r="3"  fill="#F72658" className="c-node n2" style={{ transformOrigin: '166px 104px' }} />
        <circle cx="112" cy="166" r="3"  fill="#3A9EA4" className="c-node n3" style={{ transformOrigin: '112px 166px' }} />
        <circle cx="40"  cy="148" r="3"  fill="#FA7714" className="c-node n4" style={{ transformOrigin: '40px 148px' }}  />
        <circle cx="14"  cy="76"  r="3"  fill="#F72658" className="c-node n5" style={{ transformOrigin: '14px 76px' }}   />
        <circle cx="58"  cy="18"  r="3"  fill="#3A9EA4" className="c-node n6" style={{ transformOrigin: '58px 18px' }}   />

        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      </svg>

      {/* Brand label — fades in, then fades out with the overlay */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          animation: prefersReducedMotion
            ? 'none'
            : 'lblIn 0.6s 0.5s ease forwards, preloaderFadeOut 0.8s 3.2s ease forwards',
          opacity: 0,
        }}
      >
        ✦ CURIOSITY INC.
      </span>

      {/* Keyframes — defined here (not inside the SVG style tag) to avoid SVG scoping issues */}
      <style>{`
        @keyframes lblIn { to { opacity: 1; } }
        @keyframes preloaderFadeOut { to { opacity: 0; transform: scale(1.08); } }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Run Preloader tests — expect PASS**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/Preloader.test.tsx
```

Expected: 4 tests pass.

---

### Task 11: Complete Layout.tsx — wire up Preloader

**Files:**
- Modify: `src/components/layout/Layout.tsx`

- [ ] **Step 1: Replace Layout.tsx with the fully wired version**

Replace the full contents of `src/components/layout/Layout.tsx`:

```tsx
import React, { useState } from 'react';
import { Navigation } from '../navigation/Navigation';
import { Footer } from '../footer/Footer';
import { Cursor } from '../cursor/Cursor';
import { Preloader } from '../preloader/Preloader';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Preloader guard — Layout is the sole authority on sessionStorage for the preloader.
  // Initialised in useState lazy initializer (runs once, synchronous, no useEffect needed).
  // try/catch handles SSR / private-browsing sessionStorage restrictions.
  const [preloaderDone, setPreloaderDone] = useState(() => {
    try {
      return !!sessionStorage.getItem('preloader_shown');
    } catch {
      return true; // If storage is unavailable, skip the preloader
    }
  });

  function handlePreloaderComplete() {
    try {
      sessionStorage.setItem('preloader_shown', '1');
    } catch { /* storage unavailable — ignore */ }
    setPreloaderDone(true);
  }

  return (
    <div className="layout-root">
      {/* Global custom cursor — renders null on touch devices */}
      <Cursor />

      {/* Preloader — mounted once per session, guard logic lives here not in Preloader */}
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Skip-to-content — hidden until focused */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Navigation Layer */}
      <Navigation />

      {/* Main content — hidden while preloader is active so there's no flash */}
      <main
        id="main-content"
        style={!preloaderDone ? { visibility: 'hidden' } : undefined}
      >
        {children}
      </main>

      {/* Footer Layer */}
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Run full test suite**

```bash
cd /Users/gingerninja/Sites/claudessetup && npm test 2>&1 | tail -20
```

Expected: all previously-passing tests + 4 Preloader tests pass.

- [ ] **Step 3: Commit**

```bash
cd /Users/gingerninja/Sites/claudessetup
git add src/components/preloader/Preloader.tsx src/components/layout/Layout.tsx src/tests/Preloader.test.tsx
git commit -m "feat: add constellation preloader and wire into Layout with sessionStorage guard"
```

---

## Chunk 5: Page Transitions

### Task 12: Create PageTransitionContext

**Files:**
- Create: `src/context/PageTransitionContext.tsx`

- [ ] **Step 1: Create context file**

Create `src/context/PageTransitionContext.tsx`:

```tsx
// src/context/PageTransitionContext.tsx
// Provides triggerTransition(path) to any component without prop drilling.
// PageTransition.tsx is the sole Provider. Navigation and card links are Consumers.
import { createContext, useContext } from 'react';

interface PageTransitionContextValue {
  triggerTransition: (path: string) => void;
}

export const PageTransitionContext = createContext<PageTransitionContextValue>({
  triggerTransition: () => {}, // no-op default — safe if consumed outside provider
});

export function usePageTransition(): PageTransitionContextValue {
  return useContext(PageTransitionContext);
}
```

---

### Task 13: Write PageTransition tests (failing first)

**Files:**
- Create: `src/tests/PageTransition.test.tsx`

- [ ] **Step 1: Write the test file**

Create `src/tests/PageTransition.test.tsx`:

```tsx
// src/tests/PageTransition.test.tsx
import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock GSAP — we just need to verify it's called, not actually animate
const gsapToMock   = vi.fn();
const gsapSetMock  = vi.fn();
const timelineKillMock = vi.fn();
const timelineToMock   = vi.fn();
const timelineCallMock = vi.fn();

vi.mock('gsap', () => ({
  default: {
    to: gsapToMock,
    set: gsapSetMock,
    timeline: vi.fn(() => ({
      kill: timelineKillMock,
      to: timelineToMock,
      call: timelineCallMock,
    })),
  },
}));

describe('PageTransition', () => {
  beforeEach(() => {
    gsapToMock.mockClear();
    gsapSetMock.mockClear();
  });

  it('renders the curtain panel div in the DOM', async () => {
    const { PageTransition } = await import('../components/transitions/PageTransition');
    const { container } = render(
      <MemoryRouter>
        <PageTransition>
          <div>child</div>
        </PageTransition>
      </MemoryRouter>
    );
    // The curtain div has a fixed position and z-index 1000
    const curtain = container.querySelector('[style*="z-index: 1000"]') ??
                    container.querySelector('[style*="zIndex"]');
    expect(curtain).toBeInTheDocument();
  });

  it('renders children inside the context provider', async () => {
    const { PageTransition } = await import('../components/transitions/PageTransition');
    const { getByText } = render(
      <MemoryRouter>
        <PageTransition>
          <div>test child content</div>
        </PageTransition>
      </MemoryRouter>
    );
    expect(getByText('test child content')).toBeInTheDocument();
  });

  it('triggerTransition does nothing when called with a hash-only path', async () => {
    const { PageTransition } = await import('../components/transitions/PageTransition');
    const { usePageTransition } = await import('../context/PageTransitionContext');

    let trigger!: (path: string) => void;

    function Consumer() {
      const { triggerTransition } = usePageTransition();
      trigger = triggerTransition;
      return null;
    }

    await act(async () => {
      render(
        <MemoryRouter>
          <PageTransition>
            <Consumer />
          </PageTransition>
        </MemoryRouter>
      );
    });

    // Call with a hash-only path — should be a no-op
    act(() => { trigger('#work'); });

    expect(gsapToMock).not.toHaveBeenCalled();
    expect(gsapSetMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/PageTransition.test.tsx
```

Expected: FAIL with "Cannot find module '../components/transitions/PageTransition'".

---

### Task 14: Create PageTransition.tsx

**Files:**
- Create: `src/components/transitions/PageTransition.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/transitions/PageTransition.tsx`:

```tsx
// src/components/transitions/PageTransition.tsx
// Void curtain that wipes L→R on navigation. Provides PageTransitionContext.
// Curtain OUT is gated on navigation.state === 'idle' (React Router v7) to avoid
// revealing a skeleton/loading state on slow connections.
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';
import gsap from 'gsap';
import { PageTransitionContext } from '../../context/PageTransitionContext';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const navigate   = useNavigate();
  const navigation = useNavigation();

  const curtainRef  = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const markRef     = useRef<HTMLSpanElement>(null);

  const [isMidTransition, setIsMidTransition] = useState(false);

  const triggerTransition = useCallback(
    (path: string) => {
      // Hash-only paths are scroll anchors — never trigger a page transition
      if (path.startsWith('#')) return;

      const curtain = curtainRef.current;
      const mark    = markRef.current;
      if (!curtain) return;

      // Kill any in-progress timeline to handle rapid navigation
      timelineRef.current?.kill();

      // Reset curtain to left edge immediately (off-screen left)
      gsap.set(curtain, { x: '-100%' });
      setIsMidTransition(true);

      const tl = gsap.timeline();
      // Curtain sweeps in from left
      tl.to(curtain, { x: '0%', duration: 0.55, ease: 'power3.inOut' });
      // Show ✦ mark at peak
      tl.call(() => { if (mark) mark.classList.add('transition-mark--visible'); }, [], 0.4);
      // Navigate while curtain is covering the screen
      tl.call(() => {
        if (mark) mark.classList.remove('transition-mark--visible');
        navigate(path);
      }, [], 0.5);

      timelineRef.current = tl;
    },
    [navigate]
  );

  // Curtain OUT — only fires when the new page has finished loading
  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain || !isMidTransition) return;
    if (navigation.state !== 'idle') return;

    gsap.to(curtain, {
      x: '100%',
      duration: 0.55,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(curtain, { x: '-100%' });
        setIsMidTransition(false);
      },
    });
  }, [navigation.state, isMidTransition]);

  return (
    <PageTransitionContext.Provider value={{ triggerTransition }}>
      {/* Curtain panel — starts off-screen left, invisible */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'var(--color-void)',
          transform: 'translateX(-100%)',
          pointerEvents: 'none',
        }}
      >
        <span ref={markRef} className="transition-mark">✦</span>
      </div>

      {children}
    </PageTransitionContext.Provider>
  );
}
```

- [ ] **Step 2: Run PageTransition tests — expect PASS**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/PageTransition.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 3: Run LenisSetup tests — App.tsx now has PageTransition import, should pass**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/LenisSetup.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 4: Run full test suite**

```bash
cd /Users/gingerninja/Sites/claudessetup && npm test 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
cd /Users/gingerninja/Sites/claudessetup
git add src/context/PageTransitionContext.tsx src/components/transitions/PageTransition.tsx src/tests/PageTransition.test.tsx
git commit -m "feat: add void curtain page transition with PageTransitionContext"
```

---

## Chunk 6: Navigation Updates + Card Hover

### Task 15: Update Navigation.tsx

**Files:**
- Modify: `src/components/navigation/Navigation.tsx`

Replace the full contents of `src/components/navigation/Navigation.tsx`:

- [ ] **Step 1: Replace Navigation.tsx**

```tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { lenisInstance } from '../../lib/lenis';
import { usePageTransition } from '../../context/PageTransitionContext';

const SECTION_LINKS = [
  { label: 'WORK',    href: '#work'    },
  { label: 'WRITING', href: '#writing' },
];

const ABOUT_PATH = '/about';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location  = useLocation();
  const isHome    = location.pathname === '/';
  const { triggerTransition } = usePageTransition();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const options = { rootMargin: '-30% 0px -60% 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, options);

    ['hero', 'work', 'writing'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();
    if (isHome) {
      // Smooth-scroll to top via Lenis
      lenisInstance?.scrollTo(0);
    } else {
      // Navigate to homepage with curtain transition
      triggerTransition('/');
    }
  }

  function handleSectionClick(e: React.MouseEvent, href: string) {
    e.preventDefault();
    // Section anchors scroll within the page — no page transition
    lenisInstance?.scrollTo(href);
  }

  return (
    <nav className={`nav-root ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        {/* LOGO */}
        <a
          href="/"
          className="nav-logo"
          onClick={handleLogoClick}
        >
          ✦ CURIOSITY INC.
        </a>

        {/* LINKS */}
        <ul className="nav-links">
          {SECTION_LINKS.map(link => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <li key={link.label}>
                {isHome ? (
                  <a
                    href={link.href}
                    onClick={(e) => handleSectionClick(e, link.href)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); triggerTransition('/'); }}
                    className="nav-link"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            );
          })}
          <li>
            <a
              href={ABOUT_PATH}
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); triggerTransition(ABOUT_PATH); }}
            >
              ABOUT
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
```

- [ ] **Step 2: Run full test suite to check nothing regressed**

```bash
cd /Users/gingerninja/Sites/claudessetup && npm test 2>&1 | tail -20
```

Expected: all tests pass. If Navigation tests fail due to Link→anchor change, update the test expectations to match `<a>` elements.

---

### Task 16: Update GridReveal.tsx — 3D tilt + card sheen

**Files:**
- Modify: `src/components/visualizations/GridReveal.tsx`

- [ ] **Step 1: Replace GridReveal.tsx with the tilt + sheen version**

Replace the full contents of `src/components/visualizations/GridReveal.tsx`:

```tsx
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { usePageTransition } from '../../context/PageTransitionContext';

interface CaseStudyItem {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  link: string;
}

interface GridRevealProps {
  items: CaseStudyItem[];
  columns?: number;
}

export const GridReveal: React.FC<GridRevealProps> = ({
  items,
  columns: _columns = 2
}) => {
  const { ref: containerRef, inView } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const sheenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { triggerTransition } = usePageTransition();

  // Scroll-reveal: stagger cards in from center
  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    gsap.fromTo(cardRefs.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: { each: 0.06, from: 'center' },
        ease: 'power2.out',
        delay: 0.3,
      }
    );
  }, [inView, prefersReducedMotion]);

  // 3D tilt handlers — coarse-pointer guard applied per card
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>, index: number) {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card  = cardRefs.current[index];
    const sheen = sheenRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;

    card.style.transform = `perspective(500px) rotateX(${(y - 0.5) * -10}deg) rotateY(${(x - 0.5) * 12}deg)`;

    if (sheen) {
      sheen.style.setProperty('--sheen-x', `${x * 100}%`);
      sheen.style.setProperty('--sheen-y', `${y * 100}%`);
    }
  }

  function handleMouseEnter(index: number) {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const sheen = sheenRefs.current[index];
    if (sheen) sheen.style.opacity = '1';
  }

  function handleMouseLeave(index: number) {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card  = cardRefs.current[index];
    const sheen = sheenRefs.current[index];

    if (card) {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power2.out' });
    }
    if (sheen) sheen.style.opacity = '0';
  }

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className="grid-reveal-root w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          ref={el => { cardRefs.current[i] = el; }}
          className={`grid-reveal-card relative group p-10 border rounded-lg transition-all duration-700
            ${i === 2 && items.length === 3 ? 'md:col-span-1' : ''}`}
          style={{
            backgroundColor: 'rgba(232, 230, 224, 0.03)',
            borderColor: 'rgba(232, 230, 224, 0.1)',
            opacity: prefersReducedMotion ? 1 : 0,
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
          }}
          onClick={() => triggerTransition(item.link)}
          onMouseMove={(e) => handleMouseMove(e, i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
          role="link"
          tabIndex={0}
          aria-label={`View case study: ${item.title}`}
          onKeyDown={(e) => { if (e.key === 'Enter') triggerTransition(item.link); }}
        >
          {/* Teal sheen follows the mouse */}
          <div
            ref={el => { sheenRefs.current[i] = el; }}
            className="card-sheen"
          />

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[12px] text-[var(--color-transformation)]">
                {item.number}
              </span>
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase opacity-40 text-[var(--color-context)]">
                {item.category}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-display text-[28px] font-normal leading-tight text-[var(--color-text)]">
                {item.title}
              </h3>
              <p className="font-body text-[14px] font-light text-[var(--color-text-dim)] leading-relaxed max-w-[320px]">
                {item.subtitle}
              </p>
            </div>

            <div className="pt-4 mt-auto">
              <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--color-insight)] uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                EXPLORE CASE STUDY →
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

- [ ] **Step 2: Run full test suite**

```bash
cd /Users/gingerninja/Sites/claudessetup && npm test 2>&1 | tail -30
```

Expected: all tests pass (including any existing GridReveal tests).

- [ ] **Step 3: Update vite.config.ts to add lenis to the vendor chunk (optional but good practice)**

In `vite.config.ts`, find the `manualChunks` function and add lenis:

```ts
// Add inside manualChunks, after the gsap block:
if (id.includes('node_modules/lenis')) {
  return 'gsap'; // bundle with gsap since they're always used together
}
```

- [ ] **Step 4: Run build to verify no bundle issues**

```bash
cd /Users/gingerninja/Sites/claudessetup && npm run build 2>&1 | tail -30
```

Expected: build succeeds. No chunk exceeds 500KB warning for the new code.

- [ ] **Step 5: Commit everything**

```bash
cd /Users/gingerninja/Sites/claudessetup
git add src/components/navigation/Navigation.tsx src/components/visualizations/GridReveal.tsx vite.config.ts
git commit -m "feat: wire page transitions into Navigation and GridReveal; add 3D card hover"
```

- [ ] **Step 6: Final test run — confirm all tests pass**

```bash
cd /Users/gingerninja/Sites/claudessetup && npm test
```

Expected: 70+ tests pass (all existing + 9 new: 3 LenisSetup + 2 Cursor + 4 Preloader + 3 PageTransition).

---

## Summary: Files Created / Modified

| File | Action |
|------|--------|
| `src/lib/lenis.ts` | **Create** — module-level Lenis singleton |
| `src/context/PageTransitionContext.tsx` | **Create** — React context + `usePageTransition` hook |
| `src/components/cursor/Cursor.tsx` | **Create** — dot + ring cursor, null on coarse pointer |
| `src/components/preloader/Preloader.tsx` | **Create** — constellation preloader, CSS keyframes |
| `src/components/transitions/PageTransition.tsx` | **Create** — void curtain + context provider |
| `src/tests/LenisSetup.test.tsx` | **Create** — 3 tests |
| `src/tests/Cursor.test.tsx` | **Create** — 2 tests |
| `src/tests/Preloader.test.tsx` | **Create** — 4 tests |
| `src/tests/PageTransition.test.tsx` | **Create** — 3 tests |
| `src/App.tsx` | **Modify** — Lenis init + PageTransition mount |
| `src/components/layout/Layout.tsx` | **Modify** — Cursor + Preloader + sessionStorage guard |
| `src/components/navigation/Navigation.tsx` | **Modify** — lenis.scrollTo + triggerTransition |
| `src/components/visualizations/GridReveal.tsx` | **Modify** — 3D tilt + sheen, `<Link>` → `triggerTransition` |
| `src/index.css` | **Modify** — cursor styles, card sheen, transition-mark, scroll-behavior removal |
| `vite.config.ts` | **Modify** — add lenis to gsap chunk |
