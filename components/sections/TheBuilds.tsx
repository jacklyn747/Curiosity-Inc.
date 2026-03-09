"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Geometric module diagrams — each system gets a unique circuit-style diagram
function DiagramCSS() {
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden="true" className="w-full h-full">
      {/* Pipeline flow */}
      <rect x="10" y="50" width="36" height="20" rx="2" stroke="rgba(128,139,197,0.5)" strokeWidth="1" />
      <text x="28" y="63" textAnchor="middle" fontSize="6" fill="rgba(128,139,197,0.8)" fontFamily="sans-serif">BRIEF</text>
      <line x1="46" y1="60" x2="58" y2="60" stroke="rgba(128,139,197,0.3)" strokeWidth="1" />
      <rect x="58" y="50" width="36" height="20" rx="2" stroke="rgba(128,139,197,0.5)" strokeWidth="1" />
      <text x="76" y="63" textAnchor="middle" fontSize="6" fill="rgba(128,139,197,0.8)" fontFamily="sans-serif">DRAFT</text>
      <line x1="94" y1="60" x2="106" y2="60" stroke="rgba(128,139,197,0.3)" strokeWidth="1" />
      <rect x="106" y="50" width="36" height="20" rx="2" stroke="rgba(128,139,197,0.5)" strokeWidth="1" />
      <text x="124" y="63" textAnchor="middle" fontSize="6" fill="rgba(128,139,197,0.8)" fontFamily="sans-serif">REVIEW</text>
      <line x1="142" y1="60" x2="154" y2="60" stroke="rgba(128,139,197,0.3)" strokeWidth="1" />
      <rect x="154" y="50" width="36" height="20" rx="2" stroke="rgba(237,119,60,0.6)" strokeWidth="1" fill="rgba(237,119,60,0.05)" />
      <text x="172" y="63" textAnchor="middle" fontSize="6" fill="rgba(237,119,60,0.9)" fontFamily="sans-serif">LIVE</text>
      {/* Node connections */}
      <circle cx="28" cy="30" r="5" stroke="rgba(128,139,197,0.4)" strokeWidth="1" />
      <line x1="28" y1="35" x2="28" y2="50" stroke="rgba(128,139,197,0.2)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="76" cy="30" r="5" stroke="rgba(128,139,197,0.4)" strokeWidth="1" />
      <line x1="76" y1="35" x2="76" y2="50" stroke="rgba(128,139,197,0.2)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="124" cy="30" r="5" stroke="rgba(128,139,197,0.4)" strokeWidth="1" />
      <line x1="124" y1="35" x2="124" y2="50" stroke="rgba(128,139,197,0.2)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="172" cy="30" r="7" stroke="rgba(237,119,60,0.5)" strokeWidth="1" />
      <circle cx="172" cy="30" r="3" fill="rgba(237,119,60,0.6)" />
      <line x1="172" y1="37" x2="172" y2="50" stroke="rgba(237,119,60,0.3)" strokeWidth="1" strokeDasharray="2 3" />
      {/* Bottom quality arc */}
      <path d="M 10 90 Q 100 105 190 90" stroke="rgba(128,139,197,0.2)" strokeWidth="1" fill="none" />
    </svg>
  );
}

function DiagramVKB() {
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden="true" className="w-full h-full">
      {/* Central knowledge node */}
      <circle cx="100" cy="60" r="28" stroke="rgba(36,94,85,0.4)" strokeWidth="1" />
      <circle cx="100" cy="60" r="16" stroke="rgba(36,94,85,0.3)" strokeWidth="1" />
      <circle cx="100" cy="60" r="6" fill="rgba(36,94,85,0.5)" />
      {/* Incoming claims */}
      {[
        { x: 20, y: 20, label: "Claim" },
        { x: 180, y: 20, label: "Source" },
        { x: 20, y: 100, label: "Expert" },
        { x: 180, y: 100, label: "Data" },
      ].map(({ x, y, label }) => (
        <g key={label}>
          <line x1={x} y1={y} x2="100" y2="60" stroke="rgba(36,94,85,0.2)" strokeWidth="0.8" strokeDasharray="3 4" />
          <circle cx={x} cy={y} r="8" stroke="rgba(36,94,85,0.35)" strokeWidth="1" />
          <text x={x} y={y + 3.5} textAnchor="middle" fontSize="5" fill="rgba(36,94,85,0.7)" fontFamily="sans-serif">{label}</text>
        </g>
      ))}
      {/* Citation mark */}
      <text x="100" y="97" textAnchor="middle" fontSize="6" fill="rgba(36,94,85,0.5)" fontFamily="sans-serif" letterSpacing="1">VERIFIED</text>
    </svg>
  );
}

function DiagramAH() {
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden="true" className="w-full h-full">
      {/* Distribution funnel */}
      <path d="M 40 20 L 160 20 L 130 55 L 70 55 Z" stroke="rgba(158,214,223,0.35)" strokeWidth="1" fill="rgba(158,214,223,0.04)" />
      <path d="M 70 60 L 130 60 L 120 90 L 80 90 Z" stroke="rgba(158,214,223,0.4)" strokeWidth="1" fill="rgba(158,214,223,0.06)" />
      <path d="M 80 95 L 120 95 L 115 115 L 85 115 Z" stroke="rgba(237,119,60,0.5)" strokeWidth="1" fill="rgba(237,119,60,0.06)" />
      {/* Labels */}
      <text x="100" y="37" textAnchor="middle" fontSize="6" fill="rgba(158,214,223,0.7)" fontFamily="sans-serif">CONTENT LIBRARY</text>
      <text x="100" y="77" textAnchor="middle" fontSize="6" fill="rgba(158,214,223,0.7)" fontFamily="sans-serif">EMAIL LIST</text>
      <text x="100" y="107" textAnchor="middle" fontSize="6" fill="rgba(237,119,60,0.8)" fontFamily="sans-serif">PAYWALL</text>
      {/* Dots on levels */}
      <circle cx="45" cy="37" r="2.5" fill="rgba(158,214,223,0.4)" />
      <circle cx="155" cy="37" r="2.5" fill="rgba(158,214,223,0.4)" />
      <circle cx="72" cy="75" r="2.5" fill="rgba(158,214,223,0.4)" />
      <circle cx="128" cy="75" r="2.5" fill="rgba(158,214,223,0.4)" />
    </svg>
  );
}

const builds = [
  {
    number: "01",
    name: "Content\nServices\nSystem",
    tagline: "BRIEF → DRAFT → REVIEW → APPROVE",
    desc: "A complete pipeline for producing content at volume without chaos. Every role, every handoff, every decision — documented and repeatable.",
    solves: ["Revision loops", "Vague feedback", "Delivery chaos"],
    accent: "#808BC5",
    Diagram: DiagramCSS,
  },
  {
    number: "02",
    name: "Verified\nKnowledge\nBase",
    tagline: "CLAIM → CITATION → REVIEW",
    desc: "Your expertise, documented and defensible. Turns institutional knowledge into a structured system that AI can cite and humans can trust.",
    solves: ["AI credibility problems", "Expertise fragmentation", "Knowledge loss"],
    accent: "#245E55",
    Diagram: DiagramVKB,
  },
  {
    number: "03",
    name: "Audience Hub\n+\nResource Library",
    tagline: "PAYWALL → LIBRARY → EMAIL",
    desc: "Owned distribution infrastructure. Your content library, your email list, your monetization layer — built as a system, not scattered across platforms.",
    solves: ["Rented audience", "Scattered resources", "Platform dependency"],
    accent: "#9ED6DF",
    Diagram: DiagramAH,
  },
];

export function TheBuilds() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-build-header]",
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: "[data-build-header]", start: "top 82%" } }
      );
      gsap.fromTo("[data-build-card]",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.18,
          scrollTrigger: { trigger: "[data-build-card]", start: "top 78%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="geo-grid"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-14 py-28 md:py-40">

        {/* Header */}
        <div data-build-header className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="label-type">The Systems</span>
            <span className="rule-line w-12 inline-block" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <h2
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(3.5rem, 7vw, 8rem)",
                color: "var(--paper)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
              }}
            >
              Three builds.<br />
              <span style={{ color: "var(--tangerine)" }}>One</span><br />
              infrastructure.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(0.85rem, 1.3vw, 1rem)",
                color: "rgba(234,228,218,0.45)",
                lineHeight: 1.75,
              }}
            >
              Each system solves a distinct layer of your content operation.
              Together, they form a complete stack.
            </p>
          </div>
        </div>

        {/* System module cards */}
        <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(234,228,218,0.08)" }}>
          {builds.map(({ number, name, tagline, desc, solves, accent, Diagram }) => (
            <article
              key={number}
              data-build-card
              className="relative flex flex-col"
              style={{ background: "var(--ink)" }}
            >
              {/* Module header */}
              <div
                className="px-6 pt-8 pb-5 border-b"
                style={{ borderColor: "rgba(234,228,218,0.08)" }}
              >
                <div className="flex items-baseline justify-between mb-5">
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: accent,
                    }}
                  >
                    System {number}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.55rem",
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(234,228,218,0.2)",
                    }}
                  >
                    {tagline}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    color: "var(--paper)",
                    lineHeight: 0.92,
                    letterSpacing: "0.02em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {name}
                </h3>
              </div>

              {/* Diagram area */}
              <div
                className="h-36 px-6 py-4 border-b"
                style={{ borderColor: "rgba(234,228,218,0.08)" }}
              >
                <Diagram />
              </div>

              {/* Description + solves */}
              <div className="px-6 py-6 flex flex-col flex-1">
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.82rem",
                    color: "rgba(234,228,218,0.45)",
                    lineHeight: 1.7,
                    marginBottom: "1.25rem",
                  }}
                >
                  {desc}
                </p>
                <div className="mb-5">
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: accent,
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Solves
                  </span>
                  <ul>
                    {solves.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2 mb-1"
                        style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(234,228,218,0.35)" }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: accent, opacity: 0.7, flexShrink: 0 }} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/builds"
                  className="mt-auto flex items-center gap-2 group"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: accent,
                  }}
                >
                  <span>Learn More</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
