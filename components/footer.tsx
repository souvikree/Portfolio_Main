"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Github,
  Linkedin,
  Code2,
  Mail,
  ArrowUp,
  Heart,
  Radio,
  Zap,
} from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { VisitorCounter } from "@/components/visitor-counter";

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Achievements", href: "#achievements" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  Github,
  Linkedin,
  Code2,
  Mail,
};

// ── Ticker tape ───────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "⬡ Java · Spring Boot · Next.js · Node.js",
  "⬡ Distributed Systems · WebSockets · WebRTC",
  "⬡ Available for Opportunities",
  "⬡ Kolkata, India · Open to Remote",
  "⬡ Building Software That Matters",
  "⬡ Java · Spring Boot · Next.js · Node.js",
  "⬡ Distributed Systems · WebSockets · WebRTC",
  "⬡ Available for Opportunities",
  "⬡ Kolkata, India · Open to Remote",
  "⬡ Building Software That Matters",
];

function FooterTicker() {
  return (
    <div
      className="overflow-hidden border-b"
      style={{
        borderColor: "rgba(0,245,255,0.08)",
        background: "rgba(0,245,255,0.02)",
      }}
    >
      <div className="flex items-center" style={{ height: 36 }}>
        {/* Left label */}
        {/* <div className="flex items-center gap-2 px-4 flex-shrink-0 border-r" style={{ borderColor: 'rgba(0,245,255,0.1)', height: '100%' }}>
          <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FF87', boxShadow: '0 0 5px #00FF87' }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }} />
          <span style={{ fontSize: 8, fontFamily: 'var(--font-jetbrains)', color: 'var(--accent)', letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
            LIVE
          </span>
        </div> */}
        {/* Scrolling content */}
        <div className="overflow-hidden flex-1">
          <motion.div
            className="flex items-center gap-8 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {TICKER_ITEMS.map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: 9,
                  fontFamily: "var(--font-jetbrains)",
                  color: "rgba(0,245,255,0.45)",
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                  paddingLeft: 32,
                }}
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Live uptime counter ───────────────────────────────────────────────────────
function UptimeCounter() {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor(sec / 60) % 60).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-2">
      {/* <Radio size={9} style={{ color: 'var(--accent)', opacity: 0.6 }} />
      <span style={{ fontSize: 9, fontFamily: 'var(--font-jetbrains)', color: 'rgba(0,245,255,0.4)', letterSpacing: '0.1em' }}>
        SESSION {h}:{m}:{s}
      </span> */}
    </div>
  );
}

// ── EKG heartbeat line ────────────────────────────────────────────────────────
function HeartbeatLine() {
  const w = 120,
    h = 20;
  // EKG-style path
  const d = `M0,${h / 2} L${w * 0.15},${h / 2} L${w * 0.22},${h / 2 - 2} L${w * 0.27},${h / 2 + 6} L${w * 0.33},${h / 2 - 8} L${w * 0.38},${h / 2 + 4} L${w * 0.42},${h / 2} L${w},${h / 2}`;
  return (
    <svg width={w} height={h} className="pointer-events-none">
      <motion.path
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
        style={{ opacity: 0.4 }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}

// ── Nav link with sweep underline ─────────────────────────────────────────────
function NavLink({
  label,
  href,
  delay,
}: {
  label: string;
  href: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const scroll = (e: React.MouseEvent) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <motion.a
      href={href}
      onClick={scroll}
      className="relative text-sm flex items-center gap-1.5 group w-fit"
      style={{
        color: hovered ? "var(--foreground)" : "var(--muted-foreground)",
        fontFamily: "var(--font-space-grotesk)",
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        style={{
          color: "var(--accent)",
          fontSize: 10,
          fontFamily: "var(--font-jetbrains)",
          opacity: hovered ? 0.7 : 0,
          transition: "opacity 0.15s",
        }}
      >
        /
      </motion.span>
      <span>{label}</span>
      {/* Sweep underline */}
      <motion.div
        className="absolute bottom-0 left-5 h-px rounded-full"
        style={{ background: "var(--accent)" }}
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.25, ease: EASE }}
      />
    </motion.a>
  );
}

// ── Launch button (back to top) ───────────────────────────────────────────────
function LaunchButton({ onClick }: { onClick: () => void }) {
  const [launched, setLaunched] = useState(false);
  const handle = () => {
    setLaunched(true);
    setTimeout(() => setLaunched(false), 1000);
    onClick();
  };
  return (
    <motion.button
      type="button"
      onClick={handle}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0"
      style={{
        background: "rgba(0,245,255,0.06)",
        border: "1px solid rgba(0,245,255,0.2)",
        color: "var(--accent)",
      }}
      whileHover={{ scale: 1.1, boxShadow: "0 0 20px var(--glow)" }}
      whileTap={{ scale: 0.93 }}
      aria-label="Back to top"
    >
      {/* Launch trail */}
      <AnimatePresence>
        {launched && (
          <motion.div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "100%",
              background: "linear-gradient(to top, var(--accent), transparent)",
              opacity: 0.3,
            }}
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, originY: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
      <motion.div
        animate={launched ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowUp size={15} />
      </motion.div>
    </motion.button>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function Footer() {
  const { personal, social } = portfolioData;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const year = new Date().getFullYear();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden mt-8"
      style={{ background: "var(--background)" }}
    >
      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent), var(--accent-secondary), var(--highlight), transparent)",
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: EASE }}
      />

      {/* Hex grid background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.025 }}
      >
        <defs>
          <pattern
            id="footerHex"
            x="0"
            y="0"
            width="52"
            height="45"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="26,2 50,14 50,31 26,43 2,31 2,14"
              fill="none"
              stroke="rgba(0,245,255,1)"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footerHex)" />
      </svg>

      {/* Large name watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          style={{
            fontSize: "clamp(5rem, 16vw, 12rem)",
            fontWeight: 900,
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: "1px rgba(0,245,255,0.04)",
            fontFamily: "var(--font-space-grotesk)",
            whiteSpace: "nowrap",
            letterSpacing: "0.06em",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
        >
          SOUVIK
        </motion.span>
      </div>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(0,245,255,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Left + right corner glows */}
      <div
        className="absolute top-0 left-0 w-80 h-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(123,47,255,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Live ticker */}
      <FooterTicker />

      <div className="section-container relative z-10 py-14 pb-8">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-10 lg:gap-16 mb-4 mt-4">
          {/* ── Brand column ── */}
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            {/* Logo + name */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Conic spin ring */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    inset: -3,
                    borderRadius: 16,
                    background:
                      "conic-gradient(var(--accent), #7B2FFF, var(--accent))",
                    opacity: 0.5,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                <div
                  className="w-11 h-11 rounded-xl overflow-hidden relative"
                  style={{
                    border: "2px solid var(--background)",
                    boxShadow: "0 0 16px rgba(0,245,255,0.2)",
                  }}
                >
                  <Image
                    src="/images/souvik-nobg.webp"
                    alt="Souvik Ghosh"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <div>
                <p
                  className="font-black text-base"
                  style={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Souvik Ghosh
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--accent)",
                    fontFamily: "var(--font-jetbrains)",
                    letterSpacing: "0.1em",
                  }}
                >
                  &lt;Software Engineer /&gt;
                </p>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              I build software that solves real problems. My focus is
              distributed systems, real-time communication, and architectures
              built to scale.
            </p>

            {/* Uptime + status */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#00FF87",
                    boxShadow: "0 0 5px #00FF87",
                  }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "var(--font-jetbrains)",
                    color: "#00FF87",
                    opacity: 0.7,
                  }}
                >
                  Available for opportunities
                </span>
              </div>
              <UptimeCounter />
            </div>

            {/* Social icons */}
            <div className="flex gap-2 flex-wrap">
              {social.map((link, i) => {
                const Icon = SOCIAL_ICONS[link.icon] || Github;
                return (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target={
                      link.url.startsWith("mailto") ? undefined : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-xl relative overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      color: "var(--muted-foreground)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.06, ease: EASE }}
                    whileHover={{ y: -3, scale: 1.1 } as any}
                    whileTap={{ scale: 0.92 }}
                    aria-label={link.name}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent)";
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.boxShadow = "0 0 14px var(--glow)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--muted-foreground)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.07)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Icon size={14} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* ── Navigation column ── */}
          <motion.div
            className="flex flex-col gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <p
              className="text-[9px] font-bold tracking-[0.28em] uppercase mb-4"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-jetbrains)",
                opacity: 0.7,
              }}
            >
              // NAVIGATE
            </p>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.slice(0, 5).map((link, i) => (
                <NavLink
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  delay={0.25 + i * 0.05}
                />
              ))}
            </div>
          </motion.div>

          {/* ── More column ── */}
          <motion.div
            className="flex flex-col gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            <p
              className="text-[9px] font-bold tracking-[0.28em] uppercase mb-4"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-jetbrains)",
                opacity: 0.7,
              }}
            >
              // MORE
            </p>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.slice(5).map((link, i) => (
                <NavLink
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  delay={0.35 + i * 0.05}
                />
              ))}
              <NavLink
                label="Hire Me"
                href={`mailto:${personal.email}`}
                delay={0.55}
              />
            </div>

            {/* CTA card */}
            <motion.a
              href={`mailto:${personal.email}`}
              className="mt-6 flex items-center gap-2 px-4 py-3 rounded-xl group relative overflow-hidden"
              style={{
                background: "rgba(0,245,255,0.05)",
                border: "1px solid rgba(0,245,255,0.15)",
                textDecoration: "none",
                display: "flex",
              }}
              whileHover={
                {
                  borderColor: "var(--accent)",
                  boxShadow: "0 0 20px rgba(0,245,255,0.12)",
                } as any
              }
              transition={{ duration: 0.2 }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,245,255,0.05), transparent)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2,
                }}
              />
              <Zap
                size={12}
                style={{ color: "var(--accent)", flexShrink: 0 }}
              />
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--foreground)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Let&apos;s Build Together
                </p>
                <p
                  style={{
                    fontSize: 9,
                    color: "rgba(0,245,255,0.5)",
                    fontFamily: "var(--font-jetbrains)",
                  }}
                >
                  {personal.email}
                </p>
              </div>
            </motion.a>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Left: copyright + heartbeat */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <p
              className="text-xs flex items-center gap-1.5"
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "var(--font-jetbrains)",
              }}
            >
              &copy; {year} Souvik Ghosh
            </p>
            <div className="flex items-center gap-1.5">
              <span
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                Crafted with
              </span>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
              >
                <Heart
                  size={10}
                  fill="currentColor"
                  style={{ color: "var(--highlight)" }}
                />
              </motion.div>
            </div>
            <HeartbeatLine />
          </div>

          {/* Center: visitor counter */}
          <div className="flex-1 flex justify-center mb-2">
            <VisitorCounter />
          </div>

          {/* Right: open to work + back to top */}
          <div className="flex items-center gap-3 flex-shrink-0 mb-0.5">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(0,255,135,0.06)",
                border: "1px solid rgba(0,255,135,0.18)",
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#00FF87", boxShadow: "0 0 5px #00FF87" }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: "#00FF87",
                  fontFamily: "var(--font-jetbrains)",
                  letterSpacing: "0.06em",
                }}
              >
                Open to work
              </span>
            </div>
            {/* <LaunchButton onClick={scrollToTop} /> */}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
