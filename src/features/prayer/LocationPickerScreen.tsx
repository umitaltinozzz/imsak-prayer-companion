import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getCountries, getStates, getCities } from './prayerService';
import { usePrayerStore } from './prayerStore';
import { colors, spacing, typography } from '../../theme';
import type { Place } from './types';

type Step = 'country' | 'state' | 'city';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function LocationPickerScreen({ onComplete, onBack }: Props) {
  const [step, setStep] = useState<Step>('country');
  const [items, setItems] = useState<Place[]>([]);
  const [filtered, setFiltered] = useState<Place[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Place | null>(null);
  const [selectedState, setSelectedState] = useState<Place | null>(null);
  const { setCity, fetchPrayerTimes } = usePrayerStore();

  const titles: Record<Step, string> = {
    country: 'Ülke Seçin',
    state: 'İl Seçin',
    city: 'İlçe Seçin',
  };

  useEffect(() => {
    loadItems();
  }, [step]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(items);
    } else {
      const q = search.toLowerCase();
      setFiltered(items.filter((i) => i.name.toLowerCase().includes(q)));
    }
  }, [search, items]);

  async function loadItems() {
    setLoading(true);
    setSearch('');
    try {
      let data: Place[] = [];
      if (step === 'country') {
        data = await getCountries();
      } else if (step === 'state' && selectedCountry) {
        data = await getStates(selectedCountry.id);
      } else if (step === 'city' && selectedState) {
        data = await getCities(selectedState.id);
      }
      setItems(data);
      setFiltered(data);
    } catch {
      setItems([]);
      setFiltered([]);
    }
    setLoading(false);
  }

  function handleSelect(item: Place) {
    if (step === 'country') {
      setSelectedCountry(item);
      setStep('state');
    } else if (step === 'state') {
      setSelectedState(item);
      setStep('city');
    } else {
      const name = selectedState
        ? `${item.name}, ${selectedState.name}`
        : item.name;
      setCity(item.id, name);
      fetchPrayerTimes();
      onComplete();
    }
  }

  function handleBack() {
    if (step === 'city') {
      setStep('state');
    } else if (step === 'state') {
      setStep('country');
    } else {
      onBack();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{titles[step]}</Text>
      </View>

      {selectedCountry && step !== 'country' && (
        <Text style={styles.breadcrumb}>
          {selectedCountry.name}
          {selectedState && step === 'city' ? ` > ${selectedState.name}` : ''}
        </Text>
      )}

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Ara..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.rowText}>{item.name}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.empty}>Sonuç bulunamadı</Text>
          }
        />
      )}
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
  breadcrumb: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  searchBox: {
    padding: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowText: { ...typography.body, color: colors.text },
  arrow: { ...typography.h3, color: colors.textSecondary },
  separator: { height: 1, backgroundColor: colors.divider, marginLeft: spacing.md },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
