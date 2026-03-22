"use client";

import { useEffect, useRef, useState } from "react";

export function CursorSpotlight() {
  const divRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Disable on touch devices — no cursor to follow
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = divRef.current;
    if (!el) return;

    let rafId = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!active) setActive(true);
        el.style.setProperty("--cx", `${e.clientX}px`);
        el.style.setProperty("--cy", `${e.clientY}px`);
      });
    };

    const onLeave = () => setActive(false);
    const onEnter = () => setActive(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [active]);

  return (
    <div
      ref={divRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        // Radial gradient centered at cursor position via CSS variables
        background: `radial-gradient(
          600px circle at var(--cx, -9999px) var(--cy, -9999px),
          rgba(0, 245, 255, 0.045) 0%,
          rgba(123, 47, 255, 0.02) 40%,
          transparent 70%
        )`,
        opacity: active ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    />
  );
}
