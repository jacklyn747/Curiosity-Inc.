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
  // Duplicate the set for seamless loop
  const allWords = [...words, ...words]

  return (
    <div
      className={`${styles.marquee} ${className}`}
      style={{ '--speed': speed } as CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.track}>
        {allWords.map((word, i) => (
          <span key={`${word}-${i}`} className={styles.item}>
            <span className={styles.word}>{word}</span>
            <span className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  )
}
