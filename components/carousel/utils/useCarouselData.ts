import type { CarouselNFT } from '@/components/base/types'
import type { LastEvent } from '@/utils/types/types'
import type { RowSeries } from '@/components/series/types'

import { convertLastEventToNft } from '@/utils/carousel'
import { formatNFT } from '@/utils/carousel'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'

interface Types {
  type: 'latestSales' | 'newestList'
}

export const lastNftByEvent = ({ type }: Types) => {
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

  const handleResult = async ({ data }: { data: { events: LastEvent[] } }) => {
    const events = data.events.map(convertLastEventToNft)
    nfts.value = await formatNFT(events)
  }
  const nfts = ref<CarouselNFT[]>([])

  watch(data, () => {
    if (data.value) {
      handleResult({ data: data.value })
    }
  })

  return {
    nfts: computed(() => nfts.value),
  }
}

export const popularCollections = () => {
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'popularCollectionList',
    variables: {
      orderDirection: 'ASC',
      limit: 10,
      dateRange: '7 DAY',
      orderBy: 'volume',
    },
  })
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
    nfts: computed(() => nfts.value),
  }
}
