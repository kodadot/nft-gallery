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
  actions: {
    getItemsByPrefix(prefix: string) {
      return items().filter((item) => item.urlPrefix === prefix)
    },
    isItemInCart(id: ID) {
      return items().find((item) => item.id === id) !== undefined
    },
    setItem(payload: ShoppingCartItem) {
      const existinItemIndex = items().findIndex(
        (item) => item.id === payload.id
      )
      if (existinItemIndex === -1) {
        localStorage.value = [...localStorage.value, payload]
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
        (item) => item.id === payload.id
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
