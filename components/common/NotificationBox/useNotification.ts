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
  const nameMap = {
    [Interaction.SALE]: $i18n.t('filters.sale'),
    [Interaction.OFFER]: $i18n.t('filters.offer'),
    [Interaction.ACCEPTED_OFFER]: $i18n.t('filters.acceptedOffer'),
  }

  return nameMap[key]
}

export const getInteractionColor = (key: string) => {
  const colorMap = {
    [Interaction.SALE]: 'k-pink',
    [Interaction.OFFER]: 'k-greenaccent',
    [Interaction.ACCEPTED_OFFER]: 'k-blueaccent',
  }

  return colorMap[key]
}

export const useNotification = (account: string) => {
  const collections = ref<FilterOption[]>([])
  const events = ref<Event[]>([])

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
  }
}
