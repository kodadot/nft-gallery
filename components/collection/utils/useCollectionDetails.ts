import { getVolume } from '@/utils/math'
import { CollectionMetadata, NFT } from '@/components/rmrk/service/scheme'
import { NFTListSold } from '@/components/identity/utils/useIdentity'

type Stats = {
  listedCount?: number
  collectionLength?: number
  collectionFloorPrice?: number
  bestOffer?: number
  uniqueOwners?: number
  uniqueOwnersPercent?: string
  collectionTradedVolumeNumber?: bigint
}

export type CollectionEntityMinimal = {
  id: string
  issuer: string
  meta: CollectionMetadata
  metadata: string
  name: string
  currentOwner: string
  type: string
}

const differentOwner = (nft: {
  issuer: string
  currentOwner: string
}): boolean => {
  return nft.currentOwner !== nft.issuer
}

export const useCollectionDetails = ({ collectionId }) => {
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'collectionStatsById',
    variables: {
      id: collectionId,
    },
  })
  const stats = ref<Stats>({})

  watch(data, () => {
    if (data.value.stats) {
      const uniqueOwnerCount = [
        ...new Set(data.value.stats?.base.map((item) => item.currentOwner)),
      ].length

      const differentOwnerCount =
        data.value.stats.base.filter(differentOwner).length

      const offresPerNft = data.value.stats.base.map((nft) =>
        nft.offers.map((offer) => Number(offer.price))
      )
      const maxOffer = Math.max(
        ...offresPerNft.map((nftOffers) => Math.max(...nftOffers))
      )
      stats.value = {
        listedCount: data.value.stats.listed.length,
        collectionLength: data.value.stats.base.length,
        collectionFloorPrice: Math.min(
          ...data.value.stats.listed.map((item) => parseInt(item.price))
        ),
        uniqueOwners: uniqueOwnerCount,
        bestOffer: maxOffer,
        uniqueOwnersPercent: `${(
          (uniqueOwnerCount / (uniqueOwnerCount + differentOwnerCount)) *
          100
        ).toFixed(2)}%`,
        collectionTradedVolumeNumber: getVolume(
          data.value.stats.sales.map((nft) => nft.events).flat()
        ),
      }
    }
  })

  return {
    stats,
  }
}

export const useBuyEvents = ({ collectionId }) => {
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'collectionBuyEventStatsById',
    variables: {
      id: collectionId,
    },
  })
  const highestBuyPrice = ref<number>(0)
  watch(data, () => {
    if (data && data.value.stats && data.value.stats[0]) {
      const { max } = data.value.stats[0]
      highestBuyPrice.value = parseInt(max)
    }
  })
  return { highestBuyPrice }
}

export function useCollectionSoldData({ address, collectionId }) {
  const nftEntities = ref<NFT[]>([])

  const { data } = useGraphql({
    queryName: 'nftListSoldByCollection',
    variables: {
      account: address,
      limit: 3,
      orderBy: 'price_DESC',
      collectionId,
      where: {
        collection: { id_eq: collectionId },
      },
    },
  })

  watch(data as unknown as NFTListSold, (list) => {
    if (list.nftEntities?.length) {
      nftEntities.value = list.nftEntities
    }
  })

  return { nftEntities }
}

export const useCollectionMinimal = ({ collectionId }) => {
  const collection = ref<CollectionEntityMinimal>()

  const { data } = useGraphql({
    queryName: 'collectionByIdMinimal',
    variables: {
      id: collectionId,
    },
  })

  watch(data, (result) => {
    if (result?.collectionEntityById) {
      collection.value = result.collectionEntityById
    }
  })
  return { collection }
}
