import type { CarouselNFT } from '@/components/base/types'
import type { NFTWithMetadata } from '@/composables/useNft'
import { isBeta, isProduction } from '@/utils/chain'
import { formatNFT } from '@/utils/carousel'

import latestEvents from '@/queries/subsquid/general/latestEvents.graphql'
import latestEventsRmrkv2 from '@/queries/subsquid/ksm/latestEvents.graphql'

interface Types {
  type: 'latestSales' | 'newestList'
}

const limit = isProduction ? 15 : 8

const nftEventVariables = {
  latestSales: { interaction_eq: 'BUY' },
  newestList: { interaction_eq: 'LIST' },
}

const disableChainsOnBeta = ['snek']

const fetchLatestEvents = (chain, type, where = {}) => {
  const { $apollo } = useNuxtApp()
  const query = chain === 'ksm' ? latestEventsRmrkv2 : latestEvents

  return $apollo.query({
    query,
    client: chain,
    variables: {
      limit: limit,
      orderBy: 'timestamp_DESC',
      where: {
        ...nftEventVariables[type],
        ...where,
      },
    },
  })
}

const useChainEvents = (chain, type) => {
  const nfts = ref<{ nft: NFTWithMetadata; timestamp: string }[]>([])
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
    if (!uniqueNftId.value.includes(nft.nft.id) && nfts.value.length < limit) {
      uniqueNftId.value.push(nft.nft.id)
      nfts.value.push(nft)
    }
  }

  const limitCollection = (nft) => {
    excludeNftId.value.push(nft.nft.id)

    if (totalCollection[nft.nft.collection.id]) {
      totalCollection[nft.nft.collection.id] += 1

      // limit nft in same collection by 3
      if (totalCollection[nft.nft.collection.id] > 3) {
        return excludeCollectionId.value.push(nft.nft.collection.id)
      }

      return pushNft(nft)
    }

    totalCollection[nft.nft.collection.id] = 1
    pushNft(nft)
  }

  const fetchEvents = () => {
    fetchLatestEvents(chain, type, {
      nft: {
        ...(type === 'newestList' && { price_gt: 0 }),
        id_not_in: [...new Set(excludeNftId.value)],
        collection: {
          id_not_in: [...new Set(excludeCollectionId.value)],
        },
      },
    }).then((response) => {
      response.data.events.forEach((nft) => {
        limitCollection(nft)
      })
    })
  }

  watchEffect(() => {
    if (nfts.value.length < limit) {
      fetchEvents()
    }
  })

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
    }
  })

  return formatNFT(flatNfts, chain)
}

const sortNftByTime = (data) => data.sort((a, b) => b.unixTime - a.unixTime)

export const useCarouselNftEvents = ({ type }: Types) => {
  const { data: dataAhk } = useChainEvents('ahk', type)
  const { data: dataAhp } = useChainEvents('ahp', type)
  const { data: dataBsx } = useChainEvents('bsx', type)
  const { data: dataSnek } = useChainEvents('snek', type)
  const { data: dataRmrk } = useChainEvents('rmrk', type)
  const { data: dataRmrk2 } = useChainEvents('ksm', type)

  const nfts = ref<CarouselNFT[]>([])

  // moonriver: https://github.com/kodadot/nft-gallery/issues/3891
  watchEffect(async () => {
    const data = [
      ...flattenNFT(dataAhk.value, 'ahk'),
      ...flattenNFT(dataAhp.value, 'ahp'),
      ...flattenNFT(dataBsx.value, 'bsx'),
      ...flattenNFT(dataSnek.value, 'snek'),
      ...flattenNFT(dataRmrk.value, 'rmrk'),
      ...flattenNFT(dataRmrk2.value, 'ksm'),
    ]

    // show 30 nfts in carousel
    const sortedNfts = sortNftByTime(data).slice(0, 30)

    nfts.value = sortedNfts
  })

  return {
    nfts,
    ids: computed(() => nfts.value.map((nft) => nft.id).join()),
  }
}
