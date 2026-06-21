'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import OrbitDial from '@/components/ui/OrbitDial';
import Horizon from '@/components/viewport/Horizon';
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

  const fadeOut = useTransform(scrollYProgress, [0.7, 1], [1, 0]);
  const dialOpacity = useTransform(scrollYProgress, [0.25, 0.65], [0, 1]);
  const dialScale = useTransform(scrollYProgress, [0.25, 0.65], [0.85, 1]);

  const deepY = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const midS = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const foreY = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const foreBlurV = useTransform(scrollYProgress, [0, 1], [0, 4]);
  const foreF = useTransform(foreBlurV, (b) => `blur(${b}px)`);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '300vh', zIndex: 5 }}
    >
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: C.void }}>

        {/* Sky-to-horizon gradient — atmosphere thins toward horizon */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${C.nearField}15 55%, ${C.nearField}50 80%, ${C.nearField}70 100%)`,
            ...(prefersReducedMotion
              ? { opacity: fadeOut }
              : { translateY: deepY, opacity: fadeOut }
            ),
          }}
        />

        {/* DeepStars — tiny, dense, near-static, fade out approaching horizon */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            ...horizonMask,
            ...(prefersReducedMotion
              ? { opacity: fadeOut }
              : { translateY: deepY, opacity: fadeOut }
            ),
          }}
        >
          <Stars stars={layers[0].stars} />
        </motion.div>

        {/* MidStars — brighter, moderate drift, subtle scale-up */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            ...horizonMask,
            ...(prefersReducedMotion
              ? { opacity: fadeOut }
              : { translateY: midY, scale: midS, opacity: fadeOut }
            ),
          }}
        >
          <Stars stars={layers[1].stars} />
        </motion.div>

        {/* ForegroundMotes — large blurred specks, fast drift */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            ...horizonMask,
            ...(prefersReducedMotion
              ? { opacity: fadeOut }
              : { translateY: foreY, filter: foreF, opacity: fadeOut }
            ),
          }}
        >
          <Stars stars={layers[2].stars} />
        </motion.div>

        {/* Horizon — mountain ridgeline silhouette with warm glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={
            prefersReducedMotion
              ? { opacity: fadeOut }
              : { translateY: midY, scale: midS, opacity: fadeOut }
          }
        >
          <Horizon />
        </motion.div>

        {/* OrbitDial — resolves into focus */}
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
