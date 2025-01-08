import MarkdownIt from 'markdown-it'
import commonData from '@/i18n/locales/all_lang.json'

const locales = import.meta.glob('./i18n/locales/*.json', { eager: true })
const md = MarkdownIt({
  breaks: false,
})
function getMessages() {
  const messages: { [x: string]: string } = {}
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
  skipSettingLocaleOnNavigate: true,
  warnHtmlMessage: false,
  defaultLocale: 'en',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'lang',
    fallbackLocale: 'en',
    alwaysRedirect: true,
  },
  strategy: 'no_prefix',
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  silentTranslationWarn: true,
  modifiers: {
    md: str => md.renderInline(str),
    common: str => str.split('.').reduce((o, i) => o[i], commonData),
  },
  messages: getMessages(),
}))
