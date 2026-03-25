// src/tests/HeroFallback.test.tsx
import { render, screen } from '@testing-library/react';
import { HeroFallback } from '../components/hero/HeroFallback';

// Mock useReducedMotion
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useReducedMotion } from '../hooks/useReducedMotion';

describe('HeroFallback', () => {
  it('renders the SVG', () => {
    const { container } = render(<HeroFallback />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders 7 circles for the Flower of Life', () => {
    const { container } = render(<HeroFallback />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(7);
  });

  it('renders the two hero text lines', () => {
    render(<HeroFallback />);
    expect(screen.getByText('Your audience is learning from you.')).toBeInTheDocument();
    expect(screen.getByText("You just haven't designed what they're learning.")).toBeInTheDocument();
  });

  it('applies draw animation class when reduced motion is false', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const { container } = render(<HeroFallback />);
    expect(container.querySelector('.flower-draw')).toBeInTheDocument();
  });

  it('applies static class (no animation) when reduced motion is true', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const { container } = render(<HeroFallback />);
    expect(container.querySelector('.flower-static')).toBeInTheDocument();
  });
});
