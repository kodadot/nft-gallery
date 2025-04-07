import { useQuery } from '@tanstack/vue-query'
import type { ResultOf } from 'gql.tada'
import type { Stats } from './types'
import { getVolume } from '@/utils/math'
import type { NFTMetadata } from '@/types'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import collectionBuyEventStatsById from '@/queries/subsquid/general/collectionBuyEventStatsById.query'
import collectionStatsById from '@/queries/subsquid/general/collectionStatsById'
import nftListSoldByCollection from '~/queries/subsquid/general/nftListSoldByCollection'

export const useCollectionDetails = ({
  collectionId,
}: {
  collectionId: ComputedRef<string>
}) => {
  const variables = computed(() => ({
    id: collectionId.value,
  }))

  const { $apolloClient } = useNuxtApp()
  const { urlPrefix } = usePrefix()

  const data = ref<ResultOf<typeof collectionStatsById>>()
  const stats = ref<Stats>({})

  const fetchStats = () => {
    $apolloClient.query({
      query: collectionStatsById,
      variables: variables.value,
      context: {
        endpoint: urlPrefix.value,
      },
    }).then((res) => {
      data.value = res.data
    })
  }

  fetchStats()

  watch(data, () => {
    if (data.value?.stats) {
      const uniqueOwnerCount = [
        ...new Set(data.value.stats.base.map(item => item.currentOwner)),
      ].length

      const collectionLength = data.value.stats.base.length

      const listedNfts = data.value.stats.listed

      stats.value = {
        maxSupply: data.value.stats.max ?? undefined,
        listedCount: data.value.stats.listed.length,
        collectionLength,
        collectionFloorPrice:
          listedNfts.length > 0
            ? Math.min(...listedNfts.map(item => parseInt(item.price ?? '0')))
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

  watch(variables, () => fetchStats())

  return {
    stats,
    refetch: fetchStats,
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
  const data = ref<ResultOf<typeof nftListSoldByCollection>>()

  const { $apolloClient } = useNuxtApp()
  const { urlPrefix } = usePrefix()

  $apolloClient.query({
    query: nftListSoldByCollection,
    variables: {
      account: address,
      limit: 3,
      orderBy: 'price_DESC',
      collectionId,
    },
    context: {
      endpoint: urlPrefix.value,
    },
  }).then((res) => {
    data.value = res.data
  })

  return { nftEntities: computed(() => data.value?.nftEntities?.length ? data.value.nftEntities : []) }
}

export const useCollectionMinimal = ({
  collectionId,
}: {
  collectionId: Ref<string | undefined>
}) => {
  const { urlPrefix, client } = usePrefix()
  const { isAssetHub } = useIsChain(urlPrefix)
  const collection = ref()

  const variables = computed(() => ({
    id: collectionId.value,
  }))

  const { data, refetch } = useQuery({
    queryKey: ['collection-minimal', isAssetHub, collectionId],
    queryFn: async () =>
      collectionId.value
        ? (await useAsyncGraphql({
            query: isAssetHub.value
              ? 'collectionByIdMinimalWithRoyalty'
              : 'collectionByIdMinimal',
            variables: variables.value,
            clientId: client.value,
          })).data.value
        : null,
  })

  const { drop: collectionDrop, isPending: isDropPending } = useCollectionDrop(collectionId)

  watch([data, isDropPending],
    async ([data, dropPending]) => {
      const collectionData = data?.collectionEntityById

      if (!collectionData || dropPending) {
        return
      }

      if (collectionDrop.value) {
        collectionData.dropCreator = collectionDrop.value.creator
      }

      collectionData.displayCreator = collectionData.dropCreator || collectionData.currentOwner

      collection.value = collectionData
    },
    { immediate: true },
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
