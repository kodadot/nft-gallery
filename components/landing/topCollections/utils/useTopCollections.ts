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
  return Promise.all(
    collectionsList.map(
      async (collection): Promise<CollectionEntityWithVolumes> => {
        const thisCollectionSales = collectionsSales.find(
          ({ id }) => id === collection.id,
        ) as CollectionSales
        const saleEvents = thisCollectionSales.sales
          .map((nft) => nft.events)
          .flat()

        const image = collection.image
          ? sanitizeIpfsUrl(collection.image)
          : sanitizeIpfsUrl(
              getCollectionImage(
                await processSingleMetadata(collection.metadata),
              ) || '',
            )

        return {
          ...collection,
          image: image,
          averagePrice: calculateAvgPrice(
            collection.volume as string,
            collection.buys,
          ),
          volume: volume(saleEvents),
          weeklyVolume: weeklyVolume(saleEvents),
          monthlyVolume: monthlyVolume(saleEvents),
          threeMonthVolume: threeMonthlyVolume(saleEvents),
          weeklyrangeVolume: weeklyrangeVolume(saleEvents),
          monthlyrangeVolume: monthlyrangeVolume(saleEvents),
          threeMonthlyrangeVolume: threeMonthRangeVolume(saleEvents),
        }
      },
    ),
  )
}

export const useTopCollections = (limit: number, immediate = true) => {
  const { client, urlPrefix } = usePrefix()
  const { isAssetHub, isBase } = useIsChain(urlPrefix)
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
  } = useAsyncData(
    'topCollections',
    async () => {
      const where =
        isAssetHub.value || isBase.value
          ? {
              issuer_not_in: getDenyList(urlPrefix.value) || [],
              volume_gt: '0',
            }
          : {}

      if (isBase.value) {
        // remove once volume is tracked
        delete where.volume_gt
      }

      const { data } = await useAsyncQuery<TopCollectionListResult>({
        query:
          isAssetHub.value || isBase.value
            ? topCollectionsListAh
            : topCollectionList,
        variables: { orderBy: 'volume_DESC', limit, where },
        clientId: client.value,
      })
      return data.value
    },
    {
      immediate,
    },
  )

  watchEffect(async () => {
    if (topCollections.value) {
      const ids = topCollections.value.collectionEntities.map((c) => c.id)

      const { result: data } = useQuery(
        collectionsSales,
        { ids },
        { clientId: client.value },
      )

      topCollectionWithVolumeList.value = []
      collectionsSalesResults.value = data.value

      if (
        collectionsSalesResults.value &&
        topCollections.value?.collectionEntities.length
      ) {
        topCollectionWithVolumeList.value = await proccessData(
          topCollections.value.collectionEntities,
          collectionsSalesResults.value.collectionsSales,
        )

        loading.value = false
      }
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
    refresh,
  }
}
