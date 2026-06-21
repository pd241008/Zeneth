import { create } from 'zustand';

interface CelestialObject {
  id: string;
  name: string;
  type: 'satellite' | 'planet' | 'star' | 'constellation';
  altitude?: number;
  velocity?: number;
}

interface AppState {
  currentLocation: { lat: number; lng: number } | null;
  selectedObject: CelestialObject | null;
  setLocation: (lat: number, lng: number) => void;
  setSelectedObject: (obj: CelestialObject | null) => void;
}

export const useStore = create<AppState>((set) => ({
  currentLocation: null,
  selectedObject: null,
  setLocation: (lat, lng) => set({ currentLocation: { lat, lng } }),
  setSelectedObject: (obj) => set({ selectedObject: obj }),
}));
