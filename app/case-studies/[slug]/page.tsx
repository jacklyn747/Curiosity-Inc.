// app/case-studies/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { caseStudies, getCaseStudy } from '@/lib/case-studies'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { SituationSection } from '@/components/case-study/SituationSection'
import { ChallengeSection } from '@/components/case-study/ChallengeSection'
import { MovesSection } from '@/components/case-study/MovesSection'
import { LearningFlowSection } from '@/components/case-study/LearningFlowSection'
import { NarrativeSection } from '@/components/case-study/NarrativeSection'
import { WhatWorksSection } from '@/components/case-study/WhatWorksSection'
import { MissedOpsSection } from '@/components/case-study/MissedOpsSection'
import { CuriosityUpgradeSection } from '@/components/case-study/CuriosityUpgradeSection'
import { TakeawaysSection } from '@/components/case-study/TakeawaysSection'

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
      <CaseStudyHero data={cs} />
      <SituationSection data={cs} />
      <ChallengeSection data={cs} />
      <MovesSection data={cs} />
      <LearningFlowSection data={cs} />
      <NarrativeSection data={cs} />
      <WhatWorksSection data={cs} />
      <MissedOpsSection data={cs} />
      <CuriosityUpgradeSection data={cs} />
      <TakeawaysSection data={cs} />
    </main>
  )
}
