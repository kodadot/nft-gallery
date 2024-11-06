import { defineStore } from 'pinia'
import { computed } from 'vue'

export type AtomicSwap = {
  counterparty: string
  offerer: string
  offered: SwapItem[]
  desired: SwapItem[]
  createdAt: number
} & CartItem

type SwapItem = {
  id: string
}

export const useAtomicSwapsStore = defineStore('atomicSwaps', () => {
  const {
    items,
    chain,
    count,
    itemsInChain,
    getItem,
    setItem,
    removeItem,
    clear,
    updateItem,
  } = useCart<AtomicSwap>()

  const { accountId } = useAuth()
  const { urlPrefix } = usePrefix()
  const getItems = computed(() => items.value)
  const route = useRoute()

  // make a ref
  const counterparty = computed(() => route.params.id.toString() as string)

  const lastSwap = computed(() => {
    const atomicSwaps = items.value
      .filter(item =>
        item.counterparty === counterparty.value
        && item.urlPrefix === urlPrefix.value
        && item.offerer === accountId.value,
      ).sort((a, b) => b.createdAt - a.createdAt)
    return atomicSwaps[0]
  })

  const createSwap = () => {
    const newAtomicSwap: AtomicSwap = {
      id: window.crypto.randomUUID(),
      counterparty: counterparty.value,
      offerer: accountId.value,
      offered: [],
      desired: [],
      createdAt: Date.now(),
      urlPrefix: urlPrefix.value,
    }

    setItem(newAtomicSwap)

    return newAtomicSwap
  }

  return {
    // state
    items,
    // getters
    chain,
    count,
    itemsInChain,
    getItems,
    // actions
    getItem,
    lastSwap,
    setItem,
    updateItem,
    removeItem,
    clear,
    createSwap,
  }
})
