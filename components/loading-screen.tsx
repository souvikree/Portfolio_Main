'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Deterministic radii — no Math.random() so SSR and client produce identical markup
const PARTICLE_RADII = [
  58, 72, 61, 85, 54, 93, 67, 79, 50, 88,
  63, 76, 45, 95, 70, 82, 57, 91, 65, 78,
]

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState<'assemble' | 'hold' | 'explode'>('assemble')

  useEffect(() => {
    setMounted(true)
    const t1 = setTimeout(() => setPhase('hold'), 1200)
    const t2 = setTimeout(() => setPhase('explode'), 2000)
    const t3 = setTimeout(() => setVisible(false), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const PARTICLES = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        angle: (i / 20) * 360,
        radius: PARTICLE_RADII[i],
      })),
    [],
  )

  // Render nothing on the server — all motion values are client-only
  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ background: 'var(--background)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Particle field assembling into SG */}
          <div className="relative flex items-center justify-center">
            {/* Orbiting particles */}
            {PARTICLES.map((p) => {
              const rad = (p.angle * Math.PI) / 180
              const tx = Math.cos(rad) * p.radius
              const ty = Math.sin(rad) * p.radius
              return (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    background: 'var(--accent)',
                    boxShadow: '0 0 6px var(--glow)',
                  }}
                  initial={{ x: tx * 3, y: ty * 3, opacity: 0, scale: 0 }}
                  animate={
                    phase === 'assemble'
                      ? { x: tx * 0.3, y: ty * 0.3, opacity: 0.7, scale: 1 }
                      : phase === 'hold'
                      ? { x: tx * 0.3, y: ty * 0.3, opacity: 1, scale: 1.2 }
                      : { x: tx * 5, y: ty * 5, opacity: 0, scale: 0 }
                  }
                  transition={{ duration: 0.8, delay: p.id * 0.03, ease: 'easeOut' }}
                />
              )
            })}

            {/* SG monogram */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                phase === 'assemble'
                  ? { opacity: 1, scale: 1 }
                  : phase === 'hold'
                  ? { opacity: 1, scale: 1.05 }
                  : { opacity: 0, scale: 2 }
              }
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            >
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden border-2"
                style={{
                  borderColor: 'var(--accent)',
                  boxShadow: '0 0 30px var(--glow), 0 0 60px var(--glow)',
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
          </div>

          {/* Loading text */}
          <motion.p
            className="absolute bottom-16 text-sm tracking-[0.3em] uppercase"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'explode' ? 0 : 0.6 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Initializing...
          </motion.p>

          {/* Progress bar */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[2px]" style={{ background: 'var(--muted)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--glow)' }}
              initial={{ width: '0%' }}
              animate={{ width: phase === 'explode' ? '100%' : phase === 'hold' ? '80%' : '40%' }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}