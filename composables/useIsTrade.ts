export default function (trade: ComputedRef<TradeNftItem | undefined>, target: MaybeRef<string>) {
  const isCreatorOfTrade = computed(() => trade.value?.caller === unref(target))
  const isTargetOfTrade = computed(() => (trade.value?.isEntireCollectionDesired ? trade.value?.considered : trade.value?.desired)?.currentOwner === unref(target))

  return {
    isCreatorOfTrade,
    isTargetOfTrade,
  }
}
