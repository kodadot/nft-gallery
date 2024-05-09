import { type MintedNFT } from '@/components/collection/drop/types'
import { DoResult } from '@/services/fxart'
import { useDrop } from '@/components/drops/useDrops'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import { FALLBACK_DROP_COLLECTION_MAX } from '@/utils/drop'
import useDropMassMint, {
  MassMintNFT,
} from '@/composables/drop/massmint/useDropMassMint'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'

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

function useCollectionData(collectionKey, client, collectionId, drop) {
  const { accountId } = useAuth()
  return useAsyncData<UnlockableCollectionById>(
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
}

export function useCollectionEntity(collectionId?: string) {
  const { drop } = useDrop()
  const { client } = usePrefix()

  const collectionKey = computed(() => collectionId ?? drop.value?.collection)

  const { data: collectionData } = useCollectionData(
    collectionKey,
    client,
    collectionId,
    drop,
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
  const { toMintNFTs, amountToMint, mintingSession } =
    storeToRefs(useDropStore())
  const { submitMint } = useDropMassMint()
  const { subscribeForNftsWithMetadata } = useDropMassMintListing()
  const { collectionName, maxCount } = useCollectionEntity()
  const { $consola } = useNuxtApp()

  const status = ref<'index' | 'update'>('index')

  // 1. get nft index
  const mintNFTs: Ref<MassMintNFT[]> = ref([])
  useSubscriptionGraphql({
    query: `
      nfts: nftEntities(
        where: {collection: {id_eq: "${drop.value.collection}"}},
        orderBy: [createdAt_ASC, sn_ASC]
      ) {
        id
      }
    `,
    onChange: async ({ data: { nfts } }) => {
      mintNFTs.value = []

      if (status.value === 'update') {
        return
      }

      const checkIndex = new Set() // check duplicate index
      for (const mintNFT of toMintNFTs.value) {
        const index =
          nfts.findIndex(
            (nft) => nft.id === `${drop.value.collection}-${mintNFT.sn}`,
          ) + 1

        if (index > 0) {
          checkIndex.add(index)
          const metadata = new URL(mintNFT.metadata || '')
          metadata.searchParams.set('sn', index.toString())

          mintNFTs.value.push({
            ...mintNFT,
            name: `${mintNFT.name} #${index}`,
            metadata: metadata.toString(),
            index,
          })
        }
      }

      if (checkIndex.size === amountToMint.value) {
        status.value = 'update'
        await updateMetadata()
      }
    },
  })

  // 2. update metadata
  const mintedNfts: Ref<MintedNFT[]> = ref([])
  const updateMetadata = async () => {
    const response = await Promise.all(mintNFTs.value.map(submitMint))

    for (const [index, res] of response.entries()) {
      let metadata = {
        image: mintNFTs.value[index].image,
        name: mintNFTs.value[index].name,
      }

      try {
        metadata = await $fetch(res.metadata || '')
      } catch (error) {
        $consola.warn(error)
      }

      mintedNfts.value.push({
        id: `${drop.value.collection}-${res.nft}`,
        index: mintNFTs.value[index].index as number,
        chain: res.chain,
        name: metadata.name,
        image: metadata.image,
        collection: {
          id: res.collection,
          name: collectionName.value,
          max: maxCount.value ?? drop.value.max ?? FALLBACK_DROP_COLLECTION_MAX,
        },
      })
    }

    mintingSession.value.items = mintedNfts.value
    subscribeForNftsWithMetadata(mintedNfts.value.map((item) => item.id))
  }
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
