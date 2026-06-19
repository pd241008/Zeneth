'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { useObservatoryStore } from '@/store/observatoryStore';

const BREATH_DURATION = 3000;
const TICK_EXTEND_DURATION = 200;

export default function Crosshairs() {
  const crosshairRef = useRef<HTMLDivElement>(null);
  const rangeRingRef = useRef<SVGCircleElement>(null);
  const innerRingRef = useRef<SVGCircleElement>(null);
  const ticksRef = useRef<Array<SVGLineElement>>([]);
  const { trackingStatus } = useObservatoryStore();

  useEffect(() => {
    if (!crosshairRef.current) return;
    const breath = animate(crosshairRef.current, {
      scale: [1, 1.02, 1],
      duration: BREATH_DURATION,
      loop: true,
      ease: 'inOutQuad',
      autoplay: true,
    });
    return () => { breath.cancel(); };
  }, []);

  useEffect(() => {
    if (!rangeRingRef.current) return;
    if (trackingStatus === 'locked') {
      const tl = animate(rangeRingRef.current, {
        r: [45, 12],
        opacity: [0.4, 0.9],
        stroke: ['rgba(0,255,255,0.4)', 'rgba(0,255,255,0.9)'],
        duration: 500,
        ease: 'outElastic(1, 0.4)',
        autoplay: true,
      });
      return () => { tl.cancel(); };
    } else {
      const anim = animate(rangeRingRef.current, {
        r: 45,
        opacity: 0.4,
        duration: 300,
        ease: 'outQuad',
        autoplay: true,
      });
      return () => { anim.cancel(); };
    }
  }, [trackingStatus]);

  const setTickRef = (el: SVGLineElement | null, i: number) => {
    if (el) ticksRef.current[i] = el;
  };

  return (
    <div
      ref={crosshairRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <svg viewBox="0 0 100 100" className="w-28 h-28 md:w-32 md:h-32 overflow-visible" fill="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="50" cy="50" r="45"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.4"
        />

        <circle
          ref={rangeRingRef}
          cx="50" cy="50" r="45"
          stroke="rgba(0,255,255,0.4)"
          strokeWidth="0.6"
          filter="url(#glow)"
        />

        <circle
          ref={innerRingRef}
          cx="50" cy="50" r="30"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
          strokeDasharray="2 4"
        />

        <line ref={(el) => setTickRef(el, 0)} x1="50" y1="0" x2="50" y2="7" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
        <line ref={(el) => setTickRef(el, 1)} x1="50" y1="93" x2="50" y2="100" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
        <line ref={(el) => setTickRef(el, 2)} x1="0" y1="50" x2="7" y2="50" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
        <line ref={(el) => setTickRef(el, 3)} x1="93" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />

        <circle cx="50" cy="50" r="0.8" fill="rgba(0,255,255,0.6)" filter="url(#glow)" />
      </svg>
    </div>
  );
}
