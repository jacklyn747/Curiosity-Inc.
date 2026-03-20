'use client'

import { ParallaxHero } from '@/components/hero/ParallaxHero'

/**
 * HeroSection
 *
 * Cinematic parallax hero with 5 layered PNG images:
 *   Stars → Lines → Woman → Clouds → Planets
 *
 * Each layer moves at a different speed on scroll,
 * creating depth. Layers reveal sequentially as the
 * user scrolls, building from noise to signal.
 */
export function HeroSection() {
  return <ParallaxHero />
}
