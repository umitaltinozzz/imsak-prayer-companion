import axios from 'axios';

const QURAN_BASE_URL = 'https://t061.diyanet.gov.tr/apigateway/acikkaynakkuran';

export const quranApi = axios.create({
  baseURL: QURAN_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

quranApi.interceptors.request.use((config) => {
  const apiKey = process.env.EXPO_PUBLIC_QURAN_API_KEY;
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
  }
  return config;
});

quranApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[QuranAPI] Unauthorized — API key geçersiz veya eksik');
    }
    return Promise.reject(error);
  },
);
