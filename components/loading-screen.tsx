'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// ── Deterministic node positions for neural network ───────────────────────────
const NODES = [
  { x: 12,  y: 18  }, { x: 25,  y: 8   }, { x: 42,  y: 14  }, { x: 58,  y: 7   },
  { x: 73,  y: 15  }, { x: 88,  y: 10  }, { x: 8,   y: 38  }, { x: 20,  y: 52  },
  { x: 35,  y: 44  }, { x: 65,  y: 42  }, { x: 80,  y: 50  }, { x: 94,  y: 36  },
  { x: 15,  y: 68  }, { x: 28,  y: 80  }, { x: 44,  y: 72  }, { x: 56,  y: 78  },
  { x: 72,  y: 70  }, { x: 86,  y: 76  }, { x: 6,   y: 85  }, { x: 92,  y: 88  },
]

const CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[6,7],[7,8],[8,9],[9,10],[10,11],
  [12,13],[13,14],[14,15],[15,16],[16,17],[18,12],[19,17],
  [0,6],[1,7],[2,8],[4,10],[5,11],[7,13],[8,14],[9,15],[10,16],[11,17],
]

const CODE_SNIPPETS = [
  'initializing neural core...',
  'loading experience.json',
  'compiling skill matrix...',
  'mounting portfolio v2.0',
  'connecting to servers...',
  'boot sequence complete.',
]

const HEX_CHARS = '0123456789ABCDEF'
const DATA_COLUMNS = 8

// ── Segmented progress bar ────────────────────────────────────────────────────
function SegmentBar({ percent, color }: { percent: number; color: string }) {
  const total = 20
  const filled = Math.round((percent / 100) * total)
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i}
          style={{
            width: 8, height: 14, borderRadius: 2,
            background: i < filled ? color : 'rgba(255,255,255,0.06)',
            boxShadow: i < filled ? `0 0 8px ${color}88` : 'none',
          }}
          animate={{ opacity: i < filled ? 1 : 0.4, scaleY: i < filled ? 1 : 0.6 }}
          transition={{ duration: 0.15, delay: i < filled ? (i - filled + 1) * 0.02 : 0 }}
        />
      ))}
    </div>
  )
}

// ── Data stream column ────────────────────────────────────────────────────────
function DataStream({ x, delay, speed }: { x: string; delay: number; speed: number }) {
  const [chars, setChars] = useState<string[]>([])
  useEffect(() => {
    const gen = () => Array.from({ length: 18 }, () => HEX_CHARS[Math.floor(Math.random() * 16)])
    setChars(gen())
    const id = setInterval(() => setChars(gen()), speed)
    return () => clearInterval(id)
  }, [speed])

  return (
    <div className="absolute top-0 bottom-0 flex flex-col gap-0 pointer-events-none select-none overflow-hidden"
      style={{ left: x, width: 14 }}>
      {chars.map((c, i) => (
        <motion.span key={i} style={{
          fontSize: 9, lineHeight: '1.6', fontFamily: 'var(--font-jetbrains)',
          color: `rgba(0,245,255,${0.03 + (i / chars.length) * 0.18})`,
          display: 'block', textAlign: 'center',
        }}>
          {c}
        </motion.span>
      ))}
    </div>
  )
}

// ── Glitch letter ─────────────────────────────────────────────────────────────
function GlitchLetter({ char, delay, color }: { char: string; delay: number; color: string }) {
  const [phase, setPhase] = useState<'hidden' | 'glitch' | 'stable'>('hidden')
  const [glitchChar, setGlitchChar] = useState(char)
  const GLITCH = '!@#$%^&*<>[]{}?/\\|'

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('glitch')
      let count = 0
      const id = setInterval(() => {
        setGlitchChar(GLITCH[Math.floor(Math.random() * GLITCH.length)])
        count++
        if (count > 6) {
          clearInterval(id)
          setGlitchChar(char)
          setPhase('stable')
        }
      }, 55)
    }, delay)
    return () => clearTimeout(t1)
  }, [char, delay])

  return (
    <motion.span
      style={{
        display: 'inline-block',
        color: phase === 'stable' ? 'var(--foreground)' : phase === 'glitch' ? color : 'transparent',
        fontFamily: 'var(--font-space-grotesk)',
        fontWeight: 900,
        fontSize: 'clamp(2rem, 6vw, 3.5rem)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        textShadow: phase === 'stable' ? `0 0 30px ${color}30` : phase === 'glitch' ? `0 0 20px ${color}` : 'none',
        transition: 'color 0.1s',
        minWidth: char === ' ' ? '0.4em' : 'auto',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'hidden' ? 0 : 1 }}
      transition={{ duration: 0.05 }}
    >
      {phase === 'glitch' ? glitchChar : char}
    </motion.span>
  )
}

// ── Neural network SVG ────────────────────────────────────────────────────────
function NeuralNet({ visible }: { visible: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.35 }}>
      {/* Connection lines */}
      {CONNECTIONS.map(([a, b], i) => {
        const n1 = NODES[a], n2 = NODES[b]
        return (
          <motion.line key={i}
            x1={`${n1.x}%`} y1={`${n1.y}%`}
            x2={`${n2.x}%`} y2={`${n2.y}%`}
            stroke="rgba(0,245,255,0.25)" strokeWidth="0.5"
            strokeDasharray="100" strokeDashoffset="100"
            animate={visible ? { strokeDashoffset: 0 } : { strokeDashoffset: 100 }}
            transition={{ duration: 0.6, delay: 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          />
        )
      })}
      {/* Nodes */}
      {NODES.map((n, i) => (
        <motion.circle key={i}
          cx={`${n.x}%`} cy={`${n.y}%`} r="2.5"
          fill="rgba(0,245,255,0.6)"
          filter="url(#nodeGlow)"
          initial={{ opacity: 0, r: 0 }}
          animate={visible ? { opacity: 1, r: 2.5 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.045 }}
        />
      ))}
      <defs>
        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
    </svg>
  )
}

// ── Scan beam ─────────────────────────────────────────────────────────────────
function ScanBeam() {
  return (
    <motion.div className="absolute left-0 right-0 pointer-events-none"
      style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.5), transparent)', boxShadow: '0 0 20px rgba(0,245,255,0.4)' }}
      animate={{ top: ['0%', '100%', '0%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// ── Section divider lines ─────────────────────────────────────────────────────
function HUDLines({ phase }: { phase: string }) {
  const opacity = phase === 'explode' ? 0 : 1
  return (
    <>
      {/* Horizontal center lines */}
      <motion.div className="absolute left-0 right-0 pointer-events-none"
        style={{ top: '50%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.08), rgba(0,245,255,0.15), rgba(0,245,255,0.08), transparent)' }}
        animate={{ opacity, scaleX: phase === 'assemble' ? [0, 1] : 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      {/* Vertical center line */}
      <motion.div className="absolute top-0 bottom-0 pointer-events-none"
        style={{ left: '50%', width: 1, background: 'linear-gradient(180deg, transparent, rgba(0,245,255,0.08), rgba(0,245,255,0.15), rgba(0,245,255,0.08), transparent)' }}
        animate={{ opacity, scaleY: phase === 'assemble' ? [0, 1] : 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
    </>
  )
}

// ── Main loading screen ───────────────────────────────────────────────────────
export function LoadingScreen() {
  const [mounted, setMounted]   = useState(false)
  const [visible, setVisible]   = useState(true)
  const [phase, setPhase]       = useState<'assemble' | 'hold' | 'explode'>('assemble')
  const [codeIdx, setCodeIdx]   = useState(0)
  const [percent, setPercent]   = useState(0)
  const [netVisible, setNetVisible] = useState(false)

  const dataColumns = useMemo(() => Array.from({ length: DATA_COLUMNS }, (_, i) => ({
    x: `${4 + i * 13}%`,
    delay: i * 0.08,
    speed: 80 + i * 20,
  })), [])

  useEffect(() => {
    setMounted(true)
    setTimeout(() => setNetVisible(true), 100)

    const codeTimer = setInterval(() => setCodeIdx(i => (i + 1) % CODE_SNIPPETS.length), 380)

    let p = 0
    const progressTimer = setInterval(() => {
      p += Math.random() * 4.5 + 1.5
      if (p >= 100) { p = 100; clearInterval(progressTimer) }
      setPercent(Math.min(Math.round(p), 100))
    }, 22)

    const t1 = setTimeout(() => setPhase('hold'),    1600)
    const t2 = setTimeout(() => setPhase('explode'), 2400)
    const t3 = setTimeout(() => setVisible(false),   2900)

    return () => {
      clearInterval(codeTimer)
      clearInterval(progressTimer)
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
    }
  }, [])

  const nameChars = 'SOUVIK GHOSH'.split('')
  const accentStart = nameChars.indexOf(' ') + 1 // "GHOSH" in accent

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
          style={{ background: '#050508' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Neural network background */}
          <NeuralNet visible={netVisible} />

          {/* Data streams — sides only */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
            {dataColumns.slice(0, 4).map((col, i) => (
              <DataStream key={`l${i}`} x={col.x} delay={col.delay} speed={col.speed} />
            ))}
            {dataColumns.slice(4).map((col, i) => (
              <DataStream key={`r${i}`} x={`${62 + i * 10}%`} delay={col.delay} speed={col.speed} />
            ))}
          </div>

          {/* Scan beam */}
          {phase !== 'explode' && <ScanBeam />}

          {/* HUD crosshair lines */}
          <HUDLines phase={phase} />

          {/* Ambient glows */}
          <motion.div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(123,47,255,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
            animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
            animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 5, repeat: Infinity, delay: 1.5 }} />

          {/* Spinning rings */}
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: 380, height: 380, border: '1px solid rgba(0,245,255,0.08)', borderTopColor: 'rgba(0,245,255,0.5)', borderRightColor: 'rgba(123,47,255,0.4)' }}
            animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: 310, height: 310, border: '1px dashed rgba(123,47,255,0.12)', borderBottomColor: 'rgba(255,45,120,0.4)' }}
            animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: 450, height: 450, border: '1px solid rgba(0,245,255,0.04)', borderLeftColor: 'rgba(0,245,255,0.25)' }}
            animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />

          {/* Orbiting accent dots */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const r = 175
            const rad = (angle * Math.PI) / 180
            const colors = ['var(--accent)', '#7B2FFF', '#FF2D78', '#00FF87', '#FFD166', 'var(--accent)']
            return (
              <motion.div key={i}
                className="absolute rounded-full pointer-events-none"
                style={{ width: 4, height: 4, background: colors[i], boxShadow: `0 0 10px ${colors[i]}` }}
                animate={
                  phase === 'explode'
                    ? { x: Math.cos(rad) * 800, y: Math.sin(rad) * 800, opacity: 0, scale: 0 }
                    : {
                        x: Math.cos(rad) * r,
                        y: Math.sin(rad) * r,
                        opacity: phase === 'hold' ? 1 : 0.7,
                        scale: phase === 'hold' ? 1.5 : 1,
                      }
                }
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                transition={{ duration: phase === 'explode' ? 0.5 : 0.8, delay: phase === 'explode' ? i * 0.04 : 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            )
          })}

          {/* ── Center: Photo + Name ── */}
          <motion.div className="relative z-10 flex flex-col items-center gap-5"
            animate={phase === 'explode' ? { scale: 0.5, opacity: 0, filter: 'blur(20px)' } : { scale: phase === 'hold' ? 1.04 : 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Photo with conic ring */}
            <div className="relative">
              {/* Outer conic ring */}
              <motion.div className="absolute pointer-events-none"
                style={{ inset: -5, borderRadius: 30, background: 'conic-gradient(var(--accent), #7B2FFF, #FF2D78, #00FF87, var(--accent))', zIndex: -1 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
              {/* Glow halo */}
              <div className="absolute pointer-events-none"
                style={{ inset: -20, borderRadius: 44, background: 'radial-gradient(circle, rgba(0,245,255,0.2) 0%, transparent 70%)', filter: 'blur(10px)' }} />
              {/* Photo */}
              <div className="w-28 h-28 rounded-3xl overflow-hidden relative" style={{ background: '#0a0a12' }}>
                <Image src="/images/souvik-nobg.webp" alt="Souvik Ghosh"
                  width={112} height={112} className="w-full h-full object-cover object-top" priority />
                {/* Holographic scan */}
                <motion.div className="absolute inset-x-0 pointer-events-none"
                  style={{ height: 40, background: 'linear-gradient(to bottom, transparent, rgba(0,245,255,0.12), transparent)' }}
                  animate={{ top: ['-40px', '150px'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
                />
              </div>
              {/* Corner brackets */}
              {[
                { top: -2, left: -2, path: 'M16 0 H0 V16' },
                { top: -2, right: -2, path: 'M0 0 H16 V16' },
                { bottom: -2, left: -2, path: 'M16 16 H0 V0' },
                { bottom: -2, right: -2, path: 'M0 16 H16 V0' },
              ].map((b, i) => (
                <motion.svg key={i} width={16} height={16}
                  className="absolute pointer-events-none"
                  style={{ top: b.top, bottom: b.bottom, left: b.left, right: b.right }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase === 'explode' ? 0 : 0.7 }}
                  transition={{ delay: 0.5 + i * 0.1 }}>
                  <path d={b.path} stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
                </motion.svg>
              ))}
            </div>

            {/* Glitch name reveal */}
            <div className="flex items-center gap-0 flex-wrap justify-center">
              {nameChars.map((ch, i) => (
                <GlitchLetter
                  key={i} char={ch}
                  delay={300 + i * 80}
                  color={i >= accentStart ? 'var(--accent)' : '#7B2FFF'}
                />
              ))}
            </div>

            {/* Role tag */}
            <motion.div className="flex items-center gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: phase === 'explode' ? 0 : 1 }}
              transition={{ delay: 1.4 }}>
              <div className="h-px w-8" style={{ background: 'var(--accent)', opacity: 0.5 }} />
              <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', letterSpacing: '0.3em', opacity: 0.7 }}>
                SOFTWARE ENGINEER
              </span>
              <div className="h-px w-8" style={{ background: 'var(--accent)', opacity: 0.5 }} />
            </motion.div>
          </motion.div>

          {/* ── Bottom HUD ── */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase === 'explode' ? 0 : 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Code text */}
            <AnimatePresence mode="wait">
              <motion.div key={codeIdx}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.18 }}>
                <motion.span style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)', fontSize: 10 }}
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  ▶
                </motion.span>
                <span style={{ color: 'rgba(0,245,255,0.55)', fontFamily: 'var(--font-jetbrains)', fontSize: 10, letterSpacing: '0.05em' }}>
                  {CODE_SNIPPETS[codeIdx]}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Segmented bar + percent */}
            <div className="flex items-center gap-3 w-full">
              <SegmentBar percent={percent} color="var(--accent)" />
              <span style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', fontWeight: 700, minWidth: 32, textAlign: 'right', tabularNums: true } as React.CSSProperties}>
                {percent}%
              </span>
            </div>

            {/* Bottom meta */}
            <div className="flex items-center justify-between w-full">
              <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'rgba(0,245,255,0.2)', letterSpacing: '0.15em' }}>
                [ PORTFOLIO ]
              </span>
              <div className="flex items-center gap-1.5">
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FF87', boxShadow: '0 0 5px #00FF87' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }} />
                <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: '#00FF87', opacity: 0.6 }}>ONLINE</span>
              </div>
              <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'rgba(123,47,255,0.4)', letterSpacing: '0.1em' }}>
                v2.0.26
              </span>
            </div>
          </motion.div>

          {/* ── Corner HUD brackets ── */}
          {[
            { pos: 'top-4 left-4',     bt: true,  bb: false, bl: true,  br: false },
            { pos: 'top-4 right-4',    bt: true,  bb: false, bl: false, br: true  },
            { pos: 'bottom-4 left-4',  bt: false, bb: true,  bl: true,  br: false },
            { pos: 'bottom-4 right-4', bt: false, bb: true,  bl: false, br: true  },
          ].map(({ pos, bt, bb, bl, br }, i) => (
            <motion.div key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none`}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'explode' ? 0 : 0.45 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              style={{
                borderTop:    bt ? '1.5px solid var(--accent)' : 'none',
                borderBottom: bb ? '1.5px solid var(--accent)' : 'none',
                borderLeft:   bl ? '1.5px solid var(--accent)' : 'none',
                borderRight:  br ? '1.5px solid var(--accent)' : 'none',
              }}
            />
          ))}

          {/* ── Side labels ── */}
          <motion.div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: phase === 'explode' ? 0 : 0.25 }}
            transition={{ delay: 1 }}
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'translateY(-50%) rotate(180deg)', fontSize: 8, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', letterSpacing: '0.25em' }}>
            INITIALIZING SYSTEMS
          </motion.div>
          <motion.div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: phase === 'explode' ? 0 : 0.25 }}
            transition={{ delay: 1.1 }}
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: 8, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', letterSpacing: '0.25em' }}>
            SOUVIK · PORTFOLIO
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}