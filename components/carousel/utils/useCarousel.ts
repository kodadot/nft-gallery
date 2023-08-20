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
  latestSales: [{ events_some: { interaction_eq: 'BUY' } }],
  newestList: [{ events_some: { interaction_eq: 'LIST' }, price_not_eq: '0' }],
}

const disableChainsOnBeta = ['snek']

const useChainEvents = (chain, type) => {
  if ((isBeta || isProduction) && disableChainsOnBeta.includes(chain)) {
    return {
      data: ref(undefined),
    }
  }

  const { data } = useSearchNfts({
    prefix: chain,
    search: nftEventVariables[type],
    orderBy: 'updatedAt_DESC',
    first: limit,
  })

  return {
    data,
  }
}

const flattenNFT = async (data, chain) => {
  if (!data?.nFTEntities.length) {
    return []
  }

  return await formatNFT(data.nFTEntities, chain)
}

export const useCarouselNftEvents = ({ type }: Types) => {
  const { data: dataStmn } = useChainEvents('ahk', type)
  const { data: dataBsx } = useChainEvents('bsx', type)
  const { data: dataSnek } = useChainEvents('snek', type)
  const { data: dataRmrk } = useChainEvents('rmrk', type)
  const { data: dataRmrk2 } = useChainEvents('ksm', type)

  const nfts = ref<CarouselNFT[]>([])

  // currently only support rmrk and snek
  // moonriver: https://github.com/kodadot/nft-gallery/issues/3891
  watch([dataStmn, dataBsx, dataSnek, dataRmrk, dataRmrk2], async () => {
    const ahkNfts = await flattenNFT(dataStmn.value, 'ahk')
    const bsxNfts = await flattenNFT(dataBsx.value, 'bsx')
    const snekNfts = await flattenNFT(dataSnek.value, 'snek')
    const rmrkNfts = await flattenNFT(dataRmrk.value, 'rmrk')
    const rmrk2Nfts = await flattenNFT(dataRmrk2.value, 'ksm')

    const data = [
      ...ahkNfts,
      ...bsxNfts,
      ...snekNfts,
      ...rmrkNfts,
      ...rmrk2Nfts,
    ]

    nfts.value = data.slice(0, 30)
  })

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
      const listOfRelatedNFTs = await formatNFT(
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
