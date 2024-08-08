import { type DoResult, updateMetadata } from '@/services/fxart'
import { useDrop } from '@/components/drops/useDrops'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'
import type { MintedNFT } from '@/components/collection/drop/types'

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

export const useUpdateMetadata = async ({
  blockNumber,
}: {
  blockNumber: Ref<string | undefined>
}) => {
  const { drop } = useDrop()
  const { toMintNFTs, mintingSession } = storeToRefs(useDropStore())
  const { subscribeForNftsWithMetadata } = useDropMassMintListing()
  const { $consola } = useNuxtApp()
  const { accountId } = useAuth()

  const updateSubstrateMetdata = () => {
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
        item => `${drop.value.collection}-${item.nft.toString()}`,
      ),
    )
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
              name: drop.value.collectionName,
              max: drop.value.max,
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
  const { mintedNFTs, drop } = storeToRefs(dropStore)
  const { listNftByNftWithMetadata } = useListingCartModal()

  const claimedNft = computed({
    get: () => dropStore.claimedNFT,
    set: value => dropStore.setClaimedNFT(value),
  })

  const mintCountAvailable = computed(
    () => drop.value.max && drop.value.minted < drop.value.max,
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
    claimedNft,
    mintCountAvailable,
    canListMintedNft,
    listMintedNft,
    subscribeToMintedNft,
  }
}
