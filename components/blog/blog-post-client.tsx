'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, ChevronRight, Github, Linkedin, ArrowUpRight, ExternalLink } from 'lucide-react'
import { type BlogPost } from '@/lib/blog-data'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FloatingThemeSwitcher } from '@/components/theme-switcher'

const CATEGORY_CONFIG: Record<string, { color: string; accent: string }> = {
  Backend:      { color: '#00F5FF', accent: '#7B2FFF' },
  Frontend:     { color: '#C77DFF', accent: '#FF2D78' },
  Architecture: { color: '#FFD166', accent: '#FF6B35' },
  Career:       { color: '#00FF87', accent: '#00F5FF' },
  DevOps:       { color: '#FF6B35', accent: '#FF2D78' },
}

function getColor(cat: string) { return CATEGORY_CONFIG[cat]?.color ?? 'var(--accent)' }

// ── Markdown renderer ─────────────────────────────────────────────────────────
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="flex flex-col gap-4">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />
        if (line.startsWith('## '))
          return <h2 key={i} className="text-2xl font-black mt-8 mb-2"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
            {line.replace('## ', '')}
          </h2>
        if (line.startsWith('### '))
          return <h3 key={i} className="text-lg font-bold mt-5 mb-1"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}>
            {line.replace('### ', '')}
          </h3>
        if (line.startsWith('```')) return null
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const text       = line.replace(/^[-*] /, '')
          const boldMatch  = text.match(/^\*\*(.+?)\*\*(.*)/)
          return (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed ml-4"
              style={{ color: 'var(--muted-foreground)' }}>
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
              {boldMatch
                ? <span><strong style={{ color: 'var(--foreground)' }}>{boldMatch[1]}</strong>{boldMatch[2]}</span>
                : text}
            </li>
          )
        }
        const numMatch = line.match(/^(\d+)\. (.+)/)
        if (numMatch)
          return (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed ml-4"
              style={{ color: 'var(--muted-foreground)' }}>
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                style={{ background: 'var(--muted)', color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                {numMatch[1]}
              </span>
              {numMatch[2]}
            </li>
          )
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        return (
          <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {parts.map((p, j) =>
              p.startsWith('**') && p.endsWith('**')
                ? <strong key={j} style={{ color: 'var(--foreground)' }}>{p.replace(/\*\*/g, '')}</strong>
                : p
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
  let inCode = false, codeLang = '', codeLines: string[] = [], textLines: string[] = []
  for (const line of lines) {
    if (line.startsWith('```') && !inCode) {
      if (textLines.length) { blocks.push({ type: 'text', content: textLines.join('\n') }); textLines = [] }
      inCode = true; codeLang = line.replace('```', '').trim(); codeLines = []
    } else if (line.startsWith('```') && inCode) {
      blocks.push({ type: 'code', content: codeLines.join('\n'), lang: codeLang })
      codeLines = []; inCode = false; codeLang = ''
    } else if (inCode) { codeLines.push(line) }
    else { textLines.push(line) }
  }
  if (textLines.length) blocks.push({ type: 'text', content: textLines.join('\n') })
  return (
    <>
      {blocks.map((block, i) =>
        block.type === 'code' ? (
          <div key={i} className="my-5">
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--card-border)' }}>
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--card-border)' }}>
                {['#FF5F57','#FFBD2E','#28C840'].map((c, j) => <span key={j} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
                {block.lang && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded"
                    style={{ background: 'var(--muted)', color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                    {block.lang}
                  </span>
                )}
              </div>
              <pre className="p-5 overflow-x-auto text-sm leading-relaxed"
                style={{ color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)', background: 'transparent' }}>
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

// ── External post redirect notice ─────────────────────────────────────────────
function ExternalPostView({ post }: { post: BlogPost }) {
  const color = getColor(post.category)
  return (
    <div className="section-container max-w-2xl py-24 flex flex-col items-center text-center gap-8">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}15`, border: `1px solid ${color}30`, boxShadow: `0 0 40px ${color}30` }}>
        <ExternalLink size={32} style={{ color }} />
      </div>
      <div>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color, fontFamily: 'var(--font-jetbrains)' }}>
          External Article
        </p>
        <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight"
          style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
          {post.title}
        </h1>
        <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{ background: `${color}10`, color, border: `1px solid ${color}25`, fontFamily: 'var(--font-jetbrains)' }}>
              {tag}
            </span>
          ))}
        </div>
        <a href={post.externalUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all"
          style={{ background: color, color: '#050508', fontFamily: 'var(--font-space-grotesk)', boxShadow: `0 0 28px ${color}66` }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 48px ${color}88`; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 28px ${color}66`; e.currentTarget.style.transform = 'translateY(0)' }}>
          Read on External Site <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  )
}

// ── Related card ──────────────────────────────────────────────────────────────
function RelatedCard({ post, index }: { post: BlogPost; index: number }) {
  const color = getColor(post.category)
  const isExt = !!post.externalUrl
  const href  = isExt ? post.externalUrl! : `/blog/${post.slug}`
  return (
    <Link href={href} target={isExt ? '_blank' : undefined} rel={isExt ? 'noopener noreferrer' : undefined}>
      <motion.div
        className="rounded-xl overflow-hidden cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 20px ${color}25`; e.currentTarget.style.transform = 'translateY(-3px)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
        <div className="p-4">
          <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mb-2.5"
            style={{ background: `${color}12`, color, border: `1px solid ${color}30`, fontFamily: 'var(--font-jetbrains)' }}>
            {post.category}
          </span>
          <h4 className="text-sm font-bold mb-2 leading-snug" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
            {post.title}
          </h4>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              <Clock size={9} /> {post.readTime}
            </span>
            {isExt ? <ArrowUpRight size={12} style={{ color }} /> : <ChevronRight size={12} style={{ color }} />}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
interface Props { post: BlogPost; relatedPosts: BlogPost[] }

export function BlogPostClient({ post, relatedPosts }: Props) {
  const color  = getColor(post.category)
  const cfg    = CATEGORY_CONFIG[post.category] ?? { color, accent: color }
  const isExt  = !!post.externalUrl

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${color}12 0%, transparent 65%)` }} />
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${cfg.accent}10 0%, transparent 70%)`, filter: 'blur(80px)' }} />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(${color}015 1px, transparent 1px), linear-gradient(90deg, ${color}015 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%)',
        }} />

        <div className="section-container relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/blog"
              className="inline-flex items-center gap-2 mb-8 text-xs transition-all duration-200"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}>
              <ArrowLeft size={12} /> Back to blog
            </Link>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: `${color}18`, color, border: `1px solid ${color}40`, fontFamily: 'var(--font-jetbrains)' }}>
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[10px]"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                <Clock size={10} /> {post.readTime}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              {isExt && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: 'rgba(255,165,0,0.1)', color: '#FFD166', border: '1px solid rgba(255,165,0,0.25)', fontFamily: 'var(--font-jetbrains)' }}>
                  <ArrowUpRight size={9} /> External Article
                </span>
              )}
            </div>

            {/* Gradient title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-5"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
              {post.title}
            </h1>

            {/* Accent underline */}
            <div className="h-[3px] w-16 rounded-full mb-5"
              style={{ background: `linear-gradient(90deg, ${color}, ${cfg.accent})` }} />

            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                  style={{ background: `${color}10`, color, border: `1px solid ${color}25`, fontFamily: 'var(--font-jetbrains)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.35 }} />

      {/* ── Content ── */}
      {isExt ? (
        <ExternalPostView post={post} />
      ) : (
        <article className="section-container max-w-3xl py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <CodeBlockRenderer content={post.content} />
          </motion.div>

          {/* Author card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-14 relative overflow-hidden rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid var(--card-border)` }}
          >
            <div className="h-[2px] absolute top-0 left-0 right-0"
              style={{ background: `linear-gradient(90deg, ${color}, ${cfg.accent})` }} />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: color, boxShadow: `0 0 20px ${color}44` }}>
                <Image src="/images/souvik.png" alt="Souvik Ghosh" width={48} height={48} className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                  Souvik Ghosh
                </p>
                <p className="text-xs" style={{ color, fontFamily: 'var(--font-jetbrains)' }}>
                  &lt;Software Engineer /&gt; — Kolkata, India
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                {[
                  { href: 'https://github.com/souvikree', icon: Github, label: 'GitHub' },
                  { href: 'https://linkedin.com/in/linkwithsouvik', icon: Linkedin, label: 'LinkedIn' },
                ].map(({ href, icon: Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                    style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)' }}
                    aria-label={label}
                    onMouseEnter={(e) => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 12px ${color}44` }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </article>
      )}

      {/* ── Related posts ── */}
      {relatedPosts.length > 0 && (
        <section className="py-12" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--section-divider)' }}>
          <div className="section-container">
            <div className="flex items-center gap-2 mb-6">
              <Tag size={13} style={{ color: 'var(--accent)' }} />
              <p className="text-xs font-bold tracking-widest uppercase"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                Related Articles
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((related, i) => <RelatedCard key={related.slug} post={related} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <FloatingThemeSwitcher />
    </div>
  )
}