import { defineStore } from 'pinia'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'

type ID = string

interface State {
  items: ShoppingCartItem[]
}

const localStorage = useLocalStorage<ShoppingCartItem[]>('listingCart', [])
export const useListingCartStore = defineStore('listingCart', {
  state: (): State => ({
    items: localStorage.value,
  }),
  getters: {
    count: (state) => state.items.length,
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
    setItem(payload: ShoppingCartItem) {
      const existInItemIndex = this.existInItemIndex(payload.id)
      if (existInItemIndex === -1) {
        this.items.push(payload)
        localStorage.value = this.items
      } else {
        this.items[existInItemIndex] = payload
        localStorage.value = this.items
      }
    },
    updateItem(payload: ShoppingCartItem) {
      const existInItemIndex = this.existInItemIndex(payload.id)
      if (existInItemIndex !== -1) {
        this.items[existInItemIndex] = {
          ...this.items[existInItemIndex],
          ...payload,
        }
        localStorage.value = this.items
      }
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
    setItems(payload: ShoppingCartItem[]) {
      this.items = payload
      localStorage.value = this.items
    },
  },
})
