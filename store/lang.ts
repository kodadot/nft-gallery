import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'
import { langsFlags } from '@/utils/config/i18n'
export const state = () => ({
  lang: {},
  language: {
    userLang: process.env.VUE_APP_I18N_LOCALE || 'en',
  },
})

export type LangState = ReturnType<typeof state>

export const getters: GetterTree<LangState, LangState> = {
  getUserLang: ({ language }: any) => language.userLang || 'en',
  getUserFlag: ({ language }: any) =>
    langsFlags.find((lang) => lang.value === language.userLang)?.flag ||
    langsFlags[0].flag,
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
