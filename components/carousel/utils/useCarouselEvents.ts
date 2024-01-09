import type { CarouselNFT } from '@/components/base/types'
import type { NFTWithMetadata } from '@/composables/useNft'
import { isBeta, isProduction } from '@/utils/chain'
import { formatNFT } from '@/utils/carousel'
import { Prefix } from '@kodadot1/static'
import latestEvents from '@/queries/subsquid/general/latestEvents.graphql'
import latestEventsRmrkv2 from '@/queries/subsquid/ksm/latestEvents.graphql'
import unionBy from 'lodash/unionBy'

const MAX_NFT_CAROUSEL_AMOUNT = 30

type CarouselEventsChainLimit = Partial<Record<Prefix, number>>

type Types = 'latestSales' | 'newestList'

const limit = isProduction ? 15 : 8

const nftEventVariables = {
  latestSales: { interaction_eq: 'BUY' },
  newestList: { interaction_eq: 'LIST' },
}

const disableChainsOnBeta = ['ahr']

const fetchLatestEvents = async (chain, type, where = {}, limit = 5) => {
  const query = chain === 'ksm' ? latestEventsRmrkv2 : latestEvents

  return await useAsyncQuery({
    query,
    clientId: chain,
    variables: {
      // limit: limit, TODO: use limit
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
  collectionIds,
  excludeCollectionId,
) => ({
  nft: {
    ...(type === 'newestList' && { price_gt: 0 }),
    id_not_in: [...new Set(excludeNftId.value)],
    collection: {
      ...(collectionIds && { id_in: collectionIds }),
      id_not_in: [...new Set(excludeCollectionId.value)],
    },
  },
})

const useChainEvents = async (
  chain,
  type,
  eventQueryLimit,
  collectionIds,
  withLastestSale = true,
  nftLimit = limit,
) => {
  const nfts = ref<
    { nft: NFTWithMetadata; timestamp: string; latestSalePrice?: string }[]
  >([])
  const uniqueNftId = ref<string[]>([])
  const totalCollection = reactive({})
  const excludeCollectionId = ref<string[]>([])
  const excludeNftId = ref<string[]>([])

  if ((isBeta || isProduction) && disableChainsOnBeta.includes(chain)) {
    return {
      data: ref(undefined),
    }
  }

  const pushNft = (nft) => {
    if (
      !uniqueNftId.value.includes(nft.nft.id) &&
      nfts.value.length < nftLimit
    ) {
      uniqueNftId.value.push(nft.nft.id)
      if (type === 'latestSales' && withLastestSale) {
        nft.latestSalePrice = nft.meta
      }
      nfts.value.push(nft)
    }
  }

  const limitCollection = (nft) => {
    excludeNftId.value.push(nft.nft.id)

    if (totalCollection[nft.nft.collection.id]) {
      totalCollection[nft.nft.collection.id] += 1

      // limit nft in same collection by 3
      if (!collectionIds && totalCollection[nft.nft.collection.id] > 3) {
        return excludeCollectionId.value.push(nft.nft.collection.id)
      }

      return pushNft(nft)
    }

    totalCollection[nft.nft.collection.id] = 1
    pushNft(nft)
  }
  const query = createEventQuery(
    type,
    excludeNftId,
    collectionIds,
    excludeCollectionId,
  )

  const { data } = await fetchLatestEvents(chain, type, query, eventQueryLimit)
  data.value?.events?.forEach((nft) => limitCollection(nft))

  return {
    data: nfts,
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

const limitDisplayNfts = (data) => {
  const nfts = ref<CarouselNFT[]>([])

  const sortedNfts = sortNftByTime(data).slice(0, MAX_NFT_CAROUSEL_AMOUNT)

  nfts.value = sortedNfts

  return {
    nfts,
    ids: computed(() => nfts.value.map((nft) => nft.id).join()),
  }
}

export const useCarouselNftEvents = ({
  type,
  limit: nftsLimit,
}: {
  type: Types
  limit?: CarouselEventsChainLimit
}) => {
  const nfts = ref<CarouselNFT[]>([])
  const items = computed(() => limitDisplayNfts(nfts.value))

  const chains = ['ahk', 'ahp', 'rmrk', 'ksm']
  const nftPerChain = Math.floor(MAX_NFT_CAROUSEL_AMOUNT / chains.length)

  onMounted(async () => {
    for (const chain of chains) {
      let nftLimit = nftPerChain

      if (nftsLimit?.[chain]) {
        nftLimit = nftsLimit[chain] + nftPerChain
      }

      const queryLimit = Math.max(nftLimit, limit)

      useChainEvents(chain, type, queryLimit, null, true, nftLimit).then(
        ({ data }) => nfts.value.push(...flattenNFT(data.value, chain)),
      )
    }
  })

  return computed(() => items.value.nfts)
}

const GENERATIVE_QUERY_LIMIT = 10
const AHK_GENERATIVE_LIMIT = 6
const AHP_GENERATIVE_LIMIT = 18

export const useCarouselGenerativeNftEvents = (
  ahkCollectionIds: string[],
  ahpCollectionIds: string[],
) => {
  const nfts = ref<CarouselNFT[]>([])

  const eventType = ['latestSales', 'newestList']
  const chainsInfo: Partial<
    Record<Prefix, { limit: number; collectionIds: string[] }>
  > = {
    ahk: { limit: AHK_GENERATIVE_LIMIT, collectionIds: ahkCollectionIds },
    ahp: { limit: AHP_GENERATIVE_LIMIT, collectionIds: ahpCollectionIds },
  }

  onMounted(() => {
    eventType.forEach((type) => {
      Object.entries(chainsInfo).forEach(
        ([chain, { limit: chainLimit, collectionIds }]) => {
          useChainEvents(
            chain,
            type,
            GENERATIVE_QUERY_LIMIT,
            collectionIds,
            true,
            Math.floor(chainLimit / eventType.length),
          ).then(({ data }) =>
            nfts.value.push(...flattenNFT(data.value, chain)),
          )
        },
      )
    })
  })

  return computed(() => limitDisplayNfts(unionBy(nfts.value, 'id')).nfts)
}
