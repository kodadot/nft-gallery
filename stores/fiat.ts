import { defineStore } from 'pinia'
import type { TokenName } from '~/utils/coinprice'

type FiatPrice = string | number | null

interface State {
  fiatPrice: Record<TokenName, {
    usd: FiatPrice
  }>
}

export const useFiatStore = defineStore('fiat', {
  state: (): State => ({
    fiatPrice: {
      kusama: {
        usd: null,
      },
      polkadot: {
        usd: null,
      },
      ethereum: {
        usd: null,
      },
      mantle: {
        usd: null,
      },
    },
  }),
  getters: {
    incompleteFiatValues(): boolean {
      return (
        this.getCurrentKSMValue === null || this.getCurrentDOTValue === null
      )
    },
    getCurrentKSMValue: (state): FiatPrice => state.fiatPrice.kusama.usd,
    getCurrentDOTValue: (state): FiatPrice => state.fiatPrice.polkadot.usd,
    getCurrentROCValue: (_state): FiatPrice => 0,
    getCurrentTokenValue:
      state =>
        (token: Token): FiatPrice => {
          switch (token) {
            case 'KSM':
              return state.fiatPrice.kusama.usd
            case 'DOT':
              return state.fiatPrice.polkadot.usd
            case 'ETH':
              return state.fiatPrice.ethereum.usd
            case 'MNT':
              return state.fiatPrice.mantle.usd
            default:
              return 0
          }
        },
  },
  actions: {
    async fetchFiatPrice() {
      const prices = await Promise.all(
        (['kusama', 'polkadot', 'ethereum', 'mantle'] as TokenName[]).map(getPrice),
      )
      prices.forEach((price) => {
        this.fiatPrice = Object.assign({}, this.fiatPrice, price)
      })
    },
    setFiatPrice(payload) {
      this.fiatPrice = Object.assign({}, this.fiatPrice, payload)
    },
  },
})
