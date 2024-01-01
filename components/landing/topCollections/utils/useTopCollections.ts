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

export const useTopCollections = (limit: number) => {
  const { client, urlPrefix } = usePrefix()
  const { isAssetHub } = useIsChain(urlPrefix)
  const topCollectionWithVolumeList = useState<CollectionEntityWithVolumes[]>(
    'topCollectionWithVolumeList',
    () => [],
  )
  const loading = ref(true)
  const collectionsSalesResults = ref<CollectionsSalesResult>()

  const {
    data: topCollections,
    pending: topCollectionLoading,
    refresh,
  } = useAsyncData('topCollections', async () => {
    const { data } = await useAsyncQuery<TopCollectionListResult>({
      query: isAssetHub.value ? topCollectionsListAh : topCollectionList,
      variables: { orderBy: 'volume_DESC', limit },
      clientId: client.value,
    })
    return data.value
  })

  watch([topCollections], async () => {
    if (topCollections.value) {
      const ids = topCollections.value.collectionEntities.map((c) => c.id)

      const { data } = await useAsyncQuery<CollectionsSalesResult>({
        query: collectionsSales,
        variables: { ids },
        clientId: client.value,
      })

      topCollectionWithVolumeList.value = []
      collectionsSalesResults.value = data.value
    }
  })

  watch(collectionsSalesResults, () => {
    if (
      collectionsSalesResults.value &&
      topCollections.value?.collectionEntities.length
    ) {
      topCollectionWithVolumeList.value = proccessData(
        topCollections.value.collectionEntities,
        collectionsSalesResults.value.collectionsSales,
      )

      loading.value = false
    }
  })

  watch(topCollectionLoading, (value) => {
    if (value) {
      loading.value = true
    }
  })

  watch(urlPrefix, () => refresh())

  return {
    data: topCollectionWithVolumeList,
    loading,
  }
}
