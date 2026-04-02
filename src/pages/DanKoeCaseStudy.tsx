// src/pages/DanKoeCaseStudy.tsx
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Scaffold } from '../components/visualizations/Scaffold';
import { Lens } from '../components/visualizations/Lens';
import { DeltaBridge } from '../components/visualizations/DeltaBridge';
import { ArchitectureComparison } from '../components/visualizations/ArchitectureComparison';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ScqaMarker({ phase, act, title }: { phase: string; act: string; title: string }) {
  return (
    <div className="cs-scqa-marker">
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-structure)', whiteSpace: 'nowrap', opacity: 0.9 }}>
        {phase}
      </span>
      <div className="cs-scqa-line" />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, whiteSpace: 'nowrap' }}>
        {act} / {title}
      </span>
    </div>
  );
}

function EditorialPortrait() {
  return (
    <div className="cs-portrait">
      <img 
        src="/assets/case-studies/dan-koe-portrait.jpg" 
        alt="Dan Koe" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)', opacity: 0.8 }} 
      />
    </div>
  );
}

export function DanKoeCaseStudy() {
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dk-profile-band',
        { opacity: 0, y: 18, duration: 0.9, stagger: 0.14, ease: 'power2.out', delay: 0.4 }
      );
      gsap.from('.dk-profile-meta-col',
        { opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.9 }
      );
    }, profileRef);
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-void)', minHeight: '100vh' }}>

      {/* ═══ SITUATION — ACT 01 / THE PROFILE ═══ */}
      <section ref={profileRef} className="cs-act-hero">
        <div className="cs-section">

          {/* Case study identifier row */}
          <div className="dk-profile-band cs-scqa-marker">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-structure)', whiteSpace: 'nowrap' }}>
              ✦ Curiosity Inc. / Case Study 01
            </span>
            <div className="cs-scqa-line" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.4, whiteSpace: 'nowrap' }}>
              Situation — Act 01 / The Profile
            </span>
          </div>

          {/* Profile Card */}
          <div style={{ border: '0.5px solid rgba(136,136,136,0.14)', backgroundColor: 'rgba(255, 255, 255, 0.01)', overflow: 'hidden' }}>

            {/* TOP BAND — Name + Hook + Portrait */}
            <div className="dk-profile-band cs-profile-top">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 8vw, 96px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.025em', margin: 0, marginBottom: '24px' }}>
                  Dan Koe
                </h1>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px, 1.8vw, 22px)', fontStyle: 'italic', color: 'var(--color-insight)', lineHeight: 1.45, maxWidth: '560px', margin: 0 }}>
                  "What if 2.3M followers were students, not subscribers?"
                </p>
              </div>
              <EditorialPortrait />
            </div>

            {/* MIDDLE BAND — 5-column metadata */}
            <div className="dk-profile-band cs-meta-grid">
              {[
                { label: 'Domain', value: 'Digital Philosophy' },
                { label: 'Approach', value: 'Learning Architecture' },
                { label: 'Flagship Engine', value: 'Modern Mastery' },
                { label: 'Year Established', value: '2018' },
                { label: 'Total Reach', value: '2.3M Followers' },
              ].map((meta, i) => (
                <div key={i} className="dk-profile-meta-col cs-meta-col">
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '8px' }}>
                    {meta.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1.35 }}>
                    {meta.value}
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM BAND — Network Bandwidth + Target Topology */}
            <div className="dk-profile-band cs-split-grid">
              {/* Network Bandwidth */}
              <div className="cs-split-col">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '20px' }}>
                  Network Bandwidth
                </div>
                {[
                  { platform: 'X (formerly Twitter)', value: '1,800,000', pct: 0.78 },
                  { platform: 'YouTube', value: '300,000', pct: 0.13 },
                  { platform: 'Instagram', value: '200,000', pct: 0.09 },
                ].map((net, i) => (
                  <div key={i} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text)', opacity: 0.65 }}>{net.platform}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-structure)' }}>{net.value}</span>
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'rgba(136,136,136,0.12)', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${net.pct * 100}%`, backgroundColor: 'var(--color-structure)', opacity: 0.55 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="cs-split-divider" />

              {/* Target Topology */}
              <div className="cs-split-col">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '20px' }}>
                  Target Topology
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontStyle: 'italic', color: 'var(--color-text)', opacity: 0.6, lineHeight: 1.65, margin: 0, marginBottom: '14px' }}>
                  "The ambitious individual who wants to escape a nine-to-five and build a one-person business around their skills, ideas, and writing."
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-context)', opacity: 0.35, letterSpacing: '0.08em', margin: 0 }}>
                  — Dan Koe's own description of his audience
                </p>
              </div>
            </div>
          </div>

          {/* Concept study disclaimer */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-context)', opacity: 0.28, marginTop: '14px', letterSpacing: '0.06em' }}>
            ✦ Concept study — All projections are analytical estimates. Curiosity Inc. has no affiliation with Dan Koe.
          </p>
        </div>
      </section>

      {/* ═══ SITUATION (CONTINUED) — ACT 02 / THE DIAGNOSIS ═══ */}
      <section className="cs-act">
        <div className="cs-section">
          <ScqaMarker phase="Situation — Continued" act="Act 02" title="The Diagnosis" />

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 42px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1.2, margin: 0, marginBottom: '40px' }}>
            What's Working.
          </h2>

          <Scaffold
            bands={[
              {
                label: 'INTELLECTUAL BRAND EQUITY',
                accentColor: 'structure',
                content: 'Dan Koe has built something rare: an intellectual identity that precedes his products. "The Modern Generalist" is not a title — it is a positioning architecture. His audience does not follow him for tips. They follow him for a worldview.',
                detail: 'Architecture note: Intellectual brand equity is the highest form of creator moat. It creates pre-sold audiences who arrive ready to pay, not ready to evaluate. Koe has this. The challenge is building an educational architecture worthy of it.',
              },
              {
                label: 'NEWSLETTER AS DEPTH LAYER',
                accentColor: 'structure',
                content: 'The 2AM Newsletter is genuinely valuable and genuinely deep. Unlike most creator newsletters — which are aggregations or shallow takes — Koe\'s writing models the thinking he teaches. It creates a legitimate second layer of relationship with his audience.',
                detail: 'Architecture note: The newsletter is already functioning as an accidental curriculum. The writing traces an intellectual journey that readers can follow. We are not replacing this — we are building a structure around it.',
              },
              {
                label: 'PRODUCT LADDER WITH REAL ARCHITECTURE',
                accentColor: 'structure',
                content: 'The progression from free content → newsletter → 2-Hour Writer → Digital Economics Mastery → The Modern Mastery community represents genuine thinking about audience ascension. Most creators have a product. Koe has a ladder.',
                detail: 'Architecture note: The ladder exists. The problem is that the rungs are defined by price, not by transformation stage. Our intervention redefines the rungs by learning outcome — which changes who climbs and how far.',
              },
            ]}
          />

          {/* Complication divider */}
          <div style={{ marginTop: '96px', marginBottom: '64px' }}>
            <ScqaMarker phase="Complication" act="Act 02" title="The Structural Constraint" />

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 42px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1.2, margin: 0, marginBottom: '28px' }}>
              However.
            </h2>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-text)', opacity: 0.72, lineHeight: 1.75, maxWidth: '720px', margin: 0, marginBottom: '64px' }}>
              The architecture is a funnel. Funnels are optimized for extraction, not transformation. When 98% of your audience exits before purchasing, the standard response is to optimize the funnel. But the funnel is not broken — it is doing exactly what funnels do. The question is whether a funnel is the right structure for an intellectual brand whose core claim is that it produces transformed people.
            </p>
          </div>

          {/* Architecture Comparison */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '32px' }}>
            Architecture Comparison
          </div>
          <ArchitectureComparison />
        </div>
      </section>

      {/* ═══ QUESTION — ACT 03 / THE ORBITAL GRAVITY WELL ═══ */}
      <section className="cs-act" style={{ backgroundColor: 'rgba(255,255,255,0.012)' }}>
        <div className="cs-section">
          <ScqaMarker phase="Question" act="Act 03" title="The Orbital Gravity Well" />

          <div style={{ maxWidth: '800px', marginBottom: '80px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 52px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1.2, margin: 0, marginBottom: '32px' }}>
              What if the architecture was rebuilt from scratch around the question Dan Koe's content is already asking?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-text)', opacity: 0.65, lineHeight: 1.75, margin: 0 }}>
              <em style={{ color: 'var(--color-insight)', fontStyle: 'italic' }}>
                How do you become the person you want to be?
              </em>{' '}
              That is Koe's actual thesis. Not "how to build a business." Not "how to write." The transformation of identity. Every piece of content he produces is an attempt to answer this question from a different angle. What if the architecture reflected that?
            </p>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '28px' }}>
            The Proposed Orbital Gravity Well — Five Learning Layers
          </div>

          <Scaffold
            bands={[
              {
                label: 'ATTENTION / RESONANCE — The Outer Orbit',
                accentColor: 'sky',
                content: 'Free content designed as resonance testing. Not entertainment. Not information. Each piece of content is a calibrated question: does this worldview resonate with you? The audience self-selects based on intellectual alignment, not algorithmic exposure.',
                detail: 'Application for Dan Koe: X posts, YouTube content, and free essays are explicitly framed as orientation questions. The call to action is not "follow me" — it is "if this question matters to you, here is where we go deeper."',
              },
              {
                label: 'DECISION / CALIBRATION — The Second Orbit',
                accentColor: 'lavender',
                content: 'The newsletter becomes a calibration layer. Each issue is a diagnostic: where are you in the transformation process? Readers begin to self-identify their position in the journey. The psychological shift is from passive reader to active student.',
                detail: 'Application for Dan Koe: 2AM Newsletter issues are restructured around explicit transformation stages. Each issue labels its stage — creating metacognitive awareness in the reader about where they are in the journey.',
              },
              {
                label: 'INTENTION / SIMULATION — The Third Orbit',
                accentColor: 'mustard',
                content: 'The 2-Hour Writer and course content become simulation environments. Not instruction. Simulation. The learner is placed in the role of the transformed person and given tools to practice thinking from that identity before they have fully claimed it.',
                detail: 'Application for Dan Koe: 2-Hour Writer is repositioned as a ninety-day simulation where participants practice writing as if they were already the person they want to become. The writing is the transformation, not a skill acquisition.',
              },
              {
                label: 'ACTION / EXECUTION — The Fourth Orbit',
                accentColor: 'tangerine',
                content: 'Community and accountability structures are designed around visible execution, not social interaction. The Modern Mastery community becomes a publishing collective. Members are not there to learn — they are there to build, in public, with peers who are doing the same.',
                detail: 'Application for Dan Koe: Modern Mastery community is restructured around a weekly Proof of Work protocol. Each member commits to one public execution per week. Community interaction is post-publication, not pre-publication — feedback on real output, not hypothetical plans.',
              },
              {
                label: 'CAPABILITY / THE CORE — The Identity Orbit',
                accentColor: 'insight',
                content: 'The inner orbit is not a product. It is a certification of identity. The student who has completed the journey does not graduate — they become a proof of concept. Their transformation is the most powerful piece of content Koe can produce.',
                detail: 'Application for Dan Koe: A Proof of Identity protocol — a documented case study of a student\'s transformation, co-produced with Koe and published as a case study on the platform. The student becomes a living example of the methodology. This is the highest form of content: proof.',
              },
            ]}
          />
        </div>
      </section>

      {/* ═══ ANSWER — ACT 04 / THE SHIFT ═══ */}
      <section className="cs-act">
        <div className="cs-section">
          <ScqaMarker phase="Answer" act="Act 04" title="The Shift" />

          {/* Lens — hero stat */}
          <div style={{ marginBottom: '96px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-text)', opacity: 0.55, lineHeight: 1.65, maxWidth: '560px', margin: '0 auto 32px', textAlign: 'center' }}>
              The projected impact of restructuring from a funnel to an Orbital Gravity Well architecture.
            </p>
            <Lens
              value="3.2×"
              sublabel="Lifetime Value Multiplier"
              beforeLabel={['Funnel', 'Architecture']}
              afterLabel={['Orbital', 'Architecture']}
            />
          </div>

          {/* DeltaBridge */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '48px' }}>
            Projected Outcome Delta — Funnel Architecture vs. Orbital Gravity Well
          </div>

          <DeltaBridge
            stagger={200}
            metrics={[
              {
                label: 'Repeat Engagement Rate',
                category: 'Audience Behavior',
                before: '12%',
                after: '38%',
                delta: '+217%',
                magnitude: 0.85,
              },
              {
                label: 'Revenue per Subscriber',
                category: 'Business Outcome',
                before: '$0.82',
                after: '$2.62',
                delta: '+220%',
                magnitude: 0.88,
              },
              {
                label: 'Curriculum Completion Rate',
                category: 'Learning Outcome',
                before: 'N/A',
                after: '64%',
                delta: 'New Metric',
                magnitude: 0.64,
              },
              {
                label: 'Identity Language in Community',
                category: 'Transformation Signal',
                before: '4%',
                after: '31%',
                delta: '+675%',
                magnitude: 1.0,
              },
              {
                label: 'Time to First Purchase',
                category: 'Conversion Velocity',
                before: '47 days',
                after: '28 days',
                delta: '−40%',
                magnitude: 0.6,
              },
            ]}
          />
        </div>
      </section>

      {/* ═══ ANSWER (CONTINUED) — ACT 05 / THE REFLECTION ═══ */}
      <section className="cs-act-final" style={{ borderTop: '0.5px solid rgba(136,136,136,0.08)' }}>
        <div className="cs-section" style={{ maxWidth: '800px' }}>
          <ScqaMarker phase="Answer — Continued" act="Act 05" title="The Reflection" />

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-text)', opacity: 0.68, lineHeight: 1.8, margin: 0, marginBottom: '56px' }}>
            Dan Koe is not doing anything wrong. He has built a remarkable intellectual brand on a foundation of genuine thinking. The question is not whether his architecture is broken — it is whether it is as powerful as the ideas it carries. A funnel is a broadcast tool. What Koe is doing is not broadcasting. It is teaching. The architecture should reflect that.
          </p>

          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 30px)', fontStyle: 'italic', color: 'var(--color-insight)', lineHeight: 1.45, borderLeft: '2px solid var(--color-insight)', paddingLeft: '24px', margin: '0 0 80px' }}>
            "Every creator with an audience over 50,000 is sitting on an unstructured curriculum. The question isn't whether your audience is learning from you. They are. The question is what they're learning — and whether you designed it on purpose."
          </blockquote>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
            <Link
              to="/audit"
              style={{
                padding: '16px 40px',
                background: 'transparent',
                border: '1px solid var(--color-insight)',
                color: 'var(--color-insight)',
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '24px',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(247,38,88,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Request a Curiosity Audit
            </Link>
          </div>

          {/* Navigation */}
          <div className="cs-nav" style={{ marginTop: '80px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-context)', opacity: 0.3 }}>
              ← First Case Study
            </span>

            <Link
              to="/#work"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-structure)', textDecoration: 'none', transition: 'opacity 0.3s ease' }}
            >
              Back to The Laboratory
            </Link>

            <Link
              to="/work/justin-welsh-conversion-design"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-context)', opacity: 0.35, textDecoration: 'none', transition: 'opacity 0.3s ease' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}
            >
              Next: Justin Welsh →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
