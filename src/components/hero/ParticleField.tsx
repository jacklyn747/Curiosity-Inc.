// src/components/hero/ParticleField.tsx
import { useRef, useEffect, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useParticleTargets } from '../../hooks/useParticleTargets';

const PARTICLE_COUNT = 800;

// Precompute per-particle drift phases (0–2π) once at module level
const DRIFT_PHASES = Float32Array.from(
  { length: PARTICLE_COUNT },
  () => Math.random() * Math.PI * 2
);

// Lerp between two Float32Arrays into target array
function lerpArrays(out: Float32Array, a: Float32Array, b: Float32Array, t: number) {
  for (let i = 0; i < out.length; i++) {
    out[i] = a[i] + (b[i] - a[i]) * t;
  }
}

interface ParticleFieldProps {
  progressRef: RefObject<number>; // updated directly by GSAP, no React re-renders
}

export function ParticleField({ progressRef }: ParticleFieldProps) {
  const { invalidate } = useThree();
  const { targets, colors } = useParticleTargets(PARTICLE_COUNT);

  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  // #E8E6E0 normalized: R=232/255≈0.910, G=230/255≈0.902, B=224/255≈0.878
  const whiteColors = useRef<Float32Array>(
    Float32Array.from({ length: PARTICLE_COUNT * 3 }, (_, i) => {
      const channel = i % 3;
      return channel === 0 ? 0.910 : channel === 1 ? 0.902 : 0.878;
    })
  );

  // Initialize geometry on mount
  useEffect(() => {
    if (!geometryRef.current) return;
    geometryRef.current.setAttribute(
      'position',
      new THREE.BufferAttribute(targets[0].slice(), 3)
    );
    geometryRef.current.setAttribute(
      'color',
      new THREE.BufferAttribute(whiteColors.current.slice(), 3)
    );
  }, [targets]);

  // All animation in one useFrame — drift when idle, morph when scrolling.
  // Calls invalidate() every tick to drive continuous rendering under frameloop="demand".
  // GSAP scrub: 1 on the ScrollTrigger already smooths progress — no extra tween needed.
  useFrame(({ clock }) => {
    if (!geometryRef.current) return;
    const p = progressRef.current ?? 0;
    const elapsed = clock.getElapsedTime();
    const pos = geometryRef.current.attributes.position as THREE.BufferAttribute;
    const col = geometryRef.current.attributes.color as THREE.BufferAttribute;

    if (p < 0.01) {
      // Idle drift: sine-wave displacement per particle
      const base = targets[0];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const phase = DRIFT_PHASES[i];
        pos.array[i * 3]     = base[i * 3]     + Math.sin(elapsed * 0.3 + phase) * 0.3;
        pos.array[i * 3 + 1] = base[i * 3 + 1] + Math.cos(elapsed * 0.2 + phase) * 0.3;
        pos.array[i * 3 + 2] = base[i * 3 + 2];
      }
      col.array.set(whiteColors.current);
    } else {
      // Scroll morph: lerp directly between stage targets
      // Stage transitions: 0→1 at 0–0.3, 1→2 at 0.3–0.6, 2→3 at 0.6–0.85
      let stageFrom: Float32Array, stageTo: Float32Array, t: number;
      if (p <= 0.3) {
        stageFrom = targets[0]; stageTo = targets[1]; t = p / 0.3;
      } else if (p <= 0.6) {
        stageFrom = targets[1]; stageTo = targets[2]; t = (p - 0.3) / 0.3;
      } else if (p <= 0.85) {
        stageFrom = targets[2]; stageTo = targets[3]; t = (p - 0.6) / 0.25;
      } else {
        stageFrom = targets[3]; stageTo = targets[3]; t = 1;
      }
      lerpArrays(pos.array as Float32Array, stageFrom, stageTo, t);

      // Color: white below progress 0.6, lerp to indexed colors above
      if (p >= 0.6) {
        const colorT = Math.min((p - 0.6) / 0.25, 1);
        lerpArrays(col.array as Float32Array, whiteColors.current, colors, colorT);
      } else {
        col.array.set(whiteColors.current);
      }
    }

    pos.needsUpdate = true;
    col.needsUpdate = true;
    invalidate();
  });

  return (
    <>
      <AdaptiveDpr pixelated />
      <ambientLight intensity={1} />
      {/* No <perspectiveCamera> here — camera is set via the `camera` prop on <Canvas> in HeroSection */}
      <points ref={pointsRef}>
        <bufferGeometry ref={geometryRef} />
        {/*
          size: spec lists "size: 1.5" as pixel-intent; in Three.js world units
          with sizeAttenuation=true, 0.035 achieves correct visual size at camera z=6.
          opacity=0.7 per spec Particle System table ("White at 70% opacity").
        */}
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
    </>
  );
}
