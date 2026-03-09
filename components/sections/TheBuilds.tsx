"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Geometric module diagrams ───────────────────────────────────────────────

function DiagramCSS() {
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden="true" className="w-full h-full">
      {/* Pipeline */}
      <rect x="10" y="50" width="36" height="20" rx="2" stroke="rgba(128,139,197,0.45)" strokeWidth="1" />
      <text x="28" y="63" textAnchor="middle" fontSize="6" fill="rgba(128,139,197,0.75)" fontFamily="sans-serif">BRIEF</text>
      <line x1="46" y1="60" x2="58" y2="60" stroke="rgba(128,139,197,0.25)" strokeWidth="1" />

      <rect x="58" y="50" width="36" height="20" rx="2" stroke="rgba(128,139,197,0.45)" strokeWidth="1" />
      <text x="76" y="63" textAnchor="middle" fontSize="6" fill="rgba(128,139,197,0.75)" fontFamily="sans-serif">DRAFT</text>
      <line x1="94" y1="60" x2="106" y2="60" stroke="rgba(128,139,197,0.25)" strokeWidth="1" />

      <rect x="106" y="50" width="36" height="20" rx="2" stroke="rgba(128,139,197,0.45)" strokeWidth="1" />
      <text x="124" y="63" textAnchor="middle" fontSize="6" fill="rgba(128,139,197,0.75)" fontFamily="sans-serif">REVIEW</text>
      <line x1="142" y1="60" x2="154" y2="60" stroke="rgba(128,139,197,0.25)" strokeWidth="1" />

      <rect x="154" y="50" width="36" height="20" rx="2" stroke="rgba(237,119,60,0.55)" strokeWidth="1" fill="rgba(237,119,60,0.05)" />
      <text x="172" y="63" textAnchor="middle" fontSize="6" fill="rgba(237,119,60,0.88)" fontFamily="sans-serif">LIVE</text>

      {/* Node connections */}
      <circle cx="28" cy="30" r="5" stroke="rgba(128,139,197,0.38)" strokeWidth="1" />
      <line x1="28" y1="35" x2="28" y2="50" stroke="rgba(128,139,197,0.18)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="76" cy="30" r="5" stroke="rgba(128,139,197,0.38)" strokeWidth="1" />
      <line x1="76" y1="35" x2="76" y2="50" stroke="rgba(128,139,197,0.18)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="124" cy="30" r="5" stroke="rgba(128,139,197,0.38)" strokeWidth="1" />
      <line x1="124" y1="35" x2="124" y2="50" stroke="rgba(128,139,197,0.18)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="172" cy="30" r="7" stroke="rgba(237,119,60,0.5)" strokeWidth="1" />
      <circle cx="172" cy="30" r="3" fill="rgba(237,119,60,0.6)" />
      <line x1="172" y1="37" x2="172" y2="50" stroke="rgba(237,119,60,0.28)" strokeWidth="1" strokeDasharray="2 3" />

      <path d="M 10 90 Q 100 105 190 90" stroke="rgba(128,139,197,0.18)" strokeWidth="1" fill="none" />
    </svg>
  );
}

function DiagramVKB() {
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden="true" className="w-full h-full">
      <circle cx="100" cy="60" r="28" stroke="rgba(61,138,122,0.38)" strokeWidth="1" />
      <circle cx="100" cy="60" r="16" stroke="rgba(61,138,122,0.28)" strokeWidth="1" />
      <circle cx="100" cy="60" r="6" fill="rgba(61,138,122,0.5)" />
      {[
        { x: 20, y: 20, label: "Claim" },
        { x: 180, y: 20, label: "Source" },
        { x: 20, y: 100, label: "Expert" },
        { x: 180, y: 100, label: "Data" },
      ].map(({ x, y, label }) => (
        <g key={label}>
          <line x1={x} y1={y} x2="100" y2="60" stroke="rgba(61,138,122,0.18)" strokeWidth="0.8" strokeDasharray="3 4" />
          <circle cx={x} cy={y} r="8" stroke="rgba(61,138,122,0.32)" strokeWidth="1" />
          <text x={x} y={y + 3.5} textAnchor="middle" fontSize="5" fill="rgba(61,138,122,0.65)" fontFamily="sans-serif">{label}</text>
        </g>
      ))}
      <text x="100" y="97" textAnchor="middle" fontSize="6" fill="rgba(61,138,122,0.48)" fontFamily="sans-serif" letterSpacing="1">VERIFIED</text>
    </svg>
  );
}

function DiagramAI() {
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden="true" className="w-full h-full">
      {/* Human workflow on left */}
      <rect x="10" y="40" width="52" height="40" rx="2" stroke="rgba(158,214,223,0.3)" strokeWidth="1" fill="rgba(158,214,223,0.03)" />
      <text x="36" y="57" textAnchor="middle" fontSize="5.5" fill="rgba(158,214,223,0.6)" fontFamily="sans-serif">EXISTING</text>
      <text x="36" y="67" textAnchor="middle" fontSize="5.5" fill="rgba(158,214,223,0.6)" fontFamily="sans-serif">WORKFLOW</text>

      {/* Arrow to AI layer */}
      <line x1="62" y1="60" x2="80" y2="60" stroke="rgba(158,214,223,0.3)" strokeWidth="1" />
      <polygon points="80,56 88,60 80,64" fill="rgba(158,214,223,0.35)" />

      {/* AI layer center */}
      <rect x="88" y="42" width="24" height="36" rx="12" stroke="rgba(158,214,223,0.5)" strokeWidth="1" fill="rgba(158,214,223,0.07)" />
      <text x="100" y="63" textAnchor="middle" fontSize="5" fill="rgba(158,214,223,0.7)" fontFamily="sans-serif">AI</text>

      {/* Output arrow */}
      <line x1="112" y1="60" x2="130" y2="60" stroke="rgba(237,119,60,0.4)" strokeWidth="1" />
      <polygon points="130,56 138,60 130,64" fill="rgba(237,119,60,0.45)" />

      {/* Output */}
      <rect x="138" y="40" width="52" height="40" rx="2" stroke="rgba(237,119,60,0.45)" strokeWidth="1" fill="rgba(237,119,60,0.04)" />
      <text x="164" y="57" textAnchor="middle" fontSize="5.5" fill="rgba(237,119,60,0.7)" fontFamily="sans-serif">10×</text>
      <text x="164" y="67" textAnchor="middle" fontSize="5.5" fill="rgba(237,119,60,0.7)" fontFamily="sans-serif">OUTPUT</text>

      {/* Speed indicator */}
      <text x="100" y="108" textAnchor="middle" fontSize="6" fill="rgba(158,214,223,0.4)" fontFamily="sans-serif" letterSpacing="1">STRATEGIC PLACEMENT</text>
    </svg>
  );
}

// ─── Build data ───────────────────────────────────────────────────────────────

const builds = [
  {
    transmission: "01",
    signal: "Content Services System",
    tagline: "BRIEF → DRAFT → REVIEW → APPROVE → LIVE",
    insight: "When content is cheap, proof is expensive.",
    name: "Content\nServices\nSystem",
    desc: "A complete pipeline for producing content at volume without chaos. Every role, every handoff, every decision — documented and repeatable. Your team stops reinventing the wheel on every piece.",
    solves: ["Revision loops with no end", "Vague feedback that stops work", "Delivery chaos at scale"],
    accent: "#808BC5",
    Diagram: DiagramCSS,
  },
  {
    transmission: "02",
    signal: "Verified Knowledge Base",
    tagline: "CLAIM → CITATION → REVIEW → PUBLISH",
    insight: "Rent your audience and someone else sets the rules.",
    name: "Verified\nKnowledge\nBase",
    desc: "Your expertise, documented and defensible. Turns institutional knowledge into a structured system that AI can cite and humans can trust. When the expert leaves, the knowledge stays.",
    solves: ["AI credibility problems", "Expertise fragmentation", "Knowledge that walks out the door"],
    accent: "#3d8a7a",
    Diagram: DiagramVKB,
  },
  {
    transmission: "03",
    signal: "AI Workflow System",
    tagline: "HUMAN INPUT → AI LAYER → 10× OUTPUT",
    insight: "Almost everyone has used AI. Almost no one has a system for it.",
    name: "AI\nWorkflow\nSystem",
    desc: "Not AI slop. Infrastructure. We place AI precisely inside your existing workflows — where it actually speeds up output and increases quality. The difference between a tool you tried and a system you rely on.",
    solves: ["Faster mediocrity", "Inconsistent AI outputs", "Workflows that don't scale"],
    accent: "#9ED6DF",
    Diagram: DiagramAI,
  },
];

// ─── Chapter title component ──────────────────────────────────────────────────

function TransmissionChapter({
  number,
  signal,
  accent,
  insight,
}: {
  number: string;
  signal: string;
  accent: string;
  insight: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 72%",
        },
      });

      tl.fromTo(
        el.querySelector("[data-tx-number]"),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "expo.out" }
      )
        .fromTo(
          el.querySelector("[data-tx-rule]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.0, ease: "expo.out", transformOrigin: "left" },
          "-=0.3"
        )
        .fromTo(
          el.querySelector("[data-tx-insight]"),
          { opacity: 0, y: 24, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "expo.out" },
          "-=0.5"
        )
        .fromTo(
          el.querySelector("[data-tx-signal]"),
          { opacity: 0, x: 12 },
          { opacity: 1, x: 0, duration: 0.5, ease: "expo.out" },
          "-=0.4"
        );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="border-t py-14 md:py-20 mb-0"
      style={{ borderColor: `${accent}22` }}
    >
      <div className="flex items-start justify-between gap-8 flex-wrap">

        {/* Left: number + rule + insight */}
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center gap-4 mb-6">
            <span
              data-tx-number
              className="opacity-0"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: accent,
              }}
            >
              Transmission {number}
            </span>
            <div
              data-tx-rule
              style={{
                flex: 1,
                height: "1px",
                background: `${accent}30`,
                transformOrigin: "left",
              }}
            />
          </div>

          <h3
            data-tx-insight
            className="opacity-0"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(2.4rem, 5vw, 5.5rem)",
              color: "var(--paper)",
              lineHeight: 0.92,
              letterSpacing: "0.02em",
              maxWidth: "680px",
            }}
          >
            {insight}
          </h3>
        </div>

        {/* Right: signal label */}
        <div
          data-tx-signal
          className="opacity-0"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.58rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accent,
            opacity: 0.6,
            paddingTop: "0.5rem",
            whiteSpace: "nowrap",
          }}
        >
          Signal: {signal}
        </div>

      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TheBuilds() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Section header
      gsap.fromTo(
        "[data-build-header]",
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: "[data-build-header]", start: "top 82%" },
        }
      );

      // Cards
      gsap.fromTo(
        "[data-build-card]",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.18,
          scrollTrigger: { trigger: "[data-build-card]", start: "top 78%" },
        }
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

        {/* Section header */}
        <div data-build-header className="mb-6">
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
              Three signals.<br />
              <span style={{ color: "var(--tangerine)" }}>One</span><br />
              infrastructure.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(0.82rem, 1.3vw, 1rem)",
                color: "rgba(234,228,218,0.42)",
                lineHeight: 1.75,
              }}
            >
              Each system resolves a distinct layer of your content operation.
              Together, they form a complete stack. You can start with one.
              Most clients end up with all three.
            </p>
          </div>
        </div>

        {/* Three transmissions — chapter moment + card */}
        {builds.map(({ transmission, signal, accent, insight, name, tagline, desc, solves, Diagram }, idx) => (
          <div key={transmission}>

            {/* Chapter title moment */}
            <TransmissionChapter
              number={transmission}
              signal={signal}
              accent={accent}
              insight={insight}
            />

            {/* System card */}
            <div
              data-build-card
              className="grid md:grid-cols-[1fr_1.4fr] gap-px mb-0"
              style={{ background: `${accent}12`, marginBottom: idx < 2 ? "0" : "0" }}
            >
              {/* Diagram panel */}
              <div
                className="h-64 md:h-auto p-8 flex items-center justify-center border-b md:border-b-0 md:border-r"
                style={{
                  background: "var(--ink)",
                  borderColor: `${accent}18`,
                  minHeight: "220px",
                }}
              >
                <div className="w-full max-w-[240px] h-36">
                  <Diagram />
                </div>
              </div>

              {/* Content panel */}
              <div
                className="flex flex-col p-8 md:p-10"
                style={{ background: "var(--ink)" }}
              >
                {/* Module header */}
                <div className="mb-5">
                  <div className="flex items-baseline justify-between mb-4 gap-4 flex-wrap">
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
                      System {transmission}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.52rem",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(234,228,218,0.18)",
                      }}
                    >
                      {tagline}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                      color: "var(--paper)",
                      lineHeight: 0.92,
                      letterSpacing: "0.02em",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {name}
                  </h3>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.82rem",
                    color: "rgba(234,228,218,0.42)",
                    lineHeight: 1.72,
                    marginBottom: "1.4rem",
                  }}
                >
                  {desc}
                </p>

                {/* Solves */}
                <div className="mb-6">
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: accent,
                      display: "block",
                      marginBottom: "0.55rem",
                    }}
                  >
                    Solves
                  </span>
                  <ul>
                    {solves.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2 mb-1"
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.77rem",
                          color: "rgba(234,228,218,0.32)",
                        }}
                      >
                        <span
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: accent,
                            opacity: 0.65,
                            flexShrink: 0,
                          }}
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link
                  href="/builds"
                  className="mt-auto flex items-center gap-2 group w-fit"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: accent,
                  }}
                >
                  <span>Learn More</span>
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        ))}

        {/* Bottom CTA */}
        <div className="mt-20 pt-14 border-t" style={{ borderColor: "rgba(234,228,218,0.08)" }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(1.8rem, 3vw, 3rem)",
                  color: "var(--paper)",
                  lineHeight: 0.95,
                  letterSpacing: "0.02em",
                  marginBottom: "0.5rem",
                }}
              >
                Ready to tune the signal?
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.78rem",
                  color: "rgba(234,228,218,0.38)",
                  lineHeight: 1.7,
                }}
              >
                One call. We&apos;ll tell you which system to build first.
              </p>
            </div>
            <Link href="/contact" className="btn-primary whitespace-nowrap">
              <span>Book a Build Call</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
