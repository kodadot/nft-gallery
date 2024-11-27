export default function (trade: ComputedRef<TradeNftItem | undefined>, target: MaybeRef<string>) {
  const isCreatorOfTrade = computed(() => trade.value?.caller === unref(target))
  const isOwnerOfNft = computed(() => trade.value?.desired.currentOwner === unref(target))

  return {
    isCreatorOfTrade,
    isOwnerOfNft,
  }
}
