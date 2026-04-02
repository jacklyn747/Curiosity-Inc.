import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface LensProps {
  value: string;
  sublabel: string;
  beforeLabel: [string, string];
  afterLabel: [string, string];
}

export const Lens: React.FC<LensProps> = ({ 
  value, 
  sublabel, 
  beforeLabel, 
  afterLabel 
}) => {
  const { ref: containerRef, inView } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();
  const leftCircleRef = useRef<SVGCircleElement>(null);
  const rightCircleRef = useRef<SVGCircleElement>(null);
  const intersectionRef = useRef<SVGEllipseElement>(null);
  const valueRef = useRef<SVGTextElement>(null);
  const sublabelRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    const tl = gsap.timeline({ delay: 0.2 });

    // 1. Simultaneous Circle Draw
    [leftCircleRef.current, rightCircleRef.current].forEach(circle => {
      if (circle) {
        const length = circle.getTotalLength();
        gsap.set(circle, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(circle, { 
          strokeDashoffset: 0, 
          duration: 0.8, 
          ease: 'power2.inOut' 
        }, 0);
      }
    });

    // 2. Intersection gradient fill fades in
    tl.fromTo(intersectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      "+=0.4"
    );

    // 3. Pink value text fade in
    tl.fromTo(valueRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
      "-=0.4"
    );

    // 4. Sublabel fades in
    tl.fromTo(sublabelRef.current,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      "-=0.2"
    );

  }, [inView, prefersReducedMotion]);

  return (
    <div 
      ref={containerRef as any}
      className={`lens-root w-full flex justify-center py-12 transition-opacity duration-1000
        ${inView || prefersReducedMotion ? 'opacity-100' : 'opacity-0'}`}
    >
      <svg 
        viewBox="0 0 480 220" 
        className="w-full max-w-[480px] h-auto overflow-visible"
        aria-label={`${value} — ${sublabel}. Comparing ${beforeLabel.join(' ')} to ${afterLabel.join(' ')}.`}
      >
        <defs>
          <linearGradient id="grad-lens-intersection" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-structure)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-transformation)" stopOpacity="0.4" />
          </linearGradient>
          
          <clipPath id="clip-lens-intersection">
            <circle cx="280" cy="110" r="90" />
          </clipPath>
        </defs>

        {/* Intersection Fill (clipped) */}
        <circle 
          ref={intersectionRef as any}
          cx="200" cy="110" r="90" 
          fill="url(#grad-lens-intersection)" 
          clipPath="url(#clip-lens-intersection)"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        />

        {/* Left Circle */}
        <circle 
          ref={leftCircleRef}
          cx="200" cy="110" r="90" 
          fill="none" 
          stroke="var(--color-structure)" 
          strokeWidth="1" 
          style={{ opacity: 0.6 }}
        />

        {/* Right Circle */}
        <circle 
          ref={rightCircleRef}
          cx="280" cy="110" r="90" 
          fill="none" 
          stroke="var(--color-transformation)" 
          strokeWidth="1" 
          style={{ opacity: 0.6 }}
        />

        {/* Labels - Circle Centers */}
        <g className="font-mono text-[9px] tracking-[0.1em] uppercase opacity-40">
          <text x="140" y="105" textAnchor="middle">
            <tspan x="140" dy="0">{beforeLabel[0]}</tspan>
            <tspan x="140" dy="12">{beforeLabel[1]}</tspan>
          </text>
          <text x="340" y="105" textAnchor="middle">
            <tspan x="340" dy="0">{afterLabel[0]}</tspan>
            <tspan x="340" dy="12">{afterLabel[1]}</tspan>
          </text>
        </g>

        {/* Center Insight */}
        <g textAnchor="middle">
          <text 
            ref={valueRef}
            x="240" y="115"
            className="font-display text-[32px] font-normal"
            fill="var(--color-insight)"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            {value}
          </text>
          <text 
            ref={sublabelRef}
            x="240" y="135"
            className="font-mono text-[9px] uppercase tracking-[0.1em] opacity-60"
            fill="var(--color-text)"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            {sublabel}
          </text>
        </g>
      </svg>
    </div>
  );
};
