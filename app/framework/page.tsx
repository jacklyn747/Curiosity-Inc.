import type { Metadata } from 'next'
import Link from 'next/link'
import { layers } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: 'Framework',
  description: 'Noise to Signal — the five behavioral layers between stimulus and meaning. This is how we design.',
}

export default function FrameworkPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="min-h-[70vh] flex flex-col justify-end px-6 md:px-16"
        style={{ paddingBottom: '80px', paddingTop: '160px' }}
      >
        <p
          className="t-eyebrow mb-6"
          style={{ color: 'var(--lav)', opacity: 0.5, letterSpacing: '0.28em' }}
        >
          The Framework
        </p>

        <h1
          className="t-headline mb-6"
          style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            lineHeight: 0.95,
            maxWidth: '700px',
          }}
        >
          Noise to Signal.
        </h1>

        <p
          className="t-body"
          style={{ fontSize: '17px', maxWidth: '520px', lineHeight: 1.7, opacity: 0.55 }}
        >
          Five layers between stimulus and meaning. Most brands
          design for the first. We design for all five.
        </p>
      </section>

      {/* ── The Five Layers ──────────────────────────────── */}
      <section className="px-6 md:px-16 pb-24" style={{ maxWidth: '860px' }}>
        <div className="flex flex-col" style={{ gap: '2px' }}>
          {layers.map((layer, i) => (
            <div
              key={layer.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 140px 1fr',
                alignItems: 'center',
                padding: '28px 0',
                borderBottom: '1px solid rgba(234,228,218,0.06)',
                gap: '24px',
              }}
            >
              {/* Index */}
              <span
                className="t-eyebrow"
                style={{ fontSize: '10px', opacity: 0.25, letterSpacing: '0.2em' }}
              >
                0{i + 1}
              </span>

              {/* Layer Name */}
              <span
                className="t-headline"
                style={{ fontSize: '18px', color: layer.color }}
              >
                {layer.label}
              </span>

              {/* Description */}
              <p className="t-body" style={{ fontSize: '14px', opacity: 0.4, lineHeight: 1.6 }}>
                {layerDescriptions[layer.id]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="px-6 md:px-16 pb-24" style={{ maxWidth: '680px' }}>
        <h2
          className="t-headline mb-6"
          style={{ fontSize: '28px', lineHeight: 1.15 }}
        >
          How we use this.
        </h2>

        <p className="t-body mb-6" style={{ fontSize: '17px', lineHeight: 1.8, opacity: 0.55 }}>
          Every project starts with mapping where attention breaks down.
          We don&apos;t guess — we trace the behavioral path from first
          impression to decision, find the friction, and redesign the
          architecture around it.
        </p>

        <p className="t-body mb-12" style={{ fontSize: '17px', lineHeight: 1.8, opacity: 0.55 }}>
          The framework isn&apos;t a slide in a deck. It&apos;s the operating
          system behind every case study, every audit, every system we build.
        </p>

        <Link
          href="/case-studies"
          className="t-eyebrow"
          style={{
            color: 'var(--tang)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textDecoration: 'none',
          }}
        >
          See it in action →
        </Link>
      </section>
    </>
  )
}

// ── Layer descriptions ──────────────────────────────────────────────────────

const layerDescriptions: Record<string, string> = {
  stimulus:  'What triggers initial attention. The first impression, the scroll-stopping moment, the reason someone pauses.',
  cognition: 'How the brain processes what it just saw. Pattern matching, framing, the instant judgment before conscious thought.',
  behavior:  'The action — or inaction — that follows. Clicking, scrolling past, signing up, closing the tab.',
  system:    'The structural design that shapes behavior at scale. Not one interaction — the architecture of all of them.',
  signal:    'The outcome. Authority, trust, demand. The meaning that survives after the noise fades.',
}
