'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, MapPin, Phone, Send, Github, Linkedin, Code2, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { portfolioData } from '@/lib/portfolio-data'
import { useScramble } from '@/hooks/use-scramble'

const SOCIAL_ICONS: Record<string, React.ElementType> = { Github, Linkedin, Code2, Mail }

type Status = 'idle' | 'loading' | 'success' | 'error'

function ContactInfo() {
  const { personal, social } = portfolioData

  const INFO = [
    { icon: Mail, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { icon: Phone, label: 'Phone', value: personal.phone, href: `tel:${personal.phone}` },
    { icon: MapPin, label: 'Location', value: personal.location, href: null },
  ]

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Terminal-style header */}
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
          <span
            className="ml-2 text-xs"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
          >
            contact.sh
          </span>
        </div>
        <div className="p-5 space-y-2" style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '0.8rem' }}>
          <p style={{ color: 'var(--muted-foreground)' }}>
            <span style={{ color: 'var(--accent)' }}>$ </span>
            whoami
          </p>
          <p style={{ color: 'var(--foreground)' }}>Souvik Ghosh — Software Engineer</p>
          <p style={{ color: 'var(--muted-foreground)' }} className="mt-2">
            <span style={{ color: 'var(--accent)' }}>$ </span>
            cat status.txt
          </p>
          <p className="flex items-center gap-2">
            <span className="available-dot" />
            <span style={{ color: '#00FF87' }}>Open to full-time roles & freelance</span>
          </p>
          <p style={{ color: 'var(--muted-foreground)' }} className="mt-2">
            <span style={{ color: 'var(--accent)' }}>$ </span>
            echo &quot;response_time&quot;
          </p>
          <p style={{ color: 'var(--foreground)' }}>Usually within 24 hours</p>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ color: 'var(--accent)' }}
          >
            _
          </motion.span>
        </div>
      </div>

      {/* Contact details */}
      <div className="flex flex-col gap-3">
        {INFO.map(({ icon: Icon, label, value, href }) => (
          <div
            key={label}
            className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--muted)',
              border: '1px solid var(--card-border)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.boxShadow = '0 0 16px var(--glow)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--card-border)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
            >
              <Icon size={16} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'var(--foreground)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Social links */}
      <div>
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
        >
          Find me on
        </p>
        <div className="flex flex-wrap gap-3">
          {social.map((link) => {
            const Icon = SOCIAL_ICONS[link.icon] || Github
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                  border: '1px solid var(--card-border)',
                  fontFamily: 'var(--font-space-grotesk)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.boxShadow = '0 0 16px var(--glow)'
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
                <Icon size={15} />
                {link.name}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters'
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof form]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setStatus('loading')
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800))
    setStatus('success')
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setStatus('idle'), 5000)
  }

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Souvik Ghosh', half: true },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', half: true },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: "Let's build something together", half: false },
  ] as const

  return (
    <form onSubmit={handleSubmit} className="glass-card p-7 flex flex-col gap-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        {fields.filter((f) => f.half).map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label
              htmlFor={field.name}
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'var(--muted)',
                color: 'var(--foreground)',
                border: `1px solid ${errors[field.name] ? 'var(--destructive)' : 'var(--card-border)'}`,
                fontFamily: 'var(--font-space-grotesk)',
              }}
              onFocus={(e) => {
                if (!errors[field.name]) e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.boxShadow = '0 0 12px var(--glow)'
              }}
              onBlur={(e) => {
                if (!errors[field.name]) e.currentTarget.style.borderColor = 'var(--card-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            {errors[field.name] && (
              <p className="text-xs" style={{ color: 'var(--destructive)', fontFamily: 'var(--font-jetbrains)' }}>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="subject"
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
        >
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          placeholder="Let's build something together"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
          style={{
            background: 'var(--muted)',
            color: 'var(--foreground)',
            border: `1px solid ${errors.subject ? 'var(--destructive)' : 'var(--card-border)'}`,
            fontFamily: 'var(--font-space-grotesk)',
          }}
          onFocus={(e) => {
            if (!errors.subject) e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.boxShadow = '0 0 12px var(--glow)'
          }}
          onBlur={(e) => {
            if (!errors.subject) e.currentTarget.style.borderColor = 'var(--card-border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {errors.subject && (
          <p className="text-xs" style={{ color: 'var(--destructive)', fontFamily: 'var(--font-jetbrains)' }}>
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project, idea, or just say hello..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
          style={{
            background: 'var(--muted)',
            color: 'var(--foreground)',
            border: `1px solid ${errors.message ? 'var(--destructive)' : 'var(--card-border)'}`,
            fontFamily: 'var(--font-space-grotesk)',
          }}
          onFocus={(e) => {
            if (!errors.message) e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.boxShadow = '0 0 12px var(--glow)'
          }}
          onBlur={(e) => {
            if (!errors.message) e.currentTarget.style.borderColor = 'var(--card-border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        <div className="flex items-center justify-between">
          {errors.message ? (
            <p className="text-xs" style={{ color: 'var(--destructive)', fontFamily: 'var(--font-jetbrains)' }}>
              {errors.message}
            </p>
          ) : (
            <span />
          )}
          <span
            className="text-xs"
            style={{
              color: form.message.length > 20 ? 'var(--accent)' : 'var(--muted-foreground)',
              fontFamily: 'var(--font-jetbrains)',
            }}
          >
            {form.message.length} chars
          </span>
        </div>
      </div>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden"
        style={{
          background: status === 'success' ? 'rgba(0,255,135,0.15)' : 'var(--accent)',
          color: status === 'success' ? '#00FF87' : 'var(--background)',
          border: status === 'success' ? '1px solid rgba(0,255,135,0.4)' : 'none',
          boxShadow: status !== 'success' ? '0 0 24px var(--glow)' : 'none',
          fontFamily: 'var(--font-space-grotesk)',
          cursor: status === 'loading' ? 'wait' : 'pointer',
        }}
        whileHover={status === 'idle' ? { scale: 1.01 } : {}}
        whileTap={status === 'idle' ? { scale: 0.98 } : {}}
      >
        {status === 'idle' && (
          <>
            <Send size={15} />
            Send Message
          </>
        )}
        {status === 'loading' && (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Loader size={15} />
            </motion.div>
            Sending...
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={15} />
            Message Sent!
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle size={15} />
            Failed — Try Again
          </>
        )}
      </motion.button>

      {status === 'success' && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs"
          style={{ color: '#00FF87', fontFamily: 'var(--font-jetbrains)' }}
        >
          Thanks! I&apos;ll get back to you within 24 hours.
        </motion.p>
      )}
    </form>
  )
}

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const heading = useScramble('CONTACT', inView)

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Background radial */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--glow-secondary) 0%, transparent 65%)',
          opacity: 0.12,
        }}
      />

      <div className="section-container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}
          >
            // get in touch
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--foreground)' }}
          >
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
          <p
            className="mt-4 max-w-lg text-base leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Have a project in mind or want to collaborate? I&apos;m always open to discussing new opportunities. Drop a message and let&apos;s make something great together.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[40%_60%] gap-8">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <ContactInfo />
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
