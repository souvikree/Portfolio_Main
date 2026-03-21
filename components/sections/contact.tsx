'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { Mail, MapPin, Phone, Send, Github, Linkedin, Code2, CheckCircle, Loader, ArrowUpRight, Zap, AlertCircle } from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'

const SOCIAL_ICONS: Record<string, React.ElementType> = { Github, Linkedin, Code2, Mail }

const SOCIAL_COLORS: Record<string, string> = {
  Github: '#AAAAAA', Linkedin: '#0A66C2', LeetCode: '#FFA116', Email: '#00F5FF',
}

type Status = 'idle' | 'loading' | 'success' | 'error'

// ── Left panel ──────────────────────────────────────────────────────────────
function ContactInfo() {
  const { personal, social } = portfolioData

  const INFO = [
    { icon: Mail,   label: 'Email',    value: personal.email,    href: `mailto:${personal.email}`,   color: '#00F5FF' },
    { icon: Phone,  label: 'Phone',    value: personal.phone,    href: `tel:${personal.phone}`,       color: '#00FF87' },
    { icon: MapPin, label: 'Location', value: personal.location, href: null,                          color: '#FFD166' },
  ]

  return (
    <div className="flex flex-col gap-6 h-full">

      {/* Intro card */}
      <div className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 30%, var(--glow)0A, transparent 70%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <motion.span className="w-2 h-2 rounded-full"
              style={{ background: '#00FF87', boxShadow: '0 0 8px #00FF87' }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }} />
            <span className="text-xs font-bold" style={{ color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}>
              Open to opportunities
            </span>
          </div>
          <h3 className="text-xl font-black mb-2" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
            Let&apos;s Build Something
            <span style={{ color: 'var(--accent)' }}> Great</span>
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Have a project in mind, a role to discuss, or just want to say hi? I respond within 24 hours.
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <Zap size={12} style={{ color: 'var(--accent)' }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              Usually responds in &lt; 24hrs
            </span>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--card-border)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--card-border)' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => <span key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
          <span className="ml-2 text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>contact.sh</span>
        </div>
        <div className="p-4 text-xs" style={{ fontFamily: 'var(--font-jetbrains)' }}>
          {[
            { cmd: '$ whoami',         out: 'Souvik Ghosh — Software Engineer' },
            { cmd: '$ cat status.txt', out: '● Open to full-time & freelance' },
            { cmd: '$ echo response',  out: 'Within 24 hours ✓' },
          ].map((line, i) => (
            <div key={i} className="mb-2">
              <p style={{ color: 'var(--accent)' }}>{line.cmd}</p>
              <p style={{ color: 'var(--foreground)' }}>{line.out}</p>
            </div>
          ))}
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
            style={{ color: 'var(--accent)' }}>_</motion.span>
        </div>
      </div>

      {/* Contact details */}
      <div className="flex flex-col gap-2">
        {INFO.map(({ icon: Icon, label, value, href, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', cursor: href ? 'pointer' : 'default' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 16px ${color}22` }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
              <Icon size={15} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>{label}</p>
              {href ? (
                <a href={href} className="text-sm font-semibold truncate block transition-colors"
                  style={{ color: 'var(--foreground)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground)')}>
                  {value}
                </a>
              ) : (
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{value}</p>
              )}
            </div>
            {href && <ArrowUpRight size={13} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />}
          </motion.div>
        ))}
      </div>

      {/* Social links */}
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase mb-3"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
          Find me on
        </p>
        <div className="flex flex-wrap gap-2">
          {social.map((link, i) => {
            const Icon  = SOCIAL_ICONS[link.icon] || Github
            const color = SOCIAL_COLORS[link.name] || 'var(--accent)'
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-space-grotesk)' }}
                whileHover={{ y: -2, borderColor: color, color, boxShadow: `0 0 14px ${color}33` } as any}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                aria-label={link.name}
              >
                <Icon size={13} />
                {link.name}
              </motion.a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Contact form (EmailJS wired) ─────────────────────────────────────────────
function ContactForm() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus]   = useState<Status>('idle')
  const [errors, setErrors]   = useState<Partial<typeof form>>({})
  const [focused, setFocused] = useState<string | null>(null)

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
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name as keyof typeof form]) setErrors((p) => ({ ...p, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setStatus('loading')

    try {
      // ── EmailJS send ──────────────────────────────────────────────────────
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name:  form.name,
          from_email: form.email,
          subject:    form.subject,
          message:    form.message,
          // reply_to is automatically set to from_email in most EmailJS templates
          reply_to:   form.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      )
      // ─────────────────────────────────────────────────────────────────────

      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 6000)
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const inputStyle = (field: keyof typeof form): React.CSSProperties => ({
    background: focused === field ? 'rgba(0,245,255,0.03)' : 'rgba(255,255,255,0.02)',
    color: 'var(--foreground)',
    border: `1px solid ${errors[field] ? '#FF2D78' : focused === field ? 'var(--accent)' : 'var(--card-border)'}`,
    boxShadow: focused === field && !errors[field] ? '0 0 14px var(--glow)' : 'none',
    fontFamily: 'var(--font-space-grotesk)',
    outline: 'none',
    transition: 'all 0.25s ease',
    width: '100%',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: '0.875rem',
  })

  const LABEL: React.CSSProperties = {
    color: 'var(--muted-foreground)',
    fontFamily: 'var(--font-jetbrains)',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    fontWeight: 700,
  }

  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}>
      {/* Top gradient bar */}
      <div className="h-[3px] w-full"
        style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))' }} />
      {/* Inner glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, var(--glow)06, transparent 60%)' }} />

      <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-5 relative" noValidate>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Send size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-space-grotesk)' }}>
            Send a Message
          </span>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,245,255,0.08)', color: 'var(--accent)', border: '1px solid rgba(0,245,255,0.2)', fontFamily: 'var(--font-jetbrains)' }}>
            via EmailJS
          </span>
        </div>

        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          {(['name', 'email'] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label htmlFor={field} style={LABEL}>{field === 'name' ? 'Full Name' : 'Email Address'}</label>
              <input
                id={field} name={field}
                type={field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={handleChange}
                placeholder={field === 'name' ? 'Your name' : 'your@email.com'}
                style={inputStyle(field)}
                onFocus={() => setFocused(field)}
                onBlur={() => setFocused(null)}
              />
              {errors[field] && (
                <p className="text-[10px]" style={{ color: '#FF2D78', fontFamily: 'var(--font-jetbrains)' }}>⚠ {errors[field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" style={LABEL}>Subject</label>
          <input
            id="subject" name="subject" type="text"
            value={form.subject}
            onChange={handleChange}
            placeholder="Let's build something together"
            style={inputStyle('subject')}
            onFocus={() => setFocused('subject')}
            onBlur={() => setFocused(null)}
          />
          {errors.subject && <p className="text-[10px]" style={{ color: '#FF2D78', fontFamily: 'var(--font-jetbrains)' }}>⚠ {errors.subject}</p>}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" style={LABEL}>Message</label>
          <textarea
            id="message" name="message" rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell me about your project, idea, or just say hello..."
            style={{ ...inputStyle('message'), resize: 'none' }}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused(null)}
          />
          <div className="flex items-center justify-between">
            {errors.message
              ? <p className="text-[10px]" style={{ color: '#FF2D78', fontFamily: 'var(--font-jetbrains)' }}>⚠ {errors.message}</p>
              : <span />}
            <span className="text-[10px]"
              style={{ color: form.message.length >= 20 ? 'var(--accent)' : 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
              {form.message.length} / 20+
            </span>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm overflow-hidden"
          style={{
            background:
              status === 'success' ? 'rgba(0,255,135,0.1)' :
              status === 'error'   ? 'rgba(255,45,120,0.1)' :
              'var(--accent)',
            color:
              status === 'success' ? '#00FF87' :
              status === 'error'   ? '#FF2D78' :
              'var(--background)',
            border:
              status === 'success' ? '1px solid rgba(0,255,135,0.3)' :
              status === 'error'   ? '1px solid rgba(255,45,120,0.3)' :
              'none',
            boxShadow:
              status === 'success' ? '0 0 16px rgba(0,255,135,0.3)' :
              status === 'error'   ? '0 0 16px rgba(255,45,120,0.3)' :
              '0 0 28px var(--glow)',
            fontFamily: 'var(--font-space-grotesk)',
            cursor: status === 'loading' ? 'wait' : 'pointer',
          }}
          whileHover={status === 'idle' ? { scale: 1.02, boxShadow: '0 0 48px var(--glow)' } : {}}
          whileTap={status === 'idle' ? { scale: 0.98 } : {}}
        >
          {/* Shimmer on idle */}
          {status === 'idle' && (
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }} />
          )}
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.span key="idle" className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Send size={14} /> Send Message
              </motion.span>
            )}
            {status === 'loading' && (
              <motion.span key="loading" className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader size={14} />
                </motion.div>
                Sending...
              </motion.span>
            )}
            {status === 'success' && (
              <motion.span key="success" className="flex items-center gap-2"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <CheckCircle size={14} /> Message Sent!
              </motion.span>
            )}
            {status === 'error' && (
              <motion.span key="error" className="flex items-center gap-2"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AlertCircle size={14} /> Failed — Try Again
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Status banners */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              key="success-banner"
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.2)' }}
            >
              <CheckCircle size={13} style={{ color: '#00FF87', flexShrink: 0 }} />
              <p className="text-xs" style={{ color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}>
                Thanks! I&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              key="error-banner"
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.2)' }}
            >
              <AlertCircle size={13} style={{ color: '#FF2D78', flexShrink: 0 }} />
              <p className="text-xs" style={{ color: '#FF2D78', fontFamily: 'var(--font-jetbrains)' }}>
                Something went wrong. Please try again or email me directly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────
export function ContactSection() {
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('CONTACT', inView)

  return (
    <section id="contact" ref={ref} className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--glow-secondary) 0%, transparent 65%)', opacity: 0.1 }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.07 }} />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
            // get in touch
          </p>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}>
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        <div className="grid lg:grid-cols-[42%_58%] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContactInfo />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30, filter: 'blur(4px)' }}
            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}