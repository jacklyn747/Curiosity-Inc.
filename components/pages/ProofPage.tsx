"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FilterKey = "all" | "CSS System" | "VKB" | "AH+RL";

const systemColors: Record<string, string> = {
  "CSS System": "#808BC5",
  VKB: "#245E55",
  "AH+RL": "#9ED6DF",
};

const allArtifacts = [
  { type: "Workflow Diagram", title: "Content Production Pipeline", tag: "CSS System" as const, desc: "Visual map of the brief-to-publish cycle with decision nodes and escalation paths." },
  { type: "Review Rubric", title: "Editorial Quality Standard", tag: "CSS System" as const, desc: "5-dimension scoring framework applied to every piece before approval." },
  { type: "Brief Template", title: "Content Brief v2.3", tag: "CSS System" as const, desc: "Structured intake form that eliminates scope drift and vague creative direction." },
  { type: "Role Map", title: "RACI Content Roles", tag: "CSS System" as const, desc: "Clear ownership matrix for every position in the production workflow." },
  { type: "Style Guide", title: "Voice & Tone Framework", tag: "CSS System" as const, desc: "Editorial standards for consistency across formats and contributors." },
  { type: "Knowledge Entry", title: "Claim Verification Protocol", tag: "VKB" as const, desc: "The process for sourcing, citing, and classifying claims before they enter the knowledge base." },
  { type: "Source System", title: "Trust Tier Classification", tag: "VKB" as const, desc: "Three-tier hierarchy for evaluating source credibility and citation weight." },
  { type: "Taxonomy Map", title: "Domain Knowledge Structure", tag: "VKB" as const, desc: "Subject hierarchy that organizes the knowledge base for search and retrieval." },
  { type: "System Map", title: "Audience Hub Architecture", tag: "AH+RL" as const, desc: "Full technical and structural overview of the owned distribution system." },
  { type: "Email Framework", title: "List Segmentation System", tag: "AH+RL" as const, desc: "Behavioral tagging logic for audience segmentation and targeted delivery." },
  { type: "Library Taxonomy", title: "Resource Classification Map", tag: "AH+RL" as const, desc: "Category and access-tier structure for the content library." },
  { type: "Sample Deliverable", title: "Weekly Content Sprint Output", tag: "CSS System" as const, desc: "Annotated example of a complete sprint: briefs, drafts, approvals, published assets." },
];

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Artifacts" },
  { key: "CSS System", label: "Content Services" },
  { key: "VKB", label: "Knowledge Base" },
  { key: "AH+RL", label: "Audience Hub" },
];

export function ProofPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const pageRef = useRef<HTMLDivElement>(null);

  const filtered = activeFilter === "all"
    ? allArtifacts
    : allArtifacts.filter((a) => a.tag === activeFilter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-proof-page-header]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: 0.3 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      "[data-artifact-item]",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.07 }
    );
  }, [activeFilter]);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-14 pt-36 pb-32">
        {/* Header */}
        <div data-proof-page-header className="mb-16 opacity-0">
          <div className="flex items-center gap-4 mb-8">
            <span className="label-type">Proof of Work</span>
            <span className="rule-line w-12 inline-block" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(4rem, 8vw, 9rem)",
              color: "var(--paper)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              marginBottom: "1.5rem",
            }}
          >
            The artifacts{" "}
            <span style={{ color: "var(--tangerine)" }}>behind the systems.</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "rgba(234,228,218,0.45)",
              maxWidth: "460px",
            }}
          >
            Every claim we make is backed by an artifact. Not marketing copy — actual documents, diagrams, templates, and deliverables from our systems.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            const accentColor = f.key !== "all" ? systemColors[f.key] : "var(--tangerine)";
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "0.5rem 1rem",
                  border: `1px solid ${isActive ? accentColor : "rgba(234,228,218,0.1)"}`,
                  color: isActive ? accentColor : "rgba(234,228,218,0.35)",
                  background: isActive ? `${accentColor}10` : "transparent",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                {f.label}
                <span style={{ marginLeft: "0.5rem", opacity: 0.5 }}>
                  {f.key === "all" ? allArtifacts.length : allArtifacts.filter((a) => a.tag === f.key).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px" style={{ background: "rgba(234,228,218,0.06)" }}>
          {filtered.map((artifact, i) => {
            const accent = systemColors[artifact.tag];
            return (
              <div
                key={`${artifact.title}-${i}`}
                data-artifact-item
                className="opacity-0"
                style={{ background: "var(--ink)", padding: "1.75rem" }}
              >
                {/* Doc preview */}
                <div
                  className="mb-5 h-28 relative overflow-hidden"
                  style={{
                    background: "rgba(234,228,218,0.02)",
                    border: "1px solid rgba(234,228,218,0.05)",
                    padding: "1rem",
                  }}
                >
                  <div className="space-y-2">
                    <div style={{ height: "6px", width: "60%", background: "rgba(234,228,218,0.1)", borderRadius: "2px" }} />
                    <div style={{ height: "1px", width: "100%", background: "rgba(234,228,218,0.04)" }} />
                    {[60, 80, 45, 70].map((w, j) => (
                      <div key={j} style={{ height: "4px", width: `${w}%`, background: "rgba(234,228,218,0.06)", borderRadius: "2px" }} />
                    ))}
                  </div>
                  {/* System tag */}
                  <span
                    className="absolute top-3 right-3"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase" as const,
                      color: accent,
                      border: `1px solid ${accent}`,
                      padding: "0.15rem 0.4rem",
                      opacity: 0.8,
                    }}
                  >
                    {artifact.tag}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase" as const,
                    color: "rgba(234,228,218,0.25)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {artifact.type}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "var(--paper)",
                    lineHeight: 1.1,
                    marginBottom: "0.6rem",
                  }}
                >
                  {artifact.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.8rem",
                    lineHeight: 1.7,
                    color: "rgba(234,228,218,0.35)",
                  }}
                >
                  {artifact.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
