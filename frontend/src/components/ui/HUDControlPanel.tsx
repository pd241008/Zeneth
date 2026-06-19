'use client';

// Placeholder HUD Control Panel component
export default function HUDControlPanel() {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 text-white font-mono shadow-[0_0_15px_rgba(168,85,247,0.2)]">
      <div className="flex flex-col gap-3">
        <div className="text-purple-400 font-bold uppercase text-xs tracking-widest border-b border-purple-500/30 pb-2 mb-2">
          Zenith Control Panel
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Search Location</span>
          </div>
          <div className="h-4 w-px bg-slate-600"></div>
          <button className="hover:text-cyan-400 transition-colors">Satellites</button>
          <button className="hover:text-cyan-400 transition-colors">Planets</button>
          <button className="hover:text-cyan-400 transition-colors">Constellations</button>
          <button className="text-cyan-400 font-bold">ISS</button>
        </div>

        <div className="bg-slate-900/50 rounded p-2 text-xs border border-slate-700/50 mt-2 flex justify-between">
          <span>Selected Object: ISS</span>
          <span>Altitude: 408 km</span>
          <span>Velocity: 7.66 km/s</span>
        </div>
      </div>
    </div>
  );
}
