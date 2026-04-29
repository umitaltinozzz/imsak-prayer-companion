import { quranApi } from '../../services/api';
import type { Chapter, Verse, QuranFont } from './types';

export async function getChapters(): Promise<Chapter[]> {
  const { data } = await quranApi.get('/api/v1/chapters', {
    params: { language: 'tr' },
  });
  return data.data;
}

export async function getVersesByChapter(
  chapterId: number,
  languageId?: number,
): Promise<Verse[]> {
  const { data } = await quranApi.get(`/api/v1/chapters/${chapterId}`, {
    params: { language_id: languageId },
  });
  return Array.isArray(data) ? data : data.data ?? [];
}

export async function getVersesByJuz(
  juzId: number,
  languageId?: number,
): Promise<Verse[]> {
  const { data } = await quranApi.get(`/api/v1/juz/${juzId}`, {
    params: { language_id: languageId },
  });
  return Array.isArray(data) ? data : data.data ?? [];
}

export async function getVersesByPage(
  pageNumber: number,
  languageId?: number,
): Promise<Verse[]> {
  const { data } = await quranApi.get(`/api/v1/verses/page/${pageNumber}`, {
    params: { language_id: languageId },
  });
  return data.data ?? [];
}

export async function getFonts(): Promise<QuranFont[]> {
  const { data } = await quranApi.get('/api/v1/fonts');
  return Array.isArray(data) ? data : data.data ?? [];
}
