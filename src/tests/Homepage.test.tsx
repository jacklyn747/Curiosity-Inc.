// src/tests/Homepage.test.tsx
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock HeroSection so Suspense resolves immediately in jsdom
vi.mock('../components/hero/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">hero</div>,
}));

import HomePage from '../pages/index';

describe('HomePage', () => {
  it('resolves and renders HeroSection via Suspense', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
    });
    expect(screen.getByTestId('hero-section')).toBeTruthy();
  });
});
