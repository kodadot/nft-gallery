import { LocaleMessages, VueMessageType, defineI18nConfig } from '#i18n'
import commonData from '@/locales/all_lang.json'
import MarkdownIt from 'markdown-it'
const locales = import.meta.glob('../../locales/*.json', { eager: true })
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
  {
    value: 'hi',
    flag: '🇮🇳',
    label: 'हिंदी',
  },
]

export const setUserLocale = (locale: string) => {
  const { $i18n } = useNuxtApp()
  const preferenceStore = usePreferencesStore()
  preferenceStore.setUserLocale(locale)
  $i18n.locale.value = locale
}

const md = MarkdownIt({
  breaks: false,
})
function getMessages() {
  const messages: { [x: string]: LocaleMessages<VueMessageType> } = {}
  for (const [key, value] of Object.entries(locales)) {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      if (locale === 'all_lang') {
        continue
      }
      messages[locale] = value.default
    }
  }
  return messages
}

export default defineI18nConfig(() => ({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  silentTranslationWarn: true,
  modifiers: {
    md: (str) => md.renderInline(str),
    common: (str) => str.split('.').reduce((o, i) => o[i], commonData),
  },
  messages: getMessages(),
  warnHtmlInMessage: false,
  warnHtmlMessage: false,
}))
