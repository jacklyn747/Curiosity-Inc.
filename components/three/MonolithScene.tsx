"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";

// Particle field floating around the monolith
function Particles({ count = 600 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pos[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(phi) * 2.5;
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.035;
    mesh.current.rotation.x = Math.sin(t * 0.018) * 0.06;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#808BC5"
        size={0.025}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Secondary faint particles (white)
function AmbientParticles({ count = 300 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.getElapsedTime() * -0.012;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#EAE4DA"
        size={0.012}
        transparent
        opacity={0.18}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// The Monolith
function Monolith({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.Mesh>(null);
  const orbitLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Float
    meshRef.current.position.y = Math.sin(t * 0.38) * 0.07;

    // Slow Y rotation
    meshRef.current.rotation.y = t * 0.07;

    // Sync edge wireframe
    if (edgeRef.current) {
      edgeRef.current.position.y = meshRef.current.position.y;
      edgeRef.current.rotation.y = meshRef.current.rotation.y;
    }

    // Orbiting gold light
    if (orbitLightRef.current) {
      orbitLightRef.current.position.x = Math.sin(t * 0.45) * 2.5;
      orbitLightRef.current.position.z = Math.cos(t * 0.45) * 2.5;
      orbitLightRef.current.position.y = Math.sin(t * 0.3) * 1.2;
    }

    // Scroll parallax
    const scroll = scrollY.current;
    meshRef.current.position.z = -scroll * 0.002;
    meshRef.current.rotation.x = scroll * 0.0004;
  });

  return (
    <group>
      {/* Orbiting lavender light */}
      <pointLight ref={orbitLightRef} color="#808BC5" intensity={5} distance={9} decay={2} />

      {/* Cool sky rim light (fixed) */}
      <pointLight position={[-3.5, 1, -1]} color="#9ED6DF" intensity={1.8} distance={7} decay={2} />

      {/* Faint paper fill from below */}
      <pointLight position={[0, -3, 2]} color="#EAE4DA" intensity={0.6} distance={5} decay={2} />

      {/* Monolith body */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.82, 2.35, 0.16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.95}
          roughness={0.08}
        />
      </mesh>

      {/* Lavender wireframe edge — slightly larger */}
      <mesh ref={edgeRef}>
        <boxGeometry args={[0.84, 2.37, 0.18]} />
        <meshBasicMaterial
          color="#808BC5"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

// Subtle ground plane for reflection
function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#1D1D1B" metalness={0.6} roughness={0.3} transparent opacity={0.8} />
    </mesh>
  );
}

// Camera entry animation + scroll tracking
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

interface MonolithSceneProps {
  scrollY: React.MutableRefObject<number>;
}

export function MonolithScene({ scrollY }: MonolithSceneProps) {
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
      {/* Scene background — explicit dark */}
      <color attach="background" args={["#1D1D1B"]} />

      <ambientLight intensity={0.08} />

      <CameraRig scrollY={scrollY} />
      <Monolith scrollY={scrollY} />
      <Particles />
      <AmbientParticles />
      <GroundPlane />

      {/* Short fog so far edges fade to dark */}
      <fog attach="fog" args={["#1D1D1B", 10, 22]} />
    </Canvas>
  );
}
