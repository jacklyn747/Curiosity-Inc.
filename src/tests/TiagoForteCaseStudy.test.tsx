// src/tests/TiagoForteCaseStudy.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TiagoForteCaseStudy } from '../pages/TiagoForteCaseStudy';

function renderCaseStudy() {
  return render(
    <MemoryRouter initialEntries={['/work/tiago-forte-cognitive-interfaces']}>
      <Routes>
        <Route path="/work/:slug" element={<TiagoForteCaseStudy />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('TiagoForteCaseStudy', () => {
  it('renders without crashing', () => {
    renderCaseStudy();
  });

  it('renders creator name in the profile card', () => {
    renderCaseStudy();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tiago Forte');
  });

  it('renders the hook question', () => {
    renderCaseStudy();
    expect(
      screen.getAllByText(/The Second Brain already has a curriculum/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('renders all five Merrill\'s principle rows in the platform audit grid', () => {
    renderCaseStudy();
    expect(screen.getAllByText(/Activation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Demonstration/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Application/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Feedback/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Integration/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders four cognitive interface bands', () => {
    renderCaseStudy();
    expect(screen.getAllByText(/CAPTURE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/ORGANISE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/DISTILL/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/EXPRESS/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Lens hero metric', () => {
    renderCaseStudy();
    expect(screen.getByText('4.7×')).toBeInTheDocument();
  });

  it('renders all three DeltaBridge metric labels', () => {
    renderCaseStudy();
    expect(screen.getByText(/Practice Adoption Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Methodology Retention/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Practitioner LTV/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the back navigation link', () => {
    renderCaseStudy();
    const backLink = screen.getByRole('link', { name: /Back to The Laboratory/i });
    expect(backLink).toHaveAttribute('href', '/#work');
  });
});
