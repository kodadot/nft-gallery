export default function (trade: ComputedRef<TradeNftItem | undefined>, target: MaybeRef<string>) {
  const isCreatorOfTrade = computed(() => trade.value?.caller === unref(target))
  const isTargetOfTrade = computed(() => trade.value?.targets.includes(unref(target)))

  return {
    isCreatorOfTrade,
    isTargetOfTrade,
  }
}
