import axios from 'axios';
import { getJSON, setJSON } from '../../shared/storage';
import type { PrayerTime, Place, CityDetail, DailyContent, EidTimes } from './types';

const TOKEN_KEY = 'prayer_api_token';
const REFRESH_KEY = 'prayer_api_refresh';
const BASE_URL = 'https://namazvakti.diyanet.gov.tr';

const prayerApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

prayerApi.interceptors.request.use((config) => {
  const token = getJSON<string>(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

prayerApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed && error.config) {
        error.config.headers.Authorization = `Bearer ${getJSON<string>(TOKEN_KEY)}`;
        return prayerApi(error.config);
      }
    }
    return Promise.reject(error);
  },
);

export async function login(): Promise<boolean> {
  const email = process.env.EXPO_PUBLIC_PRAYER_API_EMAIL;
  const password = process.env.EXPO_PUBLIC_PRAYER_API_PASSWORD;
  if (!email || !password) return false;

  try {
    const { data } = await prayerApi.post('/api/Auth/Login', { email, password });
    if (data.success) {
      setJSON(TOKEN_KEY, data.data.accessToken);
      setJSON(REFRESH_KEY, data.data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function refreshToken(): Promise<boolean> {
  const refresh = getJSON<string>(REFRESH_KEY);
  if (!refresh) return false;
  try {
    const { data } = await prayerApi.get(`/api/Auth/RefreshToken/${refresh}`);
    if (data.success) {
      setJSON(TOKEN_KEY, data.data.accessToken);
      setJSON(REFRESH_KEY, data.data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function getCountries(): Promise<Place[]> {
  const { data } = await prayerApi.get('/api/Place/Countries');
  return data.data;
}

export async function getStates(countryId: number): Promise<Place[]> {
  const { data } = await prayerApi.get(`/api/Place/States/${countryId}`);
  return data.data;
}

export async function getCities(stateId: number): Promise<Place[]> {
  const { data } = await prayerApi.get(`/api/Place/Cities/${stateId}`);
  return data.data;
}

export async function getCityDetail(cityId: number): Promise<CityDetail> {
  const { data } = await prayerApi.get(`/api/Place/CityDetail/${cityId}`);
  return data.data;
}

export async function getDailyPrayerTimes(cityId: number): Promise<PrayerTime> {
  const { data } = await prayerApi.get(`/api/PrayerTime/Daily/${cityId}`);
  return data.data[0];
}

export async function getDailyContent(): Promise<DailyContent> {
  const { data } = await prayerApi.get('/api/DailyContent');
  return data.data;
}

export async function getRamadanTimes(cityId: number): Promise<PrayerTime[]> {
  const { data } = await prayerApi.get(`/api/PrayerTime/Ramadan/${cityId}`);
  return data.data;
}

export async function getEidTimes(cityId: number): Promise<EidTimes> {
  const { data } = await prayerApi.get(`/api/PrayerTime/Eid/${cityId}`);
  return data.data;
}

export async function getMonthlyPrayerTimes(cityId: number): Promise<PrayerTime[]> {
  const { data } = await prayerApi.get(`/api/PrayerTime/Monthly/${cityId}`);
  return data.data;
}
