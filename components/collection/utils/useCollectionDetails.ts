import { getVolume } from '@/utils/math'
import { NFT } from '@/components/rmrk/service/scheme'
import { NFTListSold } from '@/components/identity/utils/useIdentity'
import { Stats } from './types'

export const useCollectionDetails = ({
  collectionId,
}: {
  collectionId: ComputedRef<string>
}) => {
  const variables = computed(() => ({
    id: collectionId.value,
  }))

  const { data, refetch } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'collectionStatsById',
    variables: variables.value,
  })
  const stats = ref<Stats>({})

  watch(data, () => {
    if (data.value?.stats) {
      const uniqueOwnerCount = [
        ...new Set(data.value.stats.base.map((item) => item.currentOwner)),
      ].length

      const collectionLength = data.value.stats.base.length

      const listedNfts = data.value.stats.listed

      stats.value = {
        maxSupply: data.value.stats.max,
        listedCount: data.value.stats.listed.length,
        collectionLength,
        collectionFloorPrice:
          listedNfts.length > 0
            ? Math.min(...listedNfts.map((item) => parseInt(item.price)))
            : undefined,
        uniqueOwners: uniqueOwnerCount,
        uniqueOwnersPercent: `${(
          (uniqueOwnerCount / collectionLength) *
          100
        ).toFixed(2)}%`,
        collectionTradedVolumeNumber: Number(
          getVolume(data.value.stats.sales.map((nft) => nft.events).flat()),
        ),
      }
    }
  })

  watch(variables, () => refetch(variables.value))

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

export const useCollectionMinimal = ({
  collectionId,
}: {
  collectionId: Ref<string>
}) => {
  const { urlPrefix } = usePrefix()
  const { isAssetHub } = useIsChain(urlPrefix)
  const collection = ref()

  const variables = computed(() => ({
    id: collectionId.value,
  }))

  const { data, refetch } = useGraphql({
    queryName: isAssetHub.value
      ? 'collectionByIdMinimalWithRoyalty'
      : 'collectionByIdMinimal',
    variables: variables.value,
  })

  watch(data, (result) => {
    if (result?.collectionEntityById) {
      collection.value = result.collectionEntityById
    }
  })

  watch(variables, () => refetch(variables.value))

  return { collection }
}
