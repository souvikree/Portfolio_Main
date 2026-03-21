import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-data'
import { BlogPostClient } from '@/components/blog/blog-post-client'

const BASE_URL = 'https://souviksportfolio.vercel.app'

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Post Not Found' }

  const postUrl = `${BASE_URL}/blog/${post.slug}`

  return {
    title: post.title,                      // uses layout template → "Post Title — Souvik Ghosh"
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: postUrl },

    openGraph: {
      type: 'article',
      url: postUrl,
      siteName: 'Souvik Ghosh',
      title: `${post.title} — Souvik Ghosh`,
      description: post.excerpt,
      publishedTime: new Date(post.date).toISOString(),
      authors: [`${BASE_URL}`],
      tags: post.tags,
      // Next.js will auto-use the root /opengraph-image.tsx since
      // there's no per-post opengraph-image — good enough for blog posts
    },

    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — Souvik Ghosh`,
      description: post.excerpt,
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