// src/tests/LenisSetup.test.tsx
import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// ---------- mocks (declared before any imports of tested modules) ----------

const { destroyMock, LenisMock, tickerAddMock, tickerRemoveMock, tickerLagMock } =
  vi.hoisted(() => {
    const destroyMock = vi.fn();
    const rafMock = vi.fn(); // keep the fn because it's used in Implementation
    const LenisMock = vi.fn().mockImplementation(function () {
      return {
        destroy: destroyMock,
        raf: rafMock,
      };
    });
    const tickerAddMock = vi.fn();
    const tickerRemoveMock = vi.fn();
    const tickerLagMock = vi.fn();
    return { destroyMock, LenisMock, tickerAddMock, tickerRemoveMock, tickerLagMock };
  });

vi.mock('lenis', () => ({ default: LenisMock }));

vi.mock('gsap', () => ({
  default: {
    ticker: {
      add: tickerAddMock,
      remove: tickerRemoveMock,
      lagSmoothing: tickerLagMock,
    },
  },
}));

// Mock all heavy child components so the App tree renders in jsdom
vi.mock('../components/hero/HeroSection', () => ({
  HeroSection: () => <div />,
}));
vi.mock('../components/hero/ParticleField', () => ({
  ParticleField: () => <div />,
}));

// Import App AFTER mocks are in place
import App from '../App';

// ---------- tests ----------

describe('LenisSetup', () => {
  beforeEach(() => {
    destroyMock.mockClear();
    LenisMock.mockClear();
    tickerAddMock.mockClear();
    tickerRemoveMock.mockClear();
    // Default: reduced-motion OFF
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  it('calls lenis.destroy() when App unmounts', async () => {
    let unmount!: () => void;
    await act(async () => {
      const result = render(<App />);
      unmount = result.unmount;
    });
    await act(async () => { unmount(); });
    expect(destroyMock).toHaveBeenCalledOnce();
  });

  it('does not initialise Lenis when prefers-reduced-motion is set', async () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    await act(async () => { render(<App />); });
    expect(LenisMock).not.toHaveBeenCalled();
  });

  it('passes the same function ref to gsap.ticker.add and .remove', async () => {
    let unmount!: () => void;
    await act(async () => {
      const result = render(<App />);
      unmount = result.unmount;
    });
    await act(async () => { unmount(); });
    expect(tickerAddMock).toHaveBeenCalledOnce();
    expect(tickerRemoveMock).toHaveBeenCalledOnce();
    // Critical: remove must receive the exact same ref that was passed to add
    const addedFn = tickerAddMock.mock.calls[0][0];
    const removedFn = tickerRemoveMock.mock.calls[0][0];
    expect(addedFn).toBe(removedFn);
  });
});
