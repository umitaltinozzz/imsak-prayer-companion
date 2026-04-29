import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { ESMA_UL_HUSNA } from './esmaData';

interface Props {
  onBack: () => void;
}

export default function EsmaScreen({ onBack }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Esma-ül Hüsna</Text>
      </View>

      <FlatList
        data={ESMA_UL_HUSNA}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{item.id}</Text>
              </View>
              <Text style={styles.arabicName}>{item.arabic}</Text>
            </View>
            <Text style={styles.turkishName}>{item.turkish}</Text>
            <Text style={styles.meaning}>{item.meaning}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: spacing.md }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </View>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  arabicName: { fontSize: 22, color: colors.text, textAlign: 'right' },
  turkishName: { ...typography.body, color: colors.primary, fontWeight: '600' },
  meaning: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
