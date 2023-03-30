import { Event, FilterOption } from './types'

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
    },
  })

  watch(collectionData, (result) => {
    if (result.collectionEntities) {
      collections.value = result.collectionEntities
    }
  })

  watch(eventsData, (result) => {
    if (result.events) {
      events.value = result.events
    }
  })

  return {
    collections,
    events,
    nfts,
  }
}
