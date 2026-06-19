'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const BAR_COUNT = 5;

export default function SignalStrength() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const bars = containerRef.current.querySelectorAll<HTMLElement>('.signal-bar');
    if (!bars.length) return;

    const anim = animate(bars, {
      opacity: [0.2, 1, 0.2],
      duration: 1800,
      loop: true,
      delay: stagger(160),
      ease: 'inOutSine',
      autoplay: true,
    });
    return () => { anim.cancel(); };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-mono text-cyan-400/50 uppercase tracking-wider mb-1.5">Signal</span>
      <div ref={containerRef} className="flex items-end gap-[2px] h-5">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            className="signal-bar w-[2.5px] bg-cyan-400/80 rounded-t-[1px]"
            style={{
              height: `${((i + 1) / BAR_COUNT) * 100}%`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}
