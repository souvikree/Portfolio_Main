'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Education', href: '#education' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [blogLoading, setBlogLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      // Determine active section
      const sections = NAV_LINKS.map((l) => l.href.replace('#', ''))
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Move glowing indicator
  useEffect(() => {
    const activeIdx = NAV_LINKS.findIndex((l) => l.href === `#${activeSection}`)
    const activeLink = navLinksRef.current[activeIdx]
    const indicator = indicatorRef.current
    if (activeLink && indicator) {
      indicator.style.left = `${activeLink.offsetLeft}px`
      indicator.style.width = `${activeLink.offsetWidth}px`
    }
  }, [activeSection])

  const handleLinkClick = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('/')) {
      // Show progress bar before navigating
      setBlogLoading(true)
      setProgress(0)
      let p = 0
      progressTimerRef.current = setInterval(() => {
        p += Math.random() * 18 + 8
        if (p >= 90) {
          p = 90
          if (progressTimerRef.current) clearInterval(progressTimerRef.current)
        }
        setProgress(p)
      }, 120)
      // Navigate after a short delay so users see the bar
      setTimeout(() => {
        setProgress(100)
        setTimeout(() => {
          window.location.href = href
        }, 300)
      }, 800)
      return
    }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Top loading progress bar — shown when navigating to /blog */}
      <AnimatePresence>
        {blogLoading && (
          <motion.div
            className="fixed top-0 left-0 z-[9999] h-[3px] rounded-full"
            style={{
              background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))',
              boxShadow: '0 0 10px var(--glow)',
              width: `${progress}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, width: `${progress}%` }}
            exit={{ opacity: 0 }}
            transition={{ width: { duration: 0.25, ease: 'easeOut' }, opacity: { duration: 0.2 } }}
          />
        )}
      </AnimatePresence>

      <motion.nav
        className="fixed top-0 left-0 right-0 z-[900] px-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.6, ease: 'easeOut' }}
      >
        <div
          className="max-w-6xl mx-auto mt-3 px-4 py-3 rounded-2xl flex items-center justify-between transition-all duration-300"
          style={{
            background: scrolled ? 'rgba(5,5,8,0.85)' : 'rgba(5,5,8,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${scrolled ? 'var(--card-hover-border)' : 'var(--card-border)'}`,
            boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#home') }}
            className="flex items-center gap-2 group"
          >
            <div
              className="w-9 h-9 rounded-xl overflow-hidden border-2 transition-all duration-300 group-hover:scale-110"
              style={{
                borderColor: 'var(--accent)',
                boxShadow: '0 0 16px var(--glow)',
              }}
            >
              <Image
                src="/images/souvik.png"
                alt="Souvik Ghosh"
                width={36}
                height={36}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span
              className="hidden sm:block text-sm font-semibold tracking-wide"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}
            >
              Souvik Ghosh
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1 relative">
            {/* Glowing indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-[2px] rounded-full transition-all duration-300"
              style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}
            />
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                ref={(el) => { navLinksRef.current[i] = el }}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleLinkClick(link.href) }}
                className="relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  color: activeSection === link.href.replace('#', '') ? 'var(--accent)' : 'var(--muted-foreground)',
                  fontFamily: 'var(--font-space-grotesk)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg transition-all"
              style={{ color: 'var(--foreground)', background: 'var(--muted)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[899] flex flex-col items-center justify-center"
            style={{ background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(24px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href) }}
                  className="text-3xl font-bold tracking-tight transition-all"
                  style={{
                    color: activeSection === link.href.replace('#', '') ? 'var(--accent)' : 'var(--foreground)',
                    fontFamily: 'var(--font-space-grotesk)',
                    textShadow: activeSection === link.href.replace('#', '') ? '0 0 20px var(--glow)' : 'none',
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="absolute bottom-12 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ThemeSwitcher />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}