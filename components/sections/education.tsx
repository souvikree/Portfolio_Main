'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'
import { GraduationCap, BookOpen, MapPin, Calendar } from 'lucide-react'

const ICONS = [GraduationCap, BookOpen]

export function EducationSection() {
  const { education } = portfolioData
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('EDUCATION', inView)

  return (
    <section
      id="education"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 100% 100%, var(--glow) 0%, transparent 70%)',
          opacity: 0.1,
        }}
      />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
          >
            // academic background
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}
          >
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu, i) => {
            const Icon = ICONS[i] ?? GraduationCap
            return (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, rotateX: -15, y: 40 }}
                animate={inView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                style={{ perspective: '800px' }}
              >
                <div
                  className="glass-card p-7 h-full relative overflow-hidden group"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--card-hover-border)'
                    e.currentTarget.style.boxShadow = '0 0 30px var(--glow), 0 8px 40px rgba(0,0,0,0.4)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--card-border)'
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  style={{ transition: 'all 0.3s ease' }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, var(--accent), transparent)`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
                      boxShadow: '0 0 24px var(--glow)',
                    }}
                  >
                    <Icon size={26} style={{ color: 'var(--background)' }} />
                  </div>

                  {/* Institution */}
                  <h3
                    className="text-xl font-black mb-1 leading-snug"
                    style={{
                      color: 'var(--foreground)',
                      fontFamily: 'var(--font-space-grotesk)',
                    }}
                  >
                    {edu.institution}
                  </h3>

                  {/* Degree */}
                  <p
                    className="text-base font-semibold mb-1"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {edu.degree}
                  </p>
                  <p
                    className="text-sm mb-4"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {edu.field}
                  </p>

                  {/* Meta row */}
                  <div
                    className="flex flex-wrap gap-4 text-xs mb-4"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Calendar size={11} />
                      {edu.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={11} />
                      {edu.location}
                    </span>
                  </div>

                  {/* Score */}
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                    style={{
                      background: 'var(--muted)',
                      color: 'var(--accent)',
                      border: '1px solid var(--card-border)',
                      fontFamily: 'var(--font-jetbrains)',
                    }}
                  >
                    {edu.score}
                  </div>

                  {/* Highlights */}
                  {edu.highlights && (
                    <ul className="mt-4 flex flex-col gap-1.5">
                      {edu.highlights.map((h, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-xs leading-relaxed"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: 'var(--accent)' }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
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
