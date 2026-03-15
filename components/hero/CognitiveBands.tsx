'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { layers } from '@/lib/design-tokens'

export interface CognitiveBandsRefs {
  container: HTMLDivElement | null
}

export const CognitiveBands = forwardRef<CognitiveBandsRefs>(
  function CognitiveBands(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      container: containerRef.current,
    }))

    return (
      <div
        ref={containerRef}
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col"
        aria-hidden="true"
        style={{ opacity: 0 }}
      >
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className="band w-full"
            style={{
              height: '3px',
              backgroundColor: layer.color,
              opacity: 0.75,
            }}
          />
        ))}
      </div>
    )
  }
)
