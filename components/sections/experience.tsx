'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'
import { MapPin, Calendar, Building2, ChevronRight, Zap } from 'lucide-react'

export function ExperienceSection() {
  const { experience } = portfolioData
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('EXPERIENCE', inView)
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 50%, var(--glow-secondary) 0%, transparent 70%)', opacity: 0.12 }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(60px)', opacity: 0.08 }} />

      <div className="section-container relative z-10">

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
            // work history
          </p>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}>
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* ── Two-panel layout ── */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-10 max-w-5xl mx-auto">

          {/* LEFT — company selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-2 lg:border-r lg:pr-6"
            style={{ borderColor: 'var(--card-border)' }}
          >
            {/* Timeline vertical line (desktop only) */}
            <div className="hidden lg:block absolute left-[calc(var(--container-offset,0px)+280px+1.25rem)] top-[calc(theme(spacing.24)+theme(spacing.32))] w-px h-[calc(100%-theme(spacing.56))] pointer-events-none"
               />

            {experience.map((exp, i) => {
              const isActive   = activeIdx === i
              const isUpcoming = exp.status === 'upcoming'
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className="relative text-left px-4 py-4 rounded-xl transition-all duration-300 overflow-hidden group"
                  style={{
                    background: isActive ? 'rgba(0,245,255,0.06)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--card-border)'}`,
                    boxShadow: isActive ? '0 0 20px var(--glow)' : 'none',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active accent bar */}
                  {isActive && (
                    <motion.div
                      layoutId="exp-active-bar"
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                      style={{ background: 'linear-gradient(to bottom, var(--accent), var(--accent-secondary))' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center gap-2 mb-1">
                    {/* Status dot */}
                    {!isUpcoming ? (
                      <motion.span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: '#00FF87', boxShadow: '0 0 6px #00FF87' }}
                        animate={isActive ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : {}}
                        transition={{ duration: 1.6, repeat: Infinity }}
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--muted-foreground)', opacity: 0.4 }} />
                    )}
                    <p className="text-xs font-bold truncate"
                      style={{ color: isActive ? 'var(--accent)' : 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                      {exp.company}
                    </p>
                  </div>
                  <p className="text-sm font-semibold truncate pl-4"
                    style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                    {exp.role}
                  </p>
                  <p className="text-[10px] pl-4 mt-1"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                    {exp.duration}
                  </p>
                </motion.button>
              )
            })}
          </motion.div>

          {/* RIGHT — detail panel */}
          <div className="relative min-h-[320px]">
            {experience.map((exp, i) => {
              const isUpcoming = exp.status === 'upcoming'
              if (i !== activeIdx) return null
              return (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <div
                    className="relative rounded-2xl overflow-hidden h-full"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isUpcoming ? 'var(--card-border)' : 'var(--accent)'}`,
                      boxShadow: isUpcoming ? 'none' : '0 0 30px var(--glow)',
                    }}
                  >
                    {/* Top gradient accent bar */}
                    <div className="h-[3px] w-full"
                      style={{ background: isUpcoming
                        ? 'var(--muted)'
                        : 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))' }} />

                    {/* Shimmer for upcoming */}
                    {isUpcoming && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)' }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                      />
                    )}

                    <div className="p-7">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                        <div className="flex items-start gap-4">
                          {/* Company icon */}
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: isUpcoming ? 'var(--muted)' : 'rgba(0,245,255,0.08)',
                              border: `1px solid ${isUpcoming ? 'var(--card-border)' : 'var(--accent)'}`,
                              boxShadow: isUpcoming ? 'none' : '0 0 16px var(--glow)',
                            }}
                          >
                            <Building2 size={20} style={{ color: isUpcoming ? 'var(--muted-foreground)' : 'var(--accent)' }} />
                          </div>

                          <div>
                            <h3 className="text-xl font-black"
                              style={{ color: isUpcoming ? 'var(--muted-foreground)' : 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                              {exp.role}
                            </h3>
                            <p className="text-sm font-bold mt-0.5"
                              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                              {exp.company}
                            </p>
                          </div>
                        </div>

                        {/* Status badge */}
                        {isUpcoming ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                            style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-jetbrains)' }}>
                            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                              ◉
                            </motion.span>
                            Coming Soon
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                            style={{ background: 'rgba(0,255,135,0.08)', color: '#00FF87', border: '1px solid rgba(0,255,135,0.2)', fontFamily: 'var(--font-jetbrains)' }}>
                            <Zap size={10} />
                            Completed
                          </span>
                        )}
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-5 mb-5 pb-5"
                        style={{ borderBottom: '1px solid var(--card-border)' }}>
                        <span className="flex items-center gap-1.5 text-xs"
                          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                          <Calendar size={11} style={{ color: 'var(--accent)' }} />
                          {exp.duration}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs"
                          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                          <MapPin size={11} style={{ color: 'var(--accent)' }} />
                          {exp.location}
                        </span>
                      </div>

                      {/* Bullet points */}
                      {!isUpcoming ? (
                        <ul className="flex flex-col gap-3 mb-5">
                          {exp.description.map((pt, j) => (
                            <motion.li
                              key={j}
                              className="flex items-start gap-3 text-sm leading-relaxed"
                              style={{ color: 'var(--muted-foreground)' }}
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.07 }}
                            >
                              <ChevronRight size={13} className="mt-0.5 flex-shrink-0"
                                style={{ color: 'var(--accent)' }} />
                              {pt}
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex flex-col gap-3 mb-5">
                          <p className="text-sm italic"
                            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                            The next chapter is being written
                            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                              ...
                            </motion.span>
                          </p>
                          {/* Placeholder skeleton lines */}
                          {[80, 65, 72].map((w, k) => (
                            <div key={k} className="h-3 rounded-full shimmer" style={{ width: `${w}%`, background: 'var(--muted)' }} />
                          ))}
                        </div>
                      )}

                      {/* Tech tags */}
                      {exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((t, ti) => (
                            <motion.span
                              key={t}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                              style={{
                                background: 'rgba(0,245,255,0.07)',
                                color: 'var(--accent)',
                                border: '1px solid rgba(0,245,255,0.2)',
                                fontFamily: 'var(--font-jetbrains)',
                              }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + ti * 0.05 }}
                              whileHover={{ scale: 1.08, boxShadow: '0 0 10px var(--glow)' }}
                            >
                              {t}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}