import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FlowStage {
  label: string;
  width: number; // 0-1
}

interface DropOff {
  afterStage: number; // index
  label: string;
  severity: number; // (Controls Pink intensity via opacity or stroke)
}

interface Flow {
  id: string;
  label: string;
  color: 'structure' | 'transformation'; // Teal for funnel, Orange for learning architecture
  stages: FlowStage[];
  dropoffs?: DropOff[];
  outputLabel: string;
}

interface FlowPulseProps {
  flows: Flow[];
}

const COLOR_MAP = {
  structure: 'var(--color-structure)',
  transformation: 'var(--color-transformation)',
  insight: 'var(--color-insight)',
  conviction: 'var(--color-conviction)',
};

const NoiseFilter = () => (
  <filter id="flow-noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
    <feComponentTransfer>
      <feFuncA type="linear" slope="0.05" />
    </feComponentTransfer>
    <feComposite operator="in" in2="SourceGraphic" />
  </filter>
);

export const FlowPulse: React.FC<FlowPulseProps> = ({ flows }) => {
  const { ref: containerRef, inView } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div 
      ref={containerRef as any}
      className={`flow-pulse-root w-full flex flex-col md:flex-row gap-16 md:gap-24 py-12 md:py-16 items-start justify-center transition-opacity duration-1000
        ${inView || prefersReducedMotion ? 'opacity-100' : 'opacity-0'}`}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <NoiseFilter />
      </svg>
      {flows.map((flow, i) => (
        <React.Fragment key={flow.id}>
          <FlowPath 
            flow={flow} 
            inView={inView} 
            prefersReducedMotion={prefersReducedMotion} 
            index={i} 
          />
          {i < flows.length - 1 && (
            <div className="md:hidden flex items-center justify-center w-full py-2 font-mono text-[9px] opacity-20 text-[var(--color-context)]">
              VS.
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const FlowPath: React.FC<{ 
  flow: Flow; 
  inView: boolean; 
  prefersReducedMotion: boolean;
  index: number;
}> = ({ flow, inView, prefersReducedMotion, index }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const annotationsRef = useRef<SVGGElement>(null);
  const breatheAnim = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    // Clip-reveal
    const clipPath = svgRef.current?.querySelector('.flow-clip-rect');
    if (clipPath) {
      gsap.fromTo(clipPath, 
        { attr: { width: 0 } },
        { 
          attr: { width: 600 }, 
          duration: 0.8, 
          ease: 'power3.inOut', 
          delay: index * 0.4 
        }
      );
    }

    // Breathing animation
    const path = pathRef.current;
    if (path) {
      breatheAnim.current = gsap.to(path, {
        opacity: 0.7,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.4 + 1.2
      });
    }

    const annotations = annotationsRef.current;
    if (annotations) {
      const annotationDelay = (index * 0.4) + 1.2;
      gsap.fromTo(annotations,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power2.out', 
          delay: annotationDelay 
        }
      );
    }

    return () => {
      breatheAnim.current?.kill();
    };
  }, [inView, index, prefersReducedMotion]);

  const handleMouseEnter = () => {
    if (breatheAnim.current) {
      gsap.to(breatheAnim.current, { timeScale: 2.5, duration: 0.5 });
      gsap.to(pathRef.current, { strokeWidth: 1.5, opacity: 0.9, duration: 0.5 });
    }
  };

  const handleMouseLeave = () => {
    if (breatheAnim.current) {
      gsap.to(breatheAnim.current, { timeScale: 1.0, duration: 0.8 });
      gsap.to(pathRef.current, { strokeWidth: 0.5, opacity: 0.5, duration: 0.8 });
    }
  };

  const generatePath = () => {
    const W = 600;
    const H = 200;
    const centerY = H / 2;
    const stageCount = flow.stages.length;
    const segmentWidth = (W - 140) / (stageCount - 1);
    
    let pathData = "";
    const points: { x: number, y1: number, y2: number }[] = [];

    flow.stages.forEach((stage, i) => {
      const x = i * segmentWidth + 40;
      const h = stage.width * 80;
      points.push({ x, y1: centerY - h / 2, y2: centerY + h / 2 });
    });

    points.push({ x: W - 100, y1: points[points.length - 1].y1, y2: points[points.length - 1].y2 });

    pathData += `M ${points[0].x} ${points[0].y1}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const cp1x = p1.x + (p2.x - p1.x) / 3;
        const cp2x = p2.x - (p2.x - p1.x) / 3;
        pathData += ` C ${cp1x} ${p1.y1}, ${cp2x} ${p2.y1}, ${p2.x} ${p2.y1}`;
    }

    pathData += ` L ${points[points.length - 1].x} ${points[points.length - 1].y2}`;

    for (let i = points.length - 2; i >= 0; i--) {
        const p1 = points[i + 1];
        const p2 = points[i];
        const cp1x = p1.x - (p1.x - p2.x) / 3;
        const cp2x = p2.x + (p1.x - p2.x) / 3;
        pathData += ` C ${cp1x} ${p1.y2}, ${cp2x} ${p2.y2}, ${p2.x} ${p2.y2}`;
    }

    pathData += " Z";
    return pathData;
  };

  const mainColor = COLOR_MAP[flow.color];

  return (
    <div 
      className="flow-path-container flex flex-col gap-6 w-full max-w-[500px] group/flow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col gap-1">
        <p className="font-display text-[20px] font-normal italic text-[var(--color-text)] transition-colors duration-500 group-hover/flow:text-[var(--color-text)] opacity-60 group-hover/flow:opacity-100">
          {flow.label}
        </p>
      </div>

      <svg 
        ref={svgRef}
        viewBox="-40 -20 680 240" 
        className="w-full h-auto overflow-visible"
        aria-label={`Visualizing ${flow.label} flow architecture`}
      >
        <defs>
          <clipPath id={`clip-${flow.id}`}>
            <rect className="flow-clip-rect" x="0" y="0" width={prefersReducedMotion ? "600" : "0"} height="200" />
          </clipPath>
          <linearGradient id={`grad-${flow.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={mainColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={mainColor} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <path 
          ref={pathRef}
          d={generatePath()}
          fill={`url(#grad-${flow.id})`}
          stroke={mainColor}
          strokeWidth="0.5"
          clipPath={`url(#clip-${flow.id})`}
          className="transition-all duration-700 ease-[var(--ease-out)]"
          style={{ 
            opacity: prefersReducedMotion ? 0.6 : 0.5,
            filter: 'url(#flow-noise)'
          }}
        />

        {/* Labels */}
        <g 
          className="stage-labels font-mono text-[9px] uppercase tracking-[0.1em]" 
          fill="var(--color-context)"
          style={{ opacity: 0.5 }}
        >
          {flow.stages.map((stage, i) => {
            const segmentWidth = (600 - 140) / (flow.stages.length - 1);
            return (
              <text key={i} x={i * segmentWidth + 40} y="44" textAnchor="middle">
                {stage.label}
              </text>
            );
          })}
          <text 
            x="505" y="104" 
            fill={mainColor} 
            className="transition-all duration-500"
            style={{ opacity: 1, letterSpacing: '0.05em', fontWeight: 600 }}
            dominantBaseline="middle"
          >
            {flow.outputLabel}
          </text>
        </g>

        {/* DropOff Annotations */}
        <g ref={annotationsRef} style={{ opacity: prefersReducedMotion ? 1 : 0 }}>
          {flow.dropoffs?.map((drop, i) => {
            const segmentWidth = (600 - 140) / (flow.stages.length - 1);
            const x = drop.afterStage * segmentWidth + segmentWidth / 2 + 40;
            const ySurface = 125;
            
            return (
              <g key={i} className="transition-all duration-500 group-hover/flow:opacity-100">
                <line 
                  x1={x} y1={ySurface} x2={x + 16} y2={ySurface + 24}
                  stroke={COLOR_MAP.conviction} strokeWidth="1" strokeDasharray="3 3"
                />
                <circle cx={x} cy={ySurface} r="3" fill={COLOR_MAP.conviction} />
                <text 
                  x={x + 22} y={ySurface + 34} 
                  className="font-mono text-[10px] tracking-tight"
                  fill={COLOR_MAP.conviction}
                >
                  {drop.label}
                </text>
              </g>
            );
          })}
        </g>

        {!prefersReducedMotion && inView && (
          <circle
            r="4"
            fill={mainColor}
            style={{ 
              offsetPath: `path("${generatePath()}")`,
              animation: `flow-travel 5s linear infinite`,
              filter: 'blur(1px)'
            }}
          />
        )}
      </svg>
    </div>
  );
};
