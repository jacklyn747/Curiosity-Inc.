import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work Together',
  description: 'Let\u2019s turn your expertise into a behavioral system. Start a conversation with Curiosity Inc.',
}

export default function WorkTogetherPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="min-h-[70vh] flex flex-col justify-end px-6 md:px-16"
        style={{ paddingBottom: '60px', paddingTop: '160px' }}
      >
        <p
          className="t-eyebrow mb-6"
          style={{ color: 'var(--tang)', opacity: 0.5, letterSpacing: '0.28em' }}
        >
          Work Together
        </p>

        <h1
          className="t-headline mb-6"
          style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            lineHeight: 0.95,
            maxWidth: '700px',
          }}
        >
          Let&apos;s build the system.
        </h1>

        <p
          className="t-body"
          style={{ fontSize: '17px', maxWidth: '520px', lineHeight: 1.7, opacity: 0.55 }}
        >
          You have the expertise. You have the audience.
          What&apos;s missing is the behavioral architecture that
          turns attention into action. That&apos;s what we build.
        </p>
      </section>

      {/* ── What happens ─────────────────────────────────── */}
      <section className="px-6 md:px-16 pb-24" style={{ maxWidth: '680px' }}>
        <h2
          className="t-headline mb-8"
          style={{ fontSize: '24px', lineHeight: 1.15 }}
        >
          What working together looks like.
        </h2>

        <div className="flex flex-col" style={{ gap: '0' }}>
          {[
            {
              step: '01',
              title: 'Behavioral Audit',
              body: 'We map your current system — content, offers, audience journey — and find where attention is leaking.',
            },
            {
              step: '02',
              title: 'Architecture Design',
              body: 'We design the behavioral framework: what signals to send, where, and in what sequence.',
            },
            {
              step: '03',
              title: 'System Build',
              body: 'We build the system — brand, content architecture, decision flows — so every touchpoint compounds.',
            },
            {
              step: '04',
              title: 'Signal Calibration',
              body: 'We measure, refine, and tune. Not vanity metrics. Behavioral ones: did people do what the system was designed to produce?',
            },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                gap: '20px',
                padding: '28px 0',
                borderBottom: '1px solid rgba(234,228,218,0.06)',
              }}
            >
              <span
                className="t-eyebrow"
                style={{ fontSize: '10px', opacity: 0.25, letterSpacing: '0.2em', paddingTop: '4px' }}
              >
                {s.step}
              </span>
              <div>
                <h3 className="t-headline mb-2" style={{ fontSize: '18px' }}>
                  {s.title}
                </h3>
                <p className="t-body" style={{ fontSize: '14px', opacity: 0.45, lineHeight: 1.7 }}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────── */}
      <section className="px-6 md:px-16 pb-32" style={{ maxWidth: '680px' }}>
        <div
          style={{
            border: '1px solid rgba(234,228,218,0.08)',
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          <h2 className="t-headline mb-4" style={{ fontSize: '24px' }}>
            Start a conversation.
          </h2>
          <p className="t-body mb-8" style={{ fontSize: '15px', opacity: 0.45, lineHeight: 1.7 }}>
            No pitch deck. No discovery call script. Just a real conversation
            about what you&apos;re building and where the behavioral gaps are.
          </p>
          <a
            href="mailto:hello@curiosity.inc"
            className="t-eyebrow inline-block"
            style={{
              color: 'var(--tang)',
              fontSize: '12px',
              letterSpacing: '0.2em',
              textDecoration: 'none',
              border: '1px solid rgba(237,119,60,0.35)',
              padding: '14px 32px',
              borderRadius: '2px',
              transition: 'background 0.2s, border-color 0.2s',
            }}
          >
            hello@curiosity.inc
          </a>
        </div>
      </section>
    </>
  )
}
