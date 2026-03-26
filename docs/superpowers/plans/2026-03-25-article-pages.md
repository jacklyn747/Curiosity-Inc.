# Article Pages Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 4 static-rendered `/writing/:slug` article pages with TOC sidebar, authored content, SEO meta tags, and prev/next navigation.

**Architecture:** Article data lives in `src/data/articles.ts` as typed TypeScript objects. A shared `ArticlePage` template renders all 4 articles using three sub-components (TOC sidebar, body renderer, prev/next nav). A post-build script (`scripts/prerender.ts`) uses `react-dom/server` + React Router's `StaticRouter` to generate static HTML at build time, injecting per-article `<title>` and `<meta>` tags directly into `<head>`.

**Tech Stack:** React 19, Vite 8, TypeScript, React Router v7, tsx (for prerender script), react-dom/server (built-in), vitest + testing-library

---

## Chunk 1: Setup + Data Layer

---

### Task 1: Project Setup

**Files:**
- Modify: `package.json`
- Modify: `index.html`
- Modify: `src/tests/setup.ts`

- [ ] **Step 1: Install tsx, remove legacy types package**

```bash
npm install -D tsx
npm uninstall @types/react-router-dom
```

Expected: package.json updated, no errors.

- [ ] **Step 2: Add HEAD_INJECT marker to index.html**

Open `index.html`. The current `<head>` ends with the Google Fonts `<link>` tag. Add the marker as the FIRST line inside `<head>`, before `<meta charset>`:

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- HEAD_INJECT -->
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Curiosity Inc. — Digital Sanctuary</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Add IntersectionObserver mock to src/tests/setup.ts**

Current `src/tests/setup.ts` content:
```typescript
// src/tests/setup.ts
import '@testing-library/jest-dom';

// Stub all canvas contexts to null (forces WebGL fallback path in tests)
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
```

Add the mock AFTER the existing line:
```typescript
// src/tests/setup.ts
import '@testing-library/jest-dom';

// Stub all canvas contexts to null (forces WebGL fallback path in tests)
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;

// IntersectionObserver is not available in jsdom — stub it for tests
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;
```

- [ ] **Step 4: Verify tests still pass**

```bash
npm test
```

Expected: all existing tests pass (14 passing). The new mock adds no failures.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json index.html src/tests/setup.ts
git commit -m "chore: add tsx, IntersectionObserver mock, HEAD_INJECT marker for SSG"
```

---

### Task 2: Article Data File + Tests

**Files:**
- Create: `src/data/articles.ts`
- Create: `src/tests/articles.test.ts`

- [ ] **Step 1: Write failing tests first**

Create `src/tests/articles.test.ts`:

```typescript
// src/tests/articles.test.ts
import { describe, it, expect } from 'vitest';
import { articles, getArticleBySlug, getPrevNext } from '../data/articles';

describe('articles data', () => {
  it('has exactly 4 articles', () => {
    expect(articles).toHaveLength(4);
  });

  it('articles have unique slugs', () => {
    const slugs = articles.map(a => a.slug);
    expect(new Set(slugs).size).toBe(4);
  });

  it('articles have sequential order values 1-4', () => {
    const orders = articles.map(a => a.order).sort();
    expect(orders).toEqual([1, 2, 3, 4]);
  });
});

describe('getArticleBySlug', () => {
  it('returns the correct article for a valid slug', () => {
    const article = getArticleBySlug('the-accidental-educator');
    expect(article).toBeDefined();
    expect(article!.title).toBe('The Accidental Educator');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getArticleBySlug('does-not-exist')).toBeUndefined();
  });
});

describe('getPrevNext', () => {
  it('returns null prev for the first article (order 1)', () => {
    const first = articles.find(a => a.order === 1)!;
    const { prev, next } = getPrevNext(first.slug);
    expect(prev).toBeNull();
    expect(next).not.toBeNull();
  });

  it('returns null next for the last article (order 4)', () => {
    const last = articles.find(a => a.order === 4)!;
    const { prev, next } = getPrevNext(last.slug);
    expect(next).toBeNull();
    expect(prev).not.toBeNull();
  });

  it('returns both prev and next for a middle article (order 2)', () => {
    const middle = articles.find(a => a.order === 2)!;
    const { prev, next } = getPrevNext(middle.slug);
    expect(prev).not.toBeNull();
    expect(next).not.toBeNull();
    expect(prev!.order).toBe(1);
    expect(next!.order).toBe(3);
  });

  it('returns null prev and null next for an unknown slug', () => {
    const { prev, next } = getPrevNext('unknown');
    expect(prev).toBeNull();
    expect(next).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — expect them to fail**

```bash
npm test src/tests/articles.test.ts
```

Expected: FAIL — "Cannot find module '../data/articles'"

- [ ] **Step 3: Create src/data/articles.ts with types, helpers, and all 4 articles**

```typescript
// src/data/articles.ts

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  pullQuote?: string;
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: number;
  order: number;
  sections: ArticleSection[];
}

export const articles: Article[] = [
  {
    slug: 'the-accidental-educator',
    title: 'The Accidental Educator',
    subtitle: 'Why every creator with an audience is running an unstructured classroom.',
    category: 'LEARNING SCIENCE',
    readTime: 12,
    order: 1,
    sections: [
      {
        id: 'the-classroom-you-didnt-build',
        heading: 'The Classroom You Didn\'t Build',
        paragraphs: [
          'When you published your first piece of content, you made an implicit promise. You offered a signal to the world: I know something. Come learn from me.',
          'The problem is that you didn\'t design a classroom. You designed a stage. And stages and classrooms serve fundamentally different purposes. A stage is built for performance — for capturing attention, for demonstrating skill, for building an audience. A classroom is built for transfer — for taking what lives in one mind and reliably getting it into another.',
          'Every creator with a significant audience is running an unstructured classroom. The students are real. The learning is happening. But the curriculum was never designed. And that gap — between the teaching that is occurring and the teaching that was intended — is costing you more than you know.',
        ],
      },
      {
        id: 'how-parasocial-learning-works',
        heading: 'How Parasocial Learning Works',
        paragraphs: [
          'Your audience is not passively consuming your content. They are actively constructing a mental model of the world from it. This is what cognitive scientists call parasocial learning: the process by which an audience member extracts knowledge, beliefs, and frameworks from a one-sided relationship with a creator.',
          'The research on parasocial learning is striking. Audiences who follow creators over time build deep, interconnected mental models — often more durable than what they acquire in formal education. The reason is engagement: when you choose to follow someone, you are selecting for relevance. Every piece of content you produce is pre-filtered for personal meaning by the very act of subscription.',
          'This is powerful. It is also dangerous. Because parasocial learning is shaped almost entirely by what you choose to show, in what order, with what framing. Your audience is building a worldview from your content. The question is whether you are building it intentionally.',
        ],
      },
      {
        id: 'the-curriculum-problem',
        heading: 'The Curriculum Problem',
        paragraphs: [
          'Most creators think about their content calendar in terms of output: what will I publish, when, and on what topic. This is a production mindset. It asks: what can I make? It does not ask: what should they learn?',
          'The difference matters enormously. A curriculum is a learning architecture. It is built around outcomes — what does this person need to understand, believe, and be able to do at the end of this sequence? A content calendar is a production schedule. It is built around availability — what can I publish next week that my audience will engage with?',
          'When you design only for engagement, you optimize for the wrong outcome. Engagement is correlated with novelty, with controversy, with validation. Transformation requires something harder: the right concept, at the right time, connected to what the learner already knows. These are not the same optimization target. Most creators never notice the gap because engagement is measurable and transformation is not.',
        ],
        pullQuote: 'The difference between a curriculum and a content calendar is intent. One is designed to produce transformation. The other is designed to produce engagement.',
      },
      {
        id: 'what-deliberate-teaching-looks-like',
        heading: 'What Deliberate Teaching Looks Like',
        paragraphs: [
          'Deliberate teaching starts with a learning outcome. Not "what topic should I cover" but "what should the person who consumes this be able to do, think, or feel that they could not before?" This is a harder question. It requires you to have a theory of your audience — who they are, what they already know, where the gaps are.',
          'The best creators do this intuitively. They sequence their content so each piece builds on the last. They use consistent language so concepts compound rather than fragment. They return to core ideas from different angles, each time adding depth. This is not accidental. It is the difference between someone who writes and someone who teaches.',
          'Adult learning theory gives us the concept of scaffolding: the temporary structure that supports a learner until they can carry the knowledge themselves. Great content scaffolds. It gives the learner just enough to stand on while reaching for the next level. Mediocre content dumps — it presents information without architecture, leaving the learner to build their own structure or abandon the attempt.',
        ],
      },
      {
        id: 'designing-the-learning',
        heading: 'Designing the Learning, Not Just the Content',
        paragraphs: [
          'If you have an audience of any size, you are already a teacher. The question is whether you are a deliberate one. Becoming deliberate requires three things: a clear theory of your audience, a sequence that compounds rather than fragments, and a feedback mechanism that tells you whether the learning is actually happening.',
          'The feedback mechanism is the hardest part. Unlike a formal classroom, you do not give tests. But you do have signals: the questions your audience asks, the misunderstandings they reveal, the transformations they describe. These are your assessment data. Most creators treat them as social proof. Deliberate teachers treat them as curriculum feedback.',
          'The creator economy is, at its core, an education economy. What people pay for — subscriptions, courses, communities, coaching — is transformation. They are paying to become someone they are not yet. The creators who understand this do not just produce content. They design learning experiences. And the difference in outcomes, for both creator and audience, is enormous.',
        ],
      },
    ],
  },
  {
    slug: 'negative-space-as-active-agent',
    title: 'Negative Space as Active Agent',
    subtitle: 'What you leave out is the design.',
    category: 'DESIGN THEORY',
    readTime: 8,
    order: 2,
    sections: [
      {
        id: 'the-shape-of-absence',
        heading: 'The Shape of Absence',
        paragraphs: [
          'In 1915, Kazimir Malevich exhibited "Black Square" — an oil painting of a black square on a white ground. Critics were baffled and outraged. What was he saying? What was there to see? The answer was everything: the square meant nothing by itself. It was the white space around it that gave the square its presence, its gravity, its meaning.',
          'Negative space — the empty areas in a composition — is not the absence of design. It is design. The gap between elements, the silence between notes, the pause between sentences: these are not voids waiting to be filled. They are active forces that shape everything around them.',
          'Most designers, writers, and creators understand this intellectually and ignore it in practice. The impulse to fill space is almost universal. More information feels more valuable. More elements feel more thorough. The result is noise — compositions where everything is competing for attention and nothing wins.',
        ],
      },
      {
        id: 'how-restraint-communicates',
        heading: 'How Restraint Communicates',
        paragraphs: [
          'Consider two websites. The first fills every pixel: a hero banner, a navigation bar, three feature blocks, a testimonial carousel, a case study grid, a newsletter popup. The second shows a single sentence centered on a white page, a small navigation above, and nothing else. Which one communicates more confidence?',
          'The dense site is anxious. It is trying to convince you of too many things at once, which suggests it is not certain about any of them. The sparse site trusts that what is present is enough — which suggests the person who made it knows exactly what matters. Restraint is a credibility signal. It says: I edited. I chose. I know what is essential.',
          'This applies equally to writing. The sentence that has been compressed five times contains more force than the paragraph that was written once. Every word that remains carries the weight of every word that was cut. The reader feels this, even if they cannot name it.',
        ],
        pullQuote: 'Restraint is not poverty of expression. It is the most precise form of it — the decision to withhold until the remaining elements carry more weight.',
      },
      {
        id: 'the-trust-signal',
        heading: 'The Trust Signal',
        paragraphs: [
          'There is a behavioral economics concept called costly signaling: signals that are credible precisely because they are expensive to fake. Physical fitness signals health because it requires real effort. A sparse portfolio signals taste because it requires ruthless editing — the willingness to exclude your second-best work.',
          'When a brand uses negative space deliberately, it sends a costly signal. It says: we could have filled this. We chose not to. That choice communicates resources, judgment, and confidence. Luxury brands have known this for decades. The product is rarely the centerpiece. The space around it is.',
          'For creators, the trust signal works the same way. The newsletter that is short because it is dense is more trustworthy than the newsletter that is long because it is comprehensive. Length without necessity signals insecurity. Brevity with density signals mastery.',
        ],
      },
      {
        id: 'when-silence-becomes-strategy',
        heading: 'When Silence Becomes Strategy',
        paragraphs: [
          'The most powerful applications of negative space are strategic, not decorative. They are deployed to create tension — to hold the reader, viewer, or user in productive discomfort until the resolution arrives. A paragraph break before the key sentence. A page turn before the answer. A beat of silence before the punchline.',
          'Tension is the mechanism of engagement. Not novelty, not controversy, not emotion — tension. The gap between what is present and what is implied. Negative space is the physical expression of that gap. When you leave space, you invite inference. Inference is the highest form of engagement, because it requires the reader to complete the meaning themselves.',
          'The final argument for negative space is the most practical one: it is free. Adding elements costs attention, cognitive load, and time. Removing them costs nothing except the willingness to trust that less is enough. In most cases — not all, but most — it is more than enough. It is the whole thing.',
        ],
      },
    ],
  },
  {
    slug: 'the-curiosity-loop-protocol',
    title: 'The Curiosity Loop Protocol',
    subtitle: 'How to engineer sustained curiosity.',
    category: 'METHODOLOGY',
    readTime: 15,
    order: 3,
    sections: [
      {
        id: 'the-problem-with-passion',
        heading: 'The Problem With Passion',
        paragraphs: [
          'We are taught that curiosity is a feeling. You either have it about a subject or you do not. The advice that follows from this is always the same: follow your passion, find what lights you up, do what you love. This advice sounds wise. It is also largely useless.',
          'The problem is that passion is a lagging indicator, not a leading one. You do not discover passion and then pursue the subject. You pursue the subject — often through difficulty, boredom, and frustration — and passion emerges as a consequence of competence. Cognitive scientists call this the "passion hypothesis," and the evidence for it is weak. The evidence for the competence-first model is considerably stronger.',
          'If you wait to feel curious, you will wait a long time. Curiosity is not a state that precedes engagement. It is a state that follows a specific kind of engagement — the kind that creates open questions you cannot easily close.',
        ],
      },
      {
        id: 'what-curiosity-actually-is',
        heading: 'What Curiosity Actually Is',
        paragraphs: [
          'The most useful definition of curiosity is not emotional but structural: curiosity is the state of having an open question whose answer is within reach but not yet grasped. It is produced by a gap — specifically, the information gap described by Carnegie Mellon psychologist George Loewenstein. When you know something is knowable but you do not know it, you experience a pull toward closure that feels like curiosity.',
          'This is critical because it means curiosity is engineerable. If curiosity follows from information gaps, and information gaps can be created deliberately, then curiosity is not a personality trait or a talent. It is a technique. One you can practice, refine, and systematize.',
          'The felt experience of curiosity — the itch, the pull, the slightly-uncomfortable need to know — is the cognitive system registering that a gap exists and that the cost of closing it is worth paying. Your job is not to find topics that produce this experience naturally. Your job is to create the conditions for the gap to form.',
        ],
      },
      {
        id: 'the-loop-mechanics',
        heading: 'The Loop Mechanics',
        paragraphs: [
          'The curiosity loop has five stages: Encounter, Question, Pursuit, Partial Resolution, and Re-opening. What makes it a loop — rather than a line — is the fifth stage. Every answer worth having generates more questions than it closes. The loop sustains itself because real understanding is fractal: the closer you look, the more there is to see.',
          'The Encounter is the initial stimulus — a claim that does not quite fit, an anomaly in a familiar pattern, a question that seems simple but resists easy answer. The Question is the gap forming: the recognition that something is unknown. The Pursuit is the work: reading, thinking, experimenting, asking. Partial Resolution is the satisfying-but-incomplete answer that keeps the loop running. The Re-opening is the discovery that the answer was only the entrance to a deeper question.',
          'Most people experience the loop passively — questions arise, they answer them or abandon them, and curiosity comes and goes unpredictably. The Protocol is about running the loop deliberately: engineering the Encounter, sharpening the Question, structuring the Pursuit, and resisting the temptation of full resolution.',
        ],
        pullQuote: 'A question you can answer immediately is not curious — it is just a lookup. Curiosity requires distance between the question and its resolution.',
      },
      {
        id: 'interruption-as-catalyst',
        heading: 'Interruption as Catalyst',
        paragraphs: [
          'The most counterintuitive finding in curiosity research is the role of interruption. The Zeigarnik effect, first documented by Soviet psychologist Bluma Zeigarnik in 1927, describes the phenomenon where incomplete tasks occupy the mind more persistently than completed ones. Waiters remember unpaid orders better than settled ones. Readers remember cliffhangers better than resolved plots.',
          'Applied to the curiosity loop, this means that the moment of suspension — the deliberate stopping before the answer is reached — is not a failure of discipline but a technique of engagement. When you stop pursuing before the gap closes, the gap stays open. The open question continues working in the background, recruiting attention and generating associations even when you are not consciously focused on it.',
          'This is why sleep is so productive for hard problems. It is not that the unconscious works on the problem in a mystical sense. It is that the open question continues to pattern-match against incoming information — memories, conversations, sensory input — and occasionally produces a connection that the focused mind, narrowed by deliberate attention, could not have generated. The interruption is the mechanism. The open question is the engine.',
        ],
      },
      {
        id: 'building-your-loop',
        heading: 'Building Your Loop',
        paragraphs: [
          'To build a deliberate curiosity loop, start with anomaly collection. An anomaly is anything that does not fit your current model — a finding that contradicts your assumptions, a question you cannot answer confidently, a pattern that defies explanation. Keep a running list. The quality of your loop depends on the quality of your anomalies. Weak anomalies produce weak questions. Strong anomalies produce questions that sustain months of investigation.',
          'Once you have a question worth pursuing, structure the pursuit in phases rather than sessions. A phase has a clear scope — a specific sub-question to answer, a specific source to exhaust — and ends with a written summary of what you found and, crucially, what it opened up. The written summary is not optional. Writing forces precision. Precision reveals what you do not actually understand yet. The gaps you find in writing are the seeds of the next phase.',
          'Resist the temptation to declare a question answered. The closure instinct — the desire to resolve the information gap and return to cognitive ease — is the enemy of deep curiosity. Every time you feel the loop closing, ask: what would make this wrong? What am I not seeing? What would the most informed skeptic say? These questions reopen the gap and keep the loop running.',
        ],
      },
      {
        id: 'maintaining-tension',
        heading: 'Maintaining Tension',
        paragraphs: [
          'The curiosity loop is not comfortable. Sustained curiosity requires sustained discomfort — the willingness to live with open questions, partial understanding, and genuine uncertainty. Most people do not sustain curiosity because they resolve their questions too quickly, settling for the first adequate answer rather than the best one. The adequate answer closes the gap. The best answer opens it wider.',
          'The technique for maintaining tension is deliberate incompletion. Stop reading before the chapter ends. Stop a research session before you feel finished. Keep one thread visibly unresolved at the end of every work session. The unresolved thread is not procrastination. It is a hook — a specific, concrete pull that guarantees re-engagement the next day. Without it, re-engagement requires willpower. With it, it requires only remembering where you left off.',
          'The final stage of the Protocol is not resolution but integration. The question that has been running for months accumulates associations, connections, and implications that a freshly-opened question cannot have. When the loop has run long enough, the answer you find is not just the answer to the original question. It is a new framework — a new way of seeing a whole domain. This is what compounding curiosity looks like. It is worth building.',
        ],
      },
    ],
  },
  {
    slug: 'eureka-as-practice',
    title: 'Eureka as Practice',
    subtitle: 'Insight isn\'t accidental. It can be cultivated.',
    category: 'PHILOSOPHY',
    readTime: 10,
    order: 4,
    sections: [
      {
        id: 'the-myth-of-sudden-insight',
        heading: 'The Myth of the Sudden Insight',
        paragraphs: [
          'The story goes like this: Archimedes is given a problem — determine whether the king\'s crown is pure gold without melting it down. He thinks about it, cannot solve it, moves on with his life. Then one day he steps into a bath, watches the water rise, and understands. He leaps from the tub, runs naked through the streets of Syracuse, shouting "Eureka!" — I have found it.',
          'This story has shaped our cultural model of insight: sudden, unpredictable, involuntary. A gift from the unconscious to the conscious, arriving fully formed. The myth of the eureka moment suggests that insight is not something you do but something that happens to you. You cannot force it. You can only wait, and hope.',
          'This model is wrong. Not in its facts — something like the bathtub moment probably happened — but in its implications. The eureka moment was not the work. It was the delivery. The work had been happening for weeks, invisibly, in a mind that had been loaded with the right questions and given the right conditions to generate answers.',
        ],
      },
      {
        id: 'what-happens-before-the-eureka',
        heading: 'What Happens Before the Eureka',
        paragraphs: [
          'Cognitive scientists have spent decades studying creative insight, and the picture that emerges is consistent: the eureka moment is the culmination of a preparation phase, an incubation phase, and an illumination phase. The illumination — the flash of insight — is the shortest and most visible stage. It is also the least important in terms of the work required to produce it.',
          'Preparation is the long stage. It involves saturating the mind with the problem: reading everything relevant, thinking from multiple angles, attempting solutions and noticing why they fail. The preparation phase builds what cognitive scientists call the problem representation — the internal model of the problem that the unconscious will later manipulate. A poorly-formed problem representation produces no insight. A rich, detailed, well-loaded problem representation creates the conditions for the insight to appear.',
          'The incubation phase follows: a period of not consciously working on the problem. This is not rest. It is the period during which the unconscious system — faster, less constrained, and more associative than deliberate conscious thought — works through the problem space in ways the focused mind cannot. The eureka is the moment this work surfaces to consciousness. The work itself happened earlier, invisibly.',
        ],
      },
      {
        id: 'incubation-is-not-idleness',
        heading: 'Incubation Is Not Idleness',
        paragraphs: [
          'The incubation phase is widely misunderstood. It looks like idleness — you are not working on the problem. You are walking, sleeping, showering, talking about something else entirely. But the problem is still active. The open question loaded during preparation continues to pattern-match against every experience, every conversation, every fragment of sensory input. The mind is searching, constantly, for the piece that fits.',
          'The cognitive mechanism behind this is the default mode network — the brain\'s activity during non-focused periods that, far from being idle, is highly active and associated with memory consolidation and the generation of novel connections between previously unrelated concepts. It does its best work when the spotlight of deliberate attention is off. This is why insights rarely come at the desk. They come in the shower, on the walk, at the edge of sleep.',
          'Understanding this reframes what preparation means. You are not just accumulating information — you are loading the default mode network with the material it needs to generate connections. The quality of the incubation depends entirely on the quality of the preparation. You cannot incubate a problem you have not deeply worked.',
        ],
        pullQuote: 'Archimedes was not idle in the bath. He had been working the problem for weeks. The bath was simply the first moment he stopped trying.',
      },
      {
        id: 'designing-for-discovery',
        heading: 'Designing for Discovery',
        paragraphs: [
          'If the eureka is the output of a process, the process can be designed. Preparation, incubation, and illumination are not random events — they are phases that can be structured, sequenced, and optimized.',
          'Preparation is improved by specificity and documentation. Vague questions produce vague insights. A precisely-formulated question — one that captures exactly what is unknown and what constraints the answer must satisfy — gives the unconscious a precise search target. Writing out the problem is not just note-taking. It is problem specification. Every time you articulate what you do not understand, you are sharpening the query the default mode network will run during incubation.',
          'Incubation is improved by genuine disengagement. Checking email, scrolling social media, or engaging in any attention-demanding activity does not produce real incubation — it substitutes one focused demand for another. True incubation requires low-demand activity: walking, exercising, doing repetitive physical tasks. The key is that conscious attention must be genuinely unoccupied. A long run, a conversation about something else entirely — these are incubation-compatible. Meetings and notifications are not.',
        ],
      },
      {
        id: 'the-practice',
        heading: 'The Practice',
        paragraphs: [
          'Eureka as a practice means building the cycle into your work deliberately. It means front-loading preparation: spending the first hours with a new problem saturating yourself in it before attempting solutions. It means ending work sessions with an unresolved question rather than a tidy summary, so that incubation begins immediately. It means creating protected space for low-demand activity — not as a reward for productivity but as an integral part of the productive process.',
          'The most practical intervention is also the simplest: write the question down before you stop working. Not the answer, not the progress, not what you accomplished — the question. The specific, concrete thing you do not yet understand. Write it on paper, at the top of tomorrow\'s notes. This act does two things: it sharpens the preparation phase by forcing you to specify the gap, and it primes the incubation phase by giving the default mode network a clear brief.',
          'The eureka is not a stroke of luck. It is the audible crack of a problem that has been under pressure long enough. The preparation builds the pressure. The incubation holds it. Your job is not to wait for the crack. Your job is to load the system correctly and trust the process. The insight will come. And when it does, you will know exactly what it means.',
        ],
      },
    ],
  },
];

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

- [ ] **Step 4: Run tests — expect them to pass**

```bash
npm test src/tests/articles.test.ts
```

Expected: 8 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/data/articles.ts src/tests/articles.test.ts
git commit -m "feat: add article data with 4 authored articles and helpers"
```

---

## Chunk 2: Components

---

### Task 3: ArticleBody Component + Tests

**Files:**
- Create: `src/components/article/ArticleBody.tsx`
- Create: `src/tests/ArticleBody.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tests/ArticleBody.test.tsx`:

```typescript
// src/tests/ArticleBody.test.tsx
import { render, screen } from '@testing-library/react';
import { ArticleBody } from '../components/article/ArticleBody';
import type { ArticleSection } from '../data/articles';

const sections: ArticleSection[] = [
  {
    id: 'section-one',
    heading: 'Section One',
    paragraphs: ['First paragraph.', 'Second paragraph.'],
  },
  {
    id: 'section-two',
    heading: 'Section Two',
    paragraphs: ['Third paragraph.'],
    pullQuote: 'This is the pull quote.',
  },
];

describe('ArticleBody', () => {
  it('renders an h2 for each section', () => {
    render(<ArticleBody sections={sections} />);
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Section One');
    expect(headings[1]).toHaveTextContent('Section Two');
  });

  it('gives each h2 the correct id for anchor linking', () => {
    render(<ArticleBody sections={sections} />);
    expect(document.getElementById('section-one')).not.toBeNull();
    expect(document.getElementById('section-two')).not.toBeNull();
  });

  it('renders a blockquote when pullQuote is defined', () => {
    render(<ArticleBody sections={sections} />);
    expect(screen.getByRole('blockquote')).toHaveTextContent('This is the pull quote.');
  });

  it('does not render a blockquote when pullQuote is undefined', () => {
    const noQuoteSections = [sections[0]];
    render(<ArticleBody sections={noQuoteSections} />);
    expect(screen.queryByRole('blockquote')).toBeNull();
  });

  it('renders all paragraphs', () => {
    render(<ArticleBody sections={sections} />);
    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Third paragraph.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test src/tests/ArticleBody.test.tsx
```

Expected: FAIL — "Cannot find module '../components/article/ArticleBody'"

- [ ] **Step 3: Create src/components/article/ArticleBody.tsx**

```typescript
// src/components/article/ArticleBody.tsx
import type { ArticleSection } from '../../data/articles';

interface ArticleBodyProps {
  sections: ArticleSection[];
}

export function ArticleBody({ sections }: ArticleBodyProps) {
  return (
    <div>
      {sections.map((section) => (
        <section key={section.id} style={{ marginBottom: '3rem' }}>
          <h2
            id={section.id}
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: 'var(--color-text)',
              marginBottom: '1.5rem',
              fontWeight: 400,
            }}
          >
            {section.heading}
          </h2>

          {section.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '17px',
                lineHeight: 1.75,
                color: 'var(--color-text)',
                marginBottom: '1.25rem',
              }}
            >
              {p}
            </p>
          ))}

          {section.pullQuote && (
            <blockquote
              style={{
                borderLeft: '1px solid var(--color-insight)',
                paddingLeft: '1.5rem',
                margin: '2rem 0',
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '1.1rem',
                color: 'var(--color-text-dim)',
                lineHeight: 1.6,
              }}
            >
              {section.pullQuote}
            </blockquote>
          )}
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test src/tests/ArticleBody.test.tsx
```

Expected: 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/article/ArticleBody.tsx src/tests/ArticleBody.test.tsx
git commit -m "feat: add ArticleBody component"
```

---

### Task 4: ArticleNav Component + Tests

**Files:**
- Create: `src/components/article/ArticleNav.tsx`
- Create: `src/tests/ArticleNav.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tests/ArticleNav.test.tsx`:

```typescript
// src/tests/ArticleNav.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ArticleNav } from '../components/article/ArticleNav';
import type { Article } from '../data/articles';

const prevArticle: Article = {
  slug: 'prev-article',
  title: 'The Previous Article',
  subtitle: 'Subtitle',
  category: 'DESIGN THEORY',
  readTime: 8,
  order: 1,
  sections: [],
};

const nextArticle: Article = {
  slug: 'next-article',
  title: 'The Next Article',
  subtitle: 'Subtitle',
  category: 'METHODOLOGY',
  readTime: 10,
  order: 3,
  sections: [],
};

function renderNav(prev: Article | null, next: Article | null) {
  return render(
    <MemoryRouter>
      <ArticleNav prev={prev} next={next} />
    </MemoryRouter>
  );
}

describe('ArticleNav', () => {
  it('always renders the Back to Writing link', () => {
    renderNav(null, null);
    expect(screen.getByText('Writing')).toBeInTheDocument();
  });

  it('renders the prev article title when prev is not null', () => {
    renderNav(prevArticle, null);
    expect(screen.getByText(/The Previous Article/)).toBeInTheDocument();
  });

  it('renders the next article title when next is not null', () => {
    renderNav(null, nextArticle);
    expect(screen.getByText(/The Next Article/)).toBeInTheDocument();
  });

  it('does not render prev link when prev is null', () => {
    renderNav(null, nextArticle);
    expect(screen.queryByText(/The Previous Article/)).toBeNull();
  });

  it('does not render next link when next is null', () => {
    renderNav(prevArticle, null);
    expect(screen.queryByText(/The Next Article/)).toBeNull();
  });

  it('renders both prev and next when both are provided', () => {
    renderNav(prevArticle, nextArticle);
    expect(screen.getByText(/The Previous Article/)).toBeInTheDocument();
    expect(screen.getByText(/The Next Article/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test src/tests/ArticleNav.test.tsx
```

Expected: FAIL — "Cannot find module '../components/article/ArticleNav'"

- [ ] **Step 3: Create src/components/article/ArticleNav.tsx**

```typescript
// src/components/article/ArticleNav.tsx
import { Link } from 'react-router-dom';
import type { Article } from '../../data/articles';

interface ArticleNavProps {
  prev: Article | null;
  next: Article | null;
}

export function ArticleNav({ prev, next }: ArticleNavProps) {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '0.5px solid rgba(58, 158, 164, 0.2)',
        paddingTop: '2rem',
        marginTop: '4rem',
        gap: '1rem',
      }}
    >
      <div style={{ flex: 1 }}>
        {prev && (
          <Link
            to={`/writing/${prev.slug}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'var(--color-structure)',
              textDecoration: 'none',
            }}
          >
            ← {prev.title}
          </Link>
        )}
      </div>

      <Link
        to="/#writing"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: 'var(--color-context)',
          textDecoration: 'none',
          textAlign: 'center',
        }}
      >
        Writing
      </Link>

      <div style={{ flex: 1, textAlign: 'right' }}>
        {next && (
          <Link
            to={`/writing/${next.slug}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'var(--color-structure)',
              textDecoration: 'none',
            }}
          >
            {next.title} →
          </Link>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test src/tests/ArticleNav.test.tsx
```

Expected: 6 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/article/ArticleNav.tsx src/tests/ArticleNav.test.tsx
git commit -m "feat: add ArticleNav component"
```

---

### Task 5: ArticleTOC Component + Tests

**Files:**
- Create: `src/components/article/ArticleTOC.tsx`
- Create: `src/tests/ArticleTOC.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tests/ArticleTOC.test.tsx`:

```typescript
// src/tests/ArticleTOC.test.tsx
import { render, screen } from '@testing-library/react';
import { ArticleTOC } from '../components/article/ArticleTOC';
import type { ArticleSection } from '../data/articles';

const sections: ArticleSection[] = [
  { id: 'section-a', heading: 'Section A', paragraphs: [] },
  { id: 'section-b', heading: 'Section B', paragraphs: [] },
  { id: 'section-c', heading: 'Section C', paragraphs: [] },
];

describe('ArticleTOC', () => {
  it('renders a link for each section', () => {
    render(
      <ArticleTOC sections={sections} category="DESIGN THEORY" readTime={8} />
    );
    const links = screen.getAllByRole('link');
    // One link per section
    const sectionLinks = links.filter(l => l.getAttribute('href')?.startsWith('#'));
    expect(sectionLinks).toHaveLength(3);
  });

  it('renders the category label', () => {
    render(
      <ArticleTOC sections={sections} category="DESIGN THEORY" readTime={8} />
    );
    expect(screen.getByText('DESIGN THEORY')).toBeInTheDocument();
  });

  it('renders the read time', () => {
    render(
      <ArticleTOC sections={sections} category="DESIGN THEORY" readTime={8} />
    );
    expect(screen.getByText(/8 MIN/)).toBeInTheDocument();
  });

  it('renders a CONTENTS label', () => {
    render(
      <ArticleTOC sections={sections} category="DESIGN THEORY" readTime={8} />
    );
    expect(screen.getByText('CONTENTS')).toBeInTheDocument();
  });

  it('section links have correct href anchors', () => {
    render(
      <ArticleTOC sections={sections} category="DESIGN THEORY" readTime={8} />
    );
    expect(screen.getByRole('link', { name: 'Section A' })).toHaveAttribute('href', '#section-a');
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test src/tests/ArticleTOC.test.tsx
```

Expected: FAIL — "Cannot find module '../components/article/ArticleTOC'"

- [ ] **Step 3: Create src/components/article/ArticleTOC.tsx**

```typescript
// src/components/article/ArticleTOC.tsx
import { useEffect, useState } from 'react';
import type { ArticleSection } from '../../data/articles';

interface ArticleTOCProps {
  sections: ArticleSection[];
  category: string;
  readTime: number;
}

export function ArticleTOC({ sections, category, readTime }: ArticleTOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  // IntersectionObserver only runs in the browser (useEffect = client-only).
  // This component is SSG-safe: no window/document access at render time.
  useEffect(() => {
    const headings = sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(e => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    headings.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside
      style={{
        position: 'sticky',
        top: '80px',
        alignSelf: 'flex-start',
        width: '200px',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: 'var(--color-structure)',
          marginBottom: '12px',
        }}
      >
        CONTENTS
      </div>

      <nav>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.08em',
              color: activeId === section.id ? 'var(--color-structure)' : 'var(--color-context)',
              textDecoration: 'none',
              marginBottom: '8px',
              lineHeight: 1.4,
              transition: 'color 200ms ease',
            }}
          >
            {section.heading}
          </a>
        ))}
      </nav>

      <div style={{ marginTop: '20px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            letterSpacing: '0.1em',
            color: 'var(--color-context-dim)',
            marginBottom: '6px',
          }}
        >
          {readTime} MIN
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            letterSpacing: '0.12em',
            color: 'var(--color-transformation)',
          }}
        >
          {category}
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test src/tests/ArticleTOC.test.tsx
```

Expected: 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/article/ArticleTOC.tsx src/tests/ArticleTOC.test.tsx
git commit -m "feat: add ArticleTOC component with IntersectionObserver active section"
```

---

## Chunk 3: Page + SSG

---

### Task 6: ArticlePage Template + Tests

**Files:**
- Create: `src/pages/ArticlePage.tsx`
- Modify: `src/pages/index.tsx` (replace stub, add re-export)
- Create: `src/tests/ArticlePage.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tests/ArticlePage.test.tsx`:

```typescript
// src/tests/ArticlePage.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ArticlePage } from '../pages/ArticlePage';

function renderAtSlug(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/writing/${slug}`]}>
      <Routes>
        <Route path="/writing/:slug" element={<ArticlePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ArticlePage', () => {
  it('renders the article h1 title for a valid slug', () => {
    renderAtSlug('the-accidental-educator');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The Accidental Educator');
  });

  it('renders the category label for a valid slug', () => {
    renderAtSlug('the-accidental-educator');
    expect(screen.getByText('LEARNING SCIENCE')).toBeInTheDocument();
  });

  it('renders the correct article for a different slug', () => {
    renderAtSlug('eureka-as-practice');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Eureka as Practice');
  });

  it('renders a 404 message for an unknown slug', () => {
    renderAtSlug('does-not-exist');
    expect(screen.getByText(/Lost in the void/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test src/tests/ArticlePage.test.tsx
```

Expected: FAIL — "Cannot find module '../pages/ArticlePage'"

- [ ] **Step 3: Create src/pages/ArticlePage.tsx**

```typescript
// src/pages/ArticlePage.tsx
import { Link, useParams } from 'react-router-dom';
import { getArticleBySlug, getPrevNext } from '../data/articles';
import { ArticleTOC } from '../components/article/ArticleTOC';
import { ArticleBody } from '../components/article/ArticleBody';
import { ArticleNav } from '../components/article/ArticleNav';

// Note: NotFoundPage is NOT imported from './index' to avoid a circular dependency
// (index.tsx re-exports ArticlePage from this file). Inline the 404 fallback instead.
function ArticleNotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--color-text)', fontWeight: 400 }}>
        Lost in the void.
      </h1>
      <Link to="/" style={{ color: 'var(--color-insight)', textDecoration: 'none', marginTop: '3rem', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em' }}>
        RETURN TO SANCTUARY →
      </Link>
    </div>
  );
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug ?? '');
  const { prev, next } = getPrevNext(slug ?? '');

  if (!article) return <ArticleNotFound />;

  return (
    <>
      {/* React 19 native metadata — hoists to <head> on client navigation.
          Static head tags are injected by scripts/prerender.ts at build time. */}
      <title>{article.title} — Curiosity Inc.</title>
      <meta name="description" content={article.subtitle} />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.subtitle} />
      <meta property="og:type" content="article" />
      <link rel="canonical" href={`https://curiosityinc.co/writing/${article.slug}`} />

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
        <ArticleTOC
          sections={article.sections}
          category={article.category}
          readTime={article.readTime}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <header style={{ marginBottom: '3rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.15em',
                color: 'var(--color-transformation)',
                marginBottom: '12px',
              }}
            >
              {article.category} · {article.readTime} MIN
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: 'var(--color-text)',
                fontWeight: 400,
                marginBottom: '1rem',
                lineHeight: 1.2,
              }}
            >
              {article.title}
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '17px',
                color: 'var(--color-text-dim)',
                lineHeight: 1.6,
                maxWidth: '560px',
                marginBottom: '2rem',
              }}
            >
              {article.subtitle}
            </p>

            <div
              style={{
                height: '0.5px',
                background: 'rgba(58, 158, 164, 0.2)',
                width: '40px',
              }}
            />
          </header>

          <ArticleBody sections={article.sections} />
          <ArticleNav prev={prev} next={next} />
        </div>
      </article>
    </>
  );
}
```

- [ ] **Step 4: Update src/pages/index.tsx — replace ArticlePage stub with re-export**

Find this block in `src/pages/index.tsx` (around line 348):

```typescript
export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="flex flex-col items-center justify-center min-vh-100 p-8 text-center" style={{ minHeight: '100vh' }}>
      <DisplayHeading as="h1" accent="Deep Reading" className="mb-8">{`Deep Reading: ${slug || ''}`}</DisplayHeading>
      <Link
        to="/"
        className="data-label"
        style={{ color: 'var(--color-insight)', textDecoration: 'none' }}
      >
        ← BACK TO LIBRARY
      </Link>
    </div>
  );
}
```

Replace it with:

```typescript
export { ArticlePage } from './ArticlePage';
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test src/tests/ArticlePage.test.tsx
```

Expected: 4 tests passing.

- [ ] **Step 6: Run all tests to confirm nothing broke**

```bash
npm test
```

Expected: all tests pass (previous 14 + new tests).

- [ ] **Step 7: Commit**

```bash
git add src/pages/ArticlePage.tsx src/pages/index.tsx src/tests/ArticlePage.test.tsx
git commit -m "feat: add ArticlePage template, replace stub"
```

---

### Task 7: Prerender Script + Build Script Update

**Files:**
- Create: `scripts/prerender.ts`
- Modify: `package.json` (build script)

- [ ] **Step 1: Create scripts/prerender.ts**

```typescript
// scripts/prerender.ts
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { createElement } from 'react';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import App from '../src/App';
import { articles } from '../src/data/articles';
import type { Article } from '../src/data/articles';

const template = readFileSync('dist/index.html', 'utf-8');

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildHeadTags(article: Article): string {
  return [
    `<title>${escapeHtml(article.title)} — Curiosity Inc.</title>`,
    `<meta name="description" content="${escapeHtml(article.subtitle)}" />`,
    `<meta property="og:title" content="${escapeHtml(article.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(article.subtitle)}" />`,
    `<meta property="og:type" content="article" />`,
    `<link rel="canonical" href="https://curiosityinc.co/writing/${article.slug}" />`,
  ].join('\n    ');
}

type Route = { path: string; article?: Article };

const routes: Route[] = [
  { path: '/' },
  { path: '/work/dan-koe-brand-architecture' },
  ...articles.map(a => ({ path: `/writing/${a.slug}`, article: a })),
];

let successCount = 0;

for (const { path, article } of routes) {
  try {
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

    console.log(`✓ ${path}`);
    successCount++;
  } catch (err) {
    console.error(`✗ ${path}:`, err);
    process.exit(1);
  }
}

console.log(`\nPrerendered ${successCount} routes.`);
```

- [ ] **Step 2: Update the build script in package.json**

Find in `package.json`:
```json
"build": "tsc -b && vite build",
```

Replace with:
```json
"build": "tsc -b && vite build && tsx scripts/prerender.ts",
```

- [ ] **Step 3: Run the dev server to verify the app loads at each article route**

```bash
npm run dev
```

Visit in browser:
- `http://localhost:5173/writing/the-accidental-educator` — should show article with TOC sidebar
- `http://localhost:5173/writing/eureka-as-practice` — should show last article
- `http://localhost:5173/writing/does-not-exist` — should show 404

Stop dev server when done.

- [ ] **Step 4: Run a full build to verify the prerender script works**

```bash
npm run build
```

Expected output:
```
✓ /
✓ /work/dan-koe-brand-architecture
✓ /writing/the-accidental-educator
✓ /writing/negative-space-as-active-agent
✓ /writing/the-curiosity-loop-protocol
✓ /writing/eureka-as-practice

Prerendered 6 routes.
```

- [ ] **Step 5: Verify the generated HTML has title in <head>**

```bash
grep -n "The Accidental Educator" dist/writing/the-accidental-educator/index.html | head -5
```

Expected: The article title appears in the `<head>` section (within the first ~30 lines), not just in the body.

```bash
head -20 dist/writing/the-accidental-educator/index.html
```

Expected: `<title>The Accidental Educator — Curiosity Inc.</title>` visible in the head.

- [ ] **Step 6: Run all tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add scripts/prerender.ts package.json package-lock.json
git commit -m "feat: add prerender script for static HTML generation at build time"
```
