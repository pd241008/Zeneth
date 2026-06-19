'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export default function CalibrationMarker() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotRef.current) return;
    const anim = animate(dotRef.current, {
      translateX: [-1, 1, -1],
      duration: 2000,
      loop: true,
      ease: 'inOutSine',
      autoplay: true,
    });
    return () => { anim.cancel(); };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-cyan-400/50 uppercase tracking-wider">Cal</span>
      <div className="relative w-4 h-4 flex items-center">
        <div className="absolute w-3 h-3 rounded-full border border-cyan-400/30" />
        <div ref={dotRef} className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_4px_rgba(0,255,255,0.4)]" />
      </div>
    </div>
  );
}
