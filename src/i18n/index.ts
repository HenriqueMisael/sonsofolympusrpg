import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonEn from './locales/common/en.json'
import commonPtBr from './locales/common/pt-BR.json'

const resources = {
  en: { common: commonEn },
  'pt-BR': { common: commonPtBr },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt-BR'],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {escapeValue: false},
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n
