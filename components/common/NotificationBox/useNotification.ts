import { Event, FilterOption } from './types'
import { Interaction as _Interaction } from '@kodadot1/minimark'
import { sortedEventByDate } from '@/utils/sorting'

export const Interaction = {
  SALE: _Interaction.BUY,
  OFFER: 'CREATE',
  ACCEPTED_OFFER: 'ACCEPT',
}

export const getInteractionName = (key: string) => {
  const { $i18n } = useNuxtApp()
  const nampMap = {
    [Interaction.SALE]: $i18n.t('filters.sale'),
    [Interaction.OFFER]: $i18n.t('filters.offer'),
    [Interaction.ACCEPTED_OFFER]: $i18n.t('filters.acceptedOffer'),
  }

  return nampMap[key]
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

  const { data: eventData } = useGraphql({
    queryName: 'notificationsByAccount',
    variables: {
      account,
    },
  })

  watch(collectionData, (result) => {
    collections.value = result.collectionEntities ?? []
  })

  watch(eventData, (result) => {
    const offerEvents = result.offerEvents.map((event) => ({
      ...event,
      nft: {
        ...event.offer.nft,
        price: event.offer.price,
      },
    }))
    events.value = sortedEventByDate(
      [...result.events, ...offerEvents],
      'ASC'
    ) as unknown as Event[]
  })

  return {
    collections,
    events,
    nfts,
  }
}
