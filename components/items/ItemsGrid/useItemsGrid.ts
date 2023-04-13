import resolveQueryPath from '@/utils/queryPathResolver'
import { getDenyList } from '@/utils/prefix'
import { useSearchParams } from './utils/useSearchParams'
import { Ref } from 'vue'

import type { NFTWithMetadata } from '@/composables/useNft'

export function useFetchSearch({
  first,
  total,
  isFetchingData,
  resetSearch,
  isLoading,
}: {
  first: Ref<number>
  total: Ref<number>
  isFetchingData: Ref<boolean>
  isLoading: Ref<boolean>
  resetSearch: () => void
}) {
  const { $apollo } = useNuxtApp()
  const { client, urlPrefix } = usePrefix()
  const route = useRoute()

  const nfts = ref<NFTWithMetadata[]>([])

  const { searchParams } = useSearchParams()

  async function fetchSearch(
    page: number,
    loadDirection: 'up' | 'down' = 'down'
  ) {
    if (isFetchingData.value) {
      return false
    }
    isFetchingData.value = true

    const queryPath = client.value === 'ksm' ? 'chain-ksm' : client.value
    const query = await resolveQueryPath(queryPath, 'nftListWithSearch')
    const result = await $apollo.query({
      query: query.default,
      client: client.value,
      variables: {
        denyList: getDenyList(urlPrefix.value),
        orderBy: route.query.sort?.length
          ? route.query.sort
          : ['blockNumber_DESC'],
        search: searchParams.value,
        priceMin: Number(route.query.min),
        priceMax: Number(route.query.max),
        first: first.value,
        offset: (page - 1) * first.value,
      },
    })

    // handle results
    const { nFTEntities, nftEntitiesConnection } = result.data

    total.value = nftEntitiesConnection.totalCount

    if (loadDirection === 'up') {
      nfts.value = nFTEntities.concat(nfts.value)
    } else {
      nfts.value = nfts.value.concat(nFTEntities)
    }

    isFetchingData.value = false
    isLoading.value = false
    return true
  }

  watch(
    [
      () => route.query.sort,
      () => route.query.search,
      () => route.query.listed,
      () => route.query.min,
      () => route.query.max,
      () => route.query.owned,
      () => route.query.collection,
    ],
    () => {
      resetSearch()
    }
  )

  return {
    nfts,
    fetchSearch,
  }
}
