import { lazy, Suspense } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DanKoeCaseStudy } from './DanKoeCaseStudy';
import { JustinWelshCaseStudy } from './JustinWelshCaseStudy';
import { TiagoForteCaseStudy } from './TiagoForteCaseStudy';
import { SectionLabel } from '../components/typography/SectionLabel';
import { DisplayHeading } from '../components/typography/DisplayHeading';
import { Scaffold } from '../components/visualizations/Scaffold';
import { FlowPulse } from '../components/visualizations/FlowPulse';
import { HorizontalGallery } from '../components/visualizations/HorizontalGallery';
import { ConvergenceMap } from '../components/visualizations/ConvergenceMap';
import { Marquee } from '../components/visualizations/Marquee';
import { HeroFallback } from '../components/hero/HeroFallback';
const HeroSection = lazy(() =>
  import('../components/hero/HeroSection').then(m => ({ default: m.HeroSection }))
);

if (typeof window !== 'undefined') {
  Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([{ default: gsap }, { ScrollTrigger }]) => gsap.registerPlugin(ScrollTrigger)
  );
}

export function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="homepage-root">
      <Suspense fallback={<HeroFallback />}>
        <HeroSection />
      </Suspense>

      {/* ── THE PROBLEM ──────────────────────────────────────────────────
          Voice: Ash Ambirge directness + Harry Dry specificity.
          Speak to the person who has done the work and still feels something is off.
      ─────────────────────────────────────────────────────────────────── */}
      <section className="mx-auto border-t border-[rgba(255,255,255,0.05)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-32 text-left">
          <SectionLabel>THE HONEST PART</SectionLabel>
          <DisplayHeading as="h2" className="mt-6 max-w-[860px]">
            You built the audience. Now what?
          </DisplayHeading>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '22px',
              lineHeight: 1.7,
              color: 'var(--color-text-dim)',
              marginTop: '2rem',
              maxWidth: '640px',
            }}
          >
            You did everything right. You showed up. You posted. You grew.
            And somewhere in between the metrics and the milestones, you started wondering
            if any of it is actually changing anyone.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '22px',
              lineHeight: 1.7,
              color: 'var(--color-text-dim)',
              marginTop: '1.5rem',
              maxWidth: '640px',
            }}
          >
            It's not a content problem. It's not a strategy problem.
            It's a <em style={{ color: 'var(--color-accent)', fontStyle: 'normal' }}>design</em> problem.
            And nobody's talking about it.
          </p>
        </div>

        {/* Scaffold: 3 named tensions — no numbers, no corporate headers */}
        <div className="w-full px-6 md:px-12 max-w-[1400px] mx-auto pb-40">
          <Scaffold
            bands={[
              {
                label: 'ATTENTION ≠ RETENTION',
                accentColor: 'mustard',
                content: "They watch. They nod. They save it for later. Later never comes. That's not their fault — you built something that performs, not something that sticks. Performance and transformation are different problems.",
                detail: "The architecture fix: We restructure your content so it creates the conditions for behavior change — not just the conditions for a good watch time."
              },
              {
                label: 'THE FUNNEL DOESN\'T CARE ABOUT THEM',
                accentColor: 'transformation',
                content: "The funnel was designed to move people toward a purchase. That's it. It was never built to make anyone better. If your audience feels like they're being managed instead of developed — they're right.",
                detail: "The architecture fix: We replace extraction with cultivation. An audience that grows in capability doesn't churn. They evangelize."
              },
              {
                label: 'DEPTH IS THE MOAT',
                accentColor: 'tangerine',
                content: "You plateaued because reach is a commodity now. The algorithm will always find someone louder. What it can't replicate is an audience that trusts you because you actually changed how they think.",
                detail: "The architecture fix: Depth creates defensibility. We build engagement systems that reward the audience that stays — and compounds."
              }
            ]}
          />
        </div>
      </section>

      {/* ── THE SHIFT ────────────────────────────────────────────────────
          Voice: Shia energy — the moment you stop performing and start being real.
          The binary comparison. Not shaming the funnel — naming what it can't do.
      ─────────────────────────────────────────────────────────────────── */}
      <section
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col items-center gap-16 text-center border-t border-[rgba(255,255,255,0.05)] relative"
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-[820px]">
          <SectionLabel className="justify-center">THE DIFFERENCE</SectionLabel>
          <DisplayHeading as="h2" className="mt-6">
            You're teaching whether you mean to or not.
          </DisplayHeading>
          <p className="body-text mt-8 opacity-80 mx-auto" style={{ fontSize: '22px' }}>
            Every thread. Every framework post. Every "here's what I learned" video.
            That's not content — that's curriculum. Unstructured, unintentional curriculum.
          </p>
          <p className="body-text mt-6 opacity-60 mx-auto" style={{ fontSize: '20px' }}>
            The question isn't whether your audience is learning from you.
            They are. The question is <em style={{ color: 'var(--color-accent)', fontStyle: 'normal' }}>whether you designed what they're learning.</em>
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

      {/* ── THE WORK ─────────────────────────────────────────────────────
          No numbers. Category tag replaces the 01/02/03.
          Copy: specific, earned, no superlatives.
      ─────────────────────────────────────────────────────────────────── */}
      <section
        id="work"
        className="w-full relative block pt-40 pb-20 border-t border-[rgba(255,255,255,0.05)]"
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 mb-16">
          <SectionLabel>THE WORK</SectionLabel>
          <DisplayHeading as="h2" className="mt-6 max-w-[800px]">
            Real people. Real problems. What happened when we fixed them.
          </DisplayHeading>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '22px',
              lineHeight: 1.7,
              marginTop: '2rem',
              opacity: 0.6,
              maxWidth: '680px',
              color: 'var(--color-text)',
            }}
          >
            These are structural diagnoses. We go through the work, find where the
            learning breaks, and show exactly what different looks like.
          </p>
        </div>

        <div className="w-full">
          <HorizontalGallery
            items={[
              {
                id: 'dan-koe',
                number: '',
                category: 'BRAND ARCHITECTURE',
                title: 'Dan Koe',
                subtitle: 'What if 2.3M followers were students, not subscribers?',
                link: '/work/dan-koe-brand-architecture',
                image: '/assets/case-studies/dan-koe-portrait.jpg'
              },
              {
                id: 'just-welsh',
                number: '',
                category: 'CONVERSION DESIGN',
                title: 'Justin Welsh',
                subtitle: 'Removing the last 1% of friction between insight and action.',
                link: '/work/justin-welsh-conversion-design',
                image: '/assets/case-studies/justin-welsh-portrait.png'
              },
              {
                id: 'tiago-forte',
                number: '',
                category: 'COGNITIVE INTERFACES',
                title: 'Tiago Forte',
                subtitle: "The Second Brain already has a curriculum. It just isn't built yet.",
                link: '/work/tiago-forte-cognitive-interfaces',
                image: '/assets/case-studies/tiago-forte-portrait.jpg'
              }
            ]}
          />
        </div>
      </section>

      {/* ── THE LIBRARY ───────────────────────────────────────────────────
          No numbers. Article titles do the work.
          Category tags get correct color mapping.
          Font floors enforced.
      ─────────────────────────────────────────────────────────────────── */}
      <section
        id="writing"
        className="w-full relative overflow-hidden border-t border-[rgba(255,255,255,0.05)]"
        style={{ minHeight: '80vh' }}
      >
        <Marquee text="THE LIBRARY" speed={1} />

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col gap-16 relative z-10 w-full">
          <div className="max-w-[800px]">
            <SectionLabel>DEEP READINGS</SectionLabel>
            <DisplayHeading as="h2">Things worth your time.</DisplayHeading>
          </div>

          <div className="article-list w-full flex flex-col">
            {[
              {
                category: 'LEARNING SCIENCE',
                categoryColor: 'var(--color-intellect)',
                title: 'The Accidental Educator',
                description: 'You never applied for the job. You got it anyway. Here\'s what that means.',
                time: '12 min',
                link: '/writing/the-accidental-educator'
              },
              {
                category: 'DESIGN THEORY',
                categoryColor: 'var(--color-method)',
                title: 'Negative Space as Active Agent',
                description: 'The most powerful element in your content is the thing you didn\'t say.',
                time: '8 min',
                link: '/writing/negative-space-as-active-agent'
              },
              {
                category: 'METHODOLOGY',
                categoryColor: 'var(--color-accent)',
                title: 'The Curiosity Loop Protocol',
                description: 'Five stages from attention to capability. The operating system for identity.',
                time: '15 min',
                link: '/writing/the-curiosity-loop-protocol'
              },
              {
                category: 'PHILOSOPHY',
                categoryColor: 'var(--color-human)',
                title: 'Eureka as Practice',
                description: 'Discovery isn\'t a lightning bolt. It\'s a discipline.',
                time: '10 min',
                link: '/writing/eureka-as-practice'
              }
            ].map((article) => (
              <Link
                key={article.title}
                to={article.link}
                className="article-row group py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 relative overflow-hidden"
                style={{ textDecoration: 'none' }}
              >
                {/* Hover line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-[rgba(234,228,218,0.08)] group-hover:bg-[rgba(234,228,218,0.2)] transition-colors duration-500" />
                <div className="absolute top-0 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-700 ease-[var(--ease-out)]"
                  style={{ backgroundColor: article.categoryColor }} />

                {/* Category */}
                <div className="flex items-center gap-4 md:w-1/4 transform group-hover:translate-x-4 transition-transform duration-500 ease-[var(--ease-out)]">
                  <span
                    className="font-mono text-[12px] tracking-[0.15em] uppercase"
                    style={{ color: article.categoryColor }}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Title + description */}
                <div className="md:w-1/2 transform group-hover:translate-x-2 transition-transform duration-700 ease-[var(--ease-out)]">
                  <h3
                    className="font-display transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(24px, 2.2vw, 32px)',
                      fontStyle: 'italic',
                      color: 'var(--color-text)',
                      fontWeight: 400,
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="mt-2 transition-colors duration-500"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      color: 'var(--color-text-dim)',
                      lineHeight: 1.6,
                    }}
                  >
                    {article.description}
                  </p>
                </div>

                {/* Read time + arrow */}
                <div className="md:w-1/4 flex items-center justify-between md:justify-end gap-12 transform group-hover:-translate-x-4 transition-transform duration-500 ease-[var(--ease-out)]">
                  <span
                    className="font-mono transition-colors duration-300"
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-dim)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {article.time}
                  </span>
                  <span
                    className="text-[20px] transform group-hover:translate-x-2 transition-transform duration-500"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
            <div className="w-full h-[1px] bg-[rgba(234,228,218,0.08)]" />
          </div>
        </div>
      </section>

      {/* ── THE MAP ───────────────────────────────────────────────────────
          Voice: The moment the curtain drops. Direct. Personal. Not a sales pitch.
          CTA speaks to someone who's ready — not someone we're convincing.
      ─────────────────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col items-center gap-16 border-t border-[rgba(255,255,255,0.05)] relative"
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-[700px] text-center">
          <SectionLabel className="justify-center">THE DISCIPLINES</SectionLabel>
          <DisplayHeading as="h2" className="mt-6">
            Everything connects. That's the point.
          </DisplayHeading>
          <p
            className="mt-8 mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '22px',
              lineHeight: 1.7,
              opacity: 0.65,
              color: 'var(--color-text)',
            }}
          >
            Learning doesn't live in one field. Neither does our work.
            Hover to see how the disciplines that shape what we build are connected.
          </p>
        </div>

        <ConvergenceMap
          onNodeClick={(node) => {
            if (node.target) navigate(node.target);
          }}
        />

        <div className="max-w-[800px] text-center mt-12 flex flex-col items-center gap-12">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 2.5vw, 30px)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--color-text)',
              opacity: 0.8,
            }}
          >
            "You've been teaching this whole time. The only question is whether
            the lesson you're delivering is the one you meant to give."
          </p>

          <button
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-none px-10 py-5 transition-all duration-500 bg-transparent"
            style={{ border: '1px solid rgba(237, 119, 60, 0.3)' }}
            onClick={() => navigate('/audit')}
          >
            <div
              className="absolute inset-0 w-0 transition-all duration-500 ease-[var(--ease-out)] group-hover:w-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            <span
              className="relative z-10 inline-flex items-center gap-4 transition-colors duration-500 group-hover:text-white"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}
            >
              Let's look at your architecture
              <span className="transform group-hover:translate-x-2 transition-transform duration-500">→</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

/**
 * Case Study Router — dispatches to the correct case study page by slug.
 */
export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();

  if (slug === 'dan-koe-brand-architecture') {
    return <DanKoeCaseStudy />;
  }

  if (slug === 'justin-welsh-conversion-design') {
    return <JustinWelshCaseStudy />;
  }

  if (slug === 'tiago-forte-cognitive-interfaces') {
    return <TiagoForteCaseStudy />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-vh-100 p-8 text-center" style={{ minHeight: '100vh' }}>
      <DisplayHeading as="h1" className="gap-6 flex-col flex mb-8">{`Case Study: ${slug || ''}`}</DisplayHeading>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-text-dim)', marginBottom: '2rem', opacity: 0.6 }}>
        This case study is in production.
      </p>
      <Link
        to="/"
        className="data-label active"
        style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
      >
        ← Back to the work
      </Link>
    </div>
  );
}

export { ArticlePage } from './ArticlePage';
