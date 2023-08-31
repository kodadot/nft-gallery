import { defineStore } from 'pinia'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'

type ID = string

interface State {
  items: ShoppingCartItem[]
}

const localStorage = useLocalStorage<ShoppingCartItem[]>('listingCart', [])
const items = () => localStorage.value

export const useListingCartStore = defineStore('listingCart', {
  state: (): State => ({
    items: items(),
  }),
  getters: {
    getItems: () => items(),
    getItemsByPrefix: () => (prefix: string) =>
      items().filter((item) => item.urlPrefix === prefix),
    getItem: () => (id: ID) => items().find((item) => item.id === id),
    isItemInCart: () => (id: ID) =>
      items().find((item) => item.id === id) !== undefined,
  },

  actions: {
    setItem(payload: ShoppingCartItem) {
      const existInItemIndex = this.items.findIndex(
        (item) => item.id === payload.id
      )
      if (existInItemIndex === -1) {
        this.items.push(payload)
        localStorage.value = this.items
      } else {
        this.items[existInItemIndex] = payload
        localStorage.value = this.items
      }
    },
    updateItem(payload: ShoppingCartItem) {
      const existInItemIndex = items().findIndex(
        (item) => item.id === payload.id
      )
      if (existInItemIndex === -1) {
        return
      } else {
        this.items[existInItemIndex] = {
          ...this.items[existInItemIndex],
          ...payload,
        }
        localStorage.value = this.items
      }
    },
    removeItem(id: ID) {
      const existInItemIndex = this.items.findIndex((item) => item.id === id)
      if (existInItemIndex === -1) {
        return
      } else {
        this.items.splice(existInItemIndex, 1)
        localStorage.value = this.items
      }
    },
    clear() {
      localStorage.value = []
      this.items = []
    },
    setItems(payload: ShoppingCartItem[]) {
      this.items = payload
      localStorage.value = this.items
    },
  },
})
