'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { GitPullRequest, Star, Users, GitFork, ExternalLink } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface ContributionDay {
  date: string
  contributionCount: number
  weekday: number
}

interface Week {
  contributionDays: ContributionDay[]
}

interface TopRepo {
  name: string
  stargazerCount: number
  forkCount: number
  primaryLanguage: { name: string; color: string } | null
  url: string
}

interface GitHubData {
  totalContributions: number
  weeks: Week[]
  followers: number
  following: number
  pullRequests: number
  topRepos: TopRepo[]
}

// ── Colour scale ──────────────────────────────────────────────────────────────
function getColor(count: number, max: number): string {
  if (count === 0) return 'var(--gh-empty)'
  const ratio = Math.min(count / Math.max(max * 0.7, 1), 1)
  if (ratio < 0.25) return 'var(--gh-l1)'
  if (ratio < 0.5)  return 'var(--gh-l2)'
  if (ratio < 0.75) return 'var(--gh-l3)'
  return 'var(--gh-l4)'
}

function getOpacity(count: number, max: number): number {
  if (count === 0) return 1
  return 0.55 + 0.45 * Math.min(count / Math.max(max * 0.7, 1), 1)
}

// ── Month labels ──────────────────────────────────────────────────────────────
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getMonthLabels(weeks: Week[]): { label: string; index: number }[] {
  const labels: { label: string; index: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, i) => {
    const day = week.contributionDays[0]
    if (!day) return
    const month = new Date(day.date).getMonth()
    if (month !== lastMonth) {
      labels.push({ label: MONTH_NAMES[month], index: i })
      lastMonth = month
    }
  })
  return labels
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
interface TooltipState {
  x: number
  y: number
  day: ContributionDay
  visible: boolean
}

// ── Main component ────────────────────────────────────────────────────────────
export function GitHubActivity() {
  const [data, setData]       = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    fetch('/api/github')
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (inView && data) setTimeout(() => setRevealed(true), 150)
  }, [inView, data])

  // Compute max for colour scale
  const maxCount = data
    ? Math.max(...data.weeks.flatMap(w => w.contributionDays.map(d => d.contributionCount)), 1)
    : 1

  const monthLabels = data ? getMonthLabels(data.weeks) : []

  // Day-of-week labels
  const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', '']

  return (
    <div ref={ref}>
      {/* CSS vars for the colour scale */}
      <style>{`
        :root {
          --gh-empty: rgba(255,255,255,0.04);
          --gh-l1: #0e4429;
          --gh-l2: #006d32;
          --gh-l3: #26a641;
          --gh-l4: #39d353;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.02)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.015)' }}>
          <div className="flex items-center gap-2.5">
            {/* GitHub icon SVG */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" style={{ color: 'var(--accent)' }}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.7 }}>
              GitHub Activity
            </span>
          </div>
          {data && (
            <span className="text-xs font-bold tabular-nums"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              {data.totalContributions.toLocaleString()} contributions this year
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col gap-5">

          {/* ── Graph ── */}
          {loading && (
            <div className="flex items-center justify-center py-10">
              <motion.div className="flex gap-1.5"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}>
                {[0,1,2,3].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--accent)' }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }} />
                ))}
              </motion.div>
            </div>
          )}

          {error && (
            <div className="py-8 text-center text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              // could not reach GitHub API
            </div>
          )}

          {data && (
            <div className="relative">
              {/* Month labels */}
              <div className="flex mb-2 pl-7 overflow-hidden">
                {monthLabels.map(({ label, index }) => (
                  <div key={label + index}
                    className="absolute text-[9px]"
                    style={{
                      left: `${28 + index * 13}px`,
                      color: 'var(--muted-foreground)',
                      fontFamily: 'var(--font-jetbrains)',
                      opacity: 0.55,
                    }}>
                    {label}
                  </div>
                ))}
                <div className="h-4" />
              </div>

              {/* Grid */}
              <div className="flex gap-0.5 mt-5 relative">
                {/* Day-of-week labels */}
                <div className="flex flex-col gap-0.5 mr-1.5 flex-shrink-0">
                  {DAY_LABELS.map((d, i) => (
                    <div key={i} className="h-[11px] flex items-center">
                      <span className="text-[9px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.5 }}>
                        {d}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                {data.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.contributionDays.map((day, di) => {
                      const color   = getColor(day.contributionCount, maxCount)
                      const opacity = getOpacity(day.contributionCount, maxCount)
                      const isHover = hoveredDay === day.date
                      const delay   = revealed ? (wi * 7 + di) * 4 : 9999

                      return (
                        <motion.div
                          key={day.date}
                          className="w-[11px] h-[11px] rounded-[2px] cursor-pointer relative"
                          style={{
                            background: color,
                            opacity: isHover ? 1 : opacity,
                            outline: isHover ? '1px solid var(--accent)' : 'none',
                            outlineOffset: '1px',
                            transition: 'outline 0.15s, transform 0.15s',
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={revealed ? { opacity, scale: 1 } : {}}
                          transition={{ duration: 0.25, delay: Math.min(delay / 1000, 1.2) }}
                          onMouseEnter={e => {
                            setHoveredDay(day.date)
                            const rect = (e.target as HTMLElement).getBoundingClientRect()
                            const parent = ref.current?.getBoundingClientRect()
                            setTooltip({
                              x: rect.left - (parent?.left ?? 0) + 6,
                              y: rect.top  - (parent?.top ?? 0) - 36,
                              day,
                              visible: true,
                            })
                          }}
                          onMouseLeave={() => {
                            setHoveredDay(null)
                            setTooltip(null)
                          }}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Tooltip */}
              {tooltip && tooltip.visible && (
                <div
                  className="absolute pointer-events-none z-50 px-2.5 py-1.5 rounded-lg text-[10px] whitespace-nowrap"
                  style={{
                    left: tooltip.x,
                    top: tooltip.y,
                    background: 'rgba(0,0,0,0.85)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-jetbrains)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                    {tooltip.day.contributionCount} contribution{tooltip.day.contributionCount !== 1 ? 's' : ''}
                  </span>
                  <span style={{ color: 'var(--muted-foreground)' }}>
                    {' on '}{new Date(tooltip.day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center gap-1.5 mt-3 justify-end">
                <span className="text-[9px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.5 }}>Less</span>
                {['var(--gh-empty)','var(--gh-l1)','var(--gh-l2)','var(--gh-l3)','var(--gh-l4)'].map((c, i) => (
                  <div key={i} className="w-[11px] h-[11px] rounded-[2px]" style={{ background: c }} />
                ))}
                <span className="text-[9px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.5 }}>More</span>
              </div>
            </div>
          )}

          {/* ── Quick stats ── */}
          {data && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Users,          value: data.followers,    label: 'Followers' },
                { icon: GitPullRequest, value: data.pullRequests, label: 'Merged PRs' },
                { icon: Star,           value: data.topRepos.reduce((a,r) => a + r.stargazerCount, 0), label: 'Total Stars' },
              ].map(({ icon: Icon, value, label }, i) => (
                <motion.div key={label}
                  className="flex flex-col items-center gap-1 py-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ borderColor: 'var(--accent)', boxShadow: '0 0 12px var(--glow)' }}>
                  <Icon size={12} style={{ color: 'var(--accent)' }} />
                  <span className="text-lg font-black tabular-nums"
                    style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                    {value}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Top repos ──
          {data && data.topRepos.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[9px] uppercase tracking-[0.25em] mb-1"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)', opacity: 0.6 }}>
                // top repositories
              </p>
              {data.topRepos.slice(0, 3).map((repo, i) => (
                <motion.a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg group"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--card-border)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  whileHover={{ borderColor: 'var(--accent)', x: 3 }}
                >
                  <div className="flex items-center gap-2.5">
                    {repo.primaryLanguage && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: repo.primaryLanguage.color }} />
                    )}
                    <span className="text-xs font-semibold truncate max-w-[120px]"
                      style={{ color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                      {repo.name}
                    </span>
                    {repo.primaryLanguage && (
                      <span className="text-[9px] hidden sm:block"
                        style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                        {repo.primaryLanguage.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px]"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                      <Star size={9} />
                      {repo.stargazerCount}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                      <GitFork size={9} />
                      {repo.forkCount}
                    </span>
                    <ExternalLink size={10} style={{ color: 'var(--accent)', opacity: 0 }}
                      className="group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.a>
              ))}
            </div>
          )} */}
        </div>
      </motion.div>
    </div>
  )
}