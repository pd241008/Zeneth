'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 12000;

function Stars() {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    const siz = new Float32Array(STAR_COUNT);
    const radius = 800;
    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      const temp = Math.random();
      if (temp > 0.97) {
        col[i3] = 0.6 + Math.random() * 0.4;
        col[i3 + 1] = 0.5 + Math.random() * 0.3;
        col[i3 + 2] = 0.7 + Math.random() * 0.3;
      } else if (temp > 0.94) {
        col[i3] = 0.5 + Math.random() * 0.3;
        col[i3 + 1] = 0.6 + Math.random() * 0.4;
        col[i3 + 2] = 0.7 + Math.random() * 0.3;
      } else {
        const b = 0.4 + Math.random() * 0.6;
        col[i3] = b;
        col[i3 + 1] = b;
        col[i3 + 2] = b + Math.random() * 0.15;
      }

      siz[i] = 0.3 + Math.random() * 1.2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(siz, 1));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.008;
      ref.current.rotation.x += delta * 0.002;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={1.2}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Starfield() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 400], fov: 60 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
      >
        <Stars />
      </Canvas>
    </div>
  );
}
