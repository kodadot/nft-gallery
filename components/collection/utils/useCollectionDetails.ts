import { useQuery } from '@tanstack/vue-query'
import type { Stats } from './types'
import { getVolume } from '@/utils/math'
import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import type { NFTListSold } from '@/components/identity/utils/useIdentity'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import collectionBuyEventStatsById from '@/queries/subsquid/general/collectionBuyEventStatsById.query'

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
        ...new Set(data.value.stats.base.map(item => item.currentOwner)),
      ].length

      const collectionLength = data.value.stats.base.length

      const listedNfts = data.value.stats.listed

      stats.value = {
        maxSupply: data.value.stats.max,
        listedCount: data.value.stats.listed.length,
        collectionLength,
        collectionFloorPrice:
          listedNfts.length > 0
            ? Math.min(...listedNfts.map(item => parseInt(item.price)))
            : undefined,
        uniqueOwners: uniqueOwnerCount,
        uniqueOwnersPercent: `${(
          (uniqueOwnerCount / collectionLength)
          * 100
        ).toFixed(2)}%`,
        collectionTradedVolumeNumber: Number(
          getVolume(data.value.stats.sales.map(nft => nft.events).flat()),
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
  const { data } = useAsyncQuery({
    query: collectionBuyEventStatsById,
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

  const { data } = useQuery({
    queryKey: ['collection-minimal', isAssetHub, collectionId],
    queryFn: () =>
      collectionId.value
        ? useGraphql({
          queryName: isAssetHub.value
            ? 'collectionByIdMinimalWithRoyalty'
            : 'collectionByIdMinimal',
          variables: variables.value,
        })
        : null,
  })

  const { drop: collectionDrop, isPending, refetch } = useCollectionDrop(collectionId)

  watch(
    [computed(() => data.value?.data), isPending, collectionDrop],
    async ([data, dropFetched]) => {
      const collectionData = toRaw(data?.collectionEntityById)

      if (!collectionData || dropFetched) {
        return
      }

      if (collectionDrop.value) {
        collectionData.dropCreator = collectionDrop.value.creator
      }

      collectionData.displayCreator = collectionData.dropCreator || collectionData.currentOwner

      collection.value = collectionData
    },
  )

  watchEffect(async () => {
    const metadata = collection.value?.metadata
    if (metadata && !collection.value?.meta) {
      const meta = (await processSingleMetadata(metadata)) as NFTMetadata
      if (meta) {
        collection.value.meta = meta
      }
    }
  })

  return { collection, refetch }
}
