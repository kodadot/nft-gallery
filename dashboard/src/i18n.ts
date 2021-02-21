import Vue from 'vue'
import VueI18n, { LocaleMessages } from 'vue-i18n'
import store from '@/store'
import MarkdownIt from 'markdown-it';

Vue.use(VueI18n)
const md = new MarkdownIt('commonmark');
function loadLocaleMessages (): LocaleMessages {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages: LocaleMessages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

// toto moze brat vue s vuexu teoretisch
// const locale = store.getters.getUserLang;
export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  modifiers: {
    md: (str) => md.render(str)
  },
  messages: loadLocaleMessages()
})
