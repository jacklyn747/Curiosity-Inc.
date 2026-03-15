import type { ReactNode, CSSProperties } from 'react'

interface SectionShellProps {
  children: ReactNode
  alt?: boolean  // alternating background
  style?: CSSProperties
}

export function SectionShell({ children, alt = false, style }: SectionShellProps) {
  return (
    <section
      style={{
        background: alt ? 'rgba(255,255,255,0.02)' : 'transparent',
        padding: '80px 60px',
        ...style,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {children}
      </div>
    </section>
  )
}

interface PullQuoteProps {
  text: string
  color: string
}

export function PullQuote({ text, color }: PullQuoteProps) {
  return (
    <blockquote
      style={{
        borderLeft: `1.5px solid ${color}`,
        background: `rgba(100,100,100,0.04)`,
        padding: '16px 20px',
        margin: '32px 0',
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        fontStyle: 'italic',
        color: 'var(--shell)',
        opacity: 0.75,
        lineHeight: 1.6,
      }}
    >
      &ldquo;{text}&rdquo;
    </blockquote>
  )
}

interface InsightBlockProps {
  label: string
  text: string
  color: string
}

export function InsightBlock({ label, text, color }: InsightBlockProps) {
  return (
    <div
      style={{
        background: 'rgba(234,228,218,0.03)',
        border: '1px solid rgba(234,228,218,0.07)',
        padding: '16px 20px',
        marginTop: '32px',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color,
        opacity: 0.6,
        marginBottom: '6px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--shell)',
        opacity: 0.6,
        lineHeight: 1.5,
      }}>
        {text}
      </p>
    </div>
  )
}
