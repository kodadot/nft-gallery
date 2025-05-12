import { defineStore } from 'pinia'

import type { ListCartItem } from '@/stores/listingCart'

export const useAirdropStore = defineStore('airdrop', () => {
  const {
    itemsInChain,
    setItem,
    clear,
  } = useCart<ListCartItem>({ items: [] })

  return {
    itemsInChain,
    setItem,
    clear,
  }
})
