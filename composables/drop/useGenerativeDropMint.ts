import { type DoResult, updateMetadata } from '@/services/fxart'
import { useDrop } from '@/components/drops/useDrops'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import { FALLBACK_DROP_COLLECTION_MAX } from '@/utils/drop'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'
import { useQuery } from '@tanstack/vue-query'

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
  max: number
}

export type DropCollectionById = {
  collectionEntity: {
    meta: { description: string }
    name: string
    max: number
    nftCount: number
    nfts: { sn: string }[]
  }
}

function useCollectionData(collectionId, client) {
  const { accountId } = useAuth()
  const { vueApp } = useNuxtApp()
  return vueApp.runWithContext(() =>
    useQuery<DropCollectionById | null>({
      queryKey: ['collection-drop-data', client, collectionId, accountId],
      queryFn: () =>
        collectionId.value
          ? useAsyncQuery<DropCollectionById | null>({
              clientId: client.value,
              query: unlockableCollectionById,
              variables: {
                id: collectionId.value,
                search: { issuer_eq: accountId.value },
              },
            }).then((res) => res.data.value)
          : null,
    }),
  )
}

export function useCollectionEntity() {
  const { drop } = useDrop()
  const { client } = usePrefix()
  const { data: collectionData } = useCollectionData(
    computed(() => drop.value?.collection),
    client,
  )
  const maxCount = computed(() => collectionData.value?.collectionEntity?.max)
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
    description,
    collectionName,
    nftCount,
  }
}

export const useUpdateMetadata = () => {
  const { drop } = useDrop()
  const { toMintNFTs, mintingSession } = storeToRefs(useDropStore())
  const { subscribeForNftsWithMetadata } = useDropMassMintListing()

  mintingSession.value.items = toMintNFTs.value.map((item) => {
    // trigger update metadata
    updateMetadata({
      chain: drop.value.chain,
      collection: drop.value.collection,
      nft: item.nft,
    })

    return {
      id: item.nft.toString(),
      chain: drop.value.chain,
      name: item.name,
      image: item.image,
      metadata: item.metadata,
      collection: {
        id: drop.value.collection,
        name: item.collectionName,
        max: drop.value.max,
      },
    }
  })
  subscribeForNftsWithMetadata(
    toMintNFTs.value.map(
      (item) => `${drop.value.collection}-${item.nft.toString()}`,
    ),
  )
}

export default () => {
  const dropStore = useDropStore()
  const { mintedNFTs } = storeToRefs(dropStore)
  const { drop } = useDrop()
  const { maxCount: collectionMaxCount } = useCollectionEntity()
  const { listNftByNftWithMetadata } = useListingCartModal()

  const claimedNft = computed({
    get: () => dropStore.claimedNFT,
    set: (value) => dropStore.setClaimedNFT(value),
  })

  const maxCount = computed(
    () =>
      collectionMaxCount.value ??
      drop.value?.max ??
      FALLBACK_DROP_COLLECTION_MAX,
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
