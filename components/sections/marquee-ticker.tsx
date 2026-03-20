'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

const ITEMS = [
  { label: 'JAVA',                },
  { label: 'SPRING BOOT',         },
  { label: 'REACT',               },
  { label: 'NODE.JS',             },
  { label: 'MICROSERVICES',       },
  { label: 'MONGODB',             },
  { label: 'AWS',                 },
  { label: 'NEXT.JS',             },
  { label: 'OPEN SOURCE',         },
  { label: 'DISTRIBUTED SYS',     },
  { label: 'WEBSOCKETS',          },
  { label: 'WEBRTC',              },
  { label: 'SYSTEM DESIGN',       },
  { label: 'TYPESCRIPT',          },
  { label: 'MYSQL',               },
  { label: 'DOCKER',              },
]

// Color accent per item for variety
const ACCENT_COLORS = [
  '#00F5FF', '#7B2FFF', '#FF2D78', '#00FF87', '#FFD166',
  '#FF6B35', '#61DAFB', '#339933', '#F05032', '#4479A1',
  '#47A248', '#FF9900', '#ED8B00', '#3178C6', '#6DB33F', '#2496ED',
]

function MarqueeRow({
  items,
  direction,
  speed = 35,
}: {
  items: typeof ITEMS
  direction: 'left' | 'right'
  speed?: number
}) {
  // Triple the items so the loop is seamless even on ultrawide screens
  const row = [...items, ...items, ...items]
  const duration = (items.length * speed) / 10

  return (
    <div className="overflow-hidden relative group">
      {/* Left fade mask */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, var(--background) 0%, transparent 100%)' }}
      />
      {/* Right fade mask */}
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, var(--background) 0%, transparent 100%)' }}
      />

      <motion.div
        className="flex whitespace-nowrap py-3"
        style={{ width: 'max-content' }}
        animate={{ x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        // Slow on hover
        whileHover={{ animationPlayState: 'paused' }}
      >
        {row.map((item, i) => {
          const color = ACCENT_COLORS[i % ACCENT_COLORS.length]
          return (
            <span
              key={i}
              className="inline-flex items-center gap-2 mx-1 px-4 py-1.5 rounded-full cursor-default group/item"
              style={{
                border: '1px solid transparent',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${color}12`
                e.currentTarget.style.borderColor = `${color}40`
                e.currentTarget.style.boxShadow = `0 0 16px ${color}30`
                const label = e.currentTarget.querySelector('.ticker-label') as HTMLElement
                if (label) label.style.color = color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.boxShadow = 'none'
                const label = e.currentTarget.querySelector('.ticker-label') as HTMLElement
                if (label) label.style.color = 'var(--muted-foreground)'
              }}
            >
              {/* Glowing separator dot before each item */}
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: color, boxShadow: `0 0 5px ${color}`, opacity: 0.6 }}
              />

              {/* Label */}
              <span
                className="ticker-label text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase transition-colors duration-200"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
              >
                {item.label}
              </span>

              {/* Icon */}
              {/* <span className="text-xs opacity-50" style={{ fontSize: '0.7rem' }}>
                {item.icon}
              </span> */}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}

export function MarqueeTicker() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'var(--ticker-bg, var(--muted))',
        borderTop: '1px solid var(--section-divider)',
        borderBottom: '1px solid var(--section-divider)',
      }}
      aria-hidden="true"
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--accent) 30%, var(--accent-secondary) 70%, transparent 100%)' }}
      />

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--accent-secondary) 30%, var(--highlight) 70%, transparent 100%)' }}
      />

      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 100% at 50% 50%, var(--glow) 0%, transparent 70%)',
          opacity: 0.04,
        }}
      />

      {/* Row 1 — scrolls left, normal speed */}
      <MarqueeRow items={ITEMS} direction="left" speed={38} />

      {/* Row 2 — scrolls right, slightly faster */}
      <MarqueeRow items={[...ITEMS].reverse()} direction="right" speed={28} />
    </section>
  )
}