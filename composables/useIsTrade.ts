import { type TradeNftItem, TradeType } from '@/components/trade/types'

export const isSwap = (type: TradeType) => type === TradeType.SWAP
export const isOffer = (type: TradeType) => type === TradeType.OFFER

export default function (trade: ComputedRef<TradeNftItem | undefined>, target: MaybeRef<string>) {
  const isCreatorOfTrade = computed(() => trade.value?.caller === unref(target))
  const isTargetOfTrade = computed(() => trade.value?.targets.map(target => target.currentOwner).includes(unref(target)))

  return {
    isCreatorOfTrade,
    isTargetOfTrade,
  }
}
