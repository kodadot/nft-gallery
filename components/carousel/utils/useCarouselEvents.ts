import type { CarouselNFT } from '@/components/base/types'
import type { NFTWithMetadata } from '@/composables/useNft'
import { formatNFT } from '@/utils/carousel'

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

export const useCarouselNftEvents = ({ type }: Types) => {
  const nfts = ref<CarouselNFT[]>([])
  const items = computed(() => sortNfts(nfts.value))

  // total 30 items will show up on the carousel
  // sum from limits on the third parameter of useEvents
  const { data: ahp } = useEvents('ahp', type, 15)
  const { data: ahk } = useEvents('ahk', type, 9)
  const { data: ksm } = useEvents('ksm', type, 3)
  const { data: rmrk } = useEvents('rmrk', type, 3)

  watchEffect(async () => {
    nfts.value = [...ahp.value, ...ahk.value, ...ksm.value, ...rmrk.value]
  })

  return computed(() => items.value.nfts)
}

export const useCarouselGenerativeNftEvents = (
  ahkCollections,
  ahpCollections,
) => {
  const nfts = ref<CarouselNFT[]>([])

  const { data: ahpList } = useEvents('ahp', 'newestList', 6, ahpCollections)
  const { data: ahpSales } = useEvents('ahp', 'latestSales', 6, ahpCollections)
  const { data: ahkList } = useEvents('ahk', 'newestList', 3, ahkCollections)
  const { data: ahkSales } = useEvents('ahk', 'latestSales', 3, ahkCollections)

  watchEffect(() => {
    nfts.value = [
      ...ahpList.value,
      ...ahpSales.value,
      ...ahkList.value,
      ...ahkSales.value,
    ]
  })

  return computed(() => sortNfts(unionBy(nfts.value, 'id')).nfts)
}
