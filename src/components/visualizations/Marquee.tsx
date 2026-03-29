import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MarqueeProps {
  text: string;
  speed?: number; // scrub speed factor, default 1
}

export function Marquee({ text, speed = 1 }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !textRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Create a scrubbed animation that moves the text horizontally based on the scroll
      gsap.fromTo(textRef.current, 
        { xPercent: 10 },
        {
          xPercent: -50 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom", // Start when the component enters the bottom of the viewport
            end: "bottom top",   // End when the component exits the top of the viewport
            scrub: 1,
          }
        }
      );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, speed]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center"
      style={{ opacity: 0.03 }} // Extremely faint
    >
      <div 
        ref={textRef} 
        className="whitespace-nowrap font-display"
        style={{ 
          fontSize: 'clamp(15rem, 30vw, 35rem)', 
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '2px white', // outlined look
          textTransform: 'uppercase'
        }}
      >
        {text} &nbsp; {text} &nbsp; {text} &nbsp; {text}
      </div>
    </div>
  );
}
