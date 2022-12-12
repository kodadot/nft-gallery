import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'
import { getBsxPrice, getKsmPrice } from '@/utils/coingecko'

export const state = () => ({
  fiatPrice: {
    kusama: {
      usd: null,
    },
    basilisk: {
      usd: null,
    },
  },
})

export type FiatState = ReturnType<typeof state>

export const getters: GetterTree<FiatState, FiatState> = {
  getCurrentKSMValue: (state) => state.fiatPrice.kusama.usd,
  getCurrentBSXValue: (state) => state.fiatPrice.basilisk.usd,
}

export const mutations: MutationTree<FiatState> = {
  SET_FIAT_PRICE(state, data: any) {
    state.fiatPrice = Object.assign({}, state.fiatPrice, data)
  },
}

export const actions: ActionTree<FiatState, FiatState> = {
  async fetchFiatPrice({ commit }: { commit: Commit }) {
    const ksmPrice = await getKsmPrice()
    commit('SET_FIAT_PRICE', ksmPrice)
    const bsxPrice = await getBsxPrice()
    commit('SET_FIAT_PRICE', bsxPrice)
  },
  setFiatPrice({ commit }: { commit: Commit }, data: any) {
    commit('SET_FIAT_PRICE', data)
  },
}
