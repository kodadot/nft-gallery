import { defineStore } from 'pinia'

type SwapItem = {
  id: string
}

type State = {
  counterparty?: string
  offered: SwapItem[]
  desired: SwapItem[]
}

export const useAtomicSwapsStore = defineStore('atomicSwaps', {
  state: (): State => ({
    counterparty: undefined,
    offered: [],
    desired: [],
  }),
  actions: {
    reset() {
      this.counterparty = undefined
      this.offered = []
      this.desired = []
    },
  },
})
