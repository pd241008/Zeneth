'use client';

import TelescopeFrame from '@/components/telescope/TelescopeFrame';
import Starfield from '@/components/viewport/Starfield';
import OpticalEffects from '@/components/viewport/OpticalEffects';
import EarthOrbitScene from '@/components/scenes/EarthOrbitScene';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#010308]">
      <Starfield />
      <EarthOrbitScene />
      <OpticalEffects />
      <TelescopeFrame />
    </main>
  );
}
