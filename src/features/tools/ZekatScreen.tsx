import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface Props {
  onBack: () => void;
}

const NISAP_GOLD_GRAM = 80.18; // 20 miskal = 80.18 gram altın

export default function ZekatScreen({ onBack }: Props) {
  const [goldGram, setGoldGram] = useState('');
  const [goldPrice, setGoldPrice] = useState('');
  const [silverGram, setSilverGram] = useState('');
  const [silverPrice, setSilverPrice] = useState('');
  const [cash, setCash] = useState('');
  const [debt, setDebt] = useState('');

  const totalGold = (parseFloat(goldGram) || 0) * (parseFloat(goldPrice) || 0);
  const totalSilver = (parseFloat(silverGram) || 0) * (parseFloat(silverPrice) || 0);
  const totalCash = parseFloat(cash) || 0;
  const totalDebt = parseFloat(debt) || 0;

  const netWealth = totalGold + totalSilver + totalCash - totalDebt;
  const nisapValue = NISAP_GOLD_GRAM * (parseFloat(goldPrice) || 0);
  const isAboveNisap = nisapValue > 0 && netWealth >= nisapValue;
  const zekatAmount = isAboveNisap ? netWealth * 0.025 : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Zekat Hesaplama</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Altın</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gram</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={goldGram}
              onChangeText={setGoldGram}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gram Fiyatı (TL)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={goldPrice}
              onChangeText={setGoldPrice}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gümüş</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gram</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={silverGram}
              onChangeText={setSilverGram}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gram Fiyatı (TL)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={silverPrice}
              onChangeText={setSilverPrice}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nakit / Banka</Text>
        <TextInput
          style={styles.inputFull}
          keyboardType="numeric"
          value={cash}
          onChangeText={setCash}
          placeholder="Toplam nakit (TL)"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Borçlar (düşülecek)</Text>
        <TextInput
          style={styles.inputFull}
          keyboardType="numeric"
          value={debt}
          onChangeText={setDebt}
          placeholder="Toplam borç (TL)"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.resultCard}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Net Varlık</Text>
          <Text style={styles.resultValue}>{netWealth.toLocaleString('tr-TR')} TL</Text>
        </View>
        {nisapValue > 0 && (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Nisap ({NISAP_GOLD_GRAM}g altın)</Text>
            <Text style={styles.resultValue}>{nisapValue.toLocaleString('tr-TR')} TL</Text>
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Nisap durumu</Text>
          <Text style={[styles.resultValue, { color: isAboveNisap ? colors.success : colors.textSecondary }]}>
            {nisapValue > 0 ? (isAboveNisap ? 'Nisabı aşıyor' : 'Nisabın altında') : 'Altın fiyatı girin'}
          </Text>
        </View>
        <View style={[styles.zekatBox, isAboveNisap && styles.zekatBoxActive]}>
          <Text style={styles.zekatLabel}>Verilecek Zekat (%2.5)</Text>
          <Text style={styles.zekatAmount}>{zekatAmount.toLocaleString('tr-TR')} TL</Text>
        </View>
      </View>

      <Text style={styles.disclaimer}>
        Bu hesaplama yaklaşık bir değerdir. Kesin zekat hesabı için dini otoritelere danışınız.
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
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionTitle: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600', marginBottom: spacing.sm },
  inputRow: { flexDirection: 'row', gap: spacing.sm },
  inputGroup: { flex: 1 },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputFull: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: spacing.lg,
    borderRadius: 12,
    padding: spacing.lg,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  resultLabel: { ...typography.bodySmall, color: colors.textSecondary },
  resultValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.sm },
  zekatBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  zekatBoxActive: { backgroundColor: colors.primary },
  zekatLabel: { ...typography.bodySmall, color: colors.textSecondary },
  zekatAmount: { ...typography.h1, color: colors.primary, marginTop: spacing.xs },
  disclaimer: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    margin: spacing.lg,
    lineHeight: 18,
  },
});
