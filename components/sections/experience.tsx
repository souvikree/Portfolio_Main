'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'
import { MapPin, Calendar, ChevronRight, Zap } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

// ── Animated noise texture via canvas ────────────────────────────────────────
function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width  = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight
    const img = ctx.createImageData(W, H)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 18
      img.data[i] = img.data[i+1] = img.data[i+2] = v
      img.data[i+3] = 14
    }
    ctx.putImageData(img, 0, 0)
  }, [])
  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1, mixBlendMode: 'overlay' }} />
  )
}

// ── Floating orb ──────────────────────────────────────────────────────────────
function FloatingOrb({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${size * 0.35}px)`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        y: [0, -24, 0, 18, 0],
        x: [0, 12, -8, 0],
        opacity: [0.12, 0.2, 0.14, 0.18, 0.12],
        scale: [1, 1.08, 0.95, 1.04, 1],
      }}
      transition={{ duration: 12 + delay * 3, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

// ── Selector button ───────────────────────────────────────────────────────────
function SelectorItem({
  exp, index, isActive, isUpcoming, inView, onClick,
}: {
  exp: typeof portfolioData.experience[0]
  index: number; isActive: boolean; isUpcoming: boolean; inView: boolean
  onClick: () => void
}) {
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  // Always derive — never conditionally call hooks
  const spotlightBg = useTransform([mx, my], ([gx, gy]: number[]) =>
    `radial-gradient(circle at ${gx}% ${gy}%, rgba(0,245,255,0.07) 0%, transparent 55%)`
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 100)
    my.set(((e.clientY - r.top) / r.height) * 100)
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="relative text-left rounded-2xl px-5 py-4 overflow-hidden w-full"
      style={{
        background: isActive ? 'rgba(0,245,255,0.04)' : 'rgba(255,255,255,0.01)',
        border: `1px solid ${isActive ? 'rgba(0,245,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isActive ? '0 0 30px rgba(0,245,255,0.08), inset 0 1px 0 rgba(0,245,255,0.1)' : 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.3 + index * 0.1, ease: EASE }}
      whileHover={{ x: isActive ? 0 : 3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Cursor spotlight — always rendered, opacity controlled by isActive */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: spotlightBg, opacity: isActive ? 1 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      />

      {/* Active left accent */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="exp-accent"
            className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
            style={{ background: 'linear-gradient(180deg, var(--accent), var(--accent-secondary))' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        )}
      </AnimatePresence>

      {/* Index number — large watermark */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black pointer-events-none select-none"
        style={{
          fontSize: '3rem', lineHeight: 1,
          color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
          fontFamily: 'var(--font-space-grotesk)',
          transition: 'color 0.3s',
          opacity: isActive ? 0.12 : 1,
        }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="relative z-10">
        {/* Company + status dot */}
        <div className="flex items-center gap-2 mb-1.5">
          {!isUpcoming ? (
            <motion.span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#00FF87', boxShadow: '0 0 6px #00FF87' }}
              animate={isActive ? { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] } : {}}
              transition={{ duration: 1.8, repeat: Infinity }} />
          ) : (
            <motion.span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1.6, repeat: Infinity }} />
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: isActive ? 'var(--accent)' : 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', transition: 'color 0.2s' }}>
            {exp.company}
          </span>
        </div>

        <p className="text-sm font-bold leading-snug mb-1"
          style={{ color: isActive ? 'var(--foreground)' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-space-grotesk)', transition: 'color 0.2s' }}>
          {exp.role}
        </p>
        <p className="text-[10px]"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.45 }}>
          {exp.duration}
        </p>
      </div>
    </motion.button>
  )
}

// ── Detail card ───────────────────────────────────────────────────────────────
function DetailCard({ exp, index }: { exp: typeof portfolioData.experience[0]; index: number }) {
  const isUpcoming = exp.status === 'upcoming'
  const cardRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [3, -3]),  { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-4, 4]),  { stiffness: 200, damping: 30 })
  const glowX      = useTransform(mx, [0, 1], [0, 100])
  const glowY      = useTransform(my, [0, 1], [0, 100])
  // Pre-derive the cursor glow background — never call useTransform inside JSX
  const cursorGlow = useTransform([glowX, glowY], ([gx, gy]: number[]) =>
    `radial-gradient(circle at ${gx}% ${gy}%, ${isUpcoming ? 'rgba(255,255,255,0.04)' : 'rgba(0,245,255,0.08)'} 0%, transparent 55%)`
  )

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top)  / r.height)
  }
  const onMouseLeave = () => { mx.set(0.5); my.set(0.5) }

  return (
    <motion.div
      key={exp.company}
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
      transition={{ duration: 0.4, ease: EASE }}
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: 'preserve-3d' }}
    >
      <div className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(5,5,8,0.92)',
          border: `1px solid ${isUpcoming ? 'rgba(255,255,255,0.07)' : 'rgba(0,245,255,0.2)'}`,
          boxShadow: isUpcoming
            ? '0 8px 40px rgba(0,0,0,0.4)'
            : '0 0 0 1px rgba(0,245,255,0.06), 0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(0,245,255,0.06)',
        }}
      >
        {/* Cursor-following glow */}
        <motion.div className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: cursorGlow }}
        />

        {/* Noise texture */}
        <NoiseOverlay />

        {/* Top gradient accent */}
        <motion.div className="h-[3px] w-full flex-shrink-0"
          style={{ background: isUpcoming ? 'rgba(255,255,255,0.05)' : 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))' }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        />

        {/* Corner decoration */}
        <svg className="absolute top-4 right-4 pointer-events-none" width={40} height={40}
          style={{ opacity: isUpcoming ? 0.04 : 0.12 }}>
          <path d="M40 0 H0 M40 0 V40" stroke="var(--accent)" strokeWidth="1" fill="none"/>
        </svg>
        <svg className="absolute bottom-4 left-4 pointer-events-none" width={40} height={40}
          style={{ opacity: isUpcoming ? 0.04 : 0.12 }}>
          <path d="M0 40 H40 M0 40 V0" stroke="var(--accent)" strokeWidth="1" fill="none"/>
        </svg>

        {/* Shimmer for upcoming */}
        {isUpcoming && (
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
          />
        )}

        <div className="p-7 sm:p-9 relative z-10">

          {/* ── Header ── */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
            <div>
              <motion.span
                className="text-[9px] font-black tracking-[0.3em] uppercase mb-3 block"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)', opacity: 0.55 }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 0.55, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                // role_{String(index + 1).padStart(2, '0')}
              </motion.span>
              <motion.h3
                className="text-2xl sm:text-3xl font-black leading-tight mb-1.5"
                style={{ color: isUpcoming ? 'var(--muted-foreground)' : 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                {exp.role}
              </motion.h3>
              <motion.p
                className="text-sm font-bold"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.18 }}
              >
                {exp.company}
              </motion.p>
            </div>

            {/* Status badge */}
            {isUpcoming ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-jetbrains)' }}>
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>◉</motion.span>
                Coming Soon
              </span>
            ) : (
              <motion.span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                style={{ background: 'rgba(0,255,135,0.07)', color: '#00FF87', border: '1px solid rgba(0,255,135,0.18)', fontFamily: 'var(--font-jetbrains)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Zap size={10} /> Completed
              </motion.span>
            )}
          </div>

          {/* ── Meta row ── */}
          <motion.div
            className="flex flex-wrap gap-4 mb-7 pb-7"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {[
              { icon: Calendar, text: exp.duration },
              { icon: MapPin,   text: exp.location },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon size={11} style={{ color: 'var(--accent)', opacity: 0.75 }} />
                <span className="text-xs font-medium"
                  style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                  {text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* ── Bullets ── */}
          {!isUpcoming ? (
            <ul className="flex flex-col gap-3.5 mb-7">
              {exp.description.map((pt, j) => (
                <motion.li key={j}
                  className="flex items-start gap-3 text-sm leading-relaxed group/item"
                  style={{ color: 'var(--muted-foreground)' }}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + j * 0.07, ease: EASE }}
                >
                  <motion.span className="mt-1 flex-shrink-0"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.25 + j * 0.07, type: 'spring', stiffness: 400, damping: 20 }}>
                    <ChevronRight size={13} style={{ color: 'var(--accent)' }} />
                  </motion.span>
                  {pt}
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-3.5 mb-7">
              <p className="text-sm italic"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.5 }}>
                The next chapter is being written
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>...</motion.span>
              </p>
              {[80, 65, 72].map((w, k) => (
                <div key={k} className="relative h-2 rounded-full overflow-hidden"
                  style={{ width: `${w}%`, background: 'rgba(255,255,255,0.04)' }}>
                  <motion.div className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: k * 0.3 }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Tech tags ── */}
          {exp.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((t, ti) => (
                <motion.span key={t}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  style={{
                    background: 'rgba(0,245,255,0.05)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(0,245,255,0.15)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + ti * 0.05, ease: EASE }}
                  whileHover={{ scale: 1.08, boxShadow: '0 0 12px var(--glow)', borderColor: 'var(--accent)' }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export function ExperienceSection() {
  const { experience } = portfolioData
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('EXPERIENCE', inView)
  const [active, setActive] = useState(0)

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* ── Rich background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.015) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 100%)',
        }} />

        {/* Floating orbs */}
        <FloatingOrb x="15%"  y="20%"  size={400} color="rgba(0,245,255,0.18)"   delay={0}   />
        <FloatingOrb x="85%"  y="70%"  size={350} color="rgba(123,47,255,0.22)"  delay={2.5} />
        <FloatingOrb x="50%"  y="50%"  size={500} color="rgba(255,45,120,0.08)"  delay={5}   />
        <FloatingOrb x="90%"  y="15%"  size={250} color="rgba(0,245,255,0.12)"   delay={1.5} />
        <FloatingOrb x="10%"  y="80%"  size={280} color="rgba(123,47,255,0.14)"  delay={3.5} />

        {/* Diagonal accent line */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="url(#diagGrad)" strokeWidth="1"/>
          <defs>
            <linearGradient id="diagGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="40%" stopColor="#00F5FF"/>
              <stop offset="60%" stopColor="#7B2FFF"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Watermark */}
      <div className="absolute right-6 top-1/3 pointer-events-none select-none hidden xl:block">
        <span style={{
          fontSize: 160, fontWeight: 900, lineHeight: 1,
          color: 'transparent', WebkitTextStroke: '1px rgba(0,245,255,0.03)',
          fontFamily: 'var(--font-space-grotesk)',
        }}>
          WORK
        </span>
      </div>

      <div className="section-container relative z-10">

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div className="h-px w-8" style={{ background: 'var(--accent)' }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }} />
            <p className="text-xs tracking-[0.35em] uppercase"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              // work history
            </p>
          </div>
          <h2 className="text-5xl sm:text-7xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)', letterSpacing: '0.04em' }}>
            {heading}
          </h2>
          <div className="flex items-center gap-4 mt-3">
            <div className="section-heading-line w-24" />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.4 }}>
              {experience.filter(e => e.status !== 'upcoming').length} roles
            </span>
          </div>
        </motion.div>

        {/* ── Two-panel layout ── */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-5 lg:gap-10 max-w-5xl mx-auto items-start">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="flex flex-col gap-2"
          >
            {experience.map((exp, i) => (
              <SelectorItem
                key={i} exp={exp} index={i}
                isActive={active === i}
                isUpcoming={exp.status === 'upcoming'}
                inView={inView}
                onClick={() => setActive(i)}
              />
            ))}
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="min-h-[360px]"
          >
            <AnimatePresence mode="wait">
              <DetailCard key={active} exp={experience[active]} index={active} />
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}