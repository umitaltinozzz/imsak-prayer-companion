import { create } from 'zustand';
import { getJSON, setJSON } from '../../shared/storage';

const DHIKR_KEY = 'dhikr_count';
const QADA_KEY = 'qada_prayers';

export interface QadaPrayers {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  witr: number;
}

const DEFAULT_QADA: QadaPrayers = {
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
  witr: 0,
};

interface ToolsState {
  dhikrCount: number;
  dhikrTarget: number;
  qada: QadaPrayers;

  incrementDhikr: () => void;
  resetDhikr: () => void;
  setDhikrTarget: (target: number) => void;
  loadDhikr: () => void;

  loadQada: () => void;
  decrementQada: (prayer: keyof QadaPrayers) => void;
  incrementQada: (prayer: keyof QadaPrayers) => void;
  setQadaCount: (prayer: keyof QadaPrayers, count: number) => void;
}

export const useToolsStore = create<ToolsState>((set, get) => ({
  dhikrCount: 0,
  dhikrTarget: 33,
  qada: DEFAULT_QADA,

  incrementDhikr: () => {
    const newCount = get().dhikrCount + 1;
    setJSON(DHIKR_KEY, newCount);
    set({ dhikrCount: newCount });
  },

  resetDhikr: () => {
    setJSON(DHIKR_KEY, 0);
    set({ dhikrCount: 0 });
  },

  setDhikrTarget: (target: number) => {
    set({ dhikrTarget: target });
  },

  loadDhikr: () => {
    const count = getJSON<number>(DHIKR_KEY) ?? 0;
    set({ dhikrCount: count });
  },

  loadQada: () => {
    const qada = getJSON<QadaPrayers>(QADA_KEY) ?? DEFAULT_QADA;
    set({ qada });
  },

  decrementQada: (prayer: keyof QadaPrayers) => {
    const qada = { ...get().qada };
    if (qada[prayer] > 0) {
      qada[prayer] -= 1;
      setJSON(QADA_KEY, qada);
      set({ qada });
    }
  },

  incrementQada: (prayer: keyof QadaPrayers) => {
    const qada = { ...get().qada };
    qada[prayer] += 1;
    setJSON(QADA_KEY, qada);
    set({ qada });
  },

  setQadaCount: (prayer: keyof QadaPrayers, count: number) => {
    const qada = { ...get().qada };
    qada[prayer] = Math.max(0, count);
    setJSON(QADA_KEY, qada);
    set({ qada });
  },
}));
