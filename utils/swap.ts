import { SwapStep } from '@/components/swap/types'

export const SWAP_ROUTE_NAME_STEP_MAP = {
  'prefix-swap': SwapStep.COUNTERPARTY,
  'prefix-swap-id': SwapStep.DESIRED,
  'prefix-swap-id-offer': SwapStep.OFFERED,
  'prefix-swap-id-review': SwapStep.REVIEW,
}

export const ATOMIC_SWAP_PAGES = [
  'prefix-swap-id',
  'prefix-swap-id-offer',
  'prefix-swap-id-review',
]

export const getSwapStepRouteName = (step: SwapStep) => {
  const index = Object.values(SWAP_ROUTE_NAME_STEP_MAP).findIndex(name => name === step)
  return Object.keys(SWAP_ROUTE_NAME_STEP_MAP)[index]
}

export const getSwapStep = (swap: AtomicSwap): SwapStep => {
  if (swap.blockNumber) {
    return SwapStep.CREATED
  }

  if (!swap.desired.length) {
    return SwapStep.DESIRED
  }

  if (!swap.offered.length || swap.offered.length !== swap.desired.length) {
    return SwapStep.OFFERED
  }

  return SwapStep.REVIEW
}

export const getStepItemsKey = (step: SwapStep) => {
  if (step === SwapStep.DESIRED) {
    return 'desired'
  }

  if (step === SwapStep.OFFERED) {
    return 'offered'
  }
}
