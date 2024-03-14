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

  const maxCount = computed(() => collectionData.value?.collectionEntity?.max)

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
  const { mintedNFTs } = storeToRefs(dropStore)
  const { drop } = useDrop()
  const { maxCount: collectionMaxCount } = useCollectionEntity()
  const { listNftByNftWithMetadata } = useListingCartModal({
    clearItemsOnModalClose: true,
  })

  // for feature parity with canary, no idea where this number comes from (by daiagi on 12/03/2024 PR #9709)
  const DEFAULT_MAX = 255

  const claimedNft = computed({
    get: () => dropStore.claimedNFT,
    set: (value) => dropStore.setClaimedNFT(value),
  })

  const maxCount = computed(
    () => collectionMaxCount.value ?? drop.value?.max ?? DEFAULT_MAX,
  )

  const mintCountAvailable = computed(
    () => dropStore.mintsCount < maxCount.value,
  )

  const canListMintedNft = computed(() => Boolean(mintedNFTs.value.length))

  const subscribeToMintedNft = (id: string, onReady: (data) => void) => {
    useSubscriptionGraphql({
      query: `nftEntityById(id: "${id}") {
      id
    }`,
      onChange: onReady,
    })
  }

  const listMintedNft = async () => {
    const mintedNFT = mintedNFTs.value[0]
    if (mintedNFT) {
      listNftByNftWithMetadata(mintedNFT)
    }
  }

  return {
    maxCount,
    claimedNft,
    mintCountAvailable,
    canListMintedNft,
    listMintedNft,
    subscribeToMintedNft,
  }
}
