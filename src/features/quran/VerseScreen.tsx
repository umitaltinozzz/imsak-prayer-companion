import { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useQuranStore } from './quranStore';
import { colors, spacing, typography } from '../../theme';
import type { Chapter, Verse } from './types';

interface Props {
  chapter: Chapter;
  onBack: () => void;
}

export default function VerseScreen({ chapter, onBack }: Props) {
  const { verses, loading, error, fetchVersesByChapter, setBookmark } =
    useQuranStore();

  useEffect(() => {
    fetchVersesByChapter(chapter.id);
  }, [chapter.id]);

  const handleBookmark = useCallback(
    (verse: Verse) => {
      setBookmark({
        chapterId: chapter.id,
        verseNumber: verse.verse_number,
        chapterName: chapter.name_turkish,
        timestamp: Date.now(),
      });
    },
    [chapter],
  );

  if (loading) {
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
        <TouchableOpacity style={styles.retryBtn} onPress={() => fetchVersesByChapter(chapter.id)}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chapter.name_turkish}</Text>
        <Text style={styles.headerArabic}>{chapter.name_arabic}</Text>
      </View>

      <FlatList
        data={verses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.verseCard}
            onLongPress={() => handleBookmark(item)}
          >
            <View style={styles.verseHeader}>
              <View style={styles.verseNumberBadge}>
                <Text style={styles.verseNumberText}>{item.verse_number}</Text>
              </View>
              <Text style={styles.pageInfo}>
                Sayfa {item.page_number} · Cüz {item.juz_number}
              </Text>
            </View>
            {item.arabic_text && (
              <Text style={styles.arabicText}>{item.arabic_text}</Text>
            )}
            <Text style={styles.translationText}>{item.text}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        contentContainerStyle={{ padding: spacing.md }}
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
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backBtn: { marginBottom: spacing.sm },
  backText: { ...typography.body, color: colors.white },
  headerTitle: { ...typography.h2, color: colors.white },
  headerArabic: { ...typography.h3, color: colors.white, textAlign: 'right', opacity: 0.9 },
  verseCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  verseNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  pageInfo: { ...typography.caption, color: colors.textSecondary },
  arabicText: {
    ...typography.arabic,
    color: colors.text,
    textAlign: 'right',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  translationText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 26,
  },
});
