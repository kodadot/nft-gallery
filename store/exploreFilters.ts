import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'

export const state = (): {
  // status
  listed: boolean
  owned: boolean
  //price
  min: number | undefined
  max: number | undefined
} => ({
  listed: false,
  owned: false,
  min: undefined,
  max: undefined,
})

export type PreferencesState = ReturnType<typeof state>

export const getters: GetterTree<PreferencesState, PreferencesState> = {
  getListed: ({ listed }) => listed,
  getOwned: ({ owned }) => owned,
  getStatusFilters: ({ listed, owned }) => ({ listed, owned }),
  getMin: ({ min }) => min,
  getMax: ({ max }) => max,
  getPriceRange: ({ min, max }) => ({ min, max }),
}

export const mutations: MutationTree<PreferencesState> = {
  SET_LISTED: (state, data: boolean) => {
    state.listed = data
  },
  SET_OWNED: (state, data: boolean) => {
    state.owned = data
  },
  SET_MIN: (state, data: number | undefined) => {
    state.min = data
  },
  SET_MAX: (state, data: number | undefined) => {
    state.max = data
  },
}

export const actions: ActionTree<PreferencesState, PreferencesState> = {
  setListed({ commit }: { commit: Commit }, data) {
    commit('SET_LISTED', data)
  },
  setOwned({ commit }: { commit: Commit }, data) {
    commit('SET_OWNED', data)
  },
  setMin({ commit }: { commit: Commit }, data) {
    commit('SET_MIN', data)
  },
  setMax({ commit }: { commit: Commit }, data) {
    commit('SET_MAX', data)
  },
  setPriceRange({ commit }: { commit: Commit }, data) {
    commit('SET_MIN', data.min)
    commit('SET_MAX', data.max)
  },
}
