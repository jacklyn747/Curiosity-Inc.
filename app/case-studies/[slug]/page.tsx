// app/case-studies/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { caseStudies, getCaseStudy } from '@/lib/case-studies'

// Uncomment imports as each section component is created:
// import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
// import { SituationSection } from '@/components/case-study/SituationSection'
// ... etc

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return caseStudies.map(cs => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}
  return {
    title: `${cs.name} — Curiosity Inc`,
    description: cs.subhead,
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  return (
    <main style={{ background: 'var(--black)', minHeight: '100vh' }}>
      {/* Section components render here — add as built */}
      <div style={{ padding: '120px 60px', color: 'var(--shell)', fontFamily: 'var(--font-display)' }}>
        <p style={{ opacity: 0.4, fontSize: '12px', letterSpacing: '0.2em' }}>
          {cs.index} / {cs.outcome}
        </p>
        <h1 style={{ fontSize: '48px', marginTop: '16px' }}>{cs.headline}</h1>
        <p style={{ marginTop: '12px', opacity: 0.4 }}>Sections loading...</p>
      </div>
    </main>
  )
}
