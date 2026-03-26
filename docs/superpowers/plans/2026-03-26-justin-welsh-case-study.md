# Justin Welsh Case Study Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Justin Welsh Conversion Design case study page at `/work/justin-welsh-conversion-design` — a full 5-act SCQA narrative that audits his platform architecture against Merrill's ID principles and argues for the alignment of funnel with curriculum.

**Architecture:** Single-file case study component (`JustinWelshCaseStudy.tsx`) following the established `DanKoeCaseStudy.tsx` pattern. Acts 01 and 02 use custom inline JSX. Acts 03–04 reuse existing `Scaffold`, `Lens`, and `DeltaBridge` components. Act 05 is pure typography. The prerender script is extended to inject correct `<title>` and `<meta>` tags for work routes at build time.

**Tech Stack:** React 19, TypeScript, GSAP (ScrollTrigger), react-router-dom, Vitest + Testing Library, `tsx` for prerender script.

**Spec:** `docs/superpowers/specs/2026-03-26-justin-welsh-case-study-design.md`
**Reference:** `src/pages/DanKoeCaseStudy.tsx` (mirror this structure throughout)

---

## Files

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/pages/JustinWelshCaseStudy.tsx` | All 5 acts, profile card, platform audit grid, scaffold, lens, delta bridge, navigation |
| Create | `src/tests/JustinWelshCaseStudy.test.tsx` | All render tests |
| Modify | `src/pages/index.tsx` | Add import + routing branch for `justin-welsh-conversion-design` |
| Modify | `scripts/prerender.ts` | Add `WorkMeta` type, `buildWorkHeadTags`, update routes + render loop |

---

## Chunk 1: Infrastructure

### Task 1: Extend prerender script for work route SSG

The prerender script only injects `<title>` and `<meta>` tags for article routes. Work routes need the same treatment. This task fixes that for both Dan Koe (backfill) and Justin Welsh.

**Files:**
- Modify: `scripts/prerender.ts`

- [ ] **Step 1: Add `WorkMeta` type and `buildWorkHeadTags` function**

Open `scripts/prerender.ts`. After the existing `buildHeadTags` function (line 25), add:

```typescript
type WorkMeta = { title: string; description: string; slug: string };

function buildWorkHeadTags(meta: WorkMeta): string {
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<link rel="canonical" href="https://curiosityinc.co/work/${meta.slug}" />`,
  ].join('\n    ');
}
```

- [ ] **Step 2: Extend the `Route` type and update routes array**

Replace the existing `type Route` and `const routes` (lines 27–33):

```typescript
type Route = { path: string; article?: Article; workMeta?: WorkMeta };

const routes: Route[] = [
  { path: '/' },
  {
    path: '/work/dan-koe-brand-architecture',
    workMeta: {
      title: 'Dan Koe — Brand Architecture | Curiosity Inc.',
      description: 'What if 2.3M followers were students, not subscribers? A learning architecture case study.',
      slug: 'dan-koe-brand-architecture',
    },
  },
  {
    path: '/work/justin-welsh-conversion-design',
    workMeta: {
      title: 'Justin Welsh — Conversion Design | Curiosity Inc.',
      description: 'How aligning instructional design principles with the marketing funnel transforms an audience into a learning community — and a creator into a discipline founder.',
      slug: 'justin-welsh-conversion-design',
    },
  },
  ...articles.map(a => ({ path: `/writing/${a.slug}`, article: a })),
];
```

- [ ] **Step 3: Update the render loop to handle `workMeta`**

Inside the `for` loop, replace the existing head tag injection logic (lines 43–51):

```typescript
const { article, workMeta } = route as { path: string; article?: Article; workMeta?: WorkMeta };
const headTags = article
  ? buildHeadTags(article)
  : workMeta
    ? buildWorkHeadTags(workMeta)
    : '';

let output = template
  .replace('<!-- HEAD_INJECT -->', headTags)
  .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);

if (article || workMeta) {
  output = output.replace('<title>Curiosity Inc. — Digital Sanctuary</title>', '');
}
```

- [ ] **Step 4: Verify the script compiles**

```bash
cd /Users/gingerninja/Sites/claudessetup
npx tsx --tsconfig tsconfig.app.json scripts/prerender.ts 2>&1 | head -20
```

Expected: script runs (may fail on missing JustinWelshCaseStudy import — that's fine, we'll fix it in Task 2). If it fails with a TypeScript error in prerender.ts itself, fix that first.

- [ ] **Step 5: Commit**

```bash
git add scripts/prerender.ts
git commit -m "feat: add WorkMeta SSG support to prerender script, backfill Dan Koe route"
```

---

### Task 2: Add routing branch and write all tests

Create a minimal stub component so routing and tests can be written before the full implementation. All tests will fail until Acts are built — that is expected and correct.

**Files:**
- Create: `src/pages/JustinWelshCaseStudy.tsx` (stub)
- Modify: `src/pages/index.tsx`
- Create: `src/tests/JustinWelshCaseStudy.test.tsx`

- [ ] **Step 1: Create stub component**

Create `src/pages/JustinWelshCaseStudy.tsx`:

```typescript
// src/pages/JustinWelshCaseStudy.tsx
export function JustinWelshCaseStudy() {
  return <div>stub</div>;
}
```

- [ ] **Step 2: Add routing branch in `src/pages/index.tsx`**

Add import at the top of the file alongside existing imports:

```typescript
import { JustinWelshCaseStudy } from './JustinWelshCaseStudy';
```

In `CaseStudyPage`, add a branch before the shell fallback:

```typescript
if (slug === 'dan-koe-brand-architecture') {
  return <DanKoeCaseStudy />;
}

if (slug === 'justin-welsh-conversion-design') {
  return <JustinWelshCaseStudy />;
}
```

- [ ] **Step 3: Write the full test file**

Create `src/tests/JustinWelshCaseStudy.test.tsx`:

```typescript
// src/tests/JustinWelshCaseStudy.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { JustinWelshCaseStudy } from '../pages/JustinWelshCaseStudy';

function renderCaseStudy() {
  return render(
    <MemoryRouter initialEntries={['/work/justin-welsh-conversion-design']}>
      <Routes>
        <Route path="/work/:slug" element={<JustinWelshCaseStudy />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('JustinWelshCaseStudy', () => {
  it('renders without crashing', () => {
    renderCaseStudy();
  });

  it('renders creator name in the profile card', () => {
    renderCaseStudy();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Justin Welsh');
  });

  it('renders the hook question', () => {
    renderCaseStudy();
    expect(
      screen.getByText(/What if the ideas Justin Welsh teaches outlive the platforms/i)
    ).toBeInTheDocument();
  });

  it('renders all five Merrill\'s principle rows in the platform audit grid', () => {
    renderCaseStudy();
    expect(screen.getByText(/Activation/i)).toBeInTheDocument();
    expect(screen.getByText(/Demonstration/i)).toBeInTheDocument();
    expect(screen.getByText(/Application/i)).toBeInTheDocument();
    expect(screen.getByText(/Feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/Integration/i)).toBeInTheDocument();
  });

  it('renders four commitment ladder bands', () => {
    renderCaseStudy();
    expect(screen.getByText(/ATTENTION/i)).toBeInTheDocument();
    expect(screen.getByText(/MICRO-ACT/i)).toBeInTheDocument();
    expect(screen.getByText(/INTENT/i)).toBeInTheDocument();
    expect(screen.getByText(/IDENTITY/i)).toBeInTheDocument();
  });

  it('renders the Lens hero metric', () => {
    renderCaseStudy();
    expect(screen.getByText('5.1×')).toBeInTheDocument();
  });

  it('renders all three DeltaBridge metric labels', () => {
    renderCaseStudy();
    expect(screen.getByText(/Micro-Commitment Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Identity Adoption Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Subscriber LTV/i)).toBeInTheDocument();
  });

  it('renders the back navigation link', () => {
    renderCaseStudy();
    const backLink = screen.getByRole('link', { name: /Back to The Laboratory/i });
    expect(backLink).toHaveAttribute('href', '/#work');
  });
});
```

- [ ] **Step 4: Run tests — all should fail except "renders without crashing"**

```bash
cd /Users/gingerninja/Sites/claudessetup
npx vitest run src/tests/JustinWelshCaseStudy.test.tsx
```

Expected: 1 pass ("renders without crashing"), 7 fail. If more than 1 pass, the stub has unexpected content — check the stub and simplify it.

- [ ] **Step 5: Commit**

```bash
git add src/pages/JustinWelshCaseStudy.tsx src/pages/index.tsx src/tests/JustinWelshCaseStudy.test.tsx
git commit -m "test: add JustinWelshCaseStudy tests and routing stub"
```

---

## Chunk 2: Acts 01–02

### Task 3: Build Act 01 — Profile Card

The profile card is identical in structure to `DanKoeCaseStudy.tsx`. Copy and adapt. The key differences: initials `JW`, gradient ID `portrait-bg-jw`, different metadata values, and the Platform Distribution band on the left (which shows funnel position + ID role per platform in addition to follower counts).

**Files:**
- Modify: `src/pages/JustinWelshCaseStudy.tsx`

- [ ] **Step 1: Add all imports and the GSAP dynamic import guard**

Replace the stub content entirely. Begin the file:

```typescript
// src/pages/JustinWelshCaseStudy.tsx
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Scaffold } from '../components/visualizations/Scaffold';
import { Lens } from '../components/visualizations/Lens';
import { DeltaBridge } from '../components/visualizations/DeltaBridge';
import { useScrollTrigger } from '../hooks/useScrollTrigger';

if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  });
}
```

- [ ] **Step 2: Add the `ScqaMarker` helper** (identical to DK — copy verbatim, it's a local component):

```typescript
function ScqaMarker({ phase, act, title }: { phase: string; act: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-structure)', whiteSpace: 'nowrap', opacity: 0.9 }}>
        {phase}
      </span>
      <div style={{ flex: 1, height: '0.5px', backgroundColor: 'rgba(58,158,164,0.18)' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.4, whiteSpace: 'nowrap' }}>
        {act} / {title}
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Add the `EditorialPortrait` component with JW initials**

```typescript
function EditorialPortrait() {
  return (
    <div style={{ width: '160px', flexShrink: 0, aspectRatio: '4 / 5', border: '0.5px solid rgba(136,136,136,0.2)', overflow: 'hidden', position: 'relative', backgroundColor: 'rgba(255,255,255,0.015)' }}>
      <svg viewBox="0 0 160 200" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="portrait-bg-jw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A9EA4" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#1D1E20" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect width="160" height="200" fill="url(#portrait-bg-jw)" />
        <text x="80" y="116" textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: 'Georgia, serif', fontSize: '54px', fontStyle: 'italic', fill: 'rgba(58,158,164,0.22)', letterSpacing: '-0.04em' }}>
          JW
        </text>
        {[40, 55, 70, 140, 155, 170].map((y) => (
          <line key={y} x1="12" y1={y} x2="148" y2={y} stroke="rgba(58,158,164,0.06)" strokeWidth="0.5" />
        ))}
      </svg>
    </div>
  );
}
```

**Critical:** gradient ID must be `portrait-bg-jw` — NOT `portrait-bg`. Reusing the same ID causes both case studies to share one gradient when both are in the DOM.

- [ ] **Step 4: Build the main component shell and Act 01**

```typescript
export function JustinWelshCaseStudy() {
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.jw-profile-band',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power2.out', delay: 0.4 }
      );
      gsap.fromTo('.jw-profile-meta-col',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.9 }
      );
    }, profileRef);
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-void)', minHeight: '100vh' }}>
      {/* ═══ SITUATION — ACT 01 / THE PROFESSOR ═══ */}
      <section ref={profileRef} style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>

          {/* Case study identifier row */}
          <div className="jw-profile-band" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-structure)', whiteSpace: 'nowrap' }}>
              ✦ Curiosity Inc. / Case Study 02
            </span>
            <div style={{ flex: 1, height: '0.5px', backgroundColor: 'rgba(58,158,164,0.18)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.4, whiteSpace: 'nowrap' }}>
              Situation — Act 01 / The Professor
            </span>
          </div>

          {/* Profile Card */}
          <div style={{ border: '0.5px solid rgba(136,136,136,0.14)', backgroundColor: 'rgba(255,255,255,0.018)', overflow: 'hidden' }}>

            {/* TOP BAND — Name + Hook + Portrait */}
            <div className="jw-profile-band" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: '48px', padding: '48px 56px', borderBottom: '0.5px solid rgba(136,136,136,0.1)' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 8vw, 96px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.025em', margin: 0, marginBottom: '24px' }}>
                  Justin Welsh
                </h1>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px, 1.8vw, 22px)', fontStyle: 'italic', color: 'var(--color-insight)', lineHeight: 1.45, maxWidth: '560px', margin: 0 }}>
                  "What if the ideas Justin Welsh teaches outlive the platforms he teaches them on?"
                </p>
              </div>
              <EditorialPortrait />
            </div>

            {/* MIDDLE BAND — 5-column metadata */}
            <div className="jw-profile-band" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderBottom: '0.5px solid rgba(136,136,136,0.1)' }}>
              {[
                { label: 'Domain', value: 'Solopreneurship' },
                { label: 'Approach', value: 'Conversion Design' },
                { label: 'Flagship', value: 'The Operating System' },
                { label: 'Est.', value: '2019' },
                { label: 'Reach', value: '500K+ Followers' },
              ].map((meta, i) => (
                <div key={i} className="jw-profile-meta-col" style={{ padding: '24px 28px', borderRight: i < 4 ? '0.5px solid rgba(136,136,136,0.08)' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '8px' }}>
                    {meta.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1.35 }}>
                    {meta.value}
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM BAND — Platform Distribution + Target Topology */}
            <div className="jw-profile-band" style={{ display: 'grid', gridTemplateColumns: '1fr 0.5px 1fr' }}>
              {/* Platform Distribution */}
              <div style={{ padding: '32px 40px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '20px' }}>
                  Platform Distribution
                </div>
                {[
                  { platform: 'LinkedIn', value: '500,000', pct: 0.76, idRole: 'Activation + Demonstration' },
                  { platform: 'Newsletter', value: '150,000', pct: 0.23, idRole: 'Demonstration only' },
                  { platform: 'Courses', value: '—', pct: 0.05, idRole: 'Partial Application' },
                ].map((net, i) => (
                  <div key={i} style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text)', opacity: 0.65 }}>{net.platform}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-structure)' }}>{net.value}</span>
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'rgba(136,136,136,0.12)', position: 'relative', marginBottom: '4px' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${net.pct * 100}%`, backgroundColor: 'var(--color-structure)', opacity: 0.55 }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--color-context)', opacity: 0.4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {net.idRole}
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ backgroundColor: 'rgba(136,136,136,0.09)' }} />

              {/* Target Topology */}
              <div style={{ padding: '32px 40px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '20px' }}>
                  Target Topology
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontStyle: 'italic', color: 'var(--color-text)', opacity: 0.6, lineHeight: 1.65, margin: 0, marginBottom: '14px' }}>
                  "The corporate professional who wants to build a one-person business and escape the nine-to-five permanently."
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-context)', opacity: 0.35, letterSpacing: '0.08em', margin: 0 }}>
                  — Justin Welsh's own description of his audience
                </p>
              </div>
            </div>
          </div>

          {/* Concept study disclaimer */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-context)', opacity: 0.28, marginTop: '14px', letterSpacing: '0.06em' }}>
            ✦ Concept study — All projections are analytical estimates. Curiosity Inc. has no affiliation with Justin Welsh.
          </p>

          {/* Act 01 narrative */}
          <div style={{ marginTop: '64px', maxWidth: '680px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '24px' }}>
              500,000 LinkedIn followers. 150,000 newsletter subscribers. Two courses with thousands of students and $5M+ in revenue. Every post delivers one clean insight, one lesson, one clear takeaway. The delivery is exceptional.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '24px' }}>
              The ideas land. They inspire. The tab closes. Most of the audience does not change how they work.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-dim)' }}>
              This is not a reach problem. Not a content problem. Not a marketing problem. It is a curriculum problem.
            </p>
          </div>
        </div>
      </section>
      {/* Acts 02–05 placeholder — filled in subsequent tasks */}
    </div>
  );
}
```

- [ ] **Step 5: Run tests — creator name and hook question tests should now pass**

```bash
npx vitest run src/tests/JustinWelshCaseStudy.test.tsx
```

Expected: 3 pass (renders without crashing, creator name, hook question), 5 fail.

- [ ] **Step 6: Commit**

```bash
git add src/pages/JustinWelshCaseStudy.tsx
git commit -m "feat: add Act 01 profile card for Justin Welsh case study"
```

---

### Task 4: Build Act 02 — Platform Audit Grid

The ID audit is custom inline JSX. It renders in two sections: Section A (per-platform breakdown) and Section B (Merrill's principles summary). Both use scroll-triggered stagger animation.

**Files:**
- Modify: `src/pages/JustinWelshCaseStudy.tsx`

- [ ] **Step 1: Add the `useScrollTrigger` ref and audit grid section**

Add a second `useScrollTrigger` call at the top of `JustinWelshCaseStudy`:

```typescript
const { ref: auditRef, inView: auditInView } = useScrollTrigger(0.15);
```

Add a `useEffect` for the audit grid animation:

```typescript
useEffect(() => {
  if (!auditInView) return;
  gsap.fromTo('.jw-audit-row',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
  );
}, [auditInView]);
```

- [ ] **Step 2: Replace the Acts 02–05 placeholder with Act 02**

```typescript
{/* ═══ SITUATION CONTINUED — ACT 02 / THE PLATFORM AUDIT ═══ */}
<section ref={auditRef as React.RefObject<HTMLElement>} style={{ padding: '120px 0' }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
    <ScqaMarker phase="SITUATION (CONTINUED)" act="ACT 02" title="THE PLATFORM AUDIT" />

    <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '20px' }}>
        The question is not whether the content is good. The content is exceptional. The question is whether the platform architecture supports the full learning journey.
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-dim)' }}>
        Merrill's First Principles of Instruction defines the phases that produce durable learning — not momentary inspiration. Here is Justin Welsh's platform architecture audited against each one.
      </p>
    </div>

    {/* Section A — Per-Platform Breakdown */}
    <div style={{ marginBottom: '64px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.5, marginBottom: '24px' }}>
        Section A — Platform Architecture
      </div>
      {[
        {
          platform: 'LinkedIn',
          funnel: 'TOFU',
          format: 'Hook → Insight → Takeaway. Self-contained. Nothing asked of the reader.',
          principles: 'Activation ✓  Demonstration ✓',
          gap: 'Application — insight delivered, practice never designed.',
          status: 'partial' as const,
        },
        {
          platform: 'Newsletter',
          funnel: 'MOFU',
          format: 'One insight expanded. Deep, well-written, passive. No assignment, no reply mechanism.',
          principles: 'Demonstration ✓',
          gap: 'Application, Feedback — no designed practice, no outcome measurement.',
          status: 'partial' as const,
        },
        {
          platform: 'Courses',
          funnel: 'BOFU',
          format: 'Video library. Self-paced. No checkpoints, no cohort, no peer review.',
          principles: 'Partial Application ◐',
          gap: 'Feedback, Integration — no outcome documentation, zero data flows back.',
          status: 'partial' as const,
        },
        {
          platform: '— MISSING —',
          funnel: 'POST-CONVERSION',
          format: 'Nothing. The learning ends at the transaction.',
          principles: '—',
          gap: 'Integration, Outcome Documentation — no community, no feedback loop, no IP foundation.',
          status: 'absent' as const,
        },
      ].map((row, i) => (
        <div key={i} className="jw-audit-row" style={{
          display: 'grid',
          gridTemplateColumns: '160px 80px 1fr 160px 1fr',
          gap: '0',
          borderBottom: '0.5px solid rgba(136,136,136,0.08)',
          borderLeft: `4px solid ${row.status === 'absent' ? 'rgba(247,38,88,0.4)' : 'rgba(58,158,164,0.4)'}`,
          marginBottom: '2px',
          opacity: 0,
        }}>
          {[
            { label: 'Platform', value: row.platform, mono: true },
            { label: 'Funnel', value: row.funnel, mono: true },
            { label: 'Current Format', value: row.format, mono: false },
            { label: 'ID Served', value: row.principles, mono: true },
            { label: 'Gap', value: row.gap, mono: false },
          ].map((cell, j) => (
            <div key={j} style={{ padding: '16px 20px', borderRight: j < 4 ? '0.5px solid rgba(136,136,136,0.06)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.4, marginBottom: '6px' }}>
                {cell.label}
              </div>
              <div style={{ fontFamily: cell.mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: cell.mono ? '10px' : '12px', color: row.status === 'absent' ? 'rgba(247,38,88,0.7)' : 'var(--color-text)', lineHeight: 1.5, opacity: row.status === 'absent' ? 1 : 0.75 }}>
                {cell.value}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>

    {/* Section B — Merrill's Principles Summary */}
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.5, marginBottom: '8px' }}>
        Section B — Merrill's First Principles
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-dim)', marginBottom: '24px' }}>
        The pattern across every platform is the same. Activation and demonstration are excellent. Application, feedback, and integration don't exist anywhere in the architecture.
      </p>
      {[
        { principle: 'Activation', platform: 'LinkedIn', status: 'present' as const, note: 'Resonance is high. Posts connect to the solopreneur identity.' },
        { principle: 'Demonstration', platform: 'LinkedIn + Newsletter', status: 'present' as const, note: 'Tactical examples throughout. Well executed.' },
        { principle: 'Application', platform: 'Newsletter (ideal)', status: 'absent' as const, note: 'No designed practice anywhere in the architecture.' },
        { principle: 'Feedback', platform: 'Courses', status: 'absent' as const, note: 'No outcome measurement. No correction mechanism.' },
        { principle: 'Integration', platform: 'Practitioner Community (missing)', status: 'absent' as const, note: 'No platform exists for this phase.' },
      ].map((row, i) => (
        <div key={i} className="jw-audit-row" style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0',
          padding: '14px 0',
          borderBottom: '0.5px solid rgba(136,136,136,0.06)',
          borderLeft: `4px solid ${row.status === 'present' ? 'var(--color-structure)' : 'rgba(247,38,88,0.35)'}`,
          paddingLeft: '20px',
          opacity: 0,
        }}>
          <div style={{ width: '140px', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: row.status === 'present' ? 'var(--color-structure)' : 'rgba(247,38,88,0.7)', marginBottom: '2px' }}>
              {row.principle}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--color-context)', opacity: 0.4 }}>
              {row.status === 'present' ? 'PRESENT' : 'ABSENT'}
            </div>
          </div>
          <div style={{ width: '220px', flexShrink: 0, paddingRight: '24px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text)', opacity: 0.55 }}>{row.platform}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text)', opacity: 0.65, lineHeight: 1.5 }}>
            {row.note}
          </div>
        </div>
      ))}
    </div>

    {/* Closing narrative */}
    <div style={{ maxWidth: '680px', marginTop: '64px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '20px' }}>
        Justin Welsh has built a world-class broadcast infrastructure. Every platform delivers content. None of them ask anything back.
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-dim)' }}>
        Without a feedback loop, there is no outcome data. Without outcome data, there is no framework. Without a framework, there is no licensable IP. The platform architecture isn't just a learning problem — it is what stands between Justin Welsh's ideas and their permanent contribution to the field.
      </p>
    </div>
  </div>
</section>
{/* Acts 03–05 placeholder */}
```

- [ ] **Step 3: Run tests — Merrill's principles test should now pass**

```bash
npx vitest run src/tests/JustinWelshCaseStudy.test.tsx
```

Expected: 4 pass (renders, name, hook, Merrill's principles). 4 fail.

- [ ] **Step 4: Commit**

```bash
git add src/pages/JustinWelshCaseStudy.tsx
git commit -m "feat: add Act 02 platform audit grid for Justin Welsh case study"
```

---

## Chunk 3: Acts 03–05

### Task 5: Build Act 03 — The Commitment Ladder

Uses the existing `Scaffold` component with four bands. Each band maps to a specific platform and content redesign. The `expandedContent` explains why each rung creates demand for the one above it.

**Files:**
- Modify: `src/pages/JustinWelshCaseStudy.tsx`

- [ ] **Step 1: Replace the Acts 03–05 placeholder with Act 03**

```typescript
{/* ═══ QUESTION — ACT 03 / THE COMMITMENT LADDER ═══ */}
<section style={{ padding: '120px 0' }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
    <ScqaMarker phase="QUESTION" act="ACT 03" title="THE COMMITMENT LADDER" />

    <div style={{ maxWidth: '680px', marginBottom: '64px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '20px' }}>
        The marketing funnel doesn't disappear. It gets a curriculum. Each platform is redesigned around a specific instructional purpose — and each purpose creates the demand that makes the next rung inevitable.
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-dim)' }}>
        This answers the implicit question: if activation and application are freely available, why would anyone buy the course? Because each free rung creates the problem the next paid rung solves.
      </p>
    </div>

    <Scaffold
      direction="up"
      bands={[
        {
          level: 'foundational',
          accentColor: 'structure',
          title: 'ATTENTION — LinkedIn',
          body: 'Hook → Insight → Micro-commitment prompt. "Map your skills to a market this week. Drop what you found below." The reader acts as a solopreneur before they believe they are one.',
          expandedContent: 'The post ends with a small, designed ask. Partial success follows — and partial success reveals the gap. "This works. I don\'t know what to do next." That gap is what the newsletter is designed to fill. The activation rung creates demand for the application rung.',
        },
        {
          level: 'intermediate',
          accentColor: 'context',
          title: 'MICRO-ACT — Newsletter',
          body: 'Concept → Worked example → Weekly assignment. "Apply it this week and reply with what you found." One technique per week, applied in isolation. Replies become outcome data.',
          expandedContent: 'The newsletter creates momentum — and exposes the absence of a coherent system. Individual techniques don\'t connect. The student feels: "I\'m applying ideas but I have no architecture." The course becomes the obvious answer. The newsletter buyer is not a cold lead. They have already proved the methodology works for them.',
        },
        {
          level: 'advanced',
          accentColor: 'transformation',
          title: 'INTENT — Courses',
          body: 'Each module: Lesson → Exercise → Peer review. Cohort rhythm. Progress milestones. "Module complete when you submit X." The full operating system — not more content, but the designed progression that connects all the techniques.',
          expandedContent: 'The course sells certainty, not information. The buyer has already done ten newsletter assignments. They know the methodology works for them. The course gives them the structure the newsletter couldn\'t — and for the first time, outcomes are documented. The framework begins to accumulate evidence.',
        },
        {
          level: 'mastery',
          accentColor: 'insight',
          title: 'IDENTITY / ACTION — Practitioner Community',
          body: 'Weekly challenges. Case study submissions. Peer review cycles. The student practises with peers. Identity adoption is reinforced through action, not aspiration. Justin shifts from publisher to curator and validator.',
          expandedContent: 'This is the feedback loop. Every challenge submission is a data point. Every peer review surfaces a failure mode. Every case study documents a real-world application of the methodology. The community generates the evidence base that transforms great content into a provable, refineable, licensable framework. Without this layer, the IP cannot exist.',
        },
      ]}
    />

    <div style={{ maxWidth: '680px', marginTop: '64px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '20px' }}>
        When the ladder is designed, conversion stops being a cliff. The audience doesn't decide to buy. They arrive at purchase having already made a hundred smaller commitments that made it inevitable.
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-dim)' }}>
        And for the first time: every step is measured. The outcome data accumulates. The methodology improves. The framework becomes real.
      </p>
    </div>
  </div>
</section>
{/* Acts 04–05 placeholder */}
```

- [ ] **Step 2: Run tests — commitment ladder test should now pass**

```bash
npx vitest run src/tests/JustinWelshCaseStudy.test.tsx
```

Expected: 5 pass. 3 fail (Lens, DeltaBridge, navigation).

- [ ] **Step 3: Commit**

```bash
git add src/pages/JustinWelshCaseStudy.tsx
git commit -m "feat: add Act 03 commitment ladder scaffold for Justin Welsh case study"
```

---

### Task 6: Build Act 04 — The Architecture (Lens + DeltaBridge)

**Files:**
- Modify: `src/pages/JustinWelshCaseStudy.tsx`

- [ ] **Step 1: Replace the Acts 04–05 placeholder with Act 04**

```typescript
{/* ═══ ANSWER — ACT 04 / THE ARCHITECTURE ═══ */}
<section style={{ padding: '120px 0' }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
    <ScqaMarker phase="ANSWER" act="ACT 04" title="THE ARCHITECTURE" />

    <div style={{ maxWidth: '680px', marginBottom: '80px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75 }}>
        When the ladder is designed, the numbers follow. Not because the CTA changed. Not because the marketing improved. Because everything before the CTA was built to make the purchase feel inevitable.
      </p>
    </div>

    <Lens
      value="5.1×"
      sublabel="SUBSCRIBER LTV MULTIPLIER"
      beforeLabel={['CURRENT', 'ARCHITECTURE']}
      afterLabel={['COMMITMENT', 'CURRICULUM']}
    />

    <div style={{ maxWidth: '680px', margin: '64px auto' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-dim)', textAlign: 'center' }}>
        The intersection is the alignment: great content that now has a designed path through it.
      </p>
    </div>

    <DeltaBridge
      metrics={[
        {
          label: 'Micro-Commitment Rate',
          category: 'Learning Behaviour',
          before: '4%',
          after: '41%',
          delta: '+925%',
          magnitude: 0.95,
        },
        {
          label: 'Identity Adoption Rate',
          category: 'Learning Outcome',
          before: '2%',
          after: '17%',
          delta: '+750%',
          magnitude: 0.90,
        },
        {
          label: 'Subscriber LTV',
          category: 'Business Outcome',
          before: '$28',
          after: '$143',
          delta: '+411%',
          magnitude: 0.85,
        },
      ]}
    />

    <div style={{ maxWidth: '680px', marginTop: '64px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-dim)' }}>
        Read the categories in order: a Learning Behaviour metric improved by 925%. A Learning Outcome metric improved by 750%. The Business Outcome is the downstream effect of both. This is the ID argument in numbers.
      </p>
    </div>
  </div>
</section>
{/* Act 05 placeholder */}
```

- [ ] **Step 2: Run tests — Lens and DeltaBridge tests should now pass**

```bash
npx vitest run src/tests/JustinWelshCaseStudy.test.tsx
```

Expected: 7 pass. 1 fail (navigation).

- [ ] **Step 3: Commit**

```bash
git add src/pages/JustinWelshCaseStudy.tsx
git commit -m "feat: add Act 04 Lens and DeltaBridge for Justin Welsh case study"
```

---

### Task 7: Build Act 05 — The Framework

**Files:**
- Modify: `src/pages/JustinWelshCaseStudy.tsx`

- [ ] **Step 1: Replace the Act 05 placeholder with the full closing section**

```typescript
{/* ═══ ANSWER CONTINUED — ACT 05 / THE FRAMEWORK ═══ */}
<section style={{ padding: '120px 0 160px' }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
    <ScqaMarker phase="ANSWER (CONTINUED)" act="ACT 05" title="THE FRAMEWORK" />

    <div style={{ maxWidth: '720px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.85, marginBottom: '32px' }}>
        Justin Welsh did not build a content business. He built a curriculum for a generation of people rethinking how they work and live. The distinction matters because the first is measured by transactions. The second is measured by transformation.
      </p>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.7, marginBottom: '32px' }}>
        When the ID principles are applied and the funnel is aligned, what emerges is a formalised methodology that can be named, documented, and licensed. Not the courses. Not the newsletter. The framework those platforms, together, are capable of producing.
      </p>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.7, marginBottom: '32px' }}>
        That methodology — the structured progression from autonomous aspiration to practised solopreneurship — is Justin Welsh's most valuable asset. It can be taught by others under licence. It can be adopted by business schools and corporate L&D programmes. Future practitioners of independent work will not cite a LinkedIn post. They will cite the framework.
      </p>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-dim)', marginBottom: '0' }}>
        This is what Curiosity Inc. builds: not better marketing, but intellectual infrastructure that endures.
      </p>
    </div>

    {/* Closing CTA line */}
    <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--color-text)', opacity: 0.35, textAlign: 'center', marginTop: '120px' }}>
      "If your work deserves to outlast you — it probably needs a curriculum."
    </p>

    {/* Navigation */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '40px', marginTop: '80px', borderTop: '0.5px solid rgba(136,136,136,0.1)' }}>
      <Link
        to="/work/dan-koe-brand-architecture"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-context)', opacity: 0.35, textDecoration: 'none', transition: 'opacity 0.3s ease' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}
      >
        ← Previous: Dan Koe
      </Link>

      <Link
        to="/#work"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-structure)', textDecoration: 'none', transition: 'opacity 0.3s ease' }}
      >
        Back to The Laboratory
      </Link>

      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-context)', opacity: 0.3 }}>
        Next: Tiago Forte →
      </span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Run all tests — all 8 should pass**

```bash
npx vitest run src/tests/JustinWelshCaseStudy.test.tsx
```

Expected: 8/8 pass. If any fail, read the error message and fix the discrepancy between the test expectation and the rendered output.

- [ ] **Step 3: Run the full test suite to confirm no regressions**

```bash
npx vitest run
```

Expected: all existing tests still pass plus 8 new JustinWelshCaseStudy tests.

- [ ] **Step 4: Commit**

```bash
git add src/pages/JustinWelshCaseStudy.tsx
git commit -m "feat: add Act 05 legacy reflection and navigation for Justin Welsh case study"
```

---

### Task 8: Build verification

- [ ] **Step 1: Run full build including prerender**

```bash
cd /Users/gingerninja/Sites/claudessetup
npm run build 2>&1 | tail -20
```

Expected output includes:
```
✓ /
✓ /work/dan-koe-brand-architecture
✓ /work/justin-welsh-conversion-design
✓ /writing/the-accidental-educator
✓ /writing/negative-space-as-active-agent
✓ /writing/the-curiosity-loop-protocol
✓ /writing/eureka-as-practice
Prerendered 7 routes.
```

- [ ] **Step 2: Verify the prerendered HTML has correct head tags**

```bash
grep -A3 "<title>" dist/work/justin-welsh-conversion-design/index.html | head -10
```

Expected: `<title>Justin Welsh — Conversion Design | Curiosity Inc.</title>` — not the default "Curiosity Inc. — Digital Sanctuary".

```bash
grep "og:title" dist/work/justin-welsh-conversion-design/index.html
```

Expected: `<meta property="og:title" content="Justin Welsh — Conversion Design | Curiosity Inc." />`

- [ ] **Step 3: Verify Dan Koe prerendered HTML also has correct head tags (backfill check)**

```bash
grep "<title>" dist/work/dan-koe-brand-architecture/index.html
```

Expected: `<title>Dan Koe — Brand Architecture | Curiosity Inc.</title>`

- [ ] **Step 4: Verify no TypeScript errors**

```bash
npx tsc -b --noEmit 2>&1 | head -20
```

Expected: no output (zero errors).

- [ ] **Step 5: Run full test suite one final time**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 6: Update `docs/Project_Progress.md`**

Add Phase 10 to the progress document. Add to the "## 1. Accomplishments by Phase" section:

```markdown
### Phase 10: Justin Welsh Case Study

- **JustinWelshCaseStudy** (`src/pages/JustinWelshCaseStudy.tsx`): Full 5-act SCQA narrative at `/work/justin-welsh-conversion-design`.
  - **Act 01 — The Professor**: Profile card with platform distribution (showing funnel position + ID role per platform), metadata, hook question, and Act 01 narrative.
  - **Act 02 — The Platform Audit**: Custom ID audit grid — platform-by-platform breakdown against Merrill's First Principles. Two sections: per-platform breakdown and principles summary. Scroll-triggered stagger animation.
  - **Act 03 — The Commitment Ladder**: Scaffold (4 bands, direction=up). Each band maps to a specific platform and content redesign. expandedContent explains why each rung creates demand for the next.
  - **Act 04 — The Architecture**: Lens (5.1× subscriber LTV multiplier) + DeltaBridge (learning behaviour first, business outcome last: Micro-Commitment Rate, Identity Adoption Rate, Subscriber LTV).
  - **Act 05 — The Framework**: Legacy/IP reflection. Closing CTA line. Three-slot navigation (← Dan Koe | Back to The Laboratory | Next: Tiago Forte →).
- **Prerender script extended**: `scripts/prerender.ts` now handles `WorkMeta` for work routes — both Dan Koe and Justin Welsh get correct `<title>` and `<meta>` tags in prerendered HTML.
- **8 tests passing** in `src/tests/JustinWelshCaseStudy.test.tsx`.
```

Update "Current Status" at the top of the file:

```markdown
**Phase 10 Complete** — Justin Welsh case study live at `/work/justin-welsh-conversion-design`. Next: Tiago Forte case study.
```

- [ ] **Step 7: Final commit**

```bash
git add src/pages/JustinWelshCaseStudy.tsx src/tests/JustinWelshCaseStudy.test.tsx src/pages/index.tsx scripts/prerender.ts docs/Project_Progress.md
git commit -m "feat: Justin Welsh Conversion Design case study (Phase 10)

- 5-act SCQA narrative at /work/justin-welsh-conversion-design
- Platform audit grid mapping Merrill's principles to distribution model
- Commitment ladder showing platform-specific content redesign
- Lens (5.1× LTV) + DeltaBridge (learning metrics before business metrics)
- Legacy/IP reflection closing act
- Prerender script extended with WorkMeta for work route SSG
- Dan Koe route backfilled with correct head tags
- 8 tests passing"
```

- [ ] **Step 8: Push to remote**

```bash
git push origin main
```

---

## Philosophical Consistency Checklist

Before calling this complete, verify against the spec checklist:

- [ ] Profile card bottom band shows platform distribution with ID role labels — not just follower counts
- [ ] Act 02 audits the platform architecture specifically — not just "content" generically
- [ ] Act 02 reads as recognition, not critique
- [ ] Act 03 maps each rung to a specific platform and content redesign
- [ ] Act 03 explains why each free rung creates demand for the next paid rung
- [ ] Act 03 answers: "if activation and application are free, why buy the course?"
- [ ] Act 04 shows learning metrics before business metrics
- [ ] Act 05 names the Practitioner Community as the feedback loop that makes the IP real
- [ ] Act 05 names the legacy dimension — what his framework becomes
- [ ] The case study reads like it was written by a learning architecture firm, not a marketing consultancy
