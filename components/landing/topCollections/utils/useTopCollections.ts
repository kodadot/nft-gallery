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

const proccessData = (
  collectionEntities: CollectionEntity[],
  collectionsSales: CollectionSales[]
) => {
  topCollectionWithVolumeList.value = collectionEntities.map(
    (e): CollectionEntityWithVolumes => {
      const thisCollectionSales = collectionsSales.find(
        ({ id }) => id === e.id
      ) as CollectionSales
      const saleEvents = thisCollectionSales.sales
        .map((nft) => nft.events)
        .flat()

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
    }
  )
}

export const useTopCollections = (limit: number) => {
  //start
  const { data: topCollectionList, error: error1 } = useTopCollectionList(limit)
  watch([topCollectionList, error1], ([topCollectionList, error]) => {
    if (error) {
      fetchError.value = error
      isLoading.value = false
      return
    }
    if (topCollectionList) {
      const collectionIds = (topCollectionList as CollectionEntity[]).map(
        (c) => c.id
      )
      const { data: collectionSalesList, error: error2 } =
        useCollectionsSales(collectionIds)

      watch([collectionSalesList, error2], ([collectionSalesList, error]) => {
        if (error) {
          fetchError.value = error
          isLoading.value = false
          return
        }
        if (collectionSalesList) {
          proccessData(topCollectionList, collectionSalesList)
        }
        isLoading.value = false
      })
    }
  })

  return {
    data: topCollectionWithVolumeList,
    error: fetchError,
    loading: isLoading,
  }
}
