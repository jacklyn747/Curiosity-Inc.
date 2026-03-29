import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { DisplayHeading } from '../components/typography/DisplayHeading';

export const NotFoundPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle drift animation for the orb
    gsap.to(orbRef.current, {
      y: '+=30',
      x: '+=20',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Stagger text reveal
    gsap.fromTo(textRef.current?.children ?? [],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
    );

    // Mouse follow for the orb (subtle)
    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 40;
      const y = (clientY / window.innerHeight - 0.5) * 40;
      
      gsap.to(orbRef.current, {
        xShift: x,
        yShift: y,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          const target = this.targets()[0];
          gsap.set(target, { x: `+=${x * 0.01}`, y: `+=${y * 0.01}` });
        }
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <main 
      ref={containerRef}
      className="min-h-screen relative flex items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: 'var(--color-void)' }}
    >
      {/* Background Decorative Element: The 'Void Orb' */}
      <div 
        ref={orbRef}
        className="absolute z-0 pointer-events-none"
        style={{
          width: '40vw',
          height: '40vw',
          maxWidth: '500px',
          maxHeight: '500px',
          borderRadius: '50%',
          border: '1px solid var(--color-insight)',
          opacity: 0.05,
          filter: 'blur(60px)',
          background: 'radial-gradient(circle, var(--color-insight) 0%, transparent 70%)',
        }}
      />

      <div ref={textRef} className="relative z-10 flex flex-col items-center gap-12 text-center max-w-[800px]">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-insight)] uppercase opacity-60">
            Error 404
          </span>
          <DisplayHeading as="h1" className="text-white">
            This architecture<br />does not exist.
          </DisplayHeading>
          <p className="font-body text-[16px] text-[var(--color-text-dim)] italic max-w-[480px] mx-auto mt-4">
            A deviation from the path. The information you seeking has drifted beyond the laboratory&apos;s current reach.
          </p>
        </div>

        <Link 
          to="/" 
          className="group relative inline-flex items-center gap-4 px-10 py-4"
          style={{ textDecoration: 'none' }}
        >
          <div 
            className="absolute inset-0 border border-[var(--color-insight)] rounded-full group-hover:bg-[rgba(247,38,88,0.05)] transition-all"
            style={{ opacity: 0.6 }}
          />
          <span className="relative font-mono text-[10px] tracking-[0.15em] text-[var(--color-insight)] uppercase">
            Return to Sanctuary
          </span>
          <span className="relative text-[var(--color-insight)] transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Grid Underlay (Optional for depth) */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(232, 230, 224, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 230, 224, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          zIndex: 0
        }}
      />
    </main>
  );
};

export default NotFoundPage;
