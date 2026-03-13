// Deterministic star field — same stars every render (no Math.random in render)
// Stars are pre-generated as static data to avoid hydration mismatches.

interface Star {
  cx: number
  cy: number
  r: number
  opacity: number
}

// Pre-seeded stars for a 1440×900 viewport (scales via viewBox)
const STARS: Star[] = [
  { cx: 45,   cy: 22,  r: 0.8, opacity: 0.25 },
  { cx: 120,  cy: 8,   r: 0.6, opacity: 0.20 },
  { cx: 200,  cy: 30,  r: 1.0, opacity: 0.30 },
  { cx: 310,  cy: 12,  r: 0.7, opacity: 0.20 },
  { cx: 420,  cy: 25,  r: 0.9, opacity: 0.25 },
  { cx: 510,  cy: 15,  r: 0.6, opacity: 0.15 },
  { cx: 640,  cy: 45,  r: 0.8, opacity: 0.20 },
  { cx: 750,  cy: 8,   r: 0.5, opacity: 0.18 },
  { cx: 890,  cy: 32,  r: 1.0, opacity: 0.22 },
  { cx: 1020, cy: 18,  r: 0.7, opacity: 0.20 },
  { cx: 1150, cy: 40,  r: 0.8, opacity: 0.18 },
  { cx: 1280, cy: 12,  r: 0.6, opacity: 0.15 },
  { cx: 1380, cy: 28,  r: 0.9, opacity: 0.22 },
  { cx: 80,   cy: 180, r: 0.6, opacity: 0.15 },
  { cx: 180,  cy: 240, r: 0.8, opacity: 0.20 },
  { cx: 350,  cy: 160, r: 0.5, opacity: 0.18 },
  { cx: 490,  cy: 220, r: 0.7, opacity: 0.15 },
  { cx: 620,  cy: 180, r: 1.0, opacity: 0.20 },
  { cx: 780,  cy: 250, r: 0.6, opacity: 0.18 },
  { cx: 950,  cy: 190, r: 0.8, opacity: 0.22 },
  { cx: 1100, cy: 230, r: 0.5, opacity: 0.15 },
  { cx: 1250, cy: 170, r: 0.9, opacity: 0.20 },
  { cx: 1400, cy: 210, r: 0.7, opacity: 0.18 },
  { cx: 30,   cy: 400, r: 0.9, opacity: 0.20 },
  { cx: 160,  cy: 480, r: 0.6, opacity: 0.15 },
  { cx: 300,  cy: 420, r: 0.8, opacity: 0.18 },
  { cx: 520,  cy: 460, r: 0.5, opacity: 0.20 },
  { cx: 700,  cy: 400, r: 1.0, opacity: 0.25 },
  { cx: 860,  cy: 490, r: 0.7, opacity: 0.18 },
  { cx: 1050, cy: 430, r: 0.8, opacity: 0.20 },
  { cx: 1200, cy: 470, r: 0.6, opacity: 0.15 },
  { cx: 1380, cy: 410, r: 0.9, opacity: 0.22 },
  { cx: 70,   cy: 650, r: 0.7, opacity: 0.18 },
  { cx: 220,  cy: 700, r: 0.9, opacity: 0.20 },
  { cx: 400,  cy: 640, r: 0.5, opacity: 0.15 },
  { cx: 580,  cy: 720, r: 0.8, opacity: 0.18 },
  { cx: 760,  cy: 660, r: 0.6, opacity: 0.20 },
  { cx: 940,  cy: 710, r: 1.0, opacity: 0.22 },
  { cx: 1120, cy: 650, r: 0.7, opacity: 0.18 },
  { cx: 1300, cy: 690, r: 0.8, opacity: 0.15 },
  { cx: 120,  cy: 840, r: 0.6, opacity: 0.15 },
  { cx: 320,  cy: 880, r: 0.9, opacity: 0.18 },
  { cx: 500,  cy: 850, r: 0.5, opacity: 0.15 },
  { cx: 680,  cy: 870, r: 0.8, opacity: 0.18 },
  { cx: 850,  cy: 840, r: 0.7, opacity: 0.20 },
  { cx: 1050, cy: 880, r: 0.6, opacity: 0.15 },
  { cx: 1230, cy: 860, r: 0.9, opacity: 0.18 },
  { cx: 1400, cy: 845, r: 0.5, opacity: 0.15 },
]

// 4-pointed star burst markers (✦ style via SVG lines)
const STAR_BURSTS = [
  { cx: 72,   cy: 124, size: 5 },
  { cx: 480,  cy: 50,  size: 4 },
  { cx: 390,  cy: 780, size: 5 },
  { cx: 1100, cy: 340, size: 4 },
  { cx: 1350, cy: 620, size: 5 },
]

interface StarFieldProps {
  className?: string
}

export function StarField({ className = '' }: StarFieldProps) {
  return (
    <svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={['absolute inset-0 w-full h-full pointer-events-none', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Dot stars */}
      {STARS.map((star, i) => (
        <circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill={`rgba(234, 228, 218, ${star.opacity})`}
        />
      ))}

      {/* Star burst markers */}
      {STAR_BURSTS.map((s, i) => (
        <g key={i}>
          <line
            x1={s.cx}       y1={s.cy - s.size}
            x2={s.cx}       y2={s.cy + s.size}
            stroke="rgba(234, 228, 218, 0.25)" strokeWidth="0.75"
          />
          <line
            x1={s.cx - s.size} y1={s.cy}
            x2={s.cx + s.size} y2={s.cy}
            stroke="rgba(234, 228, 218, 0.25)" strokeWidth="0.75"
          />
        </g>
      ))}
    </svg>
  )
}
