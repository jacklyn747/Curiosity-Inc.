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
      className="grid-reveal-root w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
    >
      {items.map((item, i) => (
        <div 
          key={item.id}
          ref={el => { cardRefs.current[i] = el; }}
          className={`grid-reveal-card relative group p-10 border rounded-lg transition-all duration-700 overflow-hidden
            ${i === 2 && items.length === 3 ? 'md:col-span-1' : ''}`}
          style={{ 
            backgroundColor: 'rgba(232, 230, 224, 0.03)',
            borderColor: 'rgba(232, 230, 224, 0.1)',
            opacity: prefersReducedMotion ? 1 : 0
          }}
        >
          {/* Background Image Layer */}
          {item.image && (
            <div 
              className="absolute inset-0 z-0 opacity-[0.08] group-hover:opacity-[0.14] transition-opacity duration-700 pointer-events-none"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%) brightness(0.8)'
              }}
            />
          )}

          <Link to={item.link} className="absolute inset-0 z-10" aria-label={`View case study: ${item.title}`} />

          <div className="flex flex-col gap-6 relative z-20">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[12px] text-[var(--color-transformation)]">
                {item.number}
              </span>
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase opacity-40 text-[var(--color-context)]">
                {item.category}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-display text-[28px] font-normal leading-tight text-[var(--color-text)]">
                {item.title}
              </h3>
              <p className="font-body text-[14px] font-light text-[var(--color-text-dim)] leading-relaxed max-w-[320px]">
                {item.subtitle}
              </p>
            </div>

            <div className="pt-4 mt-auto">
              <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--color-insight)] uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                EXPLORE CASE STUDY →
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
