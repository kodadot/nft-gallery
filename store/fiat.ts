import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'
import { getKsmPrice } from '@/coingecko'

export const state = () => ({
  fiatPrice: {
    kusama: {
      usd: null,
    },
  },
})

export type FiatState = ReturnType<typeof state>

export const getters: GetterTree<FiatState, FiatState> = {
  getCurrentKSMValue: (state) => state.fiatPrice.kusama.usd,
}

export const mutations: MutationTree<FiatState> = {
  SET_FIAT_PRICE(state, data: any) {
    state.fiatPrice = Object.assign({}, state.fiatPrice, data)
    // or
    // state.fiatPrice = data
  },
}

export const actions: ActionTree<FiatState, FiatState> = {
  async fetchFiatPrice({ commit }: { commit: Commit }) {
    const ksmPrice = await getKsmPrice()
    commit('SET_FIAT_PRICE', ksmPrice)
  },
  setFiatPrice({ commit }: { commit: Commit }, data: any) {
    commit('SET_FIAT_PRICE', data)
  },
}
