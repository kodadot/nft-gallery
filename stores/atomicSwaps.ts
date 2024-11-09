import { defineStore } from 'pinia'
import { computed } from 'vue'
import { type SwapSurcharge } from '@/composables/transaction/types'

export type AtomicSwap = {
  counterparty: string
  creator?: string
  offered: SwapItem[]
  desired: SwapItem[]
  createdAt: number
  surcharge?: SwapSurcharge
  duration: number
} & CartItem

export type SwapItem = {
  id: string
  name: string
  collectionId: string
  sn: string
  meta: any
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
      duration: 7,
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
