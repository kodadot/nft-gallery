export default function (offer: ComputedRef<NFTOfferItem | undefined>, target: MaybeRef<string>) {
  const isOwnerOfOffer = computed(() => offer.value?.caller === unref(target))
  const isOwnerOfNft = computed(() => offer.value?.desired.currentOwner === unref(target))

  return {
    isOwnerOfOffer,
    isOwnerOfNft,
  }
}
