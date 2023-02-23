import { defineStore } from 'pinia'

interface State {
  wallet: {
    name: string
  }
}

export const useWalletStore = defineStore('wallet', {
  state: (): State => ({
    wallet: {
      name: '',
    },
  }),
  getters: {
    getWalletName: (state) => state.wallet.name,
  },
  actions: {
    setWalletName(payload) {
      this.wallet = Object.assign(this.wallet, payload)
    },
  },
})
