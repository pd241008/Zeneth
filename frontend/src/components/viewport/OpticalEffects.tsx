'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export default function OpticalEffects() {
  const glassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!glassRef.current) return;

    const handleMouse = (e: MouseEvent) => {
      if (!glassRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      glassRef.current.style.background =
        `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,255,255,0.025) 0%, transparent 50%)`;
    };

    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none" style={{ isolation: 'isolate' }}>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      <div ref={glassRef} className="absolute inset-0 opacity-50" />

      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 120px rgba(255,0,0,0.04), inset 0 0 120px rgba(0,0,255,0.04)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  );
}
