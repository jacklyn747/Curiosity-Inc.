// src/tests/About.test.tsx

// GSAP mock — hoisted by Vitest. Section 01 mount animations run unconditionally,
// so we mock here rather than relying on inView staying false.
vi.mock('gsap', () => ({
  default: {
    context: vi.fn((_fn: () => void, _scope: unknown) => ({ revert: vi.fn() })),
    fromTo: vi.fn(),
    registerPlugin: vi.fn(),
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AboutPage } from '../pages/About';

function renderAbout() {
  return render(
    <MemoryRouter initialEntries={['/about']}>
      <Routes>
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AboutPage', () => {
  it('renders without crashing', () => {
    renderAbout();
  });

  it('renders the opening conviction text', () => {
    renderAbout();
    expect(screen.getByText(/Here's what I know/i)).toBeInTheDocument();
  });

  it('renders Jacklyn Miller name', () => {
    renderAbout();
    expect(screen.getByText(/Jacklyn Miller/i)).toBeInTheDocument();
  });

  it('renders photo with correct alt text', () => {
    renderAbout();
    expect(screen.getByAltText('Jacklyn Miller')).toBeInTheDocument();
  });

  it('renders email CTA link with correct href', () => {
    renderAbout();
    const link = screen.getByRole('link', { name: /jacklyn@curiosityinc\.online/i });
    expect(link).toHaveAttribute('href', 'mailto:jacklyn@curiosityinc.online');
  });

  it('renders "The difference is everything" closing line', () => {
    renderAbout();
    expect(screen.getByText(/The difference is everything/i)).toBeInTheDocument();
  });

  it('renders all three discipline labels', () => {
    renderAbout();
    expect(screen.getByText(/Visual Arts/i)).toBeInTheDocument();
    expect(screen.getByText(/Creative Writing/i)).toBeInTheDocument();
    expect(screen.getByText(/Instructional Design/i)).toBeInTheDocument();
  });

  it('renders the About page on /about route', () => {
    renderAbout();
    // Route is functioning if the opening text is present
    expect(screen.getByText(/Here's what I know/i)).toBeInTheDocument();
  });
});
