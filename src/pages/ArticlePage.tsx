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
      <title>{`${article.title} — Curiosity Inc.`}</title>
      <meta name="description" content={article.subtitle} />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.subtitle} />
      <meta property="og:type" content="article" />
      <link rel="canonical" href={`https://curiosityinc.online/writing/${article.slug}`} />

      <article className="article-layout">
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
