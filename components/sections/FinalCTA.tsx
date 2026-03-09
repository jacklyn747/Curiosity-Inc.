"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      tl.fromTo(
        "[data-cta-label]",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }
      )
        .fromTo(
          "[data-cta-line]",
          { opacity: 0, y: 60, skewY: 1.5 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          "[data-cta-rule]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "expo.out", transformOrigin: "left" },
          "-=0.7"
        )
        .fromTo(
          "[data-cta-sub]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
          "-=0.5"
        )
        .fromTo(
          "[data-cta-btns]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
          "-=0.5"
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

        {/* Label */}
        <div data-cta-label className="flex items-center gap-4 mb-10">
          <span className="label-type">Ready to Build</span>
          <span className="rule-line w-12 inline-block" />
        </div>

        {/* Poster headline */}
        <h2 className="mb-0" aria-label="Your ideas deserve better infrastructure">
          <span
            data-cta-line
            className="display-type opacity-0 block"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(4rem, 8.5vw, 10rem)",
              color: "var(--paper)",
              lineHeight: 0.88,
            }}
          >
            Your ideas deserve
          </span>
          <span
            data-cta-line
            className="display-type opacity-0 block"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(4rem, 8.5vw, 10rem)",
              color: "var(--tangerine)",
              lineHeight: 0.88,
            }}
          >
            better infrastructure.
          </span>
        </h2>

        {/* Thin rule */}
        <div
          data-cta-rule
          className="mt-10 mb-10 h-px"
          style={{ background: "rgba(234,228,218,0.15)", transformOrigin: "left" }}
        />

        {/* Sub */}
        <p
          data-cta-sub
          className="opacity-0 mb-12"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(0.85rem, 1.3vw, 1rem)",
            fontWeight: 400,
            lineHeight: 1.75,
            color: "rgba(234,228,218,0.45)",
            maxWidth: "480px",
          }}
        >
          We book a limited number of build calls each month. Tell us what
          you&apos;re working on — we&apos;ll tell you which system fits.
        </p>

        {/* Buttons */}
        <div data-cta-btns className="flex flex-wrap items-center gap-4 opacity-0 mb-6">
          <Link href="/contact" className="btn-primary flex items-center gap-3">
            <span>Book a Build Call</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href="/contact#newsletter" className="btn-secondary">
            <span>Join the List</span>
          </Link>
        </div>

        {/* Trust micro-copy */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            color: "rgba(234,228,218,0.18)",
          }}
        >
          No pitch decks. No agency bloat. Just systems.
        </p>

      </div>

      {/* Footer strip */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(234,228,218,0.08)" }}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-14 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <rect x="0.5" y="0.5" width="23" height="23" stroke="#EAE4DA" strokeWidth="1" strokeOpacity="0.5" />
              <rect x="6" y="6" width="12" height="12" fill="#EAE4DA" fillOpacity="0.7" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(234,228,218,0.3)",
              }}
            >
              Curiosity Inc
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-8">
            {[
              { href: "/builds", label: "Builds" },
              { href: "/proof", label: "Proof" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(234,228,218,0.25)",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(234,228,218,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(234,228,218,0.25)")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              color: "rgba(234,228,218,0.18)",
            }}
          >
            © 2025 Curiosity Inc
          </p>
        </div>
      </div>
    </section>
  );
}
