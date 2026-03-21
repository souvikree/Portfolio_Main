'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'
import { Code2, Trophy, Zap, Star, BookOpen, ArrowRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

const BADGE_CONFIG: Record<string, { color: string; icon: React.ElementType; accent: string }> = {
  'Open Source':         { color: '#00F5FF', icon: Code2,    accent: '#7B2FFF' },
  'Industry Simulation': { color: '#FFD166', icon: Trophy,   accent: '#FF6B35' },
  'Hackathon':           { color: '#FF6B35', icon: Zap,      accent: '#FF2D78' },
  'DSA':                 { color: '#00FF87', icon: Star,     accent: '#00F5FF' },
  'Certification':       { color: '#C77DFF', icon: BookOpen, accent: '#7B2FFF' },
}

// Single source of truth for dimensions
const CARD_W   = 300   // card + slide width in px
const CARD_H   = 420   // fixed height — all cards equal
const HEADER_H = 120   // header band height

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
  const cfg   = BADGE_CONFIG[achievement.badge] ?? { color: 'var(--accent)', icon: Star, accent: '#7B2FFF' }
  const color = cfg.color
  const Icon  = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: CARD_W, flexShrink: 0, userSelect: 'none' }}
    >
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: hovered
            ? `linear-gradient(145deg, ${color}08, rgba(0,0,0,0) 60%)`
            : 'rgba(255,255,255,0.02)',
          border: `1px solid ${hovered ? color : 'var(--card-border)'}`,
          boxShadow: hovered
            ? `0 0 36px ${color}22, 0 0 70px ${color}08, 0 16px 40px rgba(0,0,0,0.5)`
            : '0 2px 12px rgba(0,0,0,0.2)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* ── Header band ── */}
        <div
          style={{
            height: HEADER_H,
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${color}18 0%, ${cfg.accent}12 50%, transparent 100%)`,
            borderBottom: `1px solid ${hovered ? color + '28' : 'var(--card-border)'}`,
            transition: 'border-color 0.3s',
          }}
        >
          {/* Dot mesh */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `radial-gradient(${color}18 1px, transparent 1px)`,
            backgroundSize: '18px 18px',
            opacity: hovered ? 0.9 : 0.4,
            transition: 'opacity 0.4s',
          }} />

          {/* Watermark icon */}
          <div style={{
            position: 'absolute', right: -8, bottom: -8, pointerEvents: 'none',
            opacity: hovered ? 0.1 : 0.05, transition: 'opacity 0.4s',
          }}>
            <Icon size={80} style={{ color }} />
          </div>

          {/* Index number */}
          <div style={{
            position: 'absolute', top: 10, right: 12,
            fontSize: '2.4rem', lineHeight: 1, fontWeight: 900, pointerEvents: 'none',
            color, opacity: hovered ? 0.14 : 0.05,
            fontFamily: 'var(--font-space-grotesk)',
            transition: 'opacity 0.3s',
          }}>
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Badge pill — top left */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999,
            background: `${color}18`, border: `1px solid ${color}35`,
            backdropFilter: 'blur(6px)',
          }}>
            <motion.span
              style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <span style={{
              color, fontFamily: 'var(--font-jetbrains)', fontSize: 10,
              fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap',
            }}>
              {achievement.badge}
            </span>
          </div>

          {/* Icon box — bottom left */}
          <motion.div
            style={{
              position: 'absolute', bottom: 14, left: 14,
              width: 40, height: 40, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${color}15`, border: `1px solid ${color}30`,
              boxShadow: hovered ? `0 0 18px ${color}40` : 'none',
              transition: 'all 0.3s ease',
            }}
            animate={hovered ? { scale: 1.08, rotate: [0, -4, 4, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Icon size={18} style={{ color }} />
          </motion.div>

          {/* Date — bottom right */}
          <span style={{
            position: 'absolute', bottom: 16, right: 14,
            color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)',
            fontSize: 10, fontWeight: 500,
          }}>
            {achievement.date}
          </span>
        </div>

        {/* ── Body — fills remaining height ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 16px 14px',
          // Remaining height = CARD_H - HEADER_H - 2px border
          minHeight: 0, // allow flex children to shrink
          overflow: 'hidden',
        }}>
          {/* Title */}
          <h3 style={{
            color: hovered ? color : 'var(--foreground)',
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '0.85rem',
            fontWeight: 900,
            lineHeight: 1.3,
            marginBottom: 8,
            transition: 'color 0.25s ease',
            // Allow up to 2 lines
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {achievement.title}
          </h3>

          {/* Org */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexShrink: 0 }}>
            <div style={{ width: 12, height: 2, borderRadius: 2, background: color, flexShrink: 0 }} />
            <p style={{
              color, fontFamily: 'var(--font-jetbrains)',
              fontSize: 11, fontWeight: 700, opacity: 0.85,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {achievement.organization}
            </p>
          </div>

          {/* Description — takes all remaining space, 4 lines max */}
          <p style={{
            color: 'var(--muted-foreground)',
            fontSize: '0.75rem',
            lineHeight: 1.55,
            flex: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            marginBottom: 10,
          }}>
            {achievement.description}
          </p>

          {/* Footer — always at bottom */}
          <div style={{
            borderTop: `1px solid ${hovered ? color + '25' : 'var(--card-border)'}`,
            paddingTop: 10,
            flexShrink: 0,
            transition: 'border-color 0.3s',
            minHeight: 36,
            display: 'flex',
            alignItems: 'center',
          }}>
            {achievement.url ? (
              <a
                href={achievement.url}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, fontWeight: 700,
                  color: hovered ? color : 'var(--muted-foreground)',
                  fontFamily: 'var(--font-jetbrains)',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                }}
              >
                View
                <motion.span
                  animate={hovered ? { x: [0, 3, 0] } : { x: 0 }}
                  transition={{ duration: 0.8, repeat: hovered ? Infinity : 0 }}
                >
                  <ArrowRight size={11} />
                </motion.span>
              </a>
            ) : (
              <span style={{
                fontSize: 11, color: 'var(--muted-foreground)',
                fontFamily: 'var(--font-jetbrains)', opacity: 0.4,
              }}>
                ∙ ∙ ∙
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function AchievementsSection() {
  const { achievements } = portfolioData
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('ACHIEVEMENTS', inView)
  const [isDragging, setIsDragging] = useState(false)

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    align: 'start',
    containScroll: 'trimSnaps',
    watchDrag: () => true,
  })

  const onPointerDown = useCallback(() => setIsDragging(true),  [])
  const onPointerUp   = useCallback(() => setIsDragging(false), [])

  return (
    <section
      id="achievements"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--glow-secondary) 0%, transparent 70%)', opacity: 0.1 }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.06 }} />

      <div className="relative z-10">

        {/* Heading */}
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs tracking-[0.35em] uppercase mb-3"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              // recognition &amp; milestones
            </p>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}>
              {heading}
            </h2>
            <div className="section-heading-line mt-3 w-24" />
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, var(--background) 0%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(270deg, var(--background) 0%, transparent 100%)' }} />

          {/* Embla viewport */}
          <div
            ref={emblaRef}
            style={{
              overflow: 'hidden',
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'pan-y',
            }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* Embla container — NO gap, NO padding, pure flex */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              paddingTop: 6,
              paddingBottom: 16,
            }}>
              {achievements.map((achievement, i) => (
                /*
                  Slide wrapper:
                  - flexShrink: 0  — mandatory for Embla
                  - width: CARD_W  — slide width = card width
                  - paddingLeft    — creates gap between slides (NOT counted in width because boxSizing content-box)
                  - boxSizing: content-box — ensures paddingLeft is outside the measured width
                */
                <div
                  key={`${achievement.title}-${i}`}
                  style={{
                    flexShrink: 0,
                    width: CARD_W,
                    boxSizing: 'content-box',
                    paddingLeft: i === 0
                      ? 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))'
                      : '20px',
                  }}
                >
                  <AchievementCard achievement={achievement} index={i} inView={inView} />
                </div>
              ))}
              {/* Trailing spacer mirrors the leading padding */}
              <div style={{
                flexShrink: 0,
                width: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
              }} />
            </div>
          </div>
        </div>

        {/* Drag hint */}
        <div className="section-container mt-5">
          <motion.p
            className="text-xs flex items-center gap-2"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
            animate={{ x: [0, 4, 0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <span>←</span><span>Drag to explore</span><span>→</span>
          </motion.p>
        </div>
      </div>
    </section>
  )
}