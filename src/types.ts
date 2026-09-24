export type AppTab = 'inicio' | 'procurar' | 'biblioteca' | 'config';

export type FontSizeSetting = 'normal' | 'grande' | 'gigante';

export type LanguageSetting = 'pt' | 'en' | 'es';

export interface HistoryItem {
  id: string;
  type: 'sos' | 'traducao';
  timestamp: string; // HH:MM:SS DD/MM/YYYY
  originalText?: string;
  translatedText: string;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
}

export interface AppConfig {
  modoNoiteVermelho: boolean;
  fontSize: FontSizeSetting;
  language: LanguageSetting;
}

export interface TranslationMapping {
  keywords: string[];
  simplified: string;
  emoji: string;
}

