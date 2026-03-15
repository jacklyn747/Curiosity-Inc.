'use client'

interface OrbitOverlayProps {
  color: string           // e.g. 'var(--tang)' or '#ED773C'
  cx?: number             // center x within viewBox (default 150)
  cy?: number             // center y within viewBox (default 130)
  viewBoxWidth?: number   // default 300
  viewBoxHeight?: number  // default 375
}

export function OrbitOverlay({
  color,
  cx = 150,
  cy = 130,
  viewBoxWidth = 300,
  viewBoxHeight = 375,
}: OrbitOverlayProps) {
  const crosshairSize = 12

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      fill="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Outer orbit ring */}
      <circle cx={cx} cy={cy} r={105} stroke={color} strokeWidth={0.6} opacity={0.18} />
      {/* Middle orbit ring */}
      <circle cx={cx} cy={cy} r={70} stroke={color} strokeWidth={0.5} opacity={0.25} />
      {/* Inner orbit ring */}
      <circle cx={cx} cy={cy} r={40} stroke={color} strokeWidth={0.5} opacity={0.32} />

      {/* Horizontal axis */}
      <line
        x1={cx - 120} y1={cy}
        x2={cx + 120} y2={cy}
        stroke={color} strokeWidth={0.4} opacity={0.12}
      />
      {/* Vertical axis */}
      <line
        x1={cx} y1={cy - 140}
        x2={cx} y2={cy + 140}
        stroke={color} strokeWidth={0.4} opacity={0.12}
      />

      {/* Cross-hair at left orbit intersection */}
      <line
        x1={cx - 105 - crosshairSize / 2} y1={cy}
        x2={cx - 105 + crosshairSize / 2} y2={cy}
        stroke={color} strokeWidth={0.8} opacity={0.38}
      />
      {/* Cross-hair at right orbit intersection */}
      <line
        x1={cx + 105 - crosshairSize / 2} y1={cy}
        x2={cx + 105 + crosshairSize / 2} y2={cy}
        stroke={color} strokeWidth={0.8} opacity={0.38}
      />
      {/* Cross-hair at top orbit intersection */}
      <line
        x1={cx} y1={cy - 105 - crosshairSize / 2}
        x2={cx} y2={cy - 105 + crosshairSize / 2}
        stroke={color} strokeWidth={0.8} opacity={0.38}
      />
      {/* Cross-hair at bottom orbit intersection */}
      <line
        x1={cx} y1={cy + 105 - crosshairSize / 2}
        x2={cx} y2={cy + 105 + crosshairSize / 2}
        stroke={color} strokeWidth={0.8} opacity={0.38}
      />

      {/* Center node dot */}
      <circle cx={cx} cy={cy} r={2.5} fill={color} opacity={0.5} />
    </svg>
  )
}
