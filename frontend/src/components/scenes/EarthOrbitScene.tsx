'use client';

import { useRef } from 'react';
import { useObservatoryStore } from '@/store/observatoryStore';
import OrbitDial from '@/components/ui/OrbitDial';

interface Satellite {
  id: string;
  name: string;
  altitude: number;
  lat: number;
  lng: number;
  orbitTilt: number;
  orbitPhase: number;
}

const SATELLITES: Satellite[] = [
  { id: 'iss', name: 'ISS', altitude: 408, lat: 0, lng: 0, orbitTilt: 51.6, orbitPhase: 0 },
  { id: 'hst', name: 'HST', altitude: 540, lat: 0, lng: 120, orbitTilt: 28.5, orbitPhase: 90 },
  { id: 'tss-1', name: 'TSS-1', altitude: 320, lat: 0, lng: 240, orbitTilt: 97.4, orbitPhase: 180 },
];

function SatelliteDot({ sat }: { sat: Satellite }) {
  return (
    <div
      className="absolute w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${((sat.lng + 180) / 360) * 100}%`,
        top: `${((90 - sat.lat) / 180) * 100}%`,
      }}
    >
      <div className="w-full h-full rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(0,255,255,0.6)]" />
    </div>
  );
}

export default function EarthOrbitScene() {
  const mode = useObservatoryStore((s) => s.mode);
  const sceneRef = useRef<HTMLDivElement>(null);

  if (mode !== 'orbit') return null;

  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 z-10"
      style={{
        background: 'radial-gradient(ellipse at center, #0a1628 0%, #040a18 50%, #010308 100%)',
      }}
    >
      <div className="absolute inset-[15%] rounded-full border border-cyan-500/5 flex items-center justify-center">
        <div className="w-[80%] h-[80%] rounded-full border border-cyan-500/10 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent blur-xl" />
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/15 to-cyan-400/5" />
        </div>
      </div>

      {SATELLITES.map((sat) => (
        <SatelliteDot key={sat.id} sat={sat} />
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <span className="text-[10px] font-mono text-cyan-400/40 tracking-wider">
          EARTH OBSERVATION MODE — {SATELLITES.length} TRACKED OBJECTS
        </span>
      </div>

      {/* Compact OrbitDial as corner HUD readout */}
      <div className="absolute bottom-28 right-8 z-20">
        <OrbitDial size="compact" />
      </div>
    </div>
  );
}
