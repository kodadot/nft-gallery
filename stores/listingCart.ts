import { defineStore } from 'pinia'
import { EntityWithId } from '~/components/rmrk/service/scheme'
import { set } from 'vue'
export type ListCartItem = {
  id: string
  name: string
  urlPrefix: string
  price: number
  listPrice?: number
  collection: EntityWithId
}

type ID = string

interface State {
  items: ListCartItem[]
}

const localStorage = useLocalStorage<ListCartItem[]>('listingCart', [])
export const useListingCartStore = defineStore('listingCart', {
  state: (): State => ({
    items: localStorage.value,
  }),
  getters: {
    count: (state) => state.items.length,
    incompleteListPrices: (state) =>
      state.items.filter((item) => !item.listPrice).length,
  },
  actions: {
    getItemsByPrefix(prefix: string) {
      this.items.filter((item) => item.urlPrefix === prefix)
    },
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
      for (const item of this.items) {
        set(item, 'listPrice', price)
      }
    },
    setFloorPrice(adjust = 1) {
      for (const item of this.items) {
        set(
          item,
          'listPrice',
          this.round(Number(item.collection.floor ?? 0) * adjust)
        )
      }
    },
    round(number) {
      return +(+number / 1000000000000).toFixed(12)
    },
    removeItem(id: ID) {
      const existInItemIndex = this.existInItemIndex(id)
      if (existInItemIndex !== -1) {
        this.items.splice(existInItemIndex, 1)
        localStorage.value = this.items
      }
    },
    clear() {
      this.items = []
      localStorage.value = []
    },
    setItems(payload: ListCartItem[]) {
      this.items = payload
      localStorage.value = this.items
    },
  },
})
