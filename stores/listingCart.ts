import { defineStore } from 'pinia'
import type {
  EntityWithId,
  NFTMetadata,
  TokenId,
} from '@/types'

export type ListCartItemMediaUrl = { image: string, mimeType?: string }

type ListCartItemInternal = {
  id: string
  name: string
  urlPrefix: string
  price: string
  listPrice?: number
  sn: string
  collection: EntityWithId
  meta?: NFTMetadata
  metadata?: string
  discarded?: boolean
  mediaUrl?: ListCartItemMediaUrl // used inside the drop page to show the actual nft image before the metadata is updated
}

export type ListCartItem = ListCartItemInternal & TokenId

type ID = string

export const DEFAULT_FLOOR_PRICE_RATE = 1

const localStorage = useLocalStorage<ListCartItem[]>('listingCart', [])

export const useListingCartStore = defineStore('listingCart', () => {
  const {
    items,
    chain,
    decimals,
    count,
    itemsInChain,
    allItemsInChain,
    getItem,
    existInItemIndex,
    isItemInCart,
    setItem,
    setItemDiscardedState,
    removeItem,
    clearDiscardedItems,
    clearItems,
  } = useCart<ListCartItem>({ items: localStorage.value })

  const allUnlistedItems = ref<ListCartItem[]>([])

  const incompleteListPrices = computed(() =>
    itemsInChain.value.filter(item => !item.listPrice).length,
  )

  function setItemPrice({ id, price }: { id: ID, price?: number }) {
    const itemIndex = existInItemIndex(id, items.value)
    if (itemIndex !== -1) {
      items.value[itemIndex].listPrice = price
      localStorage.value = items.value
    }
  }

  function setUnlistedItem(payload: ListCartItem) {
    const itemIndex = existInItemIndex(payload.id, allUnlistedItems.value)
    if (itemIndex === -1) {
      allUnlistedItems.value.push(payload)
    }
  }

  function setUnlistedItems(payload: ListCartItem[]) {
    allUnlistedItems.value = payload
  }

  function addAllToCart() {
    allUnlistedItems.value.forEach(item => setItem(item))
  }

  function setFixedPrice(price: number) {
    itemsInChain.value.forEach((item) => {
      item.listPrice = price
    })
  }

  function setFloorPrice(rate = DEFAULT_FLOOR_PRICE_RATE) {
    itemsInChain.value.forEach((item) => {
      const floor = (Number(item.collection.floor) || 0) * +rate.toFixed(2)
      item.listPrice = Number(
        (floor / Math.pow(10, decimals.value)).toFixed(4),
      )
    })
  }

  function clearListedItems() {
    localStorage.value = []
    clearItems()
  }

  function clear() {
    clearItems()
    localStorage.value = []
    allUnlistedItems.value = []
  }

  return {
    items,
    allUnlistedItems,
    chain,
    decimals,
    allItemsInChain,
    itemsInChain,
    count,
    incompleteListPrices,
    getItem,
    isItemInCart,
    setItem,
    setItemPrice,
    setUnlistedItem,
    setUnlistedItems,
    addAllToCart,
    setFixedPrice,
    setFloorPrice,
    removeItem,
    setItemDiscardedState,
    clearDiscardedItems,
    clearListedItems,
    clear,
  }
})
