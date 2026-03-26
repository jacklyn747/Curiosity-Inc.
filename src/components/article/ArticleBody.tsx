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
