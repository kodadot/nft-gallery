import isEqual from 'lodash/isEqual'
import type { Ref } from 'vue'
import {
  useItemsGridQueryParams,
  useSearchParams,
} from './utils/useSearchParams'
import { getDenyList } from '@/utils/prefix'
import type { NFTWithMetadata, TokenEntity } from '@/composables/useNft'
import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'
import { useListingCartStore } from '@/stores/listingCart'
import type { NFT, TokenId } from '@/types'
import { fetchOdaToken } from '@/services/oda'
import tokenListWithSearch from '@/queries/subsquid/general/tokenListWithSearch'
import nftListWithSearch from '@/queries/subsquid/general/nftListWithSearch'

const DEFAULT_RESET_SEARCH_QUERY_PARAMS = [
  'sort',
  'search',
  'listed',
  'min',
  'max',
  'owned',
  'collections',
]

const EXCLUDED_TOKEN_USE_PAGES = [
  'prefix-collection-id',
  'prefix-drops-id',
  'prefix-u-id',
  ...ATOMIC_SWAP_PAGES,
]

export function useFetchSearch({
  first,
  total,
  isFetchingData,
  resetSearch,
  isLoading,
  resetSearchQueryParams = DEFAULT_RESET_SEARCH_QUERY_PARAMS,
  fetchOnchainData = false,
}: {
  first: Ref<number>
  total: Ref<number>
  isFetchingData: Ref<boolean>
  isLoading: Ref<boolean>
  resetSearch: () => void
  resetSearchQueryParams?: string[]
  fetchOnchainData?: boolean
}) {
  const { client, urlPrefix } = usePrefix()
  const { isAssetHub } = useIsChain(urlPrefix)
  const route = useRoute()

  const useTokens = computed(
    () =>
      isAssetHub.value
      && !EXCLUDED_TOKEN_USE_PAGES.includes(route.name as string),
  )

  const items = ref<(NFTWithMetadata | TokenEntity)[]>([])
  const loadedPages = ref([] as number[])

  const { searchParams } = useSearchParams()
  const { searchBySn } = useItemsGridQueryParams()

  interface FetchSearchParams {
    page?: number
    loadDirection?: 'up' | 'down'
    search?: { [key: string]: string | number }[]
  }

  const hasBlockNumberSort = (items: string[]) =>
    ['blockNumber_DESC', 'blockNumber_ASC'].some(sort => items.includes(sort))

  const getSearchCriteria = (searchParams, reducer = {}) => {
    const mapping = {
      currentOwner_eq: value => ({ owner: value }),
      issuer_eq: value => ({ issuer: value }),
      price_gt: value => ({ price_gt: Number(value) }),
      collection: value => ({ collections: value.id_in }),
      name_containsInsensitive: value => ({
        name: value,
      }),
    }

    return searchParams.reduce((acc, curr) => {
      for (const [key, value] of Object.entries(curr)) {
        if (Array.isArray(value)) {
          return getSearchCriteria(value, acc)
        }

        if (mapping[key]) {
          Object.assign(acc, mapping[key](value))
        }
      }
      return acc
    }, reducer)
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

    const queryName = useTokens.value
      ? tokenListWithSearch
      : nftListWithSearch

    const getRouteQueryOrderByDefault = (query, defaultValue: string[]) => {
      query = [query].filter(Boolean).flat() as string[]
      let orderBy = query.length ? query : defaultValue
      if (searchBySn.value && !hasBlockNumberSort(query)) {
        orderBy = [...orderBy, 'blockNumber_ASC'].filter(
          o => o !== 'blockNumber_DESC',
        )
      }
      return orderBy
    }

    const getQueryResults = (query) => {
      if (useTokens.value) {
        return {
          entities: query.tokenEntities as TokenEntity[],
          count: query.tokenEntityCount.totalCount as number,
        }
      }
      return {
        entities: query.nFTEntities as NFTWithMetadata[],
        count: query.nftEntitiesConnection.totalCount as number,
      }
    }

    // Query path and variables

    const defaultSearchVariables = {
      first: first.value,
      offset: (page - 1) * first.value,
      orderBy: getRouteQueryOrderByDefault(route.query.sort, [
        'blockNumber_DESC',
      ]),
    }

    const isPriceSortActive = (sort?: string | null | (string | null)[]) => {
      if (!sort) {
        return false
      }
      const sortArray = Array.isArray(sort) ? sort : [sort]
      return sortArray.some(sortBy => (sortBy ?? '').includes('price'))
    }
    watch(
      () => route.query.sort,
      (newSort, oldSort) => {
        const priceSortHasBeenActivated
          = isPriceSortActive(newSort) && !isPriceSortActive(oldSort)
        if (priceSortHasBeenActivated && route.query.listed !== 'true') {
          route.query.listed = 'true'
        }
      },
    )

    const searchForToken = getSearchCriteria(
      search?.length ? search : searchParams.value,
    )

    const tokenQueryVariables = {
      ...searchForToken,
      denyList: getDenyList(urlPrefix.value),
      price_lte: Number(route.query.max) || undefined,
      price_gte: Number(route.query.min) || undefined,
    }

    const nftQueryVariables = search?.length
      ? { search }
      : {
          search: searchParams.value,
          priceMin: Number(route.query.min),
          priceMax: Number(route.query.max),
        }

    const queryVariables = useTokens.value
      ? { ...defaultSearchVariables, ...tokenQueryVariables }
      : { ...defaultSearchVariables, ...nftQueryVariables, orderBy: getRouteQueryOrderByDefault(route.query.sort, [
          'blockNumber_DESC',
          'sn_DESC',
        ]) }

    const { $apolloClient } = useNuxtApp()
    const { data: result } = await $apolloClient.query({
      query: queryName,
      variables: queryVariables,
      context: {
        endpoint: client.value,
      },
    })

    // handle results
    const { entities, count } = getQueryResults(result)
    total.value = count

    if (!loadedPages.value.includes(page)) {
      if (loadDirection === 'up') {
        items.value = [...entities, ...items.value]
      }
      else {
        items.value = [...items.value, ...entities]
      }
      loadedPages.value.push(page)
    }

    isFetchingData.value = false
    isLoading.value = false
    return true
  }

  function clearFetchResults() {
    items.value = []
    loadedPages.value = []
  }

  const refetch = (search?: { [key: string]: string | number }[]) => {
    clearFetchResults()
    fetchSearch({ search })
  }

  const resetSearchQueryParamsValues = computed(() =>
    Object.fromEntries(
      resetSearchQueryParams.map(key => [key, route.query[key]]),
    ),
  )

  watch(resetSearchQueryParamsValues, (currentQuery, prevQuery) => {
    if (isEqual(currentQuery, prevQuery)) {
      return
    }
    loadedPages.value = []
    resetSearch()
  })

  const processOnchainData = useDebounceFn(async () => {
    items.value = await Promise.all(items.value.map(async (item) => {
      if ('onchainData' in item && item.onchainData) {
        return item
      }

      if (item.sn && !isTokenEntity(item)) {
        const tokenData = await fetchOdaToken(urlPrefix.value, item.collection.id, item.sn)

        if (tokenData.metadata && tokenData.metadata_uri) {
          const odaItem = {
            ...item,
            name: tokenData.metadata?.name || item.meta.name,
            meta: {
              ...item.meta,
              name: tokenData.metadata?.name || item.meta.name,
              id: tokenData.metadata?.image || item.meta.id,
              image: tokenData.metadata?.image || item.meta.image,
              animationUrl: tokenData.metadata?.animation_url || item.meta.animationUrl,
            },
            onchainData: true,
          }

          return odaItem
        }
      }

      return {
        ...item,
        name: item.collection.name,
      }
    }))
  }, 500)

  watch(() => items.value.length, () => {
    if (isAssetHub.value && items.value.length && fetchOnchainData) {
      processOnchainData()
    }
  }, { immediate: true })

  return {
    items,
    fetchSearch,
    refetch,
    clearFetchResults,
    usingTokens: useTokens,
  }
}

export const updatePotentialNftsForListingCart = async (
  nfts: (NFT & TokenId)[],
) => {
  const listingCartStore = useListingCartStore()
  const { isCurrentAccount } = useAuth()
  const potentialNfts = nfts
    .filter(nft => isCurrentAccount(nft.currentOwner))
    .map((nft) => {
      const floorPrice = nft.collection.floorPrice[0]?.price || '0'
      return nftToListingCartItem(nft, floorPrice)
    })

  listingCartStore.setOwnedItems(potentialNfts)
}
