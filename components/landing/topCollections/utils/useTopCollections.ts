import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
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

const proccessData = (
  collectionsList: CollectionEntity[],
  collectionsSales: CollectionSales[]
) => {
  return collectionsList.map((e): CollectionEntityWithVolumes => {
    const thisCollectionSales = collectionsSales.find(
      ({ id }) => id === e.id
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

export const useTopCollections = (limit: number) => {
  const topCollectionWithVolumeList = useState<CollectionEntityWithVolumes[]>(
    'topCollectionWithVolumeList',
    () => []
  )
  const error = ref(null)
  const loading = ref(true)
  const collectionsSales = ref<CollectionsSalesResult>()

  const { data: topCollections } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'topCollectionList',
    variables: {
      orderBy: 'volume_DESC',
      limit,
    },
    error,
  })

  watch([topCollections, error], () => {
    if (error.value) {
      loading.value = false
      return
    }
    if (topCollections.value) {
      const ids = (
        topCollections.value as TopCollectionListResult
      ).collectionEntities.map((c) => c.id)

      useGraphql({
        queryPrefix: 'subsquid',
        queryName: 'collectionsSales',
        variables: {
          ids,
        },
        data: collectionsSales,
        error: error,
        loading,
      })
    }
  })

  watch(collectionsSales, () => {
    if (collectionsSales.value) {
      const collectionsList = (topCollections.value as TopCollectionListResult)
        .collectionEntities
      topCollectionWithVolumeList.value = proccessData(
        collectionsList,
        collectionsSales.value.collectionsSales
      )
    }
  })
  return {
    data: topCollectionWithVolumeList,
    error,
    loading,
  }
}
