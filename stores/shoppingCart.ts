import { defineStore } from 'pinia'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'

type ID = string

interface State {
  items: ShoppingCartItem[]
  itemToBuy?: ShoppingCartItem
}

const localStorage = useLocalStorage<ShoppingCartItem[]>('shoppingCart', [])
const items = () => localStorage.value

export const useShoppingCartStore = defineStore('shoppingCart', {
  state: (): State => ({
    items: items(),
    itemToBuy: undefined,
  }),
  getters: {
    getItems: () => items(),
    getItemsByPrefix: () => (prefix: string) =>
      items().filter((item) => item.urlPrefix === prefix),
    getItem: () => (id: ID) => items().find((item) => item.id === id),
    isItemInCart: () => (id: ID) =>
      items().find((item) => item.id === id) !== undefined,
    getItemToBuy: ({ itemToBuy }) => itemToBuy,
  },

  actions: {
    setItem(payload: ShoppingCartItem) {
      const existinItemIndex = items().findIndex(
        (item) => item.id === payload.id,
      )
      if (existinItemIndex === -1) {
        localStorage.value = [...localStorage.value, payload]
      } else {
        const items = [...localStorage.value]
        items[existinItemIndex] = payload
        localStorage.value = items
      }
    },
    setItemToBuy(payload: ShoppingCartItem) {
      this.itemToBuy = payload
    },
    removeItemToBuy() {
      this.itemToBuy = undefined
    },
    updateItem(payload: ShoppingCartItem) {
      const existinItemIndex = items().findIndex(
        (item) => item.id === payload.id,
      )
      if (existinItemIndex === -1) {
        return
      } else {
        const items = [...localStorage.value]
        items[existinItemIndex] = {
          ...this.items[existinItemIndex],
          ...payload,
        }
        localStorage.value = items
      }
    },
    removeItem(id: ID) {
      const existinItemIndex = items().findIndex((item) => item.id === id)
      if (existinItemIndex === -1) {
        return
      } else {
        const items = [...localStorage.value]
        items.splice(existinItemIndex, 1)
        localStorage.value = items
      }
    },
    clear() {
      localStorage.value = []
      this.itemToBuy = undefined
      this.items = []
    },
    setItems(payload: ShoppingCartItem[]) {
      localStorage.value = payload
    },
  },
})
