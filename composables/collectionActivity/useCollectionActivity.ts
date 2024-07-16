import { useQuery } from '@tanstack/vue-query'
import type { Prefix } from '@kodadot1/static'
import type { Flippers, InteractionWithNFT, Offer, Owners } from './types'
import { getFlippers, getOwners } from './helpers'
import { nameWithIndex } from '@/utils/nft'

export const useCollectionActivity = ({
  collectionId,
  prefix,
}: {
  collectionId: ComputedRef<string>
  prefix?: Prefix
}) => {
  const { urlPrefix } = usePrefix()
  const events = ref<InteractionWithNFT[]>([])
  const owners = ref<Owners>()
  const flippers = ref<Flippers>()
  const offers = ref<Offer[]>([])

  const queryPrefixMap = {
    ksm: 'chain-ksm',
  }

  const queryPrefix = queryPrefixMap[prefix ?? urlPrefix.value] || 'subsquid'
  const variables = computed(() => ({
    id: collectionId.value,
  }))

  const { data: queryData, isLoading: loading } = useQuery({
    queryKey: ['collection-activity-events', prefix, variables],
    queryFn: () =>
      collectionId.value
        ? useGraphql({
          queryPrefix,
          queryName: 'collectionActivityEvents',
          variables: variables.value,
          clientName: prefix,
        })
        : null,
    staleTime: 1000 * 10,
  })

  watch(
    computed(() => queryData.value?.data),
    (result) => {
      if (result) {
        const nfts
          = result.collection?.nfts.map(nft => ({
            ...nft,
            name: nameWithIndex(nft?.name, nft?.sn),
          })) ?? []
        // flat events for chart
        const interactions: InteractionWithNFT[] = nfts
          .map(nft =>
            nft.events.map(e => ({
              ...e,
              timestamp: new Date(e.timestamp).getTime(),
              nft: {
                ...nft,
                events: undefined,
              },
            })),
          )
          .flat()
        events.value = interactions

        // not to repeat ref names
        const ownersTemp = getOwners(nfts)
        const flippersTemp = getFlippers(interactions)

        const flipperdIds = Object.keys(flippersTemp)
        const OwnersIds = Object.keys(ownersTemp)

        flipperdIds.forEach((id) => {
          if (OwnersIds.includes(id)) {
            ownersTemp[id].totalSold = flippersTemp[id].totalsold
          }
        })

        owners.value = ownersTemp
        flippers.value = flippersTemp
      }
    },
    { immediate: true },
  )
  return {
    events,
    owners,
    flippers,
    offers,
    loading,
  }
}
