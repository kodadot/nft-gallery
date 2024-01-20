export type UnlockableCollectionById = {
  collectionEntity: {
    meta: { description: string }
    name: string
    max: number
    nftCount: number
  }
  nftEntitiesConnection: { totalCount: number }
}

type GenerativeDropMintParams = {
  mintedDropCount: Ref<number>
  defaultMax: Ref<number>
  collectionData: Ref<UnlockableCollectionById | undefined | null>
}

export default ({
  collectionData,
  defaultMax,
  mintedDropCount,
}: GenerativeDropMintParams) => {
  const maxCount = computed(
    () => collectionData.value?.collectionEntity?.max || defaultMax.value,
  )

  const mintedCount = computed(() =>
    Math.min(mintedDropCount.value, maxCount.value),
  )

  const mintCountAvailable = computed(() => mintedCount.value < maxCount.value)

  const description = computed(
    () => collectionData.value?.collectionEntity?.meta?.description,
  )
  const collectionName = computed(
    () => collectionData.value?.collectionEntity?.name,
  )

  const nftCount = computed(
    () => collectionData.value?.collectionEntity?.nftCount,
  )

  const mintedAmountForCurrentUser = computed(
    () => collectionData.value?.nftEntitiesConnection?.totalCount || 0, // todo: fetch from backend
  )

  return {
    maxCount,
    mintedCount,
    mintCountAvailable,
    description,
    collectionName,
    nftCount,
    mintedAmountForCurrentUser,
  }
}
