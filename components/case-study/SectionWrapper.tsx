'use client'

import { Symbol } from '@/components/geo/Symbol'
import type { BehavioralSymbol } from '@/lib/symbols'

interface SectionWrapperProps {
  symbol:    BehavioralSymbol
  eyebrow:   string
  children:  React.ReactNode
  alt?:      boolean
  style?:    React.CSSProperties
}

export function SectionWrapper({ symbol, eyebrow, children, alt = false, style }: SectionWrapperProps) {
  return (
    <section style={{
      position: 'relative',
      padding: '96px 60px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: alt ? 'rgba(0,0,0,0.15)' : 'transparent',
      ...style,
    }}>
      <div style={{ position: 'absolute', top: '40px', right: '60px', opacity: 0.18, pointerEvents: 'none' }}>
        <Symbol symbol={symbol} size={40} animated />
      </div>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '10px',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: symbol.color,
        opacity: 0.6,
        marginBottom: '32px',
      }}>
        {eyebrow}
      </p>
      {children}
    </section>
  )
}

export function PullQuote({ quote, color }: { quote: string; color: string }) {
  return (
    <blockquote style={{
      borderLeft: `1.5px solid ${color}`,
      paddingLeft: '20px',
      margin: '40px 0',
      background: `${color}08`,
      paddingTop: '16px',
      paddingBottom: '16px',
      paddingRight: '20px',
      fontStyle: 'italic',
      fontSize: '16px',
      lineHeight: 1.6,
      opacity: 0.85,
    }}>
      {quote}
    </blockquote>
  )
}

export function InsightBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: 'rgba(234,228,218,0.03)',
      border: '1px solid rgba(234,228,218,0.07)',
      padding: '20px 24px',
      marginTop: '40px',
    }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color,
        opacity: 0.5,
        marginBottom: '8px',
      }}>
        {label}
      </p>
      <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.5 }}>{value}</p>
    </div>
  )
}
