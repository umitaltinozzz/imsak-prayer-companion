import { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useToolsStore, QadaPrayers } from './toolsStore';
import { colors, spacing, typography } from '../../theme';

const PRAYER_LABELS: Record<keyof QadaPrayers, string> = {
  fajr: 'Sabah',
  dhuhr: 'Öğle',
  asr: 'İkindi',
  maghrib: 'Akşam',
  isha: 'Yatsı',
  witr: 'Vitir',
};

interface Props {
  onBack: () => void;
}

export default function QadaScreen({ onBack }: Props) {
  const { qada, loadQada, incrementQada, decrementQada } = useToolsStore();

  useEffect(() => {
    loadQada();
  }, []);

  const totalRemaining = Object.values(qada).reduce((a, b) => a + b, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Kaza Namazı Takibi</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Toplam Kalan</Text>
        <Text style={styles.totalCount}>{totalRemaining}</Text>
      </View>

      {(Object.keys(PRAYER_LABELS) as Array<keyof QadaPrayers>).map((key) => (
        <View key={key} style={styles.row}>
          <Text style={styles.prayerName}>{PRAYER_LABELS[key]}</Text>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => decrementQada(key)}
            >
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.count}>{qada[key]}</Text>
            <TouchableOpacity
              style={[styles.btn, styles.btnAdd]}
              onPress={() => incrementQada(key)}
            >
              <Text style={[styles.btnText, styles.btnAddText]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={styles.hint}>
        Kıldığınız kaza namazlarını - butonuyla düşürün.{'\n'}
        Borç eklemek için + butonunu kullanın.
      </Text>
    </ScrollView>
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
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  totalLabel: { ...typography.bodySmall, color: colors.white, opacity: 0.8 },
  totalCount: { fontSize: 42, fontWeight: '700', color: colors.white },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  prayerName: { ...typography.body, color: colors.text, fontWeight: '600', flex: 1 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAdd: { backgroundColor: colors.primary },
  btnText: { fontSize: 20, fontWeight: '700', color: colors.text },
  btnAddText: { color: colors.white },
  count: { ...typography.h3, color: colors.text, minWidth: 40, textAlign: 'center' },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 20,
  },
});
