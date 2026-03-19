'use client'

import { useEffect, useState } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (!trigger) return
    let frame = 0
    const total = text.length * 3
    const id = setInterval(() => {
      frame++
      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' '
            if (frame >= i * 3 + 3) return ch
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
      if (frame >= total) clearInterval(id)
    }, 35)
    return () => clearInterval(id)
  }, [trigger, text])

  return display
}
