// src/tests/Homepage.test.tsx
import { render } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock HeroSection so Suspense doesn't time out in jsdom
vi.mock('../components/hero/HeroSection', () => ({
  HeroSection: () => <div id="hero" data-testid="hero-section">hero</div>,
}));

import HomePage from '../pages/index';

describe('Homepage lazy HeroSection', () => {
  it('renders hero section', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
    });
    expect(document.getElementById('hero')).toBeTruthy();
  });
});
