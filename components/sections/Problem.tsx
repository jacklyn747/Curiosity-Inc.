"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SystemDiagramSprawl() {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full" aria-hidden="true">
      <circle cx="120" cy="90" r="18" stroke="#1D1D1B" strokeWidth="1.5" strokeOpacity="0.35" />
      <circle cx="120" cy="90" r="6" fill="#1D1D1B" fillOpacity="0.4" />
      {[
        { cx: 50,  cy: 45,  label: "Notion" },
        { cx: 190, cy: 45,  label: "Slack" },
        { cx: 190, cy: 135, label: "Loom" },
        { cx: 50,  cy: 135, label: "Docs" },
        { cx: 120, cy: 18,  label: "Air" },
        { cx: 120, cy: 162, label: "Airtable" },
      ].map(({ cx, cy, label }) => (
        <g key={label}>
          <line x1="120" y1="90" x2={cx} y2={cy} stroke="#1D1D1B" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="3 4" />
          <circle cx={cx} cy={cy} r="11" stroke="#1D1D1B" strokeWidth="1" strokeOpacity="0.25" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="6" fill="#1D1D1B" fillOpacity="0.45" fontFamily="sans-serif">{label}</text>
        </g>
      ))}
      <line x1="20" y1="20" x2="220" y2="160" stroke="#C63F3E" strokeWidth="0.8" strokeOpacity="0.18" />
      <line x1="220" y1="20" x2="20" y2="160" stroke="#C63F3E" strokeWidth="0.8" strokeOpacity="0.18" />
    </svg>
  );
}

function SystemDiagramTax() {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full" aria-hidden="true">
      {["Brief", "Draft", "Review", "Revise", "Approve", "Publish"].map((step, i) => {
        const x = 16 + i * 37;
        const friction = i === 2 || i === 3;
        return (
          <g key={step}>
            <rect x={x} y={friction ? 72 : 78} width="30" height={friction ? 36 : 24} rx="2"
              fill={friction ? "#C63F3E" : "#1D1D1B"} fillOpacity={friction ? 0.1 : 0.05}
              stroke={friction ? "#C63F3E" : "#1D1D1B"} strokeWidth="1"
              strokeOpacity={friction ? 0.5 : 0.18} />
            <text x={x + 15} y={91} textAnchor="middle" fontSize="5.5" fill="#1D1D1B"
              fillOpacity={friction ? 0.7 : 0.38} fontFamily="sans-serif">{step}</text>
            {i < 5 && <line x1={x + 30} y1="90" x2={x + 37} y2="90"
              stroke={friction ? "#C63F3E" : "#1D1D1B"}
              strokeWidth={friction ? 1.2 : 0.8} strokeOpacity={friction ? 0.45 : 0.18} />}
          </g>
        );
      })}
      <text x="120" y="148" textAnchor="middle" fontSize="6.5" fill="#C63F3E" fillOpacity="0.5"
        fontFamily="sans-serif" letterSpacing="1">2 WEEKS WASTED PER HANDOFF</text>
    </svg>
  );
}

function SystemDiagramCrisis() {
  return (
    <svg viewBox="0 0 240 180" fill="none" className="w-full h-full" aria-hidden="true">
      <circle cx="120" cy="72" r="22" stroke="#1D1D1B" strokeWidth="1.5" strokeOpacity="0.25" />
      <circle cx="120" cy="72" r="8" fill="#1D1D1B" fillOpacity="0.12" stroke="#1D1D1B" strokeWidth="1" strokeOpacity="0.35" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 120 + Math.cos(rad) * 55;
        const y2 = 72 + Math.sin(rad) * 55;
        return (
          <g key={i}>
            <line x1="120" y1="72" x2={x2} y2={y2} stroke="#1D1D1B" strokeWidth="0.8" strokeOpacity="0.12" strokeDasharray="2 3" />
            <circle cx={x2} cy={y2} r="5" fill="#1D1D1B" fillOpacity="0.06" stroke="#1D1D1B" strokeWidth="0.8" strokeOpacity="0.2" />
          </g>
        );
      })}
      <path d="M 148 57 L 175 42 L 170 57 L 185 50" stroke="#C63F3E" strokeWidth="1.2" strokeOpacity="0.5" fill="none" strokeLinecap="round" />
      <text x="120" y="148" textAnchor="middle" fontSize="6.5" fill="#1D1D1B" fillOpacity="0.38"
        fontFamily="sans-serif" letterSpacing="1">KNOWLEDGE LEAVES WITH THEM</text>
    </svg>
  );
}

const problems = [
  {
    number: "01",
    tag: "Tool Sprawl",
    headline: "Notion. Google Docs. Slack. Airtable. Loom.",
    body: "Each tool is a silo. Your content operation is scattered across platforms with no shared logic, no handover protocol, no single source of truth.",
    color: "#808BC5",
    Diagram: SystemDiagramSprawl,
  },
  {
    number: "02",
    tag: "Integration Tax",
    headline: "Every handoff costs time.",
    body: "Briefs don't become drafts cleanly. Drafts cycle through revision loops. Approval is a bottleneck. Two weeks of output turns into six.",
    color: "#C63F3E",
    Diagram: SystemDiagramTax,
  },
  {
    number: "03",
    tag: "Handover Crisis",
    headline: "Knowledge lives in people's heads.",
    body: "When they leave, it goes with them. No documented workflows. No decision logs. No system for the next person to inherit.",
    color: "#245E55",
    Diagram: SystemDiagramCrisis,
  },
];

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-prob-header]",
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: "[data-prob-header]", start: "top 82%" } }
      );
      gsap.fromTo("[data-prob-card]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: "[data-prob-card]", start: "top 80%" } }
      );
      gsap.fromTo("[data-prob-conclusion]",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: "[data-prob-conclusion]", start: "top 82%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="geo-grid-ink"
      style={{ background: "var(--paper)", color: "var(--ink)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-14 py-28 md:py-40">

        {/* Header */}
        <div data-prob-header className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="label-type-ink">The Hidden Problem</span>
            <span className="rule-line-ink w-12 inline-block" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <h2
              className="display-type"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(3.5rem, 7vw, 8rem)",
                color: "var(--ink)",
                lineHeight: 0.9,
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
                fontSize: "clamp(1.1rem, 2vw, 1.45rem)",
                color: "rgba(29,29,27,0.55)",
                lineHeight: 1.65,
              }}
            >
              Most teams think they have a writing problem. They don&rsquo;t.
              They have a systems problem — and it shows up in every brief,
              every revision cycle, every handoff.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-px mb-20" style={{ background: "rgba(29,29,27,0.1)" }}>
          {problems.map(({ number, tag, headline, body, color, Diagram }) => (
            <div
              key={number}
              data-prob-card
              className="relative"
              style={{ background: "var(--paper)" }}
            >
              {/* Diagram */}
              <div className="h-48 p-6 border-b" style={{ borderColor: "rgba(29,29,27,0.08)" }}>
                <Diagram />
              </div>
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color }}>
                    {number}
                  </span>
                  <span className="px-2 py-0.5" style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color, border: `1px solid ${color}`, opacity: 0.7 }}>
                    {tag}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", fontWeight: 500, color: "var(--ink)", lineHeight: 1.5, marginBottom: "0.6rem" }}>
                  {headline}
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", lineHeight: 1.7, color: "rgba(29,29,27,0.5)" }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div data-prob-conclusion className="border-t pt-14" style={{ borderColor: "rgba(29,29,27,0.12)" }}>
          <div className="max-w-[640px]">
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--ink)", lineHeight: 1.35, marginBottom: "1rem" }}>
              &ldquo;I don&rsquo;t have a content problem. I have a system problem.&rdquo;
            </p>
            <span className="label-type-ink">— Every serious operator, eventually</span>
          </div>
        </div>

      </div>
    </section>
  );
}
