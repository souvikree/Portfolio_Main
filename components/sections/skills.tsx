'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'

// ── Icon map (unchanged) ──────────────────────────────────────────────────────
const SKILL_ICON_MAP: Record<string, { iconUrl: string; color: string; lightBg?: boolean }> = {
  'Java':             { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',                                     color: '#ED8B00' },
  'JavaScript':       { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',                         color: '#F7DF1E' },
  'TypeScript':       { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',                         color: '#3178C6' },
  'SQL':              { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',              color: '#CC2927' },
  'HTML/CSS':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',                                   color: '#E34F26' },
  'Bash':             { iconUrl: '/icons/bash-icon.svg',                                                                                                  color: '#4EAA25' },
  'React.js':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',                                   color: '#61DAFB' },
  'Next.js':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',                                 color: '#AAAAAA' },
  'Tailwind CSS':     { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',                       color: '#06B6D4' },
  'Spring Boot':      { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',                                 color: '#6DB33F' },
  'Node.js':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',                                 color: '#339933' },
  'Express':          { iconUrl: '/icons/express-icon.svg',                                                                                               color: '#888888', lightBg: true },
  'Microservices':    { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',                                 color: '#6DB33F' },
  'REST API':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',                               color: '#009688' },
  'WebSockets':       { iconUrl: '/icons/websocket-icon.svg',                                                                                             color: '#00F5FF', lightBg: true },
  'WebRTC':           { iconUrl: '/icons/webrtc-icon.svg',                                                                                                color: '#4285F4' },
  'MySQL':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',                                   color: '#4479A1' },
  'MongoDB':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',                               color: '#47A248' },
  'Oracle':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg',                                 color: '#F80000' },
  'Git':              { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',                                       color: '#F05032' },
  'GitHub':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',                                 color: '#AAAAAA' },
  'AWS EC2':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',      color: '#FF9900' },
  'NGINX':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg',                                   color: '#009639' },
  'Maven':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/maven/maven-original.svg',                                   color: '#C71A36' },
  'Postman':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg',                               color: '#FF6C37' },
  'Linux':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',                                   color: '#FCC624' },
  'IntelliJ':         { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/intellij/intellij-original.svg',                             color: '#FE315D' },
  'Docker':           { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',                                 color: '#2496ED' },
  'Data Structures & Algorithms': { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',   color: '#00F5FF' },
  'Object-Oriented Programming':  { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',   color: '#ED8B00' },
  'Multithreading':               { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',   color: '#ED8B00' },
  'Database Management':          { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', color: '#4479A1' },
  'Operating Systems':            { iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', color: '#FCC624' },
  'Computer Networks':            { iconUrl: '', color: '#00FF87' },
  'System Design':                { iconUrl: '', color: '#FF9900' },
}

const TAB_CONFIG: Record<string, { color: string; label: string }> = {
  'Languages':       { color: '#F7DF1E', label: '' },
  'Frontend':        { color: '#61DAFB', label: ''   },
  'Backend':         { color: '#6DB33F', label: ''   },
  'Databases':       { color: '#47A248', label: ''   },
  'Tools':           { color: '#FF6C37', label: '' },
  'CS Fundamentals': { color: '#00F5FF', label: ''   },
}

// ── Typing counter ────────────────────────────────────────────────────────────
function SkillCounter({ count, color }: { count: number; color: string }) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    setDisplayed(0)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(i)
      if (i >= count) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [count])
  return (
    <span style={{ color, fontFamily: 'var(--font-jetbrains)', fontWeight: 900 }}>
      {String(displayed).padStart(2, '0')}
    </span>
  )
}

// ── Proficiency ring (SVG circle) ─────────────────────────────────────────────
function ProficiencyRing({ color, value, size = 44 }: { color: string; value: number; size?: number }) {
  const r   = (size - 6) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="absolute inset-0 pointer-events-none" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}15`} strokeWidth={2} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={2}
        strokeDasharray={circ}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (circ * value) / 100 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

// ── Skill card ────────────────────────────────────────────────────────────────
function SkillCard({
  name, delay = 0, inView, featured = false,
}: {
  name: string; delay?: number; inView: boolean; featured?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Derive icon data first — needed by hooks below
  const icon      = SKILL_ICON_MAP[name]
  const iconColor = icon?.color ?? 'var(--accent)'
  const iconUrl   = icon?.iconUrl ?? ''
  const lightBg   = icon?.lightBg ?? false
  const initials  = name.slice(0, 2).toUpperCase()

  // Motion hooks — all unconditional, icon data already available
  const mx       = useMotionValue(0.5)
  const my       = useMotionValue(0.5)
  const rotX     = useSpring(useTransform(my, [0,1], [6, -6]),  { stiffness: 280, damping: 28 })
  const rotY     = useSpring(useTransform(mx, [0,1], [-6, 6]),  { stiffness: 280, damping: 28 })
  const glowBg   = useTransform([mx, my], ([gx, gy]: number[]) =>
    `radial-gradient(circle at ${(gx as number)*100}% ${(gy as number)*100}%, ${iconColor}22 0%, transparent 60%)`
  )

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top)  / r.height)
  }
  const onMouseLeave = () => {
    setHovered(false)
    mx.set(0.5); my.set(0.5)
  }

  const cardSize = featured ? 'p-5' : 'p-4'
  const iconSize = featured ? 52 : 44

  return (
    <motion.div
      className={`relative cursor-default select-none flex flex-col items-center text-center gap-3 rounded-2xl ${cardSize} overflow-hidden`}
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: rotX, rotateY: rotY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Card shell */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: hovered ? `${iconColor}08` : 'rgba(255,255,255,0.02)',
          borderColor: hovered ? iconColor : 'rgba(255,255,255,0.07)',
          boxShadow: hovered
            ? `0 0 0 1px ${iconColor}, 0 0 32px ${iconColor}28, 0 12px 40px rgba(0,0,0,0.5)`
            : '0 0 0 1px rgba(255,255,255,0.07), 0 2px 8px rgba(0,0,0,0.2)',
        }}
        transition={{ duration: 0.25 }}
        style={{ border: '1px solid' }}
      />

      {/* Cursor glow */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: glowBg, opacity: hovered ? 1 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      />

      {/* Scan line on hover */}
      {hovered && (
        <motion.div
          className="absolute left-0 right-0 h-[1px] pointer-events-none z-20"
          style={{ background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`, opacity: 0.5 }}
          animate={{ top: ['-2%', '102%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
        style={{ background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`, originX: 0.5 }}
      />

      {/* Hex color swatch — bottom right */}
      <div className="absolute bottom-2 right-2 pointer-events-none select-none z-10">
        <motion.div
          className="flex items-center gap-1"
          animate={{ opacity: hovered ? 0.6 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-2 h-2 rounded-sm" style={{ background: iconColor }} />
          <span style={{
            fontSize: 7, fontFamily: 'var(--font-jetbrains)',
            color: iconColor, letterSpacing: '0.05em',
          }}>
            {iconColor.toUpperCase()}
          </span>
        </motion.div>
      </div>

      {/* Icon container with proficiency ring */}
      <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: iconSize, height: iconSize }}>
        {/* Proficiency ring — always rendered */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProficiencyRing color={iconColor} value={75 + Math.floor(name.length % 4) * 6} size={iconSize} />
        </motion.div>

        <motion.div
          className="relative rounded-xl flex items-center justify-center z-10"
          style={{
            width: iconSize - 6, height: iconSize - 6,
            background: lightBg
              ? (hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.88)')
              : (hovered ? `${iconColor}18` : 'rgba(255,255,255,0.05)'),
            border: `1px solid ${hovered ? iconColor : 'rgba(255,255,255,0.08)'}`,
            boxShadow: hovered ? `0 0 20px ${iconColor}50` : 'none',
            transition: 'all 0.28s ease',
          }}
          animate={hovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        >
          {/* Conic spin ring */}
          {hovered && !lightBg && (
            <motion.div
              className="absolute inset-[-3px] rounded-xl pointer-events-none"
              style={{
                background: `conic-gradient(${iconColor}80, transparent 40%, ${iconColor}80)`,
                opacity: 0.5,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {iconUrl && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={iconUrl} alt={name} width={featured ? 26 : 22} height={featured ? 26 : 22}
              style={{ objectFit: 'contain', position: 'relative', zIndex: 1, width: featured ? 26 : 22, height: featured ? 26 : 22 }}
              onError={() => setImgError(true)} />
          ) : (
            <span style={{
              color: lightBg ? '#333' : iconColor,
              fontFamily: 'var(--font-jetbrains)', fontWeight: 900,
              fontSize: 11, position: 'relative', zIndex: 1,
            }}>
              {initials}
            </span>
          )}
        </motion.div>
      </div>

      {/* Name */}
      <motion.p
        className="text-[11px] font-bold leading-snug relative z-10 w-full"
        animate={{ color: hovered ? 'var(--foreground)' : 'var(--muted-foreground)' }}
        transition={{ duration: 0.2 }}
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        {name}
      </motion.p>
    </motion.div>
  )
}

// ── Category tab ──────────────────────────────────────────────────────────────
function CategoryTab({
  name, isActive, inView, index, skillCount, onClick,
}: {
  name: string; isActive: boolean; inView: boolean
  index: number; skillCount: number; onClick: () => void
}) {
  const cfg   = TAB_CONFIG[name] ?? { color: 'var(--accent)', label: '??' }
  const color = cfg.color

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="relative flex flex-col items-start gap-1 px-4 py-3 rounded-xl overflow-hidden flex-shrink-0"
      style={{
        minWidth: 90,
        background: isActive ? `${color}10` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isActive ? `0 0 24px ${color}25, inset 0 1px 0 ${color}20` : 'none',
        transition: 'all 0.3s ease',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.06, ease: [0.16,1,0.3,1] }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Active shimmer */}
      {isActive && (
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
        />
      )}

      {/* Active bottom bar */}
      {isActive && (
        <motion.div
          layoutId="tab-underline"
          className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
          style={{ background: color }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      {/* <div className="flex items-center gap-1.5 relative z-10">
        <motion.div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: color }}
          animate={isActive ? { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] } : { scale: 1 }}
          transition={{ duration: 1.8, repeat: isActive ? Infinity : 0 }}
        />
        <span style={{
          fontSize: 9, fontFamily: 'var(--font-jetbrains)', fontWeight: 700,
          letterSpacing: '0.15em', color: isActive ? color : 'rgba(255,255,255,0.35)',
          transition: 'color 0.2s',
        }}>
          {cfg.label}
        </span>
      </div> */}

      <span className="text-xs font-bold relative z-10"
        style={{ color: isActive ? 'var(--foreground)' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-space-grotesk)', transition: 'color 0.2s' }}>
        {name}
      </span>

      <span style={{
        fontSize: 9, fontFamily: 'var(--font-jetbrains)',
        color: isActive ? color : 'rgba(255,255,255,0.2)',
        transition: 'color 0.2s',
        position: 'relative', zIndex: 10,
      }}>
        {skillCount} skills
      </span>
    </motion.button>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export function SkillsSection() {
  const { skills } = portfolioData
  const ref        = useRef<HTMLDivElement>(null)
  const inView     = useInView(ref, { once: true, margin: '-80px' })
  const heading    = useScramble('TECHNICAL ARSENAL', inView)
  const [activeTab, setActiveTab] = useState(skills[0].name)

  const activeCfg   = TAB_CONFIG[activeTab] ?? { color: 'var(--accent)', label: '' }
  const activeColor = activeCfg.color
  const activeSkills = skills.find(s => s.name === activeTab)?.skills ?? []

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 100%)',
        }} />
        {/* Category color flood */}
        <motion.div
          className="absolute inset-0"
          animate={{ background: `radial-gradient(ellipse 80% 60% at 70% 40%, ${activeColor}10 0%, transparent 65%)` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ background: `radial-gradient(ellipse 50% 50% at 20% 70%, ${activeColor}06 0%, transparent 60%)` }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Watermark */}
      <div className="absolute right-6 top-1/4 pointer-events-none select-none hidden xl:block">
        <motion.span
          style={{ fontSize: 140, fontWeight: 900, lineHeight: 1, color: 'transparent', WebkitTextStroke: `1px ${activeColor}06`, fontFamily: 'var(--font-space-grotesk)' }}
          animate={{ WebkitTextStroke: `1px ${activeColor}06` }}
          transition={{ duration: 0.6 }}
        >
          TECH
        </motion.span>
      </div>

      <div className="section-container relative z-10">

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div className="h-px w-8" style={{ background: 'var(--accent)' }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }} />
            <p className="text-xs tracking-[0.35em] uppercase"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              // skills &amp; tools
            </p>
          </div>

          <div className="flex items-end gap-5 flex-wrap">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)', letterSpacing: '0.03em' }}>
              {heading}
            </h2>
            {/* Live counter */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="flex items-center gap-2 mb-2 pb-1"
                style={{ borderBottom: '1px solid var(--card-border)' }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
              >
                <span style={{ fontSize: 10, fontFamily: 'var(--font-jetbrains)', color: 'var(--muted-foreground)', opacity: 0.5 }}>
                  skills_loaded
                </span>
                <span style={{ fontSize: 18, lineHeight: 1 }}>
                  [<SkillCounter count={activeSkills.length} color={activeColor} />]
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="section-heading-line w-24" />
          </div>
        </motion.div>

        {/* ── Category tabs ── */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {skills.map((cat, i) => (
            <CategoryTab
              key={cat.name} name={cat.name}
              isActive={activeTab === cat.name}
              inView={inView} index={i}
              skillCount={cat.skills.length}
              onClick={() => setActiveTab(cat.name)}
            />
          ))}
        </div>

        {/* ── Active category info bar ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.28 }}
          >
            <motion.div className="h-[2px] w-10 rounded-full" style={{ background: activeColor }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }} />
            <span className="text-xs font-black uppercase tracking-[0.2em]"
              style={{ color: activeColor, fontFamily: 'var(--font-jetbrains)' }}>
              {activeTab}
            </span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span style={{
              fontSize: 9, fontFamily: 'var(--font-jetbrains)',
              color: activeColor, background: `${activeColor}10`,
              border: `1px solid ${activeColor}25`,
              padding: '2px 8px', borderRadius: 4,
            }}>
              {activeSkills.length} SKILLS
            </span>
          </motion.div>
        </AnimatePresence>

        {/* ── Skill grid ── */}
        <AnimatePresence mode="wait">
          {skills.filter(cat => cat.name === activeTab).map(cat => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Mixed density grid — first 2 items featured (larger), rest normal */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-auto">
                {cat.skills.map((skill, i) => (
                  <SkillCard
                    key={skill.name}
                    name={skill.name}
                    delay={i * 0.035}
                    inView={inView}
                    featured={i < 2}
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