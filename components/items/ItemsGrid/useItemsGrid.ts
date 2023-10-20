import resolveQueryPath from '@/utils/queryPathResolver'
import { getDenyList } from '@/utils/prefix'
import isEqual from 'lodash/isEqual'
import { useSearchParams } from './utils/useSearchParams'
import { Ref } from 'vue'

import type { NFTWithMetadata, TokenEntity } from '@/composables/useNft'

import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'

import { useListingCartStore } from '@/stores/listingCart'
import { NFT, TokenId } from '@/components/rmrk/service/scheme'

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
  const { client, urlPrefix } = usePrefix()
  const { isAssetHub } = useIsChain(urlPrefix)
  const notCollectionPage = computed(
    () => route.name !== 'prefix-collection-id',
  )
  const useTokens = computed(() => isAssetHub.value && notCollectionPage.value)

  const route = useRoute()

  const items = ref<(NFTWithMetadata | TokenEntity)[]>([])
  const loadedPages = ref([] as number[])

  const { searchParams } = useSearchParams()

  interface FetchSearchParams {
    page?: number
    loadDirection?: 'up' | 'down'
    search?: { [key: string]: string | number }[]
  }

  const getSearchCriteria = (searchParams) => {
    const mapping = {
      currentOwner_eq: (value) => ({ owner: value }),
      issuer_eq: (value) => ({ issuer: value }),
      price_gt: (value) => ({ price_gt: Number(value) }),
      collection: (value) => ({ collections: value.id_in }),
      name_containsInsensitive: (value) => ({
        name: value,
      }),
    }

    return searchParams.reduce((acc, curr) => {
      for (const [key, value] of Object.entries(curr)) {
        if (mapping[key]) {
          Object.assign(acc, mapping[key](value))
        }
      }
      return acc
    }, {})
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
    const queryName = useTokens.value
      ? 'tokenListWithSearch'
      : 'nftListWithSearch'

    const getRouteQueryOrDefault = (query, defaultValue) => {
      return query?.length ? query : defaultValue
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
    const queryPath = getQueryPath(client.value)
    const defaultSearchVariables = {
      first: first.value,
      offset: (page - 1) * first.value,
      orderBy: getRouteQueryOrDefault(route.query.sort, ['blockNumber_DESC']),
    }

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
      : { ...defaultSearchVariables, ...nftQueryVariables }

    const query = await resolveQueryPath(queryPath, queryName)
    const { data: result } = await useAsyncQuery({
      query: query.default,
      variables: queryVariables,
      clientId: client.value,
    })

    // handle results
    const { entities, count } = getQueryResults(result.value)
    total.value = count

    if (!loadedPages.value.includes(page)) {
      if (loadDirection === 'up') {
        items.value = [...entities, ...items.value]
      } else {
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
    },
  )

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
  const { isCurrentOwner } = useAuth()
  const potentialNfts = nfts
    .filter((nft) => !Number(nft.price) && isCurrentOwner(nft.currentOwner))
    .map((nft) => {
      const floorPrice = nft.collection.floorPrice[0]?.price || '0'
      return nftToListingCartItem(nft, floorPrice)
    })

  listingCartStore.setUnlistedItems(potentialNfts)
}
