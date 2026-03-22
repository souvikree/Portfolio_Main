'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, Github, ExternalLink, Clock, Users,
  ChevronRight, Layers, TrendingUp, Lightbulb, Code2,
} from 'lucide-react'
import type { CaseStudy } from '@/lib/case-studies-data'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FloatingThemeSwitcher } from '@/components/theme-switcher'

const FADE_UP = (delay = 0) => ({
  initial:    { opacity: 0, y: 20, filter: 'blur(4px)' },
  animate:    { opacity: 1, y: 0,  filter: 'blur(0px)' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
})

interface Props { cs: CaseStudy }

export function CaseStudyPageClient({ cs }: Props) {
  const c = cs.color

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${c}12 0%, transparent 65%)` }} />
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${c}08 0%, transparent 70%)`, filter: 'blur(80px)' }} />

        <div className="section-container relative z-10 max-w-4xl">
          <motion.div {...FADE_UP(0)}>
            <Link href="/"
              className="inline-flex items-center gap-2 mb-8 text-xs transition-all"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = c)}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}>
              <ArrowLeft size={12} /> Back to Portfolio
            </Link>

            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: `${c}15`, color: c, border: `1px solid ${c}35`, fontFamily: 'var(--font-jetbrains)' }}>
                Case Study
              </span>
              <span className="flex items-center gap-1 text-[10px]"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                <Clock size={10} /> {cs.duration}
              </span>
              <span className="flex items-center gap-1 text-[10px]"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                <Users size={10} /> {cs.team}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-3"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
              {cs.projectName}
            </h1>

            <div className="h-[3px] w-16 rounded-full mb-4"
              style={{ background: `linear-gradient(90deg, ${c}, transparent)` }} />

            <p className="text-lg leading-relaxed mb-6 max-w-2xl"
              style={{ color: 'var(--muted-foreground)' }}>
              {cs.tagline}
            </p>

            {/* CTA links */}
            <div className="flex flex-wrap gap-3">
              {cs.links.github && (
                <a href={cs.links.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-jetbrains)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = c; e.currentTarget.style.color = c }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--muted-foreground)' }}>
                  <Github size={13} /> GitHub
                </a>
              )}
              {cs.links.live && (
                <a href={cs.links.live} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: c, color: '#050508', fontFamily: 'var(--font-jetbrains)', boxShadow: `0 0 20px ${c}55` }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 32px ${c}88` }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${c}55` }}>
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${c}50, transparent)`, opacity: 0.4 }} />

      {/* ── Content ── */}
      <div className="section-container max-w-4xl py-14 flex flex-col gap-14">

        {/* Overview */}
        <motion.div {...FADE_UP(0.1)}>
          <SectionLabel icon={Code2} label="Overview" color={c} />
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {cs.overview}
          </p>
        </motion.div>

        {/* Tech stack pills */}
        <motion.div {...FADE_UP(0.15)}>
          <div className="flex flex-wrap gap-2">
            {cs.technologies.map((t, i) => (
              <motion.span key={t}
                className="px-3 py-1 rounded-lg text-xs font-bold"
                style={{ background: `${c}10`, color: c, border: `1px solid ${c}25`, fontFamily: 'var(--font-jetbrains)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                whileHover={{ scale: 1.08, boxShadow: `0 0 10px ${c}44` }}>
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Problem */}
        <motion.div {...FADE_UP(0.2)}>
          <SectionLabel icon={Lightbulb} label={cs.problem.heading} color="#FF6B35" />
          <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--muted-foreground)' }}>
            {cs.problem.body}
          </p>
          <ul className="flex flex-col gap-2.5">
            {cs.problem.points.map((p, i) => (
              <motion.li key={i}
                className="flex items-start gap-3 text-sm"
                style={{ color: 'var(--foreground)' }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}>
                <ChevronRight size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#FF6B35' }} />
                {p}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Solution */}
        <motion.div {...FADE_UP(0.25)}>
          <SectionLabel icon={Layers} label={cs.solution.heading} color={c} />
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--muted-foreground)' }}>
            {cs.solution.body}
          </p>
          <div className="flex flex-col gap-5">
            {cs.solution.steps.map((step, i) => (
              <motion.div key={i}
                className="relative rounded-2xl overflow-hidden p-6"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${c}20`, borderLeft: `3px solid ${c}` }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: `${c}15`, color: c, border: `1px solid ${c}30`, fontFamily: 'var(--font-jetbrains)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-base font-black" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  {step.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {step.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                      style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-jetbrains)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Architecture */}
        <motion.div {...FADE_UP(0.3)}>
          <SectionLabel icon={Layers} label={cs.architecture.heading} color="#C77DFF" />
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
            {cs.architecture.description}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {cs.architecture.layers.map((layer, i) => (
              <motion.div key={i}
                className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                whileHover={{ borderColor: '#C77DFF', boxShadow: '0 0 16px rgba(199,125,255,0.15)' }}>
                <p className="text-xs font-black mb-2" style={{ color: '#C77DFF', fontFamily: 'var(--font-jetbrains)' }}>
                  {layer.name}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {layer.components.map((comp) => (
                    <span key={comp} className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                      style={{ background: 'rgba(199,125,255,0.08)', color: '#C77DFF', border: '1px solid rgba(199,125,255,0.2)', fontFamily: 'var(--font-jetbrains)' }}>
                      {comp}
                    </span>
                  ))}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {layer.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Outcome */}
        <motion.div {...FADE_UP(0.35)}>
          <SectionLabel icon={TrendingUp} label={cs.outcome.heading} color="#00FF87" />
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
            {cs.outcome.body}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cs.outcome.metrics.map((m, i) => (
              <motion.div key={i}
                className="flex flex-col items-center text-center p-4 rounded-xl"
                style={{ background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.15)' }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}>
                <div className="text-2xl font-black mb-1"
                  style={{ color: '#00FF87', fontFamily: 'var(--font-space-grotesk)' }}>
                  {m.value}
                </div>
                <div className="text-xs font-bold mb-1"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                  {m.label}
                </div>
                <div className="text-[9px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                  {m.note}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learnings */}
        <motion.div {...FADE_UP(0.4)}>
          <SectionLabel icon={Lightbulb} label="Key Learnings" color="#FFD166" />
          <ul className="flex flex-col gap-3">
            {cs.learnings.map((l, i) => (
              <motion.li key={i}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ color: 'var(--foreground)' }}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}>
                <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: '#FFD166', boxShadow: '0 0 6px #FFD166' }} />
                {l}
              </motion.li>
            ))}
          </ul>
        </motion.div>

      </div>

      <Footer />
      <FloatingThemeSwitcher />
    </div>
  )
}

function SectionLabel({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <h2 className="text-xl font-black" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
        {label}
      </h2>
    </div>
  )
}