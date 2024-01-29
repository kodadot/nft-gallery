import { Interaction } from '@kodadot1/minimark/v2'

export type EventMinimalNft = { id: string; metadata: string }

type MinimalEventsQuery = { events?: { nft: EventMinimalNft; meta: string }[] }

type UseMinimalEventsParams = {
  interaction?: Interaction
  where?: any
  limit?: number
}

export default function useMinimalEvents({
  interaction,
  where,
  limit = 3,
}: UseMinimalEventsParams) {
  const { data } = useGraphql<MinimalEventsQuery>({
    queryName: 'useMinimalEvents',
    variables: {
      interaction: interaction,
      and: { ...where },
    },
  })

  const events = computed(() => data.value?.events || [])

  const sortedByPrice = computed(() =>
    events.value.sort((a, b) => Number(b.meta) - Number(a.meta)),
  )

  const nftEntities = computed<EventMinimalNft[]>(() =>
    sortedByPrice.value.slice(0, limit).map((event) => event.nft),
  )

  return { nftEntities }
}
