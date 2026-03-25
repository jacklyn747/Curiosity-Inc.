// src/tests/setup.ts
import '@testing-library/jest-dom';

// Stub all canvas contexts to null (forces WebGL fallback path in tests)
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
