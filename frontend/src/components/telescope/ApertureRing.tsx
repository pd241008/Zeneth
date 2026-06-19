'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { useObservatoryStore, type ObservatoryMode } from '@/store/observatoryStore';

const modeAngles: Record<ObservatoryMode, number> = {
  orbit: 0,
  stellar: 120,
  survey: 240,
};

const modeLabels: Record<ObservatoryMode, string> = {
  orbit: 'ORBIT',
  stellar: 'STELLAR',
  survey: 'SURVEY',
};

const modeSub: Record<ObservatoryMode, string> = {
  orbit: 'EARTH',
  stellar: 'DEEP SPACE',
  survey: 'SOLAR',
};

const modeColors: Record<ObservatoryMode, string> = {
  orbit: 'text-cyan-400',
  stellar: 'text-purple-400',
  survey: 'text-amber-400',
};

export default function ApertureRing() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const mode = useObservatoryStore((s) => s.mode);
  const cycleMode = useObservatoryStore((s) => s.cycleMode);

  useEffect(() => {
    if (!wheelRef.current) return;
    const anim = animate(wheelRef.current, {
      rotate: modeAngles[mode],
      duration: 600,
      ease: 'outElastic(1, 0.6)',
      autoplay: true,
    });
    return () => { anim.cancel(); };
  }, [mode]);

  return (
    <div
      className="flex flex-col items-center cursor-pointer select-none group"
      onClick={cycleMode}
      title="Click to change mode"
    >
      <div ref={wheelRef} className="w-8 h-8 md:w-10 md:h-10 relative mb-1.5">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="0.6" strokeDasharray="2 4" />
          {[0, 120, 240].map((angle) => (
            <line
              key={angle}
              x1="20"
              y1="20"
              x2={20 + 15 * Math.sin((angle * Math.PI) / 180)}
              y2={20 - 15 * Math.cos((angle * Math.PI) / 180)}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.4"
            />
          ))}
        </svg>
        <div
          className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,255,255,0.5)]"
        />
      </div>
      <span className={`text-[10px] font-mono tracking-wider ${modeColors[mode]}`}>
        {modeLabels[mode]}
      </span>
      <span className="text-[8px] font-mono text-white/30 tracking-wider">{modeSub[mode]}</span>
    </div>
  );
}
