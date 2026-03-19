'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Github, Linkedin, Code2, Mail, ArrowDown, Download, ExternalLink } from 'lucide-react'
import { HeroParticles } from '@/components/hero-particles'
import { portfolioData } from '@/lib/portfolio-data'

const ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Open Source Contributor',
  'System Architect',
]

function RotatingRoles() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2500)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="overflow-hidden h-8 sm:h-10">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="text-lg sm:text-xl font-medium"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {ROLES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 2.8 } } }
const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  Github, Linkedin, Code2, Mail,
}

export function HeroSection() {
  const { personal, social } = portfolioData
  const containerRef = useRef<HTMLDivElement>(null)

  // Mouse parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      mouseX.set((e.clientX / innerWidth - 0.5) * 30)
      mouseY.set((e.clientY / innerHeight - 0.5) * 20)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-start overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Particle field */}
      <div className="absolute inset-0 pointer-events-none">
        <HeroParticles />
      </div>

      {/* Radial glow backgrounds */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--glow-secondary) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.4,
        }}
      />

      <div className="section-container w-full  pb-16 relative z-10 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-center mt-22 ">

          {/* ===== LEFT: TEXT ===== */}
          <motion.div
            variants={STAGGER}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-5"
          >
            {/* Available badge */}
            <motion.div variants={FADE_UP}>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(0,255,135,0.08)',
                  border: '1px solid rgba(0,255,135,0.25)',
                  color: '#00FF87',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                <span className="available-dot" />
                Available for Opportunities
              </span>
            </motion.div>

            {/* Giant name */}
            <motion.div variants={FADE_UP} className="flex flex-col gap-0">
              <h1
                className="font-black leading-[0.9] tracking-tight"
                style={{
                  fontSize: 'clamp(4rem, 12vw, 8.5rem)',
                  fontFamily: 'var(--font-space-grotesk)',
                }}
              >
                <span className="kinetic-text">SOUVIK</span>
              </h1>
              <h1
                className="font-black leading-[0.9] tracking-tight ml-4 sm:ml-8 lg:ml-12"
                style={{
                  fontSize: 'clamp(4rem, 12vw, 8.5rem)',
                  fontFamily: 'var(--font-space-grotesk)',
                  color: 'transparent',
                  WebkitTextStroke: '2px var(--foreground)',
                  opacity: 0.6,
                }}
              >
                GHOSH
              </h1>
            </motion.div>

            {/* Rotating role */}
            <motion.div variants={FADE_UP}>
              <RotatingRoles />
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={FADE_UP}
              className="text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Building production-grade systems that scale. Passionate about distributed
              systems, real-time communication, and clean architecture.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={FADE_UP} className="flex flex-wrap gap-3">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--background)',
                  boxShadow: '0 0 20px var(--glow), 0 4px 16px rgba(0,0,0,0.3)',
                  fontFamily: 'var(--font-space-grotesk)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px var(--glow), 0 4px 24px rgba(0,0,0,0.4)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px var(--glow), 0 4px 16px rgba(0,0,0,0.3)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                View My Work
                <ExternalLink size={14} />
              </a>
              <a
                href="/resume/Souvik__Ghosh__Resume.pdf"
                download="Souvik_Ghosh_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                style={{
                  background: 'transparent',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  fontFamily: 'var(--font-space-grotesk)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,245,255,0.07)'
                  e.currentTarget.style.boxShadow = '0 0 20px var(--glow)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Download CV
                <Download size={14} />
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div variants={FADE_UP} className="flex items-center gap-4 pt-2">
              {social.map((link) => {
                const Icon = SOCIAL_ICONS[link.icon] || Github
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                    style={{
                      background: 'var(--muted)',
                      border: '1px solid var(--card-border)',
                      color: 'var(--muted-foreground)',
                    }}
                    aria-label={link.name}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent)'
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.boxShadow = '0 0 16px var(--glow)'
                      e.currentTarget.style.transform = 'translateY(-3px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--muted-foreground)'
                      e.currentTarget.style.borderColor = 'var(--card-border)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <Icon size={17} />
                    {/* Tooltip */}
                    <span
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                      style={{
                        background: 'var(--popover)',
                        color: 'var(--accent)',
                        border: '1px solid var(--card-border)',
                        fontFamily: 'var(--font-jetbrains)',
                      }}
                    >
                      {link.name}
                    </span>
                  </a>
                )
              })}
            </motion.div>
          </motion.div>

          {/* ===== RIGHT: PHOTO ===== */}
          <motion.div
            className="flex items-center justify-center relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 3.0, ease: 'easeOut' }}
          >
            <motion.div
              className="relative"
              style={{ x: springX, y: springY }}
            >
              {/* Outer glow ring */}
              <div
                className="absolute inset-[-16px] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)',
                  animation: 'photoGlow 3s ease-in-out infinite',
                }}
              />

              {/* Rotating decorative ring */}
              <motion.div
                className="absolute inset-[-32px] rounded-full pointer-events-none"
                style={{
                  border: '1px dashed var(--card-border)',
                  borderRadius: '50%',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

        

              {/* Photo container */}
              <div
                className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden"
                style={{
                  border: '3px solid var(--accent)',
                  boxShadow: '0 0 40px var(--glow), 0 0 80px var(--glow), 0 0 120px var(--glow-secondary)',
                }}
              >
                <Image
                  src={personal.photoUrl}
                  alt={`${personal.name} - ${personal.role}`}
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
                />
                {/* Gradient fade bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/3"
                  style={{
                    background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)',
                  }}
                />
              </div>


            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-2 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 1 }}
        >
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
          >
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: 'var(--accent)' }}
          >
            <ArrowDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
