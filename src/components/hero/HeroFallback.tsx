// src/components/hero/HeroFallback.tsx
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Flower of Life: 7 circles — center + 6 at 60° offsets, radius 72 each, offset 72
const FLOWER_RADIUS = 72;
const CENTERS: [number, number][] = [
  [200, 180],
  ...Array.from({ length: 6 }, (_, i): [number, number] => [
    200 + FLOWER_RADIUS * Math.cos((i * Math.PI) / 3),
    180 + FLOWER_RADIUS * Math.sin((i * Math.PI) / 3),
  ]),
];

export function HeroFallback() {
  const reduced = useReducedMotion();
  const svgClass = reduced ? 'flower-static' : 'flower-draw';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--color-void)',
      gap: '48px',
      padding: '40px',
    }}>
      <svg
        className={svgClass}
        viewBox="0 0 400 360"
        width="360"
        height="324"
        aria-label="Flower of Life sacred geometry"
        style={{ maxWidth: '480px', width: '100%' }}
      >
        <style>{`
          .flower-draw circle {
            stroke-dasharray: 452;
            stroke-dashoffset: 452;
            animation: drawCircle 1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          .flower-draw circle:nth-child(1) { animation-delay: 0ms; }
          .flower-draw circle:nth-child(2) { animation-delay: 120ms; }
          .flower-draw circle:nth-child(3) { animation-delay: 240ms; }
          .flower-draw circle:nth-child(4) { animation-delay: 360ms; }
          .flower-draw circle:nth-child(5) { animation-delay: 480ms; }
          .flower-draw circle:nth-child(6) { animation-delay: 600ms; }
          .flower-draw circle:nth-child(7) { animation-delay: 720ms; }
          .flower-static circle { stroke-dashoffset: 0; }
          @keyframes drawCircle {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
        {CENTERS.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={FLOWER_RADIUS}
            fill="none"
            stroke="#3A9EA4"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
      </svg>

      <div style={{ textAlign: 'center', maxWidth: '640px' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3.5vw, 40px)',
          fontStyle: 'italic',
          color: 'var(--color-text)',
          marginBottom: '1rem',
          animation: reduced ? 'none' : 'fadeIn 600ms ease forwards 1300ms',
          opacity: reduced ? 1 : 0,
        }}>
          Your audience is learning from you.
        </p>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3.5vw, 40px)',
          fontStyle: 'italic',
          color: 'var(--color-text-dim)',
          opacity: reduced ? 0.8 : 0,
          animation: reduced ? 'none' : 'fadeIn 600ms ease forwards 1600ms',
        }}>
          You just haven't designed what they're learning.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { to { opacity: 1; } }
      `}</style>
    </div>
  );
}
