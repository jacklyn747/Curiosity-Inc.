import React from 'react';
import { DisplayHeading } from '../components/typography/DisplayHeading';

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
  return (
    <main className="bg-[var(--color-void)] text-[var(--color-text)]">
      <div className="about-inner">
        
        {/* SECTION 01: THE OPENING */}
        <section className="about-opening py-40 flex flex-col justify-center items-center text-center">
          <div className="mb-6">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-energy)] uppercase">
              Founder Narrative
            </span>
          </div>
          <div className="max-w-[860px]">
            <DisplayHeading as="h1" className="mb-8">
              The difference between content that moves people and content that actually changes them is structure.
            </DisplayHeading>
          </div>
          <div className="max-w-[640px]">
            <p className="font-body text-[20px] leading-relaxed text-[var(--color-text-dim)]">
              The kind that universities have been using quietly for decades — the architecture of how people actually learn — and the creator world has never been given access to. 
              <span className="block mt-6 italic text-[var(--color-text)]">I went and got that structure.</span>
            </p>
          </div>
        </section>

        {/* SECTION 02: THE PATH */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-24 border-t border-white/5">
          {DISCIPLINES.map((item, i) => (
            <div key={i} className="flex flex-col gap-6 items-center text-center">
              <span className="font-mono text-[11px] tracking-widest text-[var(--color-accent)] uppercase">
                0{i + 1} — {item.label}
              </span>
              <p className="font-body text-[18px] leading-relaxed text-[var(--color-text-dim)]">{item.text}</p>
            </div>
          ))}
        </section>

        {/* SECTION 03: THE REVEAL */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-12 py-32 border-t border-white/5">
          <div className="w-full max-w-[320px] aspect-[4/5] overflow-hidden bg-[rgba(255,255,255,0.02)]">
            <img 
              src="/jacklyn-miller.webp" 
              alt="Jacklyn Miller" 
              className="w-full h-full object-cover grayscale opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="max-w-[440px] text-center md:text-left">
            <p className="font-display italic text-[32px] mb-2 leading-tight">
              Jacklyn Miller
            </p>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-energy)] uppercase mb-8">
              Instructional Architect / Founder
            </p>
            <p className="text-[var(--color-text-dim)] text-[20px] leading-relaxed italic border-l border-[var(--color-accent)] pl-6 text-left">
              "Curiosity Inc. is what I built once I had the words for what I'd been seeing. The architecture that was missing."
            </p>
          </div>
        </section>

        {/* SECTION 04: THE CTA (SANCTUARY BOX) */}
        <section className="pb-40 py-24 border-t border-white/5 text-center">
          <div className="max-w-[700px] mx-auto">
            <DisplayHeading as="h2" className="mb-6">
              Ready to teach on purpose?
            </DisplayHeading>
            <p className="font-body text-[20px] text-[var(--color-text-dim)] mb-10 max-w-[500px] mx-auto">
              If your work deserves to outlast the algorithm, this is where we begin.
            </p>
            <a 
              href="mailto:jacklyn@curiosityinc.online" 
              className="inline-flex items-center gap-4 px-12 py-6 bg-[var(--color-accent)] text-[#1D1D1B] font-mono text-[12px] uppercase tracking-[0.2em] font-bold hover:scale-105 transition-transform"
            >
              Start the Dialogue →
            </a>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AboutPage;
