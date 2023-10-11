import resolveQueryPath from '@/utils/queryPathResolver'
import { getDenyList } from '@/utils/prefix'
import isEqual from 'lodash/isEqual'
import { useSearchParams } from './utils/useSearchParams'
import { Ref } from 'vue'

import type { NFTWithMetadata, TokenEntity } from '@/composables/useNft'

import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'

import { isOwner as checkOwner } from '@/utils/account'
import { useListingCartStore } from '@/stores/listingCart'

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

  const route = useRoute()

  const nfts = ref<NFTWithMetadata[]>([])
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
    // Computed values
    const notCollectionPage = computed(
      () => route.name !== 'prefix-collection-id',
    )
    const useTokens = computed(
      () => isAssetHub.value && notCollectionPage.value,
    )
    const queryName = useTokens.value
      ? 'tokenListWithSearch'
      : 'nftListWithSearch'

    // Helper function to get search criteria for tokens
    const getSearchCriteria = (searchParams) => {
      return searchParams.reduce((acc, curr) => {
        for (const [key, value] of Object.entries(curr)) {
          switch (key) {
            case 'currentOwner_eq':
              acc['owner'] = value
              break
            case 'price_gt':
              acc['price_gt'] = Number(value)
              break
          }
        }
        return acc
      }, {})
    }

    // Helper function to get default or route query value
    const getRouteQueryOrDefault = (query, defaultValue) => {
      return query?.length ? query : defaultValue
    }

    const getQueryResults = (query) => {
      if (useTokens.value) {
        return {
          entites: query.tokenEntities,
          count: query.tokenEntityCount.totalCount,
        }
      }
      return {
        entites: query.nFTEntities,
        count: query.nftEntitiesConnection.totalCount,
      }
    }

    // Query path and variables
    const queryPath = getQueryPath(client.value)
    const defaultSearchVariables = {
      first: first.value,
      offset: (page - 1) * first.value,
      orderBy: getRouteQueryOrDefault(route.query.sort, ['blockNumber_DESC']),
    }

    const searchForToken = getSearchCriteria(searchParams.value)

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
    const { entites, count } = getQueryResults(result.value)
    total.value = count

    if (!loadedPages.value.includes(page)) {
      if (loadDirection === 'up') {
        nfts.value = entites.concat(nfts.value)
      } else {
        nfts.value = nfts.value.concat(entites)
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
    },
  )

  return {
    nfts,
    fetchSearch,
    refetch,
    clearFetchResults,
  }
}

export const updatePotentialNftsForListingCart = async (
  nfts: TokenEntity[],
) => {
  const listingCartStore = useListingCartStore()
  const { accountId } = useAuth()
  const potentialNfts = nfts
    .filter(
      (nft) =>
        !Number(nft.cheapest?.price) &&
        checkOwner(nft.cheapest?.currentOwner, accountId.value),
    )
    .map((nft) => {
      const floorPrice = nft.collection.floorPrice[0]?.price || '0'
      return nftToListingCartItem(nft.cheapest as any, floorPrice)
    })

  listingCartStore.setUnlistedItems(potentialNfts)
}
