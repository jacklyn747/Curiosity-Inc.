"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Diagram: Tool Sprawl ────────────────────────────────────────────────────

function DiagramSprawl() {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full" aria-hidden="true">
      <circle cx="120" cy="90" r="20" stroke="rgba(128,139,197,0.25)" strokeWidth="1.5" />
      <circle cx="120" cy="90" r="7" fill="rgba(128,139,197,0.35)" />
      {[
        { cx: 48,  cy: 42,  label: "Notion" },
        { cx: 192, cy: 42,  label: "Slack" },
        { cx: 192, cy: 138, label: "Loom" },
        { cx: 48,  cy: 138, label: "Docs" },
        { cx: 120, cy: 16,  label: "Air" },
        { cx: 120, cy: 164, label: "Airtable" },
      ].map(({ cx, cy, label }) => (
        <g key={label}>
          <line
            x1="120" y1="90" x2={cx} y2={cy}
            stroke="rgba(128,139,197,0.15)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <circle cx={cx} cy={cy} r="13"
            stroke="rgba(128,139,197,0.22)"
            strokeWidth="1"
          />
          <text
            x={cx} y={cy + 4}
            textAnchor="middle"
            fontSize="6"
            fill="rgba(128,139,197,0.5)"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        </g>
      ))}
      {/* Crossed lines — chaos indicator */}
      <line x1="22" y1="22" x2="218" y2="158" stroke="rgba(198,63,62,0.2)" strokeWidth="0.8" />
      <line x1="218" y1="22" x2="22" y2="158" stroke="rgba(198,63,62,0.2)" strokeWidth="0.8" />
    </svg>
  );
}

// ─── Diagram: Integration Tax ────────────────────────────────────────────────

function DiagramTax() {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full" aria-hidden="true">
      {["Brief", "Draft", "Review", "Revise", "Approve", "Publish"].map((step, i) => {
        const x = 14 + i * 37;
        const bottleneck = i === 2 || i === 3;
        return (
          <g key={step}>
            <rect
              x={x} y={bottleneck ? 70 : 78}
              width="30" height={bottleneck ? 40 : 24}
              rx="2"
              fill={bottleneck ? "rgba(198,63,62,0.08)" : "rgba(234,228,218,0.03)"}
              stroke={bottleneck ? "rgba(198,63,62,0.5)" : "rgba(234,228,218,0.16)"}
              strokeWidth="1"
            />
            <text
              x={x + 15} y={91}
              textAnchor="middle"
              fontSize="5.5"
              fill={bottleneck ? "rgba(198,63,62,0.7)" : "rgba(234,228,218,0.35)"}
              fontFamily="sans-serif"
            >
              {step}
            </text>
            {i < 5 && (
              <line
                x1={x + 30} y1="90" x2={x + 37} y2="90"
                stroke={bottleneck ? "rgba(198,63,62,0.4)" : "rgba(234,228,218,0.14)"}
                strokeWidth={bottleneck ? 1.2 : 0.8}
              />
            )}
          </g>
        );
      })}
      <text
        x="120" y="148"
        textAnchor="middle"
        fontSize="6"
        fill="rgba(198,63,62,0.45)"
        fontFamily="sans-serif"
        letterSpacing="1"
      >
        2 WEEKS WASTED PER HANDOFF
      </text>
    </svg>
  );
}

// ─── Diagram: Algorithm Dependency ───────────────────────────────────────────

function DiagramAlgorithm() {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full" aria-hidden="true">
      {/* Central "you" node */}
      <circle cx="120" cy="72" r="24" stroke="rgba(234,228,218,0.15)" strokeWidth="1.5" />
      <circle cx="120" cy="72" r="9" fill="rgba(234,228,218,0.08)" stroke="rgba(234,228,218,0.25)" strokeWidth="1" />
      {/* Platform nodes radiating out */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 120 + Math.cos(rad) * 56;
        const y2 = 72 + Math.sin(rad) * 56;
        const labels = ["IG", "TK", "LI", "YT", "TW", "FB", "SP", "PT"];
        return (
          <g key={i}>
            <line
              x1="120" y1="72" x2={x2} y2={y2}
              stroke="rgba(234,228,218,0.1)"
              strokeWidth="0.8"
              strokeDasharray="2 4"
            />
            <circle cx={x2} cy={y2} r="7"
              fill="rgba(234,228,218,0.04)"
              stroke="rgba(234,228,218,0.2)"
              strokeWidth="0.8"
            />
            <text
              x={x2} y={y2 + 3.5}
              textAnchor="middle"
              fontSize="4.5"
              fill="rgba(234,228,218,0.3)"
              fontFamily="sans-serif"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
      {/* Algorithm change indicator */}
      <path
        d="M 148 56 L 178 40 L 172 55 L 190 48"
        stroke="rgba(198,63,62,0.5)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <text x="120" y="150" textAnchor="middle" fontSize="6" fill="rgba(198,63,62,0.4)"
        fontFamily="sans-serif" letterSpacing="1">RULES CHANGED OVERNIGHT
      </text>
    </svg>
  );
}

// ─── The three problems ───────────────────────────────────────────────────────

const problems = [
  {
    number: "01",
    tag: "Tool Sprawl",
    headline: "You've written the thing. It lives in a folder.",
    body: "Notion. Google Docs. Slack. Airtable. Loom. Each tool is a silo. Every handoff is a translation job. There is no single source of truth.",
    color: "#808BC5",
    Diagram: DiagramSprawl,
  },
  {
    number: "02",
    tag: "Integration Tax",
    headline: "Every handoff costs time you're not tracking.",
    body: "Briefs don't become drafts cleanly. Drafts cycle through revision loops. Approval is a bottleneck. Two weeks of output turns into six.",
    color: "#C63F3E",
    Diagram: DiagramTax,
  },
  {
    number: "03",
    tag: "Platform Dependency",
    headline: "You built the audience. The algorithm rebuilt the rules.",
    body: "Rented reach has a landlord. When the platform changes — and it will — you find out you owned nothing. Not the list. Not the access. Not the data.",
    color: "#245E55",
    Diagram: DiagramAlgorithm,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Header enters
      gsap.fromTo(
        "[data-prob-header]",
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: "[data-prob-header]", start: "top 82%" },
        }
      );

      // Cards stagger up
      gsap.fromTo(
        "[data-prob-card]",
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: "[data-prob-card]", start: "top 80%" },
        }
      );

      // Rule line draws across
      gsap.fromTo(
        "[data-prob-rule]",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.4, ease: "expo.out", transformOrigin: "left",
          scrollTrigger: { trigger: "[data-prob-rule]", start: "top 85%" },
        }
      );

      // Conclusion lines blur in sequentially
      gsap.fromTo(
        "[data-prob-conclusion-line]",
        { opacity: 0, y: 18, filter: "blur(8px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "expo.out", stagger: 0.22,
          scrollTrigger: { trigger: "[data-prob-conclusion]", start: "top 82%" },
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

        {/* Header */}
        <div data-prob-header className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="label-type">The Interference</span>
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
              Your problem<br />
              <span style={{ color: "var(--tangerine)" }}>isn&rsquo;t</span><br />
              content.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "rgba(234,228,218,0.42)",
                lineHeight: 1.7,
              }}
            >
              Most teams think they have a writing problem.
              They don&rsquo;t. They have a systems problem —
              and it shows up in every brief, every revision cycle,
              every handoff.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div
          className="grid md:grid-cols-3 gap-px mb-20"
          style={{ background: "rgba(234,228,218,0.07)" }}
        >
          {problems.map(({ number, tag, headline, body, color, Diagram }) => (
            <div
              key={number}
              data-prob-card
              className="relative"
              style={{ background: "var(--ink)" }}
            >
              {/* Diagram */}
              <div
                className="h-48 p-5 border-b"
                style={{ borderColor: "rgba(234,228,218,0.06)" }}
              >
                <Diagram />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color,
                    }}
                  >
                    {number}
                  </span>
                  <span
                    className="px-2 py-0.5"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.55rem",
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color,
                      border: `1px solid ${color}`,
                      opacity: 0.75,
                    }}
                  >
                    {tag}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "var(--paper)",
                    lineHeight: 1.5,
                    marginBottom: "0.65rem",
                  }}
                >
                  {headline}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.78rem",
                    lineHeight: 1.72,
                    color: "rgba(234,228,218,0.38)",
                  }}
                >
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Self-drawing rule line */}
        <div
          data-prob-rule
          className="mb-16"
          style={{
            height: "1px",
            background: "rgba(234,228,218,0.14)",
            transformOrigin: "left",
          }}
        />

        {/* Conclusion — sequential blur-in beats */}
        <div data-prob-conclusion className="max-w-[700px]">

          <p
            data-prob-conclusion-line
            className="opacity-0"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(2rem, 4.5vw, 4.2rem)",
              color: "var(--paper)",
              lineHeight: 1.0,
              letterSpacing: "0.02em",
              marginBottom: "0.4rem",
            }}
          >
            You tried AI.
          </p>

          <p
            data-prob-conclusion-line
            className="opacity-0"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(2rem, 4.5vw, 4.2rem)",
              color: "var(--tangerine)",
              lineHeight: 1.0,
              letterSpacing: "0.02em",
              marginBottom: "1.6rem",
            }}
          >
            You got faster mediocrity.
          </p>

          <p
            data-prob-conclusion-line
            className="opacity-0"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
              color: "rgba(234,228,218,0.45)",
              lineHeight: 1.7,
              marginBottom: "1.4rem",
              maxWidth: "520px",
            }}
          >
            Content isn&rsquo;t your problem. Infrastructure is.
            Three systems exist to fix that — and only three.
          </p>

          <span
            data-prob-conclusion-line
            className="opacity-0 label-type"
          >
            ↓ The signal resolves below
          </span>

        </div>

      </div>
    </section>
  );
}
