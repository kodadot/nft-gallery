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
} from './types'
import { useTopCollectionList } from './useTopCollectionList'
import { useCollectionsSales } from './useCollectionsSales'

const topCollectionWithVolumeList = ref<CollectionEntityWithVolumes[]>([])
const fetchError = ref(null)
const isLoading = ref(true)

export const useTopCollections = (limit: number) => {
  const { data, error } = useTopCollectionList(limit)
  watch([data, error], ([collectionEntities, errorValue]) => {
    if (errorValue) {
      fetchError.value = errorValue
      isLoading.value = false
      return
    }
    if (collectionEntities) {
      const { data: collectionSales, error } = useCollectionsSales(
        collectionEntities.map((c) => c.id)
      )

      watch([collectionSales, error], ([collectionSalesValue, errorValue]) => {
        if (errorValue) {
          fetchError.value = errorValue
          isLoading.value = false
          return
        }
        if (collectionSalesValue) {
          topCollectionWithVolumeList.value = proccessData(
            collectionEntities,
            collectionSalesValue
          )
          isLoading.value = false
        }
      })
    }
  })
  return {
    data: topCollectionWithVolumeList,
    error: fetchError,
    loading: isLoading,
  }
}

const proccessData = (
  collectionEntities: CollectionEntity[],
  collectionsSales: CollectionSales[]
) => {
  return collectionEntities.map((e): CollectionEntityWithVolumes => {
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
