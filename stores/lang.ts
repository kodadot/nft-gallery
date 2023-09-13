import { defineStore } from 'pinia'
import { langsFlags } from '@/utils/config/i18n'

interface State {
  language: {
    userLang: string
  }
}

export const useLangStore = defineStore('lang', {
  state: (): State => ({
    language: {
      userLang: process.env.VUE_APP_I18N_LOCALE || 'en',
    },
  }),
  getters: {
    getUserLang: (state) => state.language.userLang || 'en',
    getUserFlag: (state) =>
      langsFlags.find((lang) => lang.value === state.language.userLang)?.flag ||
      langsFlags[0].flag,
  },
  actions: {
    setLanguage({ userLang }) {
      const { $i18n } = useNuxtApp()
      const { setLocale } = useI18n()
      $i18n.locale.value = userLang
      setLocale(userLang)
      this.language = {
        userLang,
      }
    },
  },
})
