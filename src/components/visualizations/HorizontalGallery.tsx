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
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
      
      // Initial dead-zone so Dan Koe stays completely frozen on entry
      tl.to({}, { duration: 0.15 });
      
      // The actual horizontal move
      tl.fromTo(scrollRef.current, 
        { x: 0 },
        {
          x: () => -(scrollRef.current!.scrollWidth - window.innerWidth),
          ease: "none",
          duration: 0.7 // takes up 70% of the total 400vh scroll
        }
      );
      
      // Final dead-zone so Tiago Forte doesn't instantly rip away
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
    <section ref={containerRef} className="w-full relative" style={{ height: '400vh' }}>
      <div className="hg-container w-full h-screen overflow-hidden bg-[var(--color-void)] flex items-center justify-start" style={{ position: 'sticky', top: 0 }}>
        <div 
          ref={scrollRef} 
          className="hg-scroll-wrapper flex flex-nowrap items-center h-[70vh] px-[10vw] gap-24 w-max"
        >   
        {items.map((item) => (
          <div 
            key={item.id} 
            className="hg-card relative shrink-0 flex items-center justify-center p-8 overflow-hidden rounded-xl border border-[rgba(232,230,224,0.1)]"
            style={{ width: 'min(45vw, 600px)', height: '60vh', maxHeight: '700px' }}
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

            {/* Text Overlay centered in the card */}
            <div className="relative z-20 w-full max-w-[800px] flex flex-col items-center text-center gap-8 pointer-events-none">
              <div className="flex flex-col items-center gap-2">
                <span className="font-mono text-[14px] text-[var(--color-transformation)] block">
                  {item.number}
                </span>
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-70 text-[var(--color-context)] block">
                  {item.category}
                </span>
              </div>

              <h3 className="font-display text-[48px] md:text-[60px] leading-tight text-white m-0">
                {item.title}
              </h3>
              
              <p className="font-body text-[16px] md:text-[18px] font-light text-[rgba(255,255,255,0.7)] leading-relaxed max-w-[500px]">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};
