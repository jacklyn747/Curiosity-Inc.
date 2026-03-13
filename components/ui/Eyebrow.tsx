interface EyebrowProps {
  children: React.ReactNode
  color?: string   // CSS color for both rule line and text; rule defaults to var(--tang), text defaults to var(--shell-35) via .t-eyebrow
  className?: string
}

export function Eyebrow({ children, color, className = '' }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Rule line */}
      <span
        className="block shrink-0 h-px w-7"
        style={{ background: color ?? 'var(--tang)' }}
        aria-hidden="true"
      />
      <span
        className="t-eyebrow"
        style={color ? { color } : undefined}
      >
        {children}
      </span>
    </div>
  )
}
