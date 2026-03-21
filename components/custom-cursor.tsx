'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mouseX = 0, mouseY = 0
    let dotX = 0, dotY = 0
    let ringX = 0, ringY = 0
    let animFrameId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      setIsHovering(!!isInteractive)
    }

    const animate = () => {
      const dot = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring) { animFrameId = requestAnimationFrame(animate); return }

      // Dot follows instantly
      dotX = mouseX
      dotY = mouseY
      dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`

      // Ring follows with lag
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`

      animFrameId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    animFrameId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      cancelAnimationFrame(animFrameId)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="custom-cursor fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          background: 'var(--accent)',
          boxShadow: '0 0 8px var(--glow)',
          transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease',
          width: isHovering ? '10px' : '8px',
          height: isHovering ? '10px' : '8px',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          width: isHovering ? '48px' : '40px',
          height: isHovering ? '48px' : '40px',
          borderRadius: '50%',
          border: `1.5px solid var(--accent)`,
          opacity: isHovering ? 0.8 : 0.4,
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease, border-color 0.3s ease',
          boxShadow: '0 0 12px var(--glow)',
        }}
      />
    </>
  )
}
