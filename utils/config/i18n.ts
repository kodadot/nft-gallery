import { defineI18nConfig } from '#i18n'
import commonData from '@/locales/all_lang.json'
import MarkdownIt from 'markdown-it'

export const langsFlags = [
  {
    value: 'en',
    flag: '🇬🇧',
    label: 'English',
  },
  {
    value: 'de',
    flag: '🇩🇪',
    label: 'Deutsch',
  },
  {
    value: 'es',
    flag: '🇪🇸',
    label: 'Español',
  },
  {
    value: 'fr',
    flag: '🇫🇷',
    label: 'Français',
  },
]

const md = MarkdownIt({
  breaks: false,
})

export default defineI18nConfig(() => ({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  silentTranslationWarn: true,
  modifiers: {
    md: (str) => md.renderInline(str),
    common: (str) => str.split('.').reduce((o, i) => o[i], commonData),
  },
}))
