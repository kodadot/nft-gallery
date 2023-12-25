import { defineStore } from 'pinia'

type FiatPrice = string | number | null

interface State {
  fiatPrice: {
    kusama: {
      usd: FiatPrice
    }
    basilisk: {
      usd: FiatPrice
    }
    polkadot: {
      usd: FiatPrice
    }
  }
}

export const useFiatStore = defineStore('fiat', {
  state: (): State => ({
    fiatPrice: {
      kusama: {
        usd: null,
      },
      basilisk: {
        usd: null,
      },
      polkadot: {
        usd: null,
      },
    },
  }),
  getters: {
    incompleteFiatValues(): boolean {
      return (
        this.getCurrentKSMValue === null ||
        this.getCurrentDOTValue === null ||
        this.getCurrentBSXValue === null
      )
    },
    getCurrentKSMValue: (state): FiatPrice => state.fiatPrice.kusama.usd,
    getCurrentBSXValue: (state): FiatPrice => state.fiatPrice.basilisk.usd,
    getCurrentDOTValue: (state): FiatPrice => state.fiatPrice.polkadot.usd,
    getCurrentROCValue: (_state): FiatPrice => 0,
    getCurrentTokenValue:
      (state) =>
      (token: string): FiatPrice => {
        switch (token) {
          case 'KSM':
            return state.fiatPrice.kusama.usd
          case 'BSX':
            return state.fiatPrice.basilisk.usd
          case 'DOT':
            return state.fiatPrice.polkadot.usd
          default:
            return 0
        }
      },
  },
  actions: {
    async fetchFiatPrice() {
      const ksmPrice = await getPrice('kusama')
      this.fiatPrice = Object.assign({}, this.fiatPrice, ksmPrice)
      const dotPrice = await getPrice('polkadot')
      this.fiatPrice = Object.assign({}, this.fiatPrice, dotPrice)
    },
    setFiatPrice(payload) {
      this.fiatPrice = Object.assign({}, this.fiatPrice, payload)
    },
  },
})
