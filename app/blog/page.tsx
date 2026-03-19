import { Metadata } from 'next'
import { BlogPageClient } from '@/components/blog/blog-page-client'

export const metadata: Metadata = {
  title: 'Blog — Souvik Ghosh',
  description: 'Technical writing on software engineering, distributed systems, real-time communication, and career growth by Souvik Ghosh.',
  openGraph: {
    title: 'Blog — Souvik Ghosh',
    description: 'Technical insights on software engineering, distributed systems, and full-stack development.',
    type: 'website',
  },
}

export default function BlogPage() {
  return <BlogPageClient />
}
