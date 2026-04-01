import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { SectionLabel } from '../typography/SectionLabel';
import { DisplayHeading } from '../typography/DisplayHeading';

interface EinsteinRevealProps {
  imagePath: string;
}

export const EinsteinReveal: React.FC<EinsteinRevealProps> = ({ imagePath }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { inView } = useScrollTrigger({ threshold: 0.1 });

  useEffect(() => {
    if (!inView) return;

    const tl = gsap.timeline();

    tl.to(
      imageRef.current,
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out' }
    );

    tl.to(
      textRef.current,
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    );
  }, [inView]);

  return (
    <div ref={containerRef} className="w-full max-w-[1200px] mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Side: The Thesis Image */}
        <div 
          ref={imageRef}
          className="relative group cursor-crosshair overflow-hidden rounded-lg border border-[rgba(255,255,255,0.1)] aspect-square opacity-0 transform translate-y-10 scale-95"
        >
          {/* Blueprint Grid Overlay (Visible on Hover) */}
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-screen overflow-hidden">
             <div 
               className="w-full h-full"
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(58, 158, 164, 0.25) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(58, 158, 164, 0.25) 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px'
               }}
             />
          </div>

          <img 
            src={imagePath} 
            alt="Einstein being 'simplified' by 2026 content producers" 
            className="w-full h-full object-cover contrast-[1.05] transition-all duration-[2000ms] group-hover:scale-105"
          />

          <div className="absolute bottom-4 right-4 z-20">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[rgba(255,255,255,0.6)] uppercase bg-black/40 px-2 py-1 backdrop-blur-sm">
              Artifact // THE_PERMANENT_MIND
            </span>
          </div>
        </div>

        {/* Right Side: The Thesis Narrative */}
        <div ref={textRef} className="opacity-0 transform translate-y-10">
          <SectionLabel>THE THESIS</SectionLabel>
          <DisplayHeading as="h3" className="mt-6 text-[32px] md:text-[42px] leading-[1.1] font-medium">
            Systems built for attention will always distort things built for truth.
          </DisplayHeading>
          
          <div className="mt-8 space-y-12">
            <div className="space-y-4">
              <p className="text-[var(--color-insight)] font-mono text-sm tracking-[0.3em] uppercase">
                Temporal Noise
              </p>
              <p className="text-[rgba(255,255,255,0.5)] font-body text-xl leading-relaxed">
                The overproduced, hyper-optimized environment of 2026. Multiple ring lights. Neon labels. Minimalist but cluttered. 
                <span className="block mt-2 italic text-[rgba(255,255,255,0.3)]">"Too complex, won't convert."</span>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[var(--color-structure)] font-mono text-sm tracking-[0.3em] uppercase">
                Permanent mind
              </p>
              <p className="text-[rgba(255,255,255,0.8)] font-body text-xl leading-relaxed">
                Albert Einstein. Visually unchanged. Slightly out of sync. 
                Trying to explain relativity while a producer tells him to "simplify it into 3 easy steps."
              </p>
            </div>

            <p className="pt-6 border-t border-[rgba(255,255,255,0.1)] text-white font-body text-2xl italic">
              "This will age. That won't."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
