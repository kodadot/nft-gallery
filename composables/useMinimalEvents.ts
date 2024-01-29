import { Interaction } from '@kodadot1/minimark/v1'

export type EventMinimalNft = { id: string; metadata: string }
type MinimalEvent = { nft: EventMinimalNft; meta: string }
type MinimalEventsQuery = { events?: MinimalEvent[] }

type UseMinimalEventsParams = {
  interaction?: Interaction
  where?: any
}

export default function useMinimalEvents({
  interaction,
  where,
}: UseMinimalEventsParams) {
  const { data } = useGraphql<MinimalEventsQuery>({
    queryName: 'useMinimalEvents',
    variables: {
      interaction: interaction,
      and: { ...where },
    },
  })

  const events = computed(() => data.value?.events || [])

  const orderMinimalEventsByHighestMeta = (
    events: MinimalEvent[],
  ): MinimalEvent[] => events.sort((a, b) => Number(b.meta) - Number(a.meta))

  const getMinimalNfts = (
    events: MinimalEvent[],
    limit = 3,
  ): EventMinimalNft[] => events.slice(0, limit).map((event) => event.nft)

  return { events, orderMinimalEventsByHighestMeta, getMinimalNfts }
}
