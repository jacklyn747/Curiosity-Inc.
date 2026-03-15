import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Behavioral design thinking. How people actually decide, learn, and act — and what that means for your brand.',
}

export default function InsightsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="min-h-[70vh] flex flex-col justify-end px-6 md:px-16"
        style={{ paddingBottom: '80px', paddingTop: '160px' }}
      >
        <p
          className="t-eyebrow mb-6"
          style={{ color: 'var(--tang)', opacity: 0.5, letterSpacing: '0.28em' }}
        >
          Insights
        </p>

        <h1
          className="t-headline mb-6"
          style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            lineHeight: 0.95,
            maxWidth: '700px',
          }}
        >
          The thinking behind the work.
        </h1>

        <p
          className="t-body"
          style={{ fontSize: '17px', maxWidth: '520px', lineHeight: 1.7, opacity: 0.55 }}
        >
          Behavioral design isn&apos;t a deliverable. It&apos;s a lens.
          These are the ideas we keep coming back to — the patterns
          that show up in every project, every audit, every system we build.
        </p>
      </section>

      {/* ── Placeholder Grid ─────────────────────────────── */}
      <section className="px-6 md:px-16 pb-32">
        <div
          className="grid gap-px"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            border: '1px solid rgba(234,228,218,0.06)',
          }}
        >
          {[
            {
              tag: 'Behavioral Design',
              title: 'The Expertise Adoption Gap',
              sub: 'Why the smartest people in the room have the hardest time getting heard.',
            },
            {
              tag: 'Knowledge Architecture',
              title: 'Content Isn\u2019t a Strategy',
              sub: 'A strategy is a system. Content is one output of that system.',
            },
            {
              tag: 'Cognitive Friction',
              title: 'Where Attention Goes to Die',
              sub: 'Most funnels don\u2019t have a traffic problem. They have a clarity problem.',
            },
            {
              tag: 'Decision Architecture',
              title: 'People Don\u2019t Make Decisions',
              sub: 'They make defaults. Your job is to design better defaults.',
            },
            {
              tag: 'Signal Design',
              title: 'The Noise-to-Signal Ratio',
              sub: 'Five layers between stimulus and meaning. Most brands only design for the first two.',
            },
            {
              tag: 'System Thinking',
              title: 'Why Frameworks Outperform Tactics',
              sub: 'Tactics expire. Frameworks compound. Here\u2019s the structural difference.',
            },
          ].map((post) => (
            <article
              key={post.title}
              className="group"
              style={{
                padding: '40px 32px',
                borderBottom: '1px solid rgba(234,228,218,0.06)',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
            >
              <p
                className="t-eyebrow mb-4"
                style={{ fontSize: '9px', letterSpacing: '0.22em', opacity: 0.3 }}
              >
                {post.tag}
              </p>
              <h3
                className="t-headline mb-3"
                style={{ fontSize: '22px', lineHeight: 1.2 }}
              >
                {post.title}
              </h3>
              <p className="t-body" style={{ fontSize: '14px', opacity: 0.4, lineHeight: 1.6 }}>
                {post.sub}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Flow Link ────────────────────────────────────── */}
      <section
        className="flex flex-col items-center text-center px-6 pb-32"
      >
        <p className="t-body mb-4" style={{ opacity: 0.35, fontSize: '13px' }}>
          Wondering if this applies to you?
        </p>
        <Link
          href="/the-accidental-educator"
          className="t-eyebrow"
          style={{
            color: 'var(--tang)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textDecoration: 'none',
          }}
        >
          Read: The Accidental Educator →
        </Link>
      </section>
    </>
  )
}
