import {
  Flippers,
  InteractionWithNFT,
  Offer,
  Owners,
} from '../../components/collection/utils/types'
import { getFlippers, getOffers, getOwners } from './helpers'

export const useCollectionActivity = ({ collectionId }) => {
  const { urlPrefix } = usePrefix()
  const events = ref<InteractionWithNFT[]>([])
  const owners = ref<Owners>()
  const flippers = ref<Flippers>()
  const offers = ref<Offer[]>([])

  const queryPrefix = urlPrefix.value === 'bsx' ? 'chain-bsx' : 'subsquid'

  const { data } = useGraphql({
    queryPrefix,
    queryName: 'collectionActivityEvents',
    variables: {
      id: collectionId,
    },
  })

  watch(data, (result) => {
    if (result?.collection) {
      // flat events for chart
      const interactions: InteractionWithNFT[] = result.collection.nfts
        .map((nft) =>
          nft.events.map((e) => ({
            ...e,
            timestamp: new Date(e.timestamp).getTime(),
            nft: { ...nft, events: undefined },
          }))
        )
        .flat()
      events.value = interactions

      if (urlPrefix.value === 'bsx') {
        offers.value = getOffers(result.collection.nfts)
      }

      // not to repeat ref names
      const ownersTemp = getOwners(result.collection.nfts)
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
