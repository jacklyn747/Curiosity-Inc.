import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ScaffoldBand {
  label: string;
  sublabel?: string;
  content: string;
  detail?: string;
  accentColor: 'structure' | 'transformation' | 'insight' | 'context' | 'mustard' | 'lavender' | 'sky' | 'tea' | 'pink' | 'tangerine';
}

interface ScaffoldProps {
  bands: ScaffoldBand[];
}

const COLOR_MAP = {
  structure: 'var(--color-structure)',
  transformation: 'var(--color-transformation)',
  insight: 'var(--color-insight)',
  context: 'var(--color-context)',
  mustard: 'var(--color-mustard)',
  lavender: 'var(--color-lavender)',
  sky: 'var(--color-structure)',
  tea: 'var(--color-tea)',
  pink: 'var(--color-pink)',
  tangerine: 'var(--color-transformation)',
};

export const Scaffold: React.FC<ScaffoldProps> = ({ bands }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !scrollRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cardDistance = 1200; // Adjusted for better scroll feel
      const pinDistance = bands.length * cardDistance;
      
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${pinDistance}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      bands.forEach((_, i) => {
        const band = bandRefs.current[i];
        if (!band) return;

        // Label for this band's sequence
        const startLabel = `band-${i}`;
        masterTl.add(startLabel, i * cardDistance);

        // Sequence for each band:
        // 1. Entrance (except first one, which is visible)
        if (i > 0) {
          masterTl.fromTo(band, 
            { yPercent: 100, opacity: 0, pointerEvents: 'none' }, 
            { yPercent: 0, opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: "none" },
            startLabel
          );
        } else {
          // Ensure first card stays visible until it's time to exit
          masterTl.set(band, { opacity: 1, yPercent: 0, pointerEvents: 'auto' }, 0);
        }

        // 2. Main display (hold)
        masterTl.to(band, { opacity: 1, duration: 1 }, `+=${0.1}`);

        // 3. Exit (except last one)
        if (i < bands.length - 1) {
          masterTl.to(band, { 
            scale: 0.95, 
            opacity: 0, 
            pointerEvents: 'none',
            y: -30,
            duration: 0.4, 
            ease: "power1.in" 
          }, `>${0.3}`);
        }
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, bands.length]);

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-col gap-12 py-12 px-6">
        {bands.map((band, i) => (
          <div key={i} className="p-8 border border-[rgba(232,230,224,0.1)]">
            <h3 className="text-2xl mb-4" style={{ color: COLOR_MAP[band.accentColor] }}>{band.label}</h3>
            <p>{band.content}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-screen relative bg-[var(--color-void)] overflow-hidden">
      <div ref={scrollRef} className="w-full h-full relative">
        {bands.map((band, i) => {
          const color = COLOR_MAP[band.accentColor];
          return (
            <div 
              key={i}
              ref={(el) => { bandRefs.current[i] = el; }}
              className="absolute inset-0 w-full h-full flex flex-col justify-center px-6 md:px-12"
              style={{ 
                zIndex: i + 1,
                opacity: i === 0 ? 1 : 0, 
                pointerEvents: i === 0 ? 'auto' : 'none'
              }}
            >
              <div 
                className="w-full h-full max-h-[85vh] bg-[var(--color-void)] border border-[rgba(255,255,255,0.05)] shadow-2xl relative flex flex-col justify-center px-6 md:px-12 rounded-xl group overflow-hidden"
              >
                 <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
                 <div className="w-full absolute top-0 left-0 z-10 h-[6px]" style={{ backgroundColor: color }} />

                <div className="p-4 md:p-16 flex flex-col md:flex-row gap-8 md:gap-12 relative z-10">
                  <div className="w-full md:w-1/3 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-[40px] h-[1.5px]" style={{ backgroundColor: color }} />
                      <div className="rounded-full w-[6px] h-[6px]" style={{ backgroundColor: color, opacity: 0.8 }} />
                    </div>
                    <div className="flex flex-col gap-2">
                      {band.sublabel && <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-60">{band.sublabel}</span>}
                      <h3 className="font-display text-[28px] md:text-[52px] font-normal leading-tight">
                        <span style={{ color: color }}>{band.label}</span>
                      </h3>
                    </div>
                  </div>

                  <div className="w-full md:w-2/3 flex flex-col justify-center gap-8 md:pl-12 md:border-l border-[rgba(232,230,224,0.1)]">
                    <p className="font-body text-[18px] md:text-[24px] font-light leading-relaxed opacity-90">
                      {band.content}
                    </p>
                    {band.detail && (
                      <div className="pt-8 border-t border-[rgba(232,230,224,0.08)]">
                        <p className="font-mono text-[12px] uppercase tracking-[0.1em] opacity-40 leading-relaxed max-w-[500px]">
                          {band.detail}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
;

