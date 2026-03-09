"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Brand palette ────────────────────────────────────────────────────────────
const C = {
  ink:       "#1D1D1B",
  paper:     "#EAE4DA",
  lavender:  "#808BC5",
  tea:       "#245E55",
  sky:       "#9ED6DF",
  tangerine: "#ED773C",
  pink:      "#EAA7C7",
  mustard:   "#EAC119",
  red:       "#C63F3E",
} as const;

// ─── Diagram 01: Tool Sprawl ──────────────────────────────────────────────────
// Concept: tools scattered everywhere, YOU overwhelmed in the center.
// Animation: each node drifts independently, lines flicker chaotically.
// Shows: no single source of truth — things are always in motion, never settled.

const TOOLS = [
  { id: "notion",   x: 62,  y: 58,  label: "Notion",   color: C.lavender,  r: 24 },
  { id: "slack",    x: 260, y: 48,  label: "Slack",    color: C.sky,       r: 22 },
  { id: "docs",     x: 295, y: 175, label: "Docs",     color: C.paper,     r: 20 },
  { id: "airtable", x: 215, y: 248, label: "Airtable", color: C.mustard,   r: 22 },
  { id: "loom",     x: 55,  y: 240, label: "Loom",     color: C.pink,      r: 20 },
  { id: "figma",    x: 25,  y: 145, label: "Figma",    color: C.tangerine, r: 20 },
];

// Cross-connections (not hub-and-spoke — chaos has no center)
const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], // outer ring
  [0, 3], [1, 4], [2, 5], [0, 2], [3, 5],          // cross-cuts
];

function DiagramSprawl() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const ctx = gsap.context(() => {
      // Each tool node drifts on its own sinusoidal path
      TOOLS.forEach((tool, i) => {
        const el = svgRef.current!.getElementById(`ts-tool-${tool.id}`);
        if (!el) return;
        const dx = (i % 2 === 0 ? 1 : -1) * (5 + i * 2);
        const dy = (i % 3 === 0 ? -1 : 1) * (4 + i * 1.5);
        gsap.to(el, {
          x: dx, y: dy,
          duration: 3 + i * 0.7,
          repeat: -1, yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.35,
        });
      });

      // Lines flicker — each at different pace/opacity
      const lines = svgRef.current!.querySelectorAll<SVGElement>(".ts-line");
      lines.forEach((line, i) => {
        gsap.to(line, {
          opacity: 0.05 + (i % 6) * 0.06,
          duration: 0.5 + (i % 5) * 0.38,
          repeat: -1, yoyo: true,
          ease: "power1.inOut",
          delay: i * 0.1,
        });
      });

      // YOU pulses outward — endless stress signal
      const youPulse = svgRef.current!.getElementById("ts-you-pulse");
      if (youPulse) {
        gsap.to(youPulse, {
          attr: { r: 36 }, opacity: 0,
          duration: 2.2,
          repeat: -1,
          ease: "power2.out",
        });
      }
      const youInner = svgRef.current!.getElementById("ts-you-inner");
      if (youInner) {
        gsap.to(youInner, {
          scale: 1.08,
          duration: 1.8,
          repeat: -1, yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "160px 148px",
        });
      }
    }, svgRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 320 295" fill="none"
      className="w-full h-full" aria-hidden="true">
      {/* Ambient noise */}
      {[30,70,95,140,175,210,255,285].map((bx, i) => (
        <circle key={i} cx={bx} cy={20 + (i * 41) % 255} r="1.5"
          fill="rgba(234,228,218,0.05)" />
      ))}

      {/* Chaos connection lines */}
      {CONNECTIONS.map(([a, b], i) => {
        const ta = TOOLS[a]; const tb = TOOLS[b];
        const lineColors = [C.lavender, C.sky, C.tangerine, C.pink, C.mustard, C.paper, C.red];
        return (
          <line key={i} className="ts-line"
            x1={ta.x} y1={ta.y} x2={tb.x} y2={tb.y}
            stroke={lineColors[i % lineColors.length]}
            strokeWidth="0.8" strokeDasharray="2 7"
            opacity={0.08 + (i % 5) * 0.04}
          />
        );
      })}

      {/* Center-to-tool lines */}
      {TOOLS.map((t, i) => (
        <line key={`c${i}`} className="ts-line"
          x1={160} y1={148} x2={t.x} y2={t.y}
          stroke={t.color} strokeWidth="0.6" strokeDasharray="1 9"
          opacity={0.1}
        />
      ))}

      {/* YOU node */}
      <circle id="ts-you-pulse" cx={160} cy={148} r={22}
        stroke={C.paper} strokeWidth="1" opacity={0.12} fill="none" />
      <circle id="ts-you-inner" cx={160} cy={148} r={18}
        stroke={C.paper} strokeWidth="1.5"
        fill="rgba(234,228,218,0.06)" />
      <text x={160} y={152} textAnchor="middle" fontSize="7"
        fill={C.paper} opacity={0.65} fontFamily="sans-serif"
        letterSpacing="2" fontWeight="700">YOU</text>

      {/* Tool nodes */}
      {TOOLS.map((t) => (
        <g key={t.id} id={`ts-tool-${t.id}`}>
          <circle cx={t.x} cy={t.y} r={t.r}
            fill={`${t.color}1A`} stroke={t.color}
            strokeWidth="1.2" />
          <text x={t.x} y={t.y + 4.5} textAnchor="middle"
            fontSize="6.5" fill={t.color} fontFamily="sans-serif"
            fontWeight="700" opacity={0.85}>
            {t.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Diagram 02: Integration Tax ─────────────────────────────────────────────
// Concept: every handoff bleeds time. The bottleneck is always at Review/Revise.
// Animation: particles flow → jam → counter climbs → cycles.
// Shows: you can see exactly where the weeks go.

const STEPS = [
  { label: "Brief",   x: 14 },
  { label: "Draft",   x: 67 },
  { label: "Review",  x: 120, hot: true },
  { label: "Revise",  x: 173, hot: true },
  { label: "Approve", x: 226 },
  { label: "Publish", x: 279 },
];

const STEP_W = 40;
const STEP_Y = 58;
const PARTICLE_Y = 78; // center of boxes

function DiagramTax() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const ctx = gsap.context(() => {
      // Bottleneck glow pulse
      const glow = svgRef.current!.getElementById("it-glow");
      if (glow) {
        gsap.to(glow, {
          opacity: 0.6,
          duration: 0.9,
          repeat: -1, yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Particle animation loop
      const particles = svgRef.current!.querySelectorAll<SVGElement>(".it-particle");
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });

      particles.forEach((p, i) => {
        // Reset to start
        tl.set(p, { x: 0, y: 0, opacity: 0 }, i * 0.5);
        // Flow from Brief to Review
        tl.to(p, {
          x: STEPS[2].x - STEPS[0].x + 10,
          opacity: 1,
          duration: 1.2,
          ease: "power1.inOut",
        }, i * 0.5);
        // Stall / pile up — each particle stacks slightly lower
        tl.to(p, {
          y: (i % 3) * 10,     // stack vertically at bottleneck
          duration: 0.3,
          ease: "power2.out",
        }, `>-0.1`);
        // Slowly crawl through Revise
        tl.to(p, {
          x: STEPS[4].x - STEPS[0].x + 10,
          duration: 1.8,
          ease: "power3.in",
        }, `>+0.6`);
        // Rush to Publish
        tl.to(p, {
          x: STEPS[5].x - STEPS[0].x + STEP_W,
          y: 0,
          opacity: 0,
          duration: 0.5,
          ease: "expo.in",
        }, `>`);
      });

      // Counter ticks up while particles are jammed
      const counter = svgRef.current!.getElementById("it-counter");
      if (counter) {
        const counterTl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
        counterTl
          .set(counter, { opacity: 0 }, 1.2)
          .to(counter, { opacity: 1, duration: 0.3 }, 1.5)
          .call(() => {
            let n = 0;
            const tick = setInterval(() => {
              if (counter.textContent !== null) {
                counter.textContent = `+${++n}d`;
              }
              if (n >= 14) clearInterval(tick);
            }, 200);
          }, [], 1.5)
          .to(counter, { opacity: 0, duration: 0.4 }, 5.5);
      }
    }, svgRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 333 220" fill="none"
      className="w-full h-full" aria-hidden="true">

      {/* Bottleneck glow behind review/revise */}
      <rect id="it-glow"
        x={STEPS[2].x - 4} y={STEP_Y - 8}
        width={STEP_W * 2 + 15} height={46}
        rx="3" fill={C.red} opacity={0.08}
      />

      {/* Flow track */}
      <line x1={14} y1={PARTICLE_Y} x2={319} y2={PARTICLE_Y}
        stroke="rgba(234,228,218,0.06)" strokeWidth="1" />

      {/* Step boxes */}
      {STEPS.map((s) => (
        <g key={s.label}>
          <rect x={s.x} y={STEP_Y} width={STEP_W} height={38}
            rx="2"
            fill={s.hot ? `${C.red}12` : "rgba(234,228,218,0.03)"}
            stroke={s.hot ? `${C.red}90` : "rgba(234,228,218,0.14)"}
            strokeWidth={s.hot ? 1.2 : 0.8}
          />
          <text x={s.x + STEP_W / 2} y={STEP_Y + 14}
            textAnchor="middle" fontSize="5.5" fontFamily="sans-serif"
            fill={s.hot ? C.red : "rgba(234,228,218,0.4)"}
            fontWeight={s.hot ? "700" : "400"}>
            {s.label}
          </text>
          {/* Arrow */}
          {s.x < STEPS[5].x && (
            <path d={`M ${s.x + STEP_W + 2} ${PARTICLE_Y} L ${s.x + STEP_W + 11} ${PARTICLE_Y}`}
              stroke="rgba(234,228,218,0.1)" strokeWidth="0.8"
              markerEnd="url(#arrow)"
            />
          )}
        </g>
      ))}

      {/* Particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i}
          className="it-particle"
          cx={STEPS[0].x + STEP_W / 2} cy={PARTICLE_Y}
          r={i === 2 ? 5 : 4}
          fill={[C.paper, C.sky, C.pink, C.lavender, C.mustard][i]}
          opacity={0}
        />
      ))}

      {/* Counter that climbs during jam */}
      <text id="it-counter"
        x={STEPS[2].x + STEP_W + 5} y={STEP_Y - 14}
        fontSize="13" fontFamily="sans-serif"
        fill={C.tangerine} fontWeight="800"
        letterSpacing="-0.5"
        opacity={0}
      >+0d</text>

      {/* Label */}
      <text x={166} y={200} textAnchor="middle"
        fontSize="6.5" fill={`${C.red}70`} fontFamily="sans-serif"
        letterSpacing="1.5" fontWeight="600">
        2 WEEKS LOST — EVERY HANDOFF
      </text>

      {/* Horizontal separators */}
      <line x1={14} y1={130} x2={319} y2={130}
        stroke="rgba(234,228,218,0.04)" strokeWidth="1" />

      {/* Stuck work pileup label */}
      <text x={STEPS[2].x + 36} y={122}
        textAnchor="middle" fontSize="5.5"
        fill={`${C.red}60`} fontFamily="sans-serif"
        letterSpacing="0.8">STUCK</text>
    </svg>
  );
}

// ─── Diagram 03: Platform Dependency ─────────────────────────────────────────
// Concept: you built the audience — the algorithm holds the keys.
// Animation: audience dots populate → stable → "UPDATE" flash → dots scatter.
// Shows: 90% of reach can be revoked overnight. You own nothing.

// Audience dot grid: 9 cols × 7 rows = 63 dots
const DOT_COLS = 9;
const DOT_ROWS = 7;
const DOT_GAP_X = 32;
const DOT_GAP_Y = 30;
const DOT_START_X = 20;
const DOT_START_Y = 28;

const DOT_COLORS = [C.sky, C.lavender, C.pink, C.mustard, C.sky, C.lavender, C.pink];

function DiagramAlgorithm() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const ctx = gsap.context(() => {
      const dots = svgRef.current!.querySelectorAll<SVGElement>(".pd-dot");
      const updateLabel = svgRef.current!.getElementById("pd-update");
      const reachLabel  = svgRef.current!.getElementById("pd-reach");
      const updateBg    = svgRef.current!.getElementById("pd-update-bg");

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      // Phase 1: dots populate (you built this)
      tl.set(dots, { opacity: 0, scale: 0, transformOrigin: "center center" })
        .to(dots, {
          opacity: 1, scale: 1,
          stagger: { amount: 1.6, from: "random" },
          duration: 0.4,
          ease: "back.out(1.8)",
        }, 0);

      // Phase 2: stable pause
      tl.to({}, { duration: 1.2 });

      // Phase 3: algorithm update flash
      tl.set([updateLabel, updateBg], { opacity: 0 })
        .to([updateBg, updateLabel], { opacity: 1, duration: 0.2, ease: "power4.out" })
        .to([updateBg, updateLabel], { opacity: 0, duration: 0.5, delay: 0.6 });

      // Phase 4: dots scatter & disappear
      dots.forEach((dot, i) => {
        const keep = i % 10 === 0; // keep ~10%
        const angle = (i * 137.5 * Math.PI) / 180; // golden angle spread
        const dist  = 30 + (i % 5) * 20;
        tl.to(dot, {
          x: keep ? 0 : Math.cos(angle) * dist,
          y: keep ? 0 : Math.sin(angle) * dist,
          opacity: keep ? 0.9 : 0,
          scale:   keep ? 1   : 0.2,
          duration: 0.8 + Math.random() * 0.4,
          ease: "power3.in",
        }, "-=0.8");
      });

      // Phase 5: show reach = gone
      if (reachLabel) {
        tl.to(reachLabel, { opacity: 1, duration: 0.5 }, "+=0.2")
          .to(reachLabel, { opacity: 0, duration: 0.4, delay: 1.6 });
      }

      // Phase 6: brief reset
      tl.set(dots, { x: 0, y: 0 });
    }, svgRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 310 240" fill="none"
      className="w-full h-full" aria-hidden="true">

      {/* Audience dots grid */}
      {Array.from({ length: DOT_ROWS }).map((_, row) =>
        Array.from({ length: DOT_COLS }).map((_, col) => {
          const i   = row * DOT_COLS + col;
          const cx  = DOT_START_X + col * DOT_GAP_X;
          const cy  = DOT_START_Y + row * DOT_GAP_Y;
          const col_ = DOT_COLORS[row % DOT_COLORS.length];
          return (
            <circle key={i} className="pd-dot"
              cx={cx} cy={cy} r="4.5"
              fill={col_} opacity={0}
            />
          );
        })
      )}

      {/* ALGORITHM UPDATE flash overlay */}
      <rect id="pd-update-bg"
        x="0" y="0" width="310" height="240"
        fill={C.red} opacity={0} rx="0"
      />
      <text id="pd-update"
        x="155" y="128"
        textAnchor="middle"
        fontSize="20"
        fontFamily="sans-serif"
        fontWeight="800"
        fill={C.paper}
        letterSpacing="1"
        opacity={0}
      >ALGORITHM CHANGED</text>

      {/* Reach gone label */}
      <text id="pd-reach"
        x="155" y="210"
        textAnchor="middle"
        fontSize="10"
        fontFamily="sans-serif"
        fontWeight="700"
        fill={C.red}
        letterSpacing="3"
        opacity={0}
      >REACH: 0</text>
    </svg>
  );
}

// ─── Problem data ─────────────────────────────────────────────────────────────

const problems = [
  {
    number: "01",
    tag: "Tool Sprawl",
    headline: "You've written the thing. It lives in a folder.",
    body: "Notion. Google Docs. Slack. Airtable. Loom. Each tool is a silo. Every handoff is a translation job. There is no single source of truth.",
    color: C.lavender,
    Diagram: DiagramSprawl,
  },
  {
    number: "02",
    tag: "Integration Tax",
    headline: "Every handoff costs time you're not tracking.",
    body: "Briefs don't become drafts cleanly. Drafts cycle through revision loops. Approval is a bottleneck. Two weeks of output turns into six.",
    color: C.red,
    Diagram: DiagramTax,
  },
  {
    number: "03",
    tag: "Platform Dependency",
    headline: "You built the audience. The algorithm rebuilt the rules.",
    body: "Rented reach has a landlord. When the platform changes — and it will — you find out you owned nothing. Not the list. Not the access. Not the data.",
    color: C.tea,
    Diagram: DiagramAlgorithm,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(
        "[data-prob-header]",
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: "[data-prob-header]", start: "top 82%" },
        }
      );

      gsap.fromTo(
        "[data-prob-card]",
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.18,
          scrollTrigger: { trigger: "[data-prob-card]", start: "top 80%" },
        }
      );

      gsap.fromTo(
        "[data-prob-rule]",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.4, ease: "expo.out", transformOrigin: "left",
          scrollTrigger: { trigger: "[data-prob-rule]", start: "top 85%" },
        }
      );

      gsap.fromTo(
        "[data-prob-conclusion-line]",
        { opacity: 0, y: 18, filter: "blur(8px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9,
          ease: "expo.out", stagger: 0.22,
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
              className="relative flex flex-col"
              style={{ background: "var(--ink)" }}
            >
              {/* Diagram — enlarged, live */}
              <div
                className="border-b"
                style={{
                  borderColor: `${color}22`,
                  height: "300px",
                  padding: "1.25rem",
                  background: `radial-gradient(ellipse at 50% 60%, ${color}08 0%, transparent 72%)`,
                }}
              >
                <Diagram />
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
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

        {/* Rule line */}
        <div
          data-prob-rule
          className="mb-16"
          style={{
            height: "1px",
            background: "rgba(234,228,218,0.14)",
            transformOrigin: "left",
          }}
        />

        {/* Conclusion */}
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
          <span data-prob-conclusion-line className="opacity-0 label-type">
            ↓ The signal resolves below
          </span>
        </div>

      </div>
    </section>
  );
}
