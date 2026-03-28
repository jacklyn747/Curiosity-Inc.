// scripts/prerender.ts
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { createElement } from 'react';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { AppRoutes } from '../src/App';
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
    `<meta property="og:url" content="https://curiosityinc.co/writing/${article.slug}" />`,
    `<meta property="og:image" content="https://curiosityinc.co/og-image.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(article.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(article.subtitle)}" />`,
    `<meta name="twitter:image" content="https://curiosityinc.co/og-image.png" />`,
    `<link rel="canonical" href="https://curiosityinc.co/writing/${article.slug}" />`,
  ].join('\n    ');
}

type WorkMeta = { title: string; description: string };

function buildWorkHeadTags(meta: WorkMeta, path: string): string {
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="https://curiosityinc.co${path}" />`,
    `<meta property="og:image" content="https://curiosityinc.co/og-image.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="https://curiosityinc.co/og-image.png" />`,
    `<link rel="canonical" href="https://curiosityinc.co${path}" />`,
  ].join('\n    ');
}

// Strip static homepage meta tags from per-page output to prevent duplicates.
// The HEAD_INJECT block sits at the top of <head>, so per-page tags are injected
// first — but the static template tags remain below and would duplicate them.
// We strip each block that the per-page builders override.
function stripHomepageMeta(html: string): string {
  return html
    // Remove static <title> (already stripped below, but also here for clarity)
    .replace('\n    <title>Curiosity Inc. \u2014 Digital Sanctuary</title>', '')
    // Remove static base description
    .replace('\n    <meta name="description" content="Curiosity Inc. helps creators turn audiences into learners. Design-led instructional architecture for the creator economy." />', '')
    // Remove static Open Graph comment + tags (keep og:site_name — it's not injected)
    .replace('\n\n    <!-- Open Graph -->', '')
    .replace('\n    <meta property="og:type"        content="website" />', '')
    .replace('\n    <meta property="og:url"         content="https://curiosityinc.co/" />', '')
    .replace('\n    <meta property="og:title"       content="Curiosity Inc. \u2014 Digital Sanctuary" />', '')
    .replace('\n    <meta property="og:description" content="Curiosity Inc. helps creators turn audiences into learners. Design-led instructional architecture for the creator economy." />', '')
    .replace('\n    <meta property="og:image"       content="https://curiosityinc.co/og-image.png" />', '')
    .replace('\n    <meta property="og:image:width" content="1200" />', '')
    .replace('\n    <meta property="og:image:height" content="630" />', '')
    // Remove static Twitter Card comment + tags
    .replace('\n\n    <!-- Twitter Card -->', '')
    .replace('\n    <meta name="twitter:card"        content="summary_large_image" />', '')
    .replace('\n    <meta name="twitter:title"       content="Curiosity Inc. \u2014 Digital Sanctuary" />', '')
    .replace('\n    <meta name="twitter:description" content="Curiosity Inc. helps creators turn audiences into learners. Design-led instructional architecture for the creator economy." />', '')
    .replace('\n    <meta name="twitter:image"       content="https://curiosityinc.co/og-image.png" />', '')
    // Remove static Canonical comment + link
    .replace('\n\n    <!-- Canonical -->', '')
    .replace('\n    <link rel="canonical" href="https://curiosityinc.co/" />', '');
}

type Route = { path: string; article?: Article; workMeta?: WorkMeta };

const routes: Route[] = [
  { path: '/' },
  {
    path: '/work/dan-koe-brand-architecture',
    workMeta: {
      title: 'Dan Koe — Brand Architecture | Curiosity Inc.',
      description: 'What if 2.3M followers were students, not subscribers? A learning architecture case study.',
    },
  },
  {
    path: '/work/justin-welsh-conversion-design',
    workMeta: {
      title: 'Justin Welsh — Conversion Design | Curiosity Inc.',
      description: 'How aligning instructional design principles with the marketing funnel transforms an audience into a learning community — and a creator into a discipline founder.',
    },
  },
  {
    path: '/work/tiago-forte-cognitive-interfaces',
    workMeta: {
      title: 'Tiago Forte — Cognitive Interfaces | Curiosity Inc.',
      description: 'The Second Brain already has a curriculum. It just isn\'t built yet. A cognitive interface case study.',
    },
  },
  {
    path: '/about',
    workMeta: {
      title: 'About — Curiosity Inc.',
      description: 'Jacklyn Miller is the founder of Curiosity Inc. — building the instructional architecture the creator economy was missing.',
    },
  },
  {
    path: '/audit',
    workMeta: {
      title: 'Request a Curiosity Audit — Curiosity Inc.',
      description: 'Start the conversation. A diagnostic session to analyze your content architecture and show you where the learning science breaks down.',
    },
  },
  ...articles.map(a => ({ path: `/writing/${a.slug}`, article: a })),
];

let successCount = 0;

for (const { path, article, workMeta } of routes) {
  try {
    const rendered = renderToString(
      createElement(StaticRouter, { location: path }, createElement(AppRoutes))
    );

    const headTags = article
      ? buildHeadTags(article)
      : workMeta
        ? buildWorkHeadTags(workMeta, path)
        : '';

    let output = template
      .replace('<!-- HEAD_INJECT -->', headTags)
      .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);

    if (article || workMeta) {
      output = stripHomepageMeta(output);
    }

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
