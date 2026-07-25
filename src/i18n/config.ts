import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en/translation.json'
import bn from './locales/bn/translation.json'

export const defaultNS = 'translation'

export const resources = {
  en: { translation: en },
  bn: { translation: bn },
} as const

// Adding a locale: drop a `locales/<lng>/translation.json`, import it, add it
// here and to `supportedLngs`. See docs/design/i18n-and-accessibility.md.
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'bn'],
    defaultNS,
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n
