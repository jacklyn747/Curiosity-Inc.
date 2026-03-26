// src/pages/JustinWelshCaseStudy.tsx
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-structure)', whiteSpace: 'nowrap', opacity: 0.9 }}>
        {phase}
      </span>
      <div style={{ flex: 1, height: '0.5px', backgroundColor: 'rgba(58,158,164,0.18)' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.4, whiteSpace: 'nowrap' }}>
        {act} / {title}
      </span>
    </div>
  );
}

function EditorialPortrait() {
  return (
    <div style={{ width: '160px', flexShrink: 0, aspectRatio: '4 / 5', border: '0.5px solid rgba(136,136,136,0.2)', overflow: 'hidden', position: 'relative', backgroundColor: 'rgba(255,255,255,0.015)' }}>
      <svg viewBox="0 0 160 200" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="portrait-bg-jw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A9EA4" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#1D1E20" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect width="160" height="200" fill="url(#portrait-bg-jw)" />
        <text x="80" y="116" textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: 'Georgia, serif', fontSize: '54px', fontStyle: 'italic', fill: 'rgba(58,158,164,0.22)', letterSpacing: '-0.04em' }}>
          JW
        </text>
        {[40, 55, 70, 140, 155, 170].map((y) => (
          <line key={y} x1="12" y1={y} x2="148" y2={y} stroke="rgba(58,158,164,0.06)" strokeWidth="0.5" />
        ))}
      </svg>
    </div>
  );
}

export function JustinWelshCaseStudy() {
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.jw-profile-band',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power2.out', delay: 0.4 }
      );
      gsap.fromTo('.jw-profile-meta-col',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.9 }
      );
    }, profileRef);
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-void)', minHeight: '100vh' }}>
      {/* ═══ SITUATION — ACT 01 / THE PROFESSOR ═══ */}
      <section ref={profileRef} style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>

          {/* Case study identifier row */}
          <div className="jw-profile-band" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-structure)', whiteSpace: 'nowrap' }}>
              ✦ Curiosity Inc. / Case Study 02
            </span>
            <div style={{ flex: 1, height: '0.5px', backgroundColor: 'rgba(58,158,164,0.18)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.4, whiteSpace: 'nowrap' }}>
              Situation — Act 01 / The Professor
            </span>
          </div>

          {/* Profile Card */}
          <div style={{ border: '0.5px solid rgba(136,136,136,0.14)', backgroundColor: 'rgba(255,255,255,0.018)', overflow: 'hidden' }}>

            {/* TOP BAND — Name + Hook + Portrait */}
            <div className="jw-profile-band" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: '48px', padding: '48px 56px', borderBottom: '0.5px solid rgba(136,136,136,0.1)' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 8vw, 96px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.025em', margin: 0, marginBottom: '24px' }}>
                  Justin Welsh
                </h1>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px, 1.8vw, 22px)', fontStyle: 'italic', color: 'var(--color-insight)', lineHeight: 1.45, maxWidth: '560px', margin: 0 }}>
                  "What if the ideas Justin Welsh teaches outlive the platforms he teaches them on?"
                </p>
              </div>
              <EditorialPortrait />
            </div>

            {/* MIDDLE BAND — 5-column metadata */}
            <div className="jw-profile-band" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderBottom: '0.5px solid rgba(136,136,136,0.1)' }}>
              {[
                { label: 'Domain', value: 'Solopreneurship' },
                { label: 'Approach', value: 'Conversion Design' },
                { label: 'Flagship', value: 'The Operating System' },
                { label: 'Est.', value: '2019' },
                { label: 'Reach', value: '500K+ Followers' },
              ].map((meta, i) => (
                <div key={i} className="jw-profile-meta-col" style={{ padding: '24px 28px', borderRight: i < 4 ? '0.5px solid rgba(136,136,136,0.08)' : 'none' }}>
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
            <div className="jw-profile-band" style={{ display: 'grid', gridTemplateColumns: '1fr 0.5px 1fr' }}>
              {/* Platform Distribution */}
              <div style={{ padding: '32px 40px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '20px' }}>
                  Platform Distribution
                </div>
                {[
                  { platform: 'LinkedIn', value: '500,000', pct: 0.76, idRole: 'Activation + Demonstration' },
                  { platform: 'Newsletter', value: '150,000', pct: 0.23, idRole: 'Demonstration only' },
                  { platform: 'Courses', value: '—', pct: 0.05, idRole: 'Partial Application' },
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
              <div style={{ backgroundColor: 'rgba(136,136,136,0.09)' }} />

              {/* Target Topology */}
              <div style={{ padding: '32px 40px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-context)', opacity: 0.45, marginBottom: '20px' }}>
                  Target Topology
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontStyle: 'italic', color: 'var(--color-text)', opacity: 0.6, lineHeight: 1.65, margin: 0, marginBottom: '14px' }}>
                  "The corporate professional who wants to build a one-person business and escape the nine-to-five permanently."
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-context)', opacity: 0.35, letterSpacing: '0.08em', margin: 0 }}>
                  — Justin Welsh's own description of his audience
                </p>
              </div>
            </div>
          </div>

          {/* Concept study disclaimer */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-context)', opacity: 0.28, marginTop: '14px', letterSpacing: '0.06em' }}>
            ✦ Concept study — All projections are analytical estimates. Curiosity Inc. has no affiliation with Justin Welsh.
          </p>

          {/* Act 01 narrative */}
          <div style={{ marginTop: '64px', maxWidth: '680px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '24px' }}>
              500,000 LinkedIn followers. 150,000 newsletter subscribers. Two courses with thousands of students and $5M+ in revenue. Every post delivers one clean insight, one lesson, one clear takeaway. The delivery is exceptional.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', opacity: 0.75, marginBottom: '24px' }}>
              The ideas land. They inspire. The tab closes. Most of the audience does not change how they work.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-dim)' }}>
              This is not a reach problem. Not a content problem. Not a marketing problem. It is a curriculum problem.
            </p>
          </div>
        </div>
      </section>
      {/* Acts 02–05 placeholder — filled in subsequent tasks */}
    </div>
  );
}
