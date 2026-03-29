import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
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

    // We pin the container and translate the scroll wrapper horizontally
    const container = containerRef.current;
    const scrollWrapper = scrollRef.current;
    
    const ctx = gsap.context(() => {
      // Get total width to translate
      const getScrollAmount = () => {
        const scrollWidth = scrollWrapper.scrollWidth;
        const windowWidth = window.innerWidth;
        // The distance to translate is the total width of the wrapper minus the window width
        // Add a bit of padding (e.g., 20vw) so the last item doesn't stop immediately flush
        return -(scrollWidth - windowWidth + (windowWidth * 0.1));
      };

      const tween = gsap.to(scrollWrapper, {
        x: getScrollAmount,
        ease: "none"
      });

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true
      });
      
      // Image Parallax within the cards
      gsap.utils.toArray('.hg-image-inner').forEach((image: any) => {
        gsap.to(image, {
          xPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      });

    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // If reduced motion is on, just render a vertical stack
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
    <section ref={containerRef} className="hg-container relative h-screen w-full bg-[var(--color-void)] overflow-hidden flex items-center">
      <div 
        ref={scrollRef} 
        className="hg-scroll-wrapper flex h-[70vh] items-center px-[10vw]"
        style={{ width: 'fit-content' }}
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            className="hg-card relative shrink-0 w-[80vw] md:w-[50vw] h-full mr-[10vw] md:mr-[5vw] flex flex-col justify-end"
          >
            {/* Background Image with Overflow Hidden for Parallax */}
            <div className="absolute inset-0 w-full h-full overflow-hidden border border-[rgba(232,230,224,0.1)] filter grayscale-[0.8]">
              {item.image ? (
                <div 
                  className="hg-image-inner absolute top-0 left-[-20%] w-[140%] h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-[#171716]" />
              )}
               {/* Dark overlay */}
               <div className="absolute inset-0 bg-black/40" />
            </div>

            <Link 
              to={item.link} 
              className="absolute inset-0 z-30 focus:outline-none focus-visible:ring-2 ring-[var(--color-insight)] ring-inset" 
              aria-label={`View case study: ${item.title}`}
            />

            {/* Custom Content Overlay */}
            <div className="relative z-20 p-8 md:p-16 flex flex-col gap-6 w-full max-w-[600px] bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[12px] text-[var(--color-transformation)] block">
                  {item.number}
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase opacity-70 text-[var(--color-context)] block">
                  {item.category}
                </span>
              </div>

              <h3 className="font-display text-[48px] md:text-[64px] font-normal leading-tight text-[var(--color-text)] transition-colors duration-500">
                {item.title}
              </h3>
              
              <p className="font-body text-[16px] font-light text-[var(--color-text-dim)] leading-relaxed max-w-[80%]">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Closing 'Next' Panel to prevent abrupt stop */}
        <div className="hg-card shrink-0 w-[40vw] h-[70vh] flex flex-col items-center justify-center opacity-40">
           <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-insight)]">Keep Scrolling →</span>
        </div>

      </div>
    </section>
  );
};
