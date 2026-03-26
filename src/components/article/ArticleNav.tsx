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
