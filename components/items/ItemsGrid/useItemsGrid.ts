import resolveQueryPath from '@/utils/queryPathResolver'
import { getDenyList } from '@/utils/prefix'
import isEqual from 'lodash/isEqual'
import { useSearchParams } from './utils/useSearchParams'
import { Ref } from 'vue'

import type { NFTWithMetadata, Stack } from '@/composables/useNft'

export type NFTStack = NFTWithMetadata & Stack

export type ItemsGridEntity = NFTWithMetadata | NFTStack

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

  const nfts = ref<ItemsGridEntity[]>([])
  const loadedPages = ref([] as number[])

  const { searchParams } = useSearchParams()

  interface FetchSearchParams {
    page?: number
    loadDirection?: 'up' | 'down'
    search?: { [key: string]: string | number }[]
  }

  async function fetchSearch({
    page = 1,
    loadDirection = 'down',
    search,
  }: FetchSearchParams) {
    if (isFetchingData.value) {
      return false
    }
    isFetchingData.value = true

    const getQueryPath = (prefix: string) => {
      switch (prefix) {
        case 'rmrk':
          return 'chain-rmrk'
        case 'ksm':
          return 'chain-ksm'

        default:
          return prefix
      }
    }
    const notCollectionPage = computed(
      () => route.name !== 'prefix-collection-id'
    )

    const variables = search?.length
      ? { search }
      : {
          search: searchParams.value,
          priceMin: Number(route.query.min),
          priceMax: Number(route.query.max),
        }

    const queryPathBase = getQueryPath(client.value)
    const usingTokenEntities = computed(
      () => notCollectionPage.value && queryPathBase === 'ahk'
    )

    const queryPath = usingTokenEntities.value ? 'chain-ahk' : queryPathBase

    const query = await resolveQueryPath(queryPath, 'nftListWithSearch')
    const result = await $apollo.query({
      query: query.default,
      client: client.value,
      variables: {
        ...variables,
        first: first.value,
        offset: (page - 1) * first.value,
        denyList: getDenyList(urlPrefix.value),
        orderBy: route.query.sort?.length
          ? route.query.sort
          : ['blockNumber_DESC'],
      },
    })
    const extractBaseName = (input: string): string => {
      const regex = / #\d+$/
      return input.replace(regex, '')
    }

    const handleToken = (token: any) => {
      const nfts = token.nfts.filter(({ burned }) => !burned)
      if (nfts.length <= 1) {
        // if there is only one nft, return it
        // if all nfts are burned, still return the first one,
        // it get's filtered out later
        return token.nfts[0]
      }

      return {
        ...nfts[0],
        name: extractBaseName(nfts[0].name),
        count: nfts.length,
        floorPrice: Math.min(
          ...nfts.map((nft) => Number(nft.price))
        ).toString(),
        nfts,
      }
    }

    // handle results
    const nftEntities = usingTokenEntities.value
      ? result.data.tokenEntities.map(handleToken)
      : result.data.nFTEntities
    const nftEntitiesConnection = usingTokenEntities.value
      ? result.data.tokenEntitiesConnection
      : result.data.nftEntitiesConnection

    total.value = nftEntitiesConnection.totalCount

    if (!loadedPages.value.includes(page)) {
      if (loadDirection === 'up') {
        nfts.value = nftEntities.concat(nfts.value)
      } else {
        nfts.value = nfts.value.concat(nftEntities)
      }
      loadedPages.value.push(page)
    }

    isFetchingData.value = false
    isLoading.value = false
    return true
  }

  function clearFetchResults() {
    nfts.value = []
    loadedPages.value = []
  }

  const refetch = (search?: { [key: string]: string | number }[]) => {
    clearFetchResults()
    fetchSearch({ search })
  }

  watch(
    [
      () => route.query.sort,
      () => route.query.search,
      () => route.query.listed,
      () => route.query.min,
      () => route.query.max,
      () => route.query.owned,
      () => route.query.collections,
    ],
    (currentQuery, prevQuery) => {
      if (isEqual(currentQuery, prevQuery)) {
        return
      }
      loadedPages.value = []
      resetSearch()
    }
  )

  return {
    nfts,
    fetchSearch,
    refetch,
    clearFetchResults,
  }
}
