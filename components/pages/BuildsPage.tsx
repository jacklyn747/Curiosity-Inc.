"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const systemColors: Record<string, string> = {
  CSS: "#808BC5",
  VKB: "#245E55",
  AH: "#9ED6DF",
};

const systems = [
  {
    id: "01",
    key: "CSS",
    name: "Content\nServices\nSystem",
    tagline: "Brief → Draft → Review → Approve",
    description:
      "The Content Services System is a fully documented production pipeline for teams that create content at volume. It eliminates revision loops, vague creative direction, and delivery chaos by making every handoff explicit, every decision documented, and every role accountable.",
    how: [
      "Intake brief captures objective, audience, format, and constraints",
      "Structured draft process follows a style-guide-aligned template",
      "Multi-layer review rubric scores against 5 quality dimensions",
      "Approval workflow with versioning and sign-off documentation",
      "Asset delivery with final QA checklist",
    ],
    artifacts: ["Content brief template", "Review rubric (5-dimension)", "Production workflow diagram", "Role RACI matrix", "Style guide scaffold"],
    solves: "Revision loops · Vague feedback · Delivery chaos",
  },
  {
    id: "02",
    key: "VKB",
    name: "Verified\nKnowledge\nBase",
    tagline: "Claim → Citation → Review",
    description:
      "The Verified Knowledge Base transforms expertise into a documented, citable, AI-ready system. Every claim is sourced. Every insight is classified. The result is intellectual infrastructure that compounds over time — and credibility that survives scrutiny.",
    how: [
      "Claim capture process from internal experts and external research",
      "Citation protocol with source classification and trust tiers",
      "Review workflow for accuracy, currency, and relevance",
      "Knowledge taxonomy aligned to your domain",
      "Integration layer for AI tools and content systems",
    ],
    artifacts: ["Knowledge entry template", "Claim verification protocol", "Source classification system", "Domain taxonomy map", "AI integration guide"],
    solves: "AI credibility · Expertise fragmentation · Knowledge loss",
  },
  {
    id: "03",
    key: "AH",
    name: "Audience Hub\n+ Resource\nLibrary",
    tagline: "Paywall → Library → Email",
    description:
      "The Audience Hub is owned distribution infrastructure. It gives you the architecture to monetize your knowledge, build your list, and retain your audience — without depending on any platform you don't control.",
    how: [
      "Resource library architecture: categories, access tiers, gating logic",
      "Email list integration with tagging and segmentation framework",
      "Paywall and pricing structure for premium content",
      "Content delivery workflow from production to library",
      "Analytics and engagement tracking system",
    ],
    artifacts: ["Hub architecture diagram", "Email segmentation map", "Paywall configuration guide", "Content library taxonomy", "Audience growth playbook"],
    solves: "Rented audience · Scattered resources · Platform dependency",
  },
];

export function BuildsPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-page-header]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: 0.3 }
      );
      gsap.fromTo(
        "[data-system-block]",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.2,
          scrollTrigger: { trigger: "[data-systems-list]", start: "top 80%" },
        }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-14 pt-36 pb-32">
        {/* Header */}
        <div data-page-header className="mb-24 max-w-[700px] opacity-0">
          <div className="flex items-center gap-4 mb-8">
            <span className="label-type">The Builds</span>
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
            Three systems.{" "}
            <span style={{ color: "var(--tangerine)" }}>One stack.</span>
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
            Each build solves a distinct layer of your content operation. They can be implemented independently or as an integrated infrastructure.
          </p>
        </div>

        {/* Systems */}
        <div data-systems-list className="space-y-px" style={{ background: "rgba(234,228,218,0.06)" }}>
          {systems.map((system) => {
            const accent = systemColors[system.key];
            return (
              <div
                key={system.id}
                data-system-block
                className="opacity-0"
                style={{ background: "var(--ink)", padding: "3.5rem 3.5rem" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-14">
                  {/* Left */}
                  <div>
                    {/* System meta row */}
                    <div className="flex items-center gap-4 mb-8">
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "0.2em",
                          color: "rgba(234,228,218,0.25)",
                        }}
                      >
                        SYSTEM {system.id}
                      </span>
                      <span style={{ color: accent, opacity: 0.5 }}>—</span>
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase" as const,
                          color: accent,
                          opacity: 0.7,
                        }}
                      >
                        {system.tagline}
                      </span>
                    </div>

                    {/* System name */}
                    <h2
                      style={{
                        fontFamily: "var(--font-bebas)",
                        fontSize: "clamp(3rem, 5vw, 5.5rem)",
                        color: "var(--paper)",
                        lineHeight: 0.92,
                        letterSpacing: "0.02em",
                        marginBottom: "1.5rem",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {system.name}
                    </h2>

                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.9375rem",
                        lineHeight: 1.8,
                        color: "rgba(234,228,218,0.5)",
                        maxWidth: "520px",
                        marginBottom: "2rem",
                      }}
                    >
                      {system.description}
                    </p>

                    {/* How it works */}
                    <div className="mb-8">
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.55rem",
                          fontWeight: 700,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase" as const,
                          color: "rgba(234,228,218,0.2)",
                          marginBottom: "1rem",
                        }}
                      >
                        HOW IT WORKS
                      </p>
                      <ol className="space-y-3">
                        {system.how.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span
                              style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                color: accent,
                                opacity: 0.5,
                                marginTop: "0.15rem",
                                flexShrink: 0,
                                width: "1rem",
                              }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.875rem",
                                lineHeight: 1.6,
                                color: "rgba(234,228,218,0.55)",
                              }}
                            >
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Solves */}
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        color: "rgba(234,228,218,0.4)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.55rem",
                          fontWeight: 700,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase" as const,
                          color: "rgba(234,228,218,0.2)",
                          marginRight: "0.75rem",
                        }}
                      >
                        Solves
                      </span>
                      {system.solves}
                    </p>
                  </div>

                  {/* Right: Artifacts */}
                  <div
                    style={{
                      borderLeft: "1px solid rgba(234,228,218,0.06)",
                      paddingLeft: "3rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase" as const,
                        color: "rgba(234,228,218,0.2)",
                        marginBottom: "1.25rem",
                      }}
                    >
                      INCLUDED ARTIFACTS
                    </p>
                    <div>
                      {system.artifacts.map((artifact, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 py-3"
                          style={{ borderBottom: "1px solid rgba(234,228,218,0.05)" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                            <rect x="0.5" y="0.5" width="11" height="11" stroke={accent} strokeOpacity="0.35" />
                            <rect x="3" y="3" width="6" height="6" fill={accent} fillOpacity="0.15" />
                          </svg>
                          <span
                            style={{
                              fontFamily: "var(--font-inter)",
                              fontSize: "0.8125rem",
                              color: "rgba(234,228,218,0.5)",
                            }}
                          >
                            {artifact}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8">
                      <Link href="/contact" className="btn-primary w-full justify-center" style={{ fontSize: "0.7rem" }}>
                        <span>Build This System</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
