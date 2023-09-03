import { defineStore } from 'pinia'
import { EntityWithId } from '~/components/rmrk/service/scheme'
import { ComputedRef } from 'vue'
import type { Prefix } from '@kodadot1/static'

export type ListCartItem = {
  id: string
  name: string
  urlPrefix: string
  price: string
  listPrice?: number
  collection: EntityWithId
}

type ID = string

interface State {
  items: ListCartItem[]
  owned: ListCartItem[]
  chain: ComputedRef<Prefix>
}

const localStorage = useLocalStorage<ListCartItem[]>('listingCart', [])
export const useListingCartStore = defineStore('listingCart', {
  state: (): State => ({
    items: localStorage.value,
    owned: [],
    chain: usePrefix().urlPrefix,
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
    existInItemIndex(id: string) {
      return this.items.findIndex((item) => item.id === id)
    },
    setItem(payload: ListCartItem) {
      const existInItemIndex = this.existInItemIndex(payload.id)
      if (existInItemIndex === -1) {
        this.items.push(payload)
        localStorage.value = this.items
      } else {
        this.updateItem(payload)
      }
    },
    addAllToCart() {
      for (const item of this.owned) {
        this.setItem(item)
      }
    },
    updateItem(payload: ListCartItem) {
      const existInItemIndex = this.existInItemIndex(payload.id)
      if (existInItemIndex !== -1) {
        this.items[existInItemIndex] = {
          ...this.items[existInItemIndex],
          ...payload,
        }
        localStorage.value = this.items
      }
    },
    setFixedPrice(price: number) {
      this.itemsInChain.forEach((item) => {
        item.listPrice = price
      })
    },
    setFloorPrice(adjust = 1) {
      this.itemsInChain.forEach((item) => {
        item.listPrice = this.inTrillions(
          Number(item.collection.floor ?? 0) * adjust
        )
      })
    },
    inTrillions(number: number) {
      return +(+number / 1e12).toFixed(2)
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
