// src/tests/setup.ts
import '@testing-library/jest-dom';

// Stub WebGL context for jsdom (Three.js needs this)
HTMLCanvasElement.prototype.getContext = (type: string) => {
  if (type === 'webgl' || type === 'webgl2') return null; // force WebGL failure in tests
  return null;
};
