import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { MakingOfferItem } from '@/components/trade/types'

export const useMakingOfferStore = defineStore('makingOffer', () => {
  const {
    items,
    chain,
    count,
    itemsInChain,
    allItemsInChain,
    getItem,
    setItem,
    removeItem,
    clear,
    updateItem,
  } = useCart<MakingOfferItem>()

  const getItems = computed(() => items.value)

  const hasInvalidOfferPrices = computed(() => {
    return itemsInChain.value.some(item => Number(item.offerPrice || 0) <= 0.0001)
  })

  return {
    items,
    chain,
    getItems,
    getItem,
    allItemsInChain,
    itemsInChain,
    count,
    hasInvalidOfferPrices,
    setItem,
    updateItem,
    removeItem,
    clear,
  }
})
