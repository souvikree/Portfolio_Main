'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Github, Linkedin, Code2, Mail, ArrowDown, Download, ExternalLink, Eye, Cpu, Wifi, Shield } from 'lucide-react'
import { HeroParticles } from '@/components/hero-particles'
import { portfolioData } from '@/lib/portfolio-data'
import dynamic from 'next/dynamic'

const ResumeModal = dynamic(
  () => import('@/components/resume-modal').then((m) => m.ResumeModal),
  { ssr: false }
)

const EASE = [0.16, 1, 0.3, 1] as const

const ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Open Source Contributor',
  'System Architect',
]

const SOCIAL_ICONS: Record<string, React.ElementType> = { Github, Linkedin, Code2, Mail }
const PDF_PATH    = '/resume/Souvik__Ghosh__Resume.pdf'
const PDF_DL_NAME = 'Souvik_Ghosh_Resume.pdf'

// ── Live system clock ─────────────────────────────────────────────────────────
function SystemClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: 'var(--accent)', opacity: 0.6, letterSpacing: '0.08em' }}>
      {time}
    </span>
  )
}

// ── Typewriter role ───────────────────────────────────────────────────────────
function TypewriterRole() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing')

  useEffect(() => {
    const role = ROLES[roleIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (displayed.length < role.length) {
        timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 55)
      } else {
        timeout = setTimeout(() => setPhase('pause'), 1800)
      }
    } else if (phase === 'pause') {
      timeout = setTimeout(() => setPhase('deleting'), 400)
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28)
      } else {
        setRoleIdx(i => (i + 1) % ROLES.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, phase, roleIdx])

  return (
    <div className="flex items-center gap-2 h-7">
      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)', fontSize: '0.95rem' }}>~$</span>
      <span className="text-base font-semibold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
        {displayed}
      </span>
      <motion.span
        className="inline-block w-[2px] h-4 rounded-sm"
        style={{ background: 'var(--accent)' }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </div>
  )
}

// ── Letter reveal for name ────────────────────────────────────────────────────
function GlitchName({ name, delay = 0 }: { name: string; delay?: number }) {
  return (
    <div className="flex overflow-hidden" style={{ lineHeight: 0.88 }}>
      {name.split('').map((ch, i) => (
        <motion.span key={i}
          className="font-black tracking-tight"
          style={{
            fontSize: 'clamp(3.8rem, 11vw, 8rem)',
            fontFamily: 'var(--font-space-grotesk)',
            display: 'inline-block',
          }}
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: delay + i * 0.07, ease: EASE }}
        >
          {/* Flash glow on reveal */}
          <motion.span
            style={{ display: 'inline-block', position: 'relative' }}
            initial={{ textShadow: `0 0 30px var(--accent), 0 0 60px var(--accent)` }}
            animate={{ textShadow: '0 0 0px transparent' }}
            transition={{ duration: 0.6, delay: delay + i * 0.07 + 0.2 }}
          >
            {ch}
          </motion.span>
        </motion.span>
      ))}
    </div>
  )
}

// ── Radar rings around photo ──────────────────────────────────────────────────
function RadarRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1, 1.6, 2.2, 2.8].map((scale, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 200, height: 200,
            border: `1px solid rgba(0,245,255,${0.12 - i * 0.025})`,
            transform: `scale(${scale})`,
          }}
          animate={{ opacity: [0.6, 0.2, 0.6], scale: [scale, scale * 1.04, scale] }}
          transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}
      {/* Rotating sweep line */}
      <motion.div
        className="absolute"
        style={{ width: 200, height: 200, transformOrigin: 'center' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '50%', height: 1,
          background: 'linear-gradient(90deg, rgba(0,245,255,0.5), transparent)',
          transformOrigin: 'left center',
        }} />
      </motion.div>
    </div>
  )
}

// ── System stats panel ────────────────────────────────────────────────────────
function SystemStats({ trigger }: { trigger: boolean }) {
  const [uptime, setUptime] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const id = setInterval(() => setUptime(p => p + 1), 1000)
    return () => clearInterval(id)
  }, [trigger])

  const fmt = (s: number) => `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  const stats = [
    { icon: Cpu,    label: 'STACK',   value: 'Java · Next.js' },
    { icon: Wifi,   label: 'STATUS',  value: 'Available' },
    { icon: Shield, label: 'UPTIME',  value: fmt(uptime) },
  ]

  return (
    <motion.div
      className="hidden lg:flex flex-col gap-2 absolute right-0 top-1/2 -translate-y-1/2"
      style={{ width: 160 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 3.8, ease: EASE }}
    >
      {/* <div className="text-[8px] uppercase tracking-[0.25em] mb-1"
        style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-jetbrains)' }}>
        sys.info
      </div> */}
      {/* {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,245,255,0.08)' }}>
          <Icon size={9} style={{ color: 'var(--accent)', opacity: 0.7, flexShrink: 0 }} />
          <div className="flex flex-col min-w-0">
            <span style={{ fontSize: 7, fontFamily: 'var(--font-jetbrains)', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
              {label}
            </span>
            <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value}
            </span>
          </div>
        </div>
      ))} */}
    </motion.div>
  )
}

// ── Hex grid background ───────────────────────────────────────────────────────
function HexGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
      <defs>
        <pattern id="hexgrid" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon points="30,2 56,16 56,36 30,50 4,36 4,16"
            fill="none" stroke="rgba(0,245,255,1)" strokeWidth="0.6"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexgrid)"/>
    </svg>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 2.7 } } }
const FADE_UP = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } },
}

export function HeroSection() {
  const { personal, social } = portfolioData
  const containerRef = useRef<HTMLDivElement>(null)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [booted, setBooted] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 20, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 20, damping: 18 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 22)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 14)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    setTimeout(() => setBooted(true), 2700)
  }, [])

  return (
    <>
      <section
        id="home"
        ref={containerRef}
        className="relative min-h-screen flex items-start overflow-hidden"
        style={{ background: 'var(--background)' }}
      >
        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <HeroParticles />
        </div>

        {/* Hex grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <HexGrid />
        </div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)',
          }}
        />

        {/* Ambient glows */}
        <motion.div className="absolute top-1/4 left-1/5 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--glow-secondary) 0%, transparent 65%)', filter: 'blur(90px)', opacity: 0.18 }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.18, 0.25, 0.18] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 65%)', filter: 'blur(100px)', opacity: 0.12 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* Top system bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 z-20"
          style={{ borderBottom: '1px solid rgba(0,245,255,0.06)', background: 'rgba(5,5,8,0.5)', backdropFilter: 'blur(12px)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FF87', boxShadow: '0 0 5px #00FF87' }} />
            <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>
              SOUVIK_PORTFOLIO v2.0
            </span>
          </div>
          <SystemClock />
          <div className="flex items-center gap-3">
            {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
          </div>
        </motion.div>

        {/* Vertical accent line left */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--accent), var(--accent-secondary), transparent)' }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        />

        <div className="section-container w-full pb-16 relative z-10 min-h-screen flex flex-col justify-center">
          <div className="grid lg:grid-cols-[52%_48%] gap-8 lg:gap-6 items-center mt-20">

            {/* ── LEFT: TEXT ── */}
            <motion.div variants={STAGGER} initial="hidden" animate="show" className="flex flex-col gap-5">

              {/* Boot badge */}
              <motion.div variants={FADE_UP}>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(0,255,135,0.07)', border: '1px solid rgba(0,255,135,0.2)', color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}
                  animate={{ boxShadow: ['0 0 0px rgba(0,255,135,0)', '0 0 20px rgba(0,255,135,0.22)', '0 0 0px rgba(0,255,135,0)'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <motion.span className="w-2 h-2 rounded-full" style={{ background: '#00FF87' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }} />
                  Available for Opportunities
                </motion.div>
              </motion.div>

              {/* Name — letter by letter with glow flash */}
              <motion.div variants={FADE_UP} className="flex flex-col gap-1">
                <div className="relative overflow-hidden" style={{ lineHeight: 0.88 }}>
                  <h1 className="font-black tracking-tight kinetic-text"
                    style={{ fontSize: 'clamp(3.8rem, 11vw, 8rem)', fontFamily: 'var(--font-space-grotesk)' }}>
                    SOUVIK
                  </h1>
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }} />
                </div>
                <h1 className="font-black tracking-tight ml-3 sm:ml-7 lg:ml-10"
                  style={{ fontSize: 'clamp(3.8rem, 11vw, 8rem)', fontFamily: 'var(--font-space-grotesk)', color: 'transparent', WebkitTextStroke: '2px var(--foreground)', opacity: 0.5, lineHeight: 0.88 }}>
                  GHOSH
                </h1>
              </motion.div>

              {/* Typewriter role */}
              <motion.div variants={FADE_UP}><TypewriterRole /></motion.div>

              {/* Bio */}
              <motion.p variants={FADE_UP} className="text-sm sm:text-base leading-relaxed max-w-lg"
                style={{ color: 'var(--muted-foreground)' }}>
                I build software that solves real problems.
                My focus is distributed systems, real-time communication, and architectures built to scale.
                Every project is a step toward building something that genuinely matters.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={FADE_UP} className="flex flex-wrap gap-3">
                <motion.a
                  href="#projects"
                  onClick={e => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm relative overflow-hidden"
                  style={{ background: 'var(--accent)', color: 'var(--background)', fontFamily: 'var(--font-space-grotesk)', boxShadow: '0 0 28px var(--glow)' }}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 44px var(--glow)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5 }} />
                  <span className="relative z-10 flex items-center gap-2">View My Work <ExternalLink size={13}/></span>
                </motion.a>

                <div className="flex items-center rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--accent)' }}>
                  <motion.button type="button" onClick={() => setResumeOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold"
                    style={{ background: 'transparent', color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)', borderRight: '1px solid var(--accent)' }}
                    whileHover={{ background: 'rgba(0,245,255,0.07)' }}
                    whileTap={{ scale: 0.97 }}>
                    <Eye size={13}/> Preview CV
                  </motion.button>
                  <motion.a href={PDF_PATH} download={PDF_DL_NAME} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold"
                    style={{ background: 'transparent', color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
                    whileHover={{ background: 'rgba(0,245,255,0.07)' }}
                    whileTap={{ scale: 0.97 }}>
                    <Download size={13}/>
                  </motion.a>
                </div>
              </motion.div>

              {/* Social icons */}
              <motion.div variants={FADE_UP} className="flex items-center gap-3 pt-1 flex-wrap">
                {social.map((link, i) => {
                  const Icon = SOCIAL_ICONS[link.icon] || Github
                  return (
                    <motion.a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="group relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden"
                      style={{ background: 'var(--muted)', border: '1px solid var(--card-border)', color: 'var(--muted-foreground)' }}
                      aria-label={link.name}
                      whileHover={{ color: 'var(--accent)', borderColor: 'var(--accent)', boxShadow: '0 0 18px var(--glow)', y: -3 } as any}
                      whileTap={{ scale: 0.93 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3.5 + i * 0.08 }}
                    >
                      <Icon size={16}/>
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                        style={{ background: 'var(--popover)', color: 'var(--accent)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-jetbrains)' }}>
                        {link.name}
                      </span>
                    </motion.a>
                  )
                })}
              </motion.div>
            </motion.div>

            {/* ── RIGHT: PHOTO ── */}
            <motion.div
              className="relative flex items-end justify-center"
              initial={{ opacity: 0, x: 50, filter: 'blur(12px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 3.0, ease: EASE }}
              style={{ minHeight: 480 }}
            >
              {/* System stats panel — right side */}
              <SystemStats trigger={booted} />

              <motion.div className="relative w-full flex items-end justify-center"
                style={{ x: springX, y: springY }}>

                {/* Radar rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
                  <RadarRings />
                </div>

                {/* ENGINEER watermark text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none" style={{ zIndex: 0 }}>
                  <motion.p className="font-black text-center leading-none"
                    style={{ fontSize: 'clamp(0.7rem, 1.8vw, 1.1rem)', color: 'var(--foreground)', opacity: 0.14, fontFamily: 'var(--font-space-grotesk)', letterSpacing: '0.3em' }}
                    animate={{ opacity: [0.1, 0.18, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}>
                    SOFTWARE
                  </motion.p>
                  <motion.p className="font-black text-center leading-none"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', color: 'transparent', WebkitTextStroke: '1px var(--accent)', opacity: 0.1, fontFamily: 'var(--font-space-grotesk)', letterSpacing: '0.08em' }}
                    animate={{ opacity: [0.06, 0.14, 0.06] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}>
                    ENGINEER
                  </motion.p>
                </div>

                {/* Ambient glow */}
                <div className="absolute pointer-events-none"
                  style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60%', background: 'radial-gradient(ellipse at 50% 100%, var(--glow) 0%, var(--glow-secondary) 30%, transparent 70%)', filter: 'blur(40px)', opacity: 0.35, zIndex: 0 }} />

                {/* Photo with holographic scan */}
                <div className="relative overflow-hidden" style={{
                  zIndex: 5,
                  maskImage: 'linear-gradient(to bottom, black 40%, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                  maskComposite: 'intersect',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 40%, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                  WebkitMaskComposite: 'source-in',
                }}>
                  <Image
                    src="/images/souvik-nobg.webp"
                    alt={`${personal.name} — ${personal.role}`}
                    width={480} height={600}
                    className="object-contain object-bottom w-full"
                    style={{ maxHeight: 520 }}
                    priority
                  />

                  {/* Holographic scan stripe */}
                  <motion.div className="absolute inset-x-0 h-[80px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, transparent, rgba(0,245,255,0.06) 40%, rgba(0,245,255,0.1) 50%, rgba(0,245,255,0.06) 60%, transparent)',
                      filter: 'blur(2px)',
                    }}
                    animate={{ top: ['-80px', '620px'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                  />

                  {/* Scanlines */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,245,255,0.015) 3px, rgba(0,245,255,0.015) 4px)',
                    }}
                  />

                  {/* Corner brackets */}
                  {[
                    { top: 8, left: 8, path: 'M24 0 H0 V24' },
                    { top: 8, right: 8, path: 'M0 0 H24 V24' },
                    { bottom: 60, left: 8, path: 'M24 24 H0 V0' },
                    { bottom: 60, right: 8, path: 'M0 24 H24 V0' },
                  ].map((b, i) => (
                    <motion.svg key={i} width={24} height={24}
                      className="absolute pointer-events-none"
                      style={{ top: b.top, bottom: b.bottom, left: b.left, right: b.right, opacity: 0 }}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                      transition={{ delay: 3.4, duration: 0.4 }}>
                      <path d={b.path} stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
                    </motion.svg>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div className="flex flex-col items-center gap-2 mt-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 4.8, duration: 1 }}>
            <span className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              Scroll to explore
            </span>
            <motion.div animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: 'var(--accent)' }}>
              <ArrowDown size={16}/>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent-secondary), transparent)', opacity: 0.3 }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: EASE }}
        />
      </section>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  )
}