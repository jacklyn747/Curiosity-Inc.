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
