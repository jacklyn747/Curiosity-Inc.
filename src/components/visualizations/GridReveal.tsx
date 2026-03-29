import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
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

interface GridRevealProps {
  items: CaseStudyItem[];
  columns?: number;
}

export const GridReveal: React.FC<GridRevealProps> = ({
  items,
  columns: _columns = 2
}) => {
  const { ref: containerRef, inView } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    // Center-outward stagger reveal
    gsap.fromTo(cardRefs.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: {
          each: 0.06,
          from: 'center'
        },
        ease: 'power2.out',
        delay: 0.3
      }
    );

  }, [inView, prefersReducedMotion]);

  return (
    <div 
      ref={containerRef as any}
      className="grid-reveal-root w-full flex flex-col gap-24 md:gap-40 mt-12"
    >
      {items.map((item, i) => {
        const isEven = i % 2 === 0;
        return (
          <div 
            key={item.id}
            ref={el => { cardRefs.current[i] = el; }}
            className={`grid-reveal-card relative group flex flex-col md:flex-row gap-8 md:gap-20 transition-all duration-700
              ${!isEven ? 'md:flex-row-reverse' : ''}`}
            style={{ 
              opacity: prefersReducedMotion ? 1 : 0
            }}
          >
            {/* Image Section (Asymmetric sizing) */}
            <div className={`w-full md:w-3/5 shrink-0 relative overflow-hidden border border-[rgba(232,230,224,0.1)] rounded-sm aspect-[4/3] ${isEven ? 'md:-mr-12' : 'md:-ml-12'} z-10`}>
              {item.image ? (
                <div 
                  className="absolute inset-0 w-full h-full scale-[1.02] group-hover:scale-105 transition-transform duration-[1.2s] ease-[var(--ease-out)]"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(0.8) contrast(1.1)',
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-[rgba(232,230,224,0.03)]" />
              )}
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
            </div>

            {/* Content Section */}
            <div className={`w-full md:w-2/5 flex flex-col justify-center relative z-20 ${isEven ? 'md:pl-16' : 'md:pr-16 md:text-right md:items-end'}`}>
              <div className="flex flex-col gap-6 p-8 md:p-12 bg-[#171716] border border-[rgba(232,230,224,0.08)] backdrop-blur-md relative transform md:-translate-y-12 shadow-2xl">
                
                <Link 
                  to={item.link} 
                  className="absolute inset-0 z-30 focus:outline-none" 
                  aria-label={`View case study: ${item.title}`}
                  onFocus={(e) => {
                    e.currentTarget.parentElement?.style.setProperty('border-color', 'var(--color-insight)');
                  }}
                  onBlur={(e) => {
                    e.currentTarget.parentElement?.style.setProperty('border-color', 'rgba(232,230,224,0.08)');
                  }}
                />

                <div className={`flex flex-col gap-2 ${isEven ? 'items-start' : 'md:items-end'}`}>
                  <span className="font-mono text-[12px] text-[var(--color-transformation)] block mb-2">
                    {item.number}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase opacity-50 text-[var(--color-context)] block">
                    {item.category}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-[32px] md:text-[40px] font-normal leading-tight text-[var(--color-text)] group-hover:text-[var(--color-insight)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-[15px] font-light text-[var(--color-text-dim)] leading-relaxed mt-2">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-8 mt-2">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--color-insight)] uppercase flex items-center gap-2 transition-transform duration-300 relative inline-flex">
                    <span className="relative z-10">Explore Case Study</span>
                    <span className={`transition-transform duration-500 ${isEven ? 'group-hover:translate-x-3' : 'md:group-hover:-translate-x-3 group-hover:translate-x-3'}`}>
                      {isEven ? '→' : '←'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
