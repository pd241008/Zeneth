'use client';

import Crosshairs from './Crosshairs';
import Rangefinder from './Rangefinder';
import ApertureRing from './ApertureRing';
import FocusIndicator from './FocusIndicator';
import TrackingStatus from './TrackingStatus';
import SignalStrength from './SignalStrength';
import CalibrationMarker from './CalibrationMarker';
import CoordinationReadout from './CoordinationReadout';
import { useObservatoryStore } from '@/store/observatoryStore';

const modeLensLabels: Record<string, string> = {
  orbit: 'ORBIT LENS',
  stellar: 'STELLAR LENS',
  survey: 'SURVEY LENS',
};

export default function TelescopeFrame() {
  const mode = useObservatoryStore((s) => s.mode);
  const power = useObservatoryStore((s) => s.power);

  if (!power) return null;

  return (
    <>
      {/* Crosshairs - centered */}
      <Crosshairs />

      {/* Left Rail - Focus & Range */}
      <nav
        className="fixed left-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-7"
        aria-label="Telescope focus and range controls"
      >
        <FocusIndicator />
        <div className="w-4 h-px bg-white/5" />
        <Rangefinder />
        <div className="w-4 h-px bg-white/5" />
        <CalibrationMarker />
      </nav>

      {/* Right Rail - Mode & Status */}
      <nav
        className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-7"
        aria-label="Telescope mode and status"
      >
        <ApertureRing />
        <div className="w-4 h-px bg-white/5" />
        <TrackingStatus />
        <div className="w-4 h-px bg-white/5" />
        <SignalStrength />
      </nav>

      {/* Top Bar - Coordinates & Time */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-40">
        <div className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/[0.04]">
          <CoordinationReadout />
        </div>
      </header>

      {/* Bottom Bar - Identity & State */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <div className="px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/[0.04] flex items-center gap-5">
          <span className="text-sm font-bold tracking-[0.35em] text-white/80">ZENITH</span>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-[10px] font-mono text-cyan-400/70 tracking-wider">
            {modeLensLabels[mode]}
          </span>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(0,255,0,0.4)]" />
            <span className="text-[10px] font-mono text-green-400/70">ACTIVE</span>
          </div>
        </div>
      </footer>
    </>
  );
}
