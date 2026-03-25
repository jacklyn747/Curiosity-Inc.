// src/tests/useParticleTargets.test.ts
import { renderHook } from '@testing-library/react';
import { useParticleTargets } from '../hooks/useParticleTargets';

const PARTICLE_COUNT = 800;
const ARRAY_LENGTH = PARTICLE_COUNT * 3; // x, y, z per particle

describe('useParticleTargets', () => {
  it('returns 4 position target arrays each with correct length', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    expect(result.current.targets).toHaveLength(4);
    result.current.targets.forEach((t) => {
      expect(t).toBeInstanceOf(Float32Array);
      expect(t.length).toBe(ARRAY_LENGTH);
    });
  });

  it('returns a single color array with correct length', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    expect(result.current.colors).toBeInstanceOf(Float32Array);
    expect(result.current.colors.length).toBe(ARRAY_LENGTH);
  });

  it('stage 0 (scattered) positions are within radius 4', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const scattered = result.current.targets[0];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = scattered[i * 3];
      const y = scattered[i * 3 + 1];
      const z = scattered[i * 3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);
      expect(dist).toBeLessThanOrEqual(4.01); // 0.01 float tolerance
    }
  });

  it('stage 3 (sphere cluster) positions are approximately on sphere of radius 1.8', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const sphere = result.current.targets[3];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = sphere[i * 3];
      const y = sphere[i * 3 + 1];
      const z = sphere[i * 3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);
      expect(dist).toBeCloseTo(1.8, 1); // within 0.1 of target radius
    }
  });

  it('first particle color is Teal (#3A9EA4 → ~0.23, 0.62, 0.64 normalized)', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const colors = result.current.colors;
    // Teal: R=0x3A=58 → 58/255≈0.227, G=0x9E=158 → 158/255≈0.620, B=0xA4=164 → 164/255≈0.643
    expect(colors[0]).toBeCloseTo(58 / 255, 2);
    expect(colors[1]).toBeCloseTo(158 / 255, 2);
    expect(colors[2]).toBeCloseTo(164 / 255, 2);
  });

  it('last particle color is Pink (#F72658 → ~0.97, 0.15, 0.35 normalized)', () => {
    const { result } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const colors = result.current.colors;
    const last = (PARTICLE_COUNT - 1) * 3;
    // Pink: R=0xF7=247 → 247/255≈0.969, G=0x26=38 → 38/255≈0.149, B=0x58=88 → 88/255≈0.345
    expect(colors[last]).toBeCloseTo(247 / 255, 2);
    expect(colors[last + 1]).toBeCloseTo(38 / 255, 2);
    expect(colors[last + 2]).toBeCloseTo(88 / 255, 2);
  });

  it('returns stable references across re-renders (memoized)', () => {
    const { result, rerender } = renderHook(() => useParticleTargets(PARTICLE_COUNT));
    const first = result.current;
    rerender();
    expect(result.current.targets).toBe(first.targets);
    expect(result.current.colors).toBe(first.colors);
  });
});
