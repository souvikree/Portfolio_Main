'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { portfolioData } from '@/lib/portfolio-data'
import { MapPin, Mail, Coffee, Zap } from 'lucide-react'

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

// --- Counter ---
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

// --- Terminal ---
const TERMINAL_LINES = [
  { cmd: '> whoami',           out: 'Souvik Ghosh — Software Engineer' },
  { cmd: '> cat interests.txt', out: 'Distributed Systems, Real-time Apps,\nClean Architecture, Open Source' },
  { cmd: '> status',           out: 'Available for full-time roles ✓' },
]

function TerminalWindow({ trigger }: { trigger: boolean }) {
  const [lines, setLines] = useState<{ text: string; type: 'cmd' | 'out' }[]>([])
  const activeRef = useRef(false)

  useEffect(() => {
    if (!trigger) return

    let idx = 0, charIdx = 0, currentText = ''
    let phase: 'cmd' | 'out' = 'cmd'
    let timeoutId: ReturnType<typeof setTimeout>
    activeRef.current = true

    const type = () => {
      if (!activeRef.current) return

      if (idx >= TERMINAL_LINES.length) {
        timeoutId = setTimeout(() => {
          if (!activeRef.current) return
          setLines([])
          idx = 0
          charIdx = 0
          currentText = ''
          phase = 'cmd'
          timeoutId = setTimeout(type, 150)
        }, 1800)
        return
      }

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
        timeoutId = setTimeout(type, phase === 'cmd' ? 60 : 28)
      } else {
        if (phase === 'cmd') {
          phase = 'out'
          charIdx = 0
          currentText = ''
          timeoutId = setTimeout(type, 200)
        } else {
          idx++
          phase = 'cmd'
          charIdx = 0
          currentText = ''
          timeoutId = setTimeout(type, 600)
        }
      }
    }

    timeoutId = setTimeout(type, 400)

    return () => {
      activeRef.current = false
      clearTimeout(timeoutId)
    }
  }, [trigger])

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--card-border)' }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--card-border)' }}>
        {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
          <span key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-2 text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
          terminal — souvik@portfolio
        </span>
        {/* <span className="ml-auto text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(0,255,135,0.1)', color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}>
          ● live
        </span> */}
      </div>
      <div className="p-4 min-h-[170px]">
        {lines.map((line, i) => (
          <div key={i} className="text-sm leading-relaxed" style={{
            fontFamily: 'var(--font-jetbrains)',
            color: line.type === 'cmd' ? 'var(--accent)' : 'var(--foreground)',
            whiteSpace: 'pre-wrap',
          }}>
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

// --- Quick info chips ---
const INFO_CHIPS = [
  { icon: MapPin,  label: 'Kolkata, India' },
  { icon: Mail,    label: 'souvikg3225@gmail.com' },
  { icon: Coffee,  label: 'Open to Collaborate' },
  { icon: Zap,     label: 'B.Tech CSBS @ HITK' },
]

export function AboutSection() {
  const { about } = portfolioData
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('WHO AM I', inView)

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 20% 60%, var(--glow-secondary) 0%, transparent 70%)', opacity: 0.3 }} />
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.08 }} />

      <div className="section-container relative z-10">

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
            // about me
          </p>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)', letterSpacing: '0.04em' }}>
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* ── Main two-column layout ── */}
        <div className="grid lg:grid-cols-[420px_1fr] gap-10 lg:gap-14 items-start">

          {/* ══ LEFT COLUMN ══ */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col gap-5"
          >
            {/* Photo card */}
            <div
              className="relative rounded-2xl overflow-hidden group"
              style={{ border: '1px solid var(--card-border)', background: 'var(--muted)' }}
            >
              {/* Spinning conic ring overlay at top edge */}
              <motion.div
                className="absolute inset-[-2px] rounded-2xl pointer-events-none z-10"
                style={{
                  background: 'conic-gradient(var(--accent), var(--accent-secondary), var(--highlight), var(--accent))',
                  opacity: 0,
                  transition: 'opacity 0.4s',
                }}
                whileHover={{ opacity: 0.6 }}
              />

              <div className="relative flex items-center gap-5 p-5">
                {/* Photo */}
                <div className="relative flex-shrink-0">
                  {/* Animated ring */}
                  <motion.div
                    className="absolute inset-[-3px] rounded-2xl pointer-events-none"
                    style={{ background: 'conic-gradient(var(--accent), #7B2FFF, #FF2D78, var(--accent))' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden" style={{ background: 'var(--background)' }}>
                    <Image
                      src="/images/souvik.png"
                      alt="Souvik Ghosh"
                      width={80} height={80}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Name + role */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-black" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                    Souvik Ghosh
                  </h3>
                  <p className="text-xs font-semibold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                    &lt;Software Engineer /&gt;
                  </p>
                  {/* Available dot */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <motion.span
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#00FF87', boxShadow: '0 0 6px #00FF87' }}
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <span className="text-[10px] font-medium" style={{ color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}>
                      Available for opportunities
                    </span>
                  </div>
                </div>
              </div>

              {/* Info chips row */}
              <div className="grid grid-cols-2 gap-px" style={{ borderTop: '1px solid var(--card-border)' }}>
                {INFO_CHIPS.map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 px-4 py-3"
                    style={{
                      background: 'rgba(255,255,255,0.015)',
                      borderRight: i % 2 === 0 ? '1px solid var(--card-border)' : 'none',
                      borderBottom: i < 2 ? '1px solid var(--card-border)' : 'none',
                    }}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.08 }}
                  >
                    <Icon size={11} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span className="text-[10px] font-medium truncate" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Terminal */}
            <TerminalWindow trigger={inView} />
          </motion.div>

          {/* ══ RIGHT COLUMN ══ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="flex flex-col gap-7"
          >
            {/* About text with glowing left border */}
            <div
              className="rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--card-border)',
                borderLeft: '3px solid var(--accent)',
                boxShadow: '-6px 0 24px var(--glow)',
              }}
            >
              {/* Subtle corner label */}
              <span
                className="absolute top-3 right-3 text-[10px] tracking-widest uppercase"
                style={{ color: 'var(--accent)', opacity: 0.35, fontFamily: 'var(--font-jetbrains)' }}
              >
                bio.txt
              </span>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--foreground)' }}>
                {about.intro}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {about.philosophy}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {about.personal}
              </p>
            </div>

            {/* Stat counters */}
            <div className="grid grid-cols-2 gap-4">
              {about.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="relative rounded-xl p-5 text-center overflow-hidden group"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--card-border)',
                  }}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
                  whileHover={{ borderColor: 'var(--accent)', boxShadow: '0 0 20px var(--glow)' }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 50%, var(--glow) 0%, transparent 70%)', opacity: 0.05 }}
                  />
                  <div
                    className="text-3xl font-black mb-1"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    <Counter value={stat.value} suffix={stat.suffix} trigger={inView} />
                  </div>
                  <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
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