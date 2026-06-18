import CesiumGlobe from '@/components/3d/CesiumGlobe';
import HUDControlPanel from '@/components/ui/HUDControlPanel';

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Starfield Layer Placeholder */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-black opacity-80 pointer-events-none"></div>
      
      {/* 3D Globe Layer */}
      <div className="absolute inset-0 z-10 p-8 pb-32">
        <CesiumGlobe />
      </div>

      {/* HUD Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <HUDControlPanel />
        </div>
      </div>
    </main>
  );
}
