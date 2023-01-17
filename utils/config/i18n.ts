import { LocaleMessages } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import commonData from '@/locales/all_lang.json'

export const langsFlags = [
  {
    value: 'en',
    flag: '🇬🇧',
    label: 'English',
  },
  // {
  //   value: 'bn',
  //   flag: '🇧🇩',
  //   label: 'বাংলা',
  // },
  {
    value: 'de',
    flag: '🇩🇪',
    label: 'Deutsch',
  },
  // {
  //   value: 'cn',
  //   flag: '🇨🇳',
  //   label: '中文',
  // },
  // {
  //   value: 'cz',
  //   flag: '🇨🇿',
  //   label: 'Česky',
  // },
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
  // {
  //   value: 'id',
  //   flag: '🇮🇩',
  //   label: 'Indonesia',
  // },
  // {
  //   value: 'jp',
  //   flag: '🇯🇵',
  //   label: '日本語',
  // },
  // {
  //   value: 'ko',
  //   flag: '🇰🇷',
  //   label: '한국어',
  // },
  // {
  //   value: 'nl',
  //   flag: '🇳🇱',
  //   label: 'Vlaams',
  // },
  // {
  //   value: 'pl',
  //   flag: '🇵🇱',
  //   label: 'Polski',
  // },
  // {
  //   value: 'pt',
  //   flag: '🇵🇹',
  //   label: 'Português',
  // },
  // {
  //   value: 'sk',
  //   flag: '🇸🇰',
  //   label: 'Slovenčina',
  // },
  // {
  //   value: 'tu',
  //   flag: '🇹🇷',
  //   label: 'Türkçe',
  // },
  // {
  //   value: 'ur',
  //   flag: '🇵🇰',
  //   label: 'اردو',
  // },
  // {
  //   value: 'vt',
  //   flag: '🇻🇳',
  //   label: 'Tiếng Việt',
  // },
  // {
  //   value: 'ru',
  //   flag: '🇷🇺',
  //   label: 'Русский',
  // },
  // {
  //   value: 'ua',
  //   flag: '🇺🇦',
  //   label: 'Українська',
  // },
  // {
  //   value: 'it',
  //   flag: '🇮🇹',
  //   label: 'Italiano'
  // },
  // {
  //   value: 'hi',
  //   flag: '🇮🇳',
  //   label: 'हिन्दी'
  // }
]

const md = MarkdownIt({
  breaks: false,
})

export const getLangsFlags = () => langsFlags

export const getUserFlag = (userLang: string) =>
  langsFlags.find((lang) => lang.value === userLang)?.flag || langsFlags[0].flag

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
