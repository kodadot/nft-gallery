import { Event, FilterOption } from './types'
import { Interaction as _Interaction } from '@kodadot1/minimark/v1'
import { sortedEventByDate } from '@/utils/sorting'
import collectionByAccountQuery from '@/queries/subsquid/general/collectionByAccount.query'

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
    [Interaction.SALE]: 'bg-k-pink',
    [Interaction.OFFER]: 'bg-k-green-accent',
    [Interaction.ACCEPTED_OFFER]: 'bg-k-blue-accent',
  }

  return colorMap[key]
}

export const useNotification = () => {
  const { apiInstance } = useApi()
  const { accountId } = useAuth()
  const collections = ref<FilterOption[]>([])
  const events = ref<Event[]>([])

  async function currentBlock() {
    const api = await apiInstance.value
    const block = await api.rpc.chain.getHeader()
    return block.number.toNumber()
  }

  const { data: collectionData } = useAsyncQuery({
    query: collectionByAccountQuery,
    variables: {
      account: accountId.value,
    },
  })
  const { data: eventData, loading } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'notificationsByAccount',
    variables: {
      account: accountId.value,
    },
  })

  watch(collectionData, (result) => {
    collections.value = result.collectionEntities.map((collection) => ({
      id: collection.id,
      name: collection.name ?? '',
    }))
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
          Number(event.offer.expiration) > Number(currentBlockNumber),
      )
    events.value = sortedEventByDate(
      [...result.events, ...offerEvents],
      'ASC',
    ) as unknown as Event[]
  })

  return {
    collections,
    events,
    loading,
  }
}
