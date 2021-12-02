import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'

export const state = () => ({
  chainProperties: {},
})

export type ChainState = ReturnType<typeof state>;

export const getters: GetterTree<ChainState, ChainState> = {
  getChainProperties: ({ chainProperties }: any ) => chainProperties,
  getChainProperties58Format: ({ chainProperties }: any ) => chainProperties.ss58Format,
  getChainPropertiesTokenDecimals: ({ chainProperties }: any ) => chainProperties.tokenDecimals,
};

export const mutations: MutationTree<ChainState> = {
  SET_CHAIN_PROPERTIES(state: any, data: any) {
    state.chainProperties = Object.assign({}, data)
  },
};

export const actions: ActionTree<ChainState, ChainState> = {
  setChainProperties({ commit }: { commit: Commit }, data: any) {
    commit('SET_CHAIN_PROPERTIES', data);
  },
};
