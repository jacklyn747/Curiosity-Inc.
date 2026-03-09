"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

const MonolithScene = dynamic(
  () => import("@/components/three/MonolithScene").then((m) => m.MonolithScene),
  { ssr: false }
);

// Geometric diagram SVG that assembles on load
function GeoDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const lines = svgRef.current.querySelectorAll(".draw-line");
    const circles = svgRef.current.querySelectorAll(".appear-circle");
    const arcs = svgRef.current.querySelectorAll(".draw-arc");

    gsap.set(lines, { strokeDasharray: 300, strokeDashoffset: 300 });
    gsap.set(arcs, { strokeDasharray: 500, strokeDashoffset: 500 });
    gsap.set(circles, { scale: 0, transformOrigin: "center" });

    const tl = gsap.timeline({ delay: 1.2 });
    tl.to(lines, { strokeDashoffset: 0, duration: 1.4, ease: "power2.out", stagger: 0.12 })
      .to(arcs, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", stagger: 0.1 }, "-=1.0")
      .to(circles, { scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.1 }, "-=0.8");
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 500 500"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Outer orbit ring */}
      <circle className="draw-arc" cx="250" cy="250" r="220" stroke="rgba(234,228,218,0.06)" strokeWidth="1" />
      <circle className="draw-arc" cx="250" cy="250" r="160" stroke="rgba(234,228,218,0.08)" strokeWidth="1" />
      <circle className="draw-arc" cx="250" cy="250" r="95" stroke="rgba(128,139,197,0.15)" strokeWidth="1" />

      {/* Central structure lines */}
      <line className="draw-line" x1="30" y1="250" x2="470" y2="250" stroke="rgba(234,228,218,0.07)" strokeWidth="1" />
      <line className="draw-line" x1="250" y1="30" x2="250" y2="470" stroke="rgba(234,228,218,0.07)" strokeWidth="1" />
      <line className="draw-line" x1="72" y1="72" x2="428" y2="428" stroke="rgba(234,228,218,0.04)" strokeWidth="1" />
      <line className="draw-line" x1="428" y1="72" x2="72" y2="428" stroke="rgba(234,228,218,0.04)" strokeWidth="1" />

      {/* Node markers on orbit */}
      <circle className="appear-circle" cx="250" cy="30" r="3.5" fill="rgba(128,139,197,0.6)" />
      <circle className="appear-circle" cx="470" cy="250" r="3.5" fill="rgba(158,214,223,0.5)" />
      <circle className="appear-circle" cx="250" cy="470" r="3.5" fill="rgba(128,139,197,0.6)" />
      <circle className="appear-circle" cx="30" cy="250" r="3.5" fill="rgba(158,214,223,0.5)" />

      {/* Mid-ring nodes */}
      <circle className="appear-circle" cx="410" cy="90" r="5" fill="rgba(237,119,60,0.5)" />
      <circle className="appear-circle" cx="410" cy="410" r="3" fill="rgba(128,139,197,0.4)" />
      <circle className="appear-circle" cx="90" cy="90" r="3" fill="rgba(158,214,223,0.4)" />
      <circle className="appear-circle" cx="90" cy="410" r="5" fill="rgba(237,119,60,0.4)" />

      {/* Center node */}
      <circle className="appear-circle" cx="250" cy="250" r="10" stroke="rgba(128,139,197,0.5)" strokeWidth="1.5" />
      <circle className="appear-circle" cx="250" cy="250" r="3" fill="rgba(128,139,197,0.8)" />

      {/* Spoke connector lines to nodes */}
      <line className="draw-line" x1="250" y1="240" x2="250" y2="90" stroke="rgba(128,139,197,0.2)" strokeWidth="1" strokeDasharray="3 5" />
      <line className="draw-line" x1="260" y1="250" x2="410" y2="250" stroke="rgba(158,214,223,0.2)" strokeWidth="1" strokeDasharray="3 5" />
      <line className="draw-line" x1="250" y1="260" x2="250" y2="410" stroke="rgba(128,139,197,0.2)" strokeWidth="1" strokeDasharray="3 5" />
      <line className="draw-line" x1="240" y1="250" x2="90" y2="250" stroke="rgba(158,214,223,0.2)" strokeWidth="1" strokeDasharray="3 5" />

      {/* Arc section indicator */}
      <path
        className="draw-arc"
        d="M 250 155 A 95 95 0 0 1 345 250"
        stroke="rgba(237,119,60,0.3)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Staggered text reveal — poster assembly style
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo("[data-hero-label]",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }
      )
      .fromTo("[data-hero-line]",
        { opacity: 0, y: 60, skewY: 1.5 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 },
        "-=0.3"
      )
      .fromTo("[data-hero-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: "expo.out", transformOrigin: "left" },
        "-=0.6"
      )
      .fromTo("[data-hero-sub]",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
        "-=0.5"
      )
      .fromTo("[data-hero-cta]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.1 },
        "-=0.5"
      )
      .fromTo("[data-hero-scroll]",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.2"
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden geo-grid"
      style={{ background: "var(--ink)" }}
    >
      {/* Three.js scene — right half background */}
      <div className="absolute inset-0 z-0">
        <MonolithScene scrollY={scrollY} />
      </div>

      {/* Geometric diagram overlay — right side */}
      <div className="absolute right-0 top-0 w-1/2 h-full z-[1] opacity-70 pointer-events-none">
        <GeoDiagram />
      </div>

      {/* Left edge vertical rule */}
      <div
        className="absolute left-8 md:left-14 top-0 bottom-0 z-[2] pointer-events-none"
        style={{ width: "1px", background: "rgba(234,228,218,0.08)" }}
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--ink), transparent)" }}
      />

      {/* Content — poster layout */}
      <div className="relative z-[3] flex flex-col justify-center min-h-screen px-8 md:px-14 max-w-[1440px] mx-auto w-full">
        <div className="max-w-[820px] pt-28">

          {/* Section label */}
          <div
            data-hero-label
            className="opacity-0 flex items-center gap-4 mb-10"
          >
            <span className="label-type">Systems Studio</span>
            <span className="rule-line w-12 inline-block" />
            <span className="label-type">Est. 2024</span>
          </div>

          {/* Poster-style block headline */}
          <h1 className="overflow-hidden mb-0" aria-label="Ideas need structure">
            <span
              data-hero-line
              className="display-type opacity-0 block"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(6rem, 14vw, 16rem)",
                color: "var(--paper)",
                lineHeight: 0.88,
              }}
            >
              Ideas
            </span>
            <span
              data-hero-line
              className="display-type opacity-0 block"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(6rem, 14vw, 16rem)",
                color: "var(--tangerine)",
                lineHeight: 0.88,
              }}
            >
              Need
            </span>
            <span
              data-hero-line
              className="display-type opacity-0 block"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(6rem, 14vw, 16rem)",
                color: "var(--paper)",
                lineHeight: 0.88,
              }}
            >
              Structure.
            </span>
          </h1>

          {/* Thin rule under headline */}
          <div
            data-hero-rule
            className="mt-8 mb-8 h-px"
            style={{ background: "rgba(234,228,218,0.15)", transformOrigin: "left" }}
          />

          {/* Sub-headline */}
          <p
            data-hero-sub
            className="opacity-0 mb-10"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(0.85rem, 1.3vw, 1rem)",
              fontWeight: 400,
              lineHeight: 1.75,
              color: "rgba(234,228,218,0.5)",
              maxWidth: "420px",
            }}
          >
            We build the content infrastructure behind serious operators —
            systems that produce, prove, and distribute ideas at scale.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/contact" data-hero-cta className="btn-primary opacity-0">
              <span>Book a Build Call</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/builds" data-hero-cta className="btn-secondary opacity-0">
              <span>See the Systems</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-scroll
        className="absolute bottom-10 left-8 md:left-14 z-[3] flex items-center gap-4 opacity-0"
      >
        <div className="w-px h-10 relative overflow-hidden" style={{ background: "rgba(234,228,218,0.1)" }}>
          <div
            className="absolute top-0 w-full"
            style={{
              height: "40%",
              background: "var(--tangerine)",
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
        </div>
        <span className="label-type">Scroll</span>
      </div>
    </section>
  );
}
