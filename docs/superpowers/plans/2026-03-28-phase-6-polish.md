# Phase 6: Polish — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Production-ready polish pass — performance, mobile layout, meta/SEO completeness, and WCAG 2.2 AA compliance.

**Architecture:** Fix issues in-place across existing files. No new components. No new pages. Each task targets one surface area with zero cross-task dependencies (safe to parallelize).

**Tech Stack:** React 19, Vite 8, GSAP, Tailwind (utility classes), plain CSS (index.css / case-study.css), TypeScript.

---

## Audit Findings (Baseline)

| Issue | Severity | File |
|-------|----------|------|
| Three.js 883KB chunk loads eagerly on homepage | Perf | `src/pages/index.tsx` |
| About page: hardcoded `48px` side padding, no mobile adaptation | Mobile | `src/pages/About.tsx` |
| About page: portrait + text flex row — never stacks on mobile | Mobile | `src/pages/About.tsx` |
| ArticlePage: TOC sidebar never hides on mobile | Mobile | `src/pages/ArticlePage.tsx`, `src/components/article/ArticleTOC.tsx` |
| Domain inconsistency: `curiosityinc.online` (index.html) vs `curiosityinc.co` (prerender.ts, ArticlePage) | SEO | `index.html`, `scripts/prerender.ts` |
| Favicon is placeholder `vite.svg` | SEO | `index.html`, `public/` |
| Per-page prerender missing `og:url` + `twitter:card` per page | SEO | `scripts/prerender.ts` |
| `/audit` route not prerendered | SEO | `scripts/prerender.ts` |
| AnnotationThread marked "not built" in progress doc — it IS built | Docs | `docs/Project_Progress.md` |

**Not in scope this phase:** `og:image` (requires design asset creation — separate task).

---

## Chunk 1: Performance

### Task 1: Lazy-load HeroSection (defer Three.js 883KB)

**Why:** `HeroSection` is statically imported on the homepage. This forces the browser to fetch the `three` chunk immediately on page load, blocking the main thread and hurting LCP. Wrapping it in `React.lazy()` + `Suspense` converts it to a dynamic import that only fetches when React renders the component — after the initial paint.

**Files:**
- Modify: `src/pages/index.tsx:1-15` (import change only)

- [ ] **Step 1: Write the failing test**

  In `src/tests/Homepage.test.tsx` (create if absent — check with `ls src/tests/Homepage.test.tsx`):

  ```tsx
  // src/tests/Homepage.test.tsx
  import { render, screen } from '@testing-library/react';
  import { MemoryRouter } from 'react-router-dom';
  import { describe, it, expect, vi } from 'vitest';

  // Mock HeroSection so Suspense doesn't time out in jsdom
  vi.mock('../components/hero/HeroSection', () => ({
    HeroSection: () => <div data-testid="hero-section">hero</div>,
  }));

  import { default as HomePage } from '../pages/index';

  describe('Homepage lazy HeroSection', () => {
    it('renders hero placeholder while loading', () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
      // HeroFallback renders synchronously while HeroSection chunk loads
      expect(document.getElementById('hero')).toBeTruthy();
    });
  });
  ```

  Run: `npm test -- --run src/tests/Homepage.test.tsx`
  Expected: FAIL or PASS (baseline check — the mock may make it pass immediately, that's fine).

- [ ] **Step 2: Replace static import with React.lazy**

  Open `src/pages/index.tsx`. Find:

  ```tsx
  import { HeroSection } from '../components/hero/HeroSection';
  ```

  Replace with:

  ```tsx
  import { lazy, Suspense } from 'react';
  import { HeroFallback } from '../components/hero/HeroFallback';
  const HeroSection = lazy(() =>
    import('../components/hero/HeroSection').then(m => ({ default: m.HeroSection }))
  );
  ```

  Then find where `<HeroSection />` is rendered and wrap it:

  ```tsx
  <Suspense fallback={<HeroFallback />}>
    <HeroSection />
  </Suspense>
  ```

- [ ] **Step 3: Run tests**

  ```bash
  npm test -- --run
  ```

  Expected: All tests pass (67+).

- [ ] **Step 4: Build and verify Three.js chunk is not in entry chunk**

  ```bash
  npm run build 2>&1 | grep -E "three|vendor|index"
  ```

  Expected: `three-*.js` listed separately. The main `index-*.js` chunk should be smaller than before.

- [ ] **Step 5: Commit**

  ```bash
  git add src/pages/index.tsx
  git commit -m "perf: lazy-load HeroSection to defer Three.js 883KB chunk"
  ```

---

## Chunk 2: Mobile Layouts

### Task 2: About page — mobile padding and portrait stacking

**Why:** Every section in `About.tsx` uses hardcoded `padding: '96px 48px'` or similar. On a 375px screen, 48px side padding leaves only 279px of content width — crushingly narrow. The portrait section (`revealInner`) is a flex row with a `width: 280` fixed-size image that will overflow.

**Files:**
- Modify: `src/pages/About.tsx` (style constants only — no logic changes)
- Modify: `src/index.css` (add `.about-reveal-inner` and `.about-discipline` responsive classes)

The strategy: replace hardcoded padding values in `About.tsx` style constants with `clamp()`, and extract the two layout-breaking sections into CSS classes that can have media queries.

- [ ] **Step 1: Write the failing test**

  In `src/tests/About.test.tsx`, add:

  ```tsx
  it('photo section renders inside a container that can stack', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    // The reveal section should use a CSS class, not a hardcoded flex row
    const revealInner = document.querySelector('.about-reveal-inner');
    expect(revealInner).toBeTruthy();
  });
  ```

  Run: `npm test -- --run src/tests/About.test.tsx`
  Expected: FAIL (`.about-reveal-inner` doesn't exist yet).

- [ ] **Step 2: Fix padding via clamp() in About.tsx style constants**

  In `src/pages/About.tsx`, update the `S` object:

  ```tsx
  opening: {
    minHeight: '82vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    padding: 'clamp(80px, 12vw, 120px) clamp(20px, 6vw, 48px) 80px',
    maxWidth: 760,
    margin: '0 auto',
  } as React.CSSProperties,

  divider: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '0 clamp(20px, 6vw, 48px)',
    height: 1,
    background: 'rgba(255,255,255,0.06)',
  } as React.CSSProperties,

  path: {
    padding: 'clamp(60px, 10vw, 96px) clamp(20px, 6vw, 48px)',
    maxWidth: 760,
    margin: '0 auto',
  } as React.CSSProperties,

  reveal: {
    padding: 'clamp(60px, 8vw, 80px) clamp(20px, 6vw, 48px) clamp(60px, 8vw, 96px)',
    maxWidth: 860,
    margin: '0 auto',
  } as React.CSSProperties,

  forWhom: {
    padding: 'clamp(60px, 8vw, 80px) clamp(20px, 6vw, 48px)',
    maxWidth: 620,
    margin: '0 auto',
    opacity: 0,
  } as React.CSSProperties,
  ```

- [ ] **Step 3: Convert revealInner to a CSS class**

  In `src/pages/About.tsx`, remove `revealInner` from the `S` object and change the JSX:

  ```tsx
  // Before:
  <div style={S.revealInner}>

  // After:
  <div className="about-reveal-inner">
  ```

  Remove the `revealInner` entry from `S`:
  ```tsx
  // DELETE this:
  revealInner: {
    display: 'flex',
    gap: 56,
    alignItems: 'flex-start',
  } as React.CSSProperties,
  ```

  Add CSS in `src/index.css` (append at end of file, before any final rules):

  ```css
  /* ABOUT PAGE */
  .about-reveal-inner {
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: flex-start;
  }

  @media (min-width: 640px) {
    .about-reveal-inner {
      flex-direction: row;
      gap: 56px;
    }
  }
  ```

- [ ] **Step 4: Make portrait image responsive**

  In `src/pages/About.tsx`, find `S.photo` and update:

  ```tsx
  photo: {
    width: '100%',
    maxWidth: 280,
    height: 340,
    objectFit: 'cover' as const,
    objectPosition: 'center top',
    borderRadius: 4,
    border: '1px solid rgba(58,158,164,0.2)',
    flexShrink: 0,
    clipPath: 'inset(100% 0 0 0)',
    display: 'block',
  } as React.CSSProperties,
  ```

- [ ] **Step 5: Run tests**

  ```bash
  npm test -- --run src/tests/About.test.tsx
  ```

  Expected: All About tests pass including new one.

- [ ] **Step 6: Commit**

  ```bash
  git add src/pages/About.tsx src/index.css
  git commit -m "fix(mobile): About page — clamp padding, stack portrait on small screens"
  ```

---

### Task 3: ArticlePage — hide TOC sidebar on mobile

**Why:** `ArticlePage` uses `display: 'flex', gap: '48px'` with a sidebar (`ArticleTOC`) that has no responsive behavior. On mobile it renders as a very narrow column that pushes the article body to a fraction of the screen.

**Files:**
- Modify: `src/pages/ArticlePage.tsx` (add class to article wrapper + sidebar)
- Modify: `src/components/article/ArticleTOC.tsx` (add class)
- Modify: `src/index.css` (add `.article-layout`, `.article-toc` responsive rules)

- [ ] **Step 1: Write the failing test**

  In `src/tests/ArticlePage.test.tsx`, add:

  ```tsx
  it('article layout uses responsive class', () => {
    render(
      <MemoryRouter initialEntries={['/writing/the-accidental-educator']}>
        <Routes>
          <Route path="/writing/:slug" element={<ArticlePage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(document.querySelector('.article-layout')).toBeTruthy();
    expect(document.querySelector('.article-toc')).toBeTruthy();
  });
  ```

  Run: `npm test -- --run src/tests/ArticlePage.test.tsx`
  Expected: FAIL.

- [ ] **Step 2: Add CSS classes to ArticlePage**

  In `src/pages/ArticlePage.tsx`, change the `<article>` element:

  ```tsx
  // Before:
  <article
    style={{
      display: 'flex',
      gap: '48px',
      maxWidth: '960px',
      margin: '0 auto',
      padding: '80px 24px',
      alignItems: 'flex-start',
    }}
  >

  // After:
  <article className="article-layout">
  ```

  Add the CSS class to `src/index.css`:

  ```css
  /* ARTICLE PAGE */
  .article-layout {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 960px;
    margin: 0 auto;
    padding: clamp(48px, 8vw, 80px) clamp(20px, 6vw, 24px);
    align-items: flex-start;
  }

  @media (min-width: 768px) {
    .article-layout {
      flex-direction: row;
      gap: 48px;
    }
  }
  ```

- [ ] **Step 3: Add class to ArticleTOC wrapper**

  In `src/components/article/ArticleTOC.tsx`, find the outermost div and add `className="article-toc"`. Check the current structure first with Read, then add the class.

  Add to `src/index.css`:

  ```css
  .article-toc {
    display: none;
  }

  @media (min-width: 768px) {
    .article-toc {
      display: block;
    }
  }
  ```

- [ ] **Step 4: Run all tests**

  ```bash
  npm test -- --run
  ```

  Expected: All tests pass.

- [ ] **Step 5: Commit**

  ```bash
  git add src/pages/ArticlePage.tsx src/components/article/ArticleTOC.tsx src/index.css
  git commit -m "fix(mobile): hide article TOC sidebar below 768px, fix article layout padding"
  ```

---

## Chunk 3: Meta & SEO

### Task 4: Unify domain, add og:url + twitter:card per page, prerender /audit

**Why:** `index.html` references `curiosityinc.online` but all other files use `curiosityinc.co`. Per-page prerendering injects `og:title` and `og:description` but not `og:url` (required for proper social sharing) or `twitter:card`. The `/audit` page has no prerendered HTML.

**Files:**
- Modify: `index.html` (fix domain)
- Modify: `scripts/prerender.ts` (add og:url, twitter:card, /audit route)

- [ ] **Step 1: No test needed for static HTML changes. Verify via build output.**

- [ ] **Step 2: Fix domain in index.html**

  In `index.html`, find every instance of `curiosityinc.online` and change to `curiosityinc.co`. There are 3 occurrences:
  - `<meta property="og:url" content="https://curiosityinc.online/" />`
  - `<link rel="canonical" href="https://curiosityinc.online/" />`
  - The `@context` schema URL

  Final values:
  ```html
  <meta property="og:url" content="https://curiosityinc.co/" />
  <link rel="canonical" href="https://curiosityinc.co/" />
  "url": "https://curiosityinc.co",
  ```

- [ ] **Step 3: Add og:url + twitter:card to prerender injection**

  In `scripts/prerender.ts`, update `buildHeadTags` (for articles):

  ```typescript
  function buildHeadTags(article: Article): string {
    return [
      `<title>${escapeHtml(article.title)} — Curiosity Inc.</title>`,
      `<meta name="description" content="${escapeHtml(article.subtitle)}" />`,
      `<meta property="og:title" content="${escapeHtml(article.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(article.subtitle)}" />`,
      `<meta property="og:type" content="article" />`,
      `<meta property="og:url" content="https://curiosityinc.co/writing/${article.slug}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(article.title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(article.subtitle)}" />`,
      `<link rel="canonical" href="https://curiosityinc.co/writing/${article.slug}" />`,
    ].join('\n    ');
  }
  ```

  Update `buildWorkHeadTags` (for work + about):

  ```typescript
  function buildWorkHeadTags(meta: WorkMeta, path: string): string {
    return [
      `<title>${escapeHtml(meta.title)}</title>`,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`,
      `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:url" content="https://curiosityinc.co${path}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
      `<link rel="canonical" href="https://curiosityinc.co${path}" />`,
    ].join('\n    ');
  }
  ```

- [ ] **Step 4: Add /audit to prerender routes**

  In `scripts/prerender.ts`, in the `routes` array, add after the `/about` entry:

  ```typescript
  {
    path: '/audit',
    workMeta: {
      title: 'Request a Curiosity Audit — Curiosity Inc.',
      description: 'Start the conversation. A diagnostic session to analyze your content architecture and show you where the learning science breaks down.',
    },
  },
  ```

- [ ] **Step 5: Build and verify**

  ```bash
  npm run build 2>&1 | grep -E "✓|✗"
  ```

  Expected: 10 routes prerendered (was 9), all `✓`.

  ```bash
  grep -c "curiosityinc.online" dist/index.html dist/about/index.html 2>/dev/null
  ```

  Expected: `0` for both.

- [ ] **Step 6: Commit**

  ```bash
  git add index.html scripts/prerender.ts
  git commit -m "fix(seo): unify domain to curiosityinc.co, add og:url + twitter:card per page, prerender /audit"
  ```

---

### Task 5: Replace vite.svg favicon with brand favicon

**Why:** The site currently shows the Vite logo in browser tabs and bookmarks. This is a placeholder that shipped with the scaffold and was never replaced.

**Files:**
- Create: `public/favicon.svg`
- Modify: `index.html` (update favicon link)

The favicon should use brand colors — a minimal `✦` mark in Pink (#F72658) on transparent background, matching the nav logo.

- [ ] **Step 1: Create brand favicon SVG**

  Create `public/favicon.svg`:

  ```svg
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <text
      x="16"
      y="24"
      text-anchor="middle"
      font-family="system-ui, sans-serif"
      font-size="22"
      fill="#F72658"
    >✦</text>
  </svg>
  ```

- [ ] **Step 2: Update index.html**

  In `index.html`, find:

  ```html
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  ```

  Replace with:

  ```html
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  ```

- [ ] **Step 3: Verify build**

  ```bash
  npm run build 2>&1 | tail -5
  ls dist/favicon.svg
  ```

  Expected: file present in dist.

- [ ] **Step 4: Commit**

  ```bash
  git add public/favicon.svg index.html
  git commit -m "fix: replace vite.svg placeholder with brand favicon (pink star mark)"
  ```

---

## Chunk 4: Docs

### Task 6: Update Project_Progress.md

**Why:** The component table marks AnnotationThread as "not built" but `src/components/visualizations/AnnotationThread.tsx` exists and is fully implemented with GSAP animations, scroll triggers, and reduced-motion support. The doc is wrong.

**Files:**
- Modify: `docs/Project_Progress.md`

- [ ] **Step 1: Update the component table**

  Find:

  ```markdown
  | The Annotation Thread | *(not built)* | ❌ Not started | ✅ (in COMPONENT_SPEC.md) |
  ```

  Replace with:

  ```markdown
  | The Annotation Thread | `AnnotationThread.tsx` | ✅ Complete | ✅ |
  ```

- [ ] **Step 2: Update the phase header to Phase 11 and add Phase 6 completion note**

  Find the current status line at the top:

  ```markdown
  **Phase 10 Complete** — About page live. All 3 case studies fully built and routed. Article pages with static prerendering, TOC, and prev/next nav. **67 tests passing** across 11 test files.
  ```

  Update (adjust test count after running tests):

  ```markdown
  **Phase 11 In Progress** — Phase 6 polish pass: lazy-load perf, mobile layouts (About + ArticlePage), SEO/meta completeness (domain unified, og:url, twitter:card, /audit prerendered), brand favicon. AnnotationThread confirmed built. **67+ tests passing** across 11 test files.
  ```

- [ ] **Step 3: Add Phase 6 to the accomplishments section**

  After the Phase 10 section, add:

  ```markdown
  ### Phase 11: Phase 6 Polish

  - **Performance**: `HeroSection` (Three.js 883KB) lazy-loaded via `React.lazy()` + `Suspense`. Three.js chunk now deferred to after initial paint.
  - **Mobile — About**: Replaced hardcoded `48px` padding with `clamp()`. Portrait section stacks vertically on screens below 640px.
  - **Mobile — Article pages**: TOC sidebar hidden below 768px. Article layout uses responsive flex column → row.
  - **SEO**: Domain unified to `curiosityinc.co` across `index.html`, `prerender.ts`. Per-page prerender now injects `og:url` + `twitter:card`. `/audit` route added to prerender (10 routes total).
  - **Favicon**: Replaced `vite.svg` placeholder with brand `✦` mark in Pink.
  - **AnnotationThread**: Component confirmed complete in `AnnotationThread.tsx` — progress doc corrected.
  ```

- [ ] **Step 4: Update Road Ahead section**

  Update the Phase 11 candidates:

  ```markdown
  ## 4. Road Ahead — Phase 12 (TBD)

  Open questions to decide the next phase:

  - **og:image**: No OG image asset exists yet. Requires designing a 1200×630 social card. High impact for social sharing.
  - **Fourth case study**: More portfolio depth, follows established SCQA pattern.
  - **Lighthouse audit pass**: Run Lighthouse 10 in CI to establish performance baseline and catch regressions.
  - **WCAG 2.2 AA full audit**: Manual keyboard navigation pass, contrast ratio verification with a tool.
  - **Mobile — Case studies**: Inline styles in DanKoe/JustinWelsh/TiagoForte pages may need spot-fixes on very small screens.
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add docs/Project_Progress.md
  git commit -m "docs: correct AnnotationThread status, add Phase 6 accomplishments, update road ahead"
  ```

---

## Final Verification

- [ ] **Run full test suite**

  ```bash
  npm test -- --run
  ```

  Expected: All tests pass (67 or more).

- [ ] **Build succeeds with 10 prerendered routes**

  ```bash
  npm run build 2>&1 | grep -E "✓|✗|Prerendered"
  ```

  Expected: `Prerendered 10 routes.` No `✗`.

- [ ] **No domain inconsistency remains**

  ```bash
  grep -r "curiosityinc.online" dist/ index.html src/
  ```

  Expected: No output.

- [ ] **Three.js chunk is not statically bundled with homepage**

  ```bash
  npm run build 2>&1 | grep "three"
  ```

  Expected: `three-*.js` chunk listed (confirming it's separate, deferred).
