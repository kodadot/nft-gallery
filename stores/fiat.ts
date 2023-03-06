import { defineStore } from 'pinia'
import { getPrice } from '@/utils/coingecko'

interface State {
  fiatPrice: {
    kusama: {
      usd: string | number | null
    }
    basilisk: {
      usd: string | number | null
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
    },
  }),
  getters: {
    getCurrentKSMValue: (state) => state.fiatPrice.kusama.usd,
    getCurrentBSXValue: (state) => state.fiatPrice.basilisk.usd,
  },
  actions: {
    async fetchFiatPrice() {
      const ksmPrice = await getPrice('kusama')
      this.fiatPrice = Object.assign({}, this.fiatPrice, ksmPrice)
      const bsxPrice = await getPrice('basilisk')
      this.fiatPrice = Object.assign({}, this.fiatPrice, bsxPrice)
    },
    setFiatPrice(payload) {
      this.fiatPrice = Object.assign({}, this.fiatPrice, payload)
    },
  },
})
