import { SwapStep } from '@/components/swap/types'
import type { TradeToken, TradeNftItem } from '@/components/trade/types'
import type { NFT } from '@/types'

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

export const navigateToSwap = (swap: AtomicSwap) => {
  navigateTo({
    name: 'prefix-swap-id',
    params: { id: swap.counterparty },
    query: { swapId: swap.id },
  })
}

export const nftToSwapItem = (nft: NFT): SwapItem => {
  return {
    id: nft.id,
    collectionId: nft.collection.id,
    sn: nft.sn,
    name: nft.name,
    meta: nft.meta,
  }
}

export const tradeToSwapItem = (token: TradeToken): SwapItem => {
  return {
    id: token.id,
    collectionId: token.collection.id,
    sn: token.sn,
    name: token.name,
    meta: token.meta,
  }
}

export const counterSwap = (trade: TradeNftItem) => {
  if (!trade.desired) {
    // collection swaps are not supported yet
    return
  }

  const withFields: CrateSwapWithFields = {
    desired: [tradeToSwapItem(trade.offered)],
    offered: [tradeToSwapItem(trade.desired)],
  }

  if (trade.surcharge) {
    Object.assign(withFields, {
      surcharge: {
        amount: trade.price,
        direction: trade.surcharge,
      },
    })
  }

  const swap = useAtomicSwapStore().createSwap(trade.caller, withFields)

  navigateToSwap(swap)
}
