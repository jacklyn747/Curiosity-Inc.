'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'

export interface HeroGeometryRefs {
  svg: SVGSVGElement | null
  paths: SVGElement[]
}

/**
 * HeroGeometry — SVG recreation of the line art layer
 *
 * Traced from the cosmic hero illustration geometry:
 * orbital ellipses, concentric circles, radiating rays,
 * and crossing diagonal lines.
 *
 * All paths use the stroke-dasharray draw technique
 * so they can be animated with GSAP on scroll.
 *
 * ViewBox is 2048x857 to match the hero layer dimensions.
 */
export const HeroGeometry = forwardRef<HeroGeometryRefs>(function HeroGeometry(_, ref) {
  const svgRef = useRef<SVGSVGElement>(null)

  useImperativeHandle(ref, () => ({
    get svg() { return svgRef.current },
    get paths() {
      if (!svgRef.current) return []
      return Array.from(svgRef.current.querySelectorAll<SVGElement>('.geo-draw'))
    },
  }))

  // Center of the composition
  const cx = 1024
  const cy = 380

  // Shared stroke style
  const s = {
    fill: 'none',
    strokeWidth: 1,
  }

  const gold = 'rgba(210, 180, 60, 0.8)'
  const goldLight = 'rgba(210, 180, 60, 0.45)'
  const silver = 'rgba(180, 180, 180, 0.5)'

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 2048 857"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ zIndex: 2 }}
    >
      {/* ─── Large outer orbital ellipse ─── */}
      <ellipse
        className="geo-draw"
        cx={cx} cy={cy}
        rx={620} ry={180}
        stroke={gold} {...s}
        transform={`rotate(-2, ${cx}, ${cy})`}
      />

      {/* ─── Second orbital ellipse (tighter) ─── */}
      <ellipse
        className="geo-draw"
        cx={cx} cy={cy}
        rx={480} ry={120}
        stroke={gold} {...s}
        transform={`rotate(3, ${cx}, ${cy})`}
      />

      {/* ─── Small inner ellipse (left-tilted) ─── */}
      <ellipse
        className="geo-draw"
        cx={cx - 120} cy={cy + 20}
        rx={200} ry={70}
        stroke={goldLight} {...s}
        transform={`rotate(-8, ${cx - 120}, ${cy + 20})`}
      />

      {/* ─── Large concentric circle (outer) ─── */}
      <circle
        className="geo-draw"
        cx={cx} cy={cy}
        r={320}
        stroke={gold} {...s}
      />

      {/* ─── Medium concentric circle ─── */}
      <circle
        className="geo-draw"
        cx={cx} cy={cy}
        r={200}
        stroke={goldLight} {...s}
      />

      {/* ─── Small concentric circle (inner) ─── */}
      <circle
        className="geo-draw"
        cx={cx} cy={cy}
        r={120}
        stroke={gold} {...s}
      />

      {/* ─── Tiny inner circle (crown area) ─── */}
      <circle
        className="geo-draw"
        cx={cx} cy={cy - 140}
        r={60}
        stroke={goldLight} {...s}
      />

      {/* ─── Corona circle (top) ─── */}
      <circle
        className="geo-draw"
        cx={cx} cy={cy - 180}
        r={40}
        stroke={gold} {...s}
      />

      {/* ─── Radiating rays from crown ─── */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16
        const rad = (angle * Math.PI) / 180
        const innerR = 45
        const outerR = 85
        const ox = cx
        const oy = cy - 180
        return (
          <line
            key={`ray-${i}`}
            className="geo-draw"
            x1={ox + Math.cos(rad) * innerR}
            y1={oy + Math.sin(rad) * innerR}
            x2={ox + Math.cos(rad) * outerR}
            y2={oy + Math.sin(rad) * outerR}
            stroke={goldLight}
            {...s}
          />
        )
      })}

      {/* ─── Diagonal crossing lines (upper-left to lower-right) ─── */}
      <line
        className="geo-draw"
        x1={cx - 450} y1={cy - 350}
        x2={cx + 450} y2={cy + 350}
        stroke={silver} {...s}
      />
      <line
        className="geo-draw"
        x1={cx + 450} y1={cy - 350}
        x2={cx - 450} y2={cy + 350}
        stroke={silver} {...s}
      />

      {/* ─── Diagonal crossing lines (steeper) ─── */}
      <line
        className="geo-draw"
        x1={cx - 200} y1={cy - 380}
        x2={cx + 200} y2={cy + 380}
        stroke={silver} {...s}
        strokeWidth={0.7}
      />
      <line
        className="geo-draw"
        x1={cx + 200} y1={cy - 380}
        x2={cx - 200} y2={cy + 380}
        stroke={silver} {...s}
        strokeWidth={0.7}
      />

      {/* ─── Horizontal horizon line ─── */}
      <line
        className="geo-draw"
        x1={cx - 620} y1={cy}
        x2={cx + 620} y2={cy}
        stroke={goldLight} {...s}
        strokeWidth={0.5}
      />

      {/* ─── Vertical axis line ─── */}
      <line
        className="geo-draw"
        x1={cx} y1={cy - 350}
        x2={cx} y2={cy + 400}
        stroke={goldLight} {...s}
        strokeWidth={0.5}
      />
    </svg>
  )
})
