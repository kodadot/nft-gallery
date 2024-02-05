import type { CarouselNFT } from '@/components/base/types'
import type { NFTWithMetadata } from '@/composables/useNft'
import type { Prefix } from '@kodadot1/static'
import { formatNFT } from '@/utils/carousel'
import { AHK_GENERATIVE_DROPS, AHP_GENERATIVE_DROPS } from '@/utils/drop'

import latestEvents from '@/queries/subsquid/general/latestEvents.graphql'
import latestEventsRmrkv2 from '@/queries/subsquid/ksm/latestEvents.graphql'
import unionBy from 'lodash/unionBy'

interface Types {
  type: 'latestSales' | 'newestList'
}

const nftEventVariables = {
  latestSales: { interaction_eq: 'BUY' },
  newestList: { interaction_eq: 'LIST' },
}

const fetchLatestEvents = async (chain, type, where = {}, limit = 20) => {
  const query = chain === 'ksm' ? latestEventsRmrkv2 : latestEvents

  return await useAsyncQuery({
    query,
    clientId: chain,
    variables: {
      limit,
      orderBy: 'timestamp_DESC',
      where: {
        ...nftEventVariables[type],
        ...where,
      },
    },
  })
}

const createEventQuery = (
  type,
  excludeNftId,
  excludeCollectionId,
  collectionIds = [],
) => ({
  nft: {
    ...(type === 'newestList' && { price_gt: 0 }),
    id_not_in: [...new Set(excludeNftId.value)],
    collection: {
      ...(collectionIds.length && { id_in: collectionIds }),
      id_not_in: [...new Set(excludeCollectionId.value)],
    },
  },
})

const LIMIT_PER_COLLECTION = 3

const useEvents = (chain, type, limit = 10, collectionIds = []) => {
  const collections = reactive({})
  const items = ref<
    (NFTWithMetadata & {
      timestamp: string
      latestSalePrice?: string
    })[]
  >([])

  const excludeNfts = computed(() => items.value.map((nft) => nft.id))
  const excludeCollections = computed(() =>
    Object.entries(collections)
      .filter(([_, count]) => count === LIMIT_PER_COLLECTION)
      .map(([id]) => id),
  )

  const duplicate = (nft) => {
    return items.value.some((item) => item.id === nft.id)
  }

  const constructNfts = async () => {
    const where = createEventQuery(
      type,
      excludeNfts,
      excludeCollections,
      collectionIds,
    )
    const { data } = await fetchLatestEvents(chain, type, where)
    const events = (
      data.value as {
        events: { meta: string; nft: NFTWithMetadata; timestamp: string }[]
      }
    ).events

    events.forEach((event) => {
      const nft = {
        ...event.nft,
        timestamp: event.timestamp,
        latestSalePrice: '',
      }

      if (type === 'latestSales') {
        nft.latestSalePrice = event.meta
      }

      if (nft.collection?.id) {
        if (collections[nft.collection?.id]) {
          if (
            collections[nft.collection?.id] < LIMIT_PER_COLLECTION &&
            items.value.length < limit &&
            !duplicate(nft)
          ) {
            collections[nft.collection?.id] += 1
            items.value.push(nft)
          }
        } else {
          collections[nft.collection?.id] = 1
          items.value.push(nft)
        }
      }
    })
  }

  watchEffect(async () => {
    if (items.value.length < limit) {
      await constructNfts()
    }
  })

  return {
    data: computed(() => formatNFT(items.value.slice(0, limit), chain)),
  }
}

export const flattenNFT = (data, chain) => {
  if (!data?.length) {
    return []
  }

  const flatNfts = data.map((nft) => {
    return {
      ...nft.nft,
      timestamp: nft.timestamp,
      latestSalePrice: nft.latestSalePrice,
    }
  })

  return formatNFT(flatNfts, chain)
}

const sortNftByTime = (data) => data.sort((a, b) => b.unixTime - a.unixTime)

const sortNfts = (data) => {
  const nfts = ref<CarouselNFT[]>([])
  nfts.value = sortNftByTime(data)

  return {
    nfts,
    ids: computed(() => nfts.value.map((nft) => nft.id).join()),
  }
}

const CAROUSEL_LIMIT: Partial<Record<Prefix, number>> = {
  ahp: 11,
  ahk: 11,
  rmrk: 4,
  ksm: 4,
}

export const useCarouselNftEvents = ({ type }: Types) => {
  const nfts = ref<CarouselNFT[]>([])
  const items = computed(() => sortNfts(nfts.value))

  const eventsDataRefs = Object.keys(CAROUSEL_LIMIT).map((chain) => {
    const { data } = useEvents(chain, type, CAROUSEL_LIMIT[chain])
    return data
  })

  watchEffect(() => {
    nfts.value = eventsDataRefs.flatMap((dataRef) => dataRef.value)
  })

  return computed(() => items.value.nfts)
}

const GENERATIVE_CONFIG: Partial<
  Record<Prefix, { limit: number; collections: string[] }>
> = {
  ahp: {
    limit: 12,
    collections: AHP_GENERATIVE_DROPS,
  },
  ahk: {
    limit: 3,
    collections: AHK_GENERATIVE_DROPS,
  },
}

export const useCarouselGenerativeNftEvents = () => {
  const nfts = ref<CarouselNFT[]>([])
  const eventType = ['newestList', 'latestSales']

  const eventsDataRefs = Object.keys(GENERATIVE_CONFIG).map((chain) => {
    return eventType.map((eventName) => {
      const { data } = useEvents(
        chain,
        eventName,
        GENERATIVE_CONFIG[chain].limit,
        GENERATIVE_CONFIG[chain].collections,
      )
      return data
    })
  })

  watchEffect(() => {
    nfts.value = eventsDataRefs.flat().flatMap((dataRef) => dataRef.value)
  })

  return computed(() => sortNfts(unionBy(nfts.value, 'id')).nfts)
}
