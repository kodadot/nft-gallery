import { type MintedNFT } from '@/components/collection/drop/types'
import { DoResult } from '@/services/fxart'
import { useDrop } from '@/components/drops/useDrops'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import { FALLBACK_DROP_COLLECTION_MAX } from '@/utils/drop'
import useDropMassMint from '@/composables/drop/massmint/useDropMassMint'

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
  max: number
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
  const { accountId } = useAuth()

  const collectionKey = computed(() => collectionId ?? drop.value?.collection)

  const { data: collectionData } = useAsyncData<UnlockableCollectionById>(
    'collectionEntity' + collectionKey.value,
    () =>
      useAsyncQuery<UnlockableCollectionById>({
        clientId: client.value,
        query: unlockableCollectionById,
        variables: {
          id: collectionKey.value,
          search: { issuer_eq: accountId.value },
        },
      }).then((res) => res.data.value),
    {
      watch: collectionId
        ? [accountId]
        : [() => drop.value?.collection, accountId],
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

export const useUpdateMetadata = async () => {
  const { drop } = useDrop()
  const { toMintNFTs } = storeToRefs(useDropStore())
  const { submitMint } = useDropMassMint()
  const { collectionName, maxCount } = useCollectionEntity()
  const { $consola } = useNuxtApp()

  const response = await Promise.all(toMintNFTs.value.map(submitMint))

  const mintedNfts: Ref<MintedNFT[]> = ref([])
  for (const [index, res] of response.entries()) {
    let metadata = {
      animation_url: toMintNFTs.value[index].image,
      name: toMintNFTs.value[index].name,
    }

    try {
      metadata = await $fetch(sanitizeIpfsUrl(res.metadata), {
        retry: 12,
        retryDelay: 5000,
      })
    } catch (error) {
      $consola.warn(error)
    }

    mintedNfts.value.push({
      id: `${drop.value.collection}-${res.nft}`,
      chain: res.chain,
      name: metadata.name,
      image: metadata.animation_url,
      collection: {
        id: res.collection,
        name: collectionName.value,
        max: maxCount.value ?? drop.value.max ?? FALLBACK_DROP_COLLECTION_MAX,
      },
    })
  }

  return { mintedNfts }
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
