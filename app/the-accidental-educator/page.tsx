import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Accidental Educator',
  description: 'You didn\u2019t set out to teach. But the world keeps asking you to explain. This is for people whose ideas outgrew their content.',
}

export default function AccidentalEducatorPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="min-h-[80vh] flex flex-col justify-end px-6 md:px-16"
        style={{ paddingBottom: '80px', paddingTop: '160px' }}
      >
        <p
          className="t-eyebrow mb-6"
          style={{ color: 'var(--must)', opacity: 0.5, letterSpacing: '0.28em' }}
        >
          Who This Is For
        </p>

        <h1
          className="t-headline mb-8"
          style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            lineHeight: 0.93,
            maxWidth: '800px',
          }}
        >
          The Accidental Educator.
        </h1>

        <p
          className="t-body"
          style={{ fontSize: '18px', maxWidth: '560px', lineHeight: 1.7, opacity: 0.65 }}
        >
          You didn&apos;t set out to teach. You set out to build,
          consult, practice, lead. But somewhere along the way, people started
          asking you to explain things. And you got good at it.
        </p>
      </section>

      {/* ── The Problem ──────────────────────────────────── */}
      <section className="px-6 md:px-16 pb-24" style={{ maxWidth: '680px' }}>
        <p className="t-body mb-8" style={{ fontSize: '17px', lineHeight: 1.8, opacity: 0.55 }}>
          Now you have an audience. Maybe a newsletter, a course, a podcast.
          You have expertise people pay attention to. But something isn&apos;t
          working the way it should.
        </p>

        <div
          style={{
            borderLeft: '2px solid var(--tang)',
            paddingLeft: '24px',
            marginBottom: '48px',
          }}
        >
          <p className="t-body" style={{ fontSize: '17px', lineHeight: 1.8, opacity: 0.7 }}>
            Your content is good. Your audience says so. But it&apos;s not
            converting the way it should. The depth is there — the architecture
            isn&apos;t. You&apos;re creating noise when you should be engineering signal.
          </p>
        </div>

        <h2
          className="t-headline mb-6"
          style={{ fontSize: '28px', lineHeight: 1.15 }}
        >
          You might recognize this:
        </h2>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            'Your ideas are too complex for a LinkedIn carousel — but you keep making them anyway.',
            'People say "this is so good" but don\u2019t buy.',
            'You\u2019ve tried every format. The problem isn\u2019t the format.',
            'You know more than your content shows, and it\u2019s starting to frustrate you.',
            'You have 10,000 followers and 12 customers.',
          ].map((item) => (
            <li
              key={item}
              className="t-body"
              style={{
                fontSize: '16px',
                lineHeight: 1.7,
                opacity: 0.55,
                padding: '12px 0',
                borderBottom: '1px solid rgba(234,228,218,0.06)',
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* ── The Reframe ──────────────────────────────────── */}
      <section className="px-6 md:px-16 pb-24" style={{ maxWidth: '680px' }}>
        <h2
          className="t-headline mb-6"
          style={{ fontSize: '28px', lineHeight: 1.15 }}
        >
          The gap isn&apos;t content. It&apos;s architecture.
        </h2>

        <p className="t-body mb-6" style={{ fontSize: '17px', lineHeight: 1.8, opacity: 0.55 }}>
          Most expert-led brands have an <em>expertise adoption gap</em>.
          The knowledge is real. The audience is real. But the path from
          &ldquo;this person is smart&rdquo; to &ldquo;I need to work with them&rdquo;
          is missing structural support.
        </p>

        <p className="t-body mb-12" style={{ fontSize: '17px', lineHeight: 1.8, opacity: 0.55 }}>
          That&apos;s a behavioral design problem. Not a marketing one.
          And it&apos;s exactly what we build for.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-6"
          style={{ paddingTop: '20px' }}
        >
          <Link
            href="/framework"
            className="t-eyebrow"
            style={{
              color: 'var(--tang)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textDecoration: 'none',
            }}
          >
            See the Framework →
          </Link>
          <Link
            href="/case-studies"
            className="t-eyebrow"
            style={{
              color: 'rgba(234,228,218,0.4)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textDecoration: 'none',
            }}
          >
            Read the Case Studies →
          </Link>
        </div>
      </section>
    </>
  )
}
