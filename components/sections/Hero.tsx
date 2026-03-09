"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

const MonolithScene = dynamic(
  () => import("@/components/three/MonolithScene").then((m) => m.MonolithScene),
  { ssr: false }
);

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollY = useRef(0);

  // Passive scroll tracker passed to Three.js scene
  useEffect(() => {
    const handleScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // RESOLUTION reveal timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // ── 0 → 1.8s: pure interference, nothing visible ──────────────────────

      // ── 1.8s: "RESOLUTION" word flash ─────────────────────────────────────
      tl.fromTo(
        "[data-resolution-flash]",
        { opacity: 0, scale: 0.94, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "expo.out",
        },
        1.8
      )
        .to(
          "[data-resolution-flash]",
          { opacity: 0, filter: "blur(6px)", duration: 0.6, ease: "expo.in" },
          3.0
        );

      // ── 3.0s: brand label slides in ───────────────────────────────────────
      tl.fromTo(
        "[data-hero-label]",
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
        3.0
      );

      // ── 3.4s: headline lines blur in, one by one ──────────────────────────
      tl.fromTo(
        "[data-hero-line]",
        { opacity: 0, y: 28, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.38,
        },
        3.4
      );

      // ── 5.2s: thin rule ───────────────────────────────────────────────────
      tl.fromTo(
        "[data-hero-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: "expo.out", transformOrigin: "left" },
        5.0
      );

      // ── 5.4s: sub-headline blurs in ───────────────────────────────────────
      tl.fromTo(
        "[data-hero-sub]",
        { opacity: 0, y: 14, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "expo.out" },
        5.2
      );

      // ── 5.8s: CTAs stagger in ─────────────────────────────────────────────
      tl.fromTo(
        "[data-hero-cta]",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.1 },
        5.6
      );

      // ── 6.2s: scroll indicator ────────────────────────────────────────────
      tl.fromTo(
        "[data-hero-scroll]",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        6.0
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
      {/* Three.js scene — full bleed */}
      <div className="absolute inset-0 z-0">
        <MonolithScene scrollY={scrollY} />
      </div>

      {/* Left edge vertical rule */}
      <div
        className="absolute left-8 md:left-14 top-0 bottom-0 z-[2] pointer-events-none"
        style={{ width: "1px", background: "rgba(234,228,218,0.07)" }}
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--ink), transparent)" }}
      />

      {/* RESOLUTION flash — centered, large, momentary */}
      <div
        data-resolution-flash
        className="absolute inset-0 z-[4] flex items-center justify-center pointer-events-none opacity-0"
      >
        <span
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(4rem, 12vw, 11rem)",
            color: "var(--lavender)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            opacity: 0.55,
            mixBlendMode: "screen",
          }}
        >
          RESOLUTION
        </span>
      </div>

      {/* Content — poster layout */}
      <div className="relative z-[3] flex flex-col justify-center min-h-screen px-8 md:px-14 max-w-[1440px] mx-auto w-full">
        <div className="max-w-[860px] pt-28">

          {/* Brand label */}
          <div
            data-hero-label
            className="opacity-0 flex items-center gap-4 mb-10"
          >
            <span className="label-type">Systems Studio</span>
            <span className="rule-line w-12 inline-block" />
            <span className="label-type">Est. 2024</span>
          </div>

          {/* Headline — 4 lines, sequential blur reveal */}
          <h1 className="overflow-visible mb-0" aria-label="Most content becomes noise. Not yours.">

            <span
              data-hero-line
              className="opacity-0 block"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(5.5rem, 12vw, 14rem)",
                color: "var(--paper)",
                lineHeight: 0.88,
                letterSpacing: "0.02em",
              }}
            >
              Most content
            </span>

            <span
              data-hero-line
              className="opacity-0 block"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(5.5rem, 12vw, 14rem)",
                color: "var(--tangerine)",
                lineHeight: 0.88,
                letterSpacing: "0.02em",
              }}
            >
              becomes noise.
            </span>

            <span
              data-hero-line
              className="opacity-0 block"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(5.5rem, 12vw, 14rem)",
                color: "var(--paper)",
                lineHeight: 0.88,
                letterSpacing: "0.02em",
              }}
            >
              Not yours.
            </span>

          </h1>

          {/* Thin rule under headline */}
          <div
            data-hero-rule
            className="mt-8 mb-8 h-px"
            style={{
              background: "rgba(234,228,218,0.14)",
              transformOrigin: "left",
            }}
          />

          {/* Sub-headline */}
          <p
            data-hero-sub
            className="opacity-0 mb-10"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(0.82rem, 1.3vw, 1rem)",
              fontWeight: 400,
              lineHeight: 1.78,
              color: "rgba(234,228,218,0.48)",
              maxWidth: "400px",
            }}
          >
            Three transmissions. One receiver.<br />
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
        <div className="w-px h-10 relative overflow-hidden" style={{ background: "rgba(234,228,218,0.08)" }}>
          <div
            className="absolute top-0 w-full"
            style={{
              height: "40%",
              background: "var(--tangerine)",
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
        </div>
        <span className="label-type" style={{ letterSpacing: "0.3em" }}>↓ Scroll to tune</span>
      </div>
    </section>
  );
}
