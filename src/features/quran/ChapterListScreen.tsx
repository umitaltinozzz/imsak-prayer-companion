import { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useQuranStore } from './quranStore';
import { colors, spacing, typography } from '../../theme';
import type { Chapter } from './types';

interface Props {
  onSelectChapter: (chapter: Chapter) => void;
}

export default function ChapterListScreen({ onSelectChapter }: Props) {
  const { chapters, loading, error, fetchChapters, bookmark, loadBookmark } =
    useQuranStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (chapters.length === 0) fetchChapters();
    loadBookmark();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return chapters;
    const q = search.toLowerCase();
    return chapters.filter(
      (c) =>
        c.name_turkish.toLowerCase().includes(q) ||
        c.name_arabic.includes(q) ||
        String(c.id).includes(q),
    );
  }, [chapters, search]);

  if (loading && chapters.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchChapters}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bookmark && (
        <TouchableOpacity
          style={styles.bookmarkBar}
          onPress={() => {
            const ch = chapters.find((c) => c.id === bookmark.chapterId);
            if (ch) onSelectChapter(ch);
          }}
        >
          <Text style={styles.bookmarkText}>
            Kaldığın yer: {bookmark.chapterName} - Ayet {bookmark.verseNumber}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Sure ara..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => onSelectChapter(item)}
          >
            <View style={styles.numberCircle}>
              <Text style={styles.number}>{item.id}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.nameTurkish}>{item.name_turkish}</Text>
              <Text style={styles.meta}>
                {item.verse_count} ayet · Sayfa {item.first_page}
              </Text>
            </View>
            <Text style={styles.nameArabic}>{item.name_arabic}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Sonuç bulunamadı</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  error: { ...typography.body, color: colors.error, textAlign: 'center', marginBottom: spacing.md },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  retryText: { ...typography.body, color: colors.white },
  bookmarkBar: {
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
  },
  bookmarkText: { ...typography.bodySmall, color: colors.white },
  searchBox: { padding: spacing.md, paddingBottom: 0 },
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  number: { ...typography.bodySmall, color: colors.white, fontWeight: '700' },
  info: { flex: 1 },
  nameTurkish: { ...typography.body, color: colors.text, fontWeight: '600' },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  nameArabic: { ...typography.h3, color: colors.text, textAlign: 'right' },
  separator: { height: 1, backgroundColor: colors.divider, marginLeft: 60 },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
