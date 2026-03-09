"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";

// ─── Interference background shader ─────────────────────────────────────────

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;

    // Moiré / Lissajous interference
    float f1 = 22.0;
    float f2 = 29.0;
    float w1 = sin(uv.x * f1 + uTime * 0.38) * sin(uv.y * f1 * 1.15 + uTime * 0.28);
    float w2 = sin(uv.x * f2 - uTime * 0.25) * sin(uv.y * f2 * 0.88 + uTime * 0.42);
    float moire = w1 * w2;

    // Grain
    float grain = rand(uv + fract(uTime * 0.013)) * 0.14;

    // Signal energy (0..1)
    float signal = (moire * 0.5 + 0.5) * uIntensity + grain * uIntensity * 0.55;

    vec3 dark = vec3(0.114, 0.114, 0.106);   // #1D1D1B
    vec3 lav  = vec3(0.502, 0.545, 0.773);   // #808BC5

    vec3 col = mix(dark, lav, clamp(signal * 0.24, 0.0, 0.20));
    gl_FragColor = vec4(col, 1.0);
  }
`;

function InterferenceBG({
  intensity,
}: {
  intensity: React.MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uIntensity: { value: 1.0 } }),
    []
  );

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uIntensity.value = intensity.current;
  });

  return (
    <mesh position={[0, 0, -4]} renderOrder={-1}>
      <planeGeometry args={[30, 22]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Signal clouds ───────────────────────────────────────────────────────────

const COUNT = 460;

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function makeScattered(): Float32Array {
  const a = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    a[i * 3]     = (Math.random() - 0.5) * 18;
    a[i * 3 + 1] = (Math.random() - 0.5) * 13;
    a[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  return a;
}

function makeSeparated(lane: number): Float32Array {
  // lane: -1 left, 0 center, 1 right
  const a = new Float32Array(COUNT * 3);
  const xBase = lane * 4.2;
  for (let i = 0; i < COUNT; i++) {
    a[i * 3]     = xBase + (Math.random() - 0.5) * 2.4;
    a[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
    a[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
  }
  return a;
}

function makeMonolithFace(face: 0 | 1 | 2): Float32Array {
  const a = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    if (face === 0) {
      // front face — lavender
      a[i * 3]     = (Math.random() - 0.5) * 0.78;
      a[i * 3 + 1] = (Math.random() - 0.5) * 2.28;
      a[i * 3 + 2] = 0.085 + Math.random() * 0.09;
    } else if (face === 1) {
      // back face — tea
      a[i * 3]     = (Math.random() - 0.5) * 0.78;
      a[i * 3 + 1] = (Math.random() - 0.5) * 2.28;
      a[i * 3 + 2] = -0.085 - Math.random() * 0.09;
    } else {
      // orbiting halo — sky
      const ang = Math.random() * Math.PI * 2;
      const r   = 0.55 + Math.random() * 0.52;
      a[i * 3]     = Math.cos(ang) * r;
      a[i * 3 + 1] = (Math.random() - 0.5) * 2.28;
      a[i * 3 + 2] = Math.sin(ang) * r;
    }
  }
  return a;
}

interface SignalCloudProps {
  color: string;
  lane: -1 | 0 | 1;
  face: 0 | 1 | 2;
  progress: React.MutableRefObject<number>;
}

function SignalCloud({ color, lane, face, progress }: SignalCloudProps) {
  const geoRef = useRef<THREE.BufferGeometry>(null);

  // Immutable reference positions
  const startRef  = useMemo(makeScattered, []);
  const midRef    = useMemo(() => makeSeparated(lane), [lane]);
  const targetRef = useMemo(() => makeMonolithFace(face), [face]);

  // GPU buffer — starts as copy of startRef
  const bufArr = useMemo(() => new Float32Array(startRef), [startRef]);

  useFrame(() => {
    if (!geoRef.current) return;
    const p = progress.current;

    for (let i = 0; i < COUNT; i++) {
      const si = i * 3;
      let x: number, y: number, z: number;

      if (p <= 0.5) {
        const t = smoothstep(p * 2);
        x = startRef[si]     + (midRef[si]     - startRef[si])     * t;
        y = startRef[si + 1] + (midRef[si + 1] - startRef[si + 1]) * t;
        z = startRef[si + 2] + (midRef[si + 2] - startRef[si + 2]) * t;
      } else {
        const t = smoothstep((p - 0.5) * 2);
        x = midRef[si]     + (targetRef[si]     - midRef[si])     * t;
        y = midRef[si + 1] + (targetRef[si + 1] - midRef[si + 1]) * t;
        z = midRef[si + 2] + (targetRef[si + 2] - midRef[si + 2]) * t;
      }

      bufArr[si]     = x;
      bufArr[si + 1] = y;
      bufArr[si + 2] = z;
    }

    const attr = geoRef.current.attributes.position as THREE.BufferAttribute;
    attr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[bufArr, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.027}
        transparent
        opacity={0.58}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Monolith — fades in as particles converge ───────────────────────────────

function Monolith({
  scrollY,
  assemblyProgress,
}: {
  scrollY: React.MutableRefObject<number>;
  assemblyProgress: React.MutableRefObject<number>;
}) {
  const meshRef    = useRef<THREE.Mesh>(null);
  const edgeRef    = useRef<THREE.Mesh>(null);
  const matRef     = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const p = assemblyProgress.current;

    // Reveal only when nearly assembled
    const bodyOpacity = Math.max(0, (p - 0.72) / 0.28);
    matRef.current.opacity = bodyOpacity;
    if (edgeMatRef.current) {
      edgeMatRef.current.opacity = bodyOpacity * 0.14;
    }

    // Float + slow rotation
    meshRef.current.position.y = Math.sin(t * 0.38) * 0.07;
    meshRef.current.rotation.y = t * 0.07;

    if (edgeRef.current) {
      edgeRef.current.position.y = meshRef.current.position.y;
      edgeRef.current.rotation.y = meshRef.current.rotation.y;
    }

    // Scroll parallax
    const scroll = scrollY.current;
    meshRef.current.position.z = -scroll * 0.002;
    meshRef.current.rotation.x = scroll * 0.0004;
  });

  return (
    <group>
      {/* Orbiting lavender key light */}
      <pointLight color="#808BC5" intensity={5} distance={9} decay={2} position={[0, 0.5, 2]} />
      {/* Sky rim */}
      <pointLight position={[-3.5, 1, -1]} color="#9ED6DF" intensity={1.8} distance={7} decay={2} />
      {/* Paper fill from below */}
      <pointLight position={[0, -3, 2]} color="#EAE4DA" intensity={0.6} distance={5} decay={2} />

      {/* Body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.82, 2.35, 0.16]} />
        <meshStandardMaterial
          ref={matRef}
          color="#0a0a0a"
          metalness={0.95}
          roughness={0.08}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Lavender wireframe edge */}
      <mesh ref={edgeRef}>
        <boxGeometry args={[0.84, 2.37, 0.18]} />
        <meshBasicMaterial
          ref={edgeMatRef}
          color="#808BC5"
          wireframe
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

// ─── Camera rig ──────────────────────────────────────────────────────────────

function CameraRig({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const baseY = 0.4;

  useEffect(() => {
    camera.position.set(0, baseY + 1.5, 9);
    gsap.to(camera.position, {
      z: 5.5,
      y: baseY,
      duration: 2.8,
      ease: "expo.out",
      delay: 0.1,
    });
  }, [camera, baseY]);

  useFrame(() => {
    const scroll = scrollY.current;
    camera.position.y = baseY - scroll * 0.0008;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Scene controller — drives assembly + interference from scroll ───────────

function SceneController({
  scrollY,
  assemblyProgress,
  interferenceIntensity,
}: {
  scrollY: React.MutableRefObject<number>;
  assemblyProgress: React.MutableRefObject<number>;
  interferenceIntensity: React.MutableRefObject<number>;
}) {
  useFrame(() => {
    const scroll = scrollY.current;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;

    // Assembly: starts 15% into scroll, completes 120vh later
    const raw = (scroll - vh * 0.15) / (vh * 1.05);
    const progress = Math.max(0, Math.min(1, raw));
    assemblyProgress.current = progress;

    // Interference fades as assembly progresses
    interferenceIntensity.current = Math.max(0.04, 1.0 - progress * 1.35);
  });

  return null;
}

// ─── Export ──────────────────────────────────────────────────────────────────

interface MonolithSceneProps {
  scrollY: React.MutableRefObject<number>;
}

export function MonolithScene({ scrollY }: MonolithSceneProps) {
  const assemblyProgress      = useRef(0);
  const interferenceIntensity = useRef(1.0);

  return (
    <Canvas
      shadows={false}
      camera={{ position: [0, 0.4, 5.5], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
      style={{ background: "transparent" }}
    >
      <color attach="background" args={["#1D1D1B"]} />
      <ambientLight intensity={0.08} />

      <SceneController
        scrollY={scrollY}
        assemblyProgress={assemblyProgress}
        interferenceIntensity={interferenceIntensity}
      />
      <CameraRig scrollY={scrollY} />

      <InterferenceBG intensity={interferenceIntensity} />

      {/* Three signal clouds — lavender, tea, sky */}
      <SignalCloud color="#808BC5" lane={-1} face={0} progress={assemblyProgress} />
      <SignalCloud color="#3d8a7a" lane={0}  face={1} progress={assemblyProgress} />
      <SignalCloud color="#9ED6DF" lane={1}  face={2} progress={assemblyProgress} />

      <Monolith scrollY={scrollY} assemblyProgress={assemblyProgress} />

      <fog attach="fog" args={["#1D1D1B", 10, 22]} />
    </Canvas>
  );
}
