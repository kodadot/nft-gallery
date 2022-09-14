import type { CarouselNFT } from '@/components/base/types'
import type { LastEvent } from '@/utils/types/types'
import type { RowSeries } from '@/components/series/types'

import { convertLastEventFlatNft } from '@/utils/carousel'
import { formatNFT } from '@/utils/carousel'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import { sortItemListByIds } from '@/utils/sorting'

export const useCarouselUrl = () => {
  const { urlPrefix } = usePrefix()

  const profileUrl = computed(() => `${urlPrefix.value}-u-id`)

  const urlOf = ({ id, url }: { id: string; url: string }): string => {
    return `/${urlPrefix.value}/${url}/${id}`
  }

  return {
    profileUrl,
    urlOf,
  }
}

interface Types {
  type: 'latestSales' | 'newestList'
}

export const useCarouselNftEvents = ({ type }: Types) => {
  const variables = {
    latestSales: {
      limit: 10,
      event: 'BUY',
    },
    newestList: {
      limit: 10,
      event: 'LIST',
    },
  }
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'lastNftListByEvent',
    variables: variables[type],
  })
  const nfts = ref<CarouselNFT[]>([])

  const handleResult = async ({ data }: { data: { events: LastEvent[] } }) => {
    const events = data.events.map(convertLastEventFlatNft)
    nfts.value = await formatNFT(events)
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

  const handleResult = ({ data }) => {
    nfts.value = data.seriesInsightTable.map(
      (e: RowSeries): RowSeries => ({
        ...e,
        image: sanitizeIpfsUrl(e.image),
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
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'collectionEntityById',
    variables: {
      id: collectionId,
      nftId: $route.params.id,
    },
  })
  const nfts = ref<CarouselNFT[]>([])

  watch(data, async () => {
    if (data.value) {
      nfts.value = await formatNFT((data.value as Collections).collection?.nfts)
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
        const sortedNftList = sortItemListByIds(filteredNftsNullMeta, ids, 10)
        nfts.value = await formatNFT(sortedNftList)
      }
    }
  })

  return {
    nfts,
  }
}

// https://codesandbox.io/s/github/rcbyr/keen-slider-sandboxes/tree/v6/navigation-controls/scroll-wheel-controls/vue3?file=/src/App.vue
export const wheelControls = (slider) => {
  let touchTimeout
  let position
  let wheelActive

  function dispatch(event, name) {
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

  function wheelStart(event) {
    position = {
      x: event.pageX,
      y: event.pageY,
    }
    dispatch(event, 'ksDragStart')
  }

  function wheel(event) {
    dispatch(event, 'ksDrag')
  }

  function wheelEnd(event) {
    dispatch(event, 'ksDragEnd')
  }

  function eventWheel(event) {
    // horizontal scroll only
    if (event.deltaX !== 0) {
      event.preventDefault()
      if (!wheelActive) {
        wheelStart(event)
        wheelActive = true
      }
      wheel(event)
      clearTimeout(touchTimeout)
      touchTimeout = setTimeout(() => {
        wheelActive = false
        wheelEnd(event)
      }, 50)
    }
  }

  slider.on('created', () => {
    slider.container.addEventListener('wheel', eventWheel, {
      passive: false,
    })
  })
}
