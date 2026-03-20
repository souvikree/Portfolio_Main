'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, ChevronRight, X } from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'
import type { Project } from '@/lib/types'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  production:    { label: 'Production',  color: '#00FF87' },
  'open-source': { label: 'Open Source', color: '#00F5FF' },
  'in-progress': { label: 'In Progress', color: '#FFD166' },
  'coming-soon': { label: 'Coming Soon', color: '#888888' },
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  delay,
  inView,
  onClick,
}: {
  project: Project
  delay: number
  inView: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const isComingSoon = project.status === 'coming-soon'
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG['coming-soon']

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={!isComingSoon ? onClick : undefined}
      className="glass-card flex flex-col relative overflow-hidden"
      style={{
        cursor: isComingSoon ? 'default' : 'pointer',
        borderColor: hovered && !isComingSoon ? status.color : 'var(--card-border)',
        boxShadow: hovered && !isComingSoon
          ? `0 0 28px ${status.color}44, 0 8px 32px rgba(0,0,0,0.4)`
          : '',
        transform: hovered && !isComingSoon ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
        minHeight: 340,
      }}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at top left, ${status.color}08 0%, transparent 60%)`,
          opacity: hovered && !isComingSoon ? 1 : 0,
        }}
      />

      {isComingSoon ? (
        // ── Coming Soon ──
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center p-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'var(--muted)' }}
          >
            {project.icon}
          </div>
          <div>
            <p className="text-lg font-bold mb-1" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
              Future Project
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Building something awesome
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                ...
              </motion.span>
            </p>
          </div>
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
          </span>
        </div>
      ) : (
        // ── Real Project ──
        <div className="flex flex-col flex-1 p-6 gap-4">
          {/* Top: icon + status badge */}
          <div className="flex items-start justify-between">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: 'var(--muted)',
                boxShadow: hovered ? `0 0 20px ${status.color}66` : '0 0 10px var(--glow)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {project.icon}
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
              style={{
                background: `${status.color}18`,
                color: status.color,
                border: `1px solid ${status.color}40`,
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              {status.label}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold leading-tight"
            style={{
              color: hovered ? status.color : 'var(--foreground)',
              fontFamily: 'var(--font-space-grotesk)',
              transition: 'color 0.25s ease',
            }}
          >
            {project.name}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--muted-foreground)', flexGrow: 1 }}
          >
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                style={{
                  background: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                  border: '1px solid var(--card-border)',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                {t}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                style={{
                  background: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                  border: '1px solid var(--card-border)',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* ── Action row — buttons on left, Details hint on right ── */}
          <div className="flex items-center justify-between pt-1 gap-2 mt-auto">
            {/* Left: GitHub + Live Demo */}
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200"
                  style={{
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--card-border)',
                    fontFamily: 'var(--font-jetbrains)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = status.color
                    e.currentTarget.style.borderColor = status.color
                    e.currentTarget.style.boxShadow = `0 0 12px ${status.color}44`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--foreground)'
                    e.currentTarget.style.borderColor = 'var(--card-border)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Github size={12} />
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--background)',
                    fontFamily: 'var(--font-jetbrains)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px var(--glow)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <ExternalLink size={12} />
                  Live Demo
                </a>
              )}
            </div>

            {/* Right: Details hint */}
            <span
              className="flex items-center gap-0.5 text-[10px] shrink-0"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
            >
              Details
              <ChevronRight size={10} />
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── PROJECT MODAL ─────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG['coming-soon']

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Blur backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        />

        {/* Modal panel */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl z-10"
          style={{
            background: 'var(--background)',
            border: `1px solid ${status.color}60`,
            boxShadow: `0 0 60px ${status.color}30, 0 24px 80px rgba(0,0,0,0.6)`,
          }}
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent bar */}
          <div
            className="h-1 w-full rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${status.color}, var(--accent-secondary))` }}
          />

          <div className="p-8">
            {/* Close button — type="button" fixes the missing type warning */}
            <button
              type="button"
              onClick={onClose}
              title="Close modal"
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              style={{
                background: 'var(--muted)',
                color: 'var(--muted-foreground)',
                border: '1px solid var(--card-border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--foreground)'
                e.currentTarget.style.borderColor = 'var(--foreground)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--muted-foreground)'
                e.currentTarget.style.borderColor = 'var(--card-border)'
              }}
            >
              <X size={14} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background: 'var(--muted)',
                  boxShadow: `0 0 24px ${status.color}66`,
                  border: `1px solid ${status.color}40`,
                }}
              >
                {project.icon}
              </div>
              <div>
                <h2
                  className="text-3xl font-black leading-tight"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {project.name}
                </h2>
                <span
                  className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: `${status.color}18`,
                    color: status.color,
                    border: `1px solid ${status.color}40`,
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  {status.label}
                </span>
              </div>
            </div>

            {/* Long description */}
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
              {project.longDescription}
            </p>

            {/* Features */}
            <div className="mb-6">
              <p
                className="text-xs uppercase tracking-[0.25em] mb-3 font-bold"
                style={{ color: status.color, fontFamily: 'var(--font-jetbrains)' }}
              >
                Key Features
              </p>
              <ul className="flex flex-col gap-2.5">
                {project.features.map((f, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: 'var(--foreground)' }}
                  >
                    <div
                      className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: status.color, boxShadow: `0 0 8px ${status.color}` }}
                    />
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div className="mb-8">
              <p
                className="text-xs uppercase tracking-[0.25em] mb-3 font-bold"
                style={{ color: status.color, fontFamily: 'var(--font-jetbrains)' }}
              >
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: `${status.color}12`,
                      color: status.color,
                      border: `1px solid ${status.color}30`,
                      fontFamily: 'var(--font-jetbrains)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--card-border)',
                    fontFamily: 'var(--font-space-grotesk)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = status.color
                    e.currentTarget.style.color = status.color
                    e.currentTarget.style.boxShadow = `0 0 16px ${status.color}44`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--card-border)'
                    e.currentTarget.style.color = 'var(--foreground)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Github size={16} />
                  View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--background)',
                    fontFamily: 'var(--font-space-grotesk)',
                    boxShadow: '0 0 20px var(--glow)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 40px var(--glow)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px var(--glow)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── SECTION ──────────────────────────────────────────────────────────────────
export function ProjectsSection() {
  const { projects } = portfolioData
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('PROJECTS', inView)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 0% 100%, var(--glow) 0%, transparent 70%)',
          opacity: 0.1,
        }}
      />

      <div className="section-container relative z-10">
        {/* Heading */}
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
            // featured work
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}
          >
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {projects.map((project, i) => (
            <ProjectCard
              key={`${project.name}-${i}`}
              project={project}
              delay={i * 0.1}
              inView={inView}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}