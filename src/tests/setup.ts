// src/tests/setup.ts
import '@testing-library/jest-dom';

// Stub all canvas contexts to null (forces WebGL fallback path in tests)
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;

// IntersectionObserver is not available in jsdom — stub it for tests
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;
