import { notFound }                  from 'next/navigation'
import { caseStudies, getCaseStudy }  from '@/lib/case-studies'
import { CaseStudyProgress }          from '@/components/case-study/CaseStudyProgress'
import { CaseStudyHero }              from '@/components/case-study/CaseStudyHero'
import { AwarenessSection }           from '@/components/case-study/AwarenessSection'
import { InsightSection }             from '@/components/case-study/InsightSection'
import { ActionSection }              from '@/components/case-study/ActionSection'
import { FrameworkSection }           from '@/components/case-study/FrameworkSection'
import { CaseStudySystemSection }     from '@/components/case-study/SystemSection'
import { AuthoritySection }           from '@/components/case-study/AuthoritySection'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }))
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
      {/* Fixed behavioral framework spine — tracks scroll progress */}
      <CaseStudyProgress />

      {/* Section IDs are the scroll targets for the progress spine */}
      <div id="cs-hero">      <CaseStudyHero          data={cs} /></div>
      <div id="cs-awareness"> <AwarenessSection       data={cs} /></div>
      <div id="cs-insight">   <InsightSection         data={cs} /></div>
      <div id="cs-action">    <ActionSection          data={cs} /></div>
      <div id="cs-framework"> <FrameworkSection       data={cs} /></div>
      <div id="cs-system">    <CaseStudySystemSection data={cs} /></div>
      <div id="cs-authority"> <AuthoritySection       data={cs} /></div>
    </main>
  )
}
