import { GetterTree, MutationTree } from 'vuex'

export const state = () => ({
  loading: false,
  keyringLoaded: false,
  chainProperties: {},
  development: {},
  error: null,
  isApiConnected: false,
})

export type IndexState = ReturnType<typeof state>

export const mutations: MutationTree<IndexState> = {
  keyringLoaded(state: any): void {
    state.keyringLoaded = true
  },
  setDevelopment(state: any, data: any): void {
    state.development = Object.assign(state.development, data)
  },
  setLoading(state: any, toggleTo: boolean): void {
    state.loading = toggleTo
  },
  setApiConnected(state, toggleTo: boolean): void {
    state.isApiConnected = toggleTo
  },
  setError(state: any, error: Error): void {
    state.loading = false
    state.error = error.message
    state.isApiConnected = false
  },
}

export const actions = {}

export const getters: GetterTree<IndexState, IndexState> = {
  getApiConnected(state: IndexState): boolean {
    return state.isApiConnected
  },
}
