'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { portfolioData } from '@/lib/portfolio-data'

// --- Text scramble hook ---
function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text)
  const chars = '!<>-_\\/[]{}—=+*^?#'
  useEffect(() => {
    if (!trigger) return
    let frame = 0
    let id: ReturnType<typeof setInterval>
    const total = text.length * 4
    id = setInterval(() => {
      frame++
      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' '
            if (frame >= i * 4 + 4) return ch
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      if (frame >= total) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [trigger, text])
  return display
}

// --- Counter ---
function Counter({ value, suffix, trigger }: { value: number; suffix?: string; trigger: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const duration = 1800
    const step = Math.ceil(duration / value)
    const id = setInterval(() => {
      start += Math.ceil(value / (duration / 30))
      if (start >= value) { setCount(value); clearInterval(id) }
      else setCount(start)
    }, 30)
    return () => clearInterval(id)
  }, [trigger, value])
  return (
    <span>
      {count}{suffix}
    </span>
  )
}

// --- Terminal animation ---
const TERMINAL_LINES = [
  { cmd: '> whoami', out: 'Souvik Ghosh — Software Engineer' },
  { cmd: '> cat interests.txt', out: 'Distributed Systems, Real-time Apps,\nClean Architecture, Open Source' },
  { cmd: '> status', out: 'Available for full-time roles ✓' },
]

function TerminalWindow({ trigger }: { trigger: boolean }) {
  const [lines, setLines] = useState<{ text: string; type: 'cmd' | 'out' }[]>([])

  useEffect(() => {
    if (!trigger) return
    let idx = 0
    let charIdx = 0
    let currentText = ''
    let phase: 'cmd' | 'out' = 'cmd'
    let timeout: ReturnType<typeof setTimeout>

    const type = () => {
      if (idx >= TERMINAL_LINES.length) return
      const { cmd, out } = TERMINAL_LINES[idx]
      const source = phase === 'cmd' ? cmd : out

      if (charIdx <= source.length) {
        currentText = source.slice(0, charIdx)
        setLines((prev) => {
          const next = [...prev]
          if (charIdx === 0) next.push({ text: currentText, type: phase })
          else next[next.length - 1] = { text: currentText, type: phase }
          return next
        })
        charIdx++
        timeout = setTimeout(type, phase === 'cmd' ? 60 : 30)
      } else {
        if (phase === 'cmd') {
          phase = 'out'
          charIdx = 0
          currentText = ''
          timeout = setTimeout(type, 200)
        } else {
          idx++
          phase = 'cmd'
          charIdx = 0
          currentText = ''
          timeout = setTimeout(type, 600)
        }
      }
    }

    timeout = setTimeout(type, 400)
    return () => clearTimeout(timeout)
  }, [trigger])

  return (
    <div className="terminal-window overflow-hidden rounded-xl">
      {/* Title bar */}
      <div className="terminal-header">
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
          <span key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
        ))}
        <span
          className="ml-2 text-xs"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
        >
          terminal — souvik
        </span>
      </div>
      <div className="p-4 min-h-[160px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className="text-sm leading-relaxed"
            style={{
              fontFamily: 'var(--font-jetbrains)',
              color: line.type === 'cmd' ? 'var(--accent)' : 'var(--foreground)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {line.text}
            {i === lines.length - 1 && (
              <motion.span
                className="inline-block w-2 h-4 ml-0.5 align-middle"
                style={{ background: 'var(--accent)' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutSection() {
  const { about } = portfolioData
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('WHO AM I', inView)

  const FADE_LEFT = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }
  const FADE_RIGHT = {
    hidden: { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 0.15 } },
  }

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Animated mesh gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 20% 60%, var(--glow-secondary) 0%, transparent 70%)',
          opacity: 0.35,
        }}
      />

      <div className="section-container relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
          >
            // about me
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              color: 'var(--foreground)',
              letterSpacing: '0.04em',
            }}
          >
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Terminal + SG Card */}
          <motion.div
            variants={FADE_LEFT}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            className="flex flex-col gap-6"
          >
            {/* SG Holographic Card */}
            <div
              className="glass-card p-8 flex items-center justify-center relative overflow-hidden"
              style={{ minHeight: '160px' }}
            >
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ perspective: '800px' }}
              >
                <div
                  className="w-24 h-24 rounded-2xl overflow-hidden border-2"
                  style={{
                    borderColor: 'var(--accent)',
                    boxShadow: '0 0 40px var(--glow)',
                  }}
                >
                  <Image
                    src="/images/souvik.png"
                    alt="Souvik Ghosh"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </motion.div>
              {/* Holographic shimmer */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, var(--glow) 50%, transparent 100%)',
                  opacity: 0.06,
                }}
              />
            </div>

            {/* Terminal */}
            <TerminalWindow trigger={inView} />
          </motion.div>

          {/* Right: About text + stats */}
          <motion.div
            variants={FADE_RIGHT}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            className="flex flex-col gap-6"
          >
            <div
              className="pl-5 flex flex-col gap-4"
              style={{ borderLeft: '2px solid var(--accent)', boxShadow: '-4px 0 20px var(--glow)' }}
            >
              <p className="text-base leading-relaxed" style={{ color: 'var(--foreground)' }}>
                {about.intro}
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {about.philosophy}
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {about.personal}
              </p>
            </div>

            {/* Stat counters */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              {about.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass-card p-5 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <div
                    className="text-3xl font-black mb-1"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    <Counter value={stat.value} suffix={stat.suffix} trigger={inView} />
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}