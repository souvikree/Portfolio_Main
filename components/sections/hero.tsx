'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Github, Linkedin, Code2, Mail, ArrowDown, Download, ExternalLink, Eye } from 'lucide-react'
import { HeroParticles } from '@/components/hero-particles'
import { portfolioData } from '@/lib/portfolio-data'
import dynamic from 'next/dynamic'

const ResumeModal = dynamic(
  () => import('@/components/resume-modal').then((m) => m.ResumeModal),
  { ssr: false }
)

const ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Open Source Contributor',
  'System Architect',
]

function RotatingRoles() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2800)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)', fontSize: '1rem' }}>~$</span>
      <div className="overflow-hidden h-7">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="text-base font-semibold"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
            initial={{ y: 28, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -28, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {ROLES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 2.7 } } }
const FADE_UP = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

const SOCIAL_ICONS: Record<string, React.ElementType> = { Github, Linkedin, Code2, Mail }

const PDF_PATH    = '/resume/Souvik__Ghosh__Resume.pdf'
const PDF_DL_NAME = 'Souvik_Ghosh_Resume.pdf'

export function HeroSection() {
  const { personal, social } = portfolioData
  const containerRef = useRef<HTMLDivElement>(null)
  const [resumeOpen, setResumeOpen] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 20, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 20, damping: 18 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      mouseX.set((e.clientX / innerWidth - 0.5) * 22)
      mouseY.set((e.clientY / innerHeight - 0.5) * 14)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

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

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
        }} />

        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--glow-secondary) 0%, transparent 65%)', filter: 'blur(80px)', opacity: 0.2 }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 65%)', filter: 'blur(100px)', opacity: 0.12 }} />

        <div className="section-container w-full pb-16 relative z-10 min-h-screen flex flex-col justify-center">
          <div className="grid lg:grid-cols-[52%_48%] gap-8 lg:gap-6 items-center mt-20">

            {/* LEFT: TEXT */}
            <motion.div variants={STAGGER} initial="hidden" animate="show" className="flex flex-col gap-5">

              {/* Available badge */}
              <motion.div variants={FADE_UP}>
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(0,255,135,0.07)', border: '1px solid rgba(0,255,135,0.2)', color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}
                  animate={{ boxShadow: ['0 0 0px rgba(0,255,135,0)', '0 0 16px rgba(0,255,135,0.2)', '0 0 0px rgba(0,255,135,0)'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <motion.span className="w-2 h-2 rounded-full" style={{ background: '#00FF87' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }} />
                  Available for Opportunities
                </motion.span>
              </motion.div>

              {/* Name */}
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

              {/* Role rotator */}
              <motion.div variants={FADE_UP}><RotatingRoles /></motion.div>

              {/* Bio */}
              <motion.p variants={FADE_UP} className="text-sm sm:text-base leading-relaxed max-w-lg"
                style={{ color: 'var(--muted-foreground)' }}>
                Building production-grade systems that scale. Passionate about distributed
                systems, real-time communication, and clean architecture.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={FADE_UP} className="flex flex-wrap gap-3">
                {/* View Work */}
                <motion.a
                  href="#projects"
                  onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm relative overflow-hidden"
                  style={{ background: 'var(--accent)', color: 'var(--background)', fontFamily: 'var(--font-space-grotesk)', boxShadow: '0 0 24px var(--glow)' }}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 40px var(--glow)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }} />
                  <span className="relative z-10 flex items-center gap-2">View My Work <ExternalLink size={13} /></span>
                </motion.a>

                {/* ── Resume button group ── */}
                <div className="flex items-center rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--accent)' }}>
                  {/* Preview button */}
                  <motion.button
                    type="button"
                    onClick={() => setResumeOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold relative overflow-hidden"
                    style={{ background: 'transparent', color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)', borderRight: '1px solid var(--accent)' }}
                    whileHover={{ background: 'rgba(0,245,255,0.07)', boxShadow: '0 0 20px var(--glow)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Eye size={13} /> Preview CV
                  </motion.button>

                  {/* Download button */}
                  <motion.a
                    href={PDF_PATH}
                    download={PDF_DL_NAME}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold"
                    style={{ background: 'transparent', color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
                    whileHover={{ background: 'rgba(0,245,255,0.07)', boxShadow: '0 0 20px var(--glow)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Download size={13} />
                  </motion.a>
                </div>
              </motion.div>

              {/* Social icons */}
              <motion.div variants={FADE_UP} className="flex items-center gap-3 pt-1 flex-wrap">
                {social.map((link, i) => {
                  const Icon = SOCIAL_ICONS[link.icon] || Github
                  return (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{ background: 'var(--muted)', border: '1px solid var(--card-border)', color: 'var(--muted-foreground)' }}
                      aria-label={link.name}
                      whileHover={{ color: 'var(--accent)', borderColor: 'var(--accent)', boxShadow: '0 0 16px var(--glow)', y: -3 } as any}
                      whileTap={{ scale: 0.93 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3.4 + i * 0.08 }}
                    >
                      <Icon size={16} />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                        style={{ background: 'var(--popover)', color: 'var(--accent)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-jetbrains)' }}>
                        {link.name}
                      </span>
                    </motion.a>
                  )
                })}
              </motion.div>
            </motion.div>

            {/* RIGHT: PHOTO */}
            <motion.div
              className="relative flex items-end justify-center"
              initial={{ opacity: 0, x: 50, filter: 'blur(12px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 3.0, ease: [0.22, 1, 0.36, 1] }}
              style={{ minHeight: 480 }}
            >
              <motion.div className="relative w-full flex items-end justify-center" style={{ x: springX, y: springY }}>

                {/* SOFTWARE ENGINEER text behind photo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none" style={{ zIndex: 0 }}>
                  <motion.p className="font-black text-center leading-none"
                    style={{ fontSize: 'clamp(0.7rem, 1.8vw, 1.1rem)', color: 'var(--foreground)', opacity: 0.18, fontFamily: 'var(--font-space-grotesk)', letterSpacing: '0.3em' }}
                    animate={{ opacity: [0.12, 0.22, 0.12] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                    SOFTWARE
                  </motion.p>
                  <motion.p className="font-black text-center leading-none"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', color: 'transparent', WebkitTextStroke: '1px var(--accent)', opacity: 0.12, fontFamily: 'var(--font-space-grotesk)', letterSpacing: '0.08em' }}
                    animate={{ opacity: [0.08, 0.18, 0.08] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
                    ENGINEER
                  </motion.p>
                </div>

                {/* Ambient glow behind photo */}
                <div className="absolute pointer-events-none"
                  style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60%', background: 'radial-gradient(ellipse at 50% 100%, var(--glow) 0%, var(--glow-secondary) 30%, transparent 70%)', filter: 'blur(40px)', opacity: 0.35, zIndex: 0 }} />

                {/* Photo */}
                <div className="relative" style={{
                  zIndex: 5,
                  maskImage: 'linear-gradient(to bottom, black 40%, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                  maskComposite: 'intersect',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 40%, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                  WebkitMaskComposite: 'source-in',
                }}>
                  <Image
                    src="/images/souvik-nobg.png"
                    alt={`${personal.name} — ${personal.role}`}
                    width={480}
                    height={600}
                    className="object-contain object-bottom w-full"
                    style={{ maxHeight: 520 }}
                    priority
                  />
                  {/* Scan line */}
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,245,255,0.04) 50%, transparent 100%)', backgroundSize: '100% 8px' }}
                    animate={{ backgroundPositionY: ['0px', '600px'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center gap-2 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.8, duration: 1 }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              Scroll to explore
            </span>
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: 'var(--accent)' }}>
              <ArrowDown size={16} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Resume modal — rendered outside the section so it's not clipped */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  )
}