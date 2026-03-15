'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Nav.module.css'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={[styles.nav, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}>
      <Link href="/" className={styles.logo}>
        Curiosity<span className={styles.logoAccent}>.</span>
      </Link>

      <ul className={styles.links}>
        <li><Link href="/insights"      className={styles.link}>Insights</Link></li>
        <li><Link href="/framework"     className={styles.link}>Framework</Link></li>
        <li><Link href="/case-studies"  className={styles.link}>Case Studies</Link></li>
      </ul>

      <Link href="/work-together" className={styles.cta}>
        Work Together
      </Link>
    </nav>
  )
}
