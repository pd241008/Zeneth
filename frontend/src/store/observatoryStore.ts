import { create } from 'zustand';

export type ObservatoryMode = 'orbit' | 'stellar' | 'survey';
export type TrackingStatusType = 'idle' | 'scanning' | 'locked';

export interface Telemetry {
  range: number;
  ra: string;
  dec: string;
  altitude: number;
  signalStrength: number;
}

interface ObservatoryState {
  power: boolean;
  mode: ObservatoryMode;
  target: string | null;
  trackingStatus: TrackingStatusType;
  focus: number;
  zoom: number;
  telemetry: Telemetry;
  panel: string | null;

  setPower: (power: boolean) => void;
  setMode: (mode: ObservatoryMode) => void;
  cycleMode: () => void;
  setTarget: (target: string | null) => void;
  setTrackingStatus: (status: TrackingStatusType) => void;
  setFocus: (focus: number) => void;
  setZoom: (zoom: number) => void;
  setPanel: (panel: string | null) => void;
  updateTelemetry: (partial: Partial<Telemetry>) => void;
}

const defaultTelemetry: Telemetry = {
  range: 408,
  ra: '12h 34m 56s',
  dec: '+45° 67\' 89"',
  altitude: 408,
  signalStrength: 0.7,
};

const modeOrder: ObservatoryMode[] = ['orbit', 'stellar', 'survey'];

export const useObservatoryStore = create<ObservatoryState>((set) => ({
  power: true,
  mode: 'orbit',
  target: null,
  trackingStatus: 'idle',
  focus: 0.5,
  zoom: 1,
  telemetry: { ...defaultTelemetry },
  panel: null,

  setPower: (power) => set({ power }),
  setMode: (mode) => set({ mode }),
  cycleMode: () =>
    set((state) => {
      const idx = modeOrder.indexOf(state.mode);
      const nextMode = modeOrder[(idx + 1) % modeOrder.length];
      return { mode: nextMode };
    }),
  setTarget: (target) => set({ target }),
  setTrackingStatus: (trackingStatus) => set({ trackingStatus }),
  setFocus: (focus) => set({ focus: Math.max(0, Math.min(1, focus)) }),
  setZoom: (zoom) => set({ zoom }),
  setPanel: (panel) => set({ panel }),
  updateTelemetry: (partial) =>
    set((state) => ({
      telemetry: { ...state.telemetry, ...partial },
    })),
}));
