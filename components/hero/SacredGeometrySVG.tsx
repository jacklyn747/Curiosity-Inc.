'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { colors, shellAt } from '@/lib/design-tokens'
import {
  seedOfLife,
  flowerOfLife,
  metatronsCube,
  fibonacciSpiral,
  mandala,
} from '@/lib/sacred-geometry-paths'

export interface SacredGeometryRefs {
  svg: SVGSVGElement | null
  seed: SVGGElement | null
  flower: SVGGElement | null
  metatron: SVGGElement | null
  fibonacci: SVGGElement | null
  mandala: SVGGElement | null
}

export const SacredGeometrySVG = forwardRef<SacredGeometryRefs>(
  function SacredGeometrySVG(_, ref) {
    const svgRef       = useRef<SVGSVGElement>(null)
    const seedRef      = useRef<SVGGElement>(null)
    const flowerRef    = useRef<SVGGElement>(null)
    const metatronRef  = useRef<SVGGElement>(null)
    const fibonacciRef = useRef<SVGGElement>(null)
    const mandalaRef   = useRef<SVGGElement>(null)

    useImperativeHandle(ref, () => ({
      svg:       svgRef.current,
      seed:      seedRef.current,
      flower:    flowerRef.current,
      metatron:  metatronRef.current,
      fibonacci: fibonacciRef.current,
      mandala:   mandalaRef.current,
    }))

    const strokeBase   = shellAt[20]
    const strokeAccent = colors.tang

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ zIndex: 2 }}
      >
        {/* Stage 1+2: Seed of Life */}
        <g ref={seedRef} opacity={0}>
          {seedOfLife.circles.map((c, i) => (
            <circle
              key={`seed-${i}`}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              stroke={strokeBase}
              strokeWidth={1}
              fill="none"
              className="geo-path"
            />
          ))}
        </g>

        {/* Stage 2: Flower of Life (additional circles) */}
        <g ref={flowerRef} opacity={0}>
          {flowerOfLife.additionalCircles.map((c, i) => (
            <circle
              key={`flower-${i}`}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              stroke={strokeBase}
              strokeWidth={1}
              fill="none"
              className="geo-path"
            />
          ))}
        </g>

        {/* Stage 4: Metatron's Cube (lines + nodes) */}
        <g ref={metatronRef} opacity={0}>
          {metatronsCube.lines.map((l, i) => (
            <line
              key={`met-l-${i}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={shellAt[10]}
              strokeWidth={0.5}
              className="geo-line"
            />
          ))}
          {metatronsCube.nodes.map((n, i) => (
            <circle
              key={`met-n-${i}`}
              cx={n.cx}
              cy={n.cy}
              r={3}
              fill={i === 0 ? strokeAccent : strokeBase}
              className="geo-node"
            />
          ))}
        </g>

        {/* Stage 4-5: Fibonacci Spiral */}
        <g ref={fibonacciRef} opacity={0}>
          <path
            d={fibonacciSpiral.path}
            stroke={strokeAccent}
            strokeWidth={1.5}
            strokeLinecap="round"
            fill="none"
            className="geo-path"
          />
        </g>

        {/* Stage 5: Mandala (rings + radials) */}
        <g ref={mandalaRef} opacity={0}>
          {mandala.rings.map((ring, i) => (
            <circle
              key={`mandala-r-${i}`}
              cx={ring.cx}
              cy={ring.cy}
              r={ring.r}
              stroke={shellAt[6]}
              strokeWidth={0.5}
              fill="none"
              className="geo-path"
            />
          ))}
          {mandala.radials.map((line, i) => (
            <line
              key={`mandala-l-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={shellAt[6]}
              strokeWidth={0.5}
              className="geo-line"
            />
          ))}
        </g>
      </svg>
    )
  }
)
