# Article Pages Design Spec
*Curiosity Inc. — Phase 9*

## Goal

Build 4 static-rendered `/writing/:slug` article pages with a TOC sidebar layout, per-page SEO meta tags, and prev/next navigation. Add a custom prerender script for clean static HTML generation at build time.

## Context

- Stack: React 19 + Vite 8 + TypeScript + React Router v7 + Tailwind v4 + GSAP
- Existing route: `/writing/:slug` → `<ArticlePage />` (currently a stub in `src/pages/index.tsx`)
- HeroSection already guards `typeof window === 'undefined'` — establishes the SSR-safety pattern new components must follow
- Blueprint line 330 says "no sidebar" — **this spec supersedes that line by explicit user decision in Phase 9 brainstorming**. The TOC sidebar was selected as the layout.

---

## New Dev Dependencies

```
tsx   — runs scripts/prerender.ts without a separate tsc compile step
```

Install: `npm install -D tsx`

Note: `@types/react-router-dom` v5 is already installed but is a legacy mismatch for React Router v7 (which ships its own types). Remove it: `npm uninstall @types/react-router-dom`. No replacement needed.

---

## SSG Approach

**Custom prerender script** (`scripts/prerender.ts`) using `react-dom/server` + `StaticRouter`.

**Critical import note:** In React Router v7, `StaticRouter` is exported from `react-router` (not `react-router-dom`):
```typescript
import { StaticRouter } from 'react-router'; // correct for RR v7
```

**React 19 metadata + head injection:** React 19's `renderToString` does NOT hoist `<title>`/`<meta>` into `<head>` — they appear inline in the rendered body string. To get them into `<head>` of the static HTML, the prerender script generates head tags directly from the article data and injects them via a `<!-- HEAD_INJECT -->` marker added to `index.html` during build.

### Two-step head injection

**Step 1 — Add marker to `index.html`:**
```html
<head>
  <!-- HEAD_INJECT -->
  ...existing head content...
</head>
```
This marker is added manually to `/index.html` (the Vite source template). It survives the build unchanged.

**Step 2 — Prerender script injects tags:**
```typescript
function buildHeadTags(article: Article): string {
  return `
  <title>${article.title} — Curiosity Inc.</title>
  <meta name="description" content="${article.subtitle}" />
  <meta property="og:title" content="${article.title}" />
  <meta property="og:description" content="${article.subtitle}" />
  <meta property="og:type" content="article" />
  <link rel="canonical" href="https://curiosityinc.co/writing/${article.slug}" />
  `.trim();
}

// For each article route:
const rendered = renderToString(<StaticRouter location={route}><App /></StaticRouter>);
let output = template
  .replace('<!-- HEAD_INJECT -->', buildHeadTags(article))
  .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
```

For the home route and case study route, `<!-- HEAD_INJECT -->` is replaced with an empty string (no article-specific tags needed for Phase 9).

### Full prerender script structure

```typescript
// scripts/prerender.ts
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createElement } from 'react';
import App from '../src/App';
import { articles } from '../src/data/articles';
import type { Article } from '../src/data/articles';

const template = readFileSync('dist/index.html', 'utf-8');

function buildHeadTags(article: Article): string { /* see above */ }

const routes: Array<{ path: string; article?: Article }> = [
  { path: '/' },
  { path: '/work/dan-koe-brand-architecture' },
  ...articles.map(a => ({ path: `/writing/${a.slug}`, article: a })),
];

for (const { path, article } of routes) {
  const rendered = renderToString(
    createElement(StaticRouter, { location: path }, createElement(App))
  );
  const headTags = article ? buildHeadTags(article) : '';
  const output = template
    .replace('<!-- HEAD_INJECT -->', headTags)
    .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
  const dir = `dist${path === '/' ? '' : path}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, output);
}
```

Note: `scripts/prerender.ts` is run via `tsx`, not `tsc -b`. It is not included in any tsconfig. This is intentional — it bypasses type-checking for the script. The script is simple enough that this is acceptable.

### Updated build script

```json
"build": "tsc -b && vite build && tsx scripts/prerender.ts"
```

---

## File Structure

```
index.html                        ← add <!-- HEAD_INJECT --> marker to <head>
src/
  data/
    articles.ts                   ← article data + types (NEW)
  pages/
    ArticlePage.tsx               ← template for /writing/:slug (REPLACE stub)
  components/
    article/
      ArticleTOC.tsx              ← sticky sidebar (NEW)
      ArticleBody.tsx             ← section + pull quote renderer (NEW)
      ArticleNav.tsx              ← prev/next footer navigation (NEW)
scripts/
  prerender.ts                    ← post-build SSG script (NEW)
```

`App.tsx` — no changes needed. Keeps `BrowserRouter`. The prerender script wraps with `StaticRouter` externally.

---

## Data Structure

```typescript
// src/data/articles.ts

export interface ArticleSection {
  id: string;           // anchor ID for TOC links (kebab-case)
  heading: string;      // displayed in TOC + article body as <h2>
  paragraphs: string[]; // body paragraphs
  pullQuote?: string;   // optional — rendered as <blockquote> with Pink accent
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  category: string;     // "LEARNING SCIENCE" | "DESIGN THEORY" | "METHODOLOGY" | "PHILOSOPHY"
  readTime: number;     // minutes, shown in sidebar
  order: number;        // 1–4, determines prev/next sequence
  sections: ArticleSection[];
}

export const articles: Article[] = [ /* defined below */ ];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

export function getPrevNext(slug: string): { prev: Article | null; next: Article | null } {
  const article = getArticleBySlug(slug);
  if (!article) return { prev: null, next: null };
  const prev = articles.find(a => a.order === article.order - 1) ?? null;
  const next = articles.find(a => a.order === article.order + 1) ?? null;
  return { prev, next };
}
```

---

## ArticlePage Template

Route: `/writing/:slug`

```tsx
// src/pages/ArticlePage.tsx
export function ArticlePage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug!);
  const { prev, next } = getPrevNext(slug!);

  if (!article) return <NotFoundPage />;

  return (
    <>
      {/* React 19 native metadata — hoists to <head> on client navigation.
          Static <head> tags are injected by scripts/prerender.ts at build time. */}
      <title>{article.title} — Curiosity Inc.</title>
      <meta name="description" content={article.subtitle} />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.subtitle} />
      <meta property="og:type" content="article" />
      <link rel="canonical" href={`https://curiosityinc.co/writing/${article.slug}`} />

      <article>
        <ArticleTOC sections={article.sections} category={article.category} readTime={article.readTime} />
        <div>
          <header>
            <div>{article.category} · {article.readTime} MIN</div>
            <h1>{article.title}</h1>
            <p>{article.subtitle}</p>
          </header>
          <ArticleBody sections={article.sections} />
          <ArticleNav prev={prev} next={next} />
        </div>
      </article>
    </>
  );
}
```

Layout: Two-column grid — 200px sticky TOC sidebar + main content (max-width 680px within right column). Design tokens from existing CSS variables.

---

## Components

### ArticleTOC

```typescript
interface ArticleTOCProps {
  sections: ArticleSection[];
  category: string;
  readTime: number;
}
```

- Sticky: `position: sticky; top: 80px`
- "CONTENTS" label: Teal (#3A9EA4), 9px, letter-spacing
- Section links: anchor `#${section.id}`, muted (#888) default
- Active section: Teal — `IntersectionObserver` in `useEffect` only (SSG-safe, browser-only)
- Category: Orange (#FA7714), 8px
- Read time: muted (#666), 8px

### ArticleBody

```typescript
interface ArticleBodyProps {
  sections: ArticleSection[];
}
```

- Per section: `<section>` wrapper, `<h2 id={section.id}>`, `<p>` per paragraph
- Pull quote: `<blockquote>` with 1px solid Pink (#F72658) left border, italic Instrument Serif, 70% opacity
- Body: #E8E6E0, line-height 1.75, max-width 680px
- No `window`/`document` references — fully SSG-safe

### ArticleNav

```typescript
interface ArticleNavProps {
  prev: Article | null;
  next: Article | null;
}
```

- Full-width footer row: prev left, next right, "Back to Writing" center
- Prev: `← {prev.title}` as `<Link to={/writing/${prev.slug}}>`, Teal
- Next: `{next.title} →` as `<Link>`, Teal
- Empty slot when null (flex layout, slot just empty)
- "Back to Writing" always rendered, links to `/#writing`

---

## The 4 Articles

Slugs confirmed matching homepage links in `src/pages/index.tsx:206-230`.

### 1. The Accidental Educator
```
slug:     the-accidental-educator
category: LEARNING SCIENCE
readTime: 12
order:    1
subtitle: Why every creator with an audience is running an unstructured classroom.
```

**Sections:**
1. `the-classroom-you-didnt-build` — The Classroom You Didn't Build
2. `how-parasocial-learning-works` — How Parasocial Learning Works
3. `the-curriculum-problem` — The Curriculum Problem *(pull quote)*
4. `what-deliberate-teaching-looks-like` — What Deliberate Teaching Looks Like
5. `designing-the-learning` — Designing the Learning, Not Just the Content

**Pull quote (section 3):** "The difference between a curriculum and a content calendar is intent. One is designed to produce transformation. The other is designed to produce engagement."

---

### 2. Negative Space as Active Agent
```
slug:     negative-space-as-active-agent
category: DESIGN THEORY
readTime: 8
order:    2
subtitle: What you leave out is the design.
```

**Sections:**
1. `the-shape-of-absence` — The Shape of Absence
2. `how-restraint-communicates` — How Restraint Communicates *(pull quote)*
3. `the-trust-signal` — The Trust Signal
4. `when-silence-becomes-strategy` — When Silence Becomes Strategy

**Pull quote (section 2):** "Restraint is not poverty of expression. It is the most precise form of it — the decision to withhold until the remaining elements carry more weight."

---

### 3. The Curiosity Loop Protocol
```
slug:     the-curiosity-loop-protocol
category: METHODOLOGY
readTime: 15
order:    3
subtitle: How to engineer sustained curiosity.
```

**Sections:**
1. `the-problem-with-passion` — The Problem With Passion
2. `what-curiosity-actually-is` — What Curiosity Actually Is
3. `the-loop-mechanics` — The Loop Mechanics *(pull quote)*
4. `interruption-as-catalyst` — Interruption as Catalyst
5. `building-your-loop` — Building Your Loop
6. `maintaining-tension` — Maintaining Tension

**Pull quote (section 3):** "A question you can answer immediately is not curious — it is just a lookup. Curiosity requires distance between the question and its resolution."

---

### 4. Eureka as Practice
```
slug:     eureka-as-practice
category: PHILOSOPHY
readTime: 10
order:    4
subtitle: Insight isn't accidental. It can be cultivated.
```

**Sections:**
1. `the-myth-of-sudden-insight` — The Myth of the Sudden Insight
2. `what-happens-before-the-eureka` — What Happens Before the Eureka
3. `incubation-is-not-idleness` — Incubation Is Not Idleness *(pull quote)*
4. `designing-for-discovery` — Designing for Discovery
5. `the-practice` — The Practice

**Pull quote (section 3):** "Archimedes was not idle in the bath. He had been working the problem for weeks. The bath was simply the first moment he stopped trying."

---

## Testing

### Test setup addition (`src/tests/setup.ts`)
Add `IntersectionObserver` mock — jsdom does not provide it, and ArticleTOC uses it in `useEffect`:
```typescript
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;
```

### Unit tests (`src/tests/articles.test.ts`)
- `getArticleBySlug` returns correct article for valid slug
- `getArticleBySlug` returns undefined for unknown slug
- `getPrevNext` returns `{ prev: null, next: <article2> }` for order=1
- `getPrevNext` returns `{ prev: <article3>, next: null }` for order=4
- `getPrevNext` returns correct prev and next for order=2

### Component tests (`src/tests/ArticlePage.test.tsx`)
- Renders article `<h1>` title and category for valid slug
- Renders `<NotFoundPage>` for unknown slug

### Component tests (`src/tests/ArticleNav.test.tsx`)
- Renders only next link when prev is null
- Renders only prev link when next is null
- Always renders "Back to Writing" link

### Component tests (`src/tests/ArticleBody.test.tsx`)
- Renders correct number of `<h2>` elements for a sections array
- Renders `<blockquote>` when pullQuote is defined
- Does not render `<blockquote>` when pullQuote is undefined

### SSG safety
- `ArticleBody` renders without error when `window` is undefined (no useEffect, no browser APIs)
- `ArticleTOC` renders without error when `window` is undefined (IntersectionObserver only in useEffect)

### Integration test for prerender output
- After running `tsx scripts/prerender.ts` against a built dist, `dist/writing/the-accidental-educator/index.html` exists
- That file contains `<title>The Accidental Educator — Curiosity Inc.</title>` inside `<head>` (not `<body>`)

---

## Out of Scope

- `og:image` per article
- Comments, sharing buttons, reading progress bar, author bio
- Writing index page changes
- Inline visualization components in articles
