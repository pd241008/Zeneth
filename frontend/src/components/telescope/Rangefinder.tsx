'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { useObservatoryStore } from '@/store/observatoryStore';

const unitMap = {
  orbit: 'km',
  stellar: 'ly',
  survey: 'AU',
};

export default function Rangefinder() {
  const valueRef = useRef<HTMLSpanElement>(null);
  const mode = useObservatoryStore((s) => s.mode);
  const range = useObservatoryStore((s) => s.telemetry.range);
  const unit = unitMap[mode];

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;
    const obj = { value: parseInt(el.dataset.prev || '0') };
    const anim = animate(obj, {
      value: range,
      round: true,
      duration: 400,
      ease: 'outCubic',
      onUpdate: () => {
        if (valueRef.current) {
          valueRef.current.textContent = obj.value.toString();
          valueRef.current.dataset.prev = obj.value.toString();
        }
      },
    });
    return () => {
      anim.cancel();
      if (el) {
        el.dataset.prev = range.toString();
      }
    };
  }, [range]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-mono text-cyan-400/50 uppercase tracking-wider">Range</span>
      <div className="flex items-baseline gap-1">
        <span
          ref={valueRef}
          data-prev={range}
          className="text-xl md:text-2xl font-mono text-cyan-300 tabular-nums leading-none"
        >
          {range}
        </span>
        <span className="text-[10px] font-mono text-cyan-400/50">{unit}</span>
      </div>
    </div>
  );
}
