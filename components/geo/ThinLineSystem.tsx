interface ThinLineSystemProps {
  color?: string    // Accent color for primary geometry, default lavender
  opacity?: number  // Overall opacity multiplier, default 1
  className?: string
  variant?: 'hero' | 'system' | 'minimal'
}

export function ThinLineSystem({
  color = 'var(--lav)',
  opacity = 1,
  className = '',
  variant = 'minimal',
}: ThinLineSystemProps) {
  const baseOpacity = opacity

  if (variant === 'minimal') {
    // Subtle background texture: just concentric circles + cross markers
    return (
      <svg
        viewBox="0 0 600 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={['absolute inset-0 w-full h-full pointer-events-none', className].filter(Boolean).join(' ')}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="300" cy="200" r="160" stroke={`rgba(234,228,218,${0.03 * baseOpacity})`} strokeWidth="0.75"/>
        <circle cx="300" cy="200" r="110" stroke={`rgba(234,228,218,${0.04 * baseOpacity})`} strokeWidth="0.75"/>
        <circle cx="300" cy="200" r="68"  stroke={`rgba(234,228,218,${0.05 * baseOpacity})`} strokeWidth="0.75"/>
        {/* Cross markers */}
        <line x1="58"  y1="198" x2="68"  y2="198" stroke={`rgba(234,228,218,${0.15 * baseOpacity})`} strokeWidth="0.75"/>
        <line x1="63"  y1="193" x2="63"  y2="203" stroke={`rgba(234,228,218,${0.15 * baseOpacity})`} strokeWidth="0.75"/>
        <line x1="532" y1="198" x2="542" y2="198" stroke={`rgba(234,228,218,${0.15 * baseOpacity})`} strokeWidth="0.75"/>
        <line x1="537" y1="193" x2="537" y2="203" stroke={`rgba(234,228,218,${0.15 * baseOpacity})`} strokeWidth="0.75"/>
      </svg>
    )
  }

  if (variant === 'hero') {
    // Full hero geometry: circle, radiating lines, triangle, diagonal
    return (
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={['absolute inset-0 w-full h-full pointer-events-none', className].filter(Boolean).join(' ')}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Large circle */}
        <circle cx="900" cy="450" r="350" stroke={`rgba(234,228,218,${0.04 * baseOpacity})`} strokeWidth="0.75"/>
        <circle cx="900" cy="450" r="240" stroke={`rgba(234,228,218,${0.03 * baseOpacity})`} strokeWidth="0.75"/>
        {/* Radiating lines from right vanishing point */}
        {[0, 120, 240, 360, 480, 600, 720, 840].map((y2, i) => (
          <line key={i} x1="1440" y1="450" x2="-100" y2={y2}
            stroke={`rgba(234,228,218,${0.025 * baseOpacity})`} strokeWidth="0.75"/>
        ))}
        {/* Diagonal slash */}
        <line x1="720" y1="0" x2="820" y2="900"
          stroke={`rgba(237,119,60,${0.12 * baseOpacity})`} strokeWidth="1"/>
        {/* Triangle */}
        <polygon points="1100,200 1250,700 950,700"
          stroke={`rgba(234,228,218,${0.04 * baseOpacity})`} strokeWidth="0.75" fill="none"/>
        {/* Grid dashes */}
        <line x1="0" y1="300" x2="1440" y2="300"
          stroke={`rgba(234,228,218,${0.025 * baseOpacity})`} strokeWidth="0.5" strokeDasharray="4 16"/>
        <line x1="0" y1="600" x2="1440" y2="600"
          stroke={`rgba(234,228,218,${0.02 * baseOpacity})`} strokeWidth="0.5" strokeDasharray="4 16"/>
        {/* Cross markers */}
        {[[60, 448], [1380, 448], [720, 60], [720, 840]].map(([cx, cy], i) => (
          <g key={i}>
            <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy}
              stroke={`rgba(234,228,218,${0.18 * baseOpacity})`} strokeWidth="0.75"/>
            <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8}
              stroke={`rgba(234,228,218,${0.18 * baseOpacity})`} strokeWidth="0.75"/>
          </g>
        ))}
      </svg>
    )
  }

  // 'system' variant: the full sacred geometry diagram
  return (
    <svg
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={['w-full h-full pointer-events-none', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {/* Outer rings */}
      <circle cx="400" cy="400" r="320" stroke={`rgba(234,228,218,${0.06 * baseOpacity})`} strokeWidth="0.75"/>
      <circle cx="400" cy="400" r="240" stroke={`rgba(234,228,218,${0.06 * baseOpacity})`} strokeWidth="0.75"/>
      <circle cx="400" cy="400" r="160" stroke={color} strokeOpacity={0.25 * baseOpacity} strokeWidth="0.75"/>
      <circle cx="400" cy="400" r="90"  stroke={color} strokeOpacity={0.35 * baseOpacity} strokeWidth="1"/>
      <circle cx="400" cy="400" r="36"  stroke={color} strokeOpacity={0.5  * baseOpacity} strokeWidth="1"/>
      {/* Offset circles */}
      <circle cx="320" cy="340" r="120" stroke={`rgba(234,228,218,${0.06 * baseOpacity})`} strokeWidth="0.75"/>
      <circle cx="480" cy="340" r="120" stroke={`rgba(234,228,218,${0.06 * baseOpacity})`} strokeWidth="0.75"/>
      <circle cx="400" cy="500" r="100" stroke={`rgba(234,228,218,${0.05 * baseOpacity})`} strokeWidth="0.75"/>
      {/* Triangles */}
      <polygon points="400,100 660,540 140,540"
        stroke={`rgba(234,228,218,${0.08 * baseOpacity})`} strokeWidth="0.75" fill="none"/>
      <polygon points="400,700 660,260 140,260"
        stroke={`rgba(234,228,218,${0.06 * baseOpacity})`} strokeWidth="0.75" fill="none"/>
      {/* Axis lines */}
      <line x1="400" y1="40" x2="400" y2="760"
        stroke={`rgba(234,228,218,${0.04 * baseOpacity})`} strokeWidth="0.75"/>
      <line x1="40"  y1="400" x2="760" y2="400"
        stroke={`rgba(234,228,218,${0.04 * baseOpacity})`} strokeWidth="0.75"/>
      {/* Diagonal arcs */}
      <path d="M 180 180 A 310 310 0 0 1 620 180"
        stroke={`rgba(234,228,218,${0.04 * baseOpacity})`} strokeWidth="0.75" fill="none"/>
      <path d="M 180 620 A 310 310 0 0 0 620 620"
        stroke={`rgba(234,228,218,${0.04 * baseOpacity})`} strokeWidth="0.75" fill="none"/>
      {/* Node dots */}
      {[
        [400, 80], [400, 720], [80, 400], [720, 400],
        [190, 190], [610, 190], [190, 610], [610, 610],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={color} fillOpacity={0.6 * baseOpacity}/>
      ))}
      {/* Central orb placeholder */}
      <circle cx="400" cy="400" r="8" fill="var(--tang)" fillOpacity={0.9 * baseOpacity}/>
      <circle cx="400" cy="400" r="3" fill="rgba(255,248,220,0.9)"/>
    </svg>
  )
}
