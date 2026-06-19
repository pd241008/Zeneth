'use client';

import { useObservatoryStore } from '@/store/observatoryStore';

const statusConfig = {
  idle: { color: 'bg-yellow-400/80', label: 'IDLE', shadow: 'shadow-[0_0_6px_rgba(255,200,0,0.3)]' },
  scanning: { color: 'bg-cyan-400', label: 'SCAN', shadow: 'shadow-[0_0_8px_rgba(0,255,255,0.4)]' },
  locked: { color: 'bg-green-400', label: 'LOCK', shadow: 'shadow-[0_0_10px_rgba(0,255,0,0.5)]' },
};

export default function TrackingStatus() {
  const trackingStatus = useObservatoryStore((s) => s.trackingStatus);
  const config = statusConfig[trackingStatus];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-2 h-2 rounded-full ${config.color} ${config.shadow} ${
          trackingStatus === 'scanning' ? 'animate-pulse' : ''
        }`}
      />
      <span className="text-[11px] font-mono text-white/70 tracking-wider">{config.label}</span>
    </div>
  );
}
