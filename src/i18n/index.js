import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import tr from './locales/tr.json';
import en from './locales/en.json';
import ru from './locales/ru.json';
import ar from './locales/ar.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ru', label: 'Русский', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

// Keeps <html lang> / <html dir> in sync with the active language — this is
// what makes Tailwind's rtl: variants and native flexbox mirroring kick in
// for Arabic without any extra plumbing per component.
export function applyDocumentDirection(lng) {
  const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lng) || SUPPORTED_LANGUAGES[0];
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
      ru: { translation: ru },
      ar: { translation: ar },
    },
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en', 'ru', 'ar'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mutlukal_lang',
    },
  });

applyDocumentDirection(i18n.resolvedLanguage || 'tr');

i18n.on('languageChanged', (lng) => {
  applyDocumentDirection(lng);
});

export default i18n;
