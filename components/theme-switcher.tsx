'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Palette } from 'lucide-react'
import { usePortfolioTheme } from '@/components/theme-provider'

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = usePortfolioTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        style={{
          background: 'var(--muted)',
          color: 'var(--accent)',
          border: '1px solid var(--card-border)',
          fontFamily: 'var(--font-jetbrains)',
        }}
        aria-label="Switch theme"
      >
        <Palette size={14} />
        <span className="hidden sm:block text-xs tracking-wide">
          {themes.find((t) => t.name === theme)?.label}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute right-0 top-full mt-2 z-50 rounded-xl p-2 min-w-[160px]"
              style={{
                background: 'var(--popover)',
                border: '1px solid var(--card-border)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => { setTheme(t.name as Parameters<typeof setTheme>[0]); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left"
                  style={{
                    color: theme === t.name ? 'var(--accent)' : 'var(--foreground)',
                    background: theme === t.name ? 'var(--muted)' : 'transparent',
                    fontFamily: 'var(--font-space-grotesk)',
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      background: t.accent,
                      boxShadow: theme === t.name ? `0 0 8px ${t.accent}` : 'none',
                    }}
                  />
                  {t.label}
                  {theme === t.name && (
                    <span className="ml-auto text-xs opacity-60">Active</span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Floating theme pill (bottom-right)
export function FloatingThemeSwitcher() {
  const { theme, setTheme, themes } = usePortfolioTheme()
  const [open, setOpen] = useState(false)
  const current = themes.find((t) => t.name === theme)

  return (
    <div className="fixed bottom-6 right-6 z-[800]">
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute bottom-14 right-0 rounded-2xl p-3 min-w-[175px]"
              style={{
                background: 'var(--popover)',
                border: '1px solid var(--card-border)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 20px var(--glow)',
              }}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-2 px-2 pb-2"
                style={{
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-jetbrains)',
                  borderBottom: '1px solid var(--card-border)',
                }}
              >
                Theme
              </p>
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => { setTheme(t.name as Parameters<typeof setTheme>[0]); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-150 text-left"
                  style={{
                    color: theme === t.name ? 'var(--accent)' : 'var(--foreground)',
                    background: theme === t.name ? 'var(--muted)' : 'transparent',
                    fontFamily: 'var(--font-space-grotesk)',
                    fontSize: '0.8rem',
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 border"
                    style={{
                      background: t.accent,
                      borderColor: theme === t.name ? t.accent : 'transparent',
                      boxShadow: theme === t.name ? `0 0 10px ${t.accent}` : 'none',
                    }}
                  />
                  {t.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pill button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold shadow-2xl"
        style={{
          background: 'var(--muted)',
          color: 'var(--foreground)',
          border: '1px solid var(--card-border)',
          boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 20px var(--glow)`,
          fontFamily: 'var(--font-space-grotesk)',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Switch theme"
      >
        <span
          className="w-3 h-3 rounded-full"
          style={{
            background: current?.accent || 'var(--accent)',
            boxShadow: `0 0 8px ${current?.accent || 'var(--glow)'}`,
          }}
        />
        <span className="text-xs tracking-wide">{current?.label}</span>
        <Palette size={13} style={{ color: 'var(--muted-foreground)' }} />
      </motion.button>
    </div>
  )
}
