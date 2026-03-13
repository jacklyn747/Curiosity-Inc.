import React from 'react'

interface EyebrowProps {
  children: React.ReactNode
  color?: string   // CSS color value, defaults to tang
  className?: string
}

export function Eyebrow({ children, color, className = '' }: EyebrowProps) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      style={{ color: color ?? 'var(--shell-35)' }}
    >
      {/* Rule line */}
      <span
        className="block shrink-0 h-px w-7"
        style={{ background: color ?? 'var(--tang)' }}
        aria-hidden="true"
      />
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          fontWeight: 400,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
        }}
      >
        {children}
      </span>
    </div>
  )
}
