import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { usePrayerStore, PRAYER_ORDER, PRAYER_LABELS } from './prayerStore';
import { useCountdown } from './useCountdown';
import { colors, spacing, typography } from '../../theme';
import type { PrayerName } from './types';
import LocationPickerScreen from './LocationPickerScreen';
import NotificationSettingsScreen from './NotificationSettingsScreen';

export default function PrayerScreen() {
  const [showPicker, setShowPicker] = useState(false);
  const [showNotifSettings, setShowNotifSettings] = useState(false);

  const {
    prayerTimes,
    dailyContent,
    loading,
    cityName,
    useMock,
    fetchPrayerTimes,
    fetchDailyContent,
    loadSavedCity,
  } = usePrayerStore();

  const { remaining, nextPrayer } = useCountdown(prayerTimes);

  useEffect(() => {
    loadSavedCity();
    fetchPrayerTimes();
    fetchDailyContent();
  }, []);

  if (showPicker) {
    return (
      <LocationPickerScreen
        onComplete={() => setShowPicker(false)}
        onBack={() => setShowPicker(false)}
      />
    );
  }

  if (showNotifSettings) {
    return <NotificationSettingsScreen onBack={() => setShowNotifSettings(false)} />;
  }

  if (loading && !prayerTimes) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Location & Date */}
      <View style={styles.headerCard}>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text style={styles.cityName}>{cityName} ▾</Text>
        </TouchableOpacity>
        {prayerTimes && (
          <>
            <Text style={styles.dateGregorian}>{prayerTimes.gregorianDateLong}</Text>
            <Text style={styles.dateHijri}>{prayerTimes.hijriDateLong}</Text>
          </>
        )}
        {useMock && (
          <View style={styles.mockBadge}>
            <Text style={styles.mockText}>Demo veriler — API key bekleniyor</Text>
          </View>
        )}
      </View>

      {/* Countdown */}
      <View style={styles.countdownCard}>
        <Text style={styles.countdownLabel}>
          {nextPrayer ? `${PRAYER_LABELS[nextPrayer]} vaktine kalan` : 'Bir sonraki vakit'}
        </Text>
        <Text style={styles.countdownTime}>{remaining}</Text>
      </View>

      {/* Prayer Times List */}
      {prayerTimes && (
        <View style={styles.timesCard}>
          {PRAYER_ORDER.map((name: PrayerName) => {
            const isNext = name === nextPrayer;
            return (
              <View
                key={name}
                style={[styles.timeRow, isNext && styles.timeRowActive]}
              >
                <Text style={[styles.timeName, isNext && styles.timeTextActive]}>
                  {PRAYER_LABELS[name]}
                </Text>
                <Text style={[styles.timeValue, isNext && styles.timeTextActive]}>
                  {prayerTimes[name]}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Notification Settings Button */}
      <TouchableOpacity
        style={styles.notifBtn}
        onPress={() => setShowNotifSettings(true)}
      >
        <Text style={styles.notifBtnText}>Bildirim Ayarları</Text>
      </TouchableOpacity>

      {/* Daily Content */}
      {dailyContent && (
        <View style={styles.contentCard}>
          <Text style={styles.contentTitle}>Günün Ayeti</Text>
          <Text style={styles.contentText}>{dailyContent.verse}</Text>
          <Text style={styles.contentSource}>{dailyContent.verseSource}</Text>

          <View style={styles.divider} />

          <Text style={styles.contentTitle}>Günün Hadisi</Text>
          <Text style={styles.contentText}>{dailyContent.hadith}</Text>
          <Text style={styles.contentSource}>{dailyContent.hadithSource}</Text>

          {dailyContent.pray && (
            <>
              <View style={styles.divider} />
              <Text style={styles.contentTitle}>Günün Duası</Text>
              <Text style={styles.contentText}>{dailyContent.pray}</Text>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerCard: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  cityName: { ...typography.h2, color: colors.white, textDecorationLine: 'underline' },
  dateGregorian: { ...typography.body, color: colors.white, opacity: 0.9, marginTop: spacing.xs },
  dateHijri: { ...typography.bodySmall, color: colors.white, opacity: 0.7 },
  mockBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  mockText: { ...typography.caption, color: colors.white },

  countdownCard: {
    backgroundColor: colors.primaryDark,
    padding: spacing.lg,
    alignItems: 'center',
  },
  countdownLabel: { ...typography.bodySmall, color: colors.white, opacity: 0.8 },
  countdownTime: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.white,
    fontVariant: ['tabular-nums'],
    marginTop: spacing.xs,
  },

  timesCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  timeRowActive: { backgroundColor: colors.primary },
  timeName: { ...typography.body, color: colors.text, fontWeight: '500' },
  timeValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  timeTextActive: { color: colors.white },

  notifBtn: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifBtnText: { ...typography.body, color: colors.primary, fontWeight: '600' },

  contentCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: 0,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.xl,
  },
  contentTitle: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  contentText: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  contentSource: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
});
