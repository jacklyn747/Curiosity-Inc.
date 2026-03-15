'use client'

import { CinematicHero } from '@/components/hero/CinematicHero'

/**
 * HeroSection
 *
 * Cinematic 5-stage animation sequence:
 *   Noise → Emergence → Perception → Signal → Living System
 *
 * Full animation on first visit (11s), condensed on return (3s).
 * Respects prefers-reduced-motion.
 */
export function HeroSection() {
  return <CinematicHero />
}
