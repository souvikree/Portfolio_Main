'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'

const SKILL_ICON_MAP: Record<string, { iconUrl: string; color: string }> = {
  'Java':             { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', color: '#ED8B00' },
  'JavaScript':       { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', color: '#F7DF1E' },
  'TypeScript':       { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', color: '#3178C6' },
  'SQL':              { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg', color: '#CC2927' },
  'HTML/CSS':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', color: '#E34F26' },
  'Bash':             { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg', color: '#4EAA25' },
  'React.js':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', color: '#61DAFB' },
  'Next.js':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', color: '#AAAAAA' },
  'Tailwind CSS':     { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', color: '#06B6D4' },
  'Spring Boot':      { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg', color: '#6DB33F' },
  'Node.js':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', color: '#339933' },
  'Express':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', color: '#AAAAAA' },
  'Microservices':    { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg', color: '#6DB33F' },
  'REST API':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg', color: '#009688' },
  'WebSockets':       { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg', color: '#00F5FF' },
  'WebRTC':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg', color: '#4285F4' },
  'MySQL':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', color: '#4479A1' },
  'MongoDB':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg', color: '#47A248' },
  'Oracle':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg', color: '#F80000' },
  'Git':              { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', color: '#F05032' },
  'GitHub':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', color: '#AAAAAA' },
  'AWS EC2':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', color: '#FF9900' },
  'NGINX':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg', color: '#009639' },
  'Maven':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/maven/maven-original.svg', color: '#C71A36' },
  'Postman':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg', color: '#FF6C37' },
  'Linux':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', color: '#FCC624' },
  'IntelliJ':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/intellij/intellij-original.svg', color: '#FE315D' },
  'Docker':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', color: '#2496ED' },
  'Data Structures & Algorithms': { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', color: '#00F5FF' },
  'Object-Oriented Programming':  { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', color: '#ED8B00' },
  'Multithreading':               { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', color: '#ED8B00' },
  'Database Management':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', color: '#4479A1' },
  'Operating Systems':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', color: '#FCC624' },
  'Computer Networks':            { iconUrl: '', color: '#00FF87' },
  'System Design':                { iconUrl: '', color: '#FF9900' },
}

function SkillCard({ name, delay = 0, inView }: {
  name: string; delay?: number; inView: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const icon = SKILL_ICON_MAP[name]
  const iconColor = icon?.color || 'var(--accent)'
  const iconUrl = icon?.iconUrl || ''
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <motion.div
      className="glass-card p-4 cursor-default select-none flex flex-col items-center text-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered
          ? 'perspective(600px) rotateX(-5deg) rotateY(5deg) translateY(-6px)'
          : 'perspective(600px) rotateX(0) rotateY(0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        borderColor: hovered ? iconColor : 'var(--card-border)',
        boxShadow: hovered ? `0 0 28px ${iconColor}44, 0 8px 32px rgba(0,0,0,0.4)` : '',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: hovered ? `${iconColor}18` : 'var(--muted)',
          border: `1px solid ${hovered ? iconColor : 'var(--card-border)'}`,
          boxShadow: hovered ? `0 0 16px ${iconColor}55` : 'none',
          transition: 'all 0.25s ease',
        }}
      >
        {iconUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={iconUrl}
            alt={name}
            width={28} height={28}
            style={{ width: 28, height: 28, objectFit: 'contain' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ color: iconColor, fontFamily: 'var(--font-jetbrains)', fontWeight: 900, fontSize: 13 }}>
            {initials}
          </span>
        )}
      </div>
      <p
        className="text-xs font-semibold leading-snug"
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
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('TECHNICAL ARSENAL', inView)
  const [activeTab, setActiveTab] = useState(skills[0].name)

  return (
    <section id="skills" ref={ref} className="relative py-24 overflow-hidden" style={{ background: 'var(--background)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 30%, var(--glow) 0%, transparent 70%)', opacity: 0.12 }}
      />

      <div className="section-container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
            // skills &amp; tools
          </p>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}>
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* Custom glowing tab bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {skills.map((cat, i) => {
            const isActive = activeTab === cat.name
            return (
              <motion.button
                key={cat.name}
                onClick={() => setActiveTab(cat.name)}
                className="relative px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide overflow-hidden"
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  color: isActive ? '#050508' : 'var(--muted-foreground)',
                  background: isActive
                    ? 'linear-gradient(135deg, var(--accent), var(--accent-secondary))'
                    : 'var(--muted)',
                  border: `1px solid ${isActive ? 'transparent' : 'var(--card-border)'}`,
                  boxShadow: isActive
                    ? '0 0 20px var(--glow), 0 0 40px var(--glow-secondary), 0 4px 16px rgba(0,0,0,0.4)'
                    : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
              >
                {/* Shimmer sweep on active tab */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Skill grid — animated tab switch */}
        <AnimatePresence mode="wait">
          {skills.filter(cat => cat.name === activeTab).map((cat) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {cat.skills.map((skill, i) => (
                  <SkillCard
                    key={skill.name}
                    name={skill.name}
                    delay={i * 0.05}
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