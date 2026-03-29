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
          end: "+=3000", // 3000px of scrolling for the pan
          scrub: 1,
          pin: true, // Use GSAP pin instead of CSS sticky
          invalidateOnRefresh: true,
        }
      });
      
      // Extended Initial dead-zone so Dan Koe stays completely frozen on entry for 35% of the entire section duration
      tl.to({}, { duration: 0.25 });
      
      // The actual horizontal move
      tl.fromTo(scrollRef.current, 
        { x: 0 },
        {
          x: () => -(scrollRef.current!.scrollWidth - window.innerWidth),
          ease: "none",
          duration: 0.6, // takes up 60% of the total 3000px scroll
          immediateRender: true
        }
      );
      
      // Final dead-zone
      tl.to({}, { duration: 0.15 });

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
              className="hg-card relative shrink-0 flex items-center justify-center p-8 overflow-hidden rounded-xl border border-[rgba(232,230,224,0.1)] w-[85vw] max-w-[450px] h-[50vh] min-h-[500px] max-h-[600px]"
            >
              {/* Constrained Background Image Layer (No Full Bleed) */}
              <div className="absolute inset-0 overflow-hidden grayscale-[0.8]">
                {item.image ? (
                  <div 
                    className="hg-image-inner absolute top-0 bottom-0 left-[-10%] w-[120%] bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#0a0a0a]" />
                )}
                {/* Opacity mask */}
                <div className="absolute inset-0 bg-black/60 pointer-events-none" />
              </div>

              <Link 
                to={item.link} 
                className="absolute inset-0 z-30 focus:outline-none focus-visible:ring-2 ring-[var(--color-insight)] ring-inset" 
                aria-label={`View case study: ${item.title}`}
              />

              {/* Text Overlay pinned to bottom left */}
              <div className="relative z-20 w-full h-full flex flex-col justify-end items-start text-left pb-4 pointer-events-none mt-auto">
                <div className="flex flex-col items-start gap-2 mb-4">
                  <span className="font-mono text-[14px] text-[var(--color-transformation)] block">
                    {item.number}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-70 text-[var(--color-context)] block">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-display text-[40px] leading-tight text-white m-0 tracking-tight">
                  {item.title}
                </h3>
                
                <p className="font-body text-[16px] font-light text-[rgba(255,255,255,0.7)] leading-relaxed max-w-[90%] mt-2">
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
