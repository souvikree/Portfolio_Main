'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { Menu, X, Zap } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'

const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Experience',   href: '#experience' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Education',    href: '#education' },
  // { label: 'Blog',         href: '/blog' },
  { label: 'Contact',      href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled]         = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [hoveredLink, setHoveredLink]   = useState<string | null>(null)
  const [blogLoading, setBlogLoading]   = useState(false)
  const [progress, setProgress]         = useState(0)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY   = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(scrollY > 50)
      setScrollProgress(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0)

      const sections = [...NAV_LINKS].map((l) => l.href.replace('#', '')).reverse()
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && scrollY >= el.offsetTop - 120) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('/')) {
      setBlogLoading(true)
      setProgress(0)
      let p = 0
      progressTimerRef.current = setInterval(() => {
        p += Math.random() * 18 + 8
        if (p >= 90) { p = 90; if (progressTimerRef.current) clearInterval(progressTimerRef.current) }
        setProgress(p)
      }, 120)
      setTimeout(() => {
        setProgress(100)
        setTimeout(() => { window.location.href = href }, 300)
      }, 800)
      return
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Page scroll progress bar (very top of viewport) ── */}
      <div className="fixed top-0 left-0 right-0 z-[10000] h-[2px]" style={{ background: 'var(--muted)' }}>
        <motion.div
          className="h-full origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))',
            boxShadow: '0 0 8px var(--glow)',
            scaleX: scrollProgress / 100,
          }}
        />
      </div>

      {/* ── Blog loading bar ── */}
      <AnimatePresence>
        {blogLoading && (
          <motion.div
            className="fixed top-[2px] left-0 z-[9999] h-[3px] rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))', boxShadow: '0 0 10px var(--glow)', width: `${progress}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, width: `${progress}%` }}
            exit={{ opacity: 0 }}
            transition={{ width: { duration: 0.25 }, opacity: { duration: 0.2 } }}
          />
        )}
      </AnimatePresence>

      {/* ── Main navbar ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[900] px-4 pt-3"
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="max-w-6xl mx-auto rounded-2xl transition-all duration-500"
          style={{
            background: scrolled
              ? 'rgba(5,5,8,0.92)'
              : 'rgba(5,5,8,0.35)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${scrolled ? 'rgba(0,245,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
            boxShadow: scrolled
              ? '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,245,255,0.08)'
              : '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          {/* Inner flex row */}
          <div className="flex items-center justify-between px-4 py-2.5">

            {/* ── Logo ── */}
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleLinkClick('#home') }}
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              {/* Avatar with animated ring */}
              <div className="relative">
                {/* Spinning accent ring */}
                <motion.div
                  className="absolute inset-[-3px] rounded-xl pointer-events-none"
                  style={{
                    background: 'conic-gradient(var(--accent), var(--accent-secondary), var(--highlight), var(--accent))',
                    borderRadius: 14,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
                <div
                  className="relative w-9 h-9 rounded-xl overflow-hidden z-10"
                  style={{ background: 'var(--background)' }}
                >
                  <Image
                    src="/images/souvik-nobg.webp"
                    alt="Souvik Ghosh"
                    width={36} height={36}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Name + role */}
              <div className="hidden sm:flex flex-col leading-none">
                <span
                  className="text-sm font-black tracking-wide"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
                >
                  Souvik Ghosh
                </span>
                <span
                  className="text-[10px] font-medium mt-0.5"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
                >
                  Software Engineer
                </span>
              </div>
            </a>

            {/* ── Desktop nav links ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const isActive  = activeSection === link.href.replace('#', '')
                const isHovered = hoveredLink === link.href
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(link.href) }}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="relative px-3 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 overflow-hidden"
                    style={{
                      color: isActive ? 'var(--background)' : isHovered ? 'var(--foreground)' : 'var(--muted-foreground)',
                      fontFamily: 'var(--font-jetbrains)',
                    }}
                  >
                    {/* Active pill background */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {/* Hover background */}
                    {isHovered && !isActive && (
                      <motion.div
                        layoutId="nav-hover-bg"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                    {/* Active glow dot */}
                    {isActive && (
                      <motion.span
                        className="absolute top-1 right-1 w-1 h-1 rounded-full"
                        style={{ background: 'var(--background)', opacity: 0.6 }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                )
              })}
            </div>

            {/* ── Right controls ── */}
            <div className="flex items-center gap-2">
              {/* Available badge — desktop only */}
              {/* <motion.div
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(0,255,135,0.08)',
                  border: '1px solid rgba(0,255,135,0.2)',
                  fontFamily: 'var(--font-jetbrains)',
                }}
                animate={{ boxShadow: ['0 0 0px rgba(0,255,135,0)', '0 0 12px rgba(0,255,135,0.3)', '0 0 0px rgba(0,255,135,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#00FF87' }}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold" style={{ color: '#00FF87' }}>Open to work</span>
              </motion.div> */}

              <ThemeSwitcher />

              {/* Hamburger */}
              <motion.button
                type="button"
                className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-xl overflow-hidden"
                style={{
                  background: mobileOpen ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${mobileOpen ? 'transparent' : 'var(--card-border)'}`,
                  color: mobileOpen ? 'var(--background)' : 'var(--foreground)',
                }}
                onClick={() => setMobileOpen(!mobileOpen)}
                whileTap={{ scale: 0.92 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X size={16} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile fullscreen overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[899] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: 'rgba(3,3,6,0.98)', backdropFilter: 'blur(32px)' }}
          >
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.15 }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, var(--glow-secondary) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.12 }} />

            {/* Top bar inside overlay */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden border-2" style={{ borderColor: 'var(--accent)', boxShadow: '0 0 16px var(--glow)' }}>
                  <Image src="/images/souvik-nobg.webp" alt="Souvik Ghosh" width={36} height={36} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>Souvik Ghosh</span>
                  <span className="text-[10px] mt-0.5" style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>Software Engineer </span>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: 'var(--accent)', color: 'var(--background)' }}
                whileTap={{ scale: 0.92 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.3 }} />

            {/* Nav links */}
            <nav className="flex flex-col flex-1 justify-center px-8 gap-2">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.href.replace('#', '')
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(link.href) }}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl group"
                    style={{
                      background: isActive ? 'linear-gradient(135deg, var(--accent)15, var(--accent-secondary)10)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--accent)40' : 'transparent'}`,
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Index number */}
                      <span
                        className="text-[10px] font-black w-5 text-right"
                        style={{ color: isActive ? 'var(--accent)' : 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="text-2xl font-black tracking-tight"
                        style={{
                          color: isActive ? 'var(--accent)' : 'var(--foreground)',
                          fontFamily: 'var(--font-space-grotesk)',
                          textShadow: isActive ? '0 0 20px var(--glow)' : 'none',
                        }}
                      >
                        {link.label}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--glow)' }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.a>
                )
              })}
            </nav>

            {/* Bottom bar */}
            <div className="px-6 pb-10">
              <div className="mx-0 h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.3 }} />
              <div className="flex items-center justify-between">
                <motion.div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)' }}
                  animate={{ boxShadow: ['0 0 0px rgba(0,255,135,0)', '0 0 12px rgba(0,255,135,0.3)', '0 0 0px rgba(0,255,135,0)'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FF87' }}
                    animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <span className="text-[10px] font-bold" style={{ color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}>Open to work</span>
                </motion.div>
                <ThemeSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}