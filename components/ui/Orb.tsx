import styles from './Orb.module.css'

interface OrbProps {
  size?: number     // diameter in px, default 14
  duration?: string // animation duration, default '3.5s'
  className?: string
}

export function Orb({ size = 14, duration = '3.5s', className = '' }: OrbProps) {
  return (
    <span
      className={`${styles.orb} ${className}`}
      style={{
        width: size,
        height: size,
        '--duration': duration,
      } as React.CSSProperties}
      aria-hidden="true"
    />
  )
}
