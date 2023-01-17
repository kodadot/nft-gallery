import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'

export const state = () => ({
  lang: {},
  language: {
    userLang: process.env.VUE_APP_I18N_LOCALE || 'en',
  },
})

export type LangState = ReturnType<typeof state>

export const getters: GetterTree<LangState, LangState> = {
  getUserLang: ({ language }: any) => language.userLang || 'en',
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
