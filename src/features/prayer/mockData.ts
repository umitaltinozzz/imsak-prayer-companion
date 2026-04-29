import type { PrayerTime, DailyContent } from './types';

export const MOCK_PRAYER_TIMES: PrayerTime = {
  fajr: '06:15',
  sunrise: '07:45',
  dhuhr: '12:40',
  asr: '15:10',
  maghrib: '17:30',
  isha: '18:55',
  hijriDateShort: '11.8.1447',
  hijriDateLong: '11 Şaban 1447',
  gregorianDateShort: '09.02.2026',
  gregorianDateLong: '9 Şubat 2026 Pazartesi',
};

export const MOCK_DAILY_CONTENT: DailyContent = {
  verse: '"Şüphesiz, namaz müminlere belirli vakitlerde farz kılınmıştır."',
  verseSource: "(Nisâ, 4/103)",
  hadith: '"Amellerin en faziletlisi vaktinde kılınan namazdır."',
  hadithSource: "(Buhârî, Mevâkît, 5)",
  pray: '"Allah\'ım, bizi namazı dosdoğru kılanlardan eyle."',
  praySource: null,
};
