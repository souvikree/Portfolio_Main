"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Github, ExternalLink, ChevronRight, X, Layers, ArrowUpRight, BookOpen, Globe } from "lucide-react";
import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { useScramble } from "@/hooks/use-scramble";
import { getCaseStudyByProject } from "@/lib/case-studies-data";
import { FEATURES } from "@/lib/feature-flags";
import type { Project } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  production:    { label: "Production",  color: "#00FF87" },
  "open-source": { label: "Open Source", color: "#00F5FF" },
  "in-progress": { label: "In Progress", color: "#FFD166" },
  "coming-soon": { label: "Coming Soon", color: "#555570" },
};

// ── Live ping dot ─────────────────────────────────────────────────────────────
function PingDot({ color, size = 6 }: { color: string; size?: number }) {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size + 6, height: size + 6 }}>
      {[0, 1].map(i => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: size + 6, height: size + 6, border: `1px solid ${color}` }}
          animate={{ scale: [1, 2, 2.6], opacity: [0.7, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
        />
      ))}
      <div style={{ width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0, position: "relative", zIndex: 1 }} />
    </div>
  );
}

// ── 3D tilt wrapper (hooks always at top, never conditional) ──────────────────
function TiltCard({ children, style, className, onClick, disabled }: {
  children: React.ReactNode; style?: React.CSSProperties
  className?: string; onClick?: () => void; disabled?: boolean
}) {
  const mx   = useMotionValue(0.5);
  const my   = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0,1], [5, -5]),  { stiffness: 260, damping: 28 });
  const rotY = useSpring(useTransform(mx, [0,1], [-5, 5]),  { stiffness: 260, damping: 28 });
  // Pre-derive spotlight bg — no hook inside JSX
  const spotBg = useTransform([mx, my], ([gx, gy]: number[]) =>
    `radial-gradient(circle at ${(gx as number)*100}% ${(gy as number)*100}%, rgba(255,255,255,0.04) 0%, transparent 55%)`
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top)  / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.div className={className} style={{ ...style, rotateX: rotX, rotateY: rotY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}>
      {/* Spotlight */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-[1]"
        style={{ background: spotBg }} />
      {children}
    </motion.div>
  );
}

// ── Project card ────────────────────────────────────────────────────────────────
function ProjectCard({ project, delay, inView, index, onClick }: {
  project: Project; delay: number; inView: boolean; index: number; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false);
  const isComingSoon = project.status === "coming-soon";
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG["coming-soon"];
  const color  = status.color;
  const caseStudy = FEATURES.caseStudies ? getCaseStudyByProject(project.name) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className="h-full"
    >
      <TiltCard
        disabled={isComingSoon}
        onClick={!isComingSoon ? onClick : undefined}
        className="relative h-full"
        style={{ cursor: isComingSoon ? "default" : "pointer" }}
      >
        {/* Outer glow ring */}
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={hovered && !isComingSoon ? {
            boxShadow: `0 0 0 1px ${color}, 0 0 40px ${color}1e, 0 16px 50px rgba(0,0,0,0.6)`,
          } : {
            boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 4px 18px rgba(0,0,0,0.3)",
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="relative rounded-2xl overflow-hidden h-full flex flex-col"
          style={{ background: "rgba(5,5,8,0.96)", minHeight: 360 }}
          animate={{ y: hovered && !isComingSoon ? -5 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Dot mesh — whole card */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: `radial-gradient(${color}0c 1px, transparent 1px)`, backgroundSize: "22px 22px", opacity: hovered ? 0.9 : 0.3, transition: "opacity 0.4s" }} />

          {isComingSoon ? (
            <>
              {/* Coming soon top bar */}
              <div className="h-[3px] w-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center p-7">
                <motion.div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  {project.icon}
                </motion.div>
                <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-space-grotesk)", fontSize: 14, fontWeight: 700 }}>Future Project</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: 12, opacity: 0.5 }}>
                  Building something awesome<motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>...</motion.span>
                </p>
                {[72, 55, 64].map((w, k) => (
                  <div key={k} className="relative overflow-hidden rounded-full" style={{ width: `${w}%`, maxWidth: 180, height: 5, background: "rgba(255,255,255,0.04)" }}>
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
                      animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: k * 0.3 }} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* ── Header band (matches the image design) ── */}
              <div className="relative overflow-hidden flex-shrink-0" style={{ height: 96 }}>
                {/* Gradient mesh background */}
                <motion.div className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${color}16 0%, rgba(123,47,255,0.10) 55%, rgba(255,45,120,0.07) 100%)` }}
                  animate={{ opacity: hovered ? 1 : 0.65 }} transition={{ duration: 0.4 }}
                />
                {/* Animated top accent bar */}
                <motion.div className="absolute top-0 left-0 right-0 h-[3px]"
                  animate={{ background: hovered ? `linear-gradient(90deg, ${color}, ${color}80, ${color})` : `linear-gradient(90deg, ${color}50, ${color}18)` }}
                  transition={{ duration: 0.4 }}
                />
                {/* Icon + label + name row */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-5 pb-3">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: `${color}18`, border: `1px solid ${color}35`, boxShadow: hovered ? `0 0 18px ${color}44` : "none", transition: "box-shadow 0.3s" }}>
                      {project.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 7, fontFamily: "var(--font-jetbrains)", color, fontWeight: 700, letterSpacing: "0.2em", opacity: 0.7, marginBottom: 2 }}>
                        // PROJECT
                      </div>
                      <motion.h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "1.05rem", fontWeight: 900, lineHeight: 1.15 }}
                        animate={{ color: hovered ? color : "var(--foreground)" }} transition={{ duration: 0.2 }}>
                        {project.name}
                      </motion.h3>
                    </div>
                  </div>
                  {/* Status badge */}
                  {/* <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
                    <PingDot color={color} size={4} />
                    <span style={{ fontSize: 8, fontFamily: "var(--font-jetbrains)", color, fontWeight: 700, letterSpacing: "0.08em" }}>
                      {status.label}
                    </span>
                  </div> */}
                </div>
              </div>

              {/* Divider */}
              <motion.div className="h-[1px] w-full flex-shrink-0"
                style={{ background: `linear-gradient(90deg, ${color}30, transparent)` }}
              />

              {/* ── Body ── */}
              <div className="flex flex-col flex-1 p-5 gap-3.5">
                <p style={{ color: "var(--muted-foreground)", fontSize: 11.5, lineHeight: 1.65, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" as const }}>
                  {project.description}
                </p>

                {/* Tech tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {project.technologies.slice(0, 4).map(t => (
                    <span key={t} style={{ padding: "3px 8px", borderRadius: 5, fontSize: 9, fontWeight: 700, background: `${color}0a`, color, border: `1px solid ${color}20`, fontFamily: "var(--font-jetbrains)" }}>{t}</span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span style={{ padding: "3px 8px", borderRadius: 5, fontSize: 9, background: "rgba(255,255,255,0.03)", color: "var(--muted-foreground)", fontFamily: "var(--font-jetbrains)" }}>
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Footer links */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Row 1: GitHub + Live + Details */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 7, fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.04)", color: "var(--muted-foreground)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-jetbrains)", textDecoration: "none", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 10px ${color}30`; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "var(--muted-foreground)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}>
                          <Github size={10}/> GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 7, fontSize: 10, fontWeight: 700, background: color, color: "#050508", fontFamily: "var(--font-jetbrains)", textDecoration: "none", boxShadow: `0 0 14px ${color}44`, transition: "box-shadow 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 22px ${color}77`; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 14px ${color}44`; }}>
                          <ExternalLink size={10}/> Live Demo
                        </a>
                      )}
                    </div>
                    <motion.span style={{ fontSize: 10, fontFamily: "var(--font-jetbrains)", display: "flex", alignItems: "center", gap: 2 }}
                      animate={{ color: hovered ? color : "rgba(255,255,255,0.2)" }} transition={{ duration: 0.2 }}>
                      Details <ArrowUpRight size={9}/>
                    </motion.span>
                  </div>
                  {/* Row 2: Case study (only if available) */}
                  {caseStudy && (
                    <Link href={`/case-studies/${caseStudy.slug}`} onClick={e => e.stopPropagation()}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7, fontSize: 10, fontWeight: 700, background: "rgba(199,125,255,0.07)", color: "#C77DFF", border: "1px solid rgba(199,125,255,0.2)", fontFamily: "var(--font-jetbrains)", textDecoration: "none", width: "fit-content", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 12px rgba(199,125,255,0.3)"; e.currentTarget.style.borderColor = "rgba(199,125,255,0.4)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(199,125,255,0.2)"; }}>
                      <BookOpen size={10}/> Read Case Study
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Index watermark */}
          <div className="absolute bottom-2 right-3 pointer-events-none select-none font-black"
            style={{ fontSize: "3rem", lineHeight: 1, color, opacity: hovered ? 0.07 : 0.025, fontFamily: "var(--font-space-grotesk)", transition: "opacity 0.3s" }}>
            {String(index + 1).padStart(2, "0")}
          </div>
        </motion.div>
      </TiltCard>
    </motion.div>
  );
}

// ── Project Modal ─────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const status    = STATUS_CONFIG[project.status] ?? STATUS_CONFIG["coming-soon"];
  const color     = status.color;
  const caseStudy = FEATURES.caseStudies ? getCaseStudyByProject(project.name) : null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center sm:p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="absolute inset-0"
          style={{ background: "rgba(2,2,6,0.92)", backdropFilter: "blur(18px)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

        <motion.div
          className="relative w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto z-10 rounded-t-3xl sm:rounded-2xl"
          style={{ background: "rgba(8,8,14,0.98)", border: `1px solid ${color}28`, boxShadow: `0 0 0 1px ${color}12, 0 -20px 60px rgba(0,0,0,0.8), 0 0 80px ${color}10` }}
          initial={{ opacity: 0, y: 80, scale: 0.94, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={e => e.stopPropagation()}>

          {/* Drag handle mobile */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
          </div>

          {/* Top animated bar */}
          <motion.div className="h-[3px] w-full sm:rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${color}, var(--accent-secondary), var(--highlight))` }}
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          />

          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 35% at 50% 0%, ${color}06, transparent 55%)` }} />

          {/* Dot mesh */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: `radial-gradient(${color}06 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />

          <div className="p-6 sm:p-7 relative">
            {/* Close */}
            <button type="button" onClick={onClose} aria-label="Close"
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF5F57"; e.currentTarget.style.color = "#FF5F57"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
              <X size={14}/>
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pr-10">
              <div style={{ width: 56, height: 56, borderRadius: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, background: `${color}12`, border: `1px solid ${color}30`, boxShadow: `0 0 28px ${color}32` }}>
                {project.icon}
              </div>
              <div>
                <h2 style={{ color: "var(--foreground)", fontFamily: "var(--font-space-grotesk)", fontSize: "1.5rem", fontWeight: 900, lineHeight: 1.2, marginBottom: 6 }}>
                  {project.name}
                </h2>
                {/* <div className="flex items-center gap-2">
                  <PingDot color={color} size={5} />
                  <span style={{ fontSize: 11, color, fontFamily: "var(--font-jetbrains)", fontWeight: 700 }}>{status.label}</span>
                </div> */}
              </div>
            </div>

            <p style={{ color: "var(--muted-foreground)", fontSize: 14, lineHeight: 1.78, marginBottom: 24 }}>
              {project.longDescription}
            </p>

            {/* Features — interactive illuminated list */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={12} style={{ color }} />
                <span style={{ fontSize: 9, letterSpacing: "0.25em", fontFamily: "var(--font-jetbrains)", fontWeight: 700, color, textTransform: "uppercase" }}>Key Features</span>
                <div className="h-px flex-1" style={{ background: `${color}18` }} />
              </div>
              <div className="flex flex-col gap-2">
                {project.features.map((f, i) => (
                  <motion.div key={i}
                    className="flex items-start gap-3 p-3 rounded-xl cursor-default"
                    style={{ background: activeFeature === i ? `${color}08` : "transparent", border: `1px solid ${activeFeature === i ? color + "25" : "transparent"}`, transition: "all 0.2s" }}
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: EASE }}
                    onMouseEnter={() => setActiveFeature(i)}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: activeFeature === i ? `${color}18` : "rgba(255,255,255,0.04)", border: `1px solid ${activeFeature === i ? color + "35" : "rgba(255,255,255,0.07)"}`, marginTop: 1, transition: "all 0.2s" }}>
                      <ChevronRight size={10} style={{ color: activeFeature === i ? color : "rgba(255,255,255,0.3)" }} />
                    </div>
                    <span style={{ color: activeFeature === i ? "var(--foreground)" : "var(--muted-foreground)", fontSize: 13, lineHeight: 1.6, transition: "color 0.2s" }}>{f}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tech stack */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-4">
                <span style={{ fontSize: 9, letterSpacing: "0.25em", fontFamily: "var(--font-jetbrains)", fontWeight: 700, color, textTransform: "uppercase" }}>Tech Stack</span>
                <div className="h-px flex-1" style={{ background: `${color}18` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t, ti) => (
                  <motion.span key={t}
                    style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${color}0e`, color, border: `1px solid ${color}20`, fontFamily: "var(--font-jetbrains)" }}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: ti * 0.04 }}
                    whileHover={{ scale: 1.07, boxShadow: `0 0 12px ${color}44` }}>
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 11, fontSize: 13, fontWeight: 700, background: "rgba(255,255,255,0.05)", color: "var(--foreground)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "var(--font-space-grotesk)", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--foreground)"; }}>
                  <Github size={15}/> View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 11, fontSize: 13, fontWeight: 700, background: color, color: "#050508", fontFamily: "var(--font-space-grotesk)", textDecoration: "none", boxShadow: `0 0 24px ${color}50` }}>
                  <ExternalLink size={15}/> Live Demo
                </a>
              )}
              {caseStudy && (
                <Link href={`/case-studies/${caseStudy.slug}`}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 11, fontSize: 13, fontWeight: 700, background: "rgba(199,125,255,0.08)", color: "#C77DFF", border: "1px solid rgba(199,125,255,0.22)", fontFamily: "var(--font-space-grotesk)", textDecoration: "none" }}>
                  <BookOpen size={15}/> Case Study
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function ProjectsSection() {
  const { projects } = portfolioData;
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });
  const heading = useScramble("PROJECTS", inView);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const realProjects  = projects.filter(p => p.status !== "coming-soon");

  return (
    <section id="projects" ref={ref} className="relative py-24 overflow-hidden"
      style={{ background: "var(--background)" }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(0,245,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.012) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 15%, transparent 100%)",
        }} />
        {[
          { x: "12%", y: "25%", w: 420, c: "rgba(0,245,255,0.07)",   d: 15 },
          { x: "85%", y: "65%", w: 360, c: "rgba(123,47,255,0.09)",  d: 19 },
          { x: "50%", y: "85%", w: 300, c: "rgba(255,45,120,0.05)",  d: 23 },
        ].map((b, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ left: b.x, top: b.y, width: b.w, height: b.w, background: `radial-gradient(circle, ${b.c} 0%, transparent 70%)`, filter: `blur(${b.w * 0.3}px)`, transform: "translate(-50%,-50%)" }}
            animate={{ y: [0, -18, 10, 0], x: [0, 10, -7, 0], scale: [1, 1.05, 0.97, 1] }}
            transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }} />
        ))}
      </div>

      {/* Watermark */}
      <div className="absolute right-6 bottom-1/4 pointer-events-none select-none hidden xl:block">
        <span style={{ fontSize: 150, fontWeight: 900, lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(0,245,255,0.022)", fontFamily: "var(--font-space-grotesk)" }}>
          DEV
        </span>
      </div>

      <div className="section-container relative z-10">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }} className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <motion.div className="h-px w-8" style={{ background: "var(--accent)" }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }} />
            <p className="text-xs tracking-[0.35em] uppercase"
              style={{ color: "var(--accent)", fontFamily: "var(--font-jetbrains)" }}>
              // featured work
            </p>
          </div>
          <div className="flex items-end gap-5 flex-wrap">
            <h2 className="text-5xl sm:text-7xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--foreground)", letterSpacing: "0.04em" }}>
              {heading}
            </h2>
            <div className="mb-2 pb-1 flex items-center gap-2" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <PingDot color="#00FF87" size={5} />
              <span style={{ fontSize: 10, fontFamily: "var(--font-jetbrains)", color: "var(--muted-foreground)", opacity: 0.5 }}>
                {realProjects.length} live deployments
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="section-heading-line w-24" />
          </div>
        </motion.div>

        {/* Grid — all cards uniform */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={`${project.name}-${i}`}
              project={project} delay={i * 0.09}
              inView={inView} index={i}
              onClick={() => setSelectedProject(project)} />
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}