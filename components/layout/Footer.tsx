"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────
   SMPTE COLOR BARS
   9-color test pattern stripe — full palette,
   arranged light-to-dark mirroring SMPTE order.
───────────────────────────────────────────── */
const COLOR_BARS = [
  { color: "#EAE4DA", label: "Paper"     },
  { color: "#EAC119", label: "Mustard"   },
  { color: "#9ED6DF", label: "Sky"       },
  { color: "#245E55", label: "Tea"       },
  { color: "#EAA7C7", label: "Pink"      },
  { color: "#ED773C", label: "Tangerine" },
  { color: "#808BC5", label: "Lavender"  },
  { color: "#C63F3E", label: "Red"       },
  { color: "#1D1D1B", label: "Ink"       },
];

/* ─────────────────────────────────────────────
   FOOTER LINKS
───────────────────────────────────────────── */
const footerNav = [
  { href: "/builds", label: "The Systems", color: "#808BC5" },
  { href: "/proof",  label: "The Work",    color: "#245E55" },
  { href: "/about",  label: "Who We Are",  color: "#9ED6DF" },
  { href: "/contact", label: "Start Here", color: "#ED773C" },
];

/* ─────────────────────────────────────────────
   FOOTER COMPONENT
───────────────────────────────────────────── */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const barsRef   = useRef<HTMLDivElement>(null);
  const col1Ref   = useRef<HTMLDivElement>(null);
  const col2Ref   = useRef<HTMLDivElement>(null);
  const col3Ref   = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      // Color bars wipe in
      const bars = barsRef.current;
      if (bars) {
        gsap.fromTo(
          bars.children,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 0.6,
            ease: "expo.out",
            stagger: 0.04,
            scrollTrigger: {
              trigger: footer,
              start: "top 92%",
            },
          }
        );
      }

      // Columns fade up
      const cols = [col1Ref.current, col2Ref.current, col3Ref.current].filter(Boolean);
      gsap.fromTo(
        cols,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
          },
        }
      );

      // Bottom strip
      const bottom = bottomRef.current;
      if (bottom) {
        gsap.fromTo(
          bottom,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 75%",
            },
          }
        );
      }
    }, footer);

    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      style={{
        position: "relative",
        background: "#1D1D1B",
        borderTop: "1px solid rgba(234,228,218,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Scan lines overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(234,228,218,0.016) 2px, rgba(234,228,218,0.016) 4px)",
          zIndex: 0,
        }}
      />

      {/* ── SMPTE color bars ── */}
      <div
        ref={barsRef}
        aria-label="Color test bars"
        style={{
          display: "flex",
          height: "5px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {COLOR_BARS.map((bar) => (
          <div
            key={bar.label}
            title={bar.label}
            style={{
              flex: 1,
              backgroundColor: bar.color,
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "4rem 3.5rem 3rem",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gap: "4rem",
        }}
        className="md:grid-cols-3 flex flex-col md:flex"
      >
        {/* Col 1 — Brand */}
        <div ref={col1Ref} style={{ opacity: 0 }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-5">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <rect
                x="0.5" y="0.5" width="23" height="23"
                stroke="#EAE4DA" strokeWidth="1" strokeOpacity="0.55"
              />
              <rect x="6" y="6" width="12" height="12" fill="#EAE4DA" fillOpacity="0.8" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(234,228,218,0.8)",
              }}
            >
              Curiosity Inc
            </span>
          </Link>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.35rem",
              fontWeight: 400,
              fontStyle: "italic",
              color: "rgba(234,228,218,0.55)",
              lineHeight: 1.5,
              marginBottom: "1.5rem",
              maxWidth: "280px",
            }}
          >
            We turn signal into system.
          </p>

          {/* Station badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 10px",
              border: "1px solid rgba(234,228,218,0.08)",
              background: "rgba(234,228,218,0.03)",
            }}
          >
            {/* Transmission tower mini icon */}
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
              <line x1="7" y1="12" x2="7" y2="7" stroke="#808BC5" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
              <line x1="4.5" y1="9.5" x2="7" y2="7" stroke="#808BC5" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
              <line x1="9.5" y1="9.5" x2="7" y2="7" stroke="#808BC5" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
              <line x1="3.5" y1="12" x2="10.5" y2="12" stroke="#808BC5" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
              <path d="M5.5 7.5 Q7 5.5 8.5 7.5" stroke="#808BC5" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.5"/>
              <path d="M3.5 9 Q7 4.5 10.5 9" stroke="#808BC5" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.3"/>
            </svg>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.48rem",
                fontWeight: 700,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(234,228,218,0.28)",
              }}
            >
              Broadcasting Co.
            </span>
          </div>
        </div>

        {/* Col 2 — Navigation */}
        <div ref={col2Ref} style={{ opacity: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.48rem",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(234,228,218,0.2)",
              marginBottom: "1.8rem",
            }}
          >
            Channels
          </p>
          <nav className="flex flex-col gap-4">
            {footerNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3"
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: link.color,
                    opacity: 0.5,
                    transition: "opacity 0.2s ease",
                    flexShrink: 0,
                  }}
                  className="group-hover:opacity-100"
                />
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    color: "rgba(234,228,218,0.4)",
                    transition: "color 0.2s ease",
                  }}
                  className="group-hover:text-[rgba(234,228,218,0.85)]"
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3 — Open a channel */}
        <div ref={col3Ref} style={{ opacity: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.48rem",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(234,228,218,0.2)",
              marginBottom: "1.8rem",
            }}
          >
            Open a Channel
          </p>

          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.1rem",
              fontWeight: 400,
              color: "rgba(234,228,218,0.45)",
              lineHeight: 1.6,
              marginBottom: "1.8rem",
              maxWidth: "220px",
            }}
          >
            Ready to end the dead air?
          </p>

          <Link
            href="/contact"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.62rem",
              padding: "0.65rem 1.4rem",
              marginBottom: "2rem",
            }}
          >
            <span>Start Here</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 6h10M6 1l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Internet → App → Play */}
          <div className="flex items-center gap-2">
            {["Internet", "App", "Play"].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.48rem",
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(234,168,199,0.45)",
                  }}
                >
                  {step}
                </span>
                {i < 2 && (
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path
                      d="M1 3h8M5.5 1l2.5 2-2.5 2"
                      stroke="#EAA7C7"
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  </svg>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div
        ref={bottomRef}
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(234,228,218,0.05)",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "1.4rem 3.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          opacity: 0,
        }}
      >
        {/* Copyright */}
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.5rem",
            fontWeight: 500,
            letterSpacing: "0.16em",
            color: "rgba(234,228,218,0.2)",
            textTransform: "uppercase",
          }}
        >
          © {year} Curiosity Inc — All rights reserved
        </span>

        {/* Three signal dots — the three channels */}
        <div className="flex items-center gap-3">
          {[
            { color: "#808BC5", label: "CH01" },
            { color: "#245E55", label: "CH02" },
            { color: "#9ED6DF", label: "CH03" },
          ].map((dot) => (
            <span key={dot.label} className="flex items-center gap-1.5" title={dot.label}>
              <span
                style={{
                  display: "inline-block",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: dot.color,
                  opacity: 0.45,
                }}
              />
            </span>
          ))}
          <span
            style={{
              marginLeft: "4px",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.45rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(234,228,218,0.15)",
            }}
          >
            Signals active
          </span>
        </div>

        {/* End of broadcast */}
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.48rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(234,228,218,0.15)",
          }}
        >
          — End of broadcast —
        </span>
      </div>
    </footer>
  );
}
