"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const navLinks = [
  { href: "/builds", label: "Builds" },
  { href: "/proof", label: "Proof" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.5 }
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
              <rect x="0.5" y="0.5" width="23" height="23" stroke="#EAE4DA" strokeWidth="1" strokeOpacity="0.7" />
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

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: pathname === link.href
                  ? "rgba(234,228,218,0.9)"
                  : "rgba(234,228,218,0.35)",
                transition: "color 0.3s ease",
              }}
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                style={{
                  width: pathname === link.href ? "100%" : "0%",
                  background: "var(--tangerine)",
                }}
              />
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link href="/contact" className="hidden md:flex btn-primary text-[0.65rem] px-5 py-2.5 gap-2">
          <span>Book a Build Call</span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
