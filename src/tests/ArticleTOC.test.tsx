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
