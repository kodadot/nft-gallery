import type { Prefix } from '@kodadot1/static'
import type { ResultOf } from 'gql.tada'
import type { CarouselNFT } from '@/components/base/types'
import type { NFTWithMetadata } from '@/composables/useNft'
import { formatNFT } from '@/utils/carousel'
import latestEvents from '@/queries/subsquid/general/latestEvents'

interface Types {
  type: 'latestSales' | 'newestList'
}

const nftEventVariables = {
  latestSales: { interaction_eq: 'BUY' },
  newestList: { interaction_eq: 'LIST' },
}

const fetchLatestEvents = async (chain, type, where = {}, limit = 20) => {
  const { $apolloClient } = useNuxtApp()
  return await $apolloClient.query({
    query: latestEvents,
    variables: {
      limit,
      orderBy: ['timestamp_DESC'],
      where: {
        ...nftEventVariables[type],
        ...where,
      },
      chain,
    },
    context: {
      endpoint: chain,
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

export const useEvents = (chain, type, limit = 10, collectionIds) => {
  const collections = reactive({})
  const items = ref<
    (NFTWithMetadata & {
      timestamp: string
      latestSalePrice?: string
    })[]
  >([])

  const excludeNfts = computed(() => items.value.map(nft => nft.id))
  const excludeCollections = computed(() =>
    Object.entries(collections)
      .filter(([_, count]) => count === LIMIT_PER_COLLECTION)
      .map(([id]) => id),
  )

  const duplicate = (nft) => {
    return items.value.some(item => item.id === nft.id)
  }

  const where = createEventQuery(
    type,
    excludeNfts,
    excludeCollections,
    collectionIds,
  )

  const data = ref<ResultOf<typeof latestEvents>>()
  fetchLatestEvents(chain, type, where).then((result) => {
    data.value = result.data
  })

  const constructNfts = async () => {
    const events = (
      data.value as {
        events: { meta: string, nft: NFTWithMetadata, timestamp: string }[]
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
            collections[nft.collection?.id] < LIMIT_PER_COLLECTION
            && items.value.length < limit
            && !duplicate(nft)
          ) {
            collections[nft.collection?.id] += 1
            items.value.push(nft)
          }
        }
        else {
          collections[nft.collection?.id] = 1
          items.value.push(nft)
        }
      }
    })
  }

  watchEffect(async () => {
    if (items.value.length < limit && data.value) {
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

const sortNftByTime = data => data.sort((a, b) => b.unixTime - a.unixTime)

export const sortNfts = (data) => {
  const nfts = ref<CarouselNFT[]>([])
  nfts.value = sortNftByTime(data)

  return {
    nfts,
    ids: computed(() => nfts.value.map(nft => nft.id).join()),
  }
}

const CAROUSEL_LIMIT: Partial<Record<Prefix, number>> = {
  ahp: 15,
  ahk: 15,
}

export const useCarouselNftEvents = ({ type }: Types) => {
  const nfts = ref<CarouselNFT[]>([])
  const items = computed(() => sortNfts(nfts.value))

  const eventsDataRefs = Object.keys(CAROUSEL_LIMIT).map((chain) => {
    const { data } = useEvents(chain, type, CAROUSEL_LIMIT[chain])
    return data
  })

  watchEffect(() => {
    nfts.value = eventsDataRefs.flatMap(dataRef => dataRef.value)
  })

  return computed(() => items.value.nfts)
}
