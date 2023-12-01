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
  const { urlPrefix } = usePrefix()
  const { apiInstance } = useApi()
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: chainsSupportingOffers.includes(urlPrefix.value)
      ? 'collectionStatsByIdWithOffers'
      : 'collectionStatsById',
    variables: {
      id: collectionId,
    },
  })
  const stats = ref<Stats>({})

  watch(data, async () => {
    if (data.value?.stats) {
      const uniqueOwnerCount = [
        ...new Set(data.value.stats.base.map((item) => item.currentOwner)),
      ].length

      const differentOwnerCount =
        data.value.stats.base.filter(differentOwner).length

      const maxOffer = computed(() => {
        if (!chainsSupportingOffers.includes(urlPrefix.value)) {
          return undefined
        }
        const offresPerNft = data.value.stats.base.map((nft) =>
          nft.offers.map((offer) => Number(offer.price)),
        )
        const highestOffer = Math.max(
          ...offresPerNft.map((nftOffers) => Math.max(...nftOffers)),
        )
        return highestOffer
      })

      const listedNfts = data.value.stats.listed
      const api = await apiInstance.value
      const supply = await api.query.nfts.collectionConfigOf(collectionId)
      const supplyString = supply.toString()
      const supplyJsonParse = JSON.parse(supplyString)
      const getTotalSupply = supplyJsonParse.maxSupply || 'Unlimited'

      stats.value = {
        maxSupply: getTotalSupply,
        listedCount: data.value.stats.listed.length,
        collectionLength: data.value.stats.base.length,
        collectionFloorPrice:
          listedNfts.length > 0
            ? Math.min(...listedNfts.map((item) => parseInt(item.price)))
            : undefined,
        uniqueOwners: uniqueOwnerCount,
        bestOffer: maxOffer.value,
        uniqueOwnersPercent: `${(
          (uniqueOwnerCount / (uniqueOwnerCount + differentOwnerCount)) *
          100
        ).toFixed(2)}%`,
        collectionTradedVolumeNumber: Number(
          getVolume(data.value.stats.sales.map((nft) => nft.events).flat()),
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
  watch(data, (result) => {
    const max = result?.stats?.[0]?.max
    if (max) {
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
    if (list?.nftEntities?.length) {
      nftEntities.value = list.nftEntities
    }
  })

  return { nftEntities }
}

export const useCollectionMinimal = ({ collectionId }) => {
  const collection = ref()
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
