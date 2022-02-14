import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'

export const state = () => ({
  explorer: {},
  explorerOptions: {},
})

export type ExplorerState = ReturnType<typeof state>

export const getters: GetterTree<ExplorerState, ExplorerState> = {
  getCurrentChain: ({ explorer }: any) => explorer.chain,
}

export const mutations: MutationTree<ExplorerState> = {
  SET_EXPLORER(state: any, data: any) {
    state.explorer = Object.assign(state.explorer, data)
  },
  SET_EXPLORER_OPTIONS(state: any, data: any) {
    state.explorerOptions = Object.assign({}, data)
  },
}

export const actions: ActionTree<ExplorerState, ExplorerState> = {
  setExplorer({ commit }: { commit: Commit }, data: any) {
    commit('SET_EXPLORER', data)
  },
  setExplorerOptions({ commit }: { commit: Commit }, data: any) {
    commit('SET_EXPLORER_OPTIONS', data)
  },
}
