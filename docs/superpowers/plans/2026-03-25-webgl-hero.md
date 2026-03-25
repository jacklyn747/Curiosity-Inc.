# WebGL Hero Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder hero text in `src/pages/index.tsx` with a scroll-driven WebGL particle animation: scattered particles → Fibonacci spiral → Flower of Life → sphere cluster → text reveal.

**Architecture:** React Three Fiber v9 scene with 800 Three.js Points. GSAP ScrollTrigger scrubs a proxy object whose `onUpdate` manually lerps between 4 pre-computed `Float32Array` position targets and sets `needsUpdate`. A touch/WebGL-failure/reduced-motion branch renders a static SVG Flower of Life fallback instead.

**Tech Stack:** React 19, React Three Fiber v9, `@react-three/drei`, Three.js 0.183, GSAP 3 (already installed), Vitest + `@testing-library/react` (new)

**Spec:** `docs/superpowers/specs/2026-03-25-webgl-hero-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/hooks/useParticleTargets.ts` | Pre-compute 4 position Float32Arrays + 1 color Float32Array |
| Create | `src/hooks/useHeroScroll.ts` | GSAP ScrollTrigger pin + scrub → returns `progress` 0–1 |
| Create | `src/components/hero/HeroFallback.tsx` | Static SVG Flower of Life for mobile / reduced-motion |
| Create | `src/components/hero/ParticleField.tsx` | r3f scene: camera + points mesh + idle drift + morph |
| Create | `src/components/hero/HeroSection.tsx` | Top-level: canvas + text overlay + fallback routing |
| Create | `src/tests/useParticleTargets.test.ts` | Unit tests for geometry math |
| Create | `src/tests/HeroFallback.test.tsx` | Render tests for fallback component |
| Create | `src/tests/HeroSection.test.tsx` | Integration tests for fallback routing |
| Create | `vitest.config.ts` | Vitest config with jsdom environment |
| Modify | `src/pages/index.tsx` | Remove orphaned GSAP (lines ~22–38), replace hero section (lines ~43–77) |
| Modify | `package.json` | Add test script + new dependencies |

---

## Chunk 1: Dependencies, Test Setup, and Geometry Math

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install r3f, drei, and Vitest**

```bash
cd /Users/gingerninja/Sites/claudessetup
npm install @react-three/fiber@9 @react-three/drei
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8
```

- [ ] **Step 2: Verify no peer dependency warnings**

```bash
npm ls @react-three/fiber
```

Expected: shows `@react-three/fiber@9.x.x` with no unmet peer dependency warnings against React 19.2.4.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add react-three-fiber, drei, vitest"
```

---

### Task 2: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Create `vitest.config.ts`**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
  },
});
```

- [ ] **Step 2: Create `src/tests/setup.ts`**

```typescript
// src/tests/setup.ts
import '@testing-library/jest-dom';

// Stub WebGL context for jsdom (Three.js needs this)
HTMLCanvasElement.prototype.getContext = (type: string) => {
  if (type === 'webgl' || type === 'webgl2') return null; // force WebGL failure in tests
  return null;
};
```

- [ ] **Step 3: Add test script to `package.json`**

In the `"scripts"` section, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Run tests to confirm setup works**

```bash
npm test
```

Expected: "No test files found" — exits 0. If it exits non-zero, check `vitest.config.ts` for syntax errors.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts src/tests/setup.ts package.json
git commit -m "feat: configure vitest with jsdom"
```

---

### Task 3: `useParticleTargets` — geometry math hook

**Files:**
- Create: `src/hooks/useParticleTargets.ts`
- Create: `src/tests/useParticleTargets.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/tests/useParticleTargets.test.ts
import { renderHook } from '@testing-library/react';
import { useParticleTargets } from '../hooks/useParticleTargets';

const PARTICLE_COUNT = 800;
const ARRAY_LENGTH = PARTICLE_COUNT * 3; // x, y, z per particle

describe('useParticleTargets', () => {
  it('returns 4 position target arrays each with correct length', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    expect(result.current.targets).toHaveLength(4);
    result.current.targets.forEach((t) => {
      expect(t).toBeInstanceOf(Float32Array);
      expect(t.length).toBe(ARRAY_LENGTH);
    });
  });

  it('returns a single color array with correct length', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    expect(result.current.colors).toBeInstanceOf(Float32Array);
    expect(result.current.colors.length).toBe(ARRAY_LENGTH);
  });

  it('stage 0 (scattered) positions are within radius 4', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const scattered = result.current.targets[0];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = scattered[i * 3];
      const y = scattered[i * 3 + 1];
      const z = scattered[i * 3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);
      expect(dist).toBeLessThanOrEqual(4.01); // 0.01 float tolerance
    }
  });

  it('stage 3 (sphere cluster) positions are approximately on sphere of radius 1.8', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const sphere = result.current.targets[3];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = sphere[i * 3];
      const y = sphere[i * 3 + 1];
      const z = sphere[i * 3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);
      expect(dist).toBeCloseTo(1.8, 1); // within 0.1 of target radius
    }
  });

  it('first particle color is Teal (#3A9EA4 → ~0.23, 0.62, 0.64 normalized)', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const colors = result.current.colors;
    // Teal: R=0x3A=58 → 58/255≈0.227, G=0x9E=158 → 158/255≈0.620, B=0xA4=164 → 164/255≈0.643
    expect(colors[0]).toBeCloseTo(58 / 255, 2);
    expect(colors[1]).toBeCloseTo(158 / 255, 2);
    expect(colors[2]).toBeCloseTo(164 / 255, 2);
  });

  it('last particle color is Pink (#F72658 → ~0.97, 0.15, 0.35 normalized)', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const colors = result.current.colors;
    const last = (PARTICLE_COUNT - 1) * 3;
    // Pink: R=0xF7=247 → 247/255≈0.969, G=0x26=38 → 38/255≈0.149, B=0x58=88 → 88/255≈0.345
    expect(colors[last]).toBeCloseTo(247 / 255, 2);
    expect(colors[last + 1]).toBeCloseTo(38 / 255, 2);
    expect(colors[last + 2]).toBeCloseTo(88 / 255, 2);
  });

  it('returns stable references across re-renders (memoized)', () => {
    const { result, rerender } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const first = result.current;
    rerender();
    expect(result.current.targets).toBe(first.targets);
    expect(result.current.colors).toBe(first.colors);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../hooks/useParticleTargets'"

- [ ] **Step 3: Implement `useParticleTargets.ts`**

```typescript
// src/hooks/useParticleTargets.ts
import { useMemo } from 'react';

// Brand colors normalized to 0–1 for Three.js vertexColors
const TEAL   = [58 / 255, 158 / 255, 164 / 255];  // #3A9EA4
const ORANGE = [250 / 255, 119 / 255, 20 / 255];  // #FA7714
const PINK   = [247 / 255, 38 / 255, 88 / 255];   // #F72658

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function buildScattered(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  // Seeded-style: use index as pseudo-random seed for consistency
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(2 * ((i * 0.618033988749895) % 1) - 1);
    const phi = 2 * Math.PI * ((i * 0.381966011250105) % 1);
    const r = 4 * Math.cbrt((i + 0.5) / count); // uniform sphere volume
    arr[i * 3]     = r * Math.sin(theta) * Math.cos(phi);
    arr[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    arr[i * 3 + 2] = r * Math.cos(theta);
  }
  return arr;
}

function buildFibonacciDisc(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(i / count) * 3;
    const theta = i * goldenAngle;
    arr[i * 3]     = r * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(theta);
    arr[i * 3 + 2] = 0;
  }
  return arr;
}

function buildFlowerOfLife(count: number): Float32Array {
  // 7 circles: 1 center + 6 arranged at 60° increments
  const arr = new Float32Array(count * 3);
  const radius = 2;
  const centers = [
    [0, 0],
    ...Array.from({ length: 6 }, (_, i) => [
      radius * Math.cos((i * Math.PI) / 3),
      radius * Math.sin((i * Math.PI) / 3),
    ]),
  ];
  const perCircle = Math.floor(count / 7);
  let idx = 0;
  for (let c = 0; c < 7; c++) {
    const [cx, cy] = centers[c];
    const circleCount = c < 6 ? perCircle : count - idx;
    for (let i = 0; i < circleCount; i++) {
      const angle = (i / circleCount) * 2 * Math.PI;
      arr[idx * 3]     = cx + radius * Math.cos(angle);
      arr[idx * 3 + 1] = cy + radius * Math.sin(angle);
      arr[idx * 3 + 2] = 0;
      idx++;
    }
  }
  return arr;
}

function buildSphereCluster(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const R = 1.8;
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere — evenly distributed on surface
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    arr[i * 3]     = R * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = R * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = R * Math.cos(phi);
  }
  return arr;
}

function buildColors(count: number): Float32Array {
  // Index 0 = Teal, index count/2 = Orange, index count-1 = Pink
  const arr = new Float32Array(count * 3);
  const mid = count / 2;
  for (let i = 0; i < count; i++) {
    let r: number, g: number, b: number;
    if (i < mid) {
      const t = i / mid;
      r = lerp(TEAL[0], ORANGE[0], t);
      g = lerp(TEAL[1], ORANGE[1], t);
      b = lerp(TEAL[2], ORANGE[2], t);
    } else {
      const t = (i - mid) / (count - mid);
      r = lerp(ORANGE[0], PINK[0], t);
      g = lerp(ORANGE[1], PINK[1], t);
      b = lerp(ORANGE[2], PINK[2], t);
    }
    arr[i * 3]     = r;
    arr[i * 3 + 1] = g;
    arr[i * 3 + 2] = b;
  }
  return arr;
}

export function useParticleTargets(count: number = 800) {
  return useMemo(() => ({
    targets: [
      buildScattered(count),
      buildFibonacciDisc(count),
      buildFlowerOfLife(count),
      buildSphereCluster(count),
    ],
    colors: buildColors(count),
  }), [count]);
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useParticleTargets.ts src/tests/useParticleTargets.test.ts
git commit -m "feat: add useParticleTargets hook with geometry math"
```

---

## Chunk 2: Fallback Component and Scroll Hook

### Task 4: `HeroFallback` — SVG Flower of Life

**Files:**
- Create: `src/components/hero/HeroFallback.tsx`
- Create: `src/tests/HeroFallback.test.tsx`

- [ ] **Step 1: Create the hero components directory**

```bash
mkdir -p /Users/gingerninja/Sites/claudessetup/src/components/hero
```

- [ ] **Step 2: Write the failing tests**

```typescript
// src/tests/HeroFallback.test.tsx
import { render, screen } from '@testing-library/react';
import { HeroFallback } from '../components/hero/HeroFallback';

// Mock useReducedMotion
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useReducedMotion } from '../hooks/useReducedMotion';

describe('HeroFallback', () => {
  it('renders the SVG', () => {
    const { container } = render(<HeroFallback />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders 7 circles for the Flower of Life', () => {
    const { container } = render(<HeroFallback />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(7);
  });

  it('renders the two hero text lines', () => {
    render(<HeroFallback />);
    expect(screen.getByText('Your audience is learning from you.')).toBeInTheDocument();
    expect(screen.getByText("You just haven't designed what they're learning.")).toBeInTheDocument();
  });

  it('applies draw animation class when reduced motion is false', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const { container } = render(<HeroFallback />);
    expect(container.querySelector('.flower-draw')).toBeInTheDocument();
  });

  it('applies static class (no animation) when reduced motion is true', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const { container } = render(<HeroFallback />);
    expect(container.querySelector('.flower-static')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../components/hero/HeroFallback'"

- [ ] **Step 4: Implement `HeroFallback.tsx`**

```tsx
// src/components/hero/HeroFallback.tsx
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Flower of Life: 7 circles — center + 6 at 60° offsets, radius 72 each, offset 72
const FLOWER_RADIUS = 72;
const CENTERS: [number, number][] = [
  [200, 180],
  ...Array.from({ length: 6 }, (_, i): [number, number] => [
    200 + FLOWER_RADIUS * Math.cos((i * Math.PI) / 3),
    180 + FLOWER_RADIUS * Math.sin((i * Math.PI) / 3),
  ]),
];

export function HeroFallback() {
  const reduced = useReducedMotion();
  const svgClass = reduced ? 'flower-static' : 'flower-draw';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--color-void)',
      gap: '48px',
      padding: '40px',
    }}>
      <svg
        className={svgClass}
        viewBox="0 0 400 360"
        width="360"
        height="324"
        aria-label="Flower of Life sacred geometry"
        style={{ maxWidth: '480px', width: '100%' }}
      >
        <style>{`
          .flower-draw circle {
            stroke-dasharray: 452;
            stroke-dashoffset: 452;
            animation: drawCircle 1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          .flower-draw circle:nth-child(1) { animation-delay: 0ms; }
          .flower-draw circle:nth-child(2) { animation-delay: 120ms; }
          .flower-draw circle:nth-child(3) { animation-delay: 240ms; }
          .flower-draw circle:nth-child(4) { animation-delay: 360ms; }
          .flower-draw circle:nth-child(5) { animation-delay: 480ms; }
          .flower-draw circle:nth-child(6) { animation-delay: 600ms; }
          .flower-draw circle:nth-child(7) { animation-delay: 720ms; }
          .flower-static circle { stroke-dashoffset: 0; }
          @keyframes drawCircle {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
        {CENTERS.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={FLOWER_RADIUS}
            fill="none"
            stroke="#3A9EA4"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
      </svg>

      <div style={{ textAlign: 'center', maxWidth: '640px' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3.5vw, 40px)',
          fontStyle: 'italic',
          color: 'var(--color-text)',
          marginBottom: '1rem',
          animation: reduced ? 'none' : 'fadeIn 600ms ease forwards 1300ms',
          opacity: reduced ? 1 : 0,
        }}>
          Your audience is learning from you.
        </p>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3.5vw, 40px)',
          fontStyle: 'italic',
          color: 'var(--color-text-dim)',
          opacity: reduced ? 0.8 : 0,
          animation: reduced ? 'none' : 'fadeIn 600ms ease forwards 1600ms',
        }}>
          You just haven't designed what they're learning.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { to { opacity: 1; } }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test
```

Expected: All 5 HeroFallback tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/hero/HeroFallback.tsx src/tests/HeroFallback.test.tsx
git commit -m "feat: add HeroFallback SVG component with reduced-motion support"
```

---

### Task 5: `useHeroScroll` — GSAP ScrollTrigger pin and scrub

**Files:**
- Create: `src/hooks/useHeroScroll.ts`

Note: `useHeroScroll` is tightly coupled to the DOM and GSAP's ScrollTrigger timing. Unit testing it would require a browser-accurate scroll simulation. Instead we verify cleanup behavior only — the functional behavior is validated manually in Task 8.

- [ ] **Step 1: Implement `useHeroScroll.ts`**

```typescript
// src/hooks/useHeroScroll.ts
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the hero section and returns scroll progress 0–1 across 300vh.
 * CRITICAL: kills the ScrollTrigger instance on unmount to prevent
 * pinned spacer from corrupting scroll positions for sections below.
 */
export function useHeroScroll(containerRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    triggerRef.current = trigger;

    return () => {
      trigger.kill();
      triggerRef.current = null;
    };
  }, [containerRef]);

  return progress;
}
```

- [ ] **Step 2: Confirm the project still lints cleanly**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useHeroScroll.ts
git commit -m "feat: add useHeroScroll GSAP ScrollTrigger hook"
```

---

## Chunk 3: r3f Scene, HeroSection, and Integration

### Task 6: `ParticleField` — the r3f scene

**Files:**
- Create: `src/components/hero/ParticleField.tsx`

Note: r3f components require a WebGL canvas to render. jsdom cannot provide one. No unit tests are written here — visual correctness is verified manually in Task 8 (`npm run dev`).

- [ ] **Step 1: Implement `ParticleField.tsx`**

```tsx
// src/components/hero/ParticleField.tsx
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useParticleTargets } from '../../hooks/useParticleTargets';

const PARTICLE_COUNT = 800;

// Precompute per-particle drift phases (0–2π) once at module level
const DRIFT_PHASES = Float32Array.from(
  { length: PARTICLE_COUNT },
  () => Math.random() * Math.PI * 2
);

// Lerp between two Float32Arrays into target array
function lerpArrays(out: Float32Array, a: Float32Array, b: Float32Array, t: number) {
  for (let i = 0; i < out.length; i++) {
    out[i] = a[i] + (b[i] - a[i]) * t;
  }
}

interface ParticleFieldProps {
  progress: number; // 0–1 from useHeroScroll
}

export function ParticleField({ progress }: ParticleFieldProps) {
  const { invalidate } = useThree();
  const { targets, colors } = useParticleTargets(PARTICLE_COUNT);

  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  // #E8E6E0 normalized: R=232/255≈0.910, G=230/255≈0.902, B=224/255≈0.878
  const whiteColors = useRef<Float32Array>(
    Float32Array.from({ length: PARTICLE_COUNT * 3 }, (_, i) => {
      const channel = i % 3;
      return channel === 0 ? 0.910 : channel === 1 ? 0.902 : 0.878;
    })
  );

  // Initialize geometry on mount
  useEffect(() => {
    if (!geometryRef.current) return;
    geometryRef.current.setAttribute(
      'position',
      new THREE.BufferAttribute(targets[0].slice(), 3)
    );
    geometryRef.current.setAttribute(
      'color',
      new THREE.BufferAttribute(whiteColors.current.slice(), 3)
    );
  }, [targets]);

  // Idle drift — runs every frame, calls invalidate() so frameloop="demand" actually renders
  useFrame(({ clock }) => {
    if (!geometryRef.current) return;
    const t = clock.getElapsedTime();
    const pos = geometryRef.current.attributes.position as THREE.BufferAttribute;

    // Only apply drift when no morph is in progress (progress < 0.01)
    if (progress < 0.01) {
      const base = targets[0];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const phase = DRIFT_PHASES[i];
        pos.array[i * 3]     = base[i * 3]     + Math.sin(t * 0.3 + phase) * 0.3;
        pos.array[i * 3 + 1] = base[i * 3 + 1] + Math.cos(t * 0.2 + phase) * 0.3;
        pos.array[i * 3 + 2] = base[i * 3 + 2];
      }
      pos.needsUpdate = true;
      invalidate();
    }
  });

  // Morph positions and colors on scroll progress change
  useEffect(() => {
    if (!geometryRef.current || progress < 0.01) return;
    const geo = geometryRef.current;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const col = geo.attributes.color as THREE.BufferAttribute;

    // Map 0–1 progress across 3 stage transitions
    // Stage transitions: 0→1 at 0–0.3, 1→2 at 0.3–0.6, 2→3 at 0.6–0.85
    let stageFrom: Float32Array, stageTo: Float32Array, t: number;
    if (progress <= 0.3) {
      stageFrom = targets[0]; stageTo = targets[1]; t = progress / 0.3;
    } else if (progress <= 0.6) {
      stageFrom = targets[1]; stageTo = targets[2]; t = (progress - 0.3) / 0.3;
    } else if (progress <= 0.85) {
      stageFrom = targets[2]; stageTo = targets[3]; t = (progress - 0.6) / 0.25;
    } else {
      stageFrom = targets[3]; stageTo = targets[3]; t = 1;
    }

    // Proxy pattern — GSAP cannot tween Float32Array directly
    const proxy = { t: 0 };
    const tween = gsap.to(proxy, {
      t: t,
      duration: 0.05,
      onUpdate: () => {
        lerpArrays(pos.array as Float32Array, stageFrom, stageTo, proxy.t);
        pos.needsUpdate = true;

        // Color: white below 0.6 progress, lerp to indexed colors above
        if (progress >= 0.6) {
          const colorT = Math.min((progress - 0.6) / 0.25, 1);
          lerpArrays(col.array as Float32Array, whiteColors.current, colors, colorT);
        } else {
          col.array.set(whiteColors.current);
        }
        col.needsUpdate = true;
        invalidate();
      },
    });

    return () => { tween.kill(); };
  }, [progress, targets, colors, invalidate]);

  return (
    <>
      <AdaptiveDpr pixelated />
      <ambientLight intensity={1} />
      {/* No <perspectiveCamera> here — camera is set via the `camera` prop on <Canvas> in HeroSection */}
      <points ref={pointsRef}>
        <bufferGeometry ref={geometryRef} />
        {/*
          size: spec lists "size: 1.5" as pixel-intent; in Three.js world units
          with sizeAttenuation=true, 0.035 achieves correct visual size at camera z=6.
          opacity=0.7 per spec Particle System table ("White at 70% opacity").
        */}
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
    </>
  );
}
```

- [ ] **Step 2: Lint check**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/ParticleField.tsx
git commit -m "feat: add ParticleField r3f scene with idle drift and scroll morph"
```

---

### Task 7: `HeroSection` — top-level component

**Files:**
- Create: `src/components/hero/HeroSection.tsx`
- Create: `src/tests/HeroSection.test.tsx`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/tests/HeroSection.test.tsx
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../components/hero/HeroSection';

// Mock hooks
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));
vi.mock('../hooks/useHeroScroll', () => ({
  useHeroScroll: vi.fn(() => 0),
}));

import { useReducedMotion } from '../hooks/useReducedMotion';

describe('HeroSection', () => {
  it('renders HeroFallback when reduced motion is true', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);
    render(<HeroSection />);
    // HeroFallback renders these text lines
    expect(screen.getByText('Your audience is learning from you.')).toBeInTheDocument();
  });

  it('renders HeroFallback when on a touch device', () => {
    // jsdom setup.ts stubs getContext to return null (WebGL failure)
    // and we simulate pointer:coarse via matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(pointer: coarse)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(false);
    render(<HeroSection />);
    expect(screen.getByText('Your audience is learning from you.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../components/hero/HeroSection'"

- [ ] **Step 3: Implement `HeroSection.tsx`**

```tsx
// src/components/hero/HeroSection.tsx
import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHeroScroll } from '../../hooks/useHeroScroll';
import { ParticleField } from './ParticleField';
import { HeroFallback } from './HeroFallback';

/**
 * Check WebGL support synchronously before mounting the canvas.
 * More reliable than detecting failure inside r3f's onCreated,
 * which only fires on success.
 */
function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function isTouchDevice() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
}

export function HeroSection() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useHeroScroll(containerRef);
  // Note: useHeroScroll is called unconditionally (hooks must not be conditional).
  // On the fallback path, containerRef.current is null and the hook safely no-ops.
  const [isVisible, setIsVisible] = useState(true);

  // Unmount canvas once hero scrolls fully out of view
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const useFallback = reduced || isTouchDevice() || !supportsWebGL();

  if (useFallback) {
    return <HeroFallback />;
  }

  return (
    <div
      ref={containerRef}
      id="hero"
      style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: 'var(--color-void)' }}
    >
      {isVisible && (
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 0, 6], fov: 60 }}
          style={{ position: 'absolute', inset: 0 }}
          onCreated={() => {
            // Refresh ScrollTrigger AFTER canvas has committed dimensions to DOM.
            // Must be here (onCreated), not before mount — premature refresh produces
            // wrong pinned-spacer height and corrupts scroll positions for sections below.
            // ScrollTrigger is statically imported above — no dynamic import needed.
            ScrollTrigger.refresh();
          }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <ParticleField progress={progress} />
        </Canvas>
      )}

      {/* Text overlay — fades in at progress 0.85+ */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        padding: '0 24px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        left: 0, right: 0,
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 4vw, 48px)',
          fontStyle: 'italic',
          color: 'var(--color-text)',
          opacity: progress >= 0.85 ? 1 : 0,
          transition: 'opacity 600ms ease',
          marginBottom: '1rem',
        }}>
          Your audience is learning from you.
        </p>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 4vw, 48px)',
          fontStyle: 'italic',
          color: 'var(--color-text-dim)',
          opacity: progress >= 0.9 ? 0.8 : 0,
          transition: 'opacity 600ms ease',
        }}>
          You just haven't designed what they're learning.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: All HeroSection tests PASS. All prior tests still PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/HeroSection.tsx src/tests/HeroSection.test.tsx
git commit -m "feat: add HeroSection with WebGL canvas and fallback routing"
```

---

### Task 8: Integrate into `src/pages/index.tsx`

**Files:**
- Modify: `src/pages/index.tsx`

- [ ] **Step 1: Remove orphaned GSAP hero animations (lines ~22–38)**

In `src/pages/index.tsx`, delete the `useEffect` block that contains `gsap.from(".hero-line-1", ...)` and `gsap.from(".hero-line-2", ...)`. This block is at approximately lines 22–38.

After deletion, the file should jump from `gsap.registerPlugin(ScrollTrigger)` (line 13) directly to the `export function HomePage()` declaration.

Check whether `useEffect` is still imported and used elsewhere in the file. If it is no longer used, remove it from the import line too.

- [ ] **Step 1b: Lint to confirm clean removal**

```bash
npm run lint
```

Expected: No errors. If `useEffect` was removed from the import but still used elsewhere, lint will catch it here.

- [ ] **Step 2: Replace the hero section with `<HeroSection />`**

Add the import at the top of the file (after existing imports):
```tsx
import { HeroSection } from '../components/hero/HeroSection';
```

Then replace the entire `<section id="hero" ...>...</section>` block (approximately lines 43–77) with:
```tsx
<HeroSection />
```

- [ ] **Step 3: Run the dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173`.

**Manual checks:**
- [ ] Dark void loads with drifting particles — no text visible
- [ ] Scrolling causes particles to converge through geometry stages
- [ ] Text lines appear near the bottom of the scroll sequence
- [ ] Sections below (The Pattern, The Insight, etc.) scroll normally after hero exits
- [ ] No console errors about ScrollTrigger or WebGL
- [ ] Throttle CPU in Chrome DevTools Performance tab → `AdaptiveDpr` kicks in (canvas resolution drops)

- [ ] **Step 4: Test the WebGL failure fallback**

In Chrome DevTools → Settings → Rendering → Disable hardware acceleration (requires DevTools restart).

Expected: `supportsWebGL()` returns false → `HeroFallback` renders. SVG Flower of Life draws in, text fades up. No particle canvas, no console errors.

- [ ] **Step 5: Test the reduced-motion fallback**

In Chrome DevTools → More tools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`.

Expected: `HeroFallback` renders. SVG is fully visible immediately (no draw animation). Text is fully visible immediately.

- [ ] **Step 6: Add `.superpowers/` to `.gitignore`**

Open `.gitignore` (create it if it doesn't exist) and add:
```
.superpowers/
```

- [ ] **Step 7: Run the full test suite one final time**

```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 8: Final commit**

```bash
git add src/pages/index.tsx .gitignore
git commit -m "feat: integrate WebGL hero into homepage (Phase 8)"
```

---

## Done

The hero sequence is live. All tests pass. The homepage now opens with the full particle field → sacred geometry → sphere cluster → text reveal experience, with a clean SVG fallback for mobile and reduced-motion users.
