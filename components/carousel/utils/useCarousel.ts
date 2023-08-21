import type { CarouselNFT } from '@/components/base/types'
import type { RowSeries } from '@/components/series/types'

import { formatNFT, setCarouselMetadata } from '@/utils/carousel'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { sortItemListByIds } from '@/utils/sorting'
import { isBeta, isProduction } from '@/utils/chain'

export const useCarouselUrl = () => {
  const { urlPrefix } = usePrefix()

  const urlOf = ({ id = '', url = '', chain = '' }): string => {
    return `/${chain || urlPrefix.value}/${url}/${id}`
  }

  return {
    urlOf,
  }
}

interface Types {
  type: 'latestSales' | 'newestList'
}

const limit = isProduction ? 15 : 8

const nftEventVariables = {
  latestSales: { interaction_eq: 'BUY' },
  newestList: { interaction_eq: 'LIST' },
}

const disableChainsOnBeta = ['snek']

const useChainEvents = (chain, type) => {
  if ((isBeta || isProduction) && disableChainsOnBeta.includes(chain)) {
    return {
      data: ref(undefined),
    }
  }

  const { data } = useGraphql({
    queryName: 'latestEvents',
    queryPrefix: chain === 'ksm' ? 'chain-ksm' : chain,
    clientName: chain,
    variables: {
      limit,
      orderBy: 'timestamp_DESC',
      where: nftEventVariables[type],
    },
  })

  return {
    data,
  }
}

const flattenNFT = (data, chain) => {
  if (!data?.events.length) {
    return []
  }

  const flatNfts = data.events.map((nft) => {
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
  watch(
    [dataAhk, dataAhp, dataBsx, dataSnek, dataRmrk, dataRmrk2],
    async () => {
      const data = [
        ...flattenNFT(dataAhk.value, 'ahk'),
        ...flattenNFT(dataAhp.value, 'ahp'),
        ...flattenNFT(dataBsx.value, 'bsx'),
        ...flattenNFT(dataSnek.value, 'snek'),
        ...flattenNFT(dataRmrk.value, 'rmrk'),
        ...flattenNFT(dataRmrk2.value, 'ksm'),
      ]

      const sortedNfts = sortNftByTime(data).slice(0, 30)

      console.log('sortedNfts', sortedNfts)

      nfts.value = sortedNfts
    }
  )

  return {
    nfts,
    ids: computed(() => nfts.value.map((nft) => nft.id).join()),
  }
}

const popularCollectionsGraphql = {
  queryPrefix: 'subsquid',
  queryName: 'popularCollectionList',
  variables: {
    orderDirection: 'ASC',
    limit: 10,
    dateRange: '7 DAY',
    orderBy: 'volume',
  },
}
export const useCarouselPopularCollections = () => {
  const { data } = useGraphql(popularCollectionsGraphql)
  const nfts = ref<RowSeries[]>([])

  const handleResult = ({ data: result }) => {
    nfts.value = result.seriesInsightTable.map(
      (e: RowSeries): RowSeries => ({
        ...e,
        image: sanitizeIpfsUrl(e.image, 'image'),
      })
    )
  }

  watch(data, () => {
    if (data.value) {
      handleResult({ data: data.value })
    }
  })

  return {
    nfts,
  }
}

interface Collections {
  collection: {
    id: string
    name: string
    nfts: CarouselNFT[]
  }
}

export const useCarouselRelated = ({ collectionId }) => {
  const { $route } = useNuxtApp()
  const { urlPrefix } = usePrefix()
  const { data } = useGraphql({
    queryName: 'collectionEntityById',
    queryPrefix: urlPrefix.value === 'ksm' ? 'chain-ksm' : 'subsquid',
    variables: {
      id: collectionId,
      nftId: $route.params.id,
      limit: 60,
    },
  })
  const nfts = ref<CarouselNFT[]>([])

  watch(data, async () => {
    if (data.value) {
      const listOfRelatedNFTs = formatNFT(
        (data.value as Collections).collection.nfts
      )
      nfts.value = await setCarouselMetadata(listOfRelatedNFTs)
    }
  })

  return {
    nfts,
  }
}

interface VisitedNFTs {
  nftEntities: CarouselNFT[]
}

export const useCarouselVisited = ({ ids }) => {
  const nfts = ref<CarouselNFT[]>([])

  if (!ids.length) {
    return {
      nfts,
    }
  }

  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'nftEntitiesByIDs',
    variables: {
      ids,
    },
  })

  watch(data, async () => {
    if (data.value) {
      const dataNfts = data.value as VisitedNFTs
      const filteredNftsNullMeta = dataNfts.nftEntities.filter(
        (nft) => nft.meta !== null
      )

      if (filteredNftsNullMeta.length) {
        const sortedNftList = sortItemListByIds(filteredNftsNullMeta, ids, 30)
        nfts.value = formatNFT(sortedNftList)
      }
    }
  })

  return {
    nfts,
  }
}

// scroll wheel carousel events
// https://codesandbox.io/s/github/rcbyr/keen-slider-sandboxes/tree/v6/navigation-controls/scroll-wheel-controls/vue3?file=/src/App.vue
let touchTimeout
let position
let wheelActive

function dispatch(event, name, slider) {
  position.x -= event.deltaX
  position.y -= event.deltaY
  slider.container.dispatchEvent(
    new CustomEvent(name, {
      detail: {
        x: position.x,
        y: position.y,
      },
    })
  )
}

export const wheelControls = (slider) => {
  function eventWheel(event) {
    if (event.deltaX !== 0) {
      if (!wheelActive) {
        position = {
          x: event.pageX,
          y: event.pageY,
        }
        dispatch(event, 'ksDragStart', slider) // wheel start
        wheelActive = true
      }
      dispatch(event, 'ksDrag', slider) // wheel
      clearTimeout(touchTimeout)
      touchTimeout = setTimeout(() => {
        wheelActive = false
        dispatch(event, 'ksDragEnd', slider) // wheel end
      }, 50)
    }
  }

  slider.on('created', () => {
    slider.container.addEventListener('wheel', eventWheel, {
      passive: true,
    })
  })
}
