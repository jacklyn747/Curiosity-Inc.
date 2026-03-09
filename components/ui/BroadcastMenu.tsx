"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

/* ─────────────────────────────────────────────
   CHANNEL DATA — full 9-color palette mapped
───────────────────────────────────────────── */
const CHANNELS = [
  {
    number: "01",
    href: "/builds",
    label: "The Systems",
    sub: "Content infrastructure for serious operators.",
    color: "#808BC5",
    bars: [0.45, 0.75, 0.55, 0.90, 0.40, 0.65, 0.80, 0.30, 0.70, 0.50],
  },
  {
    number: "02",
    href: "/proof",
    label: "The Work",
    sub: "Signal in the noise. Proof on the record.",
    color: "#245E55",
    bars: [0.60, 0.40, 0.80, 0.35, 0.90, 0.55, 0.70, 0.45, 0.60, 0.80],
  },
  {
    number: "03",
    href: "/about",
    label: "Who We Are",
    sub: "Behind the broadcast.",
    color: "#9ED6DF",
    bars: [0.50, 0.85, 0.30, 0.65, 0.45, 0.90, 0.25, 0.70, 0.55, 0.40],
  },
];

/* ─────────────────────────────────────────────
   FREQ BARS — animated SVG equalizer
   Color: Mustard #EAC119
───────────────────────────────────────────── */
function FreqBars({ baseHeights, color }: { baseHeights: number[]; color: string }) {
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = gRef.current;
    if (!g) return;
    const rects = Array.from(g.querySelectorAll("rect"));
    rects.forEach((rect, i) => {
      gsap.to(rect, {
        scaleY: () => baseHeights[i] * (0.4 + Math.random() * 0.6),
        duration: 0.25 + i * 0.04,
        repeat: -1,
        yoyo: true,
        ease: "steps(3)",
        delay: i * 0.06,
        transformOrigin: "bottom center",
      });
    });
    return () => {
      if (g) gsap.killTweensOf(g.querySelectorAll("rect"));
    };
  }, [baseHeights]);

  const totalW = baseHeights.length * 5 - 1;

  return (
    <svg width={totalW} height="24" viewBox={`0 0 ${totalW} 24`} fill="none">
      <g ref={gRef}>
        {baseHeights.map((h, i) => {
          const barH = Math.max(3, h * 20);
          return (
            <rect
              key={i}
              x={i * 5}
              y={24 - barH}
              width="4"
              height={barH}
              fill={color}
              opacity="0.75"
              rx="1"
            />
          );
        })}
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   BROADCAST CLOCK — live time
   Color: Pink Quartz #EAA7C7
───────────────────────────────────────────── */
function BroadcastClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      style={{
        fontFamily: "var(--font-mono, monospace)",
        fontSize: "0.65rem",
        fontWeight: 600,
        letterSpacing: "0.18em",
        color: "#EAA7C7",
      }}
    >
      {time}
    </span>
  );
}

/* ─────────────────────────────────────────────
   REC BLINK — pulsing red indicator
   Color: Red Passion #C63F3E
───────────────────────────────────────────── */
function RecBlink() {
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    gsap.to(dot, {
      opacity: 0,
      duration: 0.55,
      repeat: -1,
      yoyo: true,
      ease: "steps(1)",
    });
    return () => { if (dot) gsap.killTweensOf(dot); };
  }, []);

  return (
    <span className="flex items-center gap-1.5">
      <span
        ref={dotRef}
        style={{
          display: "inline-block",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#C63F3E",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.5rem",
          fontWeight: 700,
          letterSpacing: "0.22em",
          color: "#C63F3E",
        }}
      >
        REC
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────
   BROADCAST MENU — main component
   Props:
     isOpen   — parent controls open trigger
     onClose  — called when menu finishes closing
───────────────────────────────────────────── */
interface BroadcastMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BroadcastMenu({ isOpen, onClose }: BroadcastMenuProps) {
  const [shown, setShown] = useState(false);
  const [hoveredCh, setHoveredCh] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const channelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const closingRef = useRef(false);
  const router = useRouter();

  /* ── Open: mount first, then animate ── */
  useEffect(() => {
    if (isOpen && !shown && !closingRef.current) {
      setShown(true);
    }
  }, [isOpen, shown]);

  /* ── Run open animation after mount ── */
  useEffect(() => {
    if (!shown) return;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    const els = channelRefs.current.filter(Boolean) as HTMLAnchorElement[];

    // Reset
    gsap.set(overlay, {
      y: "-6%",
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      backgroundColor: "#1D1D1B",
      filter: "brightness(1)",
    });
    gsap.set(content, { opacity: 0 });
    gsap.set(els, { opacity: 0, x: -14, filter: "blur(6px)" });

    const tl = gsap.timeline();
    tl.to(overlay, { y: "0%", duration: 0.42, ease: "steps(5)" })
      .to(overlay, { filter: "brightness(2.4)", duration: 0.06 })
      .to(overlay, { filter: "brightness(1)", duration: 0.22, ease: "power2.out" })
      .to(content, { opacity: 1, duration: 0.15 }, "-=0.1")
      .to(
        els,
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "expo.out",
          stagger: 0.1,
        },
        "-=0.08"
      );
  }, [shown]);

  /* ── Close: CRT collapse ── */
  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) {
      setShown(false);
      onClose();
      closingRef.current = false;
      return;
    }

    // Kill all hover jitter timelines
    const els = channelRefs.current.filter(Boolean) as HTMLAnchorElement[];
    els.forEach((el) => gsap.killTweensOf(el));

    const tl = gsap.timeline({
      onComplete: () => {
        setShown(false);
        setHoveredCh(null);
        onClose();
        closingRef.current = false;
      },
    });

    tl.to(content, { opacity: 0, duration: 0.12 })
      .to(
        overlay,
        {
          scaleY: 0.007,
          backgroundColor: "#EAE4DA",
          duration: 0.22,
          ease: "power4.in",
          transformOrigin: "center center",
        },
        "-=0.06"
      )
      .to(
        overlay,
        {
          scaleX: 0,
          duration: 0.28,
          ease: "power2.in",
          transformOrigin: "center center",
        },
        "+=0.04"
      )
      .to(overlay, { opacity: 0, duration: 0.18 }, "-=0.12");
  }, [onClose]);

  /* ── ESC key ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && shown) handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown, handleClose]);

  /* ── Tracking distortion on hover ── */
  useEffect(() => {
    if (!shown) return;
    const els = channelRefs.current.filter(Boolean) as HTMLAnchorElement[];

    els.forEach((el, i) => {
      gsap.killTweensOf(el);
      const ch = CHANNELS[i];

      if (hoveredCh === null) {
        gsap.to(el, {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.35,
          ease: "expo.out",
        });
      } else if (hoveredCh === ch.number) {
        gsap.to(el, {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.22,
          ease: "power2.out",
        });
      } else {
        // VHS tracking jitter
        gsap.to(el, {
          opacity: 0.18,
          filter: "blur(0.5px)",
          duration: 0.15,
        });
        const jitter = gsap.timeline({ repeat: -1 });
        jitter
          .to(el, { x: -5, duration: 0.07, ease: "steps(1)" })
          .to(el, { x: 3, duration: 0.05, ease: "steps(1)" })
          .to(el, { x: -2, duration: 0.08, ease: "steps(1)" })
          .to(el, { x: 4, duration: 0.06, ease: "steps(1)" })
          .to(el, { x: 0, duration: 0.1, ease: "steps(1)" });
      }
    });
  }, [hoveredCh, shown]);

  /* ── Navigate and close ── */
  const handleNav = useCallback(
    (href: string) => {
      handleClose();
      setTimeout(() => router.push(href), 580);
    },
    [handleClose, router]
  );

  if (!shown) return null;

  return (
    /* ── Overlay ── */
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        backgroundColor: "#1D1D1B",
        overflow: "hidden",
      }}
    >
      {/* Scan lines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(234,228,218,0.022) 2px, rgba(234,228,218,0.022) 4px)",
          zIndex: 1,
        }}
      />

      {/* Static noise vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(29,29,27,0.65) 100%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem 3.5rem",
            borderBottom: "1px solid rgba(234,228,218,0.06)",
          }}
        >
          {/* Left: brand + status */}
          <div className="flex items-center gap-6">
            {/* Curiosity Inc wordmark */}
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <rect
                  x="0.5"
                  y="0.5"
                  width="23"
                  height="23"
                  stroke="#EAE4DA"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <rect x="6" y="6" width="12" height="12" fill="#EAE4DA" fillOpacity="0.8" />
              </svg>
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "rgba(234,228,218,0.5)",
                }}
              >
                Curiosity Inc
              </span>
            </div>

            <RecBlink />

            {/* Mustard signal bars */}
            <div className="hidden md:flex items-center gap-1.5">
              <FreqBars
                baseHeights={[0.4, 0.75, 0.55, 0.9, 0.6, 0.45, 0.8, 0.35]}
                color="#EAC119"
              />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.48rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(234,228,218,0.25)",
                  marginLeft: "6px",
                }}
              >
                BROADCAST
              </span>
            </div>
          </div>

          {/* Center: clock */}
          <BroadcastClock />

          {/* Right: close */}
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "none",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            aria-label="Close menu"
          >
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.5rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(234,228,218,0.3)",
              }}
            >
              CLOSE
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="rgba(234,228,218,0.4)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ── Channels ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 3.5rem",
            gap: "0",
          }}
        >
          {CHANNELS.map((ch, i) => (
            <a
              key={ch.number}
              ref={(el) => { channelRefs.current[i] = el; }}
              href={ch.href}
              onClick={(e) => {
                e.preventDefault();
                handleNav(ch.href);
              }}
              onMouseEnter={() => setHoveredCh(ch.number)}
              onMouseLeave={() => setHoveredCh(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3rem",
                padding: "2.2rem 0",
                borderBottom:
                  i < CHANNELS.length - 1
                    ? "1px solid rgba(234,228,218,0.05)"
                    : "none",
                textDecoration: "none",
                cursor: "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Channel number */}
              <div
                style={{
                  minWidth: "5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.5rem",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    color: "rgba(234,228,218,0.25)",
                    textTransform: "uppercase",
                  }}
                >
                  CH
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "2.8rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: ch.color,
                    opacity: 0.55,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {ch.number}
                </span>
              </div>

              {/* Divider line */}
              <div
                style={{
                  width: "1px",
                  height: "4rem",
                  background: `linear-gradient(to bottom, transparent, ${ch.color}40, transparent)`,
                }}
              />

              {/* Label + sub */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "clamp(2rem, 5vw, 4.5rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "#EAE4DA",
                    marginBottom: "0.6rem",
                    transition: "color 0.2s ease",
                  }}
                >
                  {ch.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    letterSpacing: "0.06em",
                    color: "rgba(234,228,218,0.35)",
                  }}
                >
                  {ch.sub}
                </div>
              </div>

              {/* FreqBars — right side */}
              <div className="hidden md:flex items-end gap-3">
                <FreqBars baseHeights={ch.bars} color={ch.color} />
                <div
                  style={{
                    width: "1px",
                    height: "18px",
                    background: `${ch.color}30`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.5rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    color: `${ch.color}60`,
                    writingMode: "vertical-rl",
                  }}
                >
                  SIGNAL
                </span>
              </div>

              {/* Arrow */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  opacity: hoveredCh === ch.number ? 0.9 : 0.2,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  transform:
                    hoveredCh === ch.number ? "translateX(6px)" : "translateX(0)",
                }}
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke={ch.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ))}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: "1.5rem 3.5rem",
            borderTop: "1px solid rgba(234,228,218,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Internet → App → Play */}
          <div className="flex items-center gap-3">
            {["Internet", "App", "Play"].map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.55rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#EAA7C7",
                    opacity: 0.7,
                  }}
                >
                  {step}
                </span>
                {i < 2 && (
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path
                      d="M1 4h12M8 1l3 3-3 3"
                      stroke="#EAA7C7"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.4"
                    />
                  </svg>
                )}
              </span>
            ))}
            <span
              style={{
                marginLeft: "8px",
                fontFamily: "var(--font-inter)",
                fontSize: "0.48rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: "rgba(234,228,218,0.18)",
              }}
            >
              Zero friction.
            </span>
          </div>

          {/* DEAD AIR indicator — Sky */}
          <div className="flex items-center gap-2">
            <span
              style={{
                display: "inline-block",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#9ED6DF",
                opacity: 0.5,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.48rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                color: "rgba(234,228,218,0.2)",
                textTransform: "uppercase",
              }}
            >
              LIVE SIGNAL
            </span>
          </div>

          {/* Start Here CTA */}
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              handleNav("/contact");
            }}
            className="btn-primary"
            style={{
              fontSize: "0.65rem",
              padding: "0.6rem 1.4rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "none",
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
          </a>
        </div>
      </div>
    </div>
  );
}
