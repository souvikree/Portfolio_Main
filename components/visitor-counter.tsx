'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, TrendingUp } from 'lucide-react'

interface Stats { total: number; weekly: number }

// Format numbers nicely: 1234 → "1.2k", 123456 → "123k"
function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000)    return `${Math.floor(n / 1000)}k`
  if (n >= 1_000)     return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

// Animated count-up for a single number
function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (value === 0) return
    const steps  = 40
    const dur    = 1200
    const step   = dur / steps
    let current  = 0
    const inc    = value / steps
    const id     = setInterval(() => {
      current += inc
      if (current >= value) { setDisplay(value); clearInterval(id) }
      else                  { setDisplay(Math.floor(current)) }
    }, step)
    return () => clearInterval(id)
  }, [value])

  return <span>{fmt(display)}</span>
}

export function VisitorCounter() {
  const [stats, setStats]     = useState<Stats | null>(null)
  const [loaded, setLoaded]   = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // POST to increment, then set stats from response
    fetch('/api/visitors', { method: 'POST' })
      .then((r) => r.json())
      .then((data: Stats) => { setStats(data); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  return (
    <AnimatePresence>
      {loaded && stats && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300"
          style={{
            background: hovered ? 'rgba(0,245,255,0.05)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${hovered ? 'rgba(0,245,255,0.2)' : 'var(--card-border)'}`,
            cursor: 'default',
          }}
        >
          {/* Weekly */}
          <div className="flex items-center gap-1.5">
            <TrendingUp size={11} style={{ color: '#00FF87' }} />
            <span className="text-[11px] font-bold"
              style={{ color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}>
              <CountUp value={stats.weekly} />
            </span>
            <span className="text-[10px]"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              this week
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-3" style={{ background: 'var(--card-border)' }} />

          {/* Total */}
          <div className="flex items-center gap-1.5">
            <Users size={11} style={{ color: 'var(--accent)' }} />
            <span className="text-[11px] font-bold"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              <CountUp value={stats.total} />
            </span>
            <span className="text-[10px]"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              total
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}