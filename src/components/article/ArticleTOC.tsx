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
      className="article-toc"
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
