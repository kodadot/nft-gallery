import { DoResult } from '@/services/fxart'
import useGenerativeIframeData from '@/composables/drop/useGenerativeIframeData'

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
}

export type UnlockableCollectionById = {
  collectionEntity: {
    meta: { description: string }
    name: string
    max: number
    nftCount: number
    nfts: { sn: string }[]
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
  const { imageDataPayload } = useGenerativeIframeData()
  const { listNftByNftWithMetadata, openListingCartModal } =
    useListingCartModal(true)

  const mintedNft = ref<DropMintedNft>()
  const mintedNftWithMetadata = ref<NFTWithMetadata>()
  const selectedImage = ref<string>('')

  const maxCount = computed(
    () => collectionData.value?.collectionEntity?.max || defaultMax.value,
  )

  const mintedAmountForCurrentUser = computed(
    () => collectionData.value?.nftEntitiesConnection?.totalCount || 0, // todo: fetch from backend
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

  const canListMintedNft = computed(() => Boolean(mintedNftWithMetadata.value))

  const subscribeToMintedNft = (id: string, onReady: (data) => void) => {
    useSubscriptionGraphql({
      query: `nftEntityById(id: "${id}") {
      id
    }`,
      onChange: onReady,
    })
  }

  const listMintedNft = async () => {
    if (mintedNftWithMetadata.value) {
      listNftByNftWithMetadata(mintedNftWithMetadata.value)
      openListingCartModal()
    }
  }

  return {
    maxCount,
    mintedNft,
    mintedNftWithMetadata,
    mintedAmountForCurrentUser,
    mintedCount,
    mintCountAvailable,
    selectedImage,
    description,
    collectionName,
    canListMintedNft,
    nftCount,
    listMintedNft,
    subscribeToMintedNft,
    imageDataPayload,
  }
}
