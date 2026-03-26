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
