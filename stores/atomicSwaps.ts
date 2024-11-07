import { defineStore } from 'pinia'
import { computed } from 'vue'

export type AtomicSwap = {
  counterparty: string
  creator?: string
  offered: SwapItem[]
  desired: SwapItem[]
  createdAt: number
  surcharge: { receive?: string, send?: string }
} & CartItem

type SwapItem = {
  id: string
}

export enum SwapStep {
  DESIRED = 'desired',
  OFFERED = 'offered',
  REVIEW = 'review',
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
  const routeName = computed(() => route.name?.toString())

  const step = computed(() => {
    return routeName.value
      ? {
          'prefix-swap-id': SwapStep.DESIRED,
          'prefix-swap-id-offer': SwapStep.OFFERED,
          'prefix-swap-id-review': SwapStep.REVIEW,
        }[routeName.value]
      : undefined
  })

  const counterparty = ref()

  const swap = computed<AtomicSwap | undefined>(() => {
    const atomicSwaps = items.value
      .filter(item =>
        item.counterparty === counterparty.value
        && item.urlPrefix === urlPrefix.value,
      ).sort((a, b) => b.createdAt - a.createdAt)
    return atomicSwaps[0]
  })

  const createSwap = (counterparty: string) => {
    const newAtomicSwap: AtomicSwap = {
      id: window.crypto.randomUUID(),
      counterparty,
      offered: [],
      desired: [],
      createdAt: Date.now(),
      urlPrefix: urlPrefix.value,
      surcharge: {},
      creator: accountId.value ? accountId.value : undefined,
    }

    setItem(newAtomicSwap)

    return newAtomicSwap
  }

  return {
    // state
    items,
    counterparty,
    // getters
    chain,
    count,
    itemsInChain,
    getItems,
    step,
    // actions
    getItem,
    swap,
    setItem,
    updateItem,
    removeItem,
    clear,
    createSwap,
  }
}, { persist: true })
