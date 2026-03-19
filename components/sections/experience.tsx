'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'
import { MapPin, Calendar, Building2 } from 'lucide-react'

export function ExperienceSection() {
  const { experience } = portfolioData
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('EXPERIENCE', inView)

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Bg glow */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 100% 50%, var(--glow-secondary) 0%, transparent 70%)',
          opacity: 0.15,
        }}
      />

      <div className="section-container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-1"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
          >
            // work history
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}
          >
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <motion.div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{
              background: 'linear-gradient(to bottom, var(--accent), var(--accent-secondary), transparent)',
              boxShadow: '0 0 12px var(--glow)',
            }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {experience.map((exp, i) => {
            const isUpcoming = exp.status === 'upcoming'
            return (
              <motion.div
                key={i}
                className="relative pl-16 pb-12 last:pb-0"
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-0 top-1 w-12 h-12 rounded-full flex items-center justify-center border-2"
                  style={{
                    background: isUpcoming ? 'var(--muted)' : 'var(--background)',
                    borderColor: isUpcoming ? 'var(--muted-foreground)' : 'var(--accent)',
                    boxShadow: isUpcoming ? 'none' : '0 0 20px var(--glow)',
                  }}
                >
                  <Building2
                    size={18}
                    style={{ color: isUpcoming ? 'var(--muted-foreground)' : 'var(--accent)' }}
                  />
                </div>

                {/* Card */}
                <div
                  className={`glass-card p-6 relative overflow-hidden ${isUpcoming ? 'opacity-60' : ''}`}
                  style={{
                    borderColor: isUpcoming ? 'var(--card-border)' : 'var(--card-border)',
                  }}
                >
                  {/* Shimmer for upcoming */}
                  {isUpcoming && (
                    <div
                      className="absolute inset-0 shimmer pointer-events-none rounded-xl"
                      style={{ opacity: 0.6 }}
                    />
                  )}

                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3
                        className="text-xl font-bold"
                        style={{
                          color: isUpcoming ? 'var(--muted-foreground)' : 'var(--foreground)',
                          fontFamily: 'var(--font-space-grotesk)',
                        }}
                      >
                        {exp.role}
                      </h3>
                      <p
                        className="text-base font-semibold"
                        style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    {/* Status badge */}
                    {exp.status === 'upcoming' && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--muted-foreground)',
                          border: '1px solid var(--card-border)',
                          fontFamily: 'var(--font-jetbrains)',
                        }}
                      >
                        Coming Soon
                        <motion.span
                          className="inline-block ml-1"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          _
                        </motion.span>
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 mb-4 text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {exp.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                  </div>

                  {/* Bullets */}
                  {!isUpcoming && (
                    <ul className="flex flex-col gap-2 mb-4">
                      {exp.description.map((pt, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-sm leading-relaxed"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          <span
                            className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--glow)' }}
                          />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}

                  {isUpcoming && (
                    <p
                      className="text-sm italic mb-4"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
                    >
                      The next chapter is being written...
                    </p>
                  )}

                  {/* Tech tags */}
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((t) => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
