import {
  scheduleLocalNotification,
  cancelAllNotifications,
} from '../../services/notification';
import { getJSON, setJSON } from '../../shared/storage';
import type { PrayerTime, PrayerName } from './types';
import { PRAYER_LABELS } from './prayerStore';

const NOTIF_SETTINGS_KEY = 'notification_settings';
const NOTIF_MINUTES_KEY = 'notification_minutes_before';

export interface NotificationSettings {
  fajr: boolean;
  sunrise: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  fajr: true,
  sunrise: false,
  dhuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
};

export function getNotifSettings(): NotificationSettings {
  return getJSON<NotificationSettings>(NOTIF_SETTINGS_KEY) ?? DEFAULT_SETTINGS;
}

export function saveNotifSettings(settings: NotificationSettings): void {
  setJSON(NOTIF_SETTINGS_KEY, settings);
}

export function getMinutesBefore(): number {
  return getJSON<number>(NOTIF_MINUTES_KEY) ?? 0;
}

export function saveMinutesBefore(minutes: number): void {
  setJSON(NOTIF_MINUTES_KEY, minutes);
}

function parseTimeToday(timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export async function schedulePrayerNotifications(
  prayerTimes: PrayerTime,
): Promise<void> {
  await cancelAllNotifications();

  const settings = getNotifSettings();
  const minutesBefore = getMinutesBefore();
  const now = new Date();

  const prayers: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

  for (const name of prayers) {
    if (!settings[name]) continue;

    const prayerDate = parseTimeToday(prayerTimes[name]);
    prayerDate.setMinutes(prayerDate.getMinutes() - minutesBefore);

    if (prayerDate <= now) continue;

    const label = PRAYER_LABELS[name];
    const title = minutesBefore > 0
      ? `${label} vaktine ${minutesBefore} dakika`
      : `${label} vakti girdi`;
    const body = `${label}: ${prayerTimes[name]}`;

    await scheduleLocalNotification(title, body, prayerDate);
  }
}
