'use client'

import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react'

export interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  r: number
  opacity: number
}

/** A star with twinkle state */
interface Star {
  x: number
  y: number
  r: number
  baseOpacity: number
  phase: number        // twinkle phase offset
  speed: number        // twinkle speed
  glow: boolean        // larger, softer stars
}

export interface NoiseCanvasRefs {
  canvas: HTMLCanvasElement | null
  particles: Particle[]
  startGrain: () => void
  stopGrain: () => void
}

const PARTICLE_COUNT = 40

/** Pre-seeded scattered particle positions (deterministic, SSR-safe) */
function createParticles(): Particle[] {
  const seeds: [number, number][] = [
    [0.05, 0.12], [0.92, 0.08], [0.23, 0.87], [0.78, 0.65], [0.15, 0.45],
    [0.88, 0.32], [0.42, 0.91], [0.67, 0.18], [0.31, 0.72], [0.95, 0.55],
    [0.08, 0.68], [0.55, 0.05], [0.72, 0.88], [0.18, 0.25], [0.85, 0.78],
    [0.38, 0.42], [0.62, 0.62], [0.12, 0.92], [0.48, 0.15], [0.78, 0.48],
    [0.25, 0.58], [0.92, 0.22], [0.05, 0.82], [0.68, 0.35], [0.35, 0.08],
    [0.82, 0.92], [0.52, 0.52], [0.15, 0.35], [0.72, 0.72], [0.42, 0.28],
    [0.58, 0.82], [0.28, 0.15], [0.88, 0.58], [0.08, 0.48], [0.65, 0.05],
    [0.32, 0.95], [0.95, 0.42], [0.45, 0.68], [0.18, 0.78], [0.75, 0.25],
  ]
  return seeds.slice(0, PARTICLE_COUNT).map(([sx, sy]) => ({
    x: sx,
    y: sy,
    targetX: 0.5,
    targetY: 0.5,
    r: 1 + Math.abs(sx - sy) * 2,
    opacity: 0.15 + Math.abs(sx * sy) * 0.35,
  }))
}

/** Deterministic starfield — varying size, brightness, twinkle rate */
function createStars(): Star[] {
  const stars: Star[] = []

  // Small dim stars — the majority (100+)
  const smallSeeds: [number, number][] = [
    [0.03,0.07],[0.11,0.02],[0.19,0.14],[0.06,0.23],[0.28,0.05],
    [0.35,0.11],[0.42,0.03],[0.51,0.09],[0.58,0.16],[0.64,0.02],
    [0.73,0.08],[0.81,0.13],[0.89,0.04],[0.96,0.11],[0.04,0.31],
    [0.13,0.38],[0.22,0.29],[0.31,0.42],[0.37,0.35],[0.46,0.27],
    [0.53,0.44],[0.61,0.31],[0.69,0.39],[0.77,0.26],[0.84,0.43],
    [0.91,0.33],[0.97,0.41],[0.02,0.52],[0.09,0.61],[0.17,0.48],
    [0.24,0.57],[0.33,0.64],[0.41,0.51],[0.48,0.69],[0.56,0.55],
    [0.63,0.62],[0.71,0.49],[0.79,0.58],[0.86,0.67],[0.94,0.53],
    [0.07,0.73],[0.14,0.81],[0.21,0.69],[0.29,0.78],[0.36,0.85],
    [0.44,0.72],[0.52,0.83],[0.59,0.76],[0.67,0.89],[0.74,0.71],
    [0.82,0.82],[0.90,0.74],[0.97,0.87],[0.05,0.93],[0.12,0.96],
    [0.20,0.91],[0.27,0.88],[0.34,0.94],[0.43,0.97],[0.50,0.92],
    [0.57,0.86],[0.65,0.95],[0.72,0.93],[0.80,0.88],[0.87,0.96],
    [0.95,0.91],[0.16,0.17],[0.38,0.19],[0.55,0.22],[0.71,0.15],
    [0.84,0.21],[0.09,0.46],[0.26,0.51],[0.47,0.38],[0.62,0.45],
    [0.78,0.37],[0.93,0.48],[0.15,0.63],[0.32,0.71],[0.49,0.59],
    [0.66,0.68],[0.83,0.56],[0.08,0.84],[0.25,0.92],[0.43,0.81],
    [0.61,0.91],[0.79,0.79],[0.96,0.68],[0.11,0.55],[0.39,0.47],
    [0.57,0.34],[0.74,0.52],[0.88,0.63],[0.03,0.39],[0.22,0.43],
    [0.41,0.61],[0.59,0.73],[0.76,0.84],[0.94,0.22],[0.18,0.06],
  ]

  for (const [x, y] of smallSeeds) {
    stars.push({
      x, y,
      r: 0.4 + (x * y) * 0.6,   // 0.4–1.0px
      baseOpacity: 0.15 + (x + y) * 0.12,
      phase: (x * 127 + y * 311) % (Math.PI * 2),
      speed: 0.3 + (x * y) * 1.2,
      glow: false,
    })
  }

  // Medium brighter stars (~15)
  const medSeeds: [number, number][] = [
    [0.08,0.15],[0.25,0.08],[0.47,0.21],[0.68,0.12],[0.89,0.28],
    [0.14,0.47],[0.52,0.42],[0.76,0.55],[0.33,0.68],[0.91,0.72],
    [0.18,0.85],[0.55,0.78],[0.72,0.91],[0.42,0.95],[0.85,0.38],
  ]

  for (const [x, y] of medSeeds) {
    stars.push({
      x, y,
      r: 1.0 + (x * y) * 0.8,  // 1.0–1.8px
      baseOpacity: 0.4 + (x + y) * 0.15,
      phase: (x * 211 + y * 97) % (Math.PI * 2),
      speed: 0.5 + x * 0.8,
      glow: false,
    })
  }

  // Glow stars — a few bright ones with soft radial glow (~6)
  const glowSeeds: [number, number][] = [
    [0.12, 0.09], [0.82, 0.18], [0.35, 0.55],
    [0.68, 0.72], [0.91, 0.45], [0.22, 0.88],
  ]

  for (const [x, y] of glowSeeds) {
    stars.push({
      x, y,
      r: 1.5,
      baseOpacity: 0.6 + x * 0.2,
      phase: (x * 173 + y * 59) % (Math.PI * 2),
      speed: 0.2 + y * 0.4,
      glow: true,
    })
  }

  return stars
}

export const NoiseCanvas = forwardRef<NoiseCanvasRefs>(
  function NoiseCanvas(_, ref) {
    const canvasRef    = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>(createParticles())
    const starsRef     = useRef<Star[]>(createStars())
    const frameRef     = useRef<number>(0)
    const runningRef   = useRef(false)
    const startTimeRef = useRef(0)

    const renderFrame = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { width, height } = canvas
      const elapsed = (performance.now() - startTimeRef.current) / 1000

      // Clear to deep night sky
      ctx.fillStyle = 'rgb(29, 29, 27)'
      ctx.fillRect(0, 0, width, height)

      // Very subtle grain — just enough texture to feel analog, not TV snow
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 32) {
        // Very sparse, very faint
        const v = (Math.random() * 40) | 0  // dark values only
        data[i]     = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 6  // barely visible
      }
      ctx.putImageData(imageData, 0, 0)

      // Stars with twinkle
      const stars = starsRef.current
      for (const s of stars) {
        const twinkle = Math.sin(elapsed * s.speed + s.phase)
        const opacity = s.baseOpacity + twinkle * s.baseOpacity * 0.4

        if (opacity <= 0) continue

        const sx = s.x * width
        const sy = s.y * height

        if (s.glow) {
          // Soft radial glow
          const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6)
          gradient.addColorStop(0, `rgba(234, 228, 218, ${opacity * 0.8})`)
          gradient.addColorStop(0.3, `rgba(234, 228, 218, ${opacity * 0.25})`)
          gradient.addColorStop(1, 'rgba(234, 228, 218, 0)')
          ctx.beginPath()
          ctx.arc(sx, sy, 6, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // Core dot
        ctx.beginPath()
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(234, 228, 218, ${Math.min(opacity, 1)})`
        ctx.fill()
      }

      // Convergence particles (animated by GSAP, drawn here)
      const particles = particlesRef.current
      for (const p of particles) {
        const px = p.x * width
        const py = p.y * height
        ctx.beginPath()
        ctx.arc(px, py, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(234, 228, 218, ${p.opacity})`
        ctx.fill()
      }

      if (runningRef.current) {
        frameRef.current = requestAnimationFrame(renderFrame)
      }
    }, [])

    const startGrain = useCallback(() => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width  = Math.floor(canvas.offsetWidth / 2)
        canvas.height = Math.floor(canvas.offsetHeight / 2)
      }
      startTimeRef.current = performance.now()
      runningRef.current = true
      renderFrame()
    }, [renderFrame])

    const stopGrain = useCallback(() => {
      runningRef.current = false
      cancelAnimationFrame(frameRef.current)
    }, [])

    useImperativeHandle(ref, () => ({
      canvas: canvasRef.current,
      particles: particlesRef.current,
      startGrain,
      stopGrain,
    }))

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      />
    )
  }
)
