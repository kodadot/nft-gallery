import { PinningKey, getKey as getPinningKey } from '@/services/nftStorage'
import { emptyObject, isEmpty } from '@/utils/empty'
import { defineStore } from 'pinia'

const isFromEstuary = (pinningKey: PinningKey) =>
  pinningKey.token.startsWith('EST')

const isExpired = (pinningKey: PinningKey) => {
  if (pinningKey.expiry) {
    const expiry = new Date(pinningKey.expiry)
    return expiry.getTime() < Date.now()
  }

  return false
}

interface State {
  pinningKey: PinningKey
}

export const usePinningStore = defineStore('pinning', {
  state: (): State => ({
    pinningKey: emptyObject<PinningKey>(),
  }),
  getters: {
    getPinningKey: (state) => state.pinningKey?.token,
    isKeyValid: (state) =>
      Boolean(state.pinningKey?.expiry) &&
      new Date(state.pinningKey.expiry).getTime() < Date.now(),
  },
  actions: {
    async fetchPinningKey(address: string): Promise<PinningKey> {
      if (
        isEmpty(this.pinningKey) ||
        isExpired(this.pinningKey) ||
        isFromEstuary(this.pinningKey)
      ) {
        const pinningKey = await getPinningKey(address)
        this.pinningKey = Object.assign({}, pinningKey)
        return pinningKey
      }

      return this.pinningKey
    },
  },
})
