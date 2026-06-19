'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { useObservatoryStore } from '@/store/observatoryStore';

export default function FocusIndicator() {
  const markerRef = useRef<HTMLDivElement>(null);
  const focus = useObservatoryStore((s) => s.focus);

  useEffect(() => {
    if (!markerRef.current) return;
    const top = (1 - focus) * 100;
    const anim = animate(markerRef.current, {
      top: `${top}%`,
      duration: 400,
      ease: 'outCubic',
      autoplay: true,
    });
    return () => { anim.cancel(); };
  }, [focus]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-mono text-cyan-400/50 uppercase tracking-wider">Focus</span>
      <div className="relative w-0.5 h-20 md:h-28 bg-white/[0.06] rounded-full mt-2.5">
        <div
          ref={markerRef}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.5)]"
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-cyan-400/10 to-transparent rounded-full" />
      </div>
    </div>
  );
}
