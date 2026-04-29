import { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { useToolsStore } from './toolsStore';
import { colors, spacing, typography } from '../../theme';

const TARGETS = [33, 99, 100, 500, 1000];

interface Props {
  onBack: () => void;
}

export default function DhikrScreen({ onBack }: Props) {
  const {
    dhikrCount,
    dhikrTarget,
    incrementDhikr,
    resetDhikr,
    setDhikrTarget,
    loadDhikr,
  } = useToolsStore();

  useEffect(() => {
    loadDhikr();
  }, []);

  const handlePress = () => {
    incrementDhikr();
    Vibration.vibrate(30);
    if ((dhikrCount + 1) % dhikrTarget === 0) {
      Vibration.vibrate([0, 100, 50, 100]);
    }
  };

  const progress = dhikrTarget > 0 ? (dhikrCount % dhikrTarget) / dhikrTarget : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Zikirmatik</Text>
      </View>

      <View style={styles.targetRow}>
        {TARGETS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.targetBtn, dhikrTarget === t && styles.targetBtnActive]}
            onPress={() => setDhikrTarget(t)}
          >
            <Text style={[styles.targetText, dhikrTarget === t && styles.targetTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.counterBtn}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.countText}>{dhikrCount}</Text>
        <Text style={styles.ofText}>/ {dhikrTarget}</Text>
      </TouchableOpacity>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFg, { width: `${progress * 100}%` }]} />
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={resetDhikr}>
        <Text style={styles.resetText}>Sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  backText: { ...typography.body, color: colors.primary },
  title: { ...typography.h2, color: colors.text },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  targetBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  targetBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  targetText: { ...typography.bodySmall, color: colors.text },
  targetTextActive: { color: colors.white },
  counterBtn: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: spacing.xl,
  },
  countText: { fontSize: 48, fontWeight: '700', color: colors.white },
  ofText: { ...typography.body, color: colors.white, opacity: 0.8 },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressBarFg: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  resetBtn: {
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  resetText: { ...typography.body, color: colors.error },
});
