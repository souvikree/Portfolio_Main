'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { portfolioData } from '@/lib/portfolio-data'
import { MapPin, Mail, Coffee, Zap, ExternalLink } from 'lucide-react'
import { LeetCodeStats } from '@/components/leetcode-stats'
import { GitHubActivity } from '@/components/github-activity'

const EASE = [0.16, 1, 0.3, 1] as const

// ── Text scramble ─────────────────────────────────────────────────────────────
function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text)
  const chars = '!<>-_\\/[]{}—=+*^?#'
  useEffect(() => {
    if (!trigger) return
    let frame = 0
    const total = text.length * 4
    const id = setInterval(() => {
      frame++
      setDisplay(
        text.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          if (frame >= i * 4 + 4) return ch
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
      )
      if (frame >= total) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [trigger, text])
  return display
}

// ── Counter ───────────────────────────────────────────────────────────────────
function Counter({ value, suffix, trigger }: { value: number; suffix?: string; trigger: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const id = setInterval(() => {
      start += Math.ceil(value / (1800 / 30))
      if (start >= value) { setCount(value); clearInterval(id) }
      else setCount(start)
    }, 30)
    return () => clearInterval(id)
  }, [trigger, value])
  return <span>{count}{suffix}</span>
}

// ── Ticker tape ───────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { icon: MapPin,  text: 'Kolkata, India' },
  { icon: Mail,    text: 'souvikg3225@gmail.com' },
  { icon: Coffee,  text: 'Open to Collaborate' },
  { icon: Zap,     text: 'B.Tech CSBS @ HITK' },
  { icon: MapPin,  text: 'Kolkata, India' },
  { icon: Mail,    text: 'souvikg3225@gmail.com' },
  { icon: Coffee,  text: 'Open to Collaborate' },
  { icon: Zap,     text: 'B.Tech CSBS @ HITK' },
]

function TickerTape() {
  return (
    <div className="overflow-hidden" style={{ borderTop: '1px solid var(--card-border)' }}>
      <motion.div
        className="flex items-center gap-0 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {TICKER_ITEMS.map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-2 px-5 py-2.5 flex-shrink-0"
            style={{ borderRight: '1px solid var(--card-border)' }}>
            <Icon size={10} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span className="text-[10px] font-medium"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              {text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ── Hex photo frame ───────────────────────────────────────────────────────────
function HexPhoto() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 100, height: 112 }}>
      {/* Rotating conic border layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: 'conic-gradient(var(--accent), #7B2FFF, #FF2D78, #00F5FF, var(--accent))',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      {/* Photo layer inset */}
      <div className="absolute" style={{
        inset: 3,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: 'var(--background)',
        overflow: 'hidden',
      }}>
        <Image
          src="/images/souvik-nobg.webp" alt="Souvik Ghosh"
          width={94} height={106}
          className="w-full h-full object-cover object-top"
        />
      </div>
      {/* Glow beneath */}
      {/* <div className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: 'var(--accent)',
          filter: 'blur(20px)',
          opacity: 0.15,
          transform: 'translateY(8px) scale(0.9)',
        }} /> */}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, trigger, delay, color }: {
  value: number; suffix?: string; label: string
  trigger: boolean; delay: number; color: string
}) {
  return (
    <motion.div
      className="relative flex flex-col gap-1 p-5 rounded-2xl overflow-hidden group"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE }}
      whileHover={{ borderColor: color, boxShadow: `0 0 24px ${color}20` }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%, ${color}25, transparent 70%)` }} />

      <div className="text-4xl font-black leading-none tabular-nums"
        style={{ color, fontFamily: 'var(--font-space-grotesk)', letterSpacing: '-0.02em' }}>
        <Counter value={value} suffix={suffix} trigger={trigger} />
      </div>
      <div className="h-px w-8 rounded-full" style={{ background: color, opacity: 0.5 }} />
      <div className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
        {label}
      </div>
    </motion.div>
  )
}

// ── Bio card ──────────────────────────────────────────────────────────────────
function BioCard({ intro, philosophy, personal, inView }: {
  intro: string; philosophy: string; personal: string; inView: boolean
}) {
  const [tabOpen, setTabOpen] = useState(false)
  useEffect(() => {
    if (inView) setTimeout(() => setTabOpen(true), 400)
  }, [inView])

  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(5,5,8,0.95)',
        border: '1px solid rgba(0,245,255,0.18)',
        boxShadow: '-4px 0 32px rgba(0,245,255,0.06)',
      }}
    >
      {/* Top bar */}
      <motion.div className="h-[3px] w-full"
        style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))' }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
      />

      {/* File tab */}
      <div className="flex items-center px-5 pt-3 pb-0 gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Traffic lights */}
        {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
        {/* Animated tab */}
        <AnimatePresence>
          {tabOpen && (
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg ml-2"
              style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.15)', borderBottom: 'none', marginBottom: -1 }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="w-2 h-2 rounded-sm" style={{ background: 'var(--accent)' }} />
              <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', letterSpacing: '0.1em' }}>
                bio.txt
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 sm:p-6 flex flex-col gap-4">
        <motion.p className="text-sm sm:text-base leading-relaxed"
          style={{ color: 'var(--foreground)' }}
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}>
          {intro}
        </motion.p>
        <motion.p className="text-sm leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}>
          {philosophy}
        </motion.p>
        <motion.p className="text-sm leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7, ease: EASE }}>
          {personal}
        </motion.p>
      </div>
    </div>
  )
}

// ── Profile card (left) ───────────────────────────────────────────────────────
function ProfileCard({ inView }: { inView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mx      = useMotionValue(0.5)
  const my      = useMotionValue(0.5)
  const rotX    = useSpring(useTransform(my, [0,1], [4, -4]), { stiffness: 200, damping: 30 })
  const rotY    = useSpring(useTransform(mx, [0,1], [-5, 5]), { stiffness: 200, damping: 30 })
  const glow    = useTransform([mx, my], ([gx, gy]: number[]) =>
    `radial-gradient(circle at ${gx*100}% ${gy*100}%, rgba(0,245,255,0.08) 0%, transparent 55%)`
  )

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top)  / r.height)
  }
  const onLeave = () => { mx.set(0.5); my.set(0.5) }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className="relative rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {/* Cursor glow */}
      <motion.div className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        style={{ background: glow }} />

      {/* Card border glow */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'rgba(5,5,8,0.95)',
          border: '1px solid rgba(0,245,255,0.2)',
          boxShadow: '0 0 40px rgba(0,245,255,0.06)',
        }}
      />

      {/* Top accent */}
      <motion.div className="h-[3px] w-full relative z-10"
        style={{ background: 'linear-gradient(90deg, var(--accent), #7B2FFF, #FF2D78)' }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      />

      {/* Main content */}
      <div className="relative z-10 flex items-center gap-5 p-5">
        <HexPhoto />
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)', opacity: 0.6 }}>
              // profile
            </span>
          </div>
          <h3 className="text-xl font-black"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
            Souvik Ghosh
          </h3>
          <p className="text-xs font-semibold"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
            &lt;Software Engineer /&gt;
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <motion.span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#00FF87', boxShadow: '0 0 6px #00FF87' }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }} />
            <span className="text-[10px] font-semibold"
              style={{ color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}>
              Available for opportunities
            </span>
          </div>
        </div>
      </div>

      {/* Ticker tape */}
      <div className="relative z-10">
        <TickerTape />
      </div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export function AboutSection() {
  const { about } = portfolioData
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('WHO AM I', inView)

  const statColors = ['var(--accent)', '#7B2FFF', '#FF2D78', '#FFD166']

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-20 sm:py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* ── Rich background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.014) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.014) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 85% 85% at 30% 50%, black 20%, transparent 100%)',
        }} />

        {/* Mesh gradient blobs */}
        <motion.div className="absolute rounded-full"
          style={{ width: 600, height: 600, top: '10%', left: '-10%', background: 'radial-gradient(circle, rgba(0,245,255,0.09) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ x: [0, 30, -15, 0], y: [0, -20, 15, 0], scale: [1, 1.05, 0.97, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute rounded-full"
          style={{ width: 500, height: 500, bottom: '5%', right: '5%', background: 'radial-gradient(circle, rgba(123,47,255,0.11) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ x: [0, -20, 10, 0], y: [0, 15, -10, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <motion.div className="absolute rounded-full"
          style={{ width: 350, height: 350, top: '50%', right: '25%', background: 'radial-gradient(circle, rgba(255,45,120,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: [0, 15, -8, 0], y: [0, -25, 12, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        />

        {/* Diagonal line */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.035 }}>
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="url(#aboutDiag)" strokeWidth="1"/>
          <defs>
            <linearGradient id="aboutDiag" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="35%" stopColor="#00F5FF"/>
              <stop offset="65%" stopColor="#7B2FFF"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Watermark */}
      <div className="absolute left-6 top-1/3 pointer-events-none select-none hidden xl:block">
        <span style={{
          fontSize: 140, fontWeight: 900, lineHeight: 1,
          color: 'transparent', WebkitTextStroke: '1px rgba(0,245,255,0.03)',
          fontFamily: 'var(--font-space-grotesk)',
        }}>
          WHO
        </span>
      </div>

      <div className="section-container relative z-10">

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div className="h-px w-8" style={{ background: 'var(--accent)' }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }} />
            <p className="text-xs tracking-[0.35em] uppercase"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              // about me
            </p>
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)', letterSpacing: '0.04em' }}>
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-8 lg:gap-14 items-start">

          {/* ══ LEFT ══ */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col gap-5"
          >
            {/* Profile card with hex photo + ticker */}
            <ProfileCard inView={inView} />

            {/* LeetCode */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            >
              <LeetCodeStats />
            </motion.div>

            {/* Stats — editorial large numbers */}
            <div className="grid grid-cols-2 gap-3">
              {about.stats.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  trigger={inView}
                  delay={0.5 + i * 0.1}
                  color={statColors[i % statColors.length]}
                />
              ))}
            </div>
          </motion.div>

          {/* ══ RIGHT ══ */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* Bio card with file tab animation */}
            <BioCard
              intro={about.intro}
              philosophy={about.philosophy}
              personal={about.personal}
              inView={inView}
            />

            {/* GitHub Activity */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            >
              <GitHubActivity />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}