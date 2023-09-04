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
}

type ID = string

interface State {
  items: ListCartItem[]
  unlistedOwned: ListCartItem[]
  chain: ComputedRef<Prefix>
  decimals: ComputedRef<number>
}

const localStorage = useLocalStorage<ListCartItem[]>('listingCart', [])
export const useListingCartStore = defineStore('listingCart', {
  state: (): State => ({
    items: localStorage.value,
    unlistedOwned: [],
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
      return this.existInItemIndex(id) !== -1
    },
    existInItemIndex(id: string, items?: ListCartItem[]) {
      return (items ?? this.items).findIndex((item) => item.id === id)
    },
    setItem(payload: ListCartItem, toUnlistedOwned = false) {
      const items = toUnlistedOwned ? this.unlistedOwned : this.items
      const existInItemIndex = this.existInItemIndex(payload.id, items)

      if (existInItemIndex === -1) {
        items.push(payload)
        if (!toUnlistedOwned) {
          localStorage.value = items
        }
      }
    },
    addAllToCart() {
      for (const item of this.unlistedOwned) {
        this.setItem(item)
      }
    },
    setFixedPrice(price: number) {
      this.itemsInChain.forEach((item) => {
        item.listPrice = price
      })
    },
    setFloorPrice(adjust = 1) {
      this.itemsInChain.forEach((item) => {
        const floor = (+item.collection.floor || 0) * +adjust.toFixed(2)
        item.listPrice = +(floor / Math.pow(10, this.decimals)).toFixed(4)
      })
    },
    removeItem(id: ID) {
      const existInItemIndex = this.existInItemIndex(id)
      if (existInItemIndex !== -1) {
        this.items.splice(existInItemIndex, 1)
        localStorage.value = this.items
      }
    },
    clear() {
      this.itemsInChain.forEach((item) => {
        this.removeItem(item.id)
      })
    },
  },
})
