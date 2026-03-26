import { useParams, Link } from 'react-router-dom';
import { DanKoeCaseStudy } from './DanKoeCaseStudy';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLabel } from '../components/typography/SectionLabel';
import { DisplayHeading } from '../components/typography/DisplayHeading';
import { Scaffold } from '../components/visualizations/Scaffold';
import { FlowPulse } from '../components/visualizations/FlowPulse';
import { GridReveal } from '../components/visualizations/GridReveal';
import { ConvergenceMap } from '../components/visualizations/ConvergenceMap';
import { HeroSection } from '../components/hero/HeroSection';

gsap.registerPlugin(ScrollTrigger);

/**
 * Homepage - Core structural sections for anchor navigation.
 * Transitions from Hero -> Work -> Writing -> About.
 * The Homepage IS a Curiosity Loop.
 */
export function HomePage() {

  return (
    <div className="homepage-root">
      <HeroSection />

      {/* 
        SECTION 1: ATTENTION — The Pattern
        Loop stage: Attention.
      */}
      <section 
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col gap-12"
        style={{ minHeight: '80vh' }}
      >
        <div className="max-w-[800px] text-left">
          <SectionLabel>THE PATTERN</SectionLabel>
          <DisplayHeading as="h2" className="mt-6">
            You have an audience. You don't have a learning experience.
          </DisplayHeading>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <Scaffold 
              bands={[
                {
                  label: 'ATTENTION / TRANSFORMATION',
                  accentColor: 'structure',
                  content: "Your audience watches. They nod. They save your post. They don't change. You're producing content. You're not producing transformation.",
                  detail: "Architecture: Content without transformation is just noise. We restructure information to produce behavior change via active intent."
                },
                {
                  label: 'DECISION / CULTIVATION',
                  accentColor: 'context',
                  content: "Your monetization feels extractive because it is. The funnel was designed to capture people, not cultivate them. Your audience can tell the difference.",
                  detail: "Architecture: The funnel model fails because it assumes transaction is the goal. For high-leverage creators, the goal is capability."
                },
                {
                  label: 'INTENTION / DEPTH',
                  accentColor: 'transformation',
                  content: "Your growth plateaued because algorithms reward novelty. Your audience needs depth. You keep feeding the algorithm. Your audience stays hungry.",
                  detail: "Architecture: Depth creates defensibility. We build systems that reward deep engagement over shallow reach, creating compound value."
                }
              ]} 
            />
          </div>
          <div className="md:col-span-4 self-end">
            <p 
              style={{ 
                fontFamily: 'var(--font-body)', 
                fontSize: '14px', 
                color: 'var(--color-text-dim)',
                fontStyle: 'italic'
              }}
            >
              These aren't marketing problems. They're architecture problems.
            </p>
          </div>
        </div>
      </section>

      {/* 
        SECTION 2: DECISION — The Insight
        Loop stage: Decision.
      */}
      <section 
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col items-center gap-16 text-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-[800px]">
          <SectionLabel className="justify-center">THE INSIGHT</SectionLabel>
          <DisplayHeading as="h2" accent="educator" className="mt-6">
            Every creator with an audience is an accidental educator.
          </DisplayHeading>
          <p className="body-text mt-8 opacity-70 mx-auto">
            Your tutorials. Your frameworks. Your "how I did it" threads. That's not content. That's curriculum. 
            You've built a funnel where they need a classroom.
          </p>
        </div>

        <FlowPulse 
          flows={[
            {
              id: 'funnel-model',
              label: 'The Funnel Model',
              color: 'structure',
              stages: [
                { label: 'Attention', width: 1.0 },
                { label: 'Decision', width: 0.35 },
                { label: 'Action', width: 0.12 }
              ],
              dropoffs: [
                { afterStage: 1.0, label: '72% exit before converting', severity: 0.8 }
              ],
              outputLabel: 'Purchase'
            },
            {
              id: 'learning-architecture',
              label: 'Learning Architecture',
              color: 'transformation',
              stages: [
                { label: 'Attention', width: 1.0 },
                { label: 'Decision', width: 0.85 },
                { label: 'Intention', width: 0.78 },
                { label: 'Capability', width: 0.72 }
              ],
              dropoffs: [
                { afterStage: 3.0, label: '3.2× longer engagement', severity: 0.4 }
              ],
              outputLabel: 'Identity Shift → Purchase'
            }
          ]}
        />
      </section>

      {/* 
        SECTION 3: INTENTION — The Laboratory 
        Loop stage: Intention.
      */}
      <section 
        id="work" 
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col gap-16"
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-[800px]">
          <SectionLabel>THE LABORATORY</SectionLabel>
          <DisplayHeading as="h2" accent="Experiments" className="mt-6">
            Selected Experiments.
          </DisplayHeading>
          <p className="body-text mt-8 opacity-70">
            Each project applies learning science to a real creator's content architecture. We diagnose where the educational structure breaks. Then we show what restructuring it would do to every metric that matters.
          </p>
        </div>

        <GridReveal 
          items={[
            {
              id: 'dan-koe',
              number: '01',
              category: 'BRAND ARCHITECTURE',
              title: 'Dan Koe',
              subtitle: 'What if 2.3M followers were students, not subscribers?',
              link: '/work/dan-koe-brand-architecture'
            },
            {
              id: 'justin-welsh',
              number: '02',
              category: 'CONVERSION DESIGN',
              title: 'Justin Welsh',
              subtitle: 'Removing the last 1% of friction between insight and action.',
              link: '/work/justin-welsh-conversion-design'
            },
            {
              id: 'tiago-forte',
              number: '03',
              category: 'COGNITIVE INTERFACES',
              title: 'Tiago Forte',
              subtitle: 'The Second Brain already has a curriculum. It just isn\'t built yet.',
              link: '/work/tiago-forte-cognitive-interfaces'
            }
          ]}
        />
      </section>

      {/* 
        SECTION 4: Deep Readings — The Library
        Loop stage: Bridge between Intention and Action.
      */}
      <section
        id="writing"
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col gap-16"
        style={{ minHeight: '80vh' }}
      >
        <div className="max-w-[800px]">
          <SectionLabel>THE LIBRARY</SectionLabel>
          <DisplayHeading as="h2">Deep Readings.</DisplayHeading>
        </div>

        <div className="article-list w-full flex flex-col">
          {[
            {
              number: '01',
              category: 'LEARNING SCIENCE',
              title: 'The Accidental Educator',
              description: 'Why every creator with an audience is running an unstructured classroom.',
              time: '12 min',
              link: '/writing/the-accidental-educator'
            },
            {
              number: '02',
              category: 'DESIGN THEORY',
              title: 'Negative Space as Active Agent',
              description: 'The most powerful element in your content is the thing you didn\'t say.',
              time: '8 min',
              link: '/writing/negative-space-as-active-agent'
            },
            {
              number: '03',
              category: 'METHODOLOGY',
              title: 'The Curiosity Loop Protocol',
              description: 'Five stages from attention to capability. The operating system for identity.',
              time: '15 min',
              link: '/writing/the-curiosity-loop-protocol'
            },
            {
              number: '04',
              category: 'PHILOSOPHY',
              title: 'Eureka as Practice',
              description: 'Discovery isn\'t a lightning bolt. It\'s a discipline.',
              time: '10 min',
              link: '/writing/eureka-as-practice'
            }
          ].map((article) => (
            <Link 
              key={article.number}
              to={article.link}
              className="article-row group py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12"
              style={{ 
                borderTop: '0.5px solid rgba(136, 136, 136, 0.1)',
                textDecoration: 'none',
                transition: 'background 0.3s ease'
              }}
            >
              <div className="flex items-center gap-6 md:w-1/4">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-transformation)' }}>{article.number}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-structure)', letterSpacing: '0.1em' }}>{article.category}</span>
              </div>
              <div className="md:w-1/2">
                <h3 className="group-hover:text-[var(--color-insight)]" style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontStyle: 'italic', transition: 'color 0.3s ease', color: 'var(--color-text)' }}>
                  {article.title}
                </h3>
                <p className="mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-text-dim)', opacity: 0.7 }}>
                  {article.description}
                </p>
              </div>
              <div className="md:w-1/4 flex items-center justify-between md:justify-end gap-12">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-context-dim)' }}>{article.time}</span>
                <span className="group-hover:translate-x-2" style={{ color: 'var(--color-insight)', fontSize: '20px', transition: 'transform 0.3s ease' }}>→</span>
              </div>
            </Link>
          ))}
          <div style={{ borderTop: '0.5px solid rgba(136, 136, 136, 0.1)' }}></div>
        </div>
      </section>

      {/* 
        SECTION 5: ACTION + CAPABILITY — The Constellation
        Loop stage: Action (CTA) + Capability (The Map).
      */}
      <section 
        id="about" 
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col items-center gap-16"
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-[700px] text-center">
          <SectionLabel className="justify-center">ABOUT</SectionLabel>
          <DisplayHeading as="h2" accent="Ideas" className="mt-6">
            The Constellation of Ideas.
          </DisplayHeading>
          <p className="body-text mt-8 opacity-70 mx-auto">
            Hover to explore the relationships between disciplines that shape our practice.
          </p>
        </div>

        <ConvergenceMap />

        <div className="max-w-[800px] text-center mt-12 flex flex-col items-center gap-12">
          <p className="body-text" style={{ fontSize: '20px', fontStyle: 'italic' }}>
            "Every creator with an audience over 50K is sitting on an unstructured curriculum. The question isn't whether your audience is learning from you. They are. The question is what they're learning — and whether you designed it on purpose."
          </p>
          
          <button 
            className="cta-button"
            style={{
              padding: '16px 32px',
              background: 'transparent',
              border: '1px solid var(--color-insight)',
              borderRadius: '24px',
              color: 'var(--color-insight)',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(247, 38, 88, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Request a Curiosity Audit
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * Case Study Router — dispatches to the correct case study page by slug.
 */
export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();

  if (slug === 'dan-koe-brand-architecture') {
    return <DanKoeCaseStudy />;
  }

  // Shell for case studies not yet built
  return (
    <div className="flex flex-col items-center justify-center min-vh-100 p-8 text-center" style={{ minHeight: '100vh' }}>
      <DisplayHeading as="h1" className="gap-6 flex-col flex mb-8">{`Case Study: ${slug || ''}`}</DisplayHeading>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-dim)', marginBottom: '2rem', opacity: 0.6 }}>
        This case study is in production.
      </p>
      <Link
        to="/"
        className="data-label active"
        style={{ color: 'var(--color-insight)', textDecoration: 'none' }}
      >
        ← Back to The Laboratory
      </Link>
    </div>
  );
}

/**
 * Article Shell.
 */
export { ArticlePage } from './ArticlePage';

/**
 * 404 Page.
 */
export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-vh-100 p-8 text-center" style={{ minHeight: '100vh' }}>
      <DisplayHeading as="h1">Lost in the void.</DisplayHeading>
      <Link 
        to="/" 
        className="data-label"
        style={{ color: 'var(--color-insight)', textDecoration: 'none', marginTop: '3rem' }}
      >
        RETURN TO SANCTUARY →
      </Link>
    </div>
  );
}
