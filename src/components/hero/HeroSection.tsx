import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Tilton-style Hero Mask Reveal
    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        opacity: 0,
        y: -100,
        scale: 0.9,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero"
      className="w-full h-screen relative flex items-center justify-center bg-[#171716] overflow-hidden"
    >
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at center, var(--color-insight) 0%, transparent 60%)' }}
      />
      
      <div 
        ref={textRef}
        className="relative z-10 flex flex-col items-center justify-center px-6 md:px-12 text-center max-w-[1000px] w-full"
      >
        <p className="font-display text-[40px] md:text-[80px] leading-[1.1] font-normal text-[var(--color-text)] tracking-tight">
          Your audience is learning from you.
        </p>
        <p className="font-display text-[32px] md:text-[64px] leading-[1.1] font-italic text-[var(--color-text-dim)] mt-4">
          You just haven't designed what they're learning.
        </p>
      </div>
    </div>
  );
}
