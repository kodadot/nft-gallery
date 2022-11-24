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
import { Interaction } from '~~/components/rmrk/service/scheme'

// types

type CollectionEntity = {
  id: string
  floorPrice: number
  averagePrice: VolumeType
  image: string
  metadata: string
  sold: number
  name: string
  total: number
  buys: number
  unique: number
  uniqueCollectors: number
  volume: VolumeType
}

type VolumeType = number | bigint | string

export interface CollectionEntityWithVolumes extends CollectionEntity {
  volume: VolumeType
  dailyVolume?: VolumeType
  weeklyVolume?: VolumeType
  monthlyVolume?: VolumeType
  threeMonthVolume?: VolumeType
  dailyrangeVolume?: VolumeType
  weeklyrangeVolume?: VolumeType
  monthlyrangeVolume?: VolumeType
  threeMonthlyrangeVolume?: VolumeType
}

type FetchCollectionsSeriesResult = {
  collectionEntities: CollectionEntity[]
}
type CollectionSales = {
  id: string
  sales: {
    events: Interaction[]
  }[]
}

type FetchCollectionsSalesResult = {
  collectionsSales: CollectionSales[]
}
//refs

const fetchCollectionsSeriesResult = ref<FetchCollectionsSeriesResult | null>(
  null
)
const fetchCollectionsSalesResult = ref<FetchCollectionsSalesResult | null>(
  null
)
const data = ref<CollectionEntityWithVolumes[]>([])
const isLoading = ref<boolean>(true)

//functions

const fetchCollectionsSeries = (limit: number, sort = 'volume_DESC') => {
  const { data, error } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'topCollectionList',
    variables: {
      orderBy: sort,
      limit: limit,
    },
  })
  if (error.value) {
    isLoading.value = false
    return
  }
  fetchCollectionsSeriesResult.value =
    data as unknown as FetchCollectionsSeriesResult
}
const fetchCollectionsSales = (ids: string[]) => {
  if (ids.length === 0) {
    isLoading.value = false
    return
  }

  const { data, error, loading } = useGraphql({
    queryPrefix: 'rmrk',
    queryName: 'collectionsSales',
    variables: {
      ids: ids,
    },
  })
  if (error.value) {
    loading.value = false
    return
  }
  fetchCollectionsSalesResult.value =
    data as unknown as FetchCollectionsSalesResult
}

const proccessData = (
  collectionEntities: CollectionEntity[],
  collectionsSales: CollectionSales[]
) => {
  data.value = collectionEntities.map((e): CollectionEntityWithVolumes => {
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
  isLoading.value = false
}

//watchers

watch(fetchCollectionsSeriesResult, () => {
  if (fetchCollectionsSeriesResult.value) {
    const collectionEntities =
      fetchCollectionsSeriesResult.value.collectionEntities
    const collectionIds = collectionEntities.map((c) => c.id)
    fetchCollectionsSales(collectionIds)
  }
})

watch(fetchCollectionsSalesResult, () => {
  if (fetchCollectionsSalesResult.value && fetchCollectionsSeriesResult.value) {
    const collectionsSales = fetchCollectionsSalesResult.value.collectionsSales
    const collectionEntities =
      fetchCollectionsSeriesResult.value.collectionEntities
    proccessData(collectionEntities, collectionsSales)
  }
})

export const useTopCollections = (limit: number) => {
  //start
  fetchCollectionsSeries(limit)
  return { data, loading: isLoading }
}
