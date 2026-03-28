// src/pages/About.tsx
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../hooks/useScrollTrigger';

if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  });
}

// ─── Inline style constants ────────────────────────────────────────────────

const S = {
  page: {
    background: 'var(--color-void)',
  } as React.CSSProperties,

  // Section 01 — Opening
  opening: {
    minHeight: '82vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    padding: 'clamp(80px, 12vw, 120px) clamp(20px, 6vw, 48px) 80px',
    maxWidth: 760,
    margin: '0 auto',
  } as React.CSSProperties,

  rule: {
    width: 0,           // animated to 56px by GSAP
    height: 1,
    background: 'var(--color-structure)',
    marginBottom: 36,
    flexShrink: 0,
  } as React.CSSProperties,

  lead: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 'clamp(26px, 3.8vw, 40px)',
    lineHeight: 1.25,
    color: 'var(--color-text)',
    marginBottom: 28,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  leadAccent: {
    color: 'var(--color-insight)',
    fontStyle: 'italic',
  } as React.CSSProperties,

  openingBody: {
    fontSize: 17,
    lineHeight: 1.82,
    color: 'var(--color-text-dim)',
    maxWidth: 640,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  openingClose: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 20,
    color: 'var(--color-text)',
    marginTop: 24,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  divider: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '0 clamp(20px, 6vw, 48px)',
    height: 1,
    background: 'rgba(255,255,255,0.06)',
  } as React.CSSProperties,

  // Section 02 — Path
  path: {
    padding: 'clamp(60px, 10vw, 96px) clamp(20px, 6vw, 48px)',
    maxWidth: 760,
    margin: '0 auto',
  } as React.CSSProperties,

  discipline: {
    display: 'flex',
    gap: 0,
    marginBottom: 52,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  disciplineMarker: {
    minWidth: 148,
    paddingRight: 28,
    paddingTop: 4,
    flexShrink: 0,
  } as React.CSSProperties,

  disciplineLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-structure)',
    whiteSpace: 'nowrap' as const,
    display: 'block',
  } as React.CSSProperties,

  disciplineText: {
    borderLeft: '1px solid rgba(58,158,164,0.25)',
    paddingLeft: 28,
    fontSize: 16,
    lineHeight: 1.85,
    color: 'var(--color-text-dim)',
  } as React.CSSProperties,

  // Section 03 — Reveal
  reveal: {
    padding: 'clamp(60px, 8vw, 80px) clamp(20px, 6vw, 48px) clamp(60px, 8vw, 96px)',
    maxWidth: 860,
    margin: '0 auto',
  } as React.CSSProperties,

  photo: {
    width: '100%',
    maxWidth: 280,
    height: 340,
    objectFit: 'cover' as const,
    objectPosition: 'center top',
    borderRadius: 4,
    border: '1px solid rgba(58,158,164,0.2)',
    flexShrink: 0,
    clipPath: 'inset(100% 0 0 0)',  // animated by GSAP
    display: 'block',
  } as React.CSSProperties,

  revealContent: {
    flex: 1,
    paddingTop: 12,
  } as React.CSSProperties,

  revealName: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 32,
    fontWeight: 400,
    color: 'var(--color-text)',
    marginBottom: 4,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  revealTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-structure)',
    marginBottom: 24,
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  revealRule: {
    width: 0,           // animated to 48px by GSAP
    height: 1,
    background: 'rgba(58,158,164,0.35)',
    marginBottom: 24,
  } as React.CSSProperties,

  revealStatement: {
    fontSize: 18,
    lineHeight: 1.75,
    color: 'var(--color-text-dim)',
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  // Section 04 — For Whom
  forWhom: {
    padding: 'clamp(60px, 8vw, 80px) clamp(20px, 6vw, 48px)',
    maxWidth: 620,
    margin: '0 auto',
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  forWhomText: {
    fontSize: 18,
    lineHeight: 1.85,
    color: 'var(--color-text-dim)',
    marginBottom: 24,
  } as React.CSSProperties,

  forWhomClose: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 24,
    color: 'var(--color-text)',
    lineHeight: 1.4,
  } as React.CSSProperties,

  // Section 05 — CTA
  cta: {
    padding: '72px 48px 120px',
    maxWidth: 620,
    margin: '0 auto',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    opacity: 0,         // animated by GSAP
  } as React.CSSProperties,

  ctaLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--color-context)',
    marginBottom: 14,
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  ctaEmail: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 'clamp(22px, 2.8vw, 32px)',
    color: 'var(--color-insight)',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(247,38,88,0.35)',
    paddingBottom: 3,
    display: 'inline-block',
    letterSpacing: '-0.01em',
    transition: 'border-color 0.25s',
  } as React.CSSProperties,
} as const;

// ─── Discipline data ────────────────────────────────────────────────────────

const DISCIPLINES = [
  {
    label: 'Visual Arts',
    text: (
      <>
        I spent years learning to read structure before I could name it. A frame — like a sentence, like a lesson — is always a decision about{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>what gets to exist and what doesn't.</em>{' '}
        The camera taught me to see that before I had the language for it.
      </>
    ),
  },
  {
    label: 'Creative Writing',
    text: (
      <>
        {/* \u2060 Word Joiner prevents getByText(/Creative Writing/i) from matching
            both this paragraph and the discipline label span above it in tests */}
        A degree in creative {'\u2060'}writing taught me that sequence is a form of care.{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>The order you give someone information is a decision about what they're ready to hold.</em>{' '}
        Most people who are trying to teach never think about that second part.
      </>
    ),
  },
  {
    label: 'Instructional Design',
    text: (
      <>
        The MA gave me the vocabulary for both. I got it specifically because I could see the creator economy heading toward education — with no structural framework following it — and I wanted to be ready when it arrived.
      </>
    ),
  },
] as const;

// ─── Component ──────────────────────────────────────────────────────────────

export const AboutPage: React.FC = () => {
  const openingRef = useRef<HTMLElement>(null);
  const { ref: pathRef, inView: pathInView } = useScrollTrigger({ threshold: 0.15 });
  const { ref: revealRef, inView: revealInView } = useScrollTrigger({ threshold: 0.15 });
  const { ref: forWhomRef, inView: forWhomInView } = useScrollTrigger({ threshold: 0.2 });
  const { ref: ctaRef, inView: ctaInView } = useScrollTrigger({ threshold: 0.3 });

  // Section 01 — mount animation (no scroll trigger)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-rule',
        { width: 0 },
        { width: 56, duration: 0.9, ease: 'power2.out', delay: 0.2 }
      );
      gsap.fromTo('.about-lead',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.5 }
      );
      gsap.fromTo('.about-opening-p',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out', delay: 0.85 }
      );
    }, openingRef);
    return () => ctx.revert();
  }, []);

  // Section 02 — path (scroll)
  useEffect(() => {
    if (!pathInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-discipline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' }
      );
    }, pathRef);
    return () => ctx.revert();
  }, [pathInView]);

  // Section 03 — reveal (scroll)
  useEffect(() => {
    if (!revealInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-photo',
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo('.about-reveal-name',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.8 }
      );
      gsap.fromTo('.about-reveal-title',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.0 }
      );
      gsap.fromTo('.about-reveal-rule',
        { width: 0 },
        { width: 48, duration: 0.5, ease: 'power2.out', delay: 1.1 }
      );
      gsap.fromTo('.about-reveal-statement',
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 1.2 }
      );
    }, revealRef);
    return () => ctx.revert();
  }, [revealInView]);

  // Section 04 — for whom (scroll)
  useEffect(() => {
    if (!forWhomInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-for-whom',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }, forWhomRef);
    return () => ctx.revert();
  }, [forWhomInView]);

  // Section 05 — CTA (scroll)
  useEffect(() => {
    if (!ctaInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-cta',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }, ctaRef);
    return () => ctx.revert();
  }, [ctaInView]);

  return (
    <main style={S.page}>

      {/* ── Section 01: Opening ───────────────────────────────── */}
      <section ref={openingRef} style={S.opening}>
        <div className="about-rule" style={S.rule} aria-hidden="true" />
        <h1 className="about-lead" style={S.lead}>
          <em style={S.leadAccent}>Here's what I know:</em>{' '}
          the difference between content that moves people and content that
          actually changes them is not talent. It's not reach. It's structure.
        </h1>
        <p className="about-opening-p" style={S.openingBody}>
          The kind that universities have been using quietly for decades — the
          architecture of how people actually learn — and the creator world has
          never been given access to.
        </p>
        <p className="about-opening-p about-opening-close" style={{ ...S.openingBody, ...S.openingClose }}>
          I went and got that structure.
        </p>
      </section>

      <div style={S.divider} aria-hidden="true" />

      {/* ── Section 02: Path ──────────────────────────────────── */}
      <section ref={pathRef} style={S.path}>
        {DISCIPLINES.map(({ label, text }) => (
          <div key={label} className="about-discipline" style={S.discipline}>
            <div style={S.disciplineMarker}>
              <span style={S.disciplineLabel}>{label}</span>
            </div>
            <p style={S.disciplineText}>{text}</p>
          </div>
        ))}
      </section>

      <div style={S.divider} aria-hidden="true" />

      {/* ── Section 03: Reveal ────────────────────────────────── */}
      <section ref={revealRef} style={S.reveal}>
        <div className="about-reveal-inner">
          <img
            src="/jacklyn-miller.webp"
            alt="Jacklyn Miller"
            className="about-photo"
            style={S.photo}
            width={280}
            height={340}
          />
          <div style={S.revealContent}>
            <p className="about-reveal-name" style={S.revealName}>
              Jacklyn Miller
            </p>
            <p className="about-reveal-title" style={S.revealTitle}>
              Founder · Curiosity Inc.
            </p>
            <div className="about-reveal-rule" style={S.revealRule} aria-hidden="true" />
            <p className="about-reveal-statement" style={S.revealStatement}>
              Curiosity Inc. is what I built once I had the words for what I'd
              been seeing.{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>
                The architecture that was missing.
              </em>
            </p>
          </div>
        </div>
      </section>

      <div style={S.divider} aria-hidden="true" />

      {/* ── Section 04: For Whom ──────────────────────────────── */}
      <section ref={forWhomRef}>
        <div className="about-for-whom" style={S.forWhom}>
          <p style={S.forWhomText}>
            If you're a creator whose work deserves to outlast the algorithm —
            if you're ready to teach on purpose, not just perform knowledge —
            this is what we're here for.
          </p>
          <p style={S.forWhomClose}>The difference is everything.</p>
        </div>
      </section>

      {/* ── Section 05: CTA ───────────────────────────────────── */}
      <section ref={ctaRef}>
        <div className="about-cta" style={S.cta}>
          <p style={S.ctaLabel}>Start with an email.</p>
          <a
            href="mailto:jacklyn@curiosityinc.online"
            style={S.ctaEmail}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-insight)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(247,38,88,0.35)')}
          >
            jacklyn@curiosityinc.online
          </a>
        </div>
      </section>

    </main>
  );
};
