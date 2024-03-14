import { Flippers, InteractionWithNFT, Offer, Owners } from './types'
import { getFlippers, getOwners } from './helpers'
import { nameWithIndex } from '@/utils/nft'
import collectionActivityEvents from '@/queries/subsquid/general/collectionActivityEvents.graphql'

export const useCollectionActivity = ({
  collectionId,
}: { collectionId?: string } = {}) => {
  const { client } = usePrefix()
  const events = ref<InteractionWithNFT[]>([])
  const owners = ref<Owners>()
  const flippers = ref<Flippers>()
  const offers = ref<Offer[]>([])
  const { drop } = storeToRefs(useDropStore())
  const id = computed(() => collectionId ?? drop.value.collection)

  const { data } = useAsyncData(
    'collectionActivityEvents' + id.value,
    () =>
      useAsyncQuery({
        clientId: client.value,
        query: collectionActivityEvents,
        variables: {
          id,
        },
      }).then((res) => res.data.value),
    {
      watch: collectionId ? undefined : [() => drop.value?.collection],
    },
  )

  watch(data, (result) => {
    if (result) {
      const nfts = result.collection?.nfts ?? []
      // flat events for chart
      const interactions: InteractionWithNFT[] = nfts
        .map((nft) =>
          nft.events.map((e) => ({
            ...e,
            timestamp: new Date(e.timestamp).getTime(),
            nft: {
              ...nft,
              name: nameWithIndex(nft?.name, nft?.sn),
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
  })
  return {
    events,
    owners,
    flippers,
    offers,
  }
}
