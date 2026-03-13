import Link from 'next/link'
import { StarField } from '@/components/geo/StarField'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <StarField className="opacity-30" />

      <div className={styles.inner}>
        <div>
          <Link href="/" className={styles.logo}>
            Curiosity<span className={styles.logoAccent}>.</span>
          </Link>
          <p className={styles.tagline}>
            Behavior design at the intersection of Marketing, Instructional Design, and UX.
          </p>
        </div>

        <nav className={styles.navGroup}>
          <h3>Navigate</h3>
          <ul>
            <li><Link href="/work">Work</Link></li>
            <li><Link href="/the-system">The System</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-[9px] font-semibold tracking-[0.28em] uppercase text-shell/20 mb-5">
            Get in touch
          </h3>
          <a href="mailto:hello@curiosity.inc" className={styles.email}>
            hello@curiosity.inc
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copyright}>
          © {year} Curiosity Inc. All rights reserved.
        </span>
        <span className={styles.copyright}>
          Behavior design. Cognitive architecture. Signal over noise.
        </span>
      </div>
    </footer>
  )
}
