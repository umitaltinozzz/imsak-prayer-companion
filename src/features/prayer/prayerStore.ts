import { create } from 'zustand';
import type { PrayerTime, DailyContent, PrayerName } from './types';
import { getDailyPrayerTimes, getDailyContent, login } from './prayerService';
import { MOCK_PRAYER_TIMES, MOCK_DAILY_CONTENT } from './mockData';
import { getJSON, setJSON } from '../../shared/storage';

const CITY_ID_KEY = 'selected_city_id';
const CITY_NAME_KEY = 'selected_city_name';

interface PrayerState {
  prayerTimes: PrayerTime | null;
  dailyContent: DailyContent | null;
  loading: boolean;
  error: string | null;
  cityId: number | null;
  cityName: string;
  useMock: boolean;

  loadSavedCity: () => void;
  setCity: (id: number, name: string) => void;
  fetchPrayerTimes: () => Promise<void>;
  fetchDailyContent: () => Promise<void>;
}

export const usePrayerStore = create<PrayerState>((set, get) => ({
  prayerTimes: null,
  dailyContent: null,
  loading: false,
  error: null,
  cityId: null,
  cityName: 'Konum seçilmedi',
  useMock: true,

  loadSavedCity: () => {
    const cityId = getJSON<number>(CITY_ID_KEY);
    const cityName = getJSON<string>(CITY_NAME_KEY) ?? 'Konum seçilmedi';
    set({ cityId, cityName });
  },

  setCity: (id: number, name: string) => {
    setJSON(CITY_ID_KEY, id);
    setJSON(CITY_NAME_KEY, name);
    set({ cityId: id, cityName: name });
  },

  fetchPrayerTimes: async () => {
    set({ loading: true, error: null });
    const { cityId } = get();

    if (!cityId) {
      set({ prayerTimes: MOCK_PRAYER_TIMES, loading: false, useMock: true });
      return;
    }

    try {
      const email = process.env.EXPO_PUBLIC_PRAYER_API_EMAIL;
      if (!email) {
        set({ prayerTimes: MOCK_PRAYER_TIMES, loading: false, useMock: true });
        return;
      }

      await login();
      const times = await getDailyPrayerTimes(cityId);
      set({ prayerTimes: times, loading: false, useMock: false });
    } catch {
      set({ prayerTimes: MOCK_PRAYER_TIMES, loading: false, useMock: true });
    }
  },

  fetchDailyContent: async () => {
    try {
      const email = process.env.EXPO_PUBLIC_PRAYER_API_EMAIL;
      if (!email) {
        set({ dailyContent: MOCK_DAILY_CONTENT });
        return;
      }
      const content = await getDailyContent();
      set({ dailyContent: content });
    } catch {
      set({ dailyContent: MOCK_DAILY_CONTENT });
    }
  },
}));

const PRAYER_ORDER: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'İmsak',
  sunrise: 'Güneş',
  dhuhr: 'Öğle',
  asr: 'İkindi',
  maghrib: 'Akşam',
  isha: 'Yatsı',
};

export { PRAYER_ORDER, PRAYER_LABELS };
