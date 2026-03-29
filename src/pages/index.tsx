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

/* ─────────────────────────────────────────────────────────────────────────────
   HOMEPAGE
   The argument this page makes, in order:

   1. HERO         → Feel seen. "You've been teaching this whole time."
   2. THE GAP      → Validate + name the problem. The funnel technically works.
                     But it wasn't built for what you're actually trying to do.
   3. THE REVEAL   → Drop the curtain. There's a name for this. LXD.
                     40 years in boardrooms. Nobody brought it to you. Until now.
   4. THE WORK     → Proof. Real people, structural diagnosis, here's what changed.
   5. THE LIBRARY  → Depth. For the audience that reads, not just scrolls.
   6. THE DOOR     → Invitation. Not extraction. Not a funnel. The actual next step.
───────────────────────────────────────────────────────────────────────────── */

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-root">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <Suspense fallback={<HeroFallback />}>
        <HeroSection />
      </Suspense>


      {/* ── 2. THE GAP ──────────────────────────────────────────────────────
          Goal: Validate the island feeling. Name the funnel without shaming it.
          Voice: Direct. Specific. The friend who saw it before you could say it.
          Color: Mustard — energy, "I see you."
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="mx-auto border-t border-[rgba(255,255,255,0.05)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-32 text-left">

          <SectionLabel>THE HONEST PART</SectionLabel>

          <DisplayHeading as="h2" className="mt-6 max-w-[860px]">
            You're not doing it wrong. You're using the wrong tool.
          </DisplayHeading>

          <div style={{ maxWidth: '660px', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '22px', lineHeight: 1.75, color: 'var(--color-text-dim)' }}>
              The funnel works. It still does. It was built for a world where
              information was scarce — give people something they couldn't get
              anywhere else, move them toward a purchase. Clean. Logical.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '22px', lineHeight: 1.75, color: 'var(--color-text-dim)' }}>
              Then twenty-something years of internet happened. Your audience has
              been online since MySpace. They know what a sequence feels like.
              They know the difference between being helped and being moved.
              They may not use the word "funnel." But they{' '}
              <em style={{ color: 'var(--color-energy)', fontStyle: 'normal' }}>feel</em>{' '}
              it.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '22px', lineHeight: 1.75, color: 'var(--color-text-dim)' }}>
              And so do you. There's a gap between the metrics that look good
              and the change that isn't happening. You've been working around it.
              You didn't know there was a tool designed specifically for it.
            </p>
          </div>
        </div>

        <div className="w-full px-6 md:px-12 max-w-[1400px] mx-auto pb-40">
          <Scaffold
            bands={[
              {
                label: 'ATTENTION ≠ RETENTION',
                accentColor: 'mustard',
                content: "They watch. They nod. They save it for later. Later never comes. That's not a content quality problem. It's a design problem — and nobody built you a design system for it.",
                detail: "The fix: We restructure content so it creates the conditions for behavior change, not just the conditions for a good watch-time."
              },
              {
                label: 'THE FUNNEL WASN\'T BUILT FOR THIS',
                accentColor: 'transformation',
                content: "The funnel was designed to move people toward a purchase. That's all it was ever supposed to do. It was never designed to make anyone better. Your audience can feel that distinction. They may not have words for it. They have feelings for it.",
                detail: "The fix: We replace extraction logic with cultivation logic. An audience that grows in capability doesn't churn. They become your best argument."
              },
              {
                label: 'REACH IS A COMMODITY NOW',
                accentColor: 'tangerine',
                content: "The algorithm will always find someone louder. What it cannot replicate is an audience that changed because of you — that thinks differently, acts differently, attributes that shift to what you built. That's not reach. That's architecture.",
                detail: "The fix: Depth creates defensibility. We build systems that compound over time instead of resetting with every post."
              }
            ]}
          />
        </div>
      </section>


      {/* ── 3. THE REVEAL ───────────────────────────────────────────────────
          Goal: Drop the curtain. Name LXD. Give it context without a lecture.
          The voilà moment: "This existed. Nobody brought it to you. Until now."
          Voice: Shia energy — unguarded, direct, earned.
          Color: Lavender — the intellectual, cerebral reveal.
      ─────────────────────────────────────────────────────────────────────── */}
      <section
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col gap-20 border-t border-[rgba(255,255,255,0.05)]"
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-[820px]">
          <SectionLabel>THE THING NOBODY TOLD YOU</SectionLabel>

          <DisplayHeading as="h2" className="mt-6">
            There's a name for what you should have been doing.
          </DisplayHeading>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2.5rem', maxWidth: '680px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '22px', lineHeight: 1.75, color: 'var(--color-text-dim)' }}>
              It's called{' '}
              <strong style={{ color: 'var(--color-intellect)', fontWeight: 500 }}>
                Learning Experience Design.
              </strong>
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '22px', lineHeight: 1.75, color: 'var(--color-text-dim)' }}>
              For forty years it lived in corporate training rooms, business schools,
              and university curricula. The people who had access to it used it to
              engineer actual, measurable behavior change in their audiences.
              Not views. Not downloads. Change.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '22px', lineHeight: 1.75, color: 'var(--color-text-dim)' }}>
              Nobody brought it to you. The internet kept using the funnel instead —
              a tool designed for a world where information was scarce.
              That world ended a while ago.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '22px', lineHeight: 1.75, color: 'var(--color-text)' }}>
              We're the first to bring{' '}
              <em style={{ color: 'var(--color-intellect)', fontStyle: 'normal' }}>these principles</em>{' '}
              to creators who are already trying to do what the principles were
              always meant to produce. You were just doing it without the map.
            </p>
          </div>
        </div>

        {/* The visual proof of the gap */}
        <div className="w-full flex flex-col items-center gap-12">
          <FlowPulse
            flows={[
              {
                id: 'funnel-model',
                label: 'The Funnel — Built for Scarcity',
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
                label: 'Learning Architecture — Built for Change',
                color: 'transformation',
                stages: [
                  { label: 'Attention', width: 1.0 },
                  { label: 'Engagement', width: 0.85 },
                  { label: 'Retention', width: 0.78 },
                  { label: 'Capability', width: 0.72 }
                ],
                dropoffs: [
                  { afterStage: 3.0, label: '3.2× longer engagement', severity: 0.4 }
                ],
                outputLabel: 'Identity Shift → Purchase'
              }
            ]}
          />

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-dim)',
            opacity: 0.5,
            textAlign: 'center',
            maxWidth: '480px',
          }}>
            Two different outputs. Same audience. The difference is design intent.
          </p>
        </div>
      </section>


      {/* ── 4. THE WORK ─────────────────────────────────────────────────────
          Goal: Proof. Not case studies — structural diagnoses.
          Voice: Specific. No superlatives. Here's what we found, here's what changed.
          Color: Tangerine — the "come with me" energy.
      ─────────────────────────────────────────────────────────────────────── */}
      <section
        id="work"
        className="w-full relative block pt-40 pb-20 border-t border-[rgba(255,255,255,0.05)]"
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 mb-16">
          <SectionLabel>THE WORK</SectionLabel>

          <DisplayHeading as="h2" className="mt-6 max-w-[800px]">
            What it actually looks like when the design changes.
          </DisplayHeading>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '22px',
            lineHeight: 1.75,
            marginTop: '2rem',
            color: 'var(--color-text-dim)',
            maxWidth: '600px',
          }}>
            These aren't case studies with a neat before-and-after.
            They're structural diagnoses — we go through the work, find exactly
            where the learning breaks, and show what rebuilding it produces.
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
                id: 'justin-welsh',
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


      {/* ── 5. THE LIBRARY ──────────────────────────────────────────────────
          Goal: Depth. For the audience that wants to understand, not just buy.
          This section IS the proof that we're not running a funnel.
          A funnel doesn't give away the principles. We do.
          Voice: Generous. Intellectual. Here's the map, free of charge.
          Color: Per-category — Lavender, Tea, Tangerine, Pink Quartz.
      ─────────────────────────────────────────────────────────────────────── */}
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
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '20px',
              lineHeight: 1.7,
              color: 'var(--color-text-dim)',
              marginTop: '1.5rem',
              maxWidth: '560px',
            }}>
              The principles, without the pitch. Read these and you'll
              understand exactly what we do — and why you've been needing it.
            </p>
          </div>

          <div className="article-list w-full flex flex-col">
            {[
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
            ].map((article) => (
              <Link
                key={article.title}
                to={article.link}
                className="article-row group py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 relative overflow-hidden"
                style={{ textDecoration: 'none' }}
              >
                {/* Hover lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-[rgba(234,228,218,0.06)] group-hover:bg-[rgba(234,228,218,0.15)] transition-colors duration-500" />
                <div
                  className="absolute top-0 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-700 ease-[var(--ease-out)]"
                  style={{ backgroundColor: article.categoryColor }}
                />

                {/* Category */}
                <div className="flex items-center gap-4 md:w-1/4 transform group-hover:translate-x-4 transition-transform duration-500">
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '12px',
                      letterSpacing: '0.15em',
                      color: article.categoryColor,
                    }}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Title + description */}
                <div className="md:w-1/2 transform group-hover:translate-x-2 transition-transform duration-700">
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(24px, 2.2vw, 32px)',
                    fontStyle: 'italic',
                    color: 'var(--color-text)',
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}>
                    {article.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '18px',
                    color: 'var(--color-text-dim)',
                    lineHeight: 1.6,
                    marginTop: '0.5rem',
                  }}>
                    {article.description}
                  </p>
                </div>

                {/* Read time + arrow */}
                <div className="md:w-1/4 flex items-center justify-between md:justify-end gap-12 transform group-hover:-translate-x-4 transition-transform duration-500">
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    color: 'var(--color-text-dim)',
                  }}>
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
            <div className="w-full h-[1px] bg-[rgba(234,228,218,0.06)]" />
          </div>
        </div>
      </section>


      {/* ── 6. THE DOOR ─────────────────────────────────────────────────────
          Goal: The invitation. Not a funnel. Not a sales pitch.
          "Let's look at what you've built" — a conversation, not a conversion.
          The Constellation shows everything connects — the underlying philosophy.
          Voice: Quiet confidence. You already know if this is for you.
          Color: Sky — clarity, the answer arriving.
      ─────────────────────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-40 flex flex-col items-center gap-20 border-t border-[rgba(255,255,255,0.05)]"
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-[700px] text-center">
          <SectionLabel className="justify-center">
            THE DISCIPLINES
          </SectionLabel>

          <DisplayHeading as="h2" className="mt-6">
            Everything connects. That's the whole point.
          </DisplayHeading>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '22px',
            lineHeight: 1.75,
            color: 'var(--color-text-dim)',
            marginTop: '2rem',
          }}>
            Learning science. Behavioral psychology. Narrative design. Cognitive load theory.
            None of these live in separate boxes. The work we do draws from all of them —
            because real change in a human being doesn't come from one lever.
            Hover to explore how they connect.
          </p>
        </div>

        <ConvergenceMap
          onNodeClick={(node) => {
            if (node.target) navigate(node.target);
          }}
        />

        <div className="max-w-[760px] text-center flex flex-col items-center gap-12">
          <div style={{
            borderLeft: '2px solid var(--color-accent)',
            paddingLeft: '2rem',
            textAlign: 'left',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 2.4vw, 30px)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--color-text)',
            }}>
              "Your audience is learning from you whether you designed it or not.
              The only question is what lesson they're walking away with —
              and whether that was the one you meant to give."
            </p>
          </div>

          <button
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-none px-10 py-5 transition-all duration-500 bg-transparent"
            style={{ border: '1px solid rgba(237, 119, 60, 0.25)' }}
            onClick={() => navigate('/audit')}
          >
            <div
              className="absolute inset-0 w-0 transition-all duration-500 ease-[var(--ease-out)] group-hover:w-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            <span
              className="relative z-10 inline-flex items-center gap-4 transition-colors duration-500 group-hover:text-[#1D1D1B]"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}
            >
              Let's look at what you've built
              <span className="transform group-hover:translate-x-2 transition-transform duration-500">→</span>
            </span>
          </button>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: 'var(--color-text-dim)',
            opacity: 0.4,
            textTransform: 'uppercase',
          }}>
            No pitch. No package. Just a real look at the architecture.
          </p>
        </div>
      </section>

    </div>
  );
}

export default HomePage;


/* ─────────────────────────────────────────────────────────────────────────────
   CASE STUDY ROUTER
───────────────────────────────────────────────────────────────────────────── */
export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();

  if (slug === 'dan-koe-brand-architecture') return <DanKoeCaseStudy />;
  if (slug === 'justin-welsh-conversion-design') return <JustinWelshCaseStudy />;
  if (slug === 'tiago-forte-cognitive-interfaces') return <TiagoForteCaseStudy />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <DisplayHeading as="h1" className="mb-8">{`Case Study: ${slug || ''}`}</DisplayHeading>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', color: 'var(--color-text-dim)', marginBottom: '2rem', opacity: 0.6 }}>
        This one's still being built.
      </p>
      <Link to="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
        ← Back to the work
      </Link>
    </div>
  );
}

export { ArticlePage } from './ArticlePage';
