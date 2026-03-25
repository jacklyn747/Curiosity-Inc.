import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { useStagger } from '../../hooks/useStagger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ScaffoldBand {
  label: string;
  sublabel?: string;
  content: string;
  detail?: string;
  accentColor: 'structure' | 'transformation' | 'insight' | 'context';
}

interface ScaffoldProps {
  bands: ScaffoldBand[];
  direction?: 'up' | 'down'; // Default 'up' per spec entry logic
}

const COLOR_MAP = {
  structure: 'var(--color-structure)',
  transformation: 'var(--color-transformation)',
  insight: 'var(--color-insight)',
  context: 'var(--color-context)',
};

export const Scaffold: React.FC<ScaffoldProps> = ({ bands, direction = 'up' }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { ref: containerRef, inView } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    // Staggered entry: bottom-to-top means reverse the array if direction is 'up'
    const orderedBands = direction === 'up' ? [...bandRefs.current].reverse() : bandRefs.current;
    
    // translateY: 20px → 0, opacity 0 → 1, 150ms stagger
    const staggerVal = useStagger(1, 150) / 1000;

    gsap.fromTo(orderedBands, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: staggerVal, 
        ease: 'var(--ease-out)',
        delay: 0.2
      }
    );

    // Left-border accent draws downward
    orderedBands.forEach((band, i) => {
      const border = band?.querySelector('.scaffold-accent-line');
      const idx = direction === 'up' ? (bands.length - 1 - i) : i;
      const borderDelay = (useStagger(idx, 150) / 1000) + 0.4;

      if (border) {
        gsap.fromTo(border,
          { scaleY: 0 },
          { 
            scaleY: 1, 
            duration: 1.2, 
            ease: 'power3.inOut', 
            delay: borderDelay
          }
        );
      }
    });
  }, [inView, bands.length, direction, prefersReducedMotion]);

  const toggleExpand = (index: number) => {
    if (!bands[index].detail) return;
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div 
      ref={containerRef as any} 
      className="scaffold-root w-full flex flex-col"
      style={{ opacity: inView || prefersReducedMotion ? 1 : 0 }}
    >
      {bands.map((band, i) => {
        const isExpanded = (expandedIndex === i || prefersReducedMotion) && !!band.detail;
        const color = COLOR_MAP[band.accentColor];
        
        return (
          <div 
            key={i}
            ref={(el) => { bandRefs.current[i] = el; }}
            className="scaffold-band relative overflow-hidden transition-colors duration-500 cursor-pointer"
            onClick={() => toggleExpand(i)}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '0.5px solid rgba(136, 136, 136, 0.1)', // var(--color-context) at 10%
              opacity: inView || prefersReducedMotion ? 1 : 0,
              transform: inView || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            {/* Left Accent (3px) */}
            <div 
              className="scaffold-accent-line absolute top-0 left-0 w-[3px] h-full origin-top"
              style={{ backgroundColor: color }}
            />

            <div className="py-6 px-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  {band.sublabel && (
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase opacity-60 text-[var(--color-context)]">
                      {band.sublabel}
                    </span>
                  )}
                  <h3 className="font-body text-[16px] font-normal leading-tight text-[var(--color-text)]">
                    {band.label}
                  </h3>
                </div>
                
                {band.detail && (
                  <div 
                    className="scaffold-chevron opacity-30 transition-transform duration-500"
                    style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M4 3L8 6L4 9" stroke="var(--color-context)" strokeWidth="1" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="mt-2 font-body text-[14px] font-light text-[var(--color-text-dim)] leading-relaxed max-w-[640px]">
                {band.content}
              </div>

              {/* Detail Content */}
              <div 
                className="overflow-hidden transition-all duration-500 ease-out"
                style={{ 
                  maxHeight: isExpanded ? '600px' : '0px',
                  opacity: isExpanded ? 1 : 0,
                  marginTop: isExpanded ? '1.5rem' : '0'
                }}
              >
                <div className="pt-4 border-t border-white/[0.05] font-body text-[14px] leading-relaxed text-[var(--color-text)] italic opacity-90">
                  {band.detail}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
