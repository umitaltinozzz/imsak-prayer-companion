import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { PRAYER_LABELS } from './prayerStore';
import { usePrayerStore } from './prayerStore';
import {
  getNotifSettings,
  saveNotifSettings,
  getMinutesBefore,
  saveMinutesBefore,
  schedulePrayerNotifications,
  NotificationSettings,
} from './notificationScheduler';
import { registerForPushNotifications } from '../../services/notification';
import type { PrayerName } from './types';

const MINUTES_OPTIONS = [0, 5, 10, 15, 30];

interface Props {
  onBack: () => void;
}

export default function NotificationSettingsScreen({ onBack }: Props) {
  const [settings, setSettings] = useState<NotificationSettings>(getNotifSettings());
  const [minutesBefore, setMinutesBefore] = useState(getMinutesBefore());
  const { prayerTimes } = usePrayerStore();

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  function togglePrayer(name: PrayerName) {
    const updated = { ...settings, [name]: !settings[name] };
    setSettings(updated);
    saveNotifSettings(updated);
    if (prayerTimes) schedulePrayerNotifications(prayerTimes);
  }

  function selectMinutes(m: number) {
    setMinutesBefore(m);
    saveMinutesBefore(m);
    if (prayerTimes) schedulePrayerNotifications(prayerTimes);
  }

  const prayers: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bildirim Ayarları</Text>
      </View>

      <Text style={styles.sectionTitle}>Vakitler</Text>
      <View style={styles.card}>
        {prayers.map((name) => (
          <View key={name} style={styles.row}>
            <Text style={styles.label}>{PRAYER_LABELS[name]}</Text>
            <Switch
              value={settings[name]}
              onValueChange={() => togglePrayer(name)}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={colors.white}
            />
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Kaç dakika önce bildirim gelsin?</Text>
      <View style={styles.minutesRow}>
        {MINUTES_OPTIONS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.minuteBtn, minutesBefore === m && styles.minuteBtnActive]}
            onPress={() => selectMinutes(m)}
          >
            <Text style={[styles.minuteText, minutesBefore === m && styles.minuteTextActive]}>
              {m === 0 ? 'Tam vakitte' : `${m} dk`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.hint}>
        Bildirimler her gün namaz vakitlerine göre otomatik zamanlanır.
        Vakitler değiştiğinde bildirimler güncellenir.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primary,
    paddingTop: spacing.lg,
  },
  backText: { ...typography.body, color: colors.white },
  title: { ...typography.h2, color: colors.white },
  sectionTitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  label: { ...typography.body, color: colors.text },
  minutesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
  },
  minuteBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  minuteBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  minuteText: { ...typography.bodySmall, color: colors.text },
  minuteTextActive: { color: colors.white },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
});
