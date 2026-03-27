# About Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/about` page — a five-section personal introduction and company manifesto for Jacklyn Miller / Curiosity Inc., with scroll-triggered GSAP animations and a mid-page photo reveal.

**Architecture:** Single page component (`AboutPage`) with five distinct sections. Mount animations on Section 01, `useScrollTrigger` + GSAP `context()` for Sections 02–05. Photo converted from HEIC to WebP pre-build. Nav `ABOUT` link separated from the scroll-target array and wired to `/about` route.

**Tech Stack:** React 19, TypeScript, GSAP (ScrollTrigger registered async), `useScrollTrigger` hook, inline styles (CSS custom properties), React Router v6, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-03-27-about-page-design.md`

---

## Chunk 1: Foundation — photo, tests, scaffold

### Task 1: Convert photo to WebP

**Files:**
- Create: `public/jacklyn-miller.webp`

- [ ] **Step 1: Verify ffmpeg is available**

```bash
ffmpeg -version | head -1
```
Expected: `ffmpeg version ...`
If not installed: `brew install ffmpeg`

- [ ] **Step 2: Convert and desaturate**

```bash
ffmpeg -i "/Users/gingerninja/Sites/claudessetup/visual inspo/Jacklyn Miller.HEIC" \
  -vf "eq=saturation=0.9" \
  /Users/gingerninja/Sites/claudessetup/public/jacklyn-miller.webp
```
Expected: `public/jacklyn-miller.webp` created, no errors.

- [ ] **Step 3: Verify output**

```bash
ls -lh /Users/gingerninja/Sites/claudessetup/public/jacklyn-miller.webp
```
Expected: file exists, size reasonable (50–400KB).

- [ ] **Step 4: Commit**

```bash
git add public/jacklyn-miller.webp
git commit -m "feat: add Jacklyn Miller portrait (WebP, desaturated)"
```

---

### Task 2: Write failing tests

**Files:**
- Create: `src/tests/About.test.tsx`

- [ ] **Step 1: Write the test file**

```tsx
// src/tests/About.test.tsx

// GSAP mock — hoisted by Vitest. Section 01 mount animations run unconditionally,
// so we mock here rather than relying on inView staying false.
vi.mock('gsap', () => ({
  default: {
    context: vi.fn((_fn: () => void, _scope: unknown) => ({ revert: vi.fn() })),
    fromTo: vi.fn(),
    registerPlugin: vi.fn(),
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AboutPage } from '../pages/About';

function renderAbout() {
  return render(
    <MemoryRouter initialEntries={['/about']}>
      <Routes>
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AboutPage', () => {
  it('renders without crashing', () => {
    renderAbout();
  });

  it('renders the opening conviction text', () => {
    renderAbout();
    expect(screen.getByText(/Here's what I know/i)).toBeInTheDocument();
  });

  it('renders Jacklyn Miller name', () => {
    renderAbout();
    expect(screen.getByText(/Jacklyn Miller/i)).toBeInTheDocument();
  });

  it('renders photo with correct alt text', () => {
    renderAbout();
    expect(screen.getByAltText('Jacklyn Miller')).toBeInTheDocument();
  });

  it('renders email CTA link with correct href', () => {
    renderAbout();
    const link = screen.getByRole('link', { name: /jacklyn@curiosityinc\.online/i });
    expect(link).toHaveAttribute('href', 'mailto:jacklyn@curiosityinc.online');
  });

  it('renders "The difference is everything" closing line', () => {
    renderAbout();
    expect(screen.getByText(/The difference is everything/i)).toBeInTheDocument();
  });

  it('renders all three discipline labels', () => {
    renderAbout();
    expect(screen.getByText(/Visual Arts/i)).toBeInTheDocument();
    expect(screen.getByText(/Creative Writing/i)).toBeInTheDocument();
    expect(screen.getByText(/Instructional Design/i)).toBeInTheDocument();
  });

  it('renders the About page on /about route', () => {
    renderAbout();
    // Route is functioning if the opening text is present
    expect(screen.getByText(/Here's what I know/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they all fail (component does not exist yet)**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/About.test.tsx 2>&1 | tail -20
```
Expected: 8 failures — `Cannot find module '../pages/About'`

- [ ] **Step 3: Commit the failing tests**

```bash
git add src/tests/About.test.tsx
git commit -m "test: write failing tests for AboutPage (TDD)"
```

---

## Chunk 2: Component build

### Task 3: Build the AboutPage component

**Files:**
- Create: `src/pages/About.tsx`

- [ ] **Step 1: Write the full component**

```tsx
// src/pages/About.tsx
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../hooks/useScrollTrigger';

if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  });
}

// ─── Inline style constants ────────────────────────────────────────────────

const S = {
  page: {
    background: 'var(--color-void)',
  } as React.CSSProperties,

  // Section 01 — Opening
  opening: {
    minHeight: '82vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    padding: '120px 48px 80px',
    maxWidth: 760,
    margin: '0 auto',
  } as React.CSSProperties,

  rule: {
    width: 0,           // animated to 56px by GSAP
    height: 1,
    background: 'var(--color-structure)',
    marginBottom: 36,
    flexShrink: 0,
  } as React.CSSProperties,

  lead: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 'clamp(26px, 3.8vw, 40px)',
    lineHeight: 1.25,
    color: 'var(--color-text)',
    marginBottom: 28,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  leadAccent: {
    color: 'var(--color-insight)',
    fontStyle: 'italic',
  } as React.CSSProperties,

  openingBody: {
    fontSize: 17,
    lineHeight: 1.82,
    color: 'var(--color-text-dim)',
    maxWidth: 640,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  openingClose: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 20,
    color: 'var(--color-text)',
    marginTop: 24,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  divider: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '0 48px',
    height: 1,
    background: 'rgba(255,255,255,0.06)',
  } as React.CSSProperties,

  // Section 02 — Path
  path: {
    padding: '96px 48px',
    maxWidth: 760,
    margin: '0 auto',
  } as React.CSSProperties,

  discipline: {
    display: 'flex',
    gap: 0,
    marginBottom: 52,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  disciplineMarker: {
    minWidth: 148,
    paddingRight: 28,
    paddingTop: 4,
    flexShrink: 0,
  } as React.CSSProperties,

  disciplineLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-structure)',
    whiteSpace: 'nowrap' as const,
    display: 'block',
  } as React.CSSProperties,

  disciplineText: {
    borderLeft: '1px solid rgba(58,158,164,0.25)',
    paddingLeft: 28,
    fontSize: 16,
    lineHeight: 1.85,
    color: 'var(--color-text-dim)',
  } as React.CSSProperties,

  // Section 03 — Reveal
  reveal: {
    padding: '80px 48px 96px',
    maxWidth: 860,
    margin: '0 auto',
  } as React.CSSProperties,

  revealInner: {
    display: 'flex',
    gap: 56,
    alignItems: 'flex-start',
  } as React.CSSProperties,

  photo: {
    width: 280,
    height: 340,
    objectFit: 'cover' as const,
    objectPosition: 'center top',
    borderRadius: 4,
    border: '1px solid rgba(58,158,164,0.2)',
    flexShrink: 0,
    clipPath: 'inset(100% 0 0 0)',  // animated by GSAP
    display: 'block',
  } as React.CSSProperties,

  revealContent: {
    flex: 1,
    paddingTop: 12,
  } as React.CSSProperties,

  revealName: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 32,
    fontWeight: 400,
    color: 'var(--color-text)',
    marginBottom: 4,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  revealTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-structure)',
    marginBottom: 24,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  revealRule: {
    width: 0,           // animated to 48px by GSAP
    height: 1,
    background: 'rgba(58,158,164,0.35)',
    marginBottom: 24,
  } as React.CSSProperties,

  revealStatement: {
    fontSize: 18,
    lineHeight: 1.75,
    color: 'var(--color-text-dim)',
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  // Section 04 — For Whom
  forWhom: {
    padding: '80px 48px',
    maxWidth: 620,
    margin: '0 auto',
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  forWhomText: {
    fontSize: 18,
    lineHeight: 1.85,
    color: 'var(--color-text-dim)',
    marginBottom: 24,
  } as React.CSSProperties,

  forWhomClose: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 24,
    color: 'var(--color-text)',
    lineHeight: 1.4,
  } as React.CSSProperties,

  // Section 05 — CTA
  cta: {
    padding: '72px 48px 120px',
    maxWidth: 620,
    margin: '0 auto',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  ctaLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--color-context)',
    marginBottom: 14,
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  ctaEmail: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 'clamp(22px, 2.8vw, 32px)',
    color: 'var(--color-insight)',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(247,38,88,0.35)',
    paddingBottom: 3,
    display: 'inline-block',
    letterSpacing: '-0.01em',
    transition: 'border-color 0.25s',
  } as React.CSSProperties,
} as const;

// ─── Discipline data ────────────────────────────────────────────────────────

const DISCIPLINES = [
  {
    label: 'Visual Arts',
    text: (
      <>
        I spent years learning to read structure before I could name it. A frame — like a sentence, like a lesson — is always a decision about{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>what gets to exist and what doesn't.</em>{' '}
        The camera taught me to see that before I had the language for it.
      </>
    ),
  },
  {
    label: 'Creative Writing',
    text: (
      <>
        A degree in creative writing taught me that sequence is a form of care.{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>The order you give someone information is a decision about what they're ready to hold.</em>{' '}
        Most people who are trying to teach never think about that second part.
      </>
    ),
  },
  {
    label: 'Instructional Design',
    text: (
      <>
        The MA gave me the vocabulary for both. I got it specifically because I could see the creator economy heading toward education — with no structural framework following it — and I wanted to be ready when it arrived.
      </>
    ),
  },
] as const;

// ─── Component ──────────────────────────────────────────────────────────────

export const AboutPage: React.FC = () => {
  const openingRef = useRef<HTMLElement>(null);
  const { ref: pathRef, inView: pathInView } = useScrollTrigger({ threshold: 0.15 });
  const { ref: revealRef, inView: revealInView } = useScrollTrigger({ threshold: 0.15 });
  const { ref: forWhomRef, inView: forWhomInView } = useScrollTrigger({ threshold: 0.2 });
  const { ref: ctaRef, inView: ctaInView } = useScrollTrigger({ threshold: 0.3 });

  // Section 01 — mount animation (no scroll trigger)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-rule',
        { width: 0 },
        { width: 56, duration: 0.9, ease: 'power2.out', delay: 0.2 }
      );
      gsap.fromTo('.about-lead',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.5 }
      );
      gsap.fromTo('.about-opening-p',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out', delay: 0.85 }
      );
    }, openingRef);
    return () => ctx.revert();
  }, []);

  // Section 02 — path (scroll)
  useEffect(() => {
    if (!pathInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-discipline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' }
      );
    }, pathRef as React.RefObject<HTMLElement>);
    return () => ctx.revert();
  }, [pathInView]);

  // Section 03 — reveal (scroll)
  useEffect(() => {
    if (!revealInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-photo',
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo('.about-reveal-name',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.8 }
      );
      gsap.fromTo('.about-reveal-title',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.0 }
      );
      gsap.fromTo('.about-reveal-rule',
        { width: 0 },
        { width: 48, duration: 0.5, ease: 'power2.out', delay: 1.1 }
      );
      gsap.fromTo('.about-reveal-statement',
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 1.2 }
      );
    }, revealRef as React.RefObject<HTMLElement>);
    return () => ctx.revert();
  }, [revealInView]);

  // Section 04 — for whom (scroll)
  useEffect(() => {
    if (!forWhomInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-for-whom',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }, forWhomRef as React.RefObject<HTMLElement>);
    return () => ctx.revert();
  }, [forWhomInView]);

  // Section 05 — CTA (scroll)
  useEffect(() => {
    if (!ctaInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-cta',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }, ctaRef as React.RefObject<HTMLElement>);
    return () => ctx.revert();
  }, [ctaInView]);

  return (
    <main style={S.page}>

      {/* ── Section 01: Opening ───────────────────────────────── */}
      <section ref={openingRef} style={S.opening}>
        <div className="about-rule" style={S.rule} aria-hidden="true" />
        <h1 className="about-lead" style={S.lead}>
          <em style={S.leadAccent}>Here's what I know:</em>{' '}
          the difference between content that moves people and content that
          actually changes them is not talent. It's not reach. It's structure.
        </h1>
        <p className="about-opening-p" style={S.openingBody}>
          The kind that universities have been using quietly for decades — the
          architecture of how people actually learn — and the creator world has
          never been given access to.
        </p>
        <p className="about-opening-p about-opening-close" style={{ ...S.openingBody, ...S.openingClose }}>
          I went and got that structure.
        </p>
      </section>

      <div style={S.divider} aria-hidden="true" />

      {/* ── Section 02: Path ──────────────────────────────────── */}
      <section ref={pathRef as React.Ref<HTMLElement>} style={S.path}>
        {DISCIPLINES.map(({ label, text }) => (
          <div key={label} className="about-discipline" style={S.discipline}>
            <div style={S.disciplineMarker}>
              <span style={S.disciplineLabel}>{label}</span>
            </div>
            <p style={S.disciplineText}>{text}</p>
          </div>
        ))}
      </section>

      <div style={S.divider} aria-hidden="true" />

      {/* ── Section 03: Reveal ────────────────────────────────── */}
      <section ref={revealRef as React.Ref<HTMLElement>} style={S.reveal}>
        <div style={S.revealInner}>
          <img
            src="/jacklyn-miller.webp"
            alt="Jacklyn Miller"
            className="about-photo"
            style={S.photo}
            width={280}
            height={340}
          />
          <div style={S.revealContent}>
            <p className="about-reveal-name" style={S.revealName}>
              Jacklyn Miller
            </p>
            <p className="about-reveal-title" style={S.revealTitle}>
              Founder · Curiosity Inc.
            </p>
            <div className="about-reveal-rule" style={S.revealRule} aria-hidden="true" />
            <p className="about-reveal-statement" style={S.revealStatement}>
              Curiosity Inc. is what I built once I had the words for what I'd
              been seeing.{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>
                The architecture that was missing.
              </em>
            </p>
          </div>
        </div>
      </section>

      <div style={S.divider} aria-hidden="true" />

      {/* ── Section 04: For Whom ──────────────────────────────── */}
      <section ref={forWhomRef as React.Ref<HTMLElement>}>
        <div className="about-for-whom" style={S.forWhom}>
          <p style={S.forWhomText}>
            If you're a creator whose work deserves to outlast the algorithm —
            if you're ready to teach on purpose, not just perform knowledge —
            this is what we're here for.
          </p>
          <p style={S.forWhomClose}>The difference is everything.</p>
        </div>
      </section>

      {/* ── Section 05: CTA ───────────────────────────────────── */}
      <section ref={ctaRef as React.Ref<HTMLElement>}>
        <div className="about-cta" style={S.cta}>
          <p style={S.ctaLabel}>Start with an email.</p>
          <a
            href="mailto:jacklyn@curiosityinc.online"
            style={S.ctaEmail}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-insight)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(247,38,88,0.35)')}
          >
            jacklyn@curiosityinc.online
          </a>
        </div>
      </section>

    </main>
  );
};
```

- [ ] **Step 2: Run the tests — expect most to pass**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run src/tests/About.test.tsx 2>&1 | tail -30
```
Expected: 8/8 passing.

If any fail, read the failure message carefully. Common remaining issue:
- `clipPath` not supported in jsdom: this doesn't affect tests — GSAP is mocked and no DOM property assertions are made.

- [ ] **Step 3: Run the full test suite to ensure no regressions**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run 2>&1 | tail -20
```
Expected: all previously passing tests still pass (59+8 = 67 total).

- [ ] **Step 4: Commit**

```bash
git add src/pages/About.tsx src/tests/About.test.tsx
git commit -m "feat: build AboutPage — five-section manifesto with GSAP reveals"
```

---

## Chunk 3: Wiring

### Task 4: Wire route, navigation, and prerender

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/navigation/Navigation.tsx`
- Modify: `scripts/prerender.ts`

- [ ] **Step 1: Add lazy import and route in `src/App.tsx`**

Add after the `AuditRequest` lazy import on line 11:
```tsx
const AboutPage = lazy(() => import('./pages/About').then(m => ({ default: m.AboutPage })));
```

Add after the `/audit` route on line 47:
```tsx
<Route path="/about" element={<AboutPage />} />
```

Final `AppRoutes` routes block should look like:
```tsx
<Routes>
  <Route path="/"                element={<HomePage />} />
  <Route path="/audit"           element={<AuditRequest />} />
  <Route path="/about"           element={<AboutPage />} />
  <Route path="/test-components" element={<TestComponents />} />
  <Route path="/work/:slug"      element={<CaseStudyPage />} />
  <Route path="/writing/:slug"   element={<ArticlePage />} />
  <Route path="*"                element={<NotFoundPage />} />
</Routes>
```

- [ ] **Step 2: Update Navigation.tsx — separate About from scroll links**

Current `SECTION_LINKS` (lines 4–8):
```ts
const SECTION_LINKS = [
  { label: 'WORK',    href: '#work',    path: '/' },
  { label: 'WRITING', href: '#writing', path: '/' },
  { label: 'ABOUT',   href: '#about',   path: '/' },
];
```

Replace with two separate constants — scroll links (Work, Writing) and the About route link:
```tsx
const SECTION_LINKS = [
  { label: 'WORK',    href: '#work',    path: '/' },
  { label: 'WRITING', href: '#writing', path: '/' },
];

const ABOUT_LINK = { label: 'ABOUT', path: '/about' };
```

Then update the IntersectionObserver section IDs array (line 41) to remove `'about'`:
```tsx
['hero', 'work', 'writing'].forEach(id => {
```

Then update the nav links rendering section to add the About link separately after the `SECTION_LINKS` map. The About link should:
- Always render as `<Link to="/about">`
- Be active when `location.pathname === '/about'`

Replace the `<ul className="nav-links">` block with:
```tsx
<ul className="nav-links">
  {SECTION_LINKS.map(link => {
    const isActive = activeSection === link.href.replace('#', '');
    return (
      <li key={link.label}>
        {isHome ? (
          <a
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector(link.href);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`nav-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </a>
        ) : (
          <Link to={link.path} className="nav-link">
            {link.label}
          </Link>
        )}
      </li>
    );
  })}
  <li>
    <Link
      to={ABOUT_LINK.path}
      className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
    >
      {ABOUT_LINK.label}
    </Link>
  </li>
</ul>
```

- [ ] **Step 3: Add prerender entry in `scripts/prerender.ts`**

After the last `workMeta` route entry (after the Tiago Forte entry), add:
```ts
{
  path: '/about',
  workMeta: {
    title: 'About — Curiosity Inc.',
    description: 'Jacklyn Miller is the founder of Curiosity Inc. — building the instructional architecture the creator economy was missing.',
  },
},
```

Note: check the exact field name used in `scripts/prerender.ts` — the type is `WorkMeta = { title: string; description: string }` and the field on the `Route` type is `workMeta`. Confirm before editing.

- [ ] **Step 4: TypeScript check — confirm no type errors from wiring changes**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx tsc --noEmit 2>&1 | head -20
```
Expected: no output (zero errors).

- [ ] **Step 5: Run full test suite**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run 2>&1 | tail -20
```
Expected: all tests passing. No regressions.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/navigation/Navigation.tsx scripts/prerender.ts
git commit -m "feat: wire /about route, nav link, and prerender entry"
```

---

## Chunk 4: Verification and close

### Task 5: Final verification and Project_Progress update

**Files:**
- Modify: `docs/Project_Progress.md`

- [ ] **Step 1: Run full test suite with verbose output**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx vitest run --reporter=verbose 2>&1 | tail -40
```
Expected: all previously passing tests still pass plus 8 new AboutPage tests. **Note the exact count from this output — use it in Step 3, not any assumed number.**

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/gingerninja/Sites/claudessetup && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 3: Update Project_Progress.md**

Add to the "Components Built & Proven" list (after item 17, Audit Request Form):
```markdown
18. **About Page** — Five-section manifesto at `/about`. Conviction-first opening, three-discipline path, photo reveal (Jacklyn Miller), direct address, email CTA. 8 tests passing.
```

Update "Current Status" test count to match the actual count from Step 1's output.

- [ ] **Step 4: Final commit**

```bash
git add docs/Project_Progress.md
git commit -m "docs: update Project_Progress — About page complete"
```
