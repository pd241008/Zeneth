'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import TelescopeFrame from '@/components/telescope/TelescopeFrame';
import Starfield from '@/components/viewport/Starfield';
import OpticalEffects from '@/components/viewport/OpticalEffects';
import EarthOrbitScene from '@/components/scenes/EarthOrbitScene';
import OrbitDial from '@/components/ui/OrbitDial';
import ScrollIntro from '@/components/viewport/ScrollIntro';

const C = {
  void: '#05070D',
};

export default function Home() {
  const { scrollYProgress: pageScroll } = useScroll();
  const frameOpacity = useTransform(pageScroll, [0.15, 0.45], [0, 1]);

  const maskRadius = useTransform(pageScroll, [0, 0.667], [200, 40], { clamp: true });
  const maskImage = useTransform(maskRadius, (r) =>
    `radial-gradient(circle at center, transparent 0%, transparent ${Math.max(0, r - 6)}%, black ${r + 2}%, black 100%)`,
  );
  const rimBg = useTransform(maskRadius, (r) => {
    const rBase = Math.max(0, r);
    return `radial-gradient(circle at center, 
      transparent 0%, 
      transparent ${Math.max(0, rBase - 8)}%, 
      rgba(5, 7, 13, 0.6) ${Math.max(0, rBase - 1)}%, 
      rgba(255, 50, 0, 0.1) ${rBase}%, 
      rgba(0, 120, 255, 0.1) ${rBase + 0.5}%, 
      ${C.void} ${rBase + 3}%, 
      ${C.void} 100%)`;
  });

  return (
    <main className="relative bg-[#010308]">
      {/* Starfield — fixed behind everything */}
      <div
        className="fixed inset-0 z-0"
        style={{
          borderRadius: '6% / 10%',
          overflow: 'hidden',
          filter: 'contrast(0.92) brightness(0.85)',
        }}
      >
        <Starfield />
      </div>

      {/* Scroll-intro starfield + parallax handoff */}
      <ScrollIntro />

      {/* Existing Orbit Dial screen — below scroll rig, seamless handoff */}
      <section className="relative z-10 h-screen bg-[#010308]">
        {/* Chromatic-aberration edge tint on starfield layer */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            borderRadius: '6% / 10%',
            boxShadow:
              'inset 0 0 180px rgba(255,0,0,0.04), inset 0 0 180px rgba(0,100,255,0.04), inset 0 0 300px rgba(0,0,0,0.3)',
          }}
        />

        {/* Mode scene overlays (orbit mode) */}
        <EarthOrbitScene />

        {/* Zoomed eyepiece view — dial centered, fills ~70% viewport */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div
            className="relative pointer-events-auto"
            style={{
              width: 'min(70vh, 90vw)',
              height: 'min(70vh, 90vw)',
            }}
          >
            <OrbitDial size="hero" />
          </div>
        </div>

        {/* Optical effects — glass reflection, film grain */}
        <OpticalEffects />
      </section>

      {/* TelescopeFrame — fixed, fades in over scroll */}
      <motion.div style={{ opacity: frameOpacity }}>
        <TelescopeFrame />
      </motion.div>

      {/* Eyepiece optical mask — hard-edged circular cutout, scroll-driven radius, above everything */}
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          background: rimBg,
        }}
      />
    </main>
  );
}
