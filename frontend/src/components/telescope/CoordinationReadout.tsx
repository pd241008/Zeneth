'use client';

import { useEffect, useState } from 'react';
import { useObservatoryStore } from '@/store/observatoryStore';

export default function CoordinationReadout() {
  const telemetry = useObservatoryStore((s) => s.telemetry);
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toISOString().slice(11, 19) + ' UTC',
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <div className="flex items-baseline gap-1.5">
        <span className="text-[10px] font-mono text-white/30 uppercase">RA</span>
        <span className="text-xs font-mono text-white/70 tabular-nums">{telemetry.ra}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[10px] font-mono text-white/30 uppercase">DEC</span>
        <span className="text-xs font-mono text-white/70 tabular-nums">{telemetry.dec}</span>
      </div>
      <div className="w-px h-3 bg-white/10" />
      <span className="text-xs font-mono text-white/40 tabular-nums">{time}</span>
      <span className="text-[10px] font-mono text-cyan-400/40 tracking-wider">STANDBY</span>
    </div>
  );
}
