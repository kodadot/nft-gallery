import type { CarouselNFT } from '@/components/base/types'
import type { RowSeries } from '@/components/series/types'

import {
  convertLastEventFlatNft,
  formatNFT,
  setCarouselMetadata,
} from '@/utils/carousel'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { sortItemListByIds } from '@/utils/sorting'
import { correctPrefix } from '@/utils/uniquery'
import { isProduction } from '@/utils/chain'

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
  latestSales: {
    limit,
    event: 'BUY',
  },
  newestList: {
    limit,
    event: 'LIST',
  },
}

const useChainEvents = (chain, type) => {
  const { data, loading } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'lastNftListByEvent',
    variables: nftEventVariables[type],
    clientName: correctPrefix(chain),
  })

  return {
    data,
    loading,
  }
}

export const useCarouselNftEvents = ({ type }: Types) => {
  const { data: dataRmrk, loading: loadingRmrk } = useChainEvents('rmrk', type)
  const { data: dataSnek, loading: loadingSnek } = useChainEvents('snek', type)
  const { data: dataBsx, loading: loadingBsx } = useChainEvents('bsx', type)
  const { data: dataRmrk2, loading: loadingRmrk2 } = useChainEvents(
    'rmrk2',
    type
  )
  const nfts = ref<CarouselNFT[]>([])

  const flattenNFT = async (data, chain) => {
    if (!data?.events.length) {
      return []
    }

    const events = data.events.map(convertLastEventFlatNft)
    const listOfNfts = await formatNFT(events, chain)
    return await setCarouselMetadata(listOfNfts)
  }

  // currently only support rmrk and snek
  // moonriver: https://github.com/kodadot/nft-gallery/issues/3891
  watch([loadingRmrk, loadingSnek, loadingBsx, loadingRmrk2], async () => {
    if (
      !loadingRmrk.value &&
      !loadingSnek.value &&
      !loadingBsx.value &&
      !loadingRmrk2.value
    ) {
      const rmrkNfts = await flattenNFT(dataRmrk.value, 'rmrk')
      const snekNfts = await flattenNFT(dataSnek.value, 'snek')
      const bsxNfts = await flattenNFT(dataBsx.value, 'bsx')
      const rmrk2Nfts = await flattenNFT(dataRmrk2.value, 'rmrk2')

      const data = [...rmrkNfts, ...bsxNfts]

      if (!isProduction) {
        data.push(...snekNfts)
        data.push(...rmrk2Nfts)
      }

      nfts.value = data.sort((a, b) => b.unixTime - a.unixTime).slice(0, 30)
    }
  })

  return {
    nfts,
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
    queryPrefix: urlPrefix.value === 'rmrk2' ? 'chain-rmrk2' : 'subsquid',
    variables: {
      id: collectionId,
      nftId: $route.params.id,
      limit: 60,
    },
  })
  const nfts = ref<CarouselNFT[]>([])

  watch(data, async () => {
    if (data.value) {
      const listOfRelatedNFTs = await formatNFT(
        (data.value as Collections).collection?.nfts
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

      if (filteredNftsNullMeta) {
        const sortedNftList = sortItemListByIds(filteredNftsNullMeta, ids, 30)
        nfts.value = await formatNFT(sortedNftList)
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
