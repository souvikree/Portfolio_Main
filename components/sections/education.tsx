"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { useScramble } from "@/hooks/use-scramble";
import { GraduationCap, BookOpen, MapPin, Calendar, Award } from "lucide-react";

const ICONS = [GraduationCap, BookOpen];

// ── Tilt card hook ────────────────────────────────────────────────────────────
function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [strength, -strength]),
    { stiffness: 300, damping: 30 },
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-strength, strength]),
    { stiffness: 300, damping: 30 },
  );
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, rotateX, rotateY, glowX, glowY, onMouseMove, onMouseLeave };
}

// ── Glitch text ───────────────────────────────────────────────────────────────
function GlitchText({ text, active }: { text: string; active: boolean }) {
  const [glitched, setGlitched] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      setGlitched(text);
      return;
    }
    let iter = 0;
    timerRef.current = setInterval(() => {
      setGlitched(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < iter) return text[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );
      iter += 0.6;
      if (iter >= text.length) {
        setGlitched(text);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 28);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, text]);

  return <span>{glitched}</span>;
}

// ── Scan line ─────────────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
      style={{
        background:
          "linear-gradient(90deg, transparent, var(--accent), transparent)",
        opacity: 0.12,
      }}
      animate={{ top: ["-2%", "102%"] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 2,
      }}
    />
  );
}

// ── Corner brackets ───────────────────────────────────────────────────────────
function Brackets({ active }: { active: boolean }) {
  const size = 14;
  const style = { stroke: "var(--accent)", strokeWidth: 1.5, fill: "none" };
  return (
    <>
      {/* TL */}
      <motion.svg
        className="absolute top-3 left-3"
        width={size}
        height={size}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path d={`M${size} 0 H0 V${size}`} {...style} />
      </motion.svg>
      {/* TR */}
      <motion.svg
        className="absolute top-3 right-3"
        width={size}
        height={size}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path d={`M0 0 H${size} V${size}`} {...style} />
      </motion.svg>
      {/* BL */}
      <motion.svg
        className="absolute bottom-3 left-3"
        width={size}
        height={size}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path d={`M${size} ${size} H0 V0`} {...style} />
      </motion.svg>
      {/* BR */}
      <motion.svg
        className="absolute bottom-3 right-3"
        width={size}
        height={size}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path d={`M0 ${size} H${size} V0`} {...style} />
      </motion.svg>
    </>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function SkillBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span
          className="text-[9px] uppercase tracking-widest"
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-jetbrains)",
          }}
        >
          {label}
        </span>
        <span
          className="text-[9px] font-bold"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-jetbrains)",
          }}
        >
          {value}%
        </span>
      </div>
      <div
        className="h-[3px] rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

// ── Education card ────────────────────────────────────────────────────────────
function EduCard({
  edu,
  index,
  inView,
}: {
  edu: (typeof portfolioData.education)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { ref, rotateX, rotateY, glowX, glowY, onMouseMove, onMouseLeave } =
    useTilt(8);
  const Icon = ICONS[index] ?? GraduationCap;

  // Extract year from duration string e.g. "Oct 2021 – Jun 2025" → "2021"
  const yearMatch = edu.duration.match(/\d{4}/);
  const year = yearMatch ? yearMatch[0] : "20XX";

  // Fake skill bars for visual interest
  const skillBars =
    index === 0
      ? [
          { label: "Core CS", value: 88 },
          { label: "Systems", value: 82 },
          { label: "Architecture", value: 76 },
        ]
      : [
          { label: "Physics", value: 91 },
          { label: "Mathematics", value: 94 },
          { label: "Chemistry", value: 85 },
        ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Timeline connector */}
      <div className="flex gap-0 items-stretch ml-26">
        {/* ── Left: Year stamp + line ── */}
        <div className="flex flex-col items-center mr-6 flex-shrink-0">
          {/* Year rotated */}
          <div className="relative flex-shrink-0">
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.2 + 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Hexagonal badge */}
              <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      "conic-gradient(var(--accent), var(--accent-secondary), var(--highlight), var(--accent))",
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div
                  className="absolute inset-[2px] flex items-center justify-center"
                  style={{
                    background: "var(--background)",
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                >
                  <Icon size={20} style={{ color: "var(--accent)" }} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Vertical line */}
          <motion.div
            className="w-px flex-1 mt-3"
            style={{
              background: "linear-gradient(180deg, var(--accent), transparent)",
            }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
          />
        </div>

        {/* ── Right: Card ── */}
        <div className="flex-1 mb-8 ml-6">
          {/* Year label above card */}
          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
          >
            <span
              className="text-[10px] font-black tracking-[0.3em] uppercase"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-jetbrains)",
              }}
            >
              // record_{String(index + 1).padStart(2, "0")}
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "var(--card-border)" }}
            />
            <span
              className="text-xs font-black tabular-nums"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-jetbrains)",
                opacity: 0.5,
              }}
            >
              {year}
            </span>
          </motion.div>

          {/* Main card with 3D tilt */}
          <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={() => {
              onMouseLeave();
              setHovered(false);
            }}
            onMouseEnter={() => setHovered(true)}
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
            }}
            className="relative rounded-2xl overflow-hidden cursor-default"
          >
            {/* Holographic glow that follows cursor */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
              style={{
                background: useTransform(
                  [glowX, glowY],
                  ([gx, gy]) =>
                    `radial-gradient(circle at ${gx}% ${gy}%, rgba(0,245,255,0.12) 0%, transparent 60%)`,
                ),
              }}
            />

            {/* Card border glow on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none z-0"
              animate={
                hovered
                  ? {
                      boxShadow:
                        "0 0 0 1px var(--accent), 0 0 40px rgba(0,245,255,0.15), 0 20px 60px rgba(0,0,0,0.5)",
                    }
                  : {
                      boxShadow:
                        "0 0 0 1px var(--card-border), 0 4px 20px rgba(0,0,0,0.3)",
                    }
              }
              transition={{ duration: 0.3 }}
            />

            {/* Card body */}
            <div
              className="relative z-10 p-6 sm:p-8"
              style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Scan line inside card */}
              {hovered && <ScanLine />}

              {/* Corner brackets */}
              <Brackets active={hovered} />

              {/* Top strip */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--accent), var(--accent-secondary), transparent)",
                }}
                animate={hovered ? { opacity: 1 } : { opacity: 0.4 }}
                transition={{ duration: 0.3 }}
              />

              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1 min-w-0">
                  {/* Status badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: "#00FF87",
                        boxShadow: "0 0 6px #00FF87",
                      }}
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.25em]"
                      style={{
                        color: "#00FF87",
                        fontFamily: "var(--font-jetbrains)",
                      }}
                    >
                      {index === 0
                        ? "Completed · Jun 2025"
                        : "Completed · Mar 2021"}
                    </span>
                  </div>

                  {/* Institution name with glitch */}
                  <h3
                    className="text-xl sm:text-2xl font-black leading-tight mb-1"
                    style={{
                      color: "var(--foreground)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    <GlitchText text={edu.institution} active={hovered} />
                  </h3>

                  <p
                    className="text-sm font-bold mb-0.5"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    {edu.degree}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    {edu.field}
                  </p>
                </div>

                {/* Score badge — large */}
                <motion.div
                  className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl relative overflow-hidden"
                  style={{
                    background: "rgba(0,245,255,0.04)",
                    border: "1px solid var(--card-border)",
                  }}
                  animate={
                    hovered
                      ? {
                          borderColor: "rgba(0,245,255,0.4)",
                          boxShadow: "0 0 20px rgba(0,245,255,0.15)",
                        }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  <Award
                    size={12}
                    style={{ color: "var(--accent)", marginBottom: 2 }}
                  />
                  <span
                    className="text-xs font-black leading-tight text-center px-1"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    {edu.score
                      .replace("CGPA: ", "")
                      .replace("Percentage: ", "")}
                  </span>
                  <span
                    className="text-[8px] uppercase tracking-wider mt-0.5"
                    style={{
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    {edu.score.includes("CGPA") ? "CGPA" : "Score"}
                  </span>
                </motion.div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-3 mb-5">
                {[
                  { icon: Calendar, text: edu.duration },
                  { icon: MapPin, text: edu.location },
                ].map(({ icon: MetaIcon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--card-border)",
                    }}
                  >
                    <MetaIcon
                      size={10}
                      style={{ color: "var(--accent)", flexShrink: 0 }}
                    />
                    <span
                      className="text-[10px] font-medium"
                      style={{
                        color: "var(--muted-foreground)",
                        fontFamily: "var(--font-jetbrains)",
                      }}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                className="h-px mb-5"
                style={{ background: "var(--card-border)" }}
              />

              {/* Skill bars */}
              {/* <div className="flex flex-col gap-3 mb-5">
                <span
                  className="text-[9px] uppercase tracking-[0.25em] mb-1"
                  style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-jetbrains)",
                    opacity: 0.6,
                  }}
                >
                  // core strengths
                </span>
                {inView &&
                  skillBars.map((bar, bi) => (
                    <SkillBar
                      key={bar.label}
                      {...bar}
                      delay={index * 0.2 + bi * 0.12 + 0.6}
                    />
                  ))}
              </div> */}

              {/* Highlights */}
              {edu.highlights && (
                <div className="flex flex-col gap-2">
                  <span
                    className="text-[9px] uppercase tracking-[0.25em] mb-1"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-jetbrains)",
                      opacity: 0.6,
                    }}
                  >
                    // highlights
                  </span>
                  {edu.highlights.map((h, j) => (
                    <motion.div
                      key={j}
                      className="flex items-start gap-2.5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.2 + j * 0.08 + 0.7,
                      }}
                    >
                      <span
                        className="text-[10px] flex-shrink-0 mt-0.5 font-black"
                        style={{
                          color: "var(--accent)",
                          fontFamily: "var(--font-jetbrains)",
                        }}
                      >
                        ▸
                      </span>
                      <span
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {h}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Bottom terminal line */}
              <motion.div
                className="mt-5 pt-4 flex items-center gap-2"
                style={{ borderTop: "1px solid var(--card-border)" }}
                animate={hovered ? { opacity: 1 } : { opacity: 0.4 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="text-[9px]"
                  style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-jetbrains)",
                  }}
                >
                  $
                </span>
                <span
                  className="text-[9px]"
                  style={{
                    color: "var(--muted-foreground)",
                    fontFamily: "var(--font-jetbrains)",
                  }}
                >
                  cat {edu.institution.toLowerCase().replace(/\s+/g, "-")}.log
                </span>
                <motion.span
                  className="inline-block w-1.5 h-3 ml-0.5"
                  style={{ background: "var(--accent)" }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function EducationSection() {
  const { education } = portfolioData;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const heading = useScramble("EDUCATION", inView);

  return (
    <section
      id="education"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Background elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.2,
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-2/3 h-2/3 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 100% 100%, var(--glow) 0%, transparent 70%)",
          opacity: 0.08,
        }}
      />
      <div
        className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 0% 0%, var(--glow-secondary) 0%, transparent 70%)",
          opacity: 0.06,
        }}
      />

      {/* Floating year watermarks */}
      <div className="absolute right-8 top-1/4 pointer-events-none select-none hidden lg:block">
        <span
          className="text-[140px] font-black"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgba(0,245,255,0.04)",
            fontFamily: "var(--font-space-grotesk)",
            lineHeight: 1,
          }}
        >
          EDU
        </span>
      </div>

      <div className="section-container relative z-10">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              className="h-px w-8"
              style={{ background: "var(--accent)" }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
            <p
              className="text-xs tracking-[0.35em] uppercase"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-jetbrains)",
              }}
            >
              // academic background
            </p>
          </div>
          <h2
            className="text-5xl sm:text-7xl font-black tracking-tight"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "var(--foreground)",
              letterSpacing: "0.04em",
            }}
          >
            {heading}
          </h2>
          <div className="flex items-center gap-4 mt-3">
            <div className="section-heading-line w-24" />
            <span
              className="text-xs"
              style={{
                color: "var(--muted-foreground)",
                fontFamily: "var(--font-jetbrains)",
                opacity: 0.5,
              }}
            >
              {education.length} records found
            </span>
          </div>
        </motion.div>

        {/* ── Cards ── */}
        <div className="max-w-5xl">
          {education.map((edu, i) => (
            <EduCard
              key={edu.institution}
              edu={edu}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
