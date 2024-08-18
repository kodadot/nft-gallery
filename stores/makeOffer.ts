import { defineStore } from 'pinia'
import type { Prefix } from '@kodadot1/static'
import type { MakingOfferItem } from '@/components/offer/types'

type ID = string

interface State {
  items: MakingOfferItem[]
  chain: ComputedRef<Prefix>
}

export const useMakingOfferStore = defineStore('makingOffer', {
  state: (): State => ({
    items: [],
    chain: usePrefix().urlPrefix,
  }),
  getters: {
    getItems: state => state.items,
    getItem: state => (id: ID) => state.items.find(item => item.id === id),
    allItemsInChain: (state): MakingOfferItem[] =>
      state.items.filter(item => item.urlPrefix === state.chain),
    itemsInChain(): MakingOfferItem[] {
      return this.allItemsInChain
    },
    count() {
      return this.itemsInChain.length
    },
    hasInvalidOfferPrices(): boolean {
      return this.itemsInChain.some(item => Number(item.offerPrice || 0) <= 0)
    },
  },

  actions: {
    setItem(payload: MakingOfferItem) {
      const existingItemIndex = this.items.findIndex(
        item => item.id === payload.id,
      )
      if (existingItemIndex === -1) {
        this.items = [...this.items, payload]
      }
      else {
        const items = [...this.items]
        items[existingItemIndex] = payload
        this.items = items
      }
    },
    updateItem(payload: Partial<MakingOfferItem>) {
      const existingItemIndex = this.items.findIndex(
        item => item.id === payload.id,
      )
      if (existingItemIndex === -1) {
        return
      }
      else {
        const items = [...this.items]
        items[existingItemIndex] = {
          ...this.items[existingItemIndex],
          ...payload,
        }
        this.items = items
      }
    },
    removeItem(id: ID) {
      const existingItemIndex = this.items.findIndex(item => item.id === id)
      if (existingItemIndex === -1) {
        return
      }
      else {
        const items = [...this.items]
        items.splice(existingItemIndex, 1)
        this.items = items
      }
    },
    clear() {
      this.items = []
    },
  },
})
