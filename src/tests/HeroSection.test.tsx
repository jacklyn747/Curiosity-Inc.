// src/tests/HeroSection.test.tsx
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../components/hero/HeroSection';

// Mock hooks
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));
vi.mock('../hooks/useHeroScroll', () => ({
  useHeroScroll: vi.fn(),
}));

import { useReducedMotion } from '../hooks/useReducedMotion';

describe('HeroSection', () => {
  it('renders HeroFallback when reduced motion is true', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);
    render(<HeroSection />);
    expect(screen.getByTestId('hero-fallback')).toBeInTheDocument();
  });

  it('renders HeroFallback when on a touch device', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(pointer: coarse)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(false);
    render(<HeroSection />);
    expect(screen.getByTestId('hero-fallback')).toBeInTheDocument();
    window.matchMedia = originalMatchMedia;
  });
});
