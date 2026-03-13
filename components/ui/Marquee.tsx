import type { CSSProperties } from 'react'
import styles from './Marquee.module.css'

const DEFAULT_WORDS = [
  'Behavior Design',
  'Cognitive Architecture',
  'Decision Science',
  'UX Strategy',
  'Instructional Design',
  'Marketing Psychology',
  'Experience Systems',
  'Signal Over Noise',
]

interface MarqueeProps {
  words?: string[]
  speed?: string   // CSS duration, default '22s'
  className?: string
}

export function Marquee({
  words = DEFAULT_WORDS,
  speed = '22s',
  className = '',
}: MarqueeProps) {
  // Exactly 2 copies needed: the CSS animation translates by -50%,
  // moving one full set off-screen while the second set fills the gap — creating a seamless loop.
  const allWords = [...words, ...words]

  return (
    <div
      role="region"
      className={[styles.marquee, className].filter(Boolean).join(' ')}
      style={{ '--speed': speed } as CSSProperties}
      aria-label={`Services: ${words.join(', ')}`}
    >
      <div className={styles.track} aria-hidden="true">
        {allWords.map((word, i) => (
          <span key={`${i < words.length ? 'a' : 'b'}-${word}-${i % words.length}`} className={styles.item}>
            <span className={styles.word}>{word}</span>
            <span className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  )
}
