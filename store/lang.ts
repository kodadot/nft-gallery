import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'

export const state = () => ({
  lang: {},
  language: {
    userLang: process.env.VUE_APP_I18N_LOCALE || 'en',
    langsFlags: [
      {
        value: 'en',
        flag: '🇬🇧',
        label: 'English',
      },
      {
        value: 'bn',
        flag: '🇧🇩',
        label: 'বাংলা',
      },
      {
        value: 'cn',
        flag: '🇨🇳',
        label: '中文',
      },
      {
        value: 'cz',
        flag: '🇨🇿',
        label: 'Česky',
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
        value: 'jp',
        flag: '🇯🇵',
        label: '日本語',
      },
      {
        value: 'ko',
        flag: '🇰🇷',
        label: '한국어',
      },
      {
        value: 'nl',
        flag: '🇳🇱',
        label: 'Vlaams',
      },
      {
        value: 'pl',
        flag: '🇵🇱',
        label: 'Polski',
      },
      {
        value: 'pt',
        flag: '🇵🇹',
        label: 'Português',
      },
      {
        value: 'sk',
        flag: '🇸🇰',
        label: 'Slovenčina',
      },
      {
        value: 'tu',
        flag: '🇹🇷',
        label: 'Türkçe',
      },
      {
        value: 'ur',
        flag: '🇵🇰',
        label: 'اردو',
      },
      {
        value: 'vt',
        flag: '🇻🇳',
        label: 'Tiếng Việt',
      },
      {
        value: 'ru',
        flag: '🇷🇺',
        label: 'Русский',
      },
      // {
      //   value: 'de',
      //   flag: '🇩🇪',
      //   label: 'Deutsch'
      // },
      // {
      //   value: 'ua',
      //   flag: '🇺🇦',
      //   label: 'Українська'
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
    ],
  },
})

export type LangState = ReturnType<typeof state>

export const getters: GetterTree<LangState, LangState> = {
  getUserLang: ({ language }: any) => language.userLang || 'en',
  getLangsFlags: ({ language }: any) => language.langsFlags,
  getUserFlag: ({ language }: any) => language.langsFlags.find((lang: {value: string}) => lang.value === language.userLang).flag,
}

export const mutations: MutationTree<LangState> = {
  SET_LANGUAGE(state: any, data: any) {
    state.language = Object.assign(state.language, data)
  },
}

export const actions: ActionTree<LangState, LangState> = {
  setLanguage({ commit }: { commit: Commit }, data: any) {
    commit('SET_LANGUAGE', data)
  },
}
