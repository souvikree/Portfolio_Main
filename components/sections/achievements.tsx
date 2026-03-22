'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'
import { Code2, Trophy, Zap, Star, BookOpen, ArrowUpRight, Lock, Unlock } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

// ── Config ────────────────────────────────────────────────────────────────────
const BADGE_CONFIG: Record<string, { color: string; icon: React.ElementType; accent: string; label: string }> = {
  'Open Source':         { color: '#00F5FF', icon: Code2,    accent: '#7B2FFF', label: 'OSS' },
  'Industry Simulation': { color: '#FFD166', icon: Trophy,   accent: '#FF6B35', label: 'INDUSTRY' },
  'Hackathon':           { color: '#FF6B35', icon: Zap,      accent: '#FF2D78', label: 'HACKATHON' },
  'DSA':                 { color: '#00FF87', icon: Star,     accent: '#00F5FF', label: 'DSA' },
  'Certification':       { color: '#C77DFF', icon: BookOpen, accent: '#7B2FFF', label: 'CERTIFIED' },
}

const CARD_W = 320
const CARD_H = 440

// ── Particle burst ────────────────────────────────────────────────────────────
function Particles({ active, color }: { active: boolean; color: string }) {
  const particles = Array.from({ length: 10 }, (_, i) => i)
  return (
    <AnimatePresence>
      {active && particles.map((i) => {
        const angle  = (i / particles.length) * 360
        const dist   = 28 + Math.random() * 20
        const rad    = (angle * Math.PI) / 180
        const tx     = Math.cos(rad) * dist
        const ty     = Math.sin(rad) * dist
        const size   = 2 + Math.random() * 3
        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none z-30"
            style={{ background: color, width: size, height: size, left: '50%', top: '50%' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
            exit={{}}
            transition={{ duration: 0.55 + Math.random() * 0.3, ease: 'easeOut' }}
          />
        )
      })}
    </AnimatePresence>
  )
}

// ── Signal ring ───────────────────────────────────────────────────────────────
function SignalRing({ color, active }: { color: string; active: boolean }) {
  return (
    <AnimatePresence>
      {active && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-[16px] pointer-events-none"
          style={{ border: `1px solid ${color}` }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.06 + i * 0.04 }}
          exit={{}}
          transition={{ duration: 0.9, delay: i * 0.18, ease: 'easeOut' }}
        />
      ))}
    </AnimatePresence>
  )
}

// ── Stamp ─────────────────────────────────────────────────────────────────────
function UnlockedStamp({ active, color }: { active: boolean; color: string }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute z-20 pointer-events-none"
          style={{
            top: 28, right: -10,
            padding: '3px 14px',
            border: `2px solid ${color}`,
            borderRadius: 3,
            transform: 'rotate(15deg)',
            transformOrigin: 'center',
            background: `${color}10`,
            backdropFilter: 'blur(4px)',
          }}
          initial={{ opacity: 0, scale: 0.6, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 15 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <span style={{
            color,
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: '0.25em',
            fontFamily: 'var(--font-jetbrains)',
          }}>
            UNLOCKED
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Achievement Card ──────────────────────────────────────────────────────────
function AchievementCard({
  achievement,
  index,
  inView,
}: {
  achievement: (typeof portfolioData.achievements)[0]
  index: number
  inView: boolean
}) {
  const [hovered, setHovered]     = useState(false)
  const [burst, setBurst]         = useState(false)
  const [signalKey, setSignalKey] = useState(0)
  const cfg   = BADGE_CONFIG[achievement.badge] ?? { color: 'var(--accent)', icon: Star, accent: '#7B2FFF', label: 'ACHIEVEMENT' }
  const color = cfg.color
  const Icon  = cfg.icon

  const handleEnter = () => {
    setHovered(true)
    setBurst(true)
    setSignalKey(k => k + 1)
    setTimeout(() => setBurst(false), 700)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      style={{ width: CARD_W, flexShrink: 0, userSelect: 'none', position: 'relative', marginTop: 10}}
    >
      {/* Signal rings — outside card */}
      <div className="absolute inset-0 pointer-events-none" key={signalKey}>
        <SignalRing color={color} active={hovered} />
      </div>

      {/* Unlocked stamp */}
      <UnlockedStamp active={hovered} color={color} />

      <motion.div
        style={{
          width: CARD_W,
          height: CARD_H,
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: 'rgba(5,5,8,0.9)',
          backdropFilter: 'blur(20px)',
        }}
        animate={{
          boxShadow: hovered
            ? `0 0 0 1px ${color}, 0 0 40px ${color}30, 0 24px 60px rgba(0,0,0,0.6)`
            : `0 0 0 1px rgba(255,255,255,0.07), 0 4px 20px rgba(0,0,0,0.3)`,
          y: hovered ? -8 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Diagonal slash header ── */}
        <div style={{ height: 130, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          {/* Base gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${color}22 0%, ${cfg.accent}14 60%, transparent 100%)`,
          }} />

          {/* Diagonal slash cut */}
          <div style={{
            position: 'absolute',
            bottom: -1, left: 0, right: 0,
            height: 40,
            background: 'rgba(5,5,8,0.9)',
            clipPath: 'polygon(0 40px, 100% 0, 100% 40px)',
          }} />

          {/* Grid dots */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `radial-gradient(${color}20 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 0.4s',
          }} />

          {/* Watermark number */}
          <div style={{
            position: 'absolute', right: 10, top: 2,
            fontSize: '5rem', fontWeight: 900, lineHeight: 1,
            color, opacity: hovered ? 0.08 : 0.04,
            fontFamily: 'var(--font-space-grotesk)',
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
          }}>
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Top-left: category pill */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 999,
            background: `${color}15`,
            border: `1px solid ${color}40`,
          }}>
            <motion.div
              style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span style={{
              color, fontSize: 9, fontWeight: 700,
              letterSpacing: '0.2em',
              fontFamily: 'var(--font-jetbrains)',
            }}>
              {cfg.label}
            </span>
          </div>

          {/* Bottom-left: icon with particles */}
          <div style={{
            position: 'absolute', bottom: 20, left: 16,
            width: 44, height: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.div
              style={{
                width: 44, height: 44, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${color}18`,
                border: `1px solid ${color}40`,
                position: 'relative',
              }}
              animate={hovered ? {
                boxShadow: `0 0 24px ${color}60`,
                borderColor: color,
              } : {
                boxShadow: 'none',
              }}
              transition={{ duration: 0.3 }}
            >
              <Particles active={burst} color={color} />
              <motion.div
                animate={hovered ? { rotate: [0, -8, 8, 0], scale: 1.15 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Icon size={20} style={{ color }} />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom-right: lock → unlock */}
          <div style={{ position: 'absolute', bottom: 22, right: 16 }}>
            <AnimatePresence mode="wait">
              {hovered ? (
                <motion.div key="unlock"
                  initial={{ scale: 0, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <Unlock size={14} style={{ color }} />
                </motion.div>
              ) : (
                <motion.div key="lock"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.35 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}>
                  <Lock size={14} style={{ color: 'var(--muted-foreground)' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date — top right */}
          <span style={{
            position: 'absolute', top: 16, right: 16,
            color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)',
            fontSize: 9, opacity: 0.6,
          }}>
            {achievement.date}
          </span>
        </div>

        {/* ── Body ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '12px 18px 16px',
          minHeight: 0,
        }}>
          {/* Organization */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <motion.div
              style={{ height: 2, borderRadius: 2, background: color, flexShrink: 0 }}
              animate={{ width: hovered ? 16 : 8 }}
              transition={{ duration: 0.3 }}
            />
            <span style={{
              color, fontSize: 10, fontWeight: 700,
              fontFamily: 'var(--font-jetbrains)',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {achievement.organization}
            </span>
          </div>

          {/* Title */}
          <motion.h3
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.9rem',
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: 10,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            animate={{ color: hovered ? color : 'var(--foreground)' }}
            transition={{ duration: 0.25 }}
          >
            {achievement.title}
          </motion.h3>

          {/* Divider with pulse */}
          <motion.div
            style={{ height: 1, marginBottom: 10, borderRadius: 1 }}
            animate={{
              background: hovered
                ? `linear-gradient(90deg, ${color}, ${cfg.accent})`
                : 'rgba(255,255,255,0.06)',
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Description */}
          <p style={{
            color: 'var(--muted-foreground)',
            fontSize: '0.72rem',
            lineHeight: 1.6,
            flex: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            marginBottom: 12,
          }}>
            {achievement.description}
          </p>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Terminal path */}
            <span style={{
              fontSize: 9, fontFamily: 'var(--font-jetbrains)',
              color: 'var(--muted-foreground)', opacity: 0.4,
            }}>
              ~/achievements/{String(index + 1).padStart(2, '0')}
            </span>

            {achievement.url ? (
              <a
                href={achievement.url}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', borderRadius: 999,
                    fontSize: 10, fontWeight: 700,
                    fontFamily: 'var(--font-jetbrains)',
                    border: '1px solid',
                    cursor: 'pointer',
                  }}
                  animate={hovered ? {
                    background: `${color}18`,
                    borderColor: `${color}50`,
                    color,
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: 'var(--muted-foreground)',
                  }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  View
                  <ArrowUpRight size={10} />
                </motion.div>
              </a>
            ) : (
              <span style={{ fontSize: 10, color: 'var(--muted-foreground)', opacity: 0.3, fontFamily: 'var(--font-jetbrains)' }}>
                classified
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Counter ticker ────────────────────────────────────────────────────────────
function Ticker({ target, inView }: { target: number; inView: boolean }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let cur = 0
    const id = setInterval(() => {
      cur += 1
      setVal(cur)
      if (cur >= target) clearInterval(id)
    }, 80)
    return () => clearInterval(id)
  }, [inView, target])
  return (
    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)', fontWeight: 900 }}>
      {String(val).padStart(2, '0')}
    </span>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
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
      {/* ── Background: rotating conic radar ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute"
          style={{
            width: 900, height: 900,
            top: '50%', left: '50%',
            marginTop: -450, marginLeft: -450,
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,245,255,0.03) 30deg, transparent 60deg)',
            borderRadius: '50%',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        {/* Concentric rings */}
        {[200, 350, 500].map((r) => (
          <div key={r} style={{
            position: 'absolute',
            width: r * 2, height: r * 2,
            top: '50%', left: '50%',
            marginTop: -r, marginLeft: -r,
            borderRadius: '50%',
            border: '1px solid rgba(0,245,255,0.03)',
          }} />
        ))}
      </div>

      {/* Glow accents */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--glow-secondary) 0%, transparent 70%)', opacity: 0.08 }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.06 }} />

      {/* Watermark */}
      <div className="absolute left-8 top-1/3 pointer-events-none select-none hidden xl:block">
        <span style={{
          fontSize: 200, fontWeight: 900, lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(0,245,255,0.03)',
          fontFamily: 'var(--font-space-grotesk)',
        }}>
          ACH
        </span>
      </div>

      <div className="relative z-10">

        {/* ── Heading ── */}
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div className="h-px w-8" style={{ background: 'var(--accent)' }}
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 }} />
              <p className="text-xs tracking-[0.35em] uppercase"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                // recognition &amp; milestones
              </p>
            </div>

            <div className="flex items-end gap-5 flex-wrap">
              <h2 className="text-5xl sm:text-7xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)', letterSpacing: '0.04em' }}>
                {heading}
              </h2>
              {/* Live ticker */}
              <div className="flex items-center gap-2 mb-2 pb-1"
                style={{ borderBottom: '1px solid var(--card-border)' }}>
                <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                  missions_unlocked
                </span>
                <span style={{ fontSize: 22, fontFamily: 'var(--font-jetbrains)', fontWeight: 900 }}>
                  [<Ticker target={achievements.length} inView={inView} />]
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div className="section-heading-line w-24" />
              <span className="text-xs"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.4 }}>
                drag to scroll
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Carousel ── */}
        <div className="relative">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, var(--background) 0%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(270deg, var(--background) 0%, transparent 100%)' }} />

          <div
            ref={emblaRef}
            style={{ overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'pan-y'}}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              paddingTop: 8,
              paddingBottom: 24,
            }}>
              {achievements.map((achievement, i) => (
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
                  <AchievementCard achievement={achievement} index={i} inView={inView}/>
                </div>
              ))}
              <div style={{
                flexShrink: 0,
                width: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
              }} />
            </div>
          </div>
        </div>

        {/* ── Drag hint ── */}
        <div className="section-container mt-4">
          <motion.div
            className="flex items-center gap-3"
            animate={{ x: [0, 5, 0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5 }}
          >
            <span style={{ fontSize: 10, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.5 }}>
              ←
            </span>
            <span style={{ fontSize: 10, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.5, letterSpacing: '0.15em' }}>
              DRAG TO EXPLORE
            </span>
            <span style={{ fontSize: 10, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.5 }}>
              →
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}