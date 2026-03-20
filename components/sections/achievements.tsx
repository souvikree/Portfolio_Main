'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'
import { ExternalLink, Award } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

const BADGE_COLORS: Record<string, string> = {
  'Open Source':         '#00F5FF',
  'Industry Simulation': '#FFD166',
  'Hackathon':           '#FF6B35',
  'DSA':                 '#00FF87',
  'Certification':       '#C77DFF',
}

function AchievementCard({
  achievement,
  index,
  inView,
}: {
  achievement: (typeof portfolioData.achievements)[0]
  index: number
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const color = BADGE_COLORS[achievement.badge] || 'var(--accent)'

  return (
    <motion.div
      className="flex-shrink-0 w-[300px] sm:w-[340px]"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="h-full glass-card p-6 relative overflow-hidden transition-all duration-300"
        style={{
          borderColor:  hovered ? color : 'var(--card-border)',
          boxShadow:    hovered ? `0 0 30px ${color}44, 0 8px 32px rgba(0,0,0,0.4)` : '',
          transform:    hovered ? 'perspective(600px) rotateX(-3deg) translateY(-4px)' : 'none',
          // Prevent card's own hover from interfering with drag
          userSelect:   'none',
        }}
      >
        {/* Holographic shimmer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${color}0A 50%, transparent 100%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Badge chip */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}40`,
              fontFamily: 'var(--font-jetbrains)',
            }}
          >
            {achievement.badge}
          </span>
          <span
            className="text-xs"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
          >
            {achievement.date}
          </span>
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{
            background:  `${color}18`,
            border:      `1px solid ${color}30`,
            boxShadow:   hovered ? `0 0 20px ${color}33` : 'none',
          }}
        >
          <Award size={22} style={{ color }} />
        </div>

        {/* Title */}
        <h3
          className="text-base font-bold mb-1 leading-snug"
          style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
        >
          {achievement.title}
        </h3>

        {/* Org */}
        <p
          className="text-xs font-semibold mb-3"
          style={{ color, fontFamily: 'var(--font-jetbrains)' }}
        >
          {achievement.organization}
        </p>

        {/* Description */}
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {achievement.description}
        </p>

        {/* Link */}
        {achievement.url && (
          <a
            href={achievement.url}
            target="_blank"
            rel="noopener noreferrer"
            // Stop pointer events from bubbling into drag handler on links
            onPointerDown={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium transition-all"
            style={{
              color:      hovered ? color : 'var(--muted-foreground)',
              fontFamily: 'var(--font-jetbrains)',
            }}
          >
            View
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export function AchievementsSection() {
  const { achievements } = portfolioData
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('ACHIEVEMENTS', inView)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop:      false,
    dragFree:  true,
    align:     'start',
    // FIX: containScroll prevents the carousel from over-scrolling past the edges
    containScroll: 'trimSnaps',
    // FIX: lower drag threshold so a single-finger swipe / one-finger touchpad
    // gesture registers immediately — default is 10px which feels sticky
    watchDrag: (_, evt) => {
      // Accept any pointer drag (mouse, touch, trackpad)
      // This is already the default but being explicit avoids Embla
      // version differences
      return true
    },
  })

  // Track dragging state to swap cursor style
  const [isDragging, setIsDragging] = useState(false)

  const onPointerDown = useCallback(() => setIsDragging(true), [])
  const onPointerUp   = useCallback(() => setIsDragging(false), [])

  return (
    <section
      id="achievements"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--glow-secondary) 0%, transparent 70%)',
          opacity: 0.1,
        }}
      />

      <div className="relative z-10">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p
              className="text-xs tracking-[0.35em] uppercase mb-3"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
            >
              // recognition & milestones
            </p>
            <h2
              className="text-5xl sm:text-6xl font-black tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}
            >
              {heading}
            </h2>
            <div className="section-heading-line mt-3 w-24" />
          </motion.div>
        </div>

        {/*
          FIX: The key changes here are:
          1. touch-action: pan-y — lets the browser handle vertical scroll but
             passes horizontal movement to Embla. Without this, the browser
             intercepts ALL touch/trackpad gestures for its own scrolling.
          2. cursor: grab / grabbing — visual affordance that the area is draggable
          3. onPointerDown/Up on the scroll container so cursor updates immediately
          4. -webkit-overflow-scrolling: touch — smoother momentum on iOS/macOS trackpad
        *)*/}
        <div
          ref={emblaRef}
          className="overflow-hidden"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            // Allow vertical page scroll but hand horizontal to Embla
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch' as any,
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div className="flex gap-5 px-6 md:px-12 xl:px-[max(3rem,calc((100vw-1280px)/2+1.5rem))] mt-6">
            {achievements.map((achievement, i) => (
              <AchievementCard
                key={`${achievement.title}-${i}`}
                achievement={achievement}
                index={i}
                inView={inView}
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="section-container mt-6">
          <p
            className="text-xs"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
          >
            ← Drag to explore →
          </p>
        </div>
      </div>
    </section>
  )
}