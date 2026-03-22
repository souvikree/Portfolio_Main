'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { Mail, MapPin, Phone, Send, Github, Linkedin, Code2, CheckCircle, Loader, ArrowUpRight, Zap, AlertCircle, Wifi, Radio } from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'

const EASE = [0.16, 1, 0.3, 1] as const
const SOCIAL_ICONS: Record<string, React.ElementType> = { Github, Linkedin, Code2, Mail }
const SOCIAL_COLORS: Record<string, string> = {
  Github: '#AAAAAA', Linkedin: '#0A66C2', LeetCode: '#FFA116', Email: '#00F5FF',
}
type Status = 'idle' | 'loading' | 'success' | 'error'

// ── Signal arc SVG ────────────────────────────────────────────────────────────
function SignalArcs() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[80, 140, 200, 260, 320].map((r, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: r * 2, height: r * 2,
            border: `1px solid rgba(0,245,255,${0.14 - i * 0.025})`,
            top: '50%', left: '50%',
            marginTop: -r, marginLeft: -r,
          }}
          animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
      {/* Rotating sweep */}
      <motion.div className="absolute"
        style={{ width: 320, height: 320, top: '50%', left: '50%', marginTop: -160, marginLeft: -160 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '50%', height: 1,
          background: 'linear-gradient(90deg, rgba(0,245,255,0.4), transparent)',
          transformOrigin: 'left center',
        }} />
      </motion.div>
    </div>
  )
}

// ── Live typing terminal ──────────────────────────────────────────────────────
const TERMINAL_LINES = [
  { cmd: '$ whoami',         out: 'Souvik Ghosh — Software Engineer' },
  { cmd: '$ cat status.txt', out: '● Open to full-time & freelance' },
  { cmd: '$ echo response',  out: 'Within 24 hours ✓' },
]

function LiveTerminal({ inView }: { inView: boolean }) {
  const [lines, setLines] = useState<{ text: string; type: 'cmd' | 'out' }[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inView || done) return
    let lineIdx = 0, charIdx = 0, phase: 'cmd' | 'out' = 'cmd'
    let timeoutId: ReturnType<typeof setTimeout>
    let active = true

    const type = () => {
      if (!active || lineIdx >= TERMINAL_LINES.length) { setDone(true); return }
      const { cmd, out } = TERMINAL_LINES[lineIdx]
      const src = phase === 'cmd' ? cmd : out
      if (charIdx <= src.length) {
        const text = src.slice(0, charIdx)
        setLines(prev => {
          const next = [...prev]
          if (charIdx === 0) next.push({ text, type: phase })
          else next[next.length - 1] = { text, type: phase }
          return next
        })
        charIdx++
        timeoutId = setTimeout(type, phase === 'cmd' ? 55 : 25)
      } else if (phase === 'cmd') {
        phase = 'out'; charIdx = 0
        timeoutId = setTimeout(type, 180)
      } else {
        lineIdx++; phase = 'cmd'; charIdx = 0
        timeoutId = setTimeout(type, 500)
      }
    }
    timeoutId = setTimeout(type, 400)
    return () => { active = false; clearTimeout(timeoutId) }
  }, [inView, done])

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(0,245,255,0.12)' }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
        ))}
        <span className="ml-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-jetbrains)' }}>
          contact.sh
        </span>
        {/* <div className="ml-auto flex items-center gap-1.5">
          <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FF87' }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: '#00FF87', opacity: 0.7 }}>LIVE</span>
        </div> */}
      </div>
      <div className="p-4 text-xs min-h-[100px]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
        {lines.map((line, i) => (
          <div key={i} className="mb-1.5">
            <motion.p style={{ color: line.type === 'cmd' ? 'var(--accent)' : 'rgba(255,255,255,0.75)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {line.text}
            </motion.p>
          </div>
        ))}
        {!done && (
          <motion.span style={{ color: 'var(--accent)' }}
            animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
            _
          </motion.span>
        )}
      </div>
    </div>
  )
}

// ── Contact info panel ────────────────────────────────────────────────────────
function ContactInfo({ inView }: { inView: boolean }) {
  const { personal, social } = portfolioData

  const INFO = [
    { icon: Mail,   label: 'Email',    value: personal.email,    href: `mailto:${personal.email}`, color: '#00F5FF' },
    { icon: Phone,  label: 'Phone',    value: personal.phone,    href: `tel:${personal.phone}`,    color: '#00FF87' },
    { icon: MapPin, label: 'Location', value: personal.location, href: null,                       color: '#FFD166' },
  ]

  return (
    <div className="flex flex-col gap-5 h-full">

      {/* Hero card with signal arcs */}
      <div className="relative rounded-2xl overflow-hidden p-6 min-h-[200px]"
        style={{ background: 'rgba(5,5,8,0.9)', border: '1px solid rgba(0,245,255,0.18)' }}>
        {/* Top bar */}
        <motion.div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))' }}
          initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        />

        {/* Signal arcs behind */}
        <div className="absolute inset-0 opacity-30">
          <SignalArcs />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            {/* <Radio size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', letterSpacing: '0.2em', opacity: 0.7 }}>
              TRANSMISSION OPEN
            </span> */}
            {/* <motion.div className="w-1.5 h-1.5 rounded-full ml-1"
              style={{ background: '#00FF87', boxShadow: '0 0 6px #00FF87' }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }} /> */}
          </div>

          <h3 className="text-2xl font-black mb-2 leading-tight"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
            Let&apos;s Build Something<br/>
            <span style={{ color: 'var(--accent)' }}>Great</span>
          </h3>
          <p className="text-sm leading-relaxed mb-4"
            style={{ color: 'var(--muted-foreground)' }}>
            Have a project in mind, a role to discuss, or just want to say hi?
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Zap size={11} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-jetbrains)', color: 'var(--muted-foreground)' }}>
                Usually responds in &lt; 24hrs
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={11} style={{ color: '#00FF87' }} />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-jetbrains)', color: '#00FF87' }}>
                Open to work
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live terminal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4, ease: EASE }}>
        <LiveTerminal inView={inView} />
      </motion.div>

      {/* Contact details */}
      <div className="flex flex-col gap-2">
        {INFO.map(({ icon: Icon, label, value, href, color }, i) => (
          <motion.div key={label}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.25s ease' }}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 + i * 0.1, ease: EASE }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 16px ${color}1a` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}10`, border: `1px solid ${color}28` }}>
              <Icon size={14} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-jetbrains)', marginBottom: 2 }}>
                {label}
              </p>
              {href ? (
                <a href={href} className="text-sm font-semibold truncate block"
                  style={{ color: 'var(--foreground)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = color)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--foreground)')}>
                  {value}
                </a>
              ) : (
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{value}</p>
              )}
            </div>
            {href && <ArrowUpRight size={12} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />}
          </motion.div>
        ))}
      </div>

      {/* Social links */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.8, ease: EASE }}>
        <p style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-jetbrains)', marginBottom: 10 }}>
          Find me on
        </p>
        <div className="flex flex-wrap gap-2">
          {social.map((link, i) => {
            const Icon  = SOCIAL_ICONS[link.icon] || Github
            const color = SOCIAL_COLORS[link.name] || 'var(--accent)'
            return (
              <motion.a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'var(--font-space-grotesk)', textDecoration: 'none' }}
                whileHover={{ y: -2, borderColor: color, color, boxShadow: `0 0 14px ${color}2a` } as any}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.07 }}
                aria-label={link.name}>
                <Icon size={12}/> {link.name}
              </motion.a>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

// ── Activated input field ─────────────────────────────────────────────────────
function ActivatedInput({
  id, name, type = 'text', value, onChange, placeholder, error, rows, inView, delay,
}: {
  id: string; name: string; type?: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string; error?: string; rows?: number; inView: boolean; delay: number
}) {
  const [focused, setFocused] = useState(false)
  const isTextarea = !!rows

  const baseStyle: React.CSSProperties = {
    width: '100%', outline: 'none', resize: 'none' as const,
    background: focused ? 'rgba(0,245,255,0.025)' : 'rgba(255,255,255,0.015)',
    border: `1px solid ${error ? '#FF2D78' : focused ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 12, padding: '12px 16px', fontSize: '0.875rem',
    color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)',
    transition: 'all 0.25s ease',
    boxShadow: focused && !error ? '0 0 16px rgba(0,245,255,0.1)' : 'none',
  }

  return (
    <motion.div className="flex flex-col gap-1.5"
      initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: EASE }}>
      <label htmlFor={id} style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'var(--font-jetbrains)', fontWeight: 700, color: focused ? 'var(--accent)' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}>
        {id === 'name' ? 'Full Name' : id === 'email' ? 'Email Address' : id.charAt(0).toUpperCase() + id.slice(1)}
      </label>
      <div className="relative">
        {/* Scan line on focus */}
        {focused && (
          <motion.div className="absolute inset-x-0 h-[2px] pointer-events-none z-10 rounded-xl"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.5 }}
            animate={{ top: ['-1px', '100%'] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}
        {isTextarea ? (
          <textarea id={id} name={name} rows={rows} value={value}
            onChange={onChange} placeholder={placeholder} style={baseStyle}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        ) : (
          <input id={id} name={name} type={type} value={value}
            onChange={onChange} placeholder={placeholder} style={baseStyle}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        )}
      </div>
      {error && (
        <motion.p style={{ fontSize: 9, color: '#FF2D78', fontFamily: 'var(--font-jetbrains)' }}
          initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}>
          ⚠ {error}
        </motion.p>
      )}
    </motion.div>
  )
}

// ── Contact form ──────────────────────────────────────────────────────────────
function ContactForm({ inView }: { inView: boolean }) {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 20) e.message = 'At least 20 characters'
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name as keyof typeof form]) setErrors(p => ({ ...p, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStatus('loading')
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message, reply_to: form.email },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      )
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 6000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <motion.div className="relative rounded-2xl overflow-hidden"
      style={{ background: 'rgba(5,5,8,0.95)', border: '1px solid rgba(0,245,255,0.15)' }}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2, ease: EASE }}>

      {/* Top bar */}
      <motion.div className="h-[3px] w-full"
        style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))' }}
        initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
      />

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 35% at 50% 0%, rgba(0,245,255,0.05), transparent 60%)' }} />

      {/* Corner brackets */}
      <svg className="absolute top-4 right-4 pointer-events-none" width={20} height={20} style={{ opacity: 0.2 }}>
        <path d="M20 0 H0 M20 0 V20" stroke="var(--accent)" strokeWidth="1" fill="none"/>
      </svg>
      <svg className="absolute bottom-4 left-4 pointer-events-none" width={20} height={20} style={{ opacity: 0.2 }}>
        <path d="M0 20 H20 M0 20 V0" stroke="var(--accent)" strokeWidth="1" fill="none"/>
      </svg>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-5 relative" noValidate>

        {/* Form header */}
        <motion.div className="flex items-center gap-2 mb-1 pb-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}>
            <Send size={13} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
              Send a Message
            </p>
            <p style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
              ENCRYPTED · SECURE CHANNEL
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.15)' }}>
            <motion.div className="w-1 h-1 rounded-full" style={{ background: 'var(--accent)' }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            <span style={{ fontSize: 8, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', letterSpacing: '0.1em' }}>
              via EmailJS
            </span>
          </div>
        </motion.div>

        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          {(['name', 'email'] as const).map((field, fi) => (
            <ActivatedInput key={field} id={field} name={field}
              type={field === 'email' ? 'email' : 'text'}
              value={form[field]} onChange={handleChange}
              placeholder={field === 'name' ? 'Your name' : 'your@email.com'}
              error={errors[field]} inView={inView} delay={0.4 + fi * 0.07}
            />
          ))}
        </div>

        {/* Subject */}
        <ActivatedInput id="subject" name="subject" value={form.subject}
          onChange={handleChange} placeholder="Let's build something together"
          error={errors.subject} inView={inView} delay={0.54}
        />

        {/* Message */}
        <div>
          <ActivatedInput id="message" name="message" value={form.message}
            onChange={handleChange}
            placeholder="Tell me about your project, idea, or just say hello..."
            error={errors.message} rows={5} inView={inView} delay={0.61}
          />
          <div className="flex items-center justify-between mt-1">
            <span />
            <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: form.message.length >= 20 ? 'var(--accent)' : 'rgba(255,255,255,0.2)' }}>
              {form.message.length} / 20+
            </span>
          </div>
        </div>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, ease: EASE }}>
          <motion.button type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm overflow-hidden"
            style={{
              background: status === 'success' ? 'rgba(0,255,135,0.08)' : status === 'error' ? 'rgba(255,45,120,0.08)' : 'var(--accent)',
              color: status === 'success' ? '#00FF87' : status === 'error' ? '#FF2D78' : 'var(--background)',
              border: status === 'idle' ? 'none' : `1px solid ${status === 'success' ? 'rgba(0,255,135,0.25)' : 'rgba(255,45,120,0.25)'}`,
              boxShadow: status === 'idle' ? '0 0 30px var(--glow)' : status === 'success' ? '0 0 20px rgba(0,255,135,0.2)' : '0 0 20px rgba(255,45,120,0.2)',
              fontFamily: 'var(--font-space-grotesk)',
              cursor: status === 'loading' ? 'wait' : 'pointer',
            }}
            whileHover={status === 'idle' ? { scale: 1.02, boxShadow: '0 0 48px var(--glow)' } : {}}
            whileTap={status === 'idle' ? { scale: 0.98 } : {}}
          >
            {/* Shimmer */}
            {status === 'idle' && (
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }} />
            )}

            {/* Launch line on loading */}
            {status === 'loading' && (
              <motion.div className="absolute bottom-0 left-0 h-[2px] rounded-full"
                style={{ background: 'var(--accent)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />
            )}

            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.span key="idle" className="flex items-center gap-2 relative z-10"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Send size={13}/> Send Message
                </motion.span>
              )}
              {status === 'loading' && (
                <motion.span key="loading" className="flex items-center gap-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader size={13}/>
                  </motion.div>
                  Transmitting...
                </motion.span>
              )}
              {status === 'success' && (
                <motion.span key="success" className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <CheckCircle size={13}/> Message Transmitted!
                </motion.span>
              )}
              {status === 'error' && (
                <motion.span key="error" className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <AlertCircle size={13}/> Signal Lost — Retry
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Status banners */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div key="success-banner"
              initial={{ opacity: 0, y: 6, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.18)' }}>
              <CheckCircle size={12} style={{ color: '#00FF87', flexShrink: 0 }} />
              <p style={{ fontSize: 11, color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}>
                Signal received. I&apos;ll respond within 24 hours.
              </p>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div key="error-banner"
              initial={{ opacity: 0, y: 6, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(255,45,120,0.05)', border: '1px solid rgba(255,45,120,0.18)' }}>
              <AlertCircle size={12} style={{ color: '#FF2D78', flexShrink: 0 }} />
              <p style={{ fontSize: 11, color: '#FF2D78', fontFamily: 'var(--font-jetbrains)' }}>
                Transmission failed. Try again or email directly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export function ContactSection() {
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('CONTACT', inView)

  return (
    <section id="contact" ref={ref} className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.012) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%)',
        }} />

        {/* Section-level signal rings from center */}
        <div className="absolute" style={{ bottom: '-20%', left: '50%', transform: 'translateX(-50%)' }}>
          {[200, 350, 500, 650].map((r, i) => (
            <motion.div key={i}
              className="absolute rounded-full"
              style={{ width: r * 2, height: r * 2, border: `1px solid rgba(0,245,255,${0.06 - i * 0.012})`, marginLeft: -r, marginTop: -r }}
              animate={{ scale: [1, 1.02, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4 + i * 1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
            />
          ))}
        </div>

        {/* Drifting blobs */}
        <motion.div className="absolute rounded-full"
          style={{ width: 500, height: 500, top: '10%', left: '-5%', background: 'radial-gradient(circle, rgba(0,245,255,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ y: [0, -20, 10, 0], x: [0, 15, -8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute rounded-full"
          style={{ width: 400, height: 400, bottom: '10%', right: '0%', background: 'radial-gradient(circle, rgba(123,47,255,0.09) 0%, transparent 70%)', filter: 'blur(70px)' }}
          animate={{ y: [0, 15, -8, 0], x: [0, -10, 5, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
      </div>

      {/* Watermark */}
      <div className="absolute right-6 top-1/4 pointer-events-none select-none hidden xl:block">
        <span style={{ fontSize: 140, fontWeight: 900, lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px rgba(0,245,255,0.025)', fontFamily: 'var(--font-space-grotesk)' }}>
          PING
        </span>
      </div>

      <div className="section-container relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }} className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <motion.div className="h-px w-8" style={{ background: 'var(--accent)' }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }} />
            <p className="text-xs tracking-[0.35em] uppercase"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
              // get in touch
            </p>
            {/* Live ping */}
            <div className="flex items-center gap-1.5 ml-2">
              <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }} />
              <span style={{ fontSize: 8, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', opacity: 0.5, letterSpacing: '0.15em' }}>
                TRANSMIT
              </span>
            </div>
          </div>
          <div className="flex items-end gap-5 flex-wrap">
            <h2 className="text-5xl sm:text-7xl font-black tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)', letterSpacing: '0.04em' }}>
              {heading}
            </h2>
          </div>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[42%_58%] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -24, filter: 'blur(4px)' }}
            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: EASE }}>
            <ContactInfo inView={inView} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24, filter: 'blur(4px)' }}
            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.25, ease: EASE }}>
            <ContactForm inView={inView} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}