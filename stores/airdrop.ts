import { defineStore } from 'pinia'

import type { ListCartItem } from '@/stores/listingCart'

const sessionStorage = useStorage<ListCartItem[]>('airdrop', [], 'sessionStorage')

export const useAirdropStore = defineStore('airdrop', () => {
  const {
    itemsInChain,
    setItem,
    clear: clearItems,
  } = useCart<ListCartItem>({ items: sessionStorage.value })

  function clear() {
    clearItems()
    sessionStorage.value = []
  }

  return {
    itemsInChain,
    setItem,
    clear,
  }
})
