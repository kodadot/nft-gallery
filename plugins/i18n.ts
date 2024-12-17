import { i18nManager } from '@/utils/config/i18n'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      i18n: i18nManager,
      t: (key: string, values?: any[]) => i18nManager.t(key, values),
    },
  }
})
