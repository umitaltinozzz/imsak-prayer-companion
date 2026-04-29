import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import DhikrScreen from './DhikrScreen';
import QadaScreen from './QadaScreen';
import EsmaScreen from './EsmaScreen';
import ZekatScreen from './ZekatScreen';

type Screen = 'menu' | 'dhikr' | 'qada' | 'esma' | 'zekat';

const TOOLS = [
  { id: 'dhikr' as const, title: 'Zikirmatik', icon: '📿', desc: 'Dijital tesbih sayacı' },
  { id: 'qada' as const, title: 'Kaza Takibi', icon: '📋', desc: 'Kaza namazı borç takibi' },
  { id: 'esma' as const, title: 'Esma-ül Hüsna', icon: '✨', desc: "Allah'ın 99 güzel ismi" },
  { id: 'zekat' as const, title: 'Zekat Hesaplama', icon: '💰', desc: 'Altın, gümüş, nakit hesabı' },
];

export default function ToolsScreen() {
  const [screen, setScreen] = useState<Screen>('menu');

  if (screen === 'dhikr') return <DhikrScreen onBack={() => setScreen('menu')} />;
  if (screen === 'qada') return <QadaScreen onBack={() => setScreen('menu')} />;
  if (screen === 'esma') return <EsmaScreen onBack={() => setScreen('menu')} />;
  if (screen === 'zekat') return <ZekatScreen onBack={() => setScreen('menu')} />;

  return (
    <ScrollView style={styles.container}>
      {TOOLS.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          style={styles.card}
          onPress={() => setScreen(tool.id)}
        >
          <Text style={styles.icon}>{tool.icon}</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{tool.title}</Text>
            <Text style={styles.cardDesc}>{tool.desc}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { fontSize: 32, marginRight: spacing.md },
  cardContent: { flex: 1 },
  cardTitle: { ...typography.h3, color: colors.text },
  cardDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  arrow: { fontSize: 24, color: colors.textSecondary },
});
