'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const [dotY, setDotY] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setVisible(v > 0.01)
      // dot position: top of line + progress * line height
      const lineTop    = 80   // px offset from top (below navbar)
      const lineHeight = window.innerHeight - 80 - 40
      setDotY(lineTop + v * lineHeight)
    })
  }, [scrollYProgress])

  return (
    <div
      className="fixed left-0 top-0 bottom-0 z-40 pointer-events-none"
      style={{ width: 3 }}
    >
      {/* Track — always visible, very faint */}
      <div
        className="absolute"
        style={{
          top: 80,
          bottom: 40,
          left: 0,
          width: 2,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 2,
        }}
      />

      {/* Fill — scales from top */}
      <motion.div
        className="absolute left-0"
        style={{
          top: 80,
          bottom: 40,
          width: 2,
          borderRadius: 2,
          background: 'linear-gradient(to bottom, var(--accent), var(--accent-secondary))',
          transformOrigin: 'top',
          scaleY,
          boxShadow: '0 0 6px var(--glow)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Travelling dot */}
      <motion.div
        className="absolute"
        style={{
          left: -3,
          top: dotY - 4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 10px var(--glow), 0 0 20px var(--glow)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  )
}