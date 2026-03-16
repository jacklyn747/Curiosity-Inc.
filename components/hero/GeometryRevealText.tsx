'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import {
  seedOfLife,
  flowerOfLife,
  metatronsCube,
  fibonacciSpiral,
  mandala,
} from '@/lib/sacred-geometry-paths'

export interface GeometryRevealTextRefs {
  svg: SVGSVGElement | null
  maskSeed: SVGGElement | null
  maskFlower: SVGGElement | null
  maskMetatron: SVGGElement | null
  maskFibonacci: SVGGElement | null
  maskMandala: SVGGElement | null
  maskReveal: SVGRectElement | null
  eyebrow: SVGTextElement | null
  headline: SVGGElement | null
  subhead: SVGTextElement | null
}

/**
 * GeometryRevealText
 *
 * SVG overlay that renders the headline text masked by sacred geometry.
 * The text is always present but only visible through geometry strokes.
 * As geometry draws on (stroke-dashoffset → 0), more text appears.
 *
 * "Structure makes meaning visible."
 */
export const GeometryRevealText = forwardRef<GeometryRevealTextRefs>(
  function GeometryRevealText(_, ref) {
    const svgRef          = useRef<SVGSVGElement>(null)
    const maskSeedRef     = useRef<SVGGElement>(null)
    const maskFlowerRef   = useRef<SVGGElement>(null)
    const maskMetatronRef = useRef<SVGGElement>(null)
    const maskFibRef      = useRef<SVGGElement>(null)
    const maskMandalaRef  = useRef<SVGGElement>(null)
    const maskRevealRef   = useRef<SVGRectElement>(null)
    const eyebrowRef      = useRef<SVGTextElement>(null)
    const headlineRef     = useRef<SVGGElement>(null)
    const subheadRef      = useRef<SVGTextElement>(null)

    useImperativeHandle(ref, () => ({
      svg:          svgRef.current,
      maskSeed:     maskSeedRef.current,
      maskFlower:   maskFlowerRef.current,
      maskMetatron: maskMetatronRef.current,
      maskFibonacci: maskFibRef.current,
      maskMandala:  maskMandalaRef.current,
      maskReveal:   maskRevealRef.current,
      eyebrow:      eyebrowRef.current,
      headline:     headlineRef.current,
      subhead:      subheadRef.current,
    }))

    // Thick stroke for mask — wider = more text visible per geometry element
    const maskStroke = 50

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
        style={{ zIndex: 20 }}
      >
        <defs>
          {/* ─── Geometry Mask ─────────────────────────────────── */}
          {/* Black = hidden, white = revealed                      */}
          <mask id="hero-geo-mask">
            {/* Base: hide everything */}
            <rect width="800" height="800" fill="black" />

            {/* Seed of Life — thick white strokes reveal text */}
            <g ref={maskSeedRef} opacity={0}>
              {seedOfLife.circles.map((c, i) => (
                <circle
                  key={`ms-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  stroke="white"
                  strokeWidth={maskStroke}
                  fill="none"
                  className="geo-path"
                />
              ))}
            </g>

            {/* Flower of Life */}
            <g ref={maskFlowerRef} opacity={0}>
              {flowerOfLife.additionalCircles.map((c, i) => (
                <circle
                  key={`mf-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  stroke="white"
                  strokeWidth={maskStroke * 0.8}
                  fill="none"
                  className="geo-path"
                />
              ))}
            </g>

            {/* Metatron's Cube */}
            <g ref={maskMetatronRef} opacity={0}>
              {metatronsCube.lines.map((l, i) => (
                <line
                  key={`mm-l-${i}`}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="white"
                  strokeWidth={maskStroke * 0.6}
                  className="geo-line"
                />
              ))}
              {metatronsCube.nodes.map((n, i) => (
                <circle
                  key={`mm-n-${i}`}
                  cx={n.cx}
                  cy={n.cy}
                  r={maskStroke * 0.4}
                  fill="white"
                  className="geo-node"
                />
              ))}
            </g>

            {/* Fibonacci Spiral */}
            <g ref={maskFibRef} opacity={0}>
              <path
                d={fibonacciSpiral.path}
                stroke="white"
                strokeWidth={maskStroke}
                strokeLinecap="round"
                fill="none"
                className="geo-path"
              />
            </g>

            {/* Mandala */}
            <g ref={maskMandalaRef} opacity={0}>
              {mandala.rings.map((ring, i) => (
                <circle
                  key={`mma-r-${i}`}
                  cx={ring.cx}
                  cy={ring.cy}
                  r={ring.r}
                  stroke="white"
                  strokeWidth={maskStroke * 0.5}
                  fill="none"
                  className="geo-path"
                />
              ))}
              {mandala.radials.map((line, i) => (
                <line
                  key={`mma-l-${i}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="white"
                  strokeWidth={maskStroke * 0.4}
                  className="geo-line"
                />
              ))}
            </g>

            {/* Full reveal rect — animates from 0 to 1 opacity */}
            <rect
              ref={maskRevealRef}
              width="800"
              height="800"
              fill="white"
              opacity={0}
            />
          </mask>
        </defs>

        {/* ─── Masked Text ────────────────────────────────────── */}
        <g mask="url(#hero-geo-mask)">
          {/* Eyebrow */}
          <text
            ref={eyebrowRef}
            x="400"
            y="310"
            textAnchor="middle"
            fill="rgba(234,228,218,0.5)"
            fontFamily="'Josefin Sans', sans-serif"
            fontWeight="300"
            fontSize="12"
            letterSpacing="4"
            style={{ textTransform: 'uppercase' }}
          >
            BEHAVIORAL DESIGN STUDIO
          </text>

          {/* Headline — two lines */}
          <g ref={headlineRef}>
            <text
              x="400"
              y="380"
              textAnchor="middle"
              fill="var(--shell, #EAE4DA)"
              fontFamily="'Josefin Sans', sans-serif"
              fontWeight="600"
              fontSize="72"
              letterSpacing="-1"
            >
              Strong Opinions Turn
            </text>
            <text
              x="400"
              y="450"
              textAnchor="middle"
              fill="var(--shell, #EAE4DA)"
              fontFamily="'Josefin Sans', sans-serif"
              fontWeight="600"
              fontSize="72"
              letterSpacing="-1"
            >
              Theory into Culture.
            </text>
          </g>

          {/* Subhead */}
          <text
            ref={subheadRef}
            x="400"
            y="500"
            textAnchor="middle"
            fill="rgba(234,228,218,0.75)"
            fontFamily="'Inter', sans-serif"
            fontWeight="400"
            fontSize="17"
            letterSpacing="0"
          >
            Cognitive Design Systems for Intellectual Creators.
          </text>
        </g>
      </svg>
    )
  }
)
