import { LocaleMessages } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import commonData from '@/locales/all_lang.json'

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

function loadLocaleMessages(): LocaleMessages {
  // File containing data common to ALL languages
  const allLangDataFile = 'all_lang.json'
  const locales = require.context(
    '../../locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages: LocaleMessages = {}
  locales.keys().forEach((key) => {
    if (key === allLangDataFile) {
      return
    }
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export default () => {
  return {
    locale: process.env.VUE_APP_I18N_LOCALE || 'en',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    silentTranslationWarn: true,
    modifiers: {
      md: (str) => md.renderInline(str),
      common: (str) => str.split('.').reduce((o, i) => o[i], commonData),
    },
    messages: loadLocaleMessages(),
  }
}
