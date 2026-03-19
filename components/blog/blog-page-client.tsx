'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, ChevronRight, Search, BookOpen, Star } from 'lucide-react'
import { blogPosts, blogCategories, type BlogPost } from '@/lib/blog-data'
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

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        className="relative glass-card p-7 md:p-9 overflow-hidden group cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -4 }}
      >
        {/* Shimmer overlay on hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${CATEGORY_COLORS[post.category] ?? 'var(--accent)'}08 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                background: `${CATEGORY_COLORS[post.category] ?? 'var(--accent)'}18`,
                color: CATEGORY_COLORS[post.category] ?? 'var(--accent)',
                border: `1px solid ${CATEGORY_COLORS[post.category] ?? 'var(--accent)'}40`,
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              <Star size={10} fill="currentColor" />
              Featured
            </span>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'var(--muted)',
                color: 'var(--muted-foreground)',
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
          </div>

          <h2
            className="text-2xl md:text-3xl font-black mb-3 leading-snug group-hover:text-[var(--accent)] transition-colors duration-200"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
          >
            {post.title}
          </h2>

          <p
            className="text-base leading-relaxed mb-5 max-w-2xl"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="tech-tag">{tag}</span>
              ))}
            </div>
            <span
              className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
            >
              Read article
              <ChevronRight size={15} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const color = CATEGORY_COLORS[post.category] ?? 'var(--accent)'

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article
        className="glass-card p-6 flex flex-col h-full group cursor-pointer transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.07 }}
        whileHover={{ y: -4 }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = color
          ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${color}33`
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = ''
        }}
      >
        {/* Category bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />

        <div className="flex items-center justify-between gap-3 mb-4">
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
            <Clock size={10} />
            {post.readTime}
          </span>
        </div>

        <h3
          className="text-lg font-bold mb-2 leading-snug flex-1 group-hover:text-[var(--accent)] transition-colors duration-200"
          style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          {post.title}
        </h3>

        <p
          className="text-sm leading-relaxed line-clamp-2 mb-4"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tech-tag">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--section-divider)' }}>
          <span
            className="text-xs"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
          >
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color, fontFamily: 'var(--font-space-grotesk)' }}
          >
            Read more <ChevronRight size={12} />
          </span>
        </div>
      </motion.article>
    </Link>
  )
}

export function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const featuredPosts = useMemo(() => blogPosts.filter((p) => p.featured), [])

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const nonFeaturedFiltered = filteredPosts.filter((p) => !p.featured || activeCategory !== 'All' || searchQuery)

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero header */}
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        style={{ background: 'var(--background)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--glow-secondary) 0%, transparent 65%)',
            opacity: 0.12,
          }}
        />
        <div className="section-container relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-sm transition-all duration-200"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
          >
            <ArrowLeft size={14} />
            Back to portfolio
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs tracking-[0.35em] uppercase mb-3"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
            >
              // technical writing
            </p>
            <div className="flex items-end gap-4 mb-4">
              <BookOpen size={36} style={{ color: 'var(--accent)' }} />
              <h1
                className="text-5xl sm:text-6xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}
              >
                BLOG
              </h1>
            </div>
            <div className="section-heading-line w-24 mb-5" />
            <p
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Thoughts on software engineering, distributed systems, and the craft of building production-grade applications.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="section-container pb-24">
        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          {/* Search */}
          <div
            className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl"
            style={{ background: 'var(--muted)', border: '1px solid var(--card-border)' }}
          >
            <Search size={15} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
            />
          </div>

          {/* Category pills */}
          <div
            className="flex gap-2 p-1.5 rounded-xl overflow-x-auto scrollbar-thin"
            style={{ background: 'var(--muted)', border: '1px solid var(--card-border)' }}
          >
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={{
                  background: activeCategory === cat ? 'var(--accent)' : 'transparent',
                  color: activeCategory === cat ? 'var(--background)' : 'var(--muted-foreground)',
                  boxShadow: activeCategory === cat ? '0 0 12px var(--glow)' : 'none',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured posts (only on "All" category, no search) */}
        <AnimatePresence>
          {activeCategory === 'All' && !searchQuery && featuredPosts.length > 0 && (
            <motion.div
              key="featured"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-5">
                <Tag size={14} style={{ color: 'var(--accent)' }} />
                <p
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
                >
                  Featured Articles
                </p>
              </div>
              <div className="grid lg:grid-cols-2 gap-5">
                {featuredPosts.map((post) => (
                  <FeaturedCard key={post.slug} post={post} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All posts grid */}
        <div>
          {(activeCategory !== 'All' || searchQuery) ? (
            <div className="flex items-center gap-3 mb-5">
              <p
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              >
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-5">
              <p
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              >
                All Articles
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {(activeCategory === 'All' && !searchQuery ? nonFeaturedFiltered : filteredPosts).map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-space-grotesk)' }}
              >
                No articles found
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              >
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
