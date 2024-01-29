import { getVolume } from '@/utils/math'
import { Stats } from './types'
import { Interaction } from '@kodadot1/minimark/v1'

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

export const useBuyEvents = ({ collectionId }: { collectionId: string }) => {
  const highestBuyPrice = ref<number>(0)

  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'collectionBuyEventStatsById',
    variables: {
      id: collectionId,
    },
  })

  watch(data, (result) => {
    const max = result?.stats?.[0]?.max
    if (max) {
      highestBuyPrice.value = parseInt(max)
    }
  })

  const { events, getMinimalNfts, orderMinimalEventsByHighestMeta } =
    useMinimalEvents({
      interaction: Interaction.BUY,
      where: {
        nft: {
          collection: { id_eq: collectionId },
        },
      },
    })

  const highestSoldNFTs = computed(() =>
    getMinimalNfts(orderMinimalEventsByHighestMeta(events.value)),
  )

  return { highestBuyPrice, highestSoldNFTs }
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
