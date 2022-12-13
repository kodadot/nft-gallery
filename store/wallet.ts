import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'

export const state = (): {
  wallet: {
    name: string
  }
} => ({
  wallet: {
    name: '',
  },
})

export type WalletState = ReturnType<typeof state>

export const getters: GetterTree<WalletState, WalletState> = {
  getWalletName: ({ wallet }: any) => wallet.name,
}

export const mutations: MutationTree<WalletState> = {
  SET_WALLET_NAME(state: any, data: any) {
    state.wallet = Object.assign(state.wallet, data)
  },
}

export const actions: ActionTree<WalletState, WalletState> = {
  setWalletName({ commit }: { commit: Commit }, data: any) {
    commit('SET_WALLET_NAME', data)
  },
}
