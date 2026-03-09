"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Small archival diagram graphic per card
function ArtifactGraphic({ type }: { type: string }) {
  if (type === "workflow") return (
    <svg viewBox="0 0 80 60" fill="none" className="w-full h-full" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={6 + i * 18} y={20} width={14} height={20} rx="1.5" stroke="#1D1D1B" strokeWidth="0.8" strokeOpacity="0.25" />
          {i < 3 && <line x1={20 + i * 18} y1="30" x2={24 + i * 18} y2="30" stroke="#1D1D1B" strokeWidth="0.7" strokeOpacity="0.2" />}
        </g>
      ))}
      <circle cx="40" cy="52" r="3" stroke="#1D1D1B" strokeWidth="0.7" strokeOpacity="0.3" />
    </svg>
  );

  if (type === "rubric") return (
    <svg viewBox="0 0 80 60" fill="none" className="w-full h-full" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line x1="10" y1={12 + i * 9} x2="70" y2={12 + i * 9} stroke="#1D1D1B" strokeWidth="0.7" strokeOpacity="0.18" />
          <circle cx={14 + (i % 3) * 20} cy={12 + i * 9} r="2.5" fill="#1D1D1B" fillOpacity="0.2" />
        </g>
      ))}
    </svg>
  );

  if (type === "template") return (
    <svg viewBox="0 0 80 60" fill="none" className="w-full h-full" aria-hidden="true">
      <rect x="10" y="8" width="60" height="44" rx="2" stroke="#1D1D1B" strokeWidth="0.8" strokeOpacity="0.2" />
      {[16, 24, 32, 40, 48].map((y, i) => (
        <line key={y} x1="16" y1={y} x2={i === 0 ? 50 : 64} y2={y} stroke="#1D1D1B" strokeWidth="0.7" strokeOpacity={i === 0 ? 0.35 : 0.15} />
      ))}
    </svg>
  );

  if (type === "map") return (
    <svg viewBox="0 0 80 60" fill="none" className="w-full h-full" aria-hidden="true">
      <circle cx="40" cy="30" r="18" stroke="#1D1D1B" strokeWidth="0.8" strokeOpacity="0.2" />
      <circle cx="40" cy="30" r="10" stroke="#1D1D1B" strokeWidth="0.8" strokeOpacity="0.25" />
      <circle cx="40" cy="30" r="3" fill="#1D1D1B" fillOpacity="0.35" />
      {[0, 72, 144, 216, 288].map((a) => {
        const r = (a * Math.PI) / 180;
        return <line key={a} x1={40 + Math.cos(r) * 10} y1={30 + Math.sin(r) * 10} x2={40 + Math.cos(r) * 18} y2={30 + Math.sin(r) * 18} stroke="#1D1D1B" strokeWidth="0.7" strokeOpacity="0.2" />;
      })}
    </svg>
  );

  if (type === "entry") return (
    <svg viewBox="0 0 80 60" fill="none" className="w-full h-full" aria-hidden="true">
      <rect x="12" y="10" width="56" height="40" rx="2" stroke="#1D1D1B" strokeWidth="0.8" strokeOpacity="0.18" />
      <line x1="12" y1="22" x2="68" y2="22" stroke="#1D1D1B" strokeWidth="0.7" strokeOpacity="0.15" />
      <circle cx="20" cy="16" r="3" fill="#1D1D1B" fillOpacity="0.3" />
      {[28, 35, 42].map((y) => (
        <line key={y} x1="18" y1={y} x2="62" y2={y} stroke="#1D1D1B" strokeWidth="0.7" strokeOpacity="0.12" />
      ))}
    </svg>
  );

  // default: sprint
  return (
    <svg viewBox="0 0 80 60" fill="none" className="w-full h-full" aria-hidden="true">
      {[0, 1, 2].map((col) => (
        <g key={col}>
          <rect x={8 + col * 24} y="10" width="20" height="40" rx="2" stroke="#1D1D1B" strokeWidth="0.7" strokeOpacity="0.18" />
          {[18, 26, 34, 42].map((y) => (
            <line key={y} x1={10 + col * 24} y1={y} x2={26 + col * 24} y2={y} stroke="#1D1D1B" strokeWidth="0.6" strokeOpacity="0.12" />
          ))}
        </g>
      ))}
    </svg>
  );
}

const artifacts = [
  { id: "A1", system: "CSS", type: "workflow", artifactType: "Workflow Diagram", name: "Content Production Pipeline", desc: "Visual map of the brief-to-publish cycle with decision nodes and escalation paths." },
  { id: "A2", system: "CSS", type: "rubric", artifactType: "Review Rubric", name: "Editorial Quality Standard", desc: "5-dimension scoring framework applied to every piece before approval." },
  { id: "A3", system: "CSS", type: "template", artifactType: "Brief Template", name: "Content Brief v2.3", desc: "Structured intake form that eliminates scope drift and vague creative direction." },
  { id: "A4", system: "VKB", type: "entry", artifactType: "Knowledge Entry", name: "Claim Verification Protocol", desc: "The process for sourcing, citing, and classifying claims before they enter the knowledge base." },
  { id: "A5", system: "AH", type: "map", artifactType: "System Map", name: "Audience Hub Architecture", desc: "Full technical and structural overview of the owned distribution system." },
  { id: "A6", system: "CSS", type: "sprint", artifactType: "Sample Deliverable", name: "Weekly Content Sprint Output", desc: "Annotated example of a complete sprint: briefs, drafts, approvals, published assets." },
];

const systemColors: Record<string, string> = {
  CSS: "#808BC5",
  VKB: "#245E55",
  AH: "#9ED6DF",
};

export function Proof() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-proof-header]",
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: "[data-proof-header]", start: "top 82%" } }
      );
      gsap.fromTo("[data-proof-card]",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.1,
          scrollTrigger: { trigger: "[data-proof-card]", start: "top 78%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "var(--paper)", color: "var(--ink)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-14 py-28 md:py-40">

        {/* Header */}
        <div data-proof-header className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="label-type-ink">Proof of Work</span>
            <span className="rule-line-ink w-12 inline-block" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <h2
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(3.5rem, 7vw, 8rem)",
                color: "var(--ink)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
              }}
            >
              The artifacts<br />
              <span style={{ color: "var(--tangerine)" }}>behind</span><br />
              the systems.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "rgba(29,29,27,0.5)",
                lineHeight: 1.65,
              }}
            >
              Every claim we make is backed by an artifact. Not marketing copy
              — actual documents, diagrams, templates, and deliverables from our
              systems.
            </p>
          </div>
        </div>

        {/* Archival grid */}
        <div className="grid md:grid-cols-3 gap-px mb-14" style={{ background: "rgba(29,29,27,0.1)" }}>
          {artifacts.map(({ id, system, type, artifactType, name, desc }) => (
            <div
              key={id}
              data-proof-card
              className="flex flex-col"
              style={{ background: "var(--paper)" }}
            >
              {/* Archival ID strip */}
              <div
                className="px-5 py-3 flex items-center justify-between border-b"
                style={{ borderColor: "rgba(29,29,27,0.08)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      color: "rgba(29,29,27,0.35)",
                    }}
                  >
                    {id}
                  </span>
                  <span
                    className="px-2 py-0.5"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: systemColors[system],
                      border: `1px solid ${systemColors[system]}`,
                      opacity: 0.8,
                    }}
                  >
                    {system === "AH" ? "AH+RL" : system}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.5rem",
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(29,29,27,0.3)",
                  }}
                >
                  {artifactType}
                </span>
              </div>

              {/* Diagram preview */}
              <div
                className="h-24 px-6 py-3 border-b"
                style={{ borderColor: "rgba(29,29,27,0.06)", background: "rgba(29,29,27,0.02)" }}
              >
                <ArtifactGraphic type={type} />
              </div>

              {/* Info */}
              <div className="px-5 py-5">
                <h3
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                    lineHeight: 1.4,
                    marginBottom: "0.5rem",
                  }}
                >
                  {name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.76rem",
                    lineHeight: 1.65,
                    color: "rgba(29,29,27,0.45)",
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to proof gallery */}
        <div className="flex justify-center">
          <Link
            href="/proof"
            className="btn-primary-dark flex items-center gap-3"
          >
            <span>View Full Proof Gallery</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
