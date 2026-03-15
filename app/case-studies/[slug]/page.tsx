import { notFound }          from 'next/navigation'
import { getCaseStudy, caseStudies } from '@/lib/case-studies'

import { CaseStudyHero }    from '@/components/case-study/CaseStudyHero'
import { AwarenessSection } from '@/components/case-study/AwarenessSection'
import { InsightSection }   from '@/components/case-study/InsightSection'
import { ActionSection }    from '@/components/case-study/ActionSection'
import { FrameworkSection } from '@/components/case-study/FrameworkSection'
import { CaseStudySystemSection as SystemSection } from '@/components/case-study/SystemSection'
import { AuthoritySection } from '@/components/case-study/AuthoritySection'
import { CaseStudyProgress } from '@/components/case-study/CaseStudyProgress'

// ─── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const data = getCaseStudy(params.slug)
  if (!data) return {}
  return {
    title: `${data.headline} — Curiosity Inc`,
    description: data.subhead,
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const data = getCaseStudy(params.slug)
  if (!data) notFound()

  return (
    <>
      {/* Sticky sacred-geometry progress spine — client only */}
      <CaseStudyProgress />

      {/* Content sections — each carries its own scroll-trigger id */}
      <CaseStudyHero    data={data} />
      <AwarenessSection data={data} />
      <InsightSection   data={data} />
      <ActionSection    data={data} />
      <FrameworkSection data={data} />
      <SystemSection    data={data} />
      <AuthoritySection data={data} />
    </>
  )
}
