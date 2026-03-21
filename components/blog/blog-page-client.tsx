'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, Search, BookOpen, Star, ArrowUpRight, ChevronRight, Zap } from 'lucide-react'
import { blogPosts, blogCategories, type BlogPost } from '@/lib/blog-data'
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

// ── Featured card ────────────────────────────────────────────────────────────
function FeaturedCard({ post, index }: { post: BlogPost; index: number }) {
  const color  = getColor(post.category)
  const isExt  = !!post.externalUrl
  const href   = isExt ? post.externalUrl! : `/blog/${post.slug}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href} target={isExt ? '_blank' : undefined} rel={isExt ? 'noopener noreferrer' : undefined}>
        <div
          className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid var(--card-border)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = color
            e.currentTarget.style.boxShadow = `0 0 40px ${color}22, 0 16px 40px rgba(0,0,0,0.4)`
            e.currentTarget.style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--card-border)'
            e.currentTarget.style.boxShadow = ''
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {/* Top gradient bar */}
          <div className="h-[3px] w-full"
            style={{ background: `linear-gradient(90deg, ${color}, ${CATEGORY_CONFIG[post.category]?.accent ?? color})` }} />

          {/* Dot mesh background */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              backgroundImage: `radial-gradient(${color}10 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }} />

          {/* Inner glow */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(ellipse 60% 50% at 20% 30%, ${color}06, transparent 65%)` }} />

          <div className="relative p-6 sm:p-8">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: `${color}18`, color, border: `1px solid ${color}35`, fontFamily: 'var(--font-jetbrains)' }}>
                <Star size={9} fill="currentColor" /> Featured
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[10px]"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                <Clock size={10} /> {post.readTime}
              </span>
              {isExt && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: 'rgba(255,165,0,0.1)', color: '#FFD166', border: '1px solid rgba(255,165,0,0.25)', fontFamily: 'var(--font-jetbrains)' }}>
                  <ArrowUpRight size={9} /> External
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black mb-3 leading-snug transition-colors duration-200"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = color }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground)' }}>
              {post.title}
            </h2>

            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted-foreground)' }}>
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                    style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-jetbrains)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold transition-all duration-200"
                style={{ color, fontFamily: 'var(--font-space-grotesk)' }}>
                {isExt ? 'Read article' : 'Read article'}
                {isExt ? <ArrowUpRight size={13} /> : <ChevronRight size={13} />}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const color = getColor(post.category)
  const isExt = !!post.externalUrl
  const href  = isExt ? post.externalUrl! : `/blog/${post.slug}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href} target={isExt ? '_blank' : undefined} rel={isExt ? 'noopener noreferrer' : undefined}>
        <div
          className="group relative overflow-hidden rounded-2xl cursor-pointer flex flex-col transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--card-border)',
            minHeight: 260,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = color
            e.currentTarget.style.boxShadow = `0 0 24px ${color}22, 0 8px 32px rgba(0,0,0,0.4)`
            e.currentTarget.style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--card-border)'
            e.currentTarget.style.boxShadow = ''
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {/* Top gradient bar */}
          <div className="h-[2px] w-full flex-shrink-0"
            style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

          {/* Index watermark */}
          <div className="absolute top-3 right-3 font-black pointer-events-none select-none opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300"
            style={{ fontSize: '3rem', lineHeight: 1, color, fontFamily: 'var(--font-space-grotesk)' }}>
            {String(index + 1).padStart(2, '0')}
          </div>

          <div className="flex flex-col flex-1 p-5">
            {/* Category + time */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: `${color}12`, color, border: `1px solid ${color}30`, fontFamily: 'var(--font-jetbrains)' }}>
                {post.category}
              </span>
              <div className="flex items-center gap-2">
                {isExt && (
                  <span style={{ color: '#FFD166' }}><ArrowUpRight size={11} /></span>
                )}
                <span className="flex items-center gap-1 text-[10px]"
                  style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                  <Clock size={10} /> {post.readTime}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-black mb-2 leading-snug flex-1 transition-colors duration-200"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = color }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground)' }}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-xs leading-relaxed mb-3"
              style={{ color: 'var(--muted-foreground)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-3"
              style={{ borderTop: '1px solid var(--card-border)' }}>
              <span className="text-[10px]"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold"
                style={{ color, fontFamily: 'var(--font-jetbrains)' }}>
                {isExt ? 'Read' : 'Read more'}
                {isExt ? <ArrowUpRight size={10} /> : <ChevronRight size={10} />}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery]       = useState('')

  const featuredPosts = useMemo(() => blogPosts.filter((p) => p.featured), [])

  const filteredPosts = useMemo(() => blogPosts.filter((post) => {
    const matchesCat    = activeCategory === 'All' || post.category === activeCategory
    const q             = searchQuery.toLowerCase()
    const matchesSearch = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q) || post.tags.some((t) => t.toLowerCase().includes(q))
    return matchesCat && matchesSearch
  }), [activeCategory, searchQuery])

  const showFeatured     = activeCategory === 'All' && !searchQuery
  const nonFeaturedPosts = showFeatured ? filteredPosts.filter((p) => !p.featured) : filteredPosts

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--glow-secondary) 0%, transparent 65%)', opacity: 0.12 }} />
        <div className="absolute top-1/2 right-0 w-96 h-96 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.08 }} />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
        }} />

        <div className="section-container relative z-10">
          <Link href="/"
            className="inline-flex items-center gap-2 mb-8 text-xs transition-all duration-200"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}>
            <ArrowLeft size={13} /> Back to portfolio
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs tracking-[0.35em] uppercase mb-3"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              // technical writing
            </p>

            <div className="flex items-end gap-4 mb-3">
              <BookOpen size={32} style={{ color: 'var(--accent)', marginBottom: 4 }} />
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}>
                BLOG
              </h1>
            </div>
            <div className="section-heading-line w-24 mb-5" />

            <p className="text-base leading-relaxed max-w-xl mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Thoughts on software engineering, distributed systems, and the craft of building production-grade applications.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-5">
              {[
                { n: blogPosts.length, label: 'Articles' },
                { n: blogPosts.filter(p => p.featured).length, label: 'Featured' },
                { n: new Set(blogPosts.map(p => p.category)).size, label: 'Categories' },
              ].map(({ n, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xl font-black" style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}>{n}</span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-container pb-24">

        {/* ── Search + Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          {/* Search */}
          <div className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px var(--glow)' }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
            <Search size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')}
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ color: 'var(--accent)', background: 'var(--muted)', fontFamily: 'var(--font-jetbrains)' }}>
                clear
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 p-1.5 rounded-xl overflow-x-auto"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}>
            {blogCategories.map((cat) => {
              const isActive = activeCategory === cat
              const color    = getColor(cat)
              return (
                <motion.button key={cat} type="button" onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold relative overflow-hidden"
                  style={{
                    background: isActive ? `linear-gradient(135deg, ${color}, ${color}88)` : 'transparent',
                    color: isActive ? '#050508' : 'var(--muted-foreground)',
                    boxShadow: isActive ? `0 0 16px ${color}44` : 'none',
                    fontFamily: 'var(--font-jetbrains)',
                    transition: 'all 0.25s ease',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}>
                  {isActive && (
                    <motion.div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }} />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* ── Featured ── */}
        <AnimatePresence>
          {showFeatured && featuredPosts.length > 0 && (
            <motion.div key="featured" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={13} style={{ color: 'var(--accent)' }} />
                <p className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                  Featured Articles
                </p>
              </div>
              <div className="grid lg:grid-cols-2 gap-5">
                {featuredPosts.map((post, i) => <FeaturedCard key={post.slug} post={post} index={i} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── All posts ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-bold tracking-widest uppercase"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              {showFeatured ? 'All Articles' : `${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {nonFeaturedPosts.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)}
            </motion.div>
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                No articles found
              </p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                Try a different category or search term
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
      <FloatingThemeSwitcher />
    </div>
  )
}