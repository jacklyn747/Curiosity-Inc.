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
      createElement(StaticRouter, { location: path }, createElement(AppRoutes))
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
