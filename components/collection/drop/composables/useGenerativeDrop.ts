import { DoResult, DropMintedStatus } from '@/services/waifu'

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
}

export default ({
  collectionData,
  defaultMax,
  currentAccountMintedToken,
  collectionId,
  mintedDropCount,
}: {
  mintedDropCount: Ref<number>
  collectionId: Ref
  currentAccountMintedToken: Ref<DropMintedStatus | null>
  defaultMax: Ref<number>
  collectionData: Ref
}) => {
  const mintedNft = ref<DropMintedNft>()
  const mintedNftWithMetadata = ref<NFTWithMetadata>()

  const maxCount = computed(
    () => collectionData.value?.collectionEntity?.max || defaultMax.value,
  )

  const hasUserMinted = computed(() =>
    currentAccountMintedToken.value
      ? `${collectionId.value}-${currentAccountMintedToken.value.id}`
      : mintedNft.value?.id,
  )

  const mintedCount = computed(() =>
    Math.min(mintedDropCount.value, maxCount.value),
  )

  const mintCountAvailable = computed(() => mintedCount.value < maxCount.value)

  return {
    maxCount,
    mintedNft,
    mintedNftWithMetadata,
    hasUserMinted,
    mintedCount,
    mintCountAvailable,
  }
}
