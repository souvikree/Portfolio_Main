"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Github,
  ExternalLink,
  ChevronRight,
  X,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { useScramble } from "@/hooks/use-scramble";
import type { Project } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  production: { label: "Production", color: "#00FF87" },
  "open-source": { label: "Open Source", color: "#00F5FF" },
  "in-progress": { label: "In Progress", color: "#FFD166" },
  "coming-soon": { label: "Coming Soon", color: "#666680" },
};

// ─── PROJECT CARD ──────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  delay,
  inView,
  index,
  onClick,
}: {
  project: Project;
  delay: number;
  inView: boolean;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isComingSoon = project.status === "coming-soon";
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG["coming-soon"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={!isComingSoon ? onClick : undefined}
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        cursor: isComingSoon ? "default" : "pointer",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered && !isComingSoon ? status.color : "var(--card-border)"}`,
        boxShadow:
          hovered && !isComingSoon
            ? `0 0 32px ${status.color}33, 0 12px 40px rgba(0,0,0,0.5)`
            : "0 2px 12px rgba(0,0,0,0.2)",
        transform:
          hovered && !isComingSoon ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        minHeight: 360,
      }}
    >
      {/* Top color bar */}
      <div
        className="h-[3px] w-full flex-shrink-0"
        style={{
          background: isComingSoon
            ? "var(--card-border)"
            : `linear-gradient(90deg, ${status.color}, ${status.color}55)`,
        }}
      />

      {/* Index number watermark */}
      <div
        className="absolute top-4 right-4 font-black pointer-events-none select-none"
        style={{
          fontSize: "4rem",
          lineHeight: 1,
          color: status.color,
          opacity: hovered ? 0.08 : 0.04,
          fontFamily: "var(--font-space-grotesk)",
          transition: "opacity 0.3s ease",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 20% 20%, ${status.color}08, transparent 70%)`,
          opacity: hovered && !isComingSoon ? 1 : 0,
        }}
      />

      {isComingSoon ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-5 text-center p-8">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: "var(--muted)",
              border: "1px solid var(--card-border)",
            }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {project.icon}
          </motion.div>
          <div>
            <p
              className="text-lg font-bold mb-1.5"
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              Future Project
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Building something awesome
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                ...
              </motion.span>
            </p>
          </div>
          {/* Skeleton lines */}
          {[70, 55, 63].map((w, k) => (
            <div
              key={k}
              className="h-2 rounded-full shimmer w-full max-w-[200px]"
              style={{ width: `${w}%`, background: "var(--muted)" }}
            />
          ))}
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
              border: "1px solid var(--card-border)",
              fontFamily: "var(--font-jetbrains)",
            }}
          >
            Coming Soon
          </span>
        </div>
      ) : (
        <div className="flex flex-col flex-1 p-5 gap-4">
          {/* Top row: icon + status */}
          <div className="flex items-start justify-between">
            <motion.div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: `${status.color}12`,
                border: `1px solid ${status.color}30`,
                boxShadow: hovered ? `0 0 20px ${status.color}44` : "none",
                transition: "all 0.3s ease",
              }}
            >
              {project.icon}
            </motion.div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: `${status.color}12`,
                border: `1px solid ${status.color}30`,
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: status.color,
                  boxShadow: `0 0 5px ${status.color}`,
                }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span
                className="text-[10px] font-bold tracking-wide"
                style={{
                  color: status.color,
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                {status.label}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-black leading-tight"
            style={{
              color: hovered ? status.color : "var(--foreground)",
              fontFamily: "var(--font-space-grotesk)",
              transition: "color 0.25s ease",
            }}
          >
            {project.name}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed flex-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                style={{
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                  border: "1px solid var(--card-border)",
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                {t}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                style={{
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                  border: "1px solid var(--card-border)",
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Bottom action row */}
          <div
            className="flex items-center justify-between gap-2 mt-auto pt-3"
            style={{ borderTop: "1px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                    border: "1px solid var(--card-border)",
                    fontFamily: "var(--font-jetbrains)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = status.color;
                    e.currentTarget.style.borderColor = status.color;
                    e.currentTarget.style.boxShadow = `0 0 10px ${status.color}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--muted-foreground)";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Github size={11} /> GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{
                    background: status.color,
                    color: "#050508",
                    fontFamily: "var(--font-jetbrains)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 16px ${status.color}88`;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <ExternalLink size={11} /> Live
                </a>
              )}
            </div>
            <motion.span
              className="flex items-center gap-0.5 text-[10px]"
              style={{
                color: hovered ? status.color : "var(--muted-foreground)",
                fontFamily: "var(--font-jetbrains)",
                transition: "color 0.2s",
              }}
            >
              Details <ArrowUpRight size={10} />
            </motion.span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── PROJECT MODAL ─────────────────────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG["coming-soon"];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(3,3,8,0.85)",
            backdropFilter: "blur(12px)",
          }}
        />

        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl z-10"
          style={{
            background: "var(--background)",
            border: `1px solid ${status.color}50`,
            boxShadow: `0 0 80px ${status.color}25, 0 0 200px ${status.color}10, 0 32px 80px rgba(0,0,0,0.7)`,
          }}
          initial={{ opacity: 0, scale: 0.88, y: 32, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.88, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top gradient bar */}
          <div
            className="h-[3px] w-full rounded-t-2xl"
            style={{
              background: `linear-gradient(90deg, ${status.color}, var(--accent-secondary), var(--highlight))`,
            }}
          />

          {/* Subtle glow inside modal */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${status.color}06, transparent 60%)`,
            }}
          />

          <div className="p-7 relative">
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              title="Close modal"
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl transition-all"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
                border: "1px solid var(--card-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = status.color;
                e.currentTarget.style.color = status.color;
                e.currentTarget.style.boxShadow = `0 0 10px ${status.color}44`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--card-border)";
                e.currentTarget.style.color = "var(--muted-foreground)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <X size={14} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background: `${status.color}12`,
                  border: `1px solid ${status.color}30`,
                  boxShadow: `0 0 28px ${status.color}44`,
                }}
              >
                {project.icon}
              </div>
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-black leading-tight"
                  style={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {project.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: status.color }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: status.color,
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Long description */}
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--muted-foreground)" }}
            >
              {project.longDescription}
            </p>

            {/* Features */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={13} style={{ color: status.color }} />
                <p
                  className="text-xs uppercase tracking-[0.25em] font-bold"
                  style={{
                    color: status.color,
                    fontFamily: "var(--font-jetbrains)",
                  }}
                >
                  Key Features
                </p>
              </div>
              <ul className="flex flex-col gap-2.5">
                {project.features.map((f, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    <ChevronRight
                      size={13}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: status.color }}
                    />
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div className="mb-7">
              <p
                className="text-xs uppercase tracking-[0.25em] mb-3 font-bold"
                style={{
                  color: status.color,
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t, ti) => (
                  <motion.span
                    key={t}
                    className="px-3 py-1 rounded-lg text-xs font-bold"
                    style={{
                      background: `${status.color}10`,
                      color: status.color,
                      border: `1px solid ${status.color}25`,
                      fontFamily: "var(--font-jetbrains)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: ti * 0.04 }}
                    whileHover={{
                      scale: 1.08,
                      boxShadow: `0 0 12px ${status.color}44`,
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "var(--muted)",
                    color: "var(--foreground)",
                    border: "1px solid var(--card-border)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = status.color;
                    e.currentTarget.style.color = status.color;
                    e.currentTarget.style.boxShadow = `0 0 16px ${status.color}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    e.currentTarget.style.color = "var(--foreground)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Github size={15} /> View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all relative overflow-hidden"
                  style={{
                    background: status.color,
                    color: "#050508",
                    fontFamily: "var(--font-space-grotesk)",
                    boxShadow: `0 0 24px ${status.color}66`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 40px ${status.color}88`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 24px ${status.color}66`;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <ExternalLink size={15} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────
export function ProjectsSection() {
  const { projects } = portfolioData;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const heading = useScramble("PROJECTS", inView);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 0% 100%, var(--glow) 0%, transparent 70%)",
          opacity: 0.08,
        }}
      />
      <div
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--glow-secondary) 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.07,
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
            style={{
              color: "var(--accent)",
              fontFamily: "var(--font-jetbrains)",
            }}
          >
            // featured work
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "var(--foreground)",
            }}
          >
            {heading}
          </h2>
          <div className="section-heading-line mt-3 w-24" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {projects.map((project, i) => (
            <ProjectCard
              key={`${project.name}-${i}`}
              project={project}
              delay={i * 0.09}
              inView={inView}
              index={i}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
