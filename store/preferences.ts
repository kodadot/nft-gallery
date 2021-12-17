import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'

export const state = (): {layoutClass: string;
}  => ({
  layoutClass: 'is-one-third-desktop is-one-third-tablet',
})

export type PreferencesState = ReturnType<typeof state>

export const getters: GetterTree<PreferencesState, PreferencesState> = {
  getLayoutClass: ({ layoutClass }) => layoutClass,
}

export const mutations: MutationTree<PreferencesState> = {
  SET_LAYOUT_CLASS(state: any, data) {
    state.layoutClass = data
  },
}

export const actions: ActionTree<PreferencesState, PreferencesState> = {
  setLayoutClass({ commit }: { commit: Commit }, data) {
    commit('SET_LAYOUT_CLASS', data)
  },
}
