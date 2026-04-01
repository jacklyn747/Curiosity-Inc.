import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/index';

describe('✦ Intellectual Glamour: Homepage Integrity', () => {
  it('should render the primary narrative hook: "You\'ve been teaching this whole time."', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    // Check for the H1 content specifically
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain("You've been");
    expect(h1.textContent).toContain("teaching");
  });

  it('should anchor the experience with the Curiosity Audit CTA', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Request a Curiosity Audit/i)).toBeDefined();
  });

  it('should maintain the "Sensory Interaction" layer: No literal cursor labels', () => {
    const { container } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    // Explicitly check for REMOVAL of the old SaaS-style literal labels
    const labels = container.querySelectorAll('[data-cursor-text]');
    expect(labels.length).toBe(0);
  });

  it('should present the curated "Article Library" for high-intent visitors', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Things worth your time/i)).toBeDefined();
    expect(screen.getByText(/The Accidental Educator/i)).toBeDefined();
  });
});
