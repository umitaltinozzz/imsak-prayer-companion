import { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import type { Chapter } from './types';
import ChapterListScreen from './ChapterListScreen';
import VerseScreen from './VerseScreen';
import { loadArabicFont } from './arabicFontLoader';
import { useQuranStore } from './quranStore';
import { colors } from '../../theme';

export default function QuranScreen() {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [fontLoading, setFontLoading] = useState(true);
  const setArabicFontLoaded = useQuranStore((s) => s.setArabicFontLoaded);

  useEffect(() => {
    loadArabicFont()
      .then((loaded) => setArabicFontLoaded(loaded))
      .finally(() => setFontLoading(false));
  }, []);

  if (fontLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (selectedChapter) {
    return (
      <VerseScreen
        chapter={selectedChapter}
        onBack={() => setSelectedChapter(null)}
      />
    );
  }

  return <ChapterListScreen onSelectChapter={setSelectedChapter} />;
}
