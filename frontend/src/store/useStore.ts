import { create } from 'zustand';

interface AppState {
  currentLocation: { lat: number; lng: number } | null;
  selectedObject: any | null; // Placeholder for celestial object data
  setLocation: (lat: number, lng: number) => void;
  setSelectedObject: (obj: any) => void;
}

export const useStore = create<AppState>((set) => ({
  currentLocation: null,
  selectedObject: null,
  setLocation: (lat, lng) => set({ currentLocation: { lat, lng } }),
  setSelectedObject: (obj) => set({ selectedObject: obj }),
}));
