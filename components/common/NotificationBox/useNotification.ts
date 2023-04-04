import { Event, FilterOption } from './types'

export const Interaction = {
  SALE: 'SALE',
  OFFER: 'OFFER',
  ACCEPTED_OFFER: 'ACCEPTED_OFFER',
}

export const useNotification = (account: string) => {
  const collections = ref<FilterOption[]>([])
  const events = ref<Event[]>([])
  const nfts = ref([])

  const { data: collectionData } = useGraphql({
    queryName: 'collectionByAccount',
    variables: {
      account,
    },
  })
  const { data: eventsData } = useGraphql({
    queryName: 'eventListByAccount',
    variables: {
      account,
      interaction: [
        Interaction.SALE,
        Interaction.OFFER,
        Interaction.ACCEPTED_OFFER,
      ],
    },
  })

  watch(collectionData, (result) => {
    collections.value = result.collectionEntities ?? []
  })

  watch(eventsData, (result) => {
    events.value = result.events ?? []
  })

  return {
    collections,
    events,
    nfts,
  }
}
