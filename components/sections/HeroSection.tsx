'use client'

import { CinematicHero } from '@/components/hero/CinematicHero'
import { HeroTextPanel } from '@/components/hero/HeroTextPanel'

/**
 * HeroSection
 *
 * Two-part hero:
 *   1. CinematicHero — pinned visual sequence (geometry + iris reveal + image)
 *   2. HeroTextPanel — dark panel with headline that scrolls into view after
 *      the visual sequence unpins. Text gets its own moment.
 */
export function HeroSection() {
  return (
    <>
      <CinematicHero />
      <HeroTextPanel />
    </>
  )
}
