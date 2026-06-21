'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { animate, createMotionPath } from 'animejs';
import { motion, AnimatePresence } from 'framer-motion';
import { useObservatoryStore } from '@/store/observatoryStore';

const C = {
  void: '#05070D',
  nearField: '#0E1626',
  starlight: '#8FB4FF',
  brass: '#D9C28A',
  eyepieceWhite: '#F4F1EA',
  flare: '#FF6A39',
};

const VIEW = 400;
const CX = VIEW / 2;
const DIAL_R = 175;
const TICK_INNER_R = 152;
const TICK_SHORT_R = 160;
const TICK_LONG_R = 166;
const NUM_TICKS = 180;
const TICK_STEP_DEG = 360 / NUM_TICKS;

const ORBITAL_PATH_D = 'M 50,200 C 50,80 180,60 350,200';

function generateTicks() {
  const ticks: Array<{
    x1: number; y1: number; x2: number; y2: number; isLong: boolean;
  }> = [];
  for (let i = 0; i < NUM_TICKS; i++) {
    const angle = (i * TICK_STEP_DEG * Math.PI) / 180;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const isLong = i % 10 === 0;
    const outerR = isLong ? TICK_LONG_R : TICK_SHORT_R;
    ticks.push({
      x1: CX + TICK_INNER_R * sin,
      y1: CX - TICK_INNER_R * cos,
      x2: CX + outerR * sin,
      y2: CX - outerR * cos,
      isLong,
    });
  }
  return ticks;
}

interface OrbitDialProps {
  size?: 'hero' | 'compact';
  className?: string;
}

export default function OrbitDial({ size = 'hero', className = '' }: OrbitDialProps) {
  const telemetry = useObservatoryStore((s) => s.telemetry);
  const target = useObservatoryStore((s) => s.target);

  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isCompact = size === 'compact';
  const ticks = useMemo(() => generateTicks(), []);

  useEffect(() => {
    if (!pathRef.current || !dotRef.current) return;
    const mp = createMotionPath(pathRef.current);
    const anim = animate(dotRef.current, {
      translateX: mp.translateX,
      translateY: mp.translateY,
      duration: 8000,
      loop: true,
      easing: 'linear',
    });
    return () => { anim.cancel(); };
  }, []);

  const labelText = target
    ? `${target} · ${telemetry.altitude}km · ${(telemetry.range / 60).toFixed(2)}km/s`
    : '-- · ---km · --.--km/s';

  return (
    <>
      <style>{`
        .ot-ring { animation: ot-spin 150s linear infinite; transform-origin: ${CX}px ${CX}px; }
        @keyframes ot-spin { to { transform: rotate(-360deg); } }
      `}</style>
      <div
        className={`relative inline-flex items-center justify-center select-none ${
          isCompact ? 'w-[120px] h-[120px]' : 'w-full h-full'
        } ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <radialGradient id="aperture-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={C.nearField} />
              <stop offset="100%" stopColor={C.void} />
            </radialGradient>
            <filter id="og-filter">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={C.starlight} floodOpacity="0.6" />
            </filter>
            <filter id="dot-filter">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={C.starlight} floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Aperture */}
          <circle cx={CX} cy={CX} r={DIAL_R} fill="url(#aperture-grad)" />

          {/* Crescent highlight */}
          <path
            d={`M ${CX - 120},${CX - 110} A 130,130 0 0,1 ${CX + 110},${CX - 110}`}
            fill="none"
            stroke="white"
            strokeWidth={isCompact ? 3 : 8}
            strokeLinecap="round"
            opacity={0.15}
            style={{ mixBlendMode: 'screen', filter: 'blur(2px)' }}
          />

          {/* Tick marks (hover scale wrapper → counter-rotating inner) */}
          <g
            style={{
              transform: `scale(${isHovered ? 1.02 : 1})`,
              transition: 'transform 300ms ease',
              transformOrigin: `${CX}px ${CX}px`,
            }}
          >
            <g className="ot-ring">
              {ticks.map((tick, i) => (
                <line
                  key={i}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke={tick.isLong ? C.brass : C.starlight}
                  strokeOpacity={tick.isLong ? 0.6 : 0.15}
                  strokeWidth={tick.isLong ? 1 : 0.5}
                />
              ))}
            </g>
          </g>

          {/* Orbital trace path */}
          <path
            ref={pathRef}
            d={ORBITAL_PATH_D}
            fill="none"
            stroke={C.starlight}
            strokeWidth={1}
            strokeDasharray="4 6"
            strokeOpacity={0.3}
          />

          {/* Outer glow ring arcs removed to emphasize glass instead of HUD */}

          {/* Tracking dot */}
          <circle
            ref={dotRef}
            cx={0}
            cy={0}
            r={isCompact ? 2.5 : 4}
            fill={C.starlight}
            opacity={0.9}
            filter="url(#dot-filter)"
          />

          {/* Center reticle */}
          <line x1={CX - 8} y1={CX} x2={CX + 8} y2={CX} stroke={C.brass} strokeWidth={0.8} />
          <line x1={CX} y1={CX - 8} x2={CX} y2={CX + 8} stroke={C.brass} strokeWidth={0.8} />
          <circle cx={CX} cy={CX} r={2} fill={C.brass} opacity={0.5} />

          {/* Center label */}
          <AnimatePresence mode="wait">
            <motion.text
              key={labelText}
              x={CX}
              y={CX + 34}
              textAnchor="middle"
              fill={C.eyepieceWhite}
              fontSize={isCompact ? 5 : 10}
              fontFamily="Geist Mono, ui-monospace, monospace"
              style={{ fontVariantNumeric: 'tabular-nums' }}
              initial={{ opacity: 0, y: CX + 40 }}
              animate={{ opacity: 1, y: CX + 34 }}
              exit={{ opacity: 0, y: CX + 42 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {labelText}
            </motion.text>
          </AnimatePresence>
        </svg>
      </div>
    </>
  );
}
