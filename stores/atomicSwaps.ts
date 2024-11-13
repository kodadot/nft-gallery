import { defineStore } from 'pinia'
import { computed } from 'vue'
import { type SwapSurcharge } from '@/composables/transaction/types'
import { SwapStep } from '@/components/swap/types'

export type AtomicSwap = {
  counterparty: string
  creator?: string
  offered: SwapItem[]
  desired: SwapItem[]
  createdAt: number
  surcharge?: SwapSurcharge
  duration: number
  blockNumber?: string
} & CartItem

export type SwapItem = {
  id: string
  name: string
  collectionId: string
  sn: string
  meta: any
}

const DEFAULT_SWAP: Omit<AtomicSwap, 'urlPrefix'> = {
  id: '',
  counterparty: '',
  offered: [],
  desired: [],
  createdAt: 0,
  duration: 7,
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

  const swap = ref<AtomicSwap>({ ...DEFAULT_SWAP, urlPrefix: urlPrefix.value })
  const step = ref(SwapStep.COUNTERPARTY)

  const getItems = computed(() => items.value)
  const stepItemsKey = computed(() => {
    if (step.value === SwapStep.DESIRED) {
      return 'desired'
    }

    if (step.value === SwapStep.OFFERED) {
      return 'offered'
    }
  })

  const stepItems = computed<SwapItem[]>(() => swap.value?.[stepItemsKey.value || ''] || [])

  const createSwap = (counterparty: string) => {
    const newAtomicSwap: AtomicSwap = {
      id: window.crypto.randomUUID().split('-')[0],
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

  const updateStepItems = (items: SwapItem[]) => {
    if (swap.value && stepItemsKey.value) {
      swap.value[stepItemsKey.value] = items
    }
  }

  const removeStepItem = (id: string) => {
    updateStepItems(stepItems.value.filter(item => item.id !== id))
  }

  return {
    // state
    items,
    // getters
    chain,
    count,
    itemsInChain,
    getItems,
    step,
    stepItemsKey,
    stepItems,
    // actions
    getItem,
    swap,
    setItem,
    updateItem,
    removeItem,
    clear,
    createSwap,
    updateStepItems,
    removeStepItem,
  }
}, { persist: true })
