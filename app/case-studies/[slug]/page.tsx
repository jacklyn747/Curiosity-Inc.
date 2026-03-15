import { notFound }                  from 'next/navigation'
import { caseStudies, getCaseStudy }  from '@/lib/case-studies'
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
      <CaseStudyHero          data={cs} />
      <AwarenessSection       data={cs} />
      <InsightSection         data={cs} />
      <ActionSection          data={cs} />
      <FrameworkSection       data={cs} />
      <CaseStudySystemSection data={cs} />
      <AuthoritySection       data={cs} />
    </main>
  )
}
