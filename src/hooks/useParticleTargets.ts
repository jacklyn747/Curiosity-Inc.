// src/hooks/useParticleTargets.ts
import { useMemo } from 'react';

// Brand colors normalized to 0–1 for Three.js vertexColors
const TEAL   = [58 / 255, 158 / 255, 164 / 255];  // #3A9EA4
const ORANGE = [250 / 255, 119 / 255, 20 / 255];  // #FA7714
const PINK   = [247 / 255, 38 / 255, 88 / 255];   // #F72658

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function buildScattered(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(2 * ((i * 0.618033988749895) % 1) - 1);
    const phi = 2 * Math.PI * ((i * 0.381966011250105) % 1);
    const r = 4 * Math.cbrt((i + 0.5) / count);
    arr[i * 3]     = r * Math.sin(theta) * Math.cos(phi);
    arr[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    arr[i * 3 + 2] = r * Math.cos(theta);
  }
  return arr;
}

function buildFibonacciDisc(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(i / count) * 3;
    const theta = i * goldenAngle;
    arr[i * 3]     = r * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(theta);
    arr[i * 3 + 2] = 0;
  }
  return arr;
}

function buildFlowerOfLife(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const radius = 2;
  const centers = [
    [0, 0],
    ...Array.from({ length: 6 }, (_, i) => [
      radius * Math.cos((i * Math.PI) / 3),
      radius * Math.sin((i * Math.PI) / 3),
    ]),
  ];
  const perCircle = Math.floor(count / 7);
  let idx = 0;
  for (let c = 0; c < 7; c++) {
    const [cx, cy] = centers[c];
    const circleCount = c < 6 ? perCircle : count - idx;
    for (let i = 0; i < circleCount; i++) {
      const angle = (i / circleCount) * 2 * Math.PI;
      arr[idx * 3]     = cx + radius * Math.cos(angle);
      arr[idx * 3 + 1] = cy + radius * Math.sin(angle);
      arr[idx * 3 + 2] = 0;
      idx++;
    }
  }
  return arr;
}

function buildSphereCluster(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const R = 1.8;
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    arr[i * 3]     = R * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = R * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = R * Math.cos(phi);
  }
  return arr;
}

function buildColors(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const mid = count / 2;
  for (let i = 0; i < count; i++) {
    let r: number, g: number, b: number;
    if (i < mid) {
      const t = i / mid;
      r = lerp(TEAL[0], ORANGE[0], t);
      g = lerp(TEAL[1], ORANGE[1], t);
      b = lerp(TEAL[2], ORANGE[2], t);
    } else {
      const t = (i - mid) / (count - mid);
      r = lerp(ORANGE[0], PINK[0], t);
      g = lerp(ORANGE[1], PINK[1], t);
      b = lerp(ORANGE[2], PINK[2], t);
    }
    arr[i * 3]     = r;
    arr[i * 3 + 1] = g;
    arr[i * 3 + 2] = b;
  }
  return arr;
}

export function useParticleTargets(count: number = 800) {
  return useMemo(() => ({
    targets: [
      buildScattered(count),
      buildFibonacciDisc(count),
      buildFlowerOfLife(count),
      buildSphereCluster(count),
    ],
    colors: buildColors(count),
  }), [count]);
}
