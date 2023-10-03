import { defineStore } from 'pinia'
import { EntityWithId, NFTMetadata } from '@/components/rmrk/service/scheme'
import { ComputedRef } from 'vue'
import type { Prefix } from '@kodadot1/static'

export type ListCartItem = {
  id: string
  name: string
  urlPrefix: string
  price: string
  listPrice: number | null
  collection: EntityWithId
  meta?: NFTMetadata
  metadata?: string
}

type ID = string

interface State {
  items: ListCartItem[]
  allUnlistedItems: ListCartItem[]
  chain: ComputedRef<Prefix>
  decimals: ComputedRef<number>
}

const localStorage = useLocalStorage<ListCartItem[]>('listingCart', [])
export const useListingCartStore = defineStore('listingCart', {
  state: (): State => ({
    items: localStorage.value,
    allUnlistedItems: [],
    chain: usePrefix().urlPrefix,
    decimals: useChain().decimals,
  }),
  getters: {
    itemsInChain: (state): ListCartItem[] =>
      state.items.filter((item) => item.urlPrefix === state.chain),
    count() {
      return this.itemsInChain.length
    },
    incompleteListPrices: (state) =>
      state.items.filter((item) => !item.listPrice).length,
  },
  actions: {
    getItem(id: ID) {
      return this.items.find((item) => item.id === id)
    },
    isItemInCart(id: ID) {
      return existInItemIndex(id, this.items) !== -1
    },
    setItem(payload: ListCartItem) {
      const itemIndex = existInItemIndex(payload.id, this.items)
      if (itemIndex === -1) {
        this.items.push(payload)
        localStorage.value = this.items
      }
    },
    setUnlistedItem(payload: ListCartItem) {
      const itemIndex = existInItemIndex(payload.id, this.allUnlistedItems)
      if (itemIndex === -1) {
        this.allUnlistedItems.push(payload)
      }
    },
    setUnlistedItems(payload: ListCartItem[]) {
      this.allUnlistedItems = payload
    },
    addAllToCart() {
      this.allUnlistedItems.forEach((item) => this.setItem(item))
    },
    setFixedPrice(price: number | null) {
      this.itemsInChain.forEach((item) => {
        item.listPrice = price
      })
    },
    setFloorPrice(rate = 1) {
      this.itemsInChain.forEach((item) => {
        const floor = (Number(item.collection.floor) || 0) * +rate.toFixed(2)
        item.listPrice = Number(
          (floor / Math.pow(10, this.decimals)).toFixed(4)
        )
      })
    },
    removeItem(id: ID) {
      const itemIndex = existInItemIndex(id, this.items)
      if (itemIndex !== -1) {
        this.items.splice(itemIndex, 1)
        localStorage.value = this.items
      }
    },
    clearListedItems() {
      localStorage.value = []
      this.items = []
    },
    clear() {
      localStorage.value = []
      this.items = []
      this.allUnlistedItems = []
    },
  },
})

function existInItemIndex(id: string, items: ListCartItem[]) {
  return items.findIndex((item) => item.id === id)
}
