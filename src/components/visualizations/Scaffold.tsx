import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
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
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;
    
    // Tilton-style Sticky Stack Depth Animation
    const ctx = gsap.context(() => {
      bandRefs.current.forEach((band, i) => {
        if (!band || i === bands.length - 1) return; // Don't animate the last card, it always stays full size
        
        const nextBand = bandRefs.current[i + 1];
        if (!nextBand) return;

        // As the next block reaches the sticky top threshold of this block, scale this block down
        gsap.to(band, {
          scale: 0.92 - (bands.length - 1 - i) * 0.02,
          opacity: 0.4,
          filter: "blur(4px)",
          ease: "none",
          scrollTrigger: {
            trigger: nextBand,
            start: "top " + (window.innerHeight * 0.2 + (i + 1) * 30), // Start fading when next band hits its sticky top
            end: "top " + (window.innerHeight * 0.1), // Finish fading slightly higher
            scrub: true,
          }
        });
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, bands.length]);

  return (
    <div 
      ref={containerRef} 
      className="scaffold-root w-full relative"
      style={{ paddingBottom: '10vh' }}
    >
      {bands.map((band, i) => {
        const color = COLOR_MAP[band.accentColor];
        
        return (
          <div 
            key={i}
            ref={(el) => { bandRefs.current[i] = el; }}
            className="scaffold-band-sticky w-full origin-top"
            style={{ 
              position: 'sticky',
              top: `calc(20vh + ${i * 30}px)`,
              marginBottom: i === bands.length - 1 ? '0' : '40vh', // Create scroll space between cards
              zIndex: i + 1,
            }}
          >
            <div 
              className="w-full bg-[#111111] border border-[rgba(232,230,224,0.1)] rounded-lg shadow-2xl overflow-hidden relative"
              style={{ minHeight: '400px' }}
            >
              {/* Noise Substrate */}
               <div 
                className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
              />

              {/* Accent Header */}
              <div 
                className="h-[6px] w-full absolute top-0 left-0 z-10"
                style={{ backgroundColor: color }}
              />

              <div className="p-8 md:p-16 flex flex-col md:flex-row gap-12 relative z-10 h-full">
                
                {/* Left Column: Number & Label */}
                <div className="w-full md:w-1/3 flex flex-col gap-6">
                  <span 
                    className="font-display text-[80px] md:text-[120px] leading-none opacity-20"
                    style={{ color: color }}
                  >
                    0{i + 1}
                  </span>
                  
                  <div className="flex flex-col gap-2">
                    {band.sublabel && (
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-70 text-[var(--color-context)]">
                        {band.sublabel}
                      </span>
                    )}
                    <h3 className="font-display text-[32px] md:text-[40px] font-normal leading-tight text-[var(--color-text)]">
                      {band.label.split('/')[0]}
                      <br/>
                      <span style={{ color: color, fontStyle: 'italic' }}>
                        {band.label.split('/')[1] || ''}
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Right Column: Narrative Content */}
                <div className="w-full md:w-2/3 flex flex-col justify-center gap-8 md:pl-12 md:border-l border-[rgba(232,230,224,0.1)]">
                  <p className="font-body text-[18px] md:text-[22px] font-light leading-relaxed text-[var(--color-text)]">
                    {band.content}
                  </p>
                  
                  {band.detail && (
                    <div className="pt-8 border-t border-[rgba(232,230,224,0.1)]">
                      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-context)] leading-relaxed">
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
  );
};

