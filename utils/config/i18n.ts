import MarkdownIt from 'markdown-it'
import commonData from '@/locales/all_lang.json'

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

const md = MarkdownIt({
  breaks: false,
})

type TranslationMessages = { [key: string]: any }

class I18nManager {
  private messages: { [locale: string]: TranslationMessages } = {}
  private currentLocale: string = process.env.VUE_APP_I18N_LOCALE || 'en'

  constructor() {
    this.loadMessages()
  }

  private loadMessages() {
    for (const [key, value] of Object.entries(locales)) {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i)
      if (matched && matched.length > 1) {
        const locale = matched[1]
        if (locale === 'all_lang') {
          continue
        }
        this.messages[locale] = value.default
      }
    }
  }

  public t(key: string, values?: any[] | Record<string, any>): string {
    const keys = key.split('.')
    let message = this.messages[this.currentLocale]

    for (const k of keys) {
      if (!message) return key
      message = message[k]
    }

    if (!message) return key

    if (Array.isArray(values) && values.length > 0) {
      return this.interpolateArray(message, values)
    }
    else if (values && typeof values === 'object') {
      return this.interpolateObject(message, values)
    }

    return message
  }

  private interpolateArray(message: string, values: any[]): string {
    return message.replace(/\{(\d+)\}/g, (_, index) => values[parseInt(index)] || '')
  }

  private interpolateObject(message: string, values: Record<string, any>): string {
    return message.replace(/\{([^}]+)\}/g, (_, key) => values[key] || '')
  }

  public setLocale(locale: string) {
    if (this.messages[locale]) {
      this.currentLocale = locale
      if (import.meta.client) {
        localStorage.setItem('userLocale', locale)
      }
    }
  }

  public get locale() {
    return {
      value: this.currentLocale,
    }
  }

  public renderMarkdown(str: string): string {
    return md.renderInline(str)
  }

  public getCommonData(str: string): any {
    return str.split('.').reduce((o, i) => o[i], commonData)
  }

  public modifiers = {
    md: (str: string) => this.renderMarkdown(str),
    common: (str: string) => this.getCommonData(str),
  }
}

// Create singleton instance
export const i18nManager = new I18nManager()

export const setUserLocale = (locale: string) => {
  const preferenceStore = usePreferencesStore()
  preferenceStore.setUserLocale(locale)
  i18nManager.setLocale(locale)
}

// Composable for use in components
export const useI18n = () => {
  const nuxtApp = useNuxtApp()
  return {
    t: (key: string, values?: any[] | Record<string, any>) => nuxtApp.$t(key, values),
    locale: nuxtApp.$i18n.locale,
    setLocale: (locale: string) => nuxtApp.$i18n.setLocale(locale),
  }
}

export default i18nManager
