import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Node {
  id: string;
  label: string;
  description: string;
  target?: string; // e.g. /work/dan-koe-brand-architecture
}

interface ConvergenceMapProps {
  nodes?: Node[];
  centerLabel?: string;
  onNodeClick?: (node: Node) => void;
}

export const ConvergenceMap: React.FC<ConvergenceMapProps> = ({
  nodes = [
    { id: 'flow', label: 'Flow Theory', description: "Csíkszentmihályi's conditions for total absorption in a task", target: '/writing/the-curiosity-loop-protocol' },
    { id: 'cog', label: 'Cognitive Load', description: "Why your audience forgets — and how to fix it", target: '/work/justin-welsh-conversion-design' },
    { id: 'loop', label: 'Curiosity Loop', description: "Five stages from attention to capability", target: '/writing/the-curiosity-loop-protocol' },
    { id: 'semi', label: 'Semiotics', description: "How signs, symbols, and visuals carry meaning without words", target: '/writing/negative-space-as-active-agent' },
    { id: 'design', label: 'Design Systems', description: "Repeatable visual patterns that scale without losing coherence", target: '/work/dan-koe-brand-architecture' },
    { id: 'kinetic', label: 'Kinetic Type', description: "Typography that moves to teach — timing as a pedagogical tool", target: '/writing/negative-space-as-active-agent' },
    { id: 'space', label: 'Negative Space', description: "What you leave out creates space for the audience to think", target: '/writing/negative-space-as-active-agent' },
    { id: 'inst', label: 'Instructional Design', description: "The science of structuring information for permanent behavior change", target: '/work/dan-koe-brand-architecture' },
    { id: 'identity', label: 'Identity Theory', description: "People don't buy products. They buy the person they're becoming.", target: '/work/tiago-forte-cognitive-interfaces' },
  ],
  centerLabel = "CURIOSITY INC.",
  onNodeClick,
}) => {
  const { ref: containerRef, inView } = useScrollTrigger({ threshold: 0.2 });
  const isReducedMotion = useReducedMotion();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isCenterHovered, setIsCenterHovered] = useState(false);
  
  const nodesRef = useRef<(SVGCircleElement | null)[]>([]);
  const linesRef = useRef<(SVGPathElement | null)[]>([]);
  const labelsRef = useRef<(SVGTextElement | null)[]>([]);
  const centerNodeRef = useRef<SVGCircleElement | null>(null);
  const centerLabelRef = useRef<SVGTextElement | null>(null);

  const size = 600;
  const center = size / 2;
  const radius = size * 0.35;

  useEffect(() => {
    if (!inView || isReducedMotion) return;

    // Initial state
    gsap.set(nodesRef.current, { opacity: 0 });
    gsap.set(labelsRef.current, { opacity: 0 });
    gsap.set(centerNodeRef.current, { scale: 0, opacity: 0 });
    gsap.set(centerLabelRef.current, { opacity: 0 });

    const timeline = gsap.timeline();

    nodes.forEach((_, i) => {
      const line = linesRef.current[i];
      if (line) {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        
        timeline.to(line, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out"
        }, i * 0.08); // 80ms stagger

        timeline.to([nodesRef.current[i], labelsRef.current[i]], {
          opacity: 1,
          duration: 0.4,
        }, i * 0.08 + 0.8); // Fade in as line is mostly drawn
      }
    });

    // Center node appears last
    timeline.to(centerNodeRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)", // stiffness: 200, damping: 20 approx
    }, "+=0.2");

    timeline.to(centerLabelRef.current, {
      opacity: 1,
      duration: 0.5,
    }, "-=0.4");

  }, [inView, isReducedMotion, nodes]);

  const getNodePos = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const hoveredNodeData = hoveredNode ? nodes.find(n => n.id === hoveredNode) : null;

  return (
    <div
      ref={containerRef as any}
      className="visualization-container convergence-map-container"
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        position: 'relative'
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="convergence-map-svg"
        style={{ width: '100%', aspectRatio: '1/1', overflow: 'visible' }}
        role="img"
        aria-label="Constellation of disciplines that inform Curiosity Inc.'s practice."
      >
        <title>Constellation of disciplines that inform Curiosity Inc.'s practice.</title>
        
        {/* Connection Lines */}
        <g className="edges">
          {nodes.map((node, i) => {
            const pos = getNodePos(i, nodes.length);
            return (
              <path
                key={`line-${node.id}`}
                ref={el => { linesRef.current[i] = el; }}
                d={`M ${pos.x} ${pos.y} L ${center} ${center}`}
                stroke="var(--color-context)"
                strokeWidth="0.5"
                fill="none"
                style={{
                  opacity: (hoveredNode === node.id || isCenterHovered) ? 0.8 : (hoveredNode ? 0.15 : 0.3),
                  transition: 'opacity 0.3s ease',
                  // Initial state for reduced motion
                  strokeDasharray: isReducedMotion ? 'none' : undefined,
                  strokeDashoffset: isReducedMotion ? 0 : undefined,
                }}
              />
            );
          })}
        </g>

        {/* Peripheral Nodes */}
        <g className="nodes">
          {nodes.map((node, i) => {
            const pos = getNodePos(i, nodes.length);
            const isDimmed = hoveredNode && hoveredNode !== node.id && !isCenterHovered;
            
            return (
              <g 
                key={node.id} 
                className="node-group"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onNodeClick && onNodeClick(node)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`${node.label}: ${node.description}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setHoveredNode(node.id);
                  }
                }}
              >
                <circle
                  ref={el => { nodesRef.current[i] = el; }}
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill="var(--color-text)"
                  style={{
                    opacity: isDimmed ? 0.15 : 0.7,
                    transition: 'opacity 0.3s ease',
                  }}
                />
                <text
                  ref={el => { labelsRef.current[i] = el; }}
                  x={pos.x}
                  y={pos.y + 18}
                  textAnchor="middle"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fill: 'var(--color-text)',
                    opacity: isDimmed ? 0.15 : 0.7,
                    transition: 'opacity 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {node.label}
                </text>
                
              </g>
            );
          })}
        </g>

        {/* Center Node */}
        <g 
          className="center-node-group"
          onMouseEnter={() => setIsCenterHovered(true)}
          onMouseLeave={() => setIsCenterHovered(false)}
          style={{ cursor: 'pointer', outline: 'none' }}
        >
          <circle
            ref={centerNodeRef}
            cx={center}
            cy={center}
            r="6"
            fill="var(--color-insight)"
            style={{ 
              transformOrigin: `${center}px ${center}px`,
              opacity: hoveredNode ? 0.3 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />
          <text
            ref={centerLabelRef}
            x={center}
            y={center + 24}
            textAnchor="middle"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 500,
              fill: 'var(--color-insight)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              opacity: hoveredNode ? 0.3 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            {centerLabel}
          </text>
        </g>
      </svg>

      {/* Description caption */}
      <div className="flex flex-col items-center gap-4">
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--color-insight)',
            textAlign: 'center',
            maxWidth: '480px',
            minHeight: '2.5em',
            opacity: hoveredNodeData ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
          aria-live="polite"
        >
          {hoveredNodeData?.description ?? ''}
        </p>
        
        {hoveredNodeData && (
          <button 
            onClick={() => onNodeClick && onNodeClick(hoveredNodeData)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--color-insight)',
              background: 'transparent',
              border: '0.5px solid var(--color-insight)',
              padding: '6px 12px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              opacity: hoveredNodeData ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            Study this Discipline →
          </button>
        )}
      </div>
    </div>
  );
};
