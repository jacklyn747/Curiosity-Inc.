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
