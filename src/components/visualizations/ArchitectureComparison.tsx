import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ArchitectureComparison
 * Side-by-side SVG: Current Funnel Model (left) vs. Proposed Orbital Gravity Well (right).
 * Both self-draw on scroll trigger with staggered GSAP animation.
 */
export const ArchitectureComparison: React.FC = () => {
  const { ref: containerRef, inView } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const funnelLayer1Ref = useRef<SVGGElement>(null);
  const funnelLayer2Ref = useRef<SVGGElement>(null);
  const funnelLayer3Ref = useRef<SVGGElement>(null);
  const dropoffRef = useRef<SVGGElement>(null);

  const ring4Ref = useRef<SVGCircleElement>(null);
  const ring3Ref = useRef<SVGCircleElement>(null);
  const ring2Ref = useRef<SVGCircleElement>(null);
  const ring1Ref = useRef<SVGCircleElement>(null);
  const arrowsRef = useRef<SVGGElement>(null);
  const ringLabelsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    const tl = gsap.timeline({ delay: 0.3 });

    // Funnel layers stagger top-to-bottom
    tl.fromTo(
      [funnelLayer1Ref.current, funnelLayer2Ref.current, funnelLayer3Ref.current],
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.2, ease: 'power2.out' }
    );

    // Drop-off annotations appear after funnel
    tl.fromTo(
      dropoffRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.1'
    );

    // Rings draw simultaneously, outside-in
    const ringRefs = [ring4Ref, ring3Ref, ring2Ref, ring1Ref];
    ringRefs.forEach((ref, i) => {
      if (ref.current) {
        const len = ref.current.getTotalLength();
        gsap.set(ref.current, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(
          ref.current,
          { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' },
          0.8 + i * 0.07
        );
      }
    });

    // Arrows and labels after rings
    tl.fromTo(
      [arrowsRef.current, ringLabelsRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
      '+=0.2'
    );
  }, [inView, prefersReducedMotion]);

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    paddingBottom: '10px',
    marginBottom: '14px',
  };

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      style={{ width: '100%' }}
      className="arch-comparison"
    >
      <div className="arch-comparison-grid">
        {/* ─── LEFT: FUNNEL ─────────────────────────────── */}
        <div className="arch-comparison-col">
          <div
            style={{
              ...labelStyle,
              color: 'var(--color-context)',
              opacity: 0.5,
              borderBottom: '0.5px solid rgba(136,136,136,0.15)',
            }}
          >
            Current — The Funnel Model
          </div>

          <svg
            viewBox="0 0 300 310"
            style={{ width: '100%', height: 'auto', overflow: 'visible' }}
            aria-label="Current funnel architecture: Free Content to Newsletter to Course, with 92% and 96% exit rates between layers"
          >
            {/* Layer 1 — Free Content */}
            <g
              ref={funnelLayer1Ref}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            >
              <path
                d="M 20 40 L 280 40 L 244 115 L 56 115 Z"
                fill="rgba(58,158,164,0.08)"
                stroke="var(--color-structure)"
                strokeWidth="0.75"
              />
              <text
                x="150"
                y="70"
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fill: 'var(--color-structure)',
                  letterSpacing: '0.1em',
                  opacity: 0.85,
                }}
              >
                FREE CONTENT
              </text>
              <text
                x="150"
                y="86"
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  fill: 'var(--color-context)',
                  opacity: 0.45,
                }}
              >
                2.3M reach
              </text>
            </g>

            {/* Layer 2 — Newsletter */}
            <g
              ref={funnelLayer2Ref}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            >
              <path
                d="M 56 124 L 244 124 L 208 199 L 92 199 Z"
                fill="rgba(250,119,20,0.07)"
                stroke="var(--color-transformation)"
                strokeWidth="0.75"
              />
              <text
                x="150"
                y="154"
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fill: 'var(--color-transformation)',
                  letterSpacing: '0.1em',
                  opacity: 0.85,
                }}
              >
                NEWSLETTER
              </text>
              <text
                x="150"
                y="170"
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  fill: 'var(--color-context)',
                  opacity: 0.45,
                }}
              >
                ~180K subscribers
              </text>
            </g>

            {/* Layer 3 — Course / Product */}
            <g
              ref={funnelLayer3Ref}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            >
              <path
                d="M 92 208 L 208 208 L 182 274 L 118 274 Z"
                fill="rgba(247,38,88,0.07)"
                stroke="var(--color-insight)"
                strokeWidth="0.75"
              />
              <text
                x="150"
                y="234"
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fill: 'var(--color-insight)',
                  letterSpacing: '0.1em',
                  opacity: 0.85,
                }}
              >
                COURSE / PRODUCT
              </text>
              <text
                x="150"
                y="250"
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  fill: 'var(--color-context)',
                  opacity: 0.45,
                }}
              >
                ~8K customers
              </text>
            </g>

            {/* Drop-off annotations */}
            <g
              ref={dropoffRef}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            >
              <line
                x1="244"
                y1="118"
                x2="256"
                y2="120"
                stroke="var(--color-insight)"
                strokeWidth="0.5"
              />
              <text
                x="259"
                y="121"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  fill: 'var(--color-insight)',
                  opacity: 0.65,
                }}
              >
                −92% exit
              </text>
              <line
                x1="208"
                y1="203"
                x2="220"
                y2="205"
                stroke="var(--color-insight)"
                strokeWidth="0.5"
              />
              <text
                x="223"
                y="206"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  fill: 'var(--color-insight)',
                  opacity: 0.65,
                }}
              >
                −96% exit
              </text>
            </g>
          </svg>
        </div>

        {/* Divider */}
        <div className="arch-comparison-divider" />

        {/* ─── RIGHT: ORBITAL GRAVITY WELL ──────────────── */}
        <div className="arch-comparison-col">
          <div
            style={{
              ...labelStyle,
              color: 'var(--color-structure)',
              opacity: 0.8,
              borderBottom: '0.5px solid rgba(58,158,164,0.2)',
            }}
          >
            Proposed — The Orbital Gravity Well
          </div>

          <svg
            viewBox="0 0 300 310"
            style={{ width: '100%', height: 'auto', overflow: 'visible' }}
            aria-label="Proposed orbital architecture: four concentric rings — Awareness, Engagement, Learning, Identity — with inward arrows showing audience movement toward the core"
          >
            <defs>
              <marker
                id="arrowhead-inward"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path
                  d="M 0 0 L 6 3 L 0 6 Z"
                  fill="var(--color-structure)"
                  opacity="0.45"
                />
              </marker>
            </defs>

            {/* Ring 4 — Awareness (outermost) */}
            <circle
              ref={ring4Ref}
              cx="150"
              cy="160"
              r="112"
              fill="none"
              stroke="var(--color-structure)"
              strokeWidth="1"
              strokeOpacity="0.22"
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            />

            {/* Ring 3 — Engagement */}
            <circle
              ref={ring3Ref}
              cx="150"
              cy="160"
              r="80"
              fill="none"
              stroke="var(--color-structure)"
              strokeWidth="1"
              strokeOpacity="0.48"
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            />

            {/* Ring 2 — Learning */}
            <circle
              ref={ring2Ref}
              cx="150"
              cy="160"
              r="50"
              fill="none"
              stroke="var(--color-transformation)"
              strokeWidth="1"
              strokeOpacity="0.7"
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            />

            {/* Ring 1 — Identity (innermost) */}
            <circle
              ref={ring1Ref}
              cx="150"
              cy="160"
              r="22"
              fill="rgba(247,38,88,0.1)"
              stroke="var(--color-insight)"
              strokeWidth="1.5"
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            />

            {/* Ring labels — positioned at 12 o'clock of each ring */}
            <g
              ref={ringLabelsRef}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            >
              <text
                x="150"
                y="34"
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  fill: 'var(--color-structure)',
                  opacity: 0.4,
                  letterSpacing: '0.1em',
                }}
              >
                AWARENESS
              </text>
              <text
                x="150"
                y="66"
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  fill: 'var(--color-structure)',
                  opacity: 0.6,
                  letterSpacing: '0.1em',
                }}
              >
                ENGAGEMENT
              </text>
              <text
                x="150"
                y="96"
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  fill: 'var(--color-transformation)',
                  opacity: 0.8,
                  letterSpacing: '0.1em',
                }}
              >
                LEARNING
              </text>
              {/* Identity — centered inside the core ring */}
              <text
                x="150"
                y="164"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '7px',
                  fill: 'var(--color-insight)',
                  letterSpacing: '0.12em',
                }}
              >
                IDENTITY
              </text>
            </g>

            {/* Inward arrows at compass points — between Awareness and Engagement rings */}
            <g
              ref={arrowsRef}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            >
              {/* North */}
              <line
                x1="150"
                y1="52"
                x2="150"
                y2="83"
                stroke="var(--color-structure)"
                strokeWidth="0.75"
                strokeOpacity="0.4"
                markerEnd="url(#arrowhead-inward)"
              />
              {/* East */}
              <line
                x1="260"
                y1="160"
                x2="229"
                y2="160"
                stroke="var(--color-structure)"
                strokeWidth="0.75"
                strokeOpacity="0.4"
                markerEnd="url(#arrowhead-inward)"
              />
              {/* South */}
              <line
                x1="150"
                y1="268"
                x2="150"
                y2="237"
                stroke="var(--color-structure)"
                strokeWidth="0.75"
                strokeOpacity="0.4"
                markerEnd="url(#arrowhead-inward)"
              />
              {/* West */}
              <line
                x1="40"
                y1="160"
                x2="71"
                y2="160"
                stroke="var(--color-structure)"
                strokeWidth="0.75"
                strokeOpacity="0.4"
                markerEnd="url(#arrowhead-inward)"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Explanation captions */}
      <div className="arch-comparison-captions">
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--color-text)',
            opacity: 0.4,
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          Each transition between layers loses the majority of the audience.
          The architecture is optimized for filtering, not for cultivating.
        </p>
        <div className="arch-comparison-divider" />
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--color-text)',
            opacity: 0.4,
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          Gravity pulls the audience inward over time. No single exit point.
          Each orbit deepens the relationship before the next.
        </p>
      </div>
    </div>
  );
};
