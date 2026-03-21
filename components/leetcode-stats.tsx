'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Trophy, TrendingUp, ExternalLink } from 'lucide-react'

interface LCStats {
  total:    number
  easy:     number
  medium:   number
  hard:     number
  ranking:  number
  username: string
  fallback?: boolean
}

function CountUp({ value, duration = 1400 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (value === 0) return
    const steps = 50
    const step  = duration / steps
    const inc   = value / steps
    let cur     = 0
    const id    = setInterval(() => {
      cur += inc
      if (cur >= value) { setDisplay(value); clearInterval(id) }
      else setDisplay(Math.floor(cur))
    }, step)
    return () => clearInterval(id)
  }, [value, duration])
  return <>{display}</>
}

function fmt(n: number) {
  if (n >= 100_000) return `${(n / 1000).toFixed(0)}k`
  if (n >= 10_000)  return `${(n / 1000).toFixed(1)}k`
  return n.toLocaleString()
}

const DIFF_CONFIG = [
  { key: 'easy',   label: 'Easy',   color: '#00FF87', bg: 'rgba(0,255,135,0.08)',  border: 'rgba(0,255,135,0.2)'  },
  { key: 'medium', label: 'Medium', color: '#FFD166', bg: 'rgba(255,209,102,0.08)', border: 'rgba(255,209,102,0.2)' },
  { key: 'hard',   label: 'Hard',   color: '#FF6B35', bg: 'rgba(255,107,53,0.08)',  border: 'rgba(255,107,53,0.2)'  },
] as const

export function LeetCodeStats() {
  const [stats, setStats]   = useState<LCStats | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError]   = useState(false)

  useEffect(() => {
    fetch('/api/leetcode')
      .then((r) => r.json())
      .then((d: LCStats) => { setStats(d); setLoaded(true) })
      .catch(() => { setError(true); setLoaded(true) })
  }, [])

  if (!loaded) {
    return (
      <div className="rounded-2xl p-5 animate-pulse"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', height: 180 }} />
    )
  }

  if (error || !stats) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}
      >
        {/* Top accent bar */}
        <div className="h-[3px] w-full"
          style={{ background: 'linear-gradient(90deg, #FFD700, #FF6B35, #FF2D78)' }} />

        {/* Inner glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,209,102,0.04), transparent 60%)' }} />

        <div className="p-5 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.25)' }}>
                <Code2 size={15} style={{ color: '#FFA116' }} />
              </div>
              <div>
                <p className="text-xs font-black" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                  LeetCode
                </p>
                <p className="text-[10px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                  @{stats.username}
                </p>
              </div>
            </div>
            <a
              href={`https://leetcode.com/u/${stats.username}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-semibold transition-all px-2 py-1 rounded-lg"
              style={{ color: '#FFA116', fontFamily: 'var(--font-jetbrains)', background: 'rgba(255,161,22,0.08)', border: '1px solid rgba(255,161,22,0.2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 10px rgba(255,161,22,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
            >
              Profile <ExternalLink size={9} />
            </a>
          </div>

          {/* Total solved — big number */}
          <div className="flex items-end gap-3 mb-4">
            <div>
              <div className="text-4xl font-black leading-none mb-0.5"
                style={{ color: '#FFA116', fontFamily: 'var(--font-space-grotesk)' }}>
                <CountUp value={stats.total} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                Problems Solved
              </p>
            </div>

            {/* Ranking */}
            {stats.ranking > 0 && (
              <div className="ml-auto flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <Trophy size={11} style={{ color: '#FFD166' }} />
                  <span className="text-sm font-black" style={{ color: '#FFD166', fontFamily: 'var(--font-space-grotesk)' }}>
                    #{fmt(stats.ranking)}
                  </span>
                </div>
                <p className="text-[9px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                  Global Rank
                </p>
              </div>
            )}
          </div>

          {/* Difficulty breakdown */}
          <div className="grid grid-cols-3 gap-2">
            {DIFF_CONFIG.map(({ key, label, color, bg, border }, i) => (
              <motion.div
                key={key}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl"
                style={{ background: bg, border: `1px solid ${border}` }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <span className="text-lg font-black leading-none"
                  style={{ color, fontFamily: 'var(--font-space-grotesk)' }}>
                  <CountUp value={stats[key]} duration={1200 + i * 100} />
                </span>
                <span className="text-[9px] font-bold"
                  style={{ color, fontFamily: 'var(--font-jetbrains)', opacity: 0.8 }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Difficulty bar */}
          {stats.total > 0 && (
            <div className="mt-3 h-1.5 rounded-full overflow-hidden flex" style={{ background: 'var(--muted)' }}>
              <motion.div
                style={{ background: '#00FF87', height: '100%' }}
                initial={{ width: 0 }}
                animate={{ width: `${(stats.easy / stats.total) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.div
                style={{ background: '#FFD166', height: '100%' }}
                initial={{ width: 0 }}
                animate={{ width: `${(stats.medium / stats.total) * 100}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
              <motion.div
                style={{ background: '#FF6B35', height: '100%' }}
                initial={{ width: 0 }}
                animate={{ width: `${(stats.hard / stats.total) * 100}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
          )}

          {stats.fallback && (
            <p className="text-[9px] mt-2 text-center"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.5 }}>
              showing cached data
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}