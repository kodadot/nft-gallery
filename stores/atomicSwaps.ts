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

export const useAtomicSwapStore = defineStore('atomicSwap', () => {
  const {
    items,
    chain,
    count,
    itemsInChain,
    getItem,
    setItem,
    clear,
    updateItem,
  } = useCart<AtomicSwap>()

  const { accountId } = useAuth()
  const { urlPrefix } = usePrefix()

  const swap = ref<AtomicSwap>({ ...DEFAULT_SWAP, urlPrefix: urlPrefix.value })
  const step = ref(SwapStep.COUNTERPARTY)

  const getItems = computed(() => items.value)
  const stepItems = computed(() => getStepItems(step.value))

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

  const getStepItems = (step: SwapStep) => swap.value[getStepItemsKey(step) || ''] || []

  const updateStepItems = (items: SwapItem[]) => {
    const key = getStepItemsKey(step.value)
    if (key) {
      updateSwap({ [key]: items })
    }
  }

  const removeStepItem = (id: string) => {
    updateStepItems(getStepItems(step.value).filter(item => item.id !== id))
  }

  const updateSwap = (payload: Partial<AtomicSwap>) => {
    swap.value = {
      ...swap.value,
      ...payload,
    }
    updateItem(swap.value)
  }

  return {
    // state
    items,
    swap,
    step,
    // getters
    chain,
    count,
    itemsInChain,
    getItems,
    stepItems,
    // actions
    getItem,
    getStepItems,
    clear,
    createSwap,
    updateSwap,
    updateStepItems,
    removeStepItem,
  }
}, { persist: true })
