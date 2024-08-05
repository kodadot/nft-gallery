import { type MintedNFT } from '@/components/collection/drop/types'
import type { DoResult } from '@/services/fxart'
import { setMetadataUrl } from '@/services/fxart'
import { useDrop } from '@/components/drops/useDrops'
import { FALLBACK_DROP_COLLECTION_MAX } from '@/utils/drop'
import type {
  MassMintNFT,
} from '@/composables/drop/massmint/useDropMassMint'
import useDropMassMint from '@/composables/drop/massmint/useDropMassMint'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'

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

export function useCollectionEntity() {
  const { drop } = useDrop()
  const maxSupply = ref()
  const nftCount = ref()
  const description = ref()
  const collectionName = ref()

  watchEffect(async () => {
    if (drop.value.collection) {
      const api = await useApi().apiInstance.value
      const [queryCollectionConfig, queryCollection, queryCollectionMetadata] = await Promise.all([
        api.query.nfts.collectionConfigOf(drop.value.collection),
        api.query.nfts.collection(drop.value.collection),
        api.query.nfts.collectionMetadataOf(drop.value.collection),
      ])
      const collectionConfig = queryCollectionConfig.toJSON() as unknown as { maxSupply?: number }
      const collection = queryCollection.toJSON() as unknown as { items?: number }

      maxSupply.value = collectionConfig.maxSupply ?? 0
      nftCount.value = collection.items ?? 0

      const collectionMetadata = queryCollectionMetadata.toHuman() as unknown as { data?: string }
      if (collectionMetadata.data) {
        const metadata = await $fetch<{ description?: string, name?: string }>(sanitizeIpfsUrl(collectionMetadata.data))
        description.value = metadata.description
        collectionName.value = metadata.name
      }
    }
  })

  return {
    maxCount: maxSupply,
    description,
    collectionName,
    nftCount,
  }
}

export const useUpdateMetadata = async ({
  blockNumber,
}: {
  blockNumber: Ref<string | undefined>
}) => {
  const { drop } = useDrop()
  const { toMintNFTs, amountToMint, mintingSession }
    = storeToRefs(useDropStore())
  const { submitMint } = useDropMassMint()
  const { subscribeForNftsWithMetadata } = useDropMassMintListing()
  const { collectionName, maxCount } = useCollectionEntity()
  const { $consola } = useNuxtApp()
  const { accountId } = useAuth()

  const collectionMax = computed(() => maxCount.value
    ?? drop.value.max
    ?? FALLBACK_DROP_COLLECTION_MAX)

  const updateSubstrateMetdata = () => {
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
          const index
            = nfts.findIndex(
              nft => nft.id === `${drop.value.collection}-${mintNFT.nft}`,
            ) + 1

          if (index > 0) {
            checkIndex.add(index)
            const metadata = setMetadataUrl({
              chain: drop.value.chain,
              collection: drop.value.collection,
              sn: index.toString(),
            })

            mintNFTs.value.push({
              ...mintNFT,
              name: `${mintNFT.name} #${index}`,
              metadata: metadata.toString(),
              sn: index,
            })
          }
        }

        if (checkIndex.size === amountToMint.value) {
          status.value = 'update'
          await submitMetadata()
        }
      },
    })

    // 2. update metadata
    const mintedNfts: Ref<MintedNFT[]> = ref([])
    const submitMetadata = async () => {
      const response = await Promise.all(mintNFTs.value.map(submitMint))

      for (const [index, res] of response.entries()) {
        let metadata = { name: '', image: '' }

        try {
          metadata = await $fetch(res.metadata || '')
        }
        catch (error) {
          $consola.warn(error)
        }

        mintedNfts.value.push({
          id: `${drop.value.collection}-${res.nft}`,
          index: mintNFTs.value[index].sn as number,
          chain: res.chain,
          name: metadata.name,
          image: metadata.image,
          collection: {
            id: res.collection,
            name: collectionName.value,
            max: collectionMax.value,
          },
        })
      }

      mintingSession.value.items = mintedNfts.value
      subscribeForNftsWithMetadata(mintedNfts.value.map(item => item.id))
    }
  }

  const updateEvmMetdata = () => {
    const mintedNfts = [] as MintedNFT[]
    useSubscriptionGraphql({
      query: `
    nfts: nftEntities(
      where: {collection: {id_eq: "${drop.value.collection}"}, blockNumber_eq: "${blockNumber.value}", currentOwner_eq: "${accountId.value}"},
      orderBy: [createdAt_ASC, sn_ASC]
    ) {
      id
      blockNumber
      currentOwner
      metadata
      sn
    }
  `,
      onChange: async ({ data: { nfts } }) => {
        if (!nfts.length) {
          return
        }

        let metadata = { name: '', image: '' }

        for (const nft of nfts) {
          try {
            metadata = await $fetch(nft.metadata || '')
          }
          catch (error) {
            $consola.warn(error)
          }

          mintedNfts.push({
            id: nft.id,
            index: Number(nft.sn),
            chain: drop.value.chain,
            name: metadata.name,
            image: metadata.image,
            collection: {
              id: drop.value.collection,
              name: collectionName.value,
              max: collectionMax.value,
            },
          })
        }

        mintingSession.value.items = mintedNfts
      },
    })
  }

  execByVm({
    EVM: updateEvmMetdata,
    SUB: updateSubstrateMetdata,
  })
}

export default () => {
  const dropStore = useDropStore()
  const { mintedNFTs } = storeToRefs(dropStore)
  const { maxCount, nftCount } = useCollectionEntity()
  const { listNftByNftWithMetadata } = useListingCartModal()

  const claimedNft = computed({
    get: () => dropStore.claimedNFT,
    set: value => dropStore.setClaimedNFT(value),
  })

  const mintCountAvailable = computed(
    () => nftCount.value < maxCount.value,
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
