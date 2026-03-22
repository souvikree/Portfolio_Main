import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { caseStudies, getCaseStudy } from '@/lib/case-studies-data'
import { CaseStudyPageClient } from '@/components/case-study-page-client'
import { FEATURES } from '@/lib/feature-flags'

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  if (!FEATURES.caseStudies) return []
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  if (!FEATURES.caseStudies) return { title: 'Not Found' }
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return { title: 'Not Found' }
  return {
    title: `${cs.projectName} Case Study`,
    description: cs.tagline,
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  // Feature flag — returns 404 when disabled
  if (!FEATURES.caseStudies) notFound()

  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  return <CaseStudyPageClient cs={cs} />
}