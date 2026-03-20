'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type ThemeName = 'cyber-noir' | 'solar-flare' | 'aurora' | 'ghost-light'

interface ThemeContextValue {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  cycleTheme: () => void
  themes: { name: ThemeName; label: string; accent: string }[]
}

export const THEMES: { name: ThemeName; label: string; accent: string }[] = [
  { name: 'cyber-noir', label: 'Cyber Noir', accent: '#00F5FF' },
  { name: 'solar-flare', label: 'Solar Flare', accent: '#FF6B35' },
  { name: 'aurora', label: 'Aurora', accent: '#00FF87' },
  // { name: 'ghost-light', label: 'Ghost Light', accent: '#E8E3DC' },
]

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'cyber-noir',
  setTheme: () => {},
  cycleTheme: () => {},
  themes: THEMES,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('cyber-noir')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('portfolio-theme') as ThemeName | null
    if (saved && THEMES.find((t) => t.name === saved)) {
      setThemeState(saved)
      document.documentElement.setAttribute('data-theme', saved)
    }
  }, [])

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme)
    localStorage.setItem('portfolio-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    // color-wash overlay
    const overlay = document.createElement('div')
    overlay.style.cssText = `position:fixed;inset:0;z-index:99998;pointer-events:none;background:var(--accent);opacity:0;transition:opacity 0.15s ease;`
    document.body.appendChild(overlay)
    requestAnimationFrame(() => {
      overlay.style.opacity = '0.07'
      setTimeout(() => {
        overlay.style.opacity = '0'
        setTimeout(() => overlay.remove(), 200)
      }, 150)
    })
  }, [])

  const cycleTheme = useCallback(() => {
    const idx = THEMES.findIndex((t) => t.name === theme)
    setTheme(THEMES[(idx + 1) % THEMES.length].name)
  }, [theme, setTheme])

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const usePortfolioTheme = () => useContext(ThemeContext)
