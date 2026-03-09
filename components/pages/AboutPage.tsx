"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    number: "I",
    title: "Infrastructure First",
    body: "Most people start with content. We start with systems. The infrastructure determines what's possible — and what's sustainable.",
  },
  {
    number: "II",
    title: "Proof Over Promise",
    body: "Everything we deliver comes with documentation. Not because we're defensive, but because rigor is a form of respect.",
  },
  {
    number: "III",
    title: "Intellectual Glamour",
    body: "Serious ideas deserve beautiful structure. We reject the false choice between intellectual depth and visual sophistication.",
  },
  {
    number: "IV",
    title: "Invisible Infrastructure",
    body: "The best systems disappear. When we build well, all you see is the quality of your output — not the scaffolding underneath.",
  },
];

export function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-about-header]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: 0.3 }
      );
      gsap.fromTo(
        "[data-about-principle]",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: "[data-principles]", start: "top 78%" },
        }
      );
      gsap.fromTo(
        "[data-about-statement]",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: "[data-about-statement]", start: "top 80%" },
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
        <div data-about-header className="mb-28 max-w-[780px] opacity-0">
          <div className="flex items-center gap-4 mb-8">
            <span className="label-type">Curiosity Inc</span>
            <span className="rule-line w-12 inline-block" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(4rem, 8vw, 9rem)",
              color: "var(--paper)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              marginBottom: "2rem",
            }}
          >
            Intellectual glamour.{" "}
            <span style={{ color: "var(--tangerine)" }}>Invisible infrastructure.</span>
          </h1>
          <div className="space-y-5 max-w-[560px]">
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "rgba(234,228,218,0.55)",
              }}
            >
              Curiosity Inc exists for the operators, founders, and thinkers whose ideas are more sophisticated than their content infrastructure allows them to express.
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.9375rem",
                lineHeight: 1.85,
                color: "rgba(234,228,218,0.4)",
              }}
            >
              We build the systems underneath — the content pipelines, knowledge architectures, and distribution infrastructure that make serious intellectual work scalable, credible, and owned.
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.9375rem",
                lineHeight: 1.85,
                color: "rgba(234,228,218,0.4)",
              }}
            >
              This is not an agency. It is not a content mill. It is a systems studio, and we build for people who understand the difference.
            </p>
          </div>
        </div>

        {/* Principles */}
        <div className="mb-28">
          <div className="flex items-center gap-4 mb-10">
            <span className="label-type">The Philosophy</span>
            <span className="rule-line w-12 inline-block" />
          </div>
          <div data-principles className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(234,228,218,0.06)" }}>
            {principles.map((p) => (
              <div
                key={p.number}
                data-about-principle
                className="opacity-0"
                style={{ background: "var(--ink)", padding: "2.5rem" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "4rem",
                    color: "rgba(234,228,218,0.08)",
                    lineHeight: 1,
                    marginBottom: "1.5rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {p.number}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.6rem",
                    fontWeight: 400,
                    color: "var(--paper)",
                    lineHeight: 1.1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.875rem",
                    lineHeight: 1.8,
                    color: "rgba(234,228,218,0.45)",
                  }}
                >
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statement */}
        <div
          data-about-statement
          className="opacity-0 text-center"
          style={{
            padding: "5rem 0",
            borderTop: "1px solid rgba(234,228,218,0.06)",
            borderBottom: "1px solid rgba(234,228,218,0.06)",
            marginBottom: "5rem",
          }}
        >
          <blockquote
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
              fontWeight: 400,
              lineHeight: 1.2,
              color: "var(--paper)",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            &ldquo;The work that matters most is often the work no one sees — the{" "}
            <span style={{ color: "var(--tangerine)" }}>structure underneath</span>{" "}
            that makes everything above it possible.&rdquo;
          </blockquote>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Link href="/contact" className="btn-primary">
            <span>Book a Build Call</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href="/builds" className="btn-secondary">
            <span>See the Systems</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
