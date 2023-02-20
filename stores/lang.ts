import { defineStore } from 'pinia'
import { langsFlags } from '@/utils/config/i18n'

interface State {
  lang: Record<any, any>
  language: {
    userLang: string
  }
}

export const useLangStore = defineStore('lang', {
  state: (): State => ({
    lang: {},
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
    setLanguage(payload) {
      this.language = Object.assign(this.language, payload)
    },
  },
})
