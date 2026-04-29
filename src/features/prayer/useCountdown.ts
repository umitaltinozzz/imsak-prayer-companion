import { useState, useEffect, useRef } from 'react';
import type { PrayerTime, PrayerName } from './types';
import { PRAYER_ORDER } from './prayerStore';

function parseTime(timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  now.setHours(h, m, 0, 0);
  return now;
}

export function useCountdown(prayerTimes: PrayerTime | null) {
  const [remaining, setRemaining] = useState('--:--:--');
  const [nextPrayer, setNextPrayer] = useState<PrayerName | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!prayerTimes) return;

    const tick = () => {
      const now = new Date();

      for (const name of PRAYER_ORDER) {
        const prayerDate = parseTime(prayerTimes[name]);
        if (prayerDate > now) {
          const diff = prayerDate.getTime() - now.getTime();
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setRemaining(
            `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
          );
          setNextPrayer(name);
          return;
        }
      }

      const tomorrowFajr = parseTime(prayerTimes.fajr);
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
      const diff = tomorrowFajr.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      );
      setNextPrayer('fajr');
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [prayerTimes]);

  return { remaining, nextPrayer };
}
