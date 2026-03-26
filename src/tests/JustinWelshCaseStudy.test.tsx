// src/tests/JustinWelshCaseStudy.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { JustinWelshCaseStudy } from '../pages/JustinWelshCaseStudy';

function renderCaseStudy() {
  return render(
    <MemoryRouter initialEntries={['/work/justin-welsh-conversion-design']}>
      <Routes>
        <Route path="/work/:slug" element={<JustinWelshCaseStudy />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('JustinWelshCaseStudy', () => {
  it('renders without crashing', () => {
    renderCaseStudy();
  });

  it('renders creator name in the profile card', () => {
    renderCaseStudy();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Justin Welsh');
  });

  it('renders the hook question', () => {
    renderCaseStudy();
    expect(
      screen.getByText(/What if the ideas Justin Welsh teaches outlive the platforms/i)
    ).toBeInTheDocument();
  });

  it('renders all five Merrill\'s principle rows in the platform audit grid', () => {
    renderCaseStudy();
    expect(screen.getByText(/Activation/i)).toBeInTheDocument();
    expect(screen.getByText(/Demonstration/i)).toBeInTheDocument();
    expect(screen.getByText(/Application/i)).toBeInTheDocument();
    expect(screen.getByText(/Feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/Integration/i)).toBeInTheDocument();
  });

  it('renders four commitment ladder bands', () => {
    renderCaseStudy();
    expect(screen.getAllByText(/ATTENTION/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/MICRO-ACT/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/INTENT/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/IDENTITY/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Lens hero metric', () => {
    renderCaseStudy();
    expect(screen.getByText('5.1×')).toBeInTheDocument();
  });

  it('renders all three DeltaBridge metric labels', () => {
    renderCaseStudy();
    expect(screen.getByText(/Micro-Commitment Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Identity Adoption Rate/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Subscriber LTV/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the back navigation link', () => {
    renderCaseStudy();
    const backLink = screen.getByRole('link', { name: /Back to The Laboratory/i });
    expect(backLink).toHaveAttribute('href', '/#work');
  });
});
