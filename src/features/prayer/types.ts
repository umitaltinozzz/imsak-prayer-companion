export interface PrayerTime {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  hijriDateShort: string;
  hijriDateLong: string;
  gregorianDateShort: string;
  gregorianDateLong: string;
}

export interface Place {
  id: number;
  code: string;
  name: string;
}

export interface CityDetail {
  id: string;
  name: string;
  geographicQiblaAngle: string;
  distanceToKaaba: string;
  qiblaAngle: string;
  city: string;
  country: string;
}

export interface DailyContent {
  verse: string;
  verseSource: string;
  hadith: string;
  hadithSource: string;
  pray: string;
  praySource: string | null;
}

export interface EidTimes {
  eidAlAdhaHijri: string;
  eidAlAdhaTime: string;
  eidAlAdhaDate: string;
  eidAlFitrHijri: string;
  eidAlFitrTime: string;
  eidAlFitrDate: string;
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
