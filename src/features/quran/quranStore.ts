import { create } from 'zustand';
import type { Chapter, Verse, Bookmark } from './types';
import { getChapters, getVersesByChapter, getVersesByJuz, getVersesByPage } from './quranService';
import { getJSON, setJSON } from '../../shared/storage';

const BOOKMARK_KEY = 'quran_bookmark';
const CHAPTERS_CACHE_KEY = 'quran_chapters_cache';
const VERSES_CACHE_PREFIX = 'quran_verses_';

interface QuranState {
  chapters: Chapter[];
  verses: Verse[];
  loading: boolean;
  error: string | null;
  bookmark: Bookmark | null;
  arabicFontLoaded: boolean;

  fetchChapters: () => Promise<void>;
  fetchVersesByChapter: (chapterId: number) => Promise<void>;
  fetchVersesByJuz: (juzId: number) => Promise<void>;
  fetchVersesByPage: (page: number) => Promise<void>;
  setBookmark: (bookmark: Bookmark) => void;
  loadBookmark: () => void;
  clearBookmark: () => void;
  setArabicFontLoaded: (loaded: boolean) => void;
}

export const useQuranStore = create<QuranState>((set) => ({
  chapters: [],
  verses: [],
  loading: false,
  error: null,
  bookmark: null,
  arabicFontLoaded: false,

  fetchChapters: async () => {
    set({ loading: true, error: null });

    const cached = getJSON<Chapter[]>(CHAPTERS_CACHE_KEY);
    if (cached && cached.length > 0) {
      set({ chapters: cached, loading: false });
      // Refresh in background
      getChapters().then((fresh) => {
        setJSON(CHAPTERS_CACHE_KEY, fresh);
        set({ chapters: fresh });
      }).catch(() => {});
      return;
    }

    try {
      const chapters = await getChapters();
      setJSON(CHAPTERS_CACHE_KEY, chapters);
      set({ chapters, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Sureler yüklenemedi', loading: false });
    }
  },

  fetchVersesByChapter: async (chapterId: number) => {
    set({ loading: true, error: null, verses: [] });

    const cacheKey = `${VERSES_CACHE_PREFIX}ch_${chapterId}`;
    const cached = getJSON<Verse[]>(cacheKey);
    if (cached && cached.length > 0) {
      set({ verses: cached, loading: false });
      getVersesByChapter(chapterId).then((fresh) => {
        setJSON(cacheKey, fresh);
        set({ verses: fresh });
      }).catch(() => {});
      return;
    }

    try {
      const verses = await getVersesByChapter(chapterId);
      setJSON(cacheKey, verses);
      set({ verses, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Ayetler yüklenemedi', loading: false });
    }
  },

  fetchVersesByJuz: async (juzId: number) => {
    set({ loading: true, error: null, verses: [] });

    const cacheKey = `${VERSES_CACHE_PREFIX}juz_${juzId}`;
    const cached = getJSON<Verse[]>(cacheKey);
    if (cached && cached.length > 0) {
      set({ verses: cached, loading: false });
      return;
    }

    try {
      const verses = await getVersesByJuz(juzId);
      setJSON(cacheKey, verses);
      set({ verses, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Cüz yüklenemedi', loading: false });
    }
  },

  fetchVersesByPage: async (page: number) => {
    set({ loading: true, error: null, verses: [] });

    const cacheKey = `${VERSES_CACHE_PREFIX}page_${page}`;
    const cached = getJSON<Verse[]>(cacheKey);
    if (cached && cached.length > 0) {
      set({ verses: cached, loading: false });
      return;
    }

    try {
      const verses = await getVersesByPage(page);
      setJSON(cacheKey, verses);
      set({ verses, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Sayfa yüklenemedi', loading: false });
    }
  },

  setBookmark: (bookmark: Bookmark) => {
    setJSON(BOOKMARK_KEY, bookmark);
    set({ bookmark });
  },

  loadBookmark: () => {
    const bookmark = getJSON<Bookmark>(BOOKMARK_KEY);
    set({ bookmark });
  },

  clearBookmark: () => {
    setJSON(BOOKMARK_KEY, null);
    set({ bookmark: null });
  },

  setArabicFontLoaded: (loaded: boolean) => {
    set({ arabicFontLoaded: loaded });
  },
}));
