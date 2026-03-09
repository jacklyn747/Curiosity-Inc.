"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ─── Lens cursor — chaos / order states ──────────────────────────────────────
// data-chaos    → interference rings, expanded radius
// data-resolved → tight focal ring, sharp dot
// default       → standard lens form

export function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const lensRef  = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot   = dotRef.current;
    const lens  = lensRef.current;
    const ring1 = ring1Ref.current;
    const ring2 = ring2Ref.current;
    if (!dot || !lens || !ring1 || !ring2) return;

    let mouseX = 0;
    let mouseY = 0;
    let lensX  = 0;
    let lensY  = 0;
    let rafId: number;

    // Move dot instantly, lens follows with lag
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.12,
        ease: "power3.out",
      });
    };

    const animate = () => {
      lensX += (mouseX - lensX) * 0.09;
      lensY += (mouseY - lensY) * 0.09;
      gsap.set(lens, { x: lensX, y: lensY });
      // Interference rings float slightly offset
      gsap.set(ring1, { x: lensX - 1.5, y: lensY - 1 });
      gsap.set(ring2, { x: lensX + 1,   y: lensY + 1.5 });
      rafId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", onMouseMove);
    document.body.classList.add("cursor-ready");

    // ── State: interactive hover ─────────────────────────────────────────────
    const onHoverEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const isChaos    = el.hasAttribute("data-chaos");
      const isResolved = el.hasAttribute("data-resolved");

      if (isChaos) {
        // Chaos state: rings expand, dot destabilises
        gsap.to(lens,  { scale: 2.8, opacity: 0.35, borderColor: "rgba(128,139,197,0.4)", duration: 0.5, ease: "expo.out" });
        gsap.to(ring1, { scale: 2.0, opacity: 0.25, borderColor: "rgba(128,139,197,0.25)", duration: 0.6, ease: "expo.out" });
        gsap.to(ring2, { scale: 3.2, opacity: 0.15, borderColor: "rgba(128,139,197,0.15)", duration: 0.7, ease: "expo.out" });
        gsap.to(dot,   { scale: 0.5, opacity: 0.4, duration: 0.3 });
      } else if (isResolved) {
        // Resolved state: tight focal ring, crisp dot
        gsap.to(lens,  { scale: 1.2, opacity: 1, borderColor: "rgba(237,119,60,0.9)", borderWidth: "1.5px", duration: 0.35, ease: "expo.out" });
        gsap.to(ring1, { scale: 0, opacity: 0, duration: 0.2 });
        gsap.to(ring2, { scale: 0, opacity: 0, duration: 0.2 });
        gsap.to(dot,   { scale: 1.5, opacity: 1, backgroundColor: "rgba(237,119,60,1)", duration: 0.3 });
      } else {
        // Default interactive: clean expand
        gsap.to(lens,  { scale: 2.2, opacity: 0.7, borderColor: "rgba(234,228,218,0.5)", duration: 0.4, ease: "expo.out" });
        gsap.to(ring1, { scale: 1.6, opacity: 0.2, duration: 0.45, ease: "expo.out" });
        gsap.to(ring2, { scale: 2.8, opacity: 0.1, duration: 0.5, ease: "expo.out" });
        gsap.to(dot,   { scale: 0, duration: 0.25 });
      }
    };

    const onHoverLeave = () => {
      gsap.to(lens,  { scale: 1, opacity: 0.65, borderColor: "rgba(128,139,197,0.65)", borderWidth: "1px", duration: 0.4, ease: "expo.out" });
      gsap.to(ring1, { scale: 1, opacity: 0.22, borderColor: "rgba(128,139,197,0.28)", duration: 0.45, ease: "expo.out" });
      gsap.to(ring2, { scale: 1, opacity: 0.12, borderColor: "rgba(128,139,197,0.18)", duration: 0.5, ease: "expo.out" });
      gsap.to(dot,   { scale: 1, opacity: 0.9, backgroundColor: "rgba(128,139,197,0.9)", duration: 0.3 });
    };

    // ── Attach to all interactives ────────────────────────────────────────────
    const attach = () => {
      const els = document.querySelectorAll("a, button, [data-cursor], [data-chaos], [data-resolved]");
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onHoverEnter);
        el.removeEventListener("mouseleave", onHoverLeave);
        el.addEventListener("mouseenter", onHoverEnter);
        el.addEventListener("mouseleave", onHoverLeave);
      });
    };

    attach();

    // Re-attach on DOM changes (SPA navigation)
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.classList.remove("cursor-ready");
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Center dot — sharp focal point */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: "rgba(128,139,197,0.9)",
          transform: "translate(-50%, -50%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Primary lens ring */}
      <div
        ref={lensRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1px solid rgba(128,139,197,0.65)",
          transform: "translate(-50%, -50%)",
          opacity: 0.65,
        }}
      />

      {/* Interference ring 1 — slightly smaller */}
      <div
        ref={ring1Ref}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: "1px solid rgba(128,139,197,0.28)",
          transform: "translate(-50%, -50%)",
          opacity: 0.22,
        }}
      />

      {/* Interference ring 2 — larger, very faint */}
      <div
        ref={ring2Ref}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "1px solid rgba(128,139,197,0.18)",
          transform: "translate(-50%, -50%)",
          opacity: 0.12,
        }}
      />
    </>
  );
}
