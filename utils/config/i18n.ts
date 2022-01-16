import Vue from 'vue'
import VueI18n, { LocaleMessages } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import commonData from '@/langDir/all_lang.json'

Vue.use(VueI18n)

const md = MarkdownIt({
  breaks: false,
})

function loadLocaleMessages(): LocaleMessages {
  // File containing data common to ALL languages
  const allLangDataFile = 'all_lang.json'
  const locales = require.context(
    '../../langDir',
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

// const locale = store.getters['lang/getUserLang'];
export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  modifiers: {
    md: (str) => md.renderInline(str),
    common: (str) => str.split('.').reduce((o, i) => o[i], commonData as any),
  },
  messages: loadLocaleMessages(),
})
