// src/components/visualizations/AnnotationThread.tsx
//
// The Annotation Thread — time-series narrative component.
//
// Visual logic: A single Pink focal line (2px) against a field of grey
// context lines (0.5px, 30% opacity). Annotation circles on the focal
// line draw leader lines to floating text labels.
//
// Animation sequence:
//   1. Grey context lines fade in 400ms
//   2. Pink focal line draws left-to-right via stroke-dashoffset (scroll-linked)
//   3. Annotation circles spring-scale in as line passes
//   4. Leader lines draw with 200ms delay after their circle

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ThreadDataPoint {
  /** X position as fraction 0–1 of the chart width */
  x: number;
  /** Y position as fraction 0–1 (0 = top, 1 = bottom) */
  y: number;
}

export interface ThreadAnnotation {
  /** The data point index this annotation attaches to */
  pointIndex: number;
  /** Short annotation label */
  label: string;
  /** Optional sub-label in dimmer text */
  sublabel?: string;
  /** Whether the leader draws up or down from the point */
  direction?: 'up' | 'down';
}

export interface AnnotationThreadProps {
  /** Title displayed above the chart (BLUF principle) */
  title: string;
  /** Subtitle / framing line below the title */
  subtitle?: string;
  /** The focal data points (the Pink subject trajectory) */
  focalPoints: ThreadDataPoint[];
  /**
   * Context lines — background benchmarks / comparisons.
   * Each is an array of {x, y} points.
   */
  contextLines?: ThreadDataPoint[][];
  /** Annotations pinned to focal line points */
  annotations?: ThreadAnnotation[];
}

// ─── SVG layout constants ──────────────────────────────────────────────────
const W = 800;
const H = 240;
const PAD = { top: 24, right: 48, bottom: 24, left: 48 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;

function toSvgX(x: number) {
  return PAD.left + x * CHART_W;
}
function toSvgY(y: number) {
  return PAD.top + (1 - y) * CHART_H; // invert: 0 = bottom, 1 = top
}

function buildPolyline(points: ThreadDataPoint[]): string {
  return points.map(p => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ');
}

// Smooth cubic bezier path through a set of points
function buildCubicPath(points: ThreadDataPoint[]): string {
  if (points.length < 2) return '';
  const pts = points.map(p => ({ x: toSvgX(p.x), y: toSvgY(p.y) }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 3;
    const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) / 3;
    d += ` C ${cp1x} ${pts[i].y}, ${cp2x} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

// ─── Component ────────────────────────────────────────────────────────────

export const AnnotationThread: React.FC<AnnotationThreadProps> = ({
  title,
  subtitle,
  focalPoints,
  contextLines = [],
  annotations = [],
}) => {
  const { ref: containerRef, inView } = useScrollTrigger({ threshold: 0.2 });
  const isReducedMotion = useReducedMotion();

  const focalPathRef = useRef<SVGPathElement>(null);
  const contextLineRefs = useRef<(SVGPolylineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const leaderRefs = useRef<(SVGLineElement | null)[]>([]);
  const labelRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    if (!inView) return;

    if (isReducedMotion) {
      // Static: everything fully visible immediately
      gsap.set(contextLineRefs.current, { opacity: 0.3 });
      gsap.set(focalPathRef.current, { opacity: 1 });
      gsap.set(dotRefs.current, { opacity: 1, scale: 1, transformOrigin: 'center' });
      gsap.set(leaderRefs.current, { opacity: 0.5 });
      gsap.set(labelRefs.current, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline();

    // 1 — Context lines fade in
    tl.from(
      contextLineRefs.current.filter(Boolean),
      { opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
      0
    );

    // 2 — Focal line draws left-to-right
    const focalPath = focalPathRef.current;
    if (focalPath) {
      const length = focalPath.getTotalLength();
      gsap.set(focalPath, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
      tl.to(
        focalPath,
        { strokeDashoffset: 0, duration: 1.6, ease: 'power3.inOut' },
        0.3
      );
    }

    // 3 — Annotation dots spring in sequentially as line approaches
    annotations.forEach((ann, i) => {
      const pointX = focalPoints[ann.pointIndex]?.x ?? 0;
      // Delay proportional to how far along the focal line the point is
      const delay = 0.3 + pointX * 1.6 - 0.1; // slightly before line arrives

      tl.from(
        dotRefs.current[i],
        { scale: 0, opacity: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.6)', transformOrigin: 'center center' },
        delay
      );

      // 4 — Leader lines draw after dot
      tl.from(
        leaderRefs.current[i],
        { opacity: 0, duration: 0.3, ease: 'power2.out' },
        delay + 0.15
      );

      // 5 — Labels fade in after leader
      tl.from(
        labelRefs.current[i],
        { opacity: 0, y: 4, duration: 0.35, ease: 'power2.out' },
        delay + 0.25
      );
    });
  }, [inView, isReducedMotion, annotations, focalPoints]);

  const focalPath = buildCubicPath(focalPoints);

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      style={{ width: '100%' }}
    >
      {/* Title (BLUF — appears before the data) */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-context)',
          opacity: 0.5,
          marginBottom: '8px',
        }}>
          ✦ ANNOTATION THREAD
        </p>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 400,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--color-text-dim)',
            marginTop: '6px',
            lineHeight: 1.5,
          }}>
            {subtitle}
          </p>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        role="img"
        aria-label={`Annotation Thread: ${title}. ${subtitle ?? ''}`}
      >
        <title>{title}</title>

        {/* Context lines — industry benchmarks / comparisons */}
        {contextLines.map((line, i) => (
          <polyline
            key={i}
            ref={el => { contextLineRefs.current[i] = el; }}
            points={buildPolyline(line)}
            fill="none"
            stroke="var(--color-context)"
            strokeWidth="0.5"
            style={{ opacity: 0.3 }}
          />
        ))}

        {/* Pink focal line — the subject's trajectory */}
        <path
          ref={focalPathRef}
          d={focalPath}
          fill="none"
          stroke="var(--color-insight)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Annotation markers */}
        {annotations.map((ann, i) => {
          const point = focalPoints[ann.pointIndex];
          if (!point) return null;

          const cx = toSvgX(point.x);
          const cy = toSvgY(point.y);
          const dir = ann.direction ?? 'up';
          const leaderLen = 36;
          const ly2 = dir === 'up' ? cy - leaderLen : cy + leaderLen;
          const labelY = dir === 'up' ? ly2 - 6 : ly2 + 16;

          return (
            <g key={i}>
              {/* Annotation dot */}
              <circle
                ref={el => { dotRefs.current[i] = el; }}
                cx={cx}
                cy={cy}
                r="4"
                fill="var(--color-insight)"
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              />

              {/* Leader line */}
              <line
                ref={el => { leaderRefs.current[i] = el; }}
                x1={cx}
                y1={dir === 'up' ? cy - 5 : cy + 5}
                x2={cx}
                y2={ly2}
                stroke="var(--color-context)"
                strokeWidth="0.5"
                strokeDasharray="3 3"
                style={{ opacity: 0.5 }}
              />

              {/* Label group */}
              <g
                ref={el => { labelRefs.current[i] = el; }}
              >
                <text
                  x={cx}
                  y={labelY}
                  textAnchor="middle"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fill: 'var(--color-text)',
                    opacity: 0.75,
                    letterSpacing: '0.06em',
                  }}
                >
                  {ann.label}
                </text>
                {ann.sublabel && (
                  <text
                    x={cx}
                    y={labelY + 13}
                    textAnchor="middle"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '8px',
                      fill: 'var(--color-context)',
                      opacity: 0.45,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {ann.sublabel}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
