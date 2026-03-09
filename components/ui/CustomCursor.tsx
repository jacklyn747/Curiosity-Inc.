"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.15,
        ease: "power3.out",
      });
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", onMouseMove);
    document.body.classList.add("cursor-ready");

    // Hover effects
    const onHoverEnter = () => {
      gsap.to(ring, { scale: 2.5, borderColor: "rgba(201,168,76,0.5)", duration: 0.4, ease: "expo.out" });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };
    const onHoverLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: "rgba(201,168,76,0.7)", duration: 0.4, ease: "expo.out" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const interactives = document.querySelectorAll("a, button, [data-cursor]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onHoverEnter);
      el.addEventListener("mouseleave", onHoverLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.classList.remove("cursor-ready");
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-gold pointer-events-none z-[9998]"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[9997]"
        style={{
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(201,168,76,0.7)",
        }}
      />
    </>
  );
}
