'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import type { BehavioralSymbol, SymbolElement } from '@/lib/symbols'

interface SymbolProps {
  symbol:     BehavioralSymbol
  size?:      number
  color?:     string
  opacity?:   number
  animated?:  boolean
  className?: string
  style?:     React.CSSProperties
}

function renderEl(el: SymbolElement, key: number): React.ReactNode {
  switch (el.kind) {
    case 'circle':  return <circle  key={key} cx={el.cx} cy={el.cy} r={el.r} opacity={el.opacity ?? 1} />
    case 'path':    return <path    key={key} d={el.d} opacity={el.opacity ?? 1} />
    case 'line':    return <line    key={key} x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} opacity={el.opacity ?? 1} />
    case 'polygon': return <polygon key={key} points={el.points} opacity={el.opacity ?? 1} />
  }
}

export function Symbol({
  symbol, size = 40, color, opacity = 1, animated = false, className, style,
}: SymbolProps) {
  const ref    = useRef<SVGSVGElement>(null)
  const stroke = color ?? symbol.color

  useEffect(() => {
    if (!animated || !ref.current) return
    const ctx = gsap.context(() => {
      const svg     = ref.current!
      const paths   = [...svg.querySelectorAll<SVGPathElement>('path')]
      const lines   = [...svg.querySelectorAll<SVGLineElement>('line')]
      const circles = [...svg.querySelectorAll<SVGCircleElement>('circle')]
      const polys   = [...svg.querySelectorAll<SVGPolygonElement>('polygon')]

      ;[...paths, ...lines].forEach(el => {
        const len = (el as SVGGeometryElement).getTotalLength?.() ?? 60
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(el, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' })
      })

      gsap.from([...circles, ...polys], {
        scale: 0, opacity: 0, duration: 0.4, stagger: 0.04,
        transformOrigin: '50% 50%', ease: 'back.out(1.4)', delay: 0.1,
      })
    }, ref)

    return () => ctx.revert()
  }, [animated])

  return (
    <svg
      ref={ref}
      viewBox={symbol.viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={stroke}
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity, flexShrink: 0, ...style }}
      className={className}
      aria-hidden="true"
    >
      {symbol.svgData.elements.map((el, i) => renderEl(el, i))}
    </svg>
  )
}
