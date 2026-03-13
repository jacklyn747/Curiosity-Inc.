'use client'

// hooks/useLenis.ts
// Initialises a Lenis smooth-scroll instance and ties it to the GSAP ticker
// so ScrollTrigger stays in sync. Intended to be called once from <Providers>.
// lerp: 0.08 — chosen to match the project's unhurried, deliberate motion spec.

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 })

    lenisRef.current = lenis

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from the GSAP ticker so all animations share one RAF loop.
    // Capture the callback so we can remove it precisely on cleanup.
    const tickerCallback = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
