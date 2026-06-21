'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarLayerConfig {
  count: number;
  radius: number;
  baseSize: number;
  opacity: number;
  rotationSpeed: { y: number; x: number };
  colorTint: [number, number, number];
}

const LAYERS: StarLayerConfig[] = [
  { count: 8000, radius: 1000, baseSize: 0.8, opacity: 0.5, rotationSpeed: { y: 0.003, x: 0.001 }, colorTint: [0.7, 0.75, 1.0] },
  { count: 4000, radius: 600, baseSize: 1.4, opacity: 0.7, rotationSpeed: { y: 0.008, x: 0.003 }, colorTint: [0.85, 0.85, 1.0] },
  { count: 800, radius: 300, baseSize: 2.5, opacity: 0.85, rotationSpeed: { y: 0.02, x: -0.005 }, colorTint: [1.0, 0.95, 1.0] },
];

function seededRandom(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

function generateStarData(config: StarLayerConfig, seed: number) {
  const rand = seededRandom(seed);
  const pos = new Float32Array(config.count * 3);
  const col = new Float32Array(config.count * 3);
  const siz = new Float32Array(config.count);
  const [tr, tg, tb] = config.colorTint;

  for (let i = 0; i < config.count; i++) {
    const i3 = i * 3;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = config.radius * Math.cbrt(rand());
    pos[i3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i3 + 2] = r * Math.cos(phi);

    const temp = rand();
    if (temp > 0.97) {
      col[i3] = tr * (0.6 + rand() * 0.4);
      col[i3 + 1] = tg * (0.5 + rand() * 0.3);
      col[i3 + 2] = tb * (0.7 + rand() * 0.3);
    } else if (temp > 0.94) {
      col[i3] = tr * (0.5 + rand() * 0.3);
      col[i3 + 1] = tg * (0.6 + rand() * 0.4);
      col[i3 + 2] = tb * (0.7 + rand() * 0.3);
    } else {
      const b = 0.4 + rand() * 0.6;
      col[i3] = tr * b;
      col[i3 + 1] = tg * b;
      col[i3 + 2] = tb * b + rand() * 0.15;
    }
    siz[i] = config.baseSize * (0.3 + rand() * 1.2);
  }
  return { pos, col, siz };
}

function StarLayer({ config, seed }: { config: StarLayerConfig; seed: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const { pos, col, siz } = generateStarData(config, seed);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(siz, 1));
    return geo;
  }, [config, seed]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * config.rotationSpeed.y;
      ref.current.rotation.x += delta * config.rotationSpeed.x;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={config.baseSize * 0.8}
        vertexColors
        transparent
        opacity={config.opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const SEEDS = LAYERS.map((_, i) => i * 7919 + 1);

export default function Starfield() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 500], fov: 60 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
      >
        {LAYERS.map((config, i) => (
          <StarLayer key={i} config={config} seed={SEEDS[i]} />
        ))}
      </Canvas>
    </div>
  );
}
