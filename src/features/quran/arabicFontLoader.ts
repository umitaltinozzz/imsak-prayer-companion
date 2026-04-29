import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import { getFonts } from './quranService';
import { getJSON, setJSON } from '../../shared/storage';

const FONT_LOADED_KEY = 'arabic_font_loaded';
const FONT_DIR = `${FileSystem.documentDirectory}fonts/`;

export const ARABIC_FONT_FAMILY = 'QuranArabic';

export async function loadArabicFont(): Promise<boolean> {
  try {
    const alreadyLoaded = getJSON<boolean>(FONT_LOADED_KEY);
    const localPath = `${FONT_DIR}quran_arabic.otf`;

    const dirInfo = await FileSystem.getInfoAsync(FONT_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(FONT_DIR, { intermediates: true });
    }

    const fileInfo = await FileSystem.getInfoAsync(localPath);
    if (fileInfo.exists && alreadyLoaded) {
      await Font.loadAsync({ [ARABIC_FONT_FAMILY]: localPath });
      return true;
    }

    const fonts = await getFonts();
    if (fonts.length === 0) return false;

    const font = fonts[0];
    const downloadUrl = font.download_url;

    await FileSystem.downloadAsync(downloadUrl, localPath);
    await Font.loadAsync({ [ARABIC_FONT_FAMILY]: localPath });

    setJSON(FONT_LOADED_KEY, true);
    return true;
  } catch {
    return false;
  }
}
