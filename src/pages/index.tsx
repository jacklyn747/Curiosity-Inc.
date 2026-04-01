import { useNavigate, Link, useParams } from 'react-router-dom';
import { SectionLabel } from '../components/typography/SectionLabel';
import { DisplayHeading } from '../components/typography/DisplayHeading';

const ARTICLES = [
  {
    category: 'LEARNING SCIENCE',
    categoryColor: 'var(--color-intellect)',
    title: 'The Accidental Educator',
    description: "You never applied for the job. You got it anyway. Here's what that means for everyone following you.",
    time: '12 min',
    link: '/writing/the-accidental-educator'
  },
  {
    category: 'DESIGN THEORY',
    categoryColor: 'var(--color-method)',
    title: 'Negative Space as Active Agent',
    description: "The most powerful element in your content is the thing you didn't say.",
    time: '8 min',
    link: '/writing/negative-space-as-active-agent'
  },
  {
    category: 'METHODOLOGY',
    categoryColor: 'var(--color-accent)',
    title: 'The Curiosity Loop Protocol',
    description: 'Five stages from attention to capability. The operating system for identity change.',
    time: '15 min',
    link: '/writing/the-curiosity-loop-protocol'
  },
  {
    category: 'PHILOSOPHY',
    categoryColor: 'var(--color-human)',
    title: 'Eureka as Practice',
    description: "Discovery isn't a lightning bolt. It's a discipline. Here's how to engineer it.",
    time: '10 min',
    link: '/writing/eureka-as-practice'
  }
];

const CASE_STUDIES = [
  {
    id: 'dan-koe',
    category: 'BRAND ARCHITECTURE',
    title: 'Dan Koe',
    subtitle: 'What if 2.3M followers were students, not subscribers?',
    link: '/work/dan-koe-brand-architecture',
    accentColor: 'var(--color-intellect)'
  },
  {
    id: 'justin-welsh',
    category: 'CONVERSION DESIGN',
    title: 'Justin Welsh',
    subtitle: 'Removing the last 1% of friction between insight and action.',
    link: '/work/justin-welsh-conversion-design',
    accentColor: 'var(--color-accent)'
  },
  {
    id: 'tiago-forte',
    category: 'COGNITIVE INTERFACES',
    title: 'Tiago Forte',
    subtitle: "The Second Brain already has a curriculum. It just isn't built yet.",
    link: '/work/tiago-forte-cognitive-interfaces',
    accentColor: 'var(--color-method)'
  }
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-root">
      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section id="hero" className="grid-architectural min-h-[80vh] items-center py-40">
        <div className="col-narrow">
          <SectionLabel>CURIOSITY INC.</SectionLabel>
          <DisplayHeading as="h1" className="mt-8 text-[clamp(48px,8vw,120px)] leading-[0.9] italic">
            You've been teaching this whole time.
          </DisplayHeading>
          <p className="font-body text-[24px] leading-relaxed text-[var(--color-text-dim)] mt-12 max-w-[600px]">
            We build the systems that turn your audience into students, and your content into capability.
          </p>
        </div>
      </section>

      {/* ── 2. THE GAP ────────────────────────────────────────────────────── */}
      <section id="gap" className="grid-architectural w-full border-t border-[rgba(255,255,255,0.05)] py-40">
        <div className="col-narrow">
          <SectionLabel>THE PROBLEM</SectionLabel>
          <DisplayHeading as="h2" className="mt-8">
            You're not doing it wrong. You're using the wrong tool.
          </DisplayHeading>
          <div className="space-y-8 mt-12 text-[var(--color-text-dim)] text-[20px] leading-relaxed max-w-[680px]">
            <p>
              The funnel works. It was built for a world where information was scarce. Give people something they couldn't get anywhere else, move them toward a purchase.
            </p>
            <p>
              But your audience knows what a sequence feels like. They know the difference between being helped and being moved.
            </p>
            <p>
              There's a gap between the metrics that look good and the change that isn't happening. We bridge that gap with design.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. THE REVEAL ─────────────────────────────────────────────────── */}
      <section id="reveal" className="grid-architectural w-full border-t border-[rgba(255,255,255,0.05)] py-40 bg-[rgba(255,255,255,0.02)]">
        <div className="col-narrow">
          <SectionLabel>THE SOLUTION</SectionLabel>
          <DisplayHeading as="h2" className="mt-8">
            Learning Experience Design.
          </DisplayHeading>
          <div className="space-y-8 mt-12 text-[var(--color-text-dim)] text-[20px] leading-relaxed max-w-[680px]">
            <p>
              For forty years, this lived in corporate training rooms and business schools. The people who had access to it used it to build empires.
            </p>
            <p>
              We're the first to bring these principles to the open internet—to creators who are already trying to do what these principles were always meant to produce.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
            <div className="p-8 border border-[rgba(255,255,255,0.05)] bg-[var(--color-void)]">
              <h3 className="font-mono text-[12px] text-[var(--color-accent)] uppercase tracking-widest mb-4">The Old Way</h3>
              <p className="font-body text-[18px]">The Funnel: Extraction logic. Moving people toward a purchase at any cost.</p>
            </div>
            <div className="p-8 border border-[rgba(255,255,255,0.05)] bg-[var(--color-void)]">
              <h3 className="font-mono text-[12px] text-[var(--color-energy)] uppercase tracking-widest mb-4">The New Way</h3>
              <p className="font-body text-[18px]">Learning Architecture: Cultivation logic. Building an audience that grows in capability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. THE WORK ───────────────────────────────────────────────────── */}
      <section id="work" className="grid-architectural w-full border-t border-[rgba(255,255,255,0.05)] py-40">
        <div className="col-narrow mb-16">
          <SectionLabel>THE PROOF</SectionLabel>
          <DisplayHeading as="h2" className="mt-8">Selected Engagements</DisplayHeading>
        </div>
        
        <div className="col-wide grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASE_STUDIES.map(study => (
            <Link 
              key={study.id} 
              to={study.link}
              className="group p-8 border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-500"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 block mb-4" style={{ color: study.accentColor }}>
                {study.category}
              </span>
              <h3 className="font-display text-[32px] italic mb-4">{study.title}</h3>
              <p className="font-body text-[16px] text-[var(--color-text-dim)]">{study.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. THE LIBRARY ────────────────────────────────────────────────── */}
      <section id="library" className="grid-architectural w-full border-t border-[rgba(255,255,255,0.05)] py-40">
        <div className="col-narrow mb-16">
          <SectionLabel>THE LIBRARY</SectionLabel>
          <DisplayHeading as="h2" className="mt-8">Things worth your time.</DisplayHeading>
          <p className="font-body text-[20px] text-[var(--color-text-dim)] mt-8">
            The principles, without the pitch. Read these and you'll understand exactly what we do.
          </p>
        </div>

        <div className="col-wide space-y-4">
          {ARTICLES.map((article) => (
            <Link
              key={article.title}
              to={article.link}
              className="block group py-10 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors px-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-[600px]">
                  <span className="font-mono text-[10px] uppercase tracking-widest mb-2 block" style={{ color: article.categoryColor }}>
                    {article.category}
                  </span>
                  <h3 className="font-display text-[28px] italic mb-2">{article.title}</h3>
                  <p className="font-body text-[16px] text-[var(--color-text-dim)]">{article.description}</p>
                </div>
                <span className="font-mono text-[12px] opacity-40">{article.time} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. THE DOOR ───────────────────────────────────────────────────── */}
      <section id="door" className="grid-architectural w-full py-60 border-t border-[rgba(255,255,255,0.05)]">
        <div className="col-content flex flex-col items-center text-center">
          <SectionLabel>GET STARTED</SectionLabel>
          <DisplayHeading as="h2" className="mt-8">
            Let's look at what you've built.
          </DisplayHeading>
          <p className="font-body text-[22px] leading-relaxed text-[var(--color-text-dim)] mt-12 max-w-[600px]">
            No pitch. No package. Just a real look at the architecture of your learning experience.
          </p>
          
          <button
            className="mt-12 px-12 py-6 bg-[var(--color-accent)] text-[#1D1D1B] font-mono text-[12px] uppercase tracking-[0.2em] font-bold hover:scale-105 transition-transform"
            onClick={() => navigate('/audit')}
          >
            Request a Curiosity Audit
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <DisplayHeading as="h1" className="mb-8">{`Case Study: ${slug || ''}`}</DisplayHeading>
      <p className="font-body text-[20px] text-[var(--color-text-dim)] mb-8 opacity-60">
        This one's still being built.
      </p>
      <Link to="/" className="font-mono text-[12px] tracking-[0.15em] text-[var(--color-accent)] uppercase">
        ← Back home
      </Link>
    </div>
  );
}

export { ArticlePage } from './ArticlePage';
