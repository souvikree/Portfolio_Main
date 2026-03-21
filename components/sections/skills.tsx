'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'

const SKILL_ICON_MAP: Record<string, { iconUrl: string; color: string; lightBg?: boolean }> = {
  // Languages
  'Java':             { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',                                     color: '#ED8B00' },
  'JavaScript':       { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',                         color: '#F7DF1E' },
  'TypeScript':       { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',                         color: '#3178C6' },
  'SQL':              { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',              color: '#CC2927' },
  'HTML/CSS':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',                                    color: '#E34F26' },
  // ✅ Local SVG — has own green color
  'Bash':             { iconUrl: '/icons/bash-icon.svg',                                                                                                  color: '#4EAA25', lightBg: false },
  // Frontend
  'React.js':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',                                   color: '#61DAFB' },
  'Next.js':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',                                  color: '#AAAAAA' },
  'Tailwind CSS':     { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',                        color: '#06B6D4' },
  // Backend
  'Spring Boot':      { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',                                 color: '#6DB33F' },
  'Node.js':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',                                  color: '#339933' },
  // ✅ Local SVG — black icon, needs light bg
  'Express':          { iconUrl: '/icons/express-icon.svg',                                                                                               color: '#888888', lightBg: true  },
  'Microservices':    { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',                                  color: '#6DB33F' },
  'REST API':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',                                color: '#009688' },
  // ✅ Local SVG — black/dark icon, needs light bg
  'WebSockets':       { iconUrl: '/icons/websocket-icon.svg',                                                                                             color: '#00F5FF', lightBg: true  },
  // ✅ Local SVG — has own colors
  'WebRTC':           { iconUrl: '/icons/webrtc-icon.svg',                                                                                                color: '#4285F4', lightBg: false },
  // Databases
  'MySQL':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',                                    color: '#4479A1' },
  'MongoDB':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',                                color: '#47A248' },
  'Oracle':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg',                                  color: '#F80000' },
  // Tools
  'Git':              { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',                                        color: '#F05032' },
  'GitHub':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',                                  color: '#AAAAAA' },
  'AWS EC2':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',       color: '#FF9900' },
  'NGINX':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg',                                    color: '#009639' },
  'Maven':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/maven/maven-original.svg',                                    color: '#C71A36' },
  'Postman':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg',                                color: '#FF6C37' },
  'Linux':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',                                    color: '#FCC624' },
  'IntelliJ':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/intellij/intellij-original.svg',                              color: '#FE315D' },
  'Docker':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',                                  color: '#2496ED' },
  // CS Fundamentals
  'Data Structures & Algorithms': { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',  color: '#00F5FF' },
  'Object-Oriented Programming':  { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',  color: '#ED8B00' },
  'Multithreading':               { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',  color: '#ED8B00' },
  'Database Management':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', color: '#4479A1' },
  'Operating Systems':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', color: '#FCC624' },
  'Computer Networks':            { iconUrl: '', color: '#00FF87' },
  'System Design':                { iconUrl: '', color: '#FF9900' },
}

const TAB_COLORS: Record<string, string> = {
  'Languages':       '#F7DF1E',
  'Frontend':        '#61DAFB',
  'Backend':         '#6DB33F',
  'Databases':       '#47A248',
  'Tools':           '#FF6C37',
  'CS Fundamentals': '#00F5FF',
}

function SkillCard({ name, delay = 0, inView }: { name: string; delay?: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  const icon      = SKILL_ICON_MAP[name]
  const iconColor = icon?.color || 'var(--accent)'
  const iconUrl   = icon?.iconUrl || ''
  const lightBg   = icon?.lightBg ?? false
  const initials  = name.slice(0, 2).toUpperCase()

  // Icon box background logic:
  // lightBg icons (black SVGs) → white/near-white bg so they're visible
  // normal icons → dark muted or tinted bg
  const iconBoxBg = lightBg
    ? (hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.88)')
    : (hovered ? `${iconColor}18` : 'var(--muted)')

  return (
    <motion.div
      className="relative cursor-default select-none flex flex-col items-center text-center gap-3 rounded-2xl p-4 overflow-hidden"
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${iconColor}08` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? iconColor : 'var(--card-border)'}`,
        boxShadow: hovered
          ? `0 0 28px ${iconColor}33, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 2px 8px rgba(0,0,0,0.15)',
        transform: hovered
          ? 'perspective(700px) rotateX(-6deg) rotateY(6deg) translateY(-6px)'
          : 'perspective(700px) rotateX(0) rotateY(0)',
        transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Top micro accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Watermark initials in corner */}
      <div
        className="absolute bottom-1 right-2 font-black pointer-events-none select-none"
        style={{
          fontSize: '2.2rem', lineHeight: 1,
          color: iconColor,
          opacity: hovered ? 0.07 : 0.02,
          fontFamily: 'var(--font-space-grotesk)',
          transition: 'opacity 0.3s',
        }}
      >
        {initials}
      </div>

      {/* Icon container */}
      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center relative"
        style={{
          background: iconBoxBg,
          border: `1px solid ${hovered ? (lightBg ? 'rgba(0,0,0,0.15)' : iconColor) : 'var(--card-border)'}`,
          boxShadow: hovered ? `0 0 20px ${iconColor}55` : 'none',
          transition: 'all 0.28s ease',
        }}
        animate={hovered ? { scale: 1.12, rotate: [0, -4, 4, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Spinning conic ring on hover */}
        {hovered && !lightBg && (
          <motion.div
            className="absolute inset-[-3px] rounded-xl pointer-events-none"
            style={{
              background: `conic-gradient(${iconColor}, transparent, ${iconColor})`,
              opacity: 0.4,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {iconUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={iconUrl}
            alt={name}
            width={28}
            height={28}
            style={{
              width: 28,
              height: 28,
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              // For light bg icons: keep natural dark color
              // For dark bg icons: no filter
              filter: 'none',
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            style={{
              color: lightBg ? '#333333' : iconColor,
              fontFamily: 'var(--font-jetbrains)',
              fontWeight: 900,
              fontSize: 13,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {initials}
          </span>
        )}
      </motion.div>

      {/* Skill name */}
      <p
        className="text-[11px] font-bold leading-snug relative z-10"
        style={{
          color: hovered ? 'var(--foreground)' : 'var(--muted-foreground)',
          fontFamily: 'var(--font-space-grotesk)',
          transition: 'color 0.25s ease',
        }}
      >
        {name}
      </p>
    </motion.div>
  )
}

export function SkillsSection() {
  const { skills } = portfolioData
  const ref        = useRef<HTMLDivElement>(null)
  const inView     = useInView(ref, { once: true, margin: '-80px' })
  const heading    = useScramble('TECHNICAL ARSENAL', inView)
  const [activeTab, setActiveTab] = useState(skills[0].name)

  const activeColor = TAB_COLORS[activeTab] || 'var(--accent)'

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Ambient glow — reacts to active tab color */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse 70% 50% at 75% 30%, ${activeColor}18 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.8 }}
      />

      <div className="section-container relative z-10">

        {/* ── Heading ── */}
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
            // skills &amp; tools
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}
          >
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* ── Tab bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {skills.map((cat, i) => {
            const isActive = activeTab === cat.name
            const tabColor = TAB_COLORS[cat.name] || 'var(--accent)'
            return (
              <motion.button
                key={cat.name}
                type="button"
                onClick={() => setActiveTab(cat.name)}
                className="relative px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide overflow-hidden"
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  color: isActive ? '#050508' : 'var(--muted-foreground)',
                  background: isActive
                    ? `linear-gradient(135deg, ${tabColor}, ${tabColor}99)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? tabColor : 'var(--card-border)'}`,
                  boxShadow: isActive
                    ? `0 0 20px ${tabColor}55, 0 4px 16px rgba(0,0,0,0.3)`
                    : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
              >
                {/* Shimmer sweep on active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
                  />
                )}
                {/* Colored dot on inactive tabs */}
                {!isActive && (
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                    style={{ background: tabColor, opacity: 0.5 }}
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* ── Active category label ── */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 mb-6"
        >
          <motion.div
            className="h-[2px] w-8 rounded-full"
            style={{ background: activeColor }}
            layoutId="tab-line"
          />
          <span
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: activeColor, fontFamily: 'var(--font-jetbrains)' }}
          >
            {activeTab}
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              background: `${activeColor}12`,
              color: activeColor,
              border: `1px solid ${activeColor}30`,
              fontFamily: 'var(--font-jetbrains)',
            }}
          >
            {skills.find((s) => s.name === activeTab)?.skills.length ?? 0} skills
          </span>
        </motion.div>

        {/* ── Skill grid ── */}
        <AnimatePresence mode="wait">
          {skills
            .filter((cat) => cat.name === activeTab)
            .map((cat) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {cat.skills.map((skill, i) => (
                    <SkillCard
                      key={skill.name}
                      name={skill.name}
                      delay={i * 0.04}
                      inView={inView}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </section>
  )
}