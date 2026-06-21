'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import OrbitDial from '@/components/ui/OrbitDial';
import Horizon from '@/components/viewport/Horizon';
import TelescopeSilhouette from '@/components/viewport/TelescopeSilhouette';
import { generateStarLayers } from '@/lib/starData';

const C = {
  void: '#05070D',
  nearField: '#0E1626',
};

const horizonMask = {
  WebkitMaskImage:
    'linear-gradient(to bottom, black 0%, black 54%, transparent 63%, transparent 100%)',
  maskImage:
    'linear-gradient(to bottom, black 0%, black 54%, transparent 63%, transparent 100%)',
};

function Stars({ stars }: { stars: Array<{ x: number; y: number; size: number; opacity: number }> }) {
  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x * 100}%`,
            top: `${s.y * 100}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </>
  );
}

export default function ScrollIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const layers = useMemo(() => generateStarLayers(), []);

  // Dial fades in at the end of the zoom
  const dialOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const dialScale = useTransform(scrollYProgress, [0.45, 0.65], [0.85, 1]);

  // Subtle parallax drift for stars/horizon within the scene
  const deepY = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const midS = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const foreY = useTransform(scrollYProgress, [0, 1], [0, -35]);

  // Scene Zoom: scales the entire scene (stars + horizon + telescope)
  // Anchored at the telescope eyepiece (40% x, 65% y).
  const sceneScale = useTransform(scrollYProgress, [0, 0.65], [1, 40]);
  const sceneOpacity = useTransform(scrollYProgress, [0.55, 0.667], [1, 0]);
  const sceneX = useTransform(scrollYProgress, [0, 0.65], ['0vw', '10vw']); // move 40vw center to 50vw
  const sceneY = useTransform(scrollYProgress, [0, 0.65], ['0vh', '-15vh']); // move 65vh center to 50vh

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '300vh', zIndex: 5 }}
    >
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: C.void }}>

        {/* The entire optical scene group */}
        <motion.div
          className="absolute inset-0 origin-[40vw_65vh]"
          style={
            prefersReducedMotion
              ? { opacity: sceneOpacity }
              : { scale: sceneScale, x: sceneX, y: sceneY, opacity: sceneOpacity }
          }
        >
          {/* Sky-to-horizon gradient — atmosphere thins toward horizon */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${C.nearField}15 55%, ${C.nearField}50 80%, ${C.nearField}70 100%)`,
              translateY: prefersReducedMotion ? 0 : deepY,
            }}
          />

          {/* DeepStars — tiny, dense, near-static */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              ...horizonMask,
              translateY: prefersReducedMotion ? 0 : deepY,
            }}
          >
            <Stars stars={layers[0].stars} />
          </motion.div>

          {/* MidStars — brighter, moderate drift */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              ...horizonMask,
              translateY: prefersReducedMotion ? 0 : midY,
              scale: prefersReducedMotion ? 1 : midS,
            }}
          >
            <Stars stars={layers[1].stars} />
          </motion.div>

          {/* ForegroundMotes — large blurred specks, fast drift */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              ...horizonMask,
              translateY: prefersReducedMotion ? 0 : foreY,
            }}
          >
            <Stars stars={layers[2].stars} />
          </motion.div>

          {/* Horizon — mountain ridgeline silhouette with warm glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              translateY: prefersReducedMotion ? 0 : midY,
              scale: prefersReducedMotion ? 1 : midS,
            }}
          >
            <Horizon />
          </motion.div>

          {/* Telescope Silhouette — Huge, foreground anchor */}
          {/* Eyepiece target is at 40vw, 65vh */}
          <div 
            className="absolute pointer-events-none"
            style={{
              left: '40vw',
              top: '65vh',
            }}
          >
            <TelescopeSilhouette 
              className="absolute"
              style={{
                width: '120vw',
                minWidth: '1000px',
                height: 'auto',
                // Offset SVG so eyepiece (at 50%, 37.5% of SVG) sits exactly at 0,0 of this wrapper
                transform: 'translate(-50%, -37.5%)',
                // Subtle vignette/drop-shadow behind the telescope to separate it from the background
                filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.8)) drop-shadow(0 0 100px rgba(0,0,0,0.6))',
              }} 
            />
          </div>
        </motion.div>

        {/* OrbitDial — resolves into focus inside the eyepiece */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          style={
            prefersReducedMotion
              ? { opacity: dialOpacity }
              : { opacity: dialOpacity, scale: dialScale }
          }
        >
          <div
            style={{
              width: 'min(70vh, 90vw)',
              height: 'min(70vh, 90vw)',
            }}
          >
            <OrbitDial size="hero" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
