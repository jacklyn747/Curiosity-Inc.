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
        <li><Link href="/work"       className={styles.link}>Work</Link></li>
        <li><Link href="/the-system" className={styles.link}>The System</Link></li>
        <li><Link href="/about"      className={styles.link}>About</Link></li>
      </ul>

      <Link href="/contact" className={styles.cta}>
        Start a Project
      </Link>
    </nav>
  )
}
