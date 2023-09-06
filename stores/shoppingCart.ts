import { defineStore } from 'pinia'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'
import { existInItemIndex } from '@/components/common/shoppingCart/utils'

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
      return this.items.filter((item) => item.urlPrefix === prefix)
    },
    isItemInCart(id: ID) {
      return this.items.find((item) => item.id === id) !== undefined
    },
    setItem(payload: ShoppingCartItem) {
      const itemIndex = existInItemIndex(payload.id, this.items)
      if (itemIndex === -1) {
        this.items.push(payload)
        localStorage.value = this.items
      }
    },
    setItemToBuy(payload: ShoppingCartItem) {
      this.itemToBuy = payload
    },
    removeItemToBuy() {
      this.itemToBuy = undefined
    },
    updateItem(payload: ShoppingCartItem) {
      const itemIndex = existInItemIndex(payload.id, this.items)
      if (itemIndex === -1) {
        return
      } else {
        this.items[itemIndex] = {
          ...this.items[itemIndex],
          ...payload,
        }
        localStorage.value = this.items
      }
    },
    removeItem(id: ID) {
      const itemIndex = existInItemIndex(id, this.items)
      if (itemIndex === -1) {
        return
      } else {
        this.items.splice(itemIndex, 1)
        localStorage.value = this.items
      }
    },
    clear() {
      localStorage.value = []
      this.itemToBuy = undefined
      this.items = []
    },
    setItems(payload: ShoppingCartItem[]) {
      this.items = payload
      localStorage.value = this.items
    },
  },
})
