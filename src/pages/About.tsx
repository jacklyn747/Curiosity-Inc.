import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../hooks/useScrollTrigger';
import { DisplayHeading } from '../components/typography/DisplayHeading';

if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  });
}

const DISCIPLINES = [
  {
    label: 'Visual Arts',
    text: (
      <>
        I spent years learning to read structure before I could name it. A frame — like a sentence, like a lesson — is always a decision about{' '}
        <em className="italic text-[var(--color-text)]">what gets to exist and what doesn't.</em>{' '}
        The camera taught me to see that before I had the language for it.
      </>
    ),
  },
  {
    label: 'Creative Writing',
    text: (
      <>
        A degree in creative writing taught me that sequence is a form of care.{' '}
        <em className="italic text-[var(--color-text)]">The order you give someone information is a decision about what they're ready to hold.</em>{' '}
        Most people who are trying to teach never think about that second part.
      </>
    ),
  },
  {
    label: 'Instructional Design',
    text: (
      <>
        The MA gave me the vocabulary for both. I got it specifically because I could see the creator economy heading toward education — with no structural framework following it — and I wanted to be ready when it arrived.
      </>
    ),
  },
] as const;

export const AboutPage: React.FC = () => {
  const openingRef = useRef<HTMLElement>(null);
  const { ref: gridRef, inView: gridInView } = useScrollTrigger({ threshold: 0.15 });
  const { ref: photoRef, inView: photoInView } = useScrollTrigger({ threshold: 0.15 });
  const { ref: ctaRef, inView: ctaInView } = useScrollTrigger({ threshold: 0.2 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-intro-lead',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          stagger: 0.3, 
          ease: 'power3.out',
          delay: 0.2
        }
      );
    }, openingRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-discipline-item',
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2, 
          ease: 'power3.out' 
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [gridInView]);

  useEffect(() => {
    if (!photoInView) return;
    const ctx = gsap.context(() => {
      gsap.to('.about-photo-reveal', {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.5,
        ease: 'power4.inOut'
      });
      gsap.fromTo('.photo-text',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1, delay: 0.8, ease: 'power2.out' }
      );
    }, photoRef);
    return () => ctx.revert();
  }, [photoInView]);

  useEffect(() => {
    if (!ctaInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-cta-sanctuary',
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
      );
    }, ctaRef);
    return () => ctx.revert();
  }, [ctaInView]);

  return (
    <main className="bg-[var(--color-void)] text-[var(--color-text)]">
      <div className="about-inner">
        
        {/* SECTION 01: THE OPENING */}
        <section ref={openingRef} className="about-opening">
          <div className="about-intro-lead mb-6">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-structure)] uppercase">
              Founder Narrative
            </span>
          </div>
          <div className="about-intro-lead">
            <DisplayHeading as="h1" className="mb-8" accent="structure">
              The difference between content that moves people and content that actually changes them is structure.
            </DisplayHeading>
          </div>
          <div className="about-intro-lead">
            <p className="font-body text-[18px] leading-relaxed text-[var(--color-text-dim)] max-w-[640px]">
              The kind that universities have been using quietly for decades — the architecture of how people actually learn — and the creator world has never been given access to. 
              <span className="block mt-6 italic text-[var(--color-text)]">I went and got that structure.</span>
            </p>
          </div>
        </section>

        {/* SECTION 02: THE PATH (ASYMETRIC GRID) */}
        <section ref={gridRef} className="about-discipline-grid">
          {DISCIPLINES.map((item, i) => (
            <div key={i} className="about-discipline-item">
              <span className="discipline-tag">0{i + 1} — {item.label}</span>
              <p className="discipline-body">{item.text}</p>
            </div>
          ))}
        </section>

        {/* SECTION 03: THE REVEAL */}
        <section ref={photoRef} className="flex flex-col md:flex-row items-center gap-12 py-24 border-t border-white/5">
          <div className="about-photo-reveal flex-shrink-0">
            <img 
              src="/jacklyn-miller.webp" 
              alt="Jacklyn Miller" 
              className="about-photo-img"
            />
          </div>
          <div className="max-w-[440px]">
            <p className="photo-text font-display italic text-[32px] mb-2 leading-tight">
              Jacklyn Miller
            </p>
            <p className="photo-text font-mono text-[10px] tracking-[0.2em] text-[var(--color-structure)] uppercase mb-8">
              Instructional Architect / Founder
            </p>
            <p className="photo-text text-[var(--color-text-dim)] leading-relaxed italic border-l border-[var(--color-insight)] pl-6">
              "Curiosity Inc. is what I built once I had the words for what I'd been seeing. The architecture that was missing."
            </p>
          </div>
        </section>

        {/* SECTION 04: THE CTA (SANCTUARY BOX) */}
        <section ref={ctaRef} className="pb-32 px-4">
          <div className="about-cta-sanctuary">
            <DisplayHeading as="h2" className="mb-6">
              Ready to teach on purpose?
            </DisplayHeading>
            <p className="text-[var(--color-text-dim)] mb-10 max-w-[500px] mx-auto">
              If your work deserves to outlast the algorithm, this is where we begin.
            </p>
            <a 
              href="mailto:jacklyn@curiosityinc.online" 
              className="group relative inline-flex items-center gap-4 px-12 py-5 border border-[var(--color-insight)] rounded-full text-[var(--color-insight)] font-mono text-[11px] tracking-[0.2em] uppercase transition-all hover:bg-[var(--color-insight)] hover:text-white"
            >
              Start the Dialogue
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AboutPage;
