'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Deterministic — no SSR/client mismatch
const PARTICLE_DATA = [
  { radius: 110, angle:  0,  size: 3, speed: 0.00 },
  { radius: 130, angle: 18,  size: 2, speed: 0.02 },
  { radius: 95,  angle: 36,  size: 4, speed: 0.01 },
  { radius: 145, angle: 54,  size: 2, speed: 0.03 },
  { radius: 105, angle: 72,  size: 3, speed: 0.00 },
  { radius: 125, angle: 90,  size: 4, speed: 0.02 },
  { radius: 90,  angle: 108, size: 2, speed: 0.01 },
  { radius: 140, angle: 126, size: 3, speed: 0.03 },
  { radius: 115, angle: 144, size: 2, speed: 0.00 },
  { radius: 100, angle: 162, size: 4, speed: 0.02 },
  { radius: 135, angle: 180, size: 3, speed: 0.01 },
  { radius: 120, angle: 198, size: 2, speed: 0.00 },
  { radius: 150, angle: 216, size: 4, speed: 0.03 },
  { radius: 92,  angle: 234, size: 2, speed: 0.02 },
  { radius: 128, angle: 252, size: 3, speed: 0.01 },
  { radius: 108, angle: 270, size: 2, speed: 0.00 },
  { radius: 142, angle: 288, size: 4, speed: 0.03 },
  { radius: 98,  angle: 306, size: 3, speed: 0.02 },
  { radius: 118, angle: 324, size: 2, speed: 0.01 },
  { radius: 132, angle: 342, size: 4, speed: 0.00 },
]

const GRID_COLS = 16
const GRID_ROWS = 10

const CODE_SNIPPETS = [
  'const dev = new SouvikGhosh()',
  'await loadPortfolio()',
  'init → systems.online',
  'compiling experience...',
  'mounting components...',
  'deploying awesomeness...',
]

export function LoadingScreen() {
  const [mounted, setMounted]   = useState(false)
  const [visible, setVisible]   = useState(true)
  const [phase, setPhase]       = useState<'assemble' | 'hold' | 'explode'>('assemble')
  const [codeIdx, setCodeIdx]   = useState(0)
  const [percent, setPercent]   = useState(0)

  useEffect(() => {
    setMounted(true)

    // Cycle code snippets
    const codeTimer = setInterval(() => setCodeIdx((i) => (i + 1) % CODE_SNIPPETS.length), 420)

    // Progress counter
    let p = 0
    const progressTimer = setInterval(() => {
      p += Math.random() * 4 + 2
      if (p >= 100) { p = 100; clearInterval(progressTimer) }
      setPercent(Math.min(Math.round(p), 100))
    }, 25)

    const t1 = setTimeout(() => setPhase('hold'),    1400)
    const t2 = setTimeout(() => setPhase('explode'), 2200)
    const t3 = setTimeout(() => setVisible(false),   2700)

    return () => {
      clearInterval(codeTimer)
      clearInterval(progressTimer)
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
    }
  }, [])

  // Grid dots for background
  const gridDots = useMemo(() =>
    Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => i),
  [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
          style={{ background: '#050508' }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >

          {/* ── Animated grid background ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* ── Radial mask over grid ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, #050508 100%)',
            }}
          />

          {/* ── Ambient corner glows ── */}
          <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(123,47,255,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          {/* ── Spinning outer ring ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 360, height: 360,
              border: '1px solid rgba(0,245,255,0.12)',
              borderTopColor: 'var(--accent)',
              borderRightColor: 'rgba(123,47,255,0.6)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* ── Second ring (counter-spin) ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 300, height: 300,
              border: '1px dashed rgba(0,245,255,0.1)',
              borderBottomColor: 'rgba(255,45,120,0.5)',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />

          {/* ── Third ring ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 420, height: 420,
              border: '1px solid rgba(123,47,255,0.08)',
              borderLeftColor: 'rgba(123,47,255,0.4)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />

          {/* ── Orbiting particles ── */}
          {PARTICLE_DATA.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180
            const tx  = Math.cos(rad) * p.radius
            const ty  = Math.sin(rad) * p.radius
            const colors = ['var(--accent)', '#7B2FFF', '#FF2D78', '#00FF87', '#FFD166']
            const color  = colors[i % colors.length]
            return (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{ width: p.size, height: p.size, background: color, boxShadow: `0 0 ${p.size * 3}px ${color}` }}
                initial={{ x: tx * 2.5, y: ty * 2.5, opacity: 0, scale: 0 }}
                animate={
                  phase === 'assemble'
                    ? { x: tx, y: ty, opacity: 0.8, scale: 1 }
                    : phase === 'hold'
                    ? { x: tx, y: ty, opacity: 1, scale: 1.3 }
                    : { x: tx * 6, y: ty * 6, opacity: 0, scale: 0 }
                }
                transition={{ duration: 0.9, delay: i * 0.025, ease: [0.22, 1, 0.36, 1] }}
              />
            )
          })}

          {/* ── Central photo card ── */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.4, rotateY: -30 }}
            animate={
              phase === 'assemble'
                ? { opacity: 1, scale: 1,    rotateY: 0 }
                : phase === 'hold'
                ? { opacity: 1, scale: 1.06, rotateY: 0 }
                : { opacity: 0, scale: 1.8,  rotateY: 20 }
            }
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 800 }}
          >
            {/* Spinning conic gradient ring */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                inset: -4, borderRadius: 28,
                background: 'conic-gradient(var(--accent), #7B2FFF, #FF2D78, #00FF87, var(--accent))',
                zIndex: -1,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            {/* Glow halo */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: -16, borderRadius: 40,
                background: 'radial-gradient(circle, rgba(0,245,255,0.25) 0%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
            {/* Photo */}
            <div
              className="w-28 h-28 rounded-3xl overflow-hidden relative"
              style={{ background: '#0a0a12' }}
            >
              <Image
                src="/images/souvik.png"
                alt="Souvik Ghosh"
                width={112} height={112}
                className="w-full h-full object-cover object-top"
                priority
              />
              {/* Scan line overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,245,255,0.08) 50%, transparent 100%)',
                  backgroundSize: '100% 8px',
                }}
                animate={{ backgroundPositionY: ['0px', '112px'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>

          {/* ── Name + role tag ── */}
          <motion.div
            className="absolute z-10 flex flex-col items-center gap-1"
            style={{ top: 'calc(50% + 80px)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: phase === 'explode' ? 0 : 1, y: phase === 'explode' ? -10 : 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p
              className="text-2xl font-black tracking-tight"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
            >
              SOUVIK<span style={{ color: 'var(--accent)' }}> GHOSH</span>
            </p>
            <p
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
            >
              Software Engineer
            </p>
          </motion.div>

          {/* ── Bottom HUD ── */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-72"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase === 'explode' ? 0 : 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Cycling code text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={codeIdx}
                className="text-[11px] tracking-wider"
                style={{ color: 'rgba(0,245,255,0.55)', fontFamily: 'var(--font-jetbrains)' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {CODE_SNIPPETS[codeIdx]}
              </motion.p>
            </AnimatePresence>

            {/* Progress bar + percent */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--accent), #7B2FFF, #FF2D78)',
                    boxShadow: '0 0 10px var(--glow)',
                    width: `${percent}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span
                className="text-[11px] font-bold tabular-nums w-8 text-right"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
              >
                {percent}%
              </span>
            </div>

            {/* Corner brackets decoration */}
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[10px]" style={{ color: 'rgba(0,245,255,0.25)', fontFamily: 'var(--font-jetbrains)' }}>[ PORTFOLIO ]</span>
              <span className="text-[10px]" style={{ color: 'rgba(123,47,255,0.4)', fontFamily: 'var(--font-jetbrains)' }}>v2.0.26</span>
            </div>
          </motion.div>

          {/* ── Corner HUD decorations ── */}
          {[
            'top-4 left-4',
            'top-4 right-4',
            'bottom-4 left-4',
            'bottom-4 right-4',
          ].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-8 h-8 pointer-events-none`}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'explode' ? 0 : 0.4 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              style={{
                borderTop: i < 2 ? '2px solid var(--accent)' : 'none',
                borderBottom: i >= 2 ? '2px solid var(--accent)' : 'none',
                borderLeft: i % 2 === 0 ? '2px solid var(--accent)' : 'none',
                borderRight: i % 2 === 1 ? '2px solid var(--accent)' : 'none',
              }}
            />
          ))}

        </motion.div>
      )}
    </AnimatePresence>
  )
}