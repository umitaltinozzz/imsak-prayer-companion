export interface Chapter {
  id: number;
  name_turkish: string;
  name_arabic: string;
  verse_count: number;
  revelation_order: number;
  first_page: number;
}

export interface Verse {
  id: number;
  surah_number: number;
  verse_number: number;
  text: string;
  arabic_text: string | null;
  juz_number: number;
  page_number: number;
  surah_name_turkish: string;
  surah_name_arabic: string;
}

export interface QuranFont {
  id: number;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  download_url: string;
}

export interface Bookmark {
  chapterId: number;
  verseNumber: number;
  chapterName: string;
  timestamp: number;
}
