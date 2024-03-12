import { DoResult } from '@/services/fxart'
import { useDrop } from '@/components/drops/useDrops'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'

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

export function useCollectionEntity(collectionId?: string) {
  const { drop } = useDrop()
  const { client } = usePrefix()

  const collectionKey = computed(() => collectionId ?? drop.value?.collection)

  const { data: collectionData } = useAsyncData<UnlockableCollectionById>(
    'collectionEntity' + collectionKey.value,
    () =>
      useAsyncQuery<UnlockableCollectionById>({
        clientId: client.value,
        query: unlockableCollectionById,
        variables: {
          id: collectionKey.value,
        },
      }).then((res) => res.data.value),
    {
      watch: collectionId ? undefined : [() => drop.value?.collection],
    },
  )

  const maxCount = computed(
    () => collectionData.value?.collectionEntity?.max ?? 0,
  )

  const mintedAmountForCurrentUser = computed(
    () => collectionData.value?.nftEntitiesConnection?.totalCount ?? 0,
  )

  const description = computed(
    () => collectionData.value?.collectionEntity?.meta?.description ?? '',
  )
  const collectionName = computed(
    () => collectionData.value?.collectionEntity?.name ?? '',
  )

  const nftCount = computed(
    () => collectionData.value?.collectionEntity?.nftCount ?? 0,
  )

  return {
    maxCount,
    mintedAmountForCurrentUser,
    description,
    collectionName,
    nftCount,
  }
}

export default () => {
  const dropStore = useDropStore()
  const { drop } = useDrop()
  const { maxCount: collectionMaxCount } = useCollectionEntity()
  const { listNftByNftWithMetadata, openListingCartModal } =
    useListingCartModal({ clearItemsOnModalClose: true })

  const claimedNft = computed({
    get: () => dropStore.claimedNFT,
    set: (value) => dropStore.setClaimedNFT(value),
  })

  const mintedNftWithMetadata = computed({
    get: () => dropStore.mintedNFT,
    set: (value) => dropStore.setMintedNFT(value),
  })
  const selectedImage = computed({
    get: () => dropStore.selectedImage,
    set: (value) => dropStore.setSelectedImage(value),
  })

  const previewItem = computed({
    get: () => dropStore.previewItem,
    set: (value) => dropStore.setPreviewItem(value),
  })

  const maxCount = computed(
    () => collectionMaxCount.value ?? drop.value?.max ?? 0,
  )

  const mintedCount = computed(() =>
    Math.min(dropStore.mintedDropCount, maxCount.value),
  )

  const mintCountAvailable = computed(
    () => dropStore.mintedDropCount < maxCount.value,
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
    claimedNft,
    mintedNftWithMetadata,
    mintedCount,
    mintCountAvailable,
    selectedImage,
    canListMintedNft,
    listMintedNft,
    tryCapture,
    subscribeToMintedNft,
    previewItem,
  }
}
