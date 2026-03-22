'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Linkedin, User } from 'lucide-react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { useScramble } from '@/hooks/use-scramble'
import { testimonials, type Testimonial } from '@/lib/testimonials-data'

const EASE = [0.16, 1, 0.3, 1] as const

// ── Signal bar (replaces stars) ───────────────────────────────────────────────
function SignalBars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-end gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i}
          className="rounded-sm"
          style={{ width: 3, background: '#FFD166', boxShadow: '0 0 5px rgba(255,209,102,0.6)' }}
          initial={{ height: 4, opacity: 0 }}
          animate={{ height: 4 + i * 2.5, opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
        />
      ))}
    </div>
  )
}

// ── Waveform SVG (animates on hover) ─────────────────────────────────────────
function Waveform({ active, color }: { active: boolean; color: string }) {
  const pts = [0, 3, -5, 8, -3, 6, -8, 4, 0, -4, 7, -2, 5, -7, 2, 0, -3, 5, -1, 3, 0]
  const w = 200, h = 28, mid = h / 2
  const step = w / (pts.length - 1)
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * step},${mid + p}`).join(' ')

  return (
    <svg width={w} height={h} className="pointer-events-none" style={{ opacity: active ? 0.6 : 0.2, transition: 'opacity 0.3s' }}>
      <motion.path d={d} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: active ? 1 : 0.3, opacity: 1 }}
        transition={{ duration: active ? 0.8 : 0.4, ease: EASE }}
      />
    </svg>
  )
}

// ── Typewriter text ───────────────────────────────────────────────────────────
function TypewriterText({ text, trigger, speed = 18 }: { text: string; trigger: boolean; speed?: number }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!trigger) return
    let i = 0
    setDisplayed('')
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [trigger, text, speed])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && trigger && (
        <motion.span style={{ color: 'var(--accent)' }} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>
          |
        </motion.span>
      )}
    </span>
  )
}

// ── 3D tilt card ─────────────────────────────────────────────────────────────
function TiltWrapper({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const mx   = useMotionValue(0.5)
  const my   = useMotionValue(0.5)
  const rotX = useSpring(useTransform(my, [0,1], [4, -4]), { stiffness: 240, damping: 28 })
  const rotY = useSpring(useTransform(mx, [0,1], [-5, 5]), { stiffness: 240, damping: 28 })
  const glow = useTransform([mx, my], ([gx, gy]: number[]) =>
    `radial-gradient(circle at ${(gx as number)*100}% ${(gy as number)*100}%, rgba(0,245,255,0.06) 0%, transparent 55%)`
  )

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top)  / r.height)
  }
  const onLeave = () => { mx.set(0.5); my.set(0.5) }

  return (
    <motion.div style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900, transformStyle: 'preserve-3d', position: 'relative' }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {/* Cursor glow */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-[1]"
        style={{ background: glow }} />
      {children}
    </motion.div>
  )
}

// ── Testimonial card ──────────────────────────────────────────────────────────
function TestimonialCard({ testimonial, index, inView }: {
  testimonial: Testimonial; index: number; inView: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const cardInView = useInView(cardRef, { once: true, margin: '-40px' })
  const isPlaceholder = testimonial.placeholder
  const accentColor = 'var(--accent)'

  return (
    <motion.div ref={cardRef}
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
      style={{ userSelect: 'none' }}
    >
      <TiltWrapper disabled={isPlaceholder}>
        {/* Outer glow */}
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={hovered && !isPlaceholder ? {
            boxShadow: '0 0 0 1px var(--accent), 0 0 40px rgba(0,245,255,0.12), 0 16px 48px rgba(0,0,0,0.5)',
          } : {
            boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 4px 20px rgba(0,0,0,0.25)',
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="relative overflow-hidden rounded-2xl flex flex-col"
          style={{
            width: 340, minHeight: 300,
            background: isPlaceholder ? 'rgba(255,255,255,0.01)' : 'rgba(5,5,8,0.96)',
            opacity: isPlaceholder ? 0.5 : 1,
          }}
          animate={{ y: hovered && !isPlaceholder ? -5 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Dot mesh */}
          {!isPlaceholder && (
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(rgba(0,245,255,0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: hovered ? 0.8 : 0.25, transition: 'opacity 0.4s' }} />
          )}

          {isPlaceholder ? (
            <>
              <div className="h-[3px] w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center p-7">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)' }}>
                  <User size={18} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                  {testimonial.name}
                </p>
                <p className="text-xs leading-relaxed px-2" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', fontStyle: 'italic', opacity: 0.5 }}>
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                {[60, 80, 45].map((w, k) => (
                  <div key={k} className="relative overflow-hidden rounded-full"
                    style={{ width: `${w}%`, height: 4, background: 'rgba(255,255,255,0.04)' }}>
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: k * 0.3 }} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* ── Header band ── */}
              <div className="relative overflow-hidden flex-shrink-0" style={{ minHeight: 80 }}>
                {/* Gradient bg */}
                <motion.div className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.08) 0%, rgba(123,47,255,0.06) 60%, rgba(255,45,120,0.04) 100%)' }}
                  animate={{ opacity: hovered ? 1 : 0.6 }} transition={{ duration: 0.4 }}
                />
                {/* Top accent bar */}
                <motion.div className="absolute top-0 left-0 right-0 h-[3px]"
                  animate={{ background: hovered ? 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))' : 'linear-gradient(90deg, rgba(0,245,255,0.4), rgba(0,245,255,0.12))' }}
                  transition={{ duration: 0.4 }}
                />

                <div className="relative z-10 flex items-center gap-3 px-5 py-4">
                  {/* Avatar */}
                  {testimonial.photoUrl ? (
                    <motion.div
                      className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ border: '1px solid rgba(0,245,255,0.3)', boxShadow: hovered ? '0 0 18px rgba(0,245,255,0.3)' : '0 0 8px rgba(0,245,255,0.12)', transition: 'box-shadow 0.3s' }}
                      animate={hovered ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                      <Image src={testimonial.photoUrl} alt={testimonial.name}
                        width={44} height={44} className="w-full h-full object-cover object-top" />
                    </motion.div>
                  ) : (
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.25)' }}>
                      <span className="text-base font-black" style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}>
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
                      {testimonial.name}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.7 }}>
                      {testimonial.role}
                    </p>
                    <p className="text-[9px] truncate" style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)', opacity: 0.6 }}>
                      {testimonial.relation}
                    </p>
                  </div>

                  {/* Signal strength */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <SignalBars count={5} />
                    <span style={{ fontSize: 7, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', letterSpacing: '0.1em', opacity: 0.6 }}>
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(0,245,255,0.2), transparent)' }} />

              {/* ── Body ── */}
              <div className="flex flex-col flex-1 p-5 gap-4">
                {/* Waveform */}
                <div className="flex items-center justify-between">
                  <Waveform active={hovered} color="var(--accent)" />
                  <div className="flex flex-col items-end gap-1">
                    <span style={{ fontSize: 7, fontFamily: 'var(--font-jetbrains)', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>
                      SIGNAL
                    </span>
                    <motion.div className="flex items-center gap-1">
                      <motion.div className="w-1 h-1 rounded-full" style={{ background: '#00FF87', boxShadow: '0 0 4px #00FF87' }}
                        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                      <span style={{ fontSize: 7, fontFamily: 'var(--font-jetbrains)', color: '#00FF87', opacity: 0.7 }}>LIVE</span>
                    </motion.div>
                  </div>
                </div>

                {/* Quote text with typewriter */}
                <div className="flex-1">
                  <div className="absolute top-0 right-4 pointer-events-none select-none"
                    style={{ fontSize: '4.5rem', lineHeight: 1, fontFamily: 'Georgia, serif', color: 'var(--accent)', opacity: hovered ? 0.06 : 0.025, transition: 'opacity 0.3s', position: 'relative' }}>
                    "
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)', fontStyle: 'italic' }}>
                    {cardInView ? (
                      <TypewriterText text={`"${testimonial.text}"`} trigger={cardInView} speed={14} />
                    ) : (
                      `"${testimonial.text}"`
                    )}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2">
                    <a href={testimonial.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      onPointerDown={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg"
                      style={{ background: 'rgba(10,102,194,0.08)', color: '#0A66C2', border: '1px solid rgba(10,102,194,0.22)', fontFamily: 'var(--font-jetbrains)', textDecoration: 'none', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 12px rgba(10,102,194,0.3)'; e.currentTarget.style.borderColor = 'rgba(10,102,194,0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(10,102,194,0.22)'; }}>
                      <Linkedin size={9}/> LinkedIn
                    </a>
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'rgba(255,255,255,0.2)' }}>
                    {testimonial.date}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Index watermark */}
          <div className="absolute bottom-2 right-3 pointer-events-none select-none font-black"
            style={{ fontSize: '2.5rem', lineHeight: 1, color: 'var(--accent)', opacity: hovered ? 0.06 : 0.02, fontFamily: 'var(--font-space-grotesk)', transition: 'opacity 0.3s' }}>
            {String(index + 1).padStart(2, '0')}
          </div>
        </motion.div>
      </TiltWrapper>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export function TestimonialsSection() {
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('TESTIMONIALS', inView)
  const [isDragging, setIsDragging] = useState(false)

  const [emblaRef] = useEmblaCarousel({
    loop: false, dragFree: true, align: 'start', containScroll: 'trimSnaps', watchDrag: () => true,
  })

  const onPointerDown = useCallback(() => setIsDragging(true),  [])
  const onPointerUp   = useCallback(() => setIsDragging(false), [])

  const realCount = testimonials.filter(t => !t.placeholder).length
  const hasReal   = realCount > 0

  return (
    <section id="testimonials" ref={ref} className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.012) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%)',
        }} />
        {/* Slow drifting horizontal scan lines */}
        {[20, 45, 70].map((top, i) => (
          <motion.div key={i} className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ top: `${top}%`, background: `linear-gradient(90deg, transparent, rgba(0,245,255,${0.04 + i * 0.015}), transparent)` }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 18 + i * 6, repeat: Infinity, ease: 'linear', delay: i * 4 }}
          />
        ))}
        {/* Blobs */}
        <motion.div className="absolute rounded-full"
          style={{ width: 500, height: 500, top: '5%', left: '-8%', background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ y: [0, -15, 10, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute rounded-full"
          style={{ width: 400, height: 400, bottom: '5%', right: '-5%', background: 'radial-gradient(circle, rgba(123,47,255,0.08) 0%, transparent 70%)', filter: 'blur(70px)' }}
          animate={{ y: [0, 12, -8, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      {/* Watermark */}
      <div className="absolute right-6 top-1/4 pointer-events-none select-none hidden xl:block">
        <span style={{ fontSize: 130, fontWeight: 900, lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px rgba(0,245,255,0.025)', fontFamily: 'var(--font-space-grotesk)' }}>
          VOICE
        </span>
      </div>

      <div className="relative z-10">
        {/* Heading */}
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div className="h-px w-8" style={{ background: 'var(--accent)' }}
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 }} />
              <p className="text-xs tracking-[0.35em] uppercase"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                // what people say
              </p>
              {/* Live signal badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full ml-2"
                style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.15)' }}>
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }}
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }} />
                <span style={{ fontSize: 8, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                  {hasReal ? `${realCount} VERIFIED` : 'SIGNALS'}
                </span>
              </div>
            </div>

            <h2 className="text-5xl sm:text-7xl font-black tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)', letterSpacing: '0.04em' }}>
              {heading}
            </h2>
            <div className="section-heading-line mt-3 w-24" />

            {!hasReal && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl w-fit"
                style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.12)' }}>
                <Linkedin size={12} style={{ color: '#0A66C2', flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                  Placeholder cards — replace with real LinkedIn recommendations when received.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, var(--background) 0%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(270deg, var(--background) 0%, transparent 100%)' }} />

          <div ref={emblaRef} style={{ overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'pan-y' }}
            onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
            <div style={{ display: 'flex', alignItems: 'stretch', paddingTop: 8, paddingBottom: 20 }}>
              {testimonials.map((t, i) => (
                <div key={t.id} style={{
                  flexShrink: 0, width: 340, boxSizing: 'content-box',
                  paddingLeft: i === 0 ? 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))' : '20px',
                }}>
                  <TestimonialCard testimonial={t} index={i} inView={inView} />
                </div>
              ))}
              <div style={{ flexShrink: 0, width: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))' }} />
            </div>
          </div>
        </div>

        {/* Drag hint */}
        <div className="section-container mt-5">
          <motion.div className="flex items-center gap-2"
            animate={{ x: [0, 5, 0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
            <div className="h-px w-8" style={{ background: 'var(--accent)', opacity: 0.3 }} />
            <span style={{ fontSize: 10, color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)', opacity: 0.5 }}>
              drag to explore
            </span>
            <div className="h-px w-8" style={{ background: 'var(--accent)', opacity: 0.3 }} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}