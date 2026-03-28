// src/lib/lenis.ts
// Module-level singleton — no React context needed for scroll calls.
// App.tsx calls setLenis(instance) on init and setLenis(null) on cleanup.
import type Lenis from 'lenis';

export let lenisInstance: Lenis | null = null;

export function setLenis(l: Lenis | null): void {
  lenisInstance = l;
}
