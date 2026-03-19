import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-data'
import { BlogPostClient } from '@/components/blog/blog-post-client'

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} — Souvik Ghosh`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3)

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />
}
