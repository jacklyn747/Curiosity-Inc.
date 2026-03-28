// src/pages/TiagoForteCaseStudy.tsx
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Scaffold } from '../components/visualizations/Scaffold';
import { Lens } from '../components/visualizations/Lens';
import { DeltaBridge } from '../components/visualizations/DeltaBridge';
import { useScrollTrigger } from '../hooks/useScrollTrigger';

if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  });
}

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
        src="/assets/case-studies/tiago-forte-portrait.jpg" 
        alt="Tiago Forte" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)', opacity: 0.8 }} 
      />
    </div>
  );
}

export function TiagoForteCaseStudy() {
  const profileRef = useRef<HTMLDivElement>(null);
  const { ref: auditRef, inView: auditInView } = useScrollTrigger({ threshold: 0.15 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.tf-profile-band',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power2.out', delay: 0.4 }
      );
      gsap.fromTo('.tf-profile-meta-col',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.9 }
      );
    }, profileRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!auditInView) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.tf-audit-row',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }, auditRef);
    return () => ctx.revert();
  }, [auditInView]);

  return (
    <div style={{ backgroundColor: 'var(--color-void)', minHeight: '100vh' }}>

      {/* ═══ SITUATION — ACT 01 / THE ARCHITECT ═══ */}
      <section ref={profileRef} className="cs-act-hero">
        <div className="cs-section">

          {/* Case study identifier row */}
          <div className="tf-profile-band cs-scqa-marker" style={{ marginBottom: '40px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-structure)', whiteSpace: 'nowrap' }}>
              ✦ Curiosity Inc. / Case Study 03
            </span>
            <div className="cs-scqa-line" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.4, whiteSpace: 'nowrap' }}>
              Situation — Act 01 / The Architect
            </span>
          </div>

          {/* Profile Card */}
          <div style={{ border: '0.5px solid rgba(136,136,136,0.14)', backgroundColor: 'rgba(255,255,255,0.018)', overflow: 'hidden' }}>

            {/* TOP BAND — Name + Hook + Portrait */}
            <div className="tf-profile-band cs-profile-top">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 8vw, 96px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.025em', margin: 0, marginBottom: '24px' }}>
                  Tiago Forte
                </h1>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px, 1.8vw, 22px)', fontStyle: 'italic', color: 'var(--color-insight)', lineHeight: 1.45, maxWidth: '560px', margin: 0 }}>
                  "The Second Brain already has a curriculum. It just isn't built yet."
                </p>
              </div>
              <EditorialPortrait />
            </div>

            {/* MIDDLE BAND — 5-column metadata */}
            <div className="tf-profile-band cs-meta-grid">
              {[
                { label: 'Domain', value: 'Personal Knowledge Management' },
                { label: 'Approach', value: 'Cognitive Interfaces' },
                { label: 'Flagship', value: 'Building a Second Brain' },
                { label: 'Est.', value: '2017' },
                { label: 'Reach', value: '624K+ Followers' },
              ].map((meta, i) => (
                <div key={i} className="tf-profile-meta-col cs-meta-col">
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '8px' }}>
                    {meta.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1.35 }}>
                    {meta.value}
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM BAND — Platform Distribution + Target Topology */}
            <div className="tf-profile-band cs-split-grid">
              {/* Platform Distribution */}
              <div className="cs-split-col">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '20px' }}>
                  Platform Distribution
                </div>
                {[
                  { platform: 'YouTube', value: '373,000', pct: 0.60, idRole: 'ID Phase: Demo. only' },
                  { platform: 'Newsletter', value: '125,000', pct: 0.20, idRole: 'ID Phase: Demo. only' },
                  { platform: 'Twitter / X', value: '154,000', pct: 0.25, idRole: 'ID Phase: Act. only' },
                  { platform: 'Circle Community', value: '13,000', pct: 0.02, idRole: 'ID Phase: Partial Int.' },
                ].map((net, i) => (
                  <div key={i} style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text)', opacity: 0.65 }}>{net.platform}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-structure)' }}>{net.value}</span>
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'rgba(136,136,136,0.12)', position: 'relative', marginBottom: '4px' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${net.pct * 100}%`, backgroundColor: 'var(--color-structure)', opacity: 0.55 }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--color-context)', opacity: 0.4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {net.idRole}
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
                  "The knowledge worker drowning in information who wants to build an external system for their thinking — so they can be more creative, productive, and effective."
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-context)', opacity: 0.35, letterSpacing: '0.08em', margin: 0 }}>
                  — Derived from BASB positioning and Forte Labs content
                </p>
              </div>
            </div>
          </div>

          {/* Concept study disclaimer */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-context)', opacity: 0.28, marginTop: '14px', letterSpacing: '0.06em' }}>
            ✦ Concept study — All projections are analytical estimates. Curiosity Inc. has no affiliation with Tiago Forte.
          </p>

          {/* Act 01 narrative */}
          <div style={{ marginTop: '64px', maxWidth: '680px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '24px' }}>
              500,000 books sold. 373,000 YouTube subscribers. A methodology — PARA — that has become the default language of personal knowledge management. The idea is everywhere. The framework is taught in Fortune 500 companies and Ivy League classrooms alike.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '24px' }}>
              And yet: 13,000 community members, 550 paying. A $499 course that delivers two hours of video and then releases you into the wild. A book that cost $1.13M to produce and lost $146K. Revenue concentrated in enterprise cohorts that depend entirely on Tiago's personal time.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-dim)' }}>
              The methodology teaches layered thinking. The business delivers it linearly. PARA says: organise by depth. The product architecture says: buy once, figure it out alone.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SITUATION CONTINUED — ACT 02 / THE PLATFORM AUDIT ═══ */}
      <section ref={auditRef} className="cs-act">
        <div className="cs-section">
          <ScqaMarker phase="SITUATION (CONTINUED)" act="ACT 02" title="THE PLATFORM AUDIT" />

          <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '20px' }}>
              Tiago Forte built the definitive methodology for organising knowledge. The question is whether the platforms that deliver it are aligned with the instructional design principles his own methodology demands.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-dim)' }}>
              PARA teaches four layers of depth. CODE teaches four phases of processing. Each platform should serve a specific position in both the marketing funnel and the ID framework. Here is where they actually sit.
            </p>
          </div>

          {/* Section A — Per-Platform Breakdown */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.5, marginBottom: '24px' }}>
              Section A — Platform Architecture
            </div>
            <div className="cs-audit-scroll">
              {[
                {
                  platform: 'YouTube',
                  funnel: 'TOFU',
                  format: 'Tutorials, case studies, tool reviews. 53% of all audience growth. Weekly cadence. High production value.',
                  principles: 'Act. ✓  Demo. ✓',
                  gap: 'No designed practice. Viewer watches, learns concept, leaves. No bridge to application.',
                  status: 'partial' as const,
                },
                {
                  platform: 'Newsletter',
                  funnel: 'MOFU',
                  format: 'Weekly essays. 125K subscribers, 48.6% open rate. Growth declining 39% YoY.',
                  principles: 'Demo. ✓',
                  gap: 'No practice layer. No assignments. No reply mechanism. Passive consumption.',
                  status: 'partial' as const,
                },
                {
                  platform: 'BASB Course',
                  funnel: 'BOFU',
                  format: '6 self-paced modules, ~2hrs video. $499 one-time. Notion template included. No live component.',
                  principles: 'Demo. ✓  Partial App. ◐',
                  gap: 'No feedback loop. No peer review. No outcome measurement. Student is alone after purchase.',
                  status: 'partial' as const,
                },
                {
                  platform: 'Membership',
                  funnel: 'RETENTION',
                  format: '$649/yr. Monthly Q&A, weekly sessions. 13K members, only 550 paying (4.2% conversion).',
                  principles: 'Partial Int. ◐',
                  gap: 'Community exists but lacks structured practice. Sessions are events, not curriculum.',
                  status: 'partial' as const,
                },
                {
                  platform: 'Enterprise',
                  funnel: 'PREMIUM',
                  format: 'Cohort-based, 3 weeks, 10 live sessions. ~$1.5M revenue. Requires Tiago\'s personal time.',
                  principles: 'App. ✓  Feed. ✓',
                  gap: 'The only product with real ID coverage — but doesn\'t scale. Revenue ceiling = Tiago\'s hours.',
                  status: 'partial' as const,
                },
                {
                  platform: '— MISSING —',
                  funnel: 'COGNITIVE INTERFACE',
                  format: 'Nothing. No persistent tool that connects the methodology to the learner\'s daily practice.',
                  principles: '—',
                  gap: 'PARA is tool-agnostic by design — but that means zero data flows back. No measurement, no iteration.',
                  status: 'absent' as const,
                },
              ].map((row, i) => (
                <div key={i} className="tf-audit-row cs-audit-row" style={{
                  borderLeft: `4px solid ${row.status === 'absent' ? 'var(--color-insight)' : 'var(--color-structure)'}`,
                  opacity: 0,
                }}>
                  {[
                    { label: 'Platform', value: row.platform, mono: true },
                    { label: 'Funnel', value: row.funnel, mono: true },
                    { label: 'Current Format', value: row.format, mono: false },
                    { label: 'ID Served', value: row.principles, mono: true },
                    { label: 'Gap', value: row.gap, mono: false },
                  ].map((cell, j) => (
                    <div key={j} style={{ padding: '16px 20px', borderRight: j < 4 ? '0.5px solid rgba(136,136,136,0.06)' : 'none' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.4, marginBottom: '6px' }}>
                        {cell.label}
                      </div>
                      <div style={{ fontFamily: cell.mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: cell.mono ? '10px' : '12px', color: row.status === 'absent' ? 'rgba(247,38,88,0.7)' : 'var(--color-text)', lineHeight: 1.5, opacity: row.status === 'absent' ? 1 : 0.75 }}>
                        {cell.value}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Section B — ID Principles Summary */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.5, marginBottom: '8px' }}>
              Section B — Merrill's First Principles
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-dim)', marginBottom: '24px' }}>
              The irony: Tiago teaches a system built on iterative depth — Capture, Organise, Distill, Express — but his platforms only serve the first two phases of instructional design. The methodology demands depth. The architecture delivers breadth.
            </p>
            {[
              { principle: 'Activation', platform: 'YouTube + Twitter/X', status: 'present' as const, note: 'Strong. The "Second Brain" concept activates prior experience with information overload.' },
              { principle: 'Demonstration', platform: 'YouTube + Newsletter + Course', status: 'present' as const, note: 'Extensive. Tutorials, walkthroughs, case studies across every platform.' },
              { principle: 'Application', platform: 'Course (partial)', status: 'absent' as const, note: 'The course has exercises but no feedback loop. Students apply in isolation.' },
              { principle: 'Feedback', platform: 'Enterprise only', status: 'absent' as const, note: 'Only the $5K+ enterprise cohort has real feedback. Individual learners get none.' },
              { principle: 'Integration', platform: '— Missing —', status: 'absent' as const, note: 'No platform bridges the methodology to daily practice. Tool-agnostic = data-blind.' },
            ].map((row, i) => (
              <div key={i} className="tf-audit-row cs-principle-row" style={{
                borderLeft: `4px solid ${row.status === 'present' ? 'var(--color-structure)' : 'rgba(247,38,88,0.35)'}`,
                opacity: 0,
              }}>
                <div style={{ width: '140px', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: row.status === 'present' ? 'var(--color-structure)' : 'rgba(247,38,88,0.7)', marginBottom: '2px' }}>
                    {row.principle}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--color-context)', opacity: 0.4 }}>
                    {row.status === 'present' ? 'PRESENT' : 'ABSENT'}
                  </div>
                </div>
                <div style={{ width: '220px', flexShrink: 0, paddingRight: '24px' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text)', opacity: 0.55 }}>{row.platform}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text)', opacity: 0.65, lineHeight: 1.5 }}>
                  {row.note}
                </div>
              </div>
            ))}
          </div>

          {/* Closing narrative */}
          <div style={{ maxWidth: '680px', marginTop: '64px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '20px' }}>
              Tiago Forte has built the most influential methodology in personal knowledge management. Half a million people have read the book. Tens of thousands have taken the course. The ideas have reached critical mass.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-dim)' }}>
              But the architecture delivers the methodology as content — not as a cognitive interface. PARA lives in the learner's head, or in whatever tool they happen to use, with no structured connection back to the source. The Second Brain methodology teaches people to build a second brain. It does not give them one.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ QUESTION — ACT 03 / THE COGNITIVE INTERFACE ═══ */}
      <section className="cs-act">
        <div className="cs-section">
          <ScqaMarker phase="QUESTION" act="ACT 03" title="THE COGNITIVE INTERFACE" />

          <div style={{ maxWidth: '680px', marginBottom: '64px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '20px' }}>
              The marketing funnel positions each platform by transaction distance. The ID framework positions each platform by learning depth. The redesign aligns both: every platform serves a specific funnel position AND a specific instructional purpose. Where they were misaligned, we reposition. Where there was a gap, we propose.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-dim)' }}>
              The key intervention: a cognitive interface — a persistent layer between the methodology and the learner's practice that transforms PARA from a concept people learn into a system people inhabit.
            </p>
          </div>

          <Scaffold
            direction="up"
            bands={[
              {
                accentColor: 'sky',
                label: 'CAPTURE — YouTube + Twitter/X',
                content: 'Reposition free content as diagnostic entry points. Each video and thread ends not with "subscribe" but with a specific PARA-aligned prompt: "What project would change if you organised it this way?" The audience enters the methodology by using it, not by watching someone explain it.',
                detail: 'The content creates the first cognitive dissonance: "I have information everywhere and no system." This is the activation that makes the newsletter feel necessary — not because it promises more content, but because it promises a way to process the content they already have.',
              },
              {
                accentColor: 'lavender',
                label: 'ORGANISE — Newsletter + Blog',
                content: 'Restructure the weekly newsletter around CODE phases. Each issue is a single phase applied to a single context: "This week: Distill your meeting notes using Progressive Summarisation." The reader practices one technique per week in their own environment.',
                detail: 'The newsletter stops being a broadcast and becomes a paced curriculum. Replies become outcome data: "I tried Progressive Summarisation on my project notes. Here is what happened." For the first time, the methodology generates evidence from real practice — not from course exercises.',
              },
              {
                accentColor: 'mustard',
                label: 'DISTILL — BASB Course (Redesigned)',
                content: 'The course becomes a 12-week structured implementation — not a video library. Each module maps to a PARA layer. Cohort checkpoints replace self-paced isolation. The student builds their actual Second Brain during the course, not after it.',
                detail: 'The course buyer is no longer cold. They have been practising CODE techniques through the newsletter for weeks. They know the methodology works for them. The course gives them the architectural layer — PARA as a lived system — and for the first time, outcomes are documented and reviewed by peers.',
              },
              {
                accentColor: 'tangerine',
                label: 'EXPRESS — The Cognitive Interface (New)',
                content: 'A persistent practice layer that connects the methodology to the learner\'s daily workflow. Not another app — a structured protocol within whatever tool the learner already uses. Weekly reviews, monthly architecture audits, quarterly system retrospectives. The Second Brain becomes a living practice, not a one-time setup.',
                detail: 'This is the missing layer. Tool-agnostic does not have to mean data-blind. The cognitive interface is a structured feedback loop: the learner\'s practice generates data, the data flows back to the methodology, the methodology improves. Every practitioner becomes a proof point. Every proof point strengthens the IP. The interface is where PARA stops being a concept and becomes a measurable, refinable, licensable framework.',
              },
            ]}
          />

          <div style={{ maxWidth: '680px', marginTop: '64px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '20px' }}>
              When the platforms are aligned, the funnel stops extracting and starts cultivating. The audience doesn't buy a course — they graduate into a practice. The practice generates the evidence that makes the methodology undeniable.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-dim)' }}>
              And the AI pivot Tiago is pursuing? It becomes dramatically more powerful when the Second Brain isn't a static note collection but a living cognitive interface with structured data flowing through it.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ ANSWER — ACT 04 / THE ARCHITECTURE ═══ */}
      <section className="cs-act">
        <div className="cs-section">
          <ScqaMarker phase="ANSWER" act="ACT 04" title="THE ARCHITECTURE" />

          <div style={{ maxWidth: '680px', marginBottom: '80px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75 }}>
              When the platforms are redesigned around instructional depth — not transaction distance — the numbers shift. Not because the marketing improved. Because the architecture now produces what the methodology always promised: transformed practitioners, not passive consumers.
            </p>
          </div>

          <Lens
            value="4.7×"
            sublabel="PRACTITIONER LTV MULTIPLIER"
            beforeLabel={['LINEAR', 'DELIVERY']}
            afterLabel={['COGNITIVE', 'INTERFACE']}
          />

          <div style={{ maxWidth: '680px', margin: '64px auto' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-dim)', textAlign: 'center' }}>
              The intersection: a methodology that finally delivers depth through an architecture designed for depth.
            </p>
          </div>

          <DeltaBridge
            metrics={[
              {
                label: 'Practice Adoption Rate',
                category: 'Learning Behaviour',
                before: '4.2%',
                after: '34%',
                delta: '+710%',
                magnitude: 0.92,
              },
              {
                label: 'Methodology Retention (12mo)',
                category: 'Learning Outcome',
                before: '8%',
                after: '52%',
                delta: '+550%',
                magnitude: 0.88,
              },
              {
                label: 'Practitioner LTV',
                category: 'Business Outcome',
                before: '$86',
                after: '$404',
                delta: '+370%',
                magnitude: 0.82,
              },
            ]}
          />

          <div style={{ maxWidth: '680px', marginTop: '64px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-dim)' }}>
              The categories tell the story: a Learning Behaviour metric (practice adoption) drives a Learning Outcome metric (retention at 12 months) which drives the Business Outcome (lifetime value). The ID framework produces the business result — not the other way around.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ ANSWER CONTINUED — ACT 05 / THE FRAMEWORK ═══ */}
      <section className="cs-act-final">
        <div className="cs-section">
          <ScqaMarker phase="ANSWER (CONTINUED)" act="ACT 05" title="THE FRAMEWORK" />

          <div style={{ maxWidth: '720px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.85, marginBottom: '32px' }}>
              Tiago Forte did not build a productivity business. He built the first language for how humans organise their thinking in the digital age. PARA and CODE are not course material — they are cognitive infrastructure. The distinction matters because courses expire. Infrastructure endures.
            </p>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.7, marginBottom: '32px' }}>
              When the cognitive interface is built — when the methodology has a persistent, measurable connection to the learner's daily practice — what emerges is not a better course or a more engaged community. What emerges is a living framework with thousands of practitioners generating evidence that the system works. That evidence is the most valuable asset in the entire ecosystem.
            </p>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.7, marginBottom: '32px' }}>
              The AI pivot becomes obvious in this context. A Second Brain connected to a cognitive interface is not a static note collection that AI can search. It is a structured knowledge architecture that AI can reason with. The difference between "search my notes" and "think with my knowledge" is the difference between a tool and a partner. The cognitive interface makes the second possible.
            </p>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-dim)', marginBottom: '0' }}>
              This is what Curiosity Inc. builds: not better products, but the cognitive infrastructure that makes ideas permanent.
            </p>
          </div>

          {/* Closing CTA line */}
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--color-text)', opacity: 0.35, textAlign: 'center', marginTop: '120px' }}>
            "The Second Brain already has a curriculum. It just isn't built yet."
          </p>

          {/* Navigation */}
          <div className="cs-nav" style={{ marginTop: '80px' }}>
            <Link
              to="/work/justin-welsh-conversion-design"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-context)', opacity: 0.35, textDecoration: 'none', transition: 'opacity 0.3s ease' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}
            >
              ← Previous: Justin Welsh
            </Link>

            <Link
              to="/#work"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-structure)', textDecoration: 'none', transition: 'opacity 0.3s ease' }}
            >
              Back to The Laboratory
            </Link>

            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-context)', opacity: 0.3 }}>
              More Case Studies Coming →
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
