import { sanitizeIpfsUrl } from '@/utils/ipfs'
import {
  calculateAvgPrice,
  monthlyVolume,
  monthlyrangeVolume,
  threeMonthRangeVolume,
  threeMonthlyVolume,
  volume,
  weeklyVolume,
  weeklyrangeVolume,
} from '@/components/series/utils'
import {
  CollectionEntity,
  CollectionEntityWithVolumes,
  CollectionSales,
  CollectionsSalesResult,
  TopCollectionListResult,
} from './types'
import topCollectionList from '@/queries/subsquid/general/topCollectionList.graphql'
import topCollectionsListAh from '@/queries/subsquid/general/topCollections.graphql'
import collectionsSales from '@/queries/subsquid/general/collectionsSales.graphql'

const proccessData = (
  collectionsList: CollectionEntity[],
  collectionsSales: CollectionSales[],
) => {
  return collectionsList.map((e): CollectionEntityWithVolumes => {
    const thisCollectionSales = collectionsSales.find(
      ({ id }) => id === e.id,
    ) as CollectionSales
    const saleEvents = thisCollectionSales.sales.map((nft) => nft.events).flat()

    return {
      ...e,
      image: sanitizeIpfsUrl(e.image),
      averagePrice: calculateAvgPrice(e.volume as string, e.buys),
      volume: volume(saleEvents),
      weeklyVolume: weeklyVolume(saleEvents),
      monthlyVolume: monthlyVolume(saleEvents),
      threeMonthVolume: threeMonthlyVolume(saleEvents),
      weeklyrangeVolume: weeklyrangeVolume(saleEvents),
      monthlyrangeVolume: monthlyrangeVolume(saleEvents),
      threeMonthlyrangeVolume: threeMonthRangeVolume(saleEvents),
    }
  })
}

export const useTopCollections = (limit: number, immediate = true) => {
  const { client, urlPrefix } = usePrefix()
  const { isAssetHub } = useIsChain(urlPrefix)
  const topCollectionWithVolumeList = useState<CollectionEntityWithVolumes[]>(
    'topCollectionWithVolumeList',
    () => [],
  )
  const error = ref(null)
  // const loading = ref(false)
  const collectionsSalesResults = ref<CollectionsSalesResult>()

  const {
    data: topCollections,
    pending: loading,
    refresh,
  } = useAsyncData(
    async () => {
      const { data } = await useAsyncQuery<TopCollectionListResult>({
        query: isAssetHub.value ? topCollectionsListAh : topCollectionList,
        variables: { orderBy: 'volume_DESC', limit },
        clientId: client.value,
      })
      return data.value
    },
    {
      immediate,
      watch: [urlPrefix],
    },
  )

  watch([topCollections, error], () => {
    if (error.value) {
      loading.value = false
      return
    }
    if (topCollections.value) {
      const ids = (
        topCollections.value as TopCollectionListResult
      ).collectionEntities.map((c) => c.id)

      const { onResult } = useQuery(
        collectionsSales,
        { ids },
        { clientId: client.value },
      )
      onResult((result) => (collectionsSalesResults.value = result.data))
    }
  })

  watch(collectionsSalesResults, () => {
    if (collectionsSalesResults.value) {
      const collectionsList = (topCollections.value as TopCollectionListResult)
        .collectionEntities
      topCollectionWithVolumeList.value = proccessData(
        collectionsList,
        collectionsSalesResults.value.collectionsSales,
      )
    }
  })

  return {
    data: topCollectionWithVolumeList,
    error,
    loading,
    refresh,
  }
}
