import { getVolume } from '@/utils/math'
import { NFT } from '@/components/rmrk/service/scheme'
import { NFTListSold } from '@/components/identity/utils/useIdentity'
import { chainsSupportingOffers } from './useCollectionDetails.config'
import { Stats } from './types'

const differentOwner = (nft: {
  issuer: string
  currentOwner: string
}): boolean => {
  return nft.currentOwner !== nft.issuer
}

export const useCollectionDetails = ({ collectionId }) => {
  const { urlPrefix, client } = usePrefix()
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    clientName: client.value,
    queryName: chainsSupportingOffers.includes(urlPrefix.value)
      ? 'collectionStatsByIdWithOffers'
      : 'collectionStatsById',
    variables: {
      id: collectionId,
    },
  })
  const stats = ref<Stats>({})

  watch(data, () => {
    if (data) {
      const uniqueOwnerCount = [
        ...new Set(
          data.value.value.stats?.base.map((item) => item.currentOwner)
        ),
      ].length

      const differentOwnerCount =
        data.value.value.stats.base.filter(differentOwner).length

      const maxOffer = computed(() => {
        if (!chainsSupportingOffers.includes(urlPrefix.value)) {
          return undefined
        }
        const offresPerNft = data.value.value.stats.base.map((nft) =>
          nft.offers.map((offer) => Number(offer.price))
        )
        const highestOffer = Math.max(
          ...offresPerNft.map((nftOffers) => Math.max(...nftOffers))
        )
        return highestOffer
      })

      stats.value = {
        listedCount: data.value.value.stats.listed.length,
        collectionLength: data.value.value.stats.base.length,
        collectionFloorPrice: Math.min(
          ...data.value.value.stats.listed.map((item) => parseInt(item.price))
        ),
        uniqueOwners: uniqueOwnerCount,
        bestOffer: maxOffer.value,
        uniqueOwnersPercent: `${(
          (uniqueOwnerCount / (uniqueOwnerCount + differentOwnerCount)) *
          100
        ).toFixed(2)}%`,
        collectionTradedVolumeNumber: Number(
          getVolume(
            data.value.value.stats.sales.map((nft) => nft.events).flat()
          )
        ),
      }
    }
  })

  return {
    stats,
  }
}

export const useBuyEvents = ({ collectionId }) => {
  const { client } = usePrefix()
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    clientName: client.value,
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
  const { client } = usePrefix()
  const { data } = useGraphql({
    queryName: 'nftListSoldByCollection',
    clientName: client.value,
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
  const collection = ref()
  const { client } = usePrefix()
  const { data } = useGraphql({
    queryName: 'collectionByIdMinimal',
    clientName: client.value,
    variables: {
      id: collectionId,
    },
  })

  watch(data, (result) => {
    if (result?.value.collectionEntityById) {
      collection.value = result.value.collectionEntityById
    }
  })

  return { collection }
}
