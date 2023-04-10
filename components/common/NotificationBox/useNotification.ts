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

export const useNotification = () => {
  const { apiInstance } = useApi()
  const { accountId } = useAuth()
  const { urlPrefix } = usePrefix()
  const collections = ref<FilterOption[]>([])
  const events = ref<Event[]>([])

  async function currentBlock() {
    const api = await apiInstance.value
    const block = await api.rpc.chain.getHeader()
    return block.number.toNumber()
  }

  const { data: collectionData } = useGraphql({
    queryName: 'collectionByAccount',
    variables: {
      account: accountId.value,
    },
  })
  const { data: eventData, loading } = useGraphql({
    queryPrefix:
      urlPrefix.value === 'bsx' || urlPrefix.value === 'snek'
        ? 'chain-bsx'
        : 'subsquid',
    queryName: 'notificationsByAccount',
    variables: {
      account: accountId.value,
    },
  })

  watch(collectionData, (result) => {
    collections.value = result.collectionEntities ?? []
  })

  watch(eventData, async (result) => {
    const currentBlockNumber = await currentBlock()
    const offerEvents = (result.offerEvents ?? [])
      .map((event) => ({
        ...event,
        nft: {
          ...event.offer.nft,
        },
      }))
      .filter(
        (event) =>
          event.interaction === Interaction.OFFER &&
          Number(event.offer.expiration) > Number(currentBlockNumber)
      )
    events.value = sortedEventByDate(
      [...result.events, ...offerEvents],
      'ASC'
    ) as unknown as Event[]
  })

  return {
    collections,
    events,
    loading,
  }
}
