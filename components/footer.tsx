'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Github, Linkedin, Code2, Mail, ArrowUp, Heart } from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { VisitorCounter } from '@/components/visitor-counter'

const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Experience',   href: '#experience' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Education',    href: '#education' },
  { label: 'Contact',      href: '#contact' },
]

const SOCIAL_ICONS: Record<string, React.ElementType> = { Github, Linkedin, Code2, Mail }

export function Footer() {
  const { personal, social } = portfolioData
  const year = new Date().getFullYear()

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer
      className="relative overflow-hidden mt-8"
      style={{ background: 'var(--background)', borderTop: '1px solid var(--section-divider)' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent-secondary), transparent)' }} />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, var(--glow) 0%, transparent 70%)', opacity: 0.08 }} />

      <div className="section-container relative z-10 py-14 pb-10">
        <div className="grid md:grid-cols-[1fr_auto_auto] gap-10 mb-12 mt-6">

          {/* Brand column */}
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2"
                style={{ borderColor: 'var(--accent)', boxShadow: '0 0 20px var(--glow)' }}>
                <Image src="/images/souvik.png" alt="Souvik Ghosh" width={40} height={40}
                  className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="font-bold text-base"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                  Souvik Ghosh
                </p>
                <p className="text-xs" style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                  Software Engineer
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Building production-grade systems that scale. Passionate about distributed systems and real-time communication.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 mt-1">
              {social.map((link) => {
                const Icon = SOCIAL_ICONS[link.icon] || Github
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target={link.url.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
                    style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent)'
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.boxShadow = '0 0 12px var(--glow)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--muted-foreground)'
                      e.currentTarget.style.borderColor = 'var(--card-border)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                    aria-label={link.name}
                  >
                    <Icon size={14} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation column */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-widest uppercase mb-1"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              Navigation
            </p>
            {NAV_LINKS.slice(0, 5).map((link) => (
              <a key={link.href} href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault()
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="text-sm transition-all duration-200"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-space-grotesk)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '4px' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.paddingLeft = '0' }}>
                {link.label}
              </a>
            ))}
          </div>

          {/* More links column */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-widest uppercase mb-1"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              More
            </p>
            {NAV_LINKS.slice(5).map((link) => (
              <a key={link.href} href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault()
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="text-sm transition-all duration-200"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-space-grotesk)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '4px' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.paddingLeft = '0' }}>
                {link.label}
              </a>
            ))}
            <a href={`mailto:${personal.email}`}
              className="text-sm transition-all duration-200"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-space-grotesk)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)' }}>
              Hire Me
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2 pt-4"
          style={{ borderTop: '1px solid var(--section-divider)' }}
        >
          {/* Left: copyright */}
          <p className="text-xs flex items-center gap-1.5"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
            &copy; {year} Souvik Ghosh. Crafted with
            <Heart size={11} fill="currentColor" style={{ color: 'var(--highlight)' }} />
            and passion.
          </p>

          {/* Center: visitor counter */}
          <VisitorCounter />

          {/* Right: open to work + back to top */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(0,255,135,0.08)',
                color: '#00FF87',
                border: '1px solid rgba(0,255,135,0.2)',
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              <span className="available-dot inline-block mr-1.5"
                style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              Open to work
            </span>

            <motion.button
              type="button"
              onClick={scrollToTop}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)' }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)'
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.boxShadow = '0 0 12px var(--glow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--muted-foreground)'
                e.currentTarget.style.borderColor = 'var(--card-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              aria-label="Back to top"
            >
              <ArrowUp size={15} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}