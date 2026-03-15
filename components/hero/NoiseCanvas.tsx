'use client'

import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react'
import { geo } from '@/lib/design-tokens'

export interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  r: number
  opacity: number
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

export const NoiseCanvas = forwardRef<NoiseCanvasRefs>(
  function NoiseCanvas(_, ref) {
    const canvasRef    = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>(createParticles())
    const frameRef     = useRef<number>(0)
    const runningRef   = useRef(false)

    const renderFrame = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { width, height } = canvas

      // Clear
      ctx.clearRect(0, 0, width, height)

      // Film grain — random noise at grainOpacity (4%)
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data
      const grainAlpha = Math.round(geo.grainOpacity * 255)
      for (let i = 0; i < data.length; i += 16) {
        // Sample every 4th pixel for performance, fill neighbors
        const v = (Math.random() * 255) | 0
        for (let j = 0; j < 16 && i + j + 3 < data.length; j += 4) {
          data[i + j]     = v
          data[i + j + 1] = v
          data[i + j + 2] = v
          data[i + j + 3] = grainAlpha
        }
      }
      ctx.putImageData(imageData, 0, 0)

      // Particles
      const particles = particlesRef.current
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2)
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
        // Size canvas to half-res for performance
        canvas.width  = Math.floor(canvas.offsetWidth / 2)
        canvas.height = Math.floor(canvas.offsetHeight / 2)
      }
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
