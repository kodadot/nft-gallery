import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'

export const state = (): {
  // Interface
  listed: boolean
  owned: boolean
} => ({
  listed: false,
  owned: false,
})

export type PreferencesState = ReturnType<typeof state>

export const getters: GetterTree<PreferencesState, PreferencesState> = {
  getListed: ({ listed }) => listed,
  getOwned: ({ owned }) => owned,
  getStatusFilters: (state) => ({
    ...state,
  }),
}

export const mutations: MutationTree<PreferencesState> = {
  SET_LISTED: (state, data: boolean) => {
    state.listed = data
  },
  SET_OWNED: (state, data: boolean) => {
    state.owned = data
  },
}

export const actions: ActionTree<PreferencesState, PreferencesState> = {
  setListed({ commit }: { commit: Commit }, data) {
    commit('SET_LISTED', data)
  },
  setOwned({ commit }: { commit: Commit }, data) {
    commit('SET_OWNED', data)
  },
}
