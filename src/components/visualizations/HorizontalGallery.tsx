import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CaseStudyItem {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  link: string;
  image?: string;
  accentColor?: string;
}

interface HorizontalGalleryProps {
  items: CaseStudyItem[];
}

export const HorizontalGallery: React.FC<HorizontalGalleryProps> = ({ items }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !scrollRef.current || !containerRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000", // tightened: 2000px total for 3 cards
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        }
      });
      
      // Minimal initial pause — Dan Koe visible on entry for 15% of scroll distance
      tl.to({}, { duration: 0.12 });
      
      // The horizontal move — takes up 76% of total scroll
      tl.fromTo(scrollRef.current, 
        { x: 0 },
        {
          x: () => -(scrollRef.current!.scrollWidth - window.innerWidth),
          ease: "none",
          duration: 0.76,
          immediateRender: true
        }
      );
      
      // Minimal trailing pause — 12%
      tl.to({}, { duration: 0.12 });

      // Subtle internal parallax for the images inside the bounded containers
      gsap.utils.toArray('.hg-image-inner').forEach((image: any) => {
        gsap.to(image, {
          xPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      });

    });

    return () => ctx.revert();
  }, [prefersReducedMotion, items.length]);

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-col gap-24 py-12">
        {items.map((item) => (
           <div key={item.id} className="p-8 border border-[rgba(232,230,224,0.1)]">
             <h3 className="text-2xl mb-4">{item.title}</h3>
             <p>{item.subtitle}</p>
           </div>
        ))}
      </div>
    );
  }

  return (
    <section ref={containerRef} className="w-full relative bg-[var(--color-void)]">
      {/* Section header — sits above cards in the pinned viewport */}
      <div className="absolute top-0 left-0 w-full z-20 px-6 md:px-12 pt-12 pb-6 pointer-events-none">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: 'var(--color-accent)', opacity: 0.8 }}>
              — THE WORK
            </span>
            <h2 className="font-display text-[clamp(32px,3.5vw,52px)] font-normal leading-tight mt-3" style={{ fontStyle: 'italic', color: 'var(--color-text)', maxWidth: '680px' }}>
              What it actually looks like when the design changes.
            </h2>
          </div>
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase hidden md:block" style={{ color: 'var(--color-text-dim)', opacity: 0.35 }}>
            drag or scroll →
          </span>
        </div>
      </div>

      <div className="hg-container w-full h-screen overflow-hidden flex items-center justify-start">
        <div 
          ref={scrollRef} 
          className="hg-scroll-wrapper shrink-0 flex flex-nowrap items-center h-[70vh] gap-24 w-max"
        >
          {/* Physical Start Spacer to rigorously enforce 50vw center lock against Blink/Safari padding layout collapse */}
          <div className="shrink-0 w-[calc(50vw-225px)] h-px pointer-events-none" />

          {items.map((item) => (
            <div 
              key={item.id} 
              className="hg-card group relative shrink-0 flex items-center justify-center p-8 overflow-hidden rounded-xl border border-[rgba(232,230,224,0.1)] w-[85vw] max-w-[450px] h-[50vh] min-h-[500px] max-h-[600px] transition-all duration-700 ease-[var(--ease-out)] hover:border-[rgba(232,230,224,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Constrained Background Image Layer (No Full Bleed) */}
              <div className="absolute inset-0 overflow-hidden grayscale-[0.8] group-hover:grayscale-0 transition-all duration-1000 ease-[var(--ease-out)]">
                {item.image ? (
                  <div 
                    className="hg-image-inner absolute top-0 bottom-0 left-[-10%] w-[120%] bg-cover bg-center group-hover:scale-[1.05] transition-transform duration-1000 ease-[var(--ease-out)]"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#0a0a0a]" />
                )}
                {/* Opacity mask: darkens on hover to keep text legible during grayscale -> color transition */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-700 pointer-events-none" />
              </div>

              <Link 
                to={item.link} 
                className="absolute inset-0 z-30 focus:outline-none focus-visible:ring-2 ring-[var(--color-insight)] ring-inset" 
                aria-label={`View case study: ${item.title}`}
                data-magnetic="0.25"
              />

              {/* Text Overlay pinned to bottom left */}
              <div className="relative z-20 w-full h-full flex flex-col justify-end items-start text-left pb-4 pointer-events-none mt-auto transform group-hover:translate-y-[-10px] transition-transform duration-700 ease-[var(--ease-out)]">
                <div className="flex flex-col items-start gap-2 mb-4">
                  <span 
                    className="font-mono text-[12px] tracking-[0.18em] uppercase opacity-80 block"
                    style={{ color: item.accentColor || 'var(--color-accent)' }}
                  >
                    {item.category}
                  </span>
                  <div className="w-0 h-[1px] group-hover:w-full transition-all duration-700 ease-[var(--ease-out)]" style={{ backgroundColor: item.accentColor || 'var(--color-accent)' }} />
                </div>

                <h3 className="font-display text-[44px] leading-tight text-white m-0 tracking-tight italic">
                  {item.title}
                </h3>
                
                <p className="font-body text-[18px] font-light text-[rgba(255,255,255,0.7)] leading-relaxed max-w-[90%] mt-2">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Physical End Spacer */}
          <div className="shrink-0 w-[calc(50vw-225px)] h-px pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
