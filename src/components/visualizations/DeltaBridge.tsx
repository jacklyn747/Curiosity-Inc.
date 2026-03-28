import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface DeltaMetric {
  label: string;
  category: string;
  before: string;
  after: string;
  delta: string;
  magnitude: number; // 0-1
}

interface DeltaBridgeProps {
  metrics: DeltaMetric[];
  stagger?: number;
}

export const DeltaBridge: React.FC<DeltaBridgeProps> = ({ 
  metrics, 
  stagger = 200 
}) => {
  const { ref: containerRef, inView } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div 
      ref={containerRef as any}
      className={`delta-bridge-root w-full flex flex-col gap-12 transition-opacity duration-1000
        ${inView || prefersReducedMotion ? 'opacity-100' : 'opacity-0'}`}
    >
      {metrics.map((metric, i) => (
        <DeltaRow 
          key={i} 
          metric={metric} 
          index={i} 
          inView={inView} 
          stagger={stagger}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
};

const DeltaRow: React.FC<{
  metric: DeltaMetric;
  index: number;
  inView: boolean;
  stagger: number;
  prefersReducedMotion: boolean;
}> = ({ metric, index, inView, stagger, prefersReducedMotion }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tealDotRef = useRef<SVGCircleElement>(null);
  const orangeDotRef = useRef<SVGCircleElement>(null);
  const deltaTextRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    const rowDelay = (index * stagger) / 1000;

    const tl = gsap.timeline({ delay: rowDelay });

    // 1. Row fades in
    tl.fromTo(rowRef.current, 
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    // 2. Teal dot appears
    tl.fromTo(tealDotRef.current,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
      "-=0.4"
    );

    // 3. Arc draws
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.inOut'
      }, "-=0.2");
    }

    // 4. Pink delta text fades in at apex
    tl.fromTo(deltaTextRef.current,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      "-=0.6"
    );

    // 5. Orange dot appears
    tl.fromTo(orangeDotRef.current,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
      "-=0.2"
    );

  }, [inView, index, stagger, prefersReducedMotion]);

  // SVG Bridge dimensions & coordinates
  const W = 600;
  const H = 56;
  const centerY = H / 2;
  // Magnitude controls arc breadth and height
  // magnitude 0 -> teal dot at centerX, orange dot at centerX+50
  // magnitude 1 -> teal dot at 40, orange dot at 560
  const padding = 40;
  const tealX = padding + (1 - metric.magnitude) * (W / 2 - padding);
  const orangeX = W - padding;
  const peakY = centerY - (metric.magnitude * 24);
  
  const pathData = `M ${tealX} ${centerY} Q ${ (tealX + orangeX) / 2 } ${peakY} ${orangeX} ${centerY}`;
  const strokeWidth = metric.magnitude > 0.7 ? 1.5 : 1.0;

  return (
    <div 
      ref={rowRef}
      className="delta-bridge-row grid md:grid-cols-[200px_1fr_80px] gap-6 items-center"
      aria-label={`${metric.label}: ${metric.before} to ${metric.after}, change of ${metric.delta}`}
    >
      {/* Label/Category */}
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-wider opacity-40 text-[var(--color-context)]">
          {metric.category}
        </span>
        <p className="font-body text-[15px] font-normal leading-tight text-[var(--color-text)]">
          {metric.label}
        </p>
      </div>

      {/* SVG Bridge */}
      <div className="relative h-14 w-full">
        {/* Mobile values (shown below label on mobile) */}
        <div className="md:hidden flex justify-between absolute -top-4 w-full font-mono text-[11px]">
          <span style={{ color: 'var(--color-structure)' }}>{metric.before}</span>
          <span style={{ color: 'var(--color-transformation)' }}>{metric.after}</span>
        </div>

        <svg 
          viewBox={`0 0 ${W} ${H}`} 
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id={`grad-delta-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-structure)" />
              <stop offset="50%" stopColor="var(--color-insight)" />
              <stop offset="100%" stopColor="var(--color-transformation)" />
            </linearGradient>
          </defs>

          {/* Before Text - Desktop */}
          <text 
            x={tealX - 10} y={centerY} 
            textAnchor="end" dominantBaseline="middle"
            className="hidden md:block font-mono text-[11px]"
            fill="var(--color-structure)"
          >
            {metric.before}
          </text>

          {/* The Arc */}
          <path 
            ref={pathRef}
            d={pathData}
            fill="none"
            stroke={`url(#grad-delta-${index})`}
            strokeWidth={strokeWidth}
            style={{ opacity: prefersReducedMotion ? 1 : undefined }}
          />

          {/* Dots */}
          <circle 
            ref={tealDotRef}
            cx={tealX} cy={centerY} r="3" 
            fill="var(--color-structure)"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          />
          <circle 
            ref={orangeDotRef}
            cx={orangeX} cy={centerY} r="3" 
            fill="var(--color-transformation)"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          />

          {/* Delta Text at apex */}
          <text 
            ref={deltaTextRef}
            x={(tealX + orangeX) / 2} y={peakY - 10}
            textAnchor="middle" dominantBaseline="auto"
            className="font-mono text-[11px] font-medium"
            fill="var(--color-insight)"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            {metric.delta}
          </text>

          {/* After Text - Desktop */}
          <text 
            x={orangeX + 10} y={centerY} 
            textAnchor="start" dominantBaseline="middle"
            className="hidden md:block font-mono text-[11px]"
            fill="var(--color-transformation)"
          >
            {metric.after}
          </text>
        </svg>
      </div>

      {/* Delta Display (Desktop only, repeated for alignment) */}
      <div className="hidden md:flex justify-end pr-2">
        <span className="font-mono text-[14px] text-[var(--color-insight)] uppercase tracking-tight">
          {metric.delta}
        </span>
      </div>
    </div>
  );
};
