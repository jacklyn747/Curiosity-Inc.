"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { BroadcastMenu } from "@/components/ui/BroadcastMenu";

const navLinks = [
  { href: "/builds", label: "The Systems", color: "#808BC5" },
  { href: "/proof",  label: "The Work",    color: "#245E55" },
  { href: "/about",  label: "Who We Are",  color: "#9ED6DF" },
];

/* ─────────────────────────────────────────────
   SIGNAL TRIGGER — animated equalizer bars
   Opens the BroadcastMenu on click
───────────────────────────────────────────── */
function SignalTrigger({ onClick }: { onClick: () => void }) {
  const barsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = barsRef.current;
    if (!g) return;
    const bars = Array.from(g.querySelectorAll("rect"));
    bars.forEach((bar, i) => {
      gsap.to(bar, {
        scaleY: () => 0.25 + Math.random() * 0.75,
        duration: 0.35 + i * 0.08,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1,
        transformOrigin: "bottom center",
      });
    });
    return () => {
      if (g) gsap.killTweensOf(g.querySelectorAll("rect"));
    };
  }, []);

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 group"
      style={{ background: "none", border: "none", cursor: "none", padding: "4px 0" }}
      aria-label="Open broadcast navigation"
    >
      <svg width="30" height="18" viewBox="0 0 30 18" fill="none">
        <g ref={barsRef}>
          <rect x="0"  y="6"  width="4" height="12" fill="#808BC5" opacity="0.65" rx="1" />
          <rect x="6"  y="0"  width="4" height="18" fill="#808BC5" opacity="0.65" rx="1" />
          <rect x="12" y="7"  width="4" height="11" fill="#808BC5" opacity="0.65" rx="1" />
          <rect x="18" y="2"  width="4" height="16" fill="#808BC5" opacity="0.65" rx="1" />
          <rect x="24" y="9"  width="4" height="9"  fill="#808BC5" opacity="0.65" rx="1" />
        </g>
      </svg>
      <span
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(234,228,218,0.35)",
          transition: "color 0.2s ease",
        }}
        className="group-hover:text-[rgba(234,228,218,0.7)]"
      >
        Tune
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */
export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.5 }
    );
  }, []);

  // Scroll glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 opacity-0 ${
          scrolled ? "py-4 border-b backdrop-blur-xl" : "py-7"
        }`}
        style={{
          background: scrolled ? "rgba(29,29,27,0.92)" : "transparent",
          borderColor: scrolled ? "rgba(234,228,218,0.08)" : "transparent",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-14 flex items-center justify-between">

          {/* Logo mark */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-6 h-6 relative">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <rect
                  x="0.5" y="0.5" width="23" height="23"
                  stroke="#EAE4DA" strokeWidth="1" strokeOpacity="0.7"
                />
                <rect x="6" y="6" width="12" height="12" fill="#EAE4DA" fillOpacity="0.85" />
              </svg>
            </div>
            <span
              className="text-[0.7rem] font-semibold tracking-[0.22em] uppercase"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(234,228,218,0.85)" }}
            >
              Curiosity Inc
            </span>
          </Link>

          {/* Nav links with signal dots */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:
                    pathname === link.href
                      ? "rgba(234,228,218,0.9)"
                      : "rgba(234,228,218,0.35)",
                  transition: "color 0.3s ease",
                }}
              >
                {/* Signal dot */}
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: link.color,
                    opacity: pathname === link.href ? 1 : 0.4,
                    transition: "opacity 0.3s ease",
                    flexShrink: 0,
                  }}
                />
                {link.label}
                {/* Active underline — uses link's own color */}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                  style={{
                    width: pathname === link.href ? "100%" : "0%",
                    background: link.color,
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Right side: Signal trigger + CTA */}
          <div className="flex items-center gap-6">
            {/* Signal trigger — opens BroadcastMenu */}
            <div className="hidden md:block">
              <SignalTrigger onClick={() => setMenuOpen(true)} />
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="hidden md:flex btn-primary text-[0.65rem] px-5 py-2.5 gap-2"
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

            {/* Mobile: hamburger-style signal trigger */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setMenuOpen(true)}
              style={{ background: "none", border: "none", cursor: "none" }}
              aria-label="Open navigation"
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <line x1="0" y1="2"  x2="22" y2="2"  stroke="rgba(234,228,218,0.6)" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="0" y1="8"  x2="16" y2="8"  stroke="rgba(234,228,218,0.6)" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="0" y1="14" x2="20" y2="14" stroke="rgba(234,228,218,0.6)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Broadcast Menu — rendered outside nav to cover full viewport */}
      <BroadcastMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
