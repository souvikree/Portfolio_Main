'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, ChevronRight, Github, Linkedin } from 'lucide-react'
import { type BlogPost } from '@/lib/blog-data'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FloatingThemeSwitcher } from '@/components/theme-switcher'

const CATEGORY_COLORS: Record<string, string> = {
  Backend: '#00F5FF',
  Frontend: '#C77DFF',
  Architecture: '#FFD166',
  Career: '#00FF87',
  DevOps: '#FF6B35',
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="flex flex-col gap-4">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />

        // H2
        if (line.startsWith('## ')) {
          return (
            <h2
              key={i}
              className="text-2xl font-black mt-6 mb-2"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
            >
              {line.replace('## ', '')}
            </h2>
          )
        }

        // H3
        if (line.startsWith('### ')) {
          return (
            <h3
              key={i}
              className="text-lg font-bold mt-4 mb-1"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
            >
              {line.replace('### ', '')}
            </h3>
          )
        }

        // Code block start
        if (line.startsWith('```')) {
          return null
        }

        // List items
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const text = line.replace(/^[-*] /, '')
          const boldMatch = text.match(/^\*\*(.+?)\*\*(.*)/)
          return (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed ml-4"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              {boldMatch ? (
                <span>
                  <strong style={{ color: 'var(--foreground)' }}>{boldMatch[1]}</strong>
                  {boldMatch[2]}
                </span>
              ) : (
                text
              )}
            </li>
          )
        }

        // Numbered list
        const numberedMatch = line.match(/^(\d+)\. (.+)/)
        if (numberedMatch) {
          return (
            <li
              key={i}
              className="flex items-start gap-3 text-sm leading-relaxed ml-4"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                style={{ background: 'var(--muted)', color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
              >
                {numberedMatch[1]}
              </span>
              {numberedMatch[2]}
            </li>
          )
        }

        // Regular paragraph (with inline bold support)
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        return (
          <p
            key={i}
            className="text-base leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={j} style={{ color: 'var(--foreground)' }}>
                  {part.replace(/\*\*/g, '')}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        )
      })}
    </div>
  )
}

function CodeBlockRenderer({ content }: { content: string }) {
  const blocks: { type: 'text' | 'code'; content: string; lang?: string }[] = []
  const lines = content.split('\n')
  let inCode = false
  let codeLang = ''
  let codeLines: string[] = []
  let textLines: string[] = []

  for (const line of lines) {
    if (line.startsWith('```') && !inCode) {
      if (textLines.length > 0) {
        blocks.push({ type: 'text', content: textLines.join('\n') })
        textLines = []
      }
      inCode = true
      codeLang = line.replace('```', '').trim()
      codeLines = []
    } else if (line.startsWith('```') && inCode) {
      blocks.push({ type: 'code', content: codeLines.join('\n'), lang: codeLang })
      codeLines = []
      inCode = false
      codeLang = ''
    } else if (inCode) {
      codeLines.push(line)
    } else {
      textLines.push(line)
    }
  }
  if (textLines.length > 0) blocks.push({ type: 'text', content: textLines.join('\n') })

  return (
    <>
      {blocks.map((block, i) =>
        block.type === 'code' ? (
          <div key={i} className="my-4">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                {block.lang && (
                  <span
                    className="ml-2 text-xs px-2 py-0.5 rounded"
                    style={{
                      background: 'var(--muted)',
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-jetbrains)',
                    }}
                  >
                    {block.lang}
                  </span>
                )}
              </div>
              <pre
                className="p-5 overflow-x-auto text-sm leading-relaxed"
                style={{
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-jetbrains)',
                  background: 'rgba(0,0,0,0.4)',
                }}
              >
                <code>{block.content}</code>
              </pre>
            </div>
          </div>
        ) : (
          <MarkdownRenderer key={i} content={block.content} />
        )
      )}
    </>
  )
}

interface Props {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export function BlogPostClient({ post, relatedPosts }: Props) {
  const color = CATEGORY_COLORS[post.category] ?? 'var(--accent)'

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${color}18 0%, transparent 65%)`,
          }}
        />

        <div className="section-container relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mb-8 text-sm transition-all duration-200"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
            >
              <ArrowLeft size={14} />
              Back to blog
            </Link>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold"
                style={{
                  background: `${color}18`,
                  color,
                  border: `1px solid ${color}40`,
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                {post.category}
              </span>
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              >
                <Clock size={11} />
                {post.readTime}
              </span>
              <span
                className="text-xs"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              >
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-5"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
            >
              {post.title}
            </h1>

            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="tech-tag">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div
        className="h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.3 }}
      />

      {/* Article content */}
      <article className="section-container max-w-3xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CodeBlockRenderer content={post.content} />
        </motion.div>

        {/* Author card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl overflow-hidden border-2"
              style={{
                borderColor: 'var(--accent)',
                boxShadow: '0 0 20px var(--glow)',
              }}
            >
              <Image
                src="/images/souvik.png"
                alt="Souvik Ghosh"
                width={48}
                height={48}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <p
                className="font-bold text-base"
                style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
              >
                Souvik Ghosh
              </p>
              <p
                className="text-xs"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              >
                Software Engineer — Kolkata, India
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <a
                href="https://github.com/souvikree"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--muted-foreground)'
                  e.currentTarget.style.borderColor = 'var(--card-border)'
                }}
                aria-label="GitHub"
              >
                <Github size={14} />
              </a>
              <a
                href="https://linkedin.com/in/linkwithsouvik"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--muted-foreground)'
                  e.currentTarget.style.borderColor = 'var(--card-border)'
                }}
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
            </div>
          </div>
        </motion.div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section
          className="py-12"
          style={{ background: 'var(--muted)', borderTop: '1px solid var(--section-divider)' }}
        >
          <div className="section-container">
            <div className="flex items-center gap-3 mb-6">
              <Tag size={14} style={{ color: 'var(--accent)' }} />
              <p
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
              >
                Related Articles
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((related, i) => {
                const c = CATEGORY_COLORS[related.category] ?? 'var(--accent)'
                return (
                  <Link href={`/blog/${related.slug}`} key={related.slug}>
                    <motion.div
                      className="glass-card p-5 group cursor-pointer"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -3 }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = c
                        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${c}33`
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'
                        ;(e.currentTarget as HTMLElement).style.boxShadow = ''
                      }}
                    >
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-3"
                        style={{ background: `${c}18`, color: c, border: `1px solid ${c}40`, fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {related.category}
                      </span>
                      <h4
                        className="text-sm font-bold mb-2 leading-snug group-hover:text-[var(--accent)] transition-colors"
                        style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {related.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span
                          className="flex items-center gap-1 text-[11px]"
                          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
                        >
                          <Clock size={10} />
                          {related.readTime}
                        </span>
                        <ChevronRight size={13} style={{ color: c }} />
                      </div>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <FloatingThemeSwitcher />
    </div>
  )
}